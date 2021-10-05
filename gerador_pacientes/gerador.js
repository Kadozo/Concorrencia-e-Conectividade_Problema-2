const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

const random_name = require('node-random-name');

const mqtt = require("mqtt");

let tendency = 0;

if (isMainThread) {
  //criação de (5) Threads
  for (let index = 0; index < process.argv[2]; index++) {
    tendency = process.argv[3];
    const worker = new Worker(__filename, { workerData: {id: index + 1, tendency: tendency}});
  }
} else {
  //Cada Thread se conecta com o Broker (mosquitto)
  const client = mqtt.connect("mqtt://localhost:1883"); //Conexão com o Broker (Moquitto)

  client.on("connect", function () {
    console.log("Thread " + workerData.id + " - " + "Conectado ao Broker"); //Exibição de sucesso na conexão
  });

  setInterval(() => {
    client.publish("Sensores", valoresSensores(workerData.tendency));
    console.log("Thread " + workerData.id + " - " + "Enviou dados ao Broker"); //Exibição de sucesso no envio dos dados
  }, 100 * getRandomInt(30, 70));
}

function valoresSensores(tendency) {
  if(tendency == 1){
    paciente = {
      name: random_name(),
      tempCorp: getRandomInt(36, 39),
      freqResp: getRandomInt(9, 16),
      freqCard: getRandomInt(51, 102),
      presArt: getRandomInt(99, 100),
      oxigen: getRandomInt(91, 100),
      situation: "",
    };
  } else{
    paciente = {
      name: random_name(),
      tempCorp: getRandomInt(38, 41),
      freqResp: getRandomInt(15, 29),
      freqCard: getRandomInt(98, 129),
      presArt: getRandomInt(71, 100),
      oxigen: getRandomInt(83, 92),
      situation: "",
    };
  }

  paciente = verifySituation(paciente);
  //retorna uma string JSON
  return JSON.stringify(paciente);
}

//Retorna um Inteiro entre dois números
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function verifySituation(paciente) {
  i = 0;
  if(paciente.tempCorp > 38){
    i++;
  }
  if (paciente.freqResp > 20 ) {
    i++;
  }
  if (paciente.freqCard > 110) {
    i++;
  }
  if (paciente.presArt < 72) {
    i++;
  }
  if (paciente.oxigen < 92) {
    i += 3;
  }

  if (i >= 3 ) {
    paciente.situation = "Grave";
  } else {
    paciente.situation = "Estável"
  }

  return paciente;
}
