function getPatient(patients, name) {
  let fixado;
  for (let index = 0; index < patients.length; index++) {
    if (patients[index].name == name) {
      fixado = patients[index];
    }
  }
  return fixado;
}

module.exports = getPatient;
