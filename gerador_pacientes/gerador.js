const {
  Worker,
  isMainThread,
  workerData,
  threadId,
} = require("worker_threads");
const getRandomInt = require("../Functions/getRandomInt");
const valoresSensores = require("../Functions/valoresSensores");
const random_name = require("node-random-name");
const mqtt = require("mqtt");
//----------------------------------------------------------------------------------------------------------------
let tendency = 0;
//----------------------------------------------------------------------------------------------------------------

if (isMainThread) {
  //criação de Threads
  tendency = process.argv[3];
  for (let index = 0; index < process.argv[2]; index++) {
    const worker = new Worker(__filename, {
      workerData: {
        id: index + 1,
        fogId: index % 2,
        threadId: "0",
        tendency: tendency,
        patientName: random_name(),
      },
    });
  }
} else {
  //Cada Thread se conecta com o Broker (mosquitto)
  const client = mqtt.connect("mqtt://localhost:1883"); //Conexão com o Broker (Moquitto)

  client.on("connect", function () {
    console.log("Thread " + workerData.id + " - " + "Conectado ao Broker"); //Exibição de sucesso na conexão

    client.subscribe("Fog/" + workerData.fogId + "/connect", (err) => {
      if (!err) {
        client.publish(
          "Fog/" + workerData.fogId + "/Sensor/publish",
          "Sensor conectado"
        );
      }
    });

    client.on("message", (topic, msg) => {
      client.unsubscribe(topic);

      workerData.threadId = msg.toString();
      console.log(
        "Thread " +
          " - Publicar em: " +
          "Fog/" +
          workerData.fogId +
          "/" +
          workerData.threadId +
          "/send"
      );
      setInterval(() => {
        client.publish(
          "Fog/" + workerData.fogId + "/" + workerData.threadId + "/send",
          valoresSensores(workerData.tendency, workerData.patientName)
        );
      }, 2000);
    });
  });
}
