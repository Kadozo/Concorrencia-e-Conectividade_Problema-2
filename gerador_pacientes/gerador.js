const { Worker, isMainThread, workerData } = require("worker_threads");
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
    setInterval(() => {
      client.publish(
        "Sensores",
        valoresSensores(workerData.tendency, workerData.patientName)
      );
      console.log("Thread " + workerData.id + " - " + "Enviou dados ao Broker"); //Exibição de sucesso no envio dos dados
    }, 100 * getRandomInt(30, 70));
  });
}
