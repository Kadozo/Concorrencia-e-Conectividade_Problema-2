const verifySituation = require("./verifySituation");
const getRandomInt = require("./getRandomInt");

function valoresSensores(tendency, name) {
  if (tendency == 1) {
    paciente = {
      name: name,
      tempCorp: getRandomInt(36, 39),
      freqResp: getRandomInt(9, 16),
      freqCard: getRandomInt(51, 102),
      presArt: getRandomInt(99, 100),
      oxigen: getRandomInt(91, 100),
      situation: "",
    };
  } else {
    paciente = {
      name: name,
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

module.exports = valoresSensores;
