/**
 * Recebe dois inteiros min e max.
 * Retorna um Inteiro entre min e max.
 */

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = getRandomInt;
