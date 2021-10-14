const verifySituation = require("./verifySituation");
const getRandomInt = require("./getRandomInt");
/**
 * Recebe um inteiro (tendency) e uma string (Name).
 * Retorna uma string JSON com o  objeto Paciente com o name dado e com valores aleatórios baseados na tendency.
 */

function valoresSensores(tendency, name) {
  if (tendency == 1) {
    paciente = {
      name: name,
      tempCorp: getRandomInt(36, 39),
      freqResp: getRandomInt(9, 16),
      freqCard: getRandomInt(51, 102),
      presArt: getRandomInt(99, 100),
      oxigen: getRandomInt(91, 100),
      priority: 0,
      situation: "",
      fogId: 0,
    };
  } else {
    paciente = {
      name: name,
      tempCorp: getRandomInt(38, 41),
      freqResp: getRandomInt(15, 29),
      freqCard: getRandomInt(98, 129),
      presArt: getRandomInt(71, 100),
      oxigen: getRandomInt(83, 92),
      priority: 0,
      situation: "",
      fogId: 0,
    };
  }

  paciente = verifySituation(paciente);
  //retorna uma string JSON
  return JSON.stringify(paciente);
}

module.exports = valoresSensores;
