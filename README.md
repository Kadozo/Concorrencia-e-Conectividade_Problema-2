# Concorrencia-e-Conectividade_Problema-2
Repositório destinado a resolução do problema 2 da disciplina MI Concorrência e Conectividade

# Concorrência e Conectividade Problema 2


## Requisitos para roda a solução

Para roda a solução é necessário o gerenciador de dependências  **NPM**  e o software  **Node.Js**

## Instalando as Dependências

Após baixar o conteúdo dos dois repositórios:  [Back-Concorrencia e Conectividade Problema 2](https://github.com/Kadozo/Concorrencia-e-Conectividade_Problema-2.git)  e  [Front-Concorrencia e Conectividade Problema 1](https://github.com/Kadozo/Front-Concorrencia_e_Conectividade_Problema-1.git)

É necessário utilizar o comando, nas duas pastas raízes (de cada repositório)

> npm install

Para instalar todas as dependências do projeto.

## Iniciando a interface do médico

Para iniciar a interface do médico é necessário, na pasta raiz, digitar os comandos

> npm run build

E em seguida:

> npm run start

A aplicação iniciará na porta 3000

## Arquivos de Servidor, Paciente e fog

Os arquivos do repositório  [Back-Concorrencia e Conectividade Problema 2](https://github.com/Kadozo/Concorrencia-e-Conectividade_Problema-2.git)  dizem respeito ao servidor, e ao simulador de sensores, e as fogs respectivamente os arquivos:  **App.js**  e  **Gerador.js ** e **Fog.js**

para inicia-los, basta digitar o comando do node:

> node app.js

para iniciar o servidor

>node fog.js [id_fog]

para iniciar a fog, o id_fog diz respeito a o valor do id que a fog que está sendo iniciada terá, isso será importante para o gerador, para que os devices simulados conectem em uma ou outra fog. 
> node gerador.js [quantidade] [tendência]

para iniciar o gerador de sensores, a quantidade diz respeito a quantas instâncias serão criadas, e , a tendência de respeito se os pacientes serão criados com a tendência **Estável** ou **Grave**, passando **1** ou **0** respectivamente.


**OBS:** É necessário passar alterar no código, o campo **fogId** do gerador para que  os pacientes se conectem a aquela fog específica.

