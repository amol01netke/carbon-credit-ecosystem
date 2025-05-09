const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket Server Started on ws://localhost:8080");

const users = new Set();
wss.on("connection", (ws) => {
    console.log("Socket Connected!");
    users.add(ws);

    ws.on("close", () => {
        console.log("Socket Disconnected");
        users.delete(ws);
    });
});

const notifyValidators = (address,value) => {
    console.log("NDVI request...");
    users.forEach((ws)=>{
        if(ws.readyState===WebSocket.OPEN){
            ws.send(JSON.stringify({type:"generator",address,value}));
        }
    });
};

const sendNftReq=(address,amount)=>{
    console.log("NFT request...");
    users.forEach((ws)=>{
        if(ws.readyState===WebSocket.OPEN){
            ws.send(JSON.stringify({type:"consumer",address,amount}));
        }
    });
}

module.exports = { notifyValidators , sendNftReq};