const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket Server Started on ws://localhost:8080");

const validators = new Set();
wss.on("connection", (ws) => {
    console.log("Validator Connected!");
    validators.add(ws);

    ws.on("close", () => {
        console.log("Validator Disconnected");
        validators.delete(ws);
    });
});

const notifyValidators = (metadata) => {
    console.log("Notifying Validators : ",metadata);
    validators.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ metadata }));
        }
    });
};

module.exports = { notifyValidators };
