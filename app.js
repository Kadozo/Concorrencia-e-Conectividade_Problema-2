//IMPORTANDO AS BIBLIOTECAS
const net = require("net");
const express = require("express");
const cors = require("cors");
const app = express();

//CONSTANTES DE ENDEREÇO
const _PORT = 8080;
const _IP = "26.91.70.227";

//ARRAY COM OS DADOS DOS SENSORES

let pacientes = [];
let amount = 10;
//-----------------------------------------------------------------------------------------------------------

//Lógica para o mqtt

//-----------------------------------------------------------------------------------------------------------

app.use(express.json());
app.use(cors());
//DECLARANDO AS ROTAS

app.get("/patients", (req, res) => {
  return res.json(selectPatients(pacientes, amount));
});

app.post("/filter", (req, res) => {
  amount = req.body.amount;
  return res.json({ message: "Quantidade alterada para " + amount });
});
//-------------------------------------------------------------------------------------------------------------

//INICIANDO SERVIDOR

app.listen(_PORT, _IP, () => {
  console.log("Servidor Iniciado em " + "http://" + _IP + ":" + _PORT + "/");
});

//---------------------------------------------------------------------------------------------------------------

//DECLARAÇÃO DE FUNÇÕES

function orderArray(pacientes) {
  quickSort(pacientes, 0, pacientes.length - 1);

  return pacientes;
}

function quickSort(vet, ini, fim) {
  let i = ini;
  let f = fim;
  let m = Math.floor((i + f) / 2);

  while (i < f) {
    while (vet[i].oxigen < vet[m].oxigen) i++;

    while (vet[f].oxigen > vet[m].oxigen) f--;

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
