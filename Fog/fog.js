const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
  threadId,
} = require("worker_threads");
const order = require("../Functions/orderArray");
const compare = require("../Functions/compare");
const timsort = require("timsort");
const mqtt = require("mqtt");
const net = require("net");
const selectedPatients = require("../Functions/selectPatients");
const getPatient = require("../Functions/getPatient");
const setPatientFogId = require("../Functions/setPatientFogId");

//----------------------------------------------------------------------------------------------------------------
let connectionLmt = 2;
let fogId = process.argv[2];
let currentConnections = 0;
let currentThreadId = 0;
let brokerAdress = "mqtt://localhost:1883";
let amount = 10;
const TCP_PORT = 8000;
const TCP_IP = "127.0.0.1";
let i = 0;
//----------------------------------------------------------------------------------------------------------------

if (isMainThread) {
  const socket = new net.Socket();
  socket.connect(TCP_PORT, TCP_IP, () => {
    console.log("Conectado ao TCP: " + TCP_IP + ":" + TCP_PORT);
  });

  socket.on("data", (message) => {
    let data = JSON.parse(message.toString());
    if (data.type == "amount") {
      amount = data.amount;
    } else if (data.type == "info") {
      if (data.fogId == fogId) {
        fixedPatient = getPatient(pacientes, data.name);
        socket.write(
          JSON.stringify({
            fixedPatient: fixedPatient,
            type: "fixado",
          })
        );
      }
    }
  });
  let pacientes = [];
  const client = mqtt.connect(brokerAdress); //Conexão com o Broker (Moquitto)
  if (currentThreadId == 0) {
    const worker = new Worker(__filename, {
      workerData: {
        threadId: currentThreadId,
        fogId: fogId,
      },
    });
    worker.on("message", (data) => {
      let match = false;
      for (let index = 0; index < data.length; index++) {
        for (let index2 = 0; index2 < pacientes.length; index2++) {
          if (data[index].name == pacientes[index2].name) {
            pacientes[index2] = data[index];
            match = true;
          }
        }
        if (!match) {
          pacientes.push(data[index]);
        }
      }
      timsort.sort(pacientes, compare);
      //Criar um indentificador das fogs para mandar pro servidor/ para que o servidor substitua o array específico
      socket.write(
        JSON.stringify({
          content: {
            id: fogId,
            pacientes: selectedPatients(pacientes, amount),
          },
          type: "lista",
        })
      );
      //Criar o servidor e a função de envio de informações, repassar os dados sempre que organizar e decidir o método de conexão.
    });
  }

  client.subscribe("Fog/" + fogId + "/Sensor/publish", () =>
    console.log("Fog " + fogId + " - Inscreveu")
  );
  client.on("message", (topic, msg) => {
    console.log("Fog " + fogId + " - Recebeu uma msg: " + msg);
    if (msg == "Sensor conectado") {
      if (currentConnections < connectionLmt) {
        currentConnections++;
        client.publish("Fog/" + fogId + "/connect", currentThreadId.toString());
      } else {
        //O else ta resetando a contagem, mas ele ainda realiza uma conexão e n incrementa a variavel de conexões
        currentThreadId++;
        currentConnections = 1; //Alterando para 1 resolve o problema e garante que n vai adicionar elementos a mais na thread
        const worker = new Worker(__filename, {
          workerData: {
            threadId: currentThreadId,
            fogId: fogId,
          },
        });
        client.publish("Fog/" + fogId + "/connect", currentThreadId.toString());
        worker.on("message", (data) => {
          let match = false;
          for (let index = 0; index < data.length; index++) {
            for (let index2 = 0; index2 < pacientes.length; index2++) {
              if (data[index].name == pacientes[index2].name) {
                pacientes[index2] = data[index];
                match = true;
              }
            }
            if (!match) {
              pacientes.push(data[index]);
            }
          }
          timsort.sort(pacientes, compare);
          socket.write(
            JSON.stringify({
              id: fogId,
              pacientes: selectedPatients(pacientes, amount),
            })
          );
        });
      }
    }
  });
} else {
  let pacientes = [];
  const client = mqtt.connect(brokerAdress);
  client.subscribe(
    "Fog/" + workerData.fogId + "/" + workerData.threadId + "/send",
    () =>
      console.log(
        "Thread " +
          workerData.threadId +
          " - Inscreveu em:" +
          "Fog/" +
          workerData.fogId +
          "/" +
          workerData.threadId +
          "/send"
      )
  );
  client.on("message", (topic, msg) => {
    let match = false;
    let pos = 0;
    let paciente = JSON.parse(msg.toString());
    paciente = setPatientFogId(paciente, workerData.fogId);
    pacientes.map((item, index) => {
      if (item.name == paciente.name) {
        match = true;
        pos = index;
      }
    });
    if (!match) {
      pacientes.push(paciente);
    } else {
      pacientes.splice(pos, 1, paciente);
    }
    pacientes = order(pacientes);
    parentPort.postMessage(pacientes);
  });
}
