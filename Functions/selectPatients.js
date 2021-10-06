function selectPatients(pacientes, amount) {
  let selectedElements = [];
  if (amount > pacientes.length) {
    amount = pacientes.length;
  }
  for (let index = 0; index < amount; index++) {
    selectedElements.push(pacientes[index]);
  }
  return selectedElements;
}

module.exports = selectPatients;
