const mqtt = require("mqtt");

var client = mqtt.connect("mqtt://localhost:1883"); //Conexão com o Broker (Moquitto

client.on("connect", function () {
  client.publish("Sensores", valoresSensores("Thiago"));
  client.end(); //Após publicar o cliente encerra a conexão
});

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
