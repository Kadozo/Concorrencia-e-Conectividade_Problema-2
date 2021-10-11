//IMPORTANDO AS BIBLIOTECAS E FUNÇÕES
const express = require("express");
const cors = require("cors");
const selectPatients = require("./Functions/selectPatients");
const net = require("net");
const timsort = require("timsort");
const compare = require("./Functions/compare");
//CONSTANTES DE ENDEREÇO
const _PORT = 8080;
const _IP = "26.91.70.227";

const TCP_PORT = 8000;
const TCP_IP = "127.0.0.1";

//ARRAY COM OS DADOS DOS SENSORES

let pacientes = [];
let amount = 10;
let clients = [];
//-----------------------------------------------------------------------------------------------------------

//Lógica para o mqtt

//-----------------------------------------------------------------------------------------------------------
const app = express();
app.use(express.json());
app.use(cors());
//DECLARANDO AS ROTAS

app.get("/patients", (req, res) => {
  return res.json(selectPatients(pacientes, amount));
});

app.post("/filter", (req, res) => {
  amount = req.body.amount;

  let i, socket;
  for (i in clients) {
    socket = clients[i];
    if (socket.writable) {
      socket.write(amount);
    }
  }

  return res.json({ message: "Quantidade alterada para " + amount });
});
//-------------------------------------------------------------------------------------------------------------

//INICIANDO SERVIDOR HTTP

app.listen(_PORT, _IP, () => {
  console.log("Servidor Iniciado em " + "http://" + _IP + ":" + _PORT + "/");
});

//---------------------------------------------------------------------------------------------------------------

const serverTCP = net.createServer((socket) => {
  console.log("Novo cliente conectado!");

  clients.push(socket);

  socket.on("error", () => {
    console.log("Conexão abortada");
  });

  socket.on("end", () => {
    console.log("Cliente desconectado.");
  });

  socket.on("data", (message) => {
    let fogPacientes = JSON.parse(message.toString());
    //Lógica para a atualização do vetor de pacientes
    pacientes.concat();
  });
});

serverTCP.listen(TCP_PORT, TCP_IP);
