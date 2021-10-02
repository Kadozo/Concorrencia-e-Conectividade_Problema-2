const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

const mqtt = require("mqtt");

if (isMainThread) {
  //criação de (5) Threads
  for (let index = 0; index < 5; index++) {
    const worker = new Worker(__filename, { workerData: index + 1 });
  }
} else {
  //Cada Thread se conecta com o Broker (mosquitto)
  const client = mqtt.connect("mqtt://localhost:1883"); //Conexão com o Broker (Moquitto)

  client.on("connect", function () {
    console.log("Thread " + workerData + " - " + "Conectado ao Broker"); //Exibição de sucesso na conexão
  });

  setInterval(() => {
    client.publish(valoresSensores("PacienteID: " + workerData));
    console.log("Thread " + workerData + " - " + "Enviou dados ao Broker"); //Exibição de sucesso no envio dos dados
  }, 100 * getRandomInt(30, 70));
}

function valoresSensores(name) {
  paciente = {
    name: name,
    freqCorp: getRandomInt(35, 38),
    freqResp: getRandomInt(50, 130),
    freqCard: getRandomInt(70, 100),
    presArt: getRandomInt(35, 40),
    oxigen: getRandomInt(85, 100),
    situation: "",
  };

  //retorna uma string JSON
  return JSON.stringify(paciente);
}

//Retorna um Inteiro entre dois números
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
