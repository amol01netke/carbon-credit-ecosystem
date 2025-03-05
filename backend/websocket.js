const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket Server Started on ws://localhost:8080");

// Store connected validators
const validators = new Set();

wss.on("connection", (ws) => {
    console.log("Validator Connected!");
    validators.add(ws);

    ws.on("close", () => {
        console.log("Validator Disconnected");
        validators.delete(ws);
    });
});

// Function to send evidence CID to all connected validators
const notifyValidators = (cid1,cid2) => {
    console.log("Notifying Validators of New CID:", cid1,cid2);
    validators.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ cid1,cid2 }));
        }
    });
};

// Export the function so we can call it from the file upload route
module.exports = { notifyValidators };
