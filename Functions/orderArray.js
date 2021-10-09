/**
 * Recebe um Array.
 * Retorna um Array Ordenado.
 */

function orderArray(pacientes) {
  quickSort(pacientes, 0, pacientes.length - 1);

  return pacientes;
}

function quickSort(vet, ini, fim) {
  let i = ini;
  let f = fim;
  let m = Math.floor((i + f) / 2);

  while (i < f) {
    while (vet[i].priority > vet[m].priority) i++;

    while (vet[f].priority < vet[m].priority) f--;

    if (i <= f) {
      let temp = vet[i];
      vet[i] = vet[f];
      vet[f] = temp;
      i++;
      f--;
    }
  }

  if (f > ini) quickSort(vet, ini, f);

  if (i < fim) quickSort(vet, i, fim);
}

module.exports = orderArray;
