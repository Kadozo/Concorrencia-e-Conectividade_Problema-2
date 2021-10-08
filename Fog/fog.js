const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");
const order = require("../Functions/orderArray");
const mqtt = require("mqtt");
//----------------------------------------------------------------------------------------------------------------
let connectionLmt = 1;
let fogId = process.argv[2];
let currentConnections = 0;
let currentThreadId = 0;
let brokerAdress = "mqtt://localhost:1883";
let amount = 0;
//----------------------------------------------------------------------------------------------------------------

if (isMainThread) {
  let trava = false;
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
            console.log("data antes: ", data[index]);
            console.log("Pacientes antes: ", pacientes[index2]);
            pacientes[index2] = data[index];
            console.log("Pacientes depois: ", pacientes);
            match = true;
          }
        }
        if (!match) {
          pacientes.push(data[index]);
        }
      }
    });
  }

  client.subscribe("Fog/" + fogId + "/Sensor/publish", () =>
    console.log("Fog " + fogId + " - Inscreveu")
  );
  client.on("message", (topic, msg) => {
    console.log("Fog " + fogId + " - Recebeu uma msg: " + msg);
    if (msg == "Sensor conectado") {
      while (trava) {}
      trava = true;
      if (currentConnections < connectionLmt) {
        currentConnections++;
        client.publish("Fog/" + fogId + "/connect", currentThreadId.toString());
      } else {
        currentThreadId++;
        currentConnections = 0;
        const worker = new Worker(__filename, {
          workerData: {
            threadId: currentThreadId,
            fogId: fogId,
          },
        });
        client.publish("Fog/" + fogId + "/connect", currentThreadId.toString());
        worker.on("message", (data) => {
          console.log("Message");
          for (let index = 0; index < data.length; index++) {
            for (let index2 = 0; index2 < pacientes.length; index2++) {
              if (data[index].name == pacientes[index2].name) {
                console.log("data antes: ", data[index]);
                console.log("Pacientes antes: ", pacientes[index2]);
                pacientes[index2] = data[index];
                console.log("Pacientes depois: ", pacientes);
              }
            }
          }
        });
      }
      trava = false;
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
