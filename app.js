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

const server = net.createServer((socket) => {
  console.log("Novo cliente conectado!");

  socket.on("end", () => {
    console.log("Cliente desconectado.");
  });

  socket.on("error", () => {
    console.log("Conexão abortada");
  });

  //função que será executada no momento que o servidor receber o dado
  socket.on("data", (message) => {
    message = verifySituation(JSON.parse(message)); // verifica se o paciente está estável ou grave
    let match = null;
    //percorre o array de pacientes para saber se deve atualizar ou criar um novo registro
    pacientes.map((paciente) => {
      if (paciente.name == message.name) {
        match = message;
      }
    });
    //se o paciente não tiver o nome no array, será criado o novo registro
    if (!match) {
      pacientes.push(message);
      orderArray(pacientes); //ordena o array por gravidade (oxigenação)
    }
    // se o paciente já estiver no array, os dados serão atualizados
    else {
      let pos;
      pacientes.map((paciente, index) => {
        //procura o index do paciente que terá os dados atualizados
        if (message.name == paciente.name) {
          pos = index;
        }
      });
      pacientes.splice(pos, 1, message); //substitui os dados do paciente

      orderArray(pacientes); //ordena o array por gravidade (oxigenação)
    }
  });
});

server.listen(8000, "26.91.70.227", () => {
  console.log("Servidor TCP iniciado em http://26.91.70.227:8000/");
}); //servidor escutando na porta 8000 (para receber as informações dos pacientes)

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

function verifySituation(paciente) {
  if (
    (paciente.freqCorp > 38 &&
      paciente.freqResp > 20 &&
      paciente.freqCard > 110 &&
      paciente.presArt < 72) ||
    paciente.oxigen < 92
  ) {
    paciente.situation = "Grave";
  } else {
    paciente.situation = "Estável";
  }

  return paciente;
}

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
