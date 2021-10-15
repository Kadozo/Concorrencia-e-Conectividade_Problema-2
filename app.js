//IMPORTANDO AS BIBLIOTECAS E FUNÇÕES
const express = require("express");
const cors = require("cors");
const selectPatients = require("./Functions/selectPatients");
const net = require("net");
const timsort = require("timsort");
const compare = require("./Functions/compare");
//CONSTANTES DE ENDEREÇO
const _PORT = 8080;
const _IP = "127.0.0.1";

const TCP_PORT = 8000;
const TCP_IP = "127.0.0.1";

//DECLARAÇÃO DE VARIÁVEIS

let pacientes = [];
let amount = 10;
let clients = [];
let fogs = [];
let fixado = null;
const app = express();
app.use(express.json());
app.use(cors());
//-----------------------------------------------------------------------------------------------------------

//DECLARANDO AS ROTAS

app.get("/patients", (req, res) => {
  return res.json(selectPatients(pacientes, amount));
});

app.post("/filter", (req, res) => {
  amount = req.body.amount;

  let i, socket;
  let data = {
    type: "amount",
    amount: amount,
  };

  for (i in clients) {
    socket = clients[i];
    if (socket.writable) {
      socket.write(JSON.stringify(data));
    }
  }

  return res.json({ message: "Quantidade alterada para " + amount });
});

app.post("/fixedPatient", (req, res) => {
  let flag = true;
  let fogId = req.body.fogId;
  let name = req.body.name;
  let data = {
    type: "info",
    fogId: fogId,
    name: name,
  };

  for (i in clients) {
    socket = clients[i];
    if (socket.writable) {
      socket.write(JSON.stringify(data));
      socket.on("data", (message) => {
        try {
          let data = JSON.parse(message.toString());
          if (data.type == "fixado" && flag) {
            flag = false;
            fixado = data.fixedPatient;
            return res.json(fixado);
          }
        } catch (error) {
          data = message.toString().split(message.toString().length / 2 - 1);
          if (data.type == "fixado" && flag) {
            flag = false;
            fixado = data.fixedPatient;
            return res.json(fixado);
          }
        }
      });
    }
  }

  //fazer a fog se conectar diretamente ou esperar o retorno do paciente fixado
});

//-------------------------------------------------------------------------------------------------------------

//INICIANDO SERVIDOR HTTP

app.listen(_PORT, _IP, () => {
  console.log("Servidor Iniciado em " + "http://" + _IP + ":" + _PORT + "/");
});

//---------------------------------------------------------------------------------------------------------------

//SERVIDOR TCP

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
    try {
      data = JSON.parse(message.toString());
      if (data.type == "lista") {
        let fogPacientes = data.content;
        let match = false;
        let pos = 0;
        let aux = [];
        fogs.map((item, index) => {
          if (item.id == fogPacientes.id) {
            match = true;
            pos = index;
          }
        });
        if (!match) {
          fogs.push(fogPacientes);
        } else {
          fogs.splice(pos, 1, fogPacientes);
        }

        fogs.map((item) => {
          item.pacientes.map((item2) => {
            aux.push(item2);
          });
        });
        timsort.sort(aux, compare);
        pacientes = aux;
      }
    } catch (error) {
      data = message.toString().split(message.toString().length / 2 - 1);
      if (data.type == "lista") {
        let fogPacientes = data.content;
        let match = false;
        let pos = 0;
        let aux = [];
        fogs.map((item, index) => {
          if (item.id == fogPacientes.id) {
            match = true;
            pos = index;
          }
        });
        if (!match) {
          fogs.push(fogPacientes);
        } else {
          fogs.splice(pos, 1, fogPacientes);
        }

        fogs.map((item) => {
          item.pacientes.map((item2) => {
            aux.push(item2);
          });
        });
        timsort.sort(aux, compare);
        pacientes = aux;
      }
    }
  });
});

serverTCP.listen(TCP_PORT, TCP_IP);
