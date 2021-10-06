//IMPORTANDO AS BIBLIOTECAS E FUNÇÕES
const express = require("express");
const cors = require("cors");
const selectPatients = require("./Functions/selectPatients");

//CONSTANTES DE ENDEREÇO
const _PORT = 8080;
const _IP = "26.91.70.227";

//ARRAY COM OS DADOS DOS SENSORES

let pacientes = [];
let amount = 10;
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
  return res.json({ message: "Quantidade alterada para " + amount });
});
//-------------------------------------------------------------------------------------------------------------

//INICIANDO SERVIDOR

app.listen(_PORT, _IP, () => {
  console.log("Servidor Iniciado em " + "http://" + _IP + ":" + _PORT + "/");
});

//---------------------------------------------------------------------------------------------------------------
