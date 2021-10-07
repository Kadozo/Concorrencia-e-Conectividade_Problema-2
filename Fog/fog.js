const { Worker, isMainThread, workerData, threadId } = require("worker_threads");
const order = require("../Functions/orderArray");
const mqtt = require("mqtt");
//----------------------------------------------------------------------------------------------------------------
let pacientes = [];
let connectionLmt = 10;
let fogId = process.argv[2]; 
let currentConnections = 0;
let currentThreadId = 0;
//----------------------------------------------------------------------------------------------------------------

const client = mqtt.connect("mqtt://localhost:1883"); //Conexão com o Broker (Moquitto)

if (isMainThread) {
    if(currentThreadId == 0){
        const worker = new Worker(__filename, {
            workerData: {
                threadId = currentThreadId,
            }
        })
    }
    client.subscribe("Fog/" + fogId +  "/Sensor/publish", (err)=>{
        if(!err){
            client.on("message", (msg)=>{
                if(msg == "Sensor conectado"){
                    if(currentConnections <= connectionLmt){
                        client.publish("Fog/" + fogId + "/connect", currentThreadId)

                    }
                    
                }
            });
        }
    });
}else{

}



