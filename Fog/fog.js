const {
  Worker,
  isMainThread,
  workerData,
  threadId,
} = require("worker_threads");
const order = require("../Functions/orderArray");
const mqtt = require("mqtt");
//----------------------------------------------------------------------------------------------------------------
let pacientes = [];
let connectionLmt = 10;
let fogId = process.argv[2];
let currentConnections = 0;
let currentThreadId = 0;
let brokerAdress = "mqtt://localhost:1883";
let amount = 0;
//----------------------------------------------------------------------------------------------------------------

if (isMainThread) {
  const client = mqtt.connect(brokerAdress); //Conexão com o Broker (Moquitto)
  if (currentThreadId == 0) {
    new Worker(__filename, {
      workerData: {
        threadId: currentThreadId,
        fogId: fogId,
      },
    });
  }

  client.subscribe("Fog/" + fogId + "/Sensor/publish", () =>
    console.log("Fog " + fogId + " - Inscreveu")
  );
  client.on("message", (topic, msg) => {
    console.log("Fog " + fogId + " - Recebeu uma msg: " + msg);
    if (msg == "Sensor conectado") {
      if (currentConnections <= connectionLmt) {
        client.publish("Fog/" + fogId + "/connect", currentThreadId.toString());
        currentConnections++;
      } else {
        currentThreadId++;
        currentConnections = 0;
        console.log("antes");
        new Worker(__filename, {
          workerData: {
            threadId: currentThreadId,
            fogId: fogId,
          },
        });
        console.log("depois, " + "Fog/" + fogId + "/connect");
        client.publish("Fog/" + fogId + "/connect", currentThreadId.toString());
      }
    }
  });
} else {
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
    console.log("Mensagem recebida");
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
    console.log(pacientes, "Thread " + workerData.threadId);
  });
}
