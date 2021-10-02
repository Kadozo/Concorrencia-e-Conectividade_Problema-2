const mqtt = require("mqtt");

var client = mqtt.connect("mqtt://localhost:1883"); //Conexão com o Broker (Moquitto)

client.on("connect", function () {
  //se inscreve no tópico Sensores
  client.subscribe("Sensores", function (err) {
    if (!err) {
      //exibe mensagem de sucesso
      console.log("Inscrito no tópico Sensores!");
    } else {
      //exibe o erro caso ocorra
      console.log(err.message);
    }
  });
});

client.on("message", function (topic, message) {
  // Printa a mensagem recebida
  console.log(JSON.parse(message.toString()));
});
