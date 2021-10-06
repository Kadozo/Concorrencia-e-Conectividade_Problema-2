/*
Verifica um Paciente através dos parametros dos sensores (TemperaturaCorporal, Frequencia Respiratória, 
    Frequência Cardiáca, Pressão Arterial e Oxigenação) e retorna o objeto paciente com o campo situation 
    preenchido de acordo
*/
function verifySituation(paciente) {
  i = 0;
  if (paciente.tempCorp > 38) {
    i++;
  }
  if (paciente.freqResp > 20) {
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

  if (i >= 3) {
    paciente.situation = "Grave";
  } else {
    paciente.situation = "Estável";
  }

  return paciente;
}

module.exports = verifySituation;
