const WebSocket = require("ws");
const mongoose = require("mongoose");
const Evidence = require("./models/evidence"); // Import Evidence model

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.peteh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("Connected to MongoDB")).catch(err => console.error("MongoDB Connection Error!"));

const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket Server Started on ws://localhost:8080");

// WebSocket Connection
wss.on("connection", (ws) => {
    console.log("🔗 Validator Connected!");

    const changeStream = Evidence.watch();

    changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
            const newEvidence = change.fullDocument;
            console.log("New Evidence Uploaded:", newEvidence);

            ws.send(JSON.stringify({
                cid: newEvidence.cid,
            }));
        }
    });

    // Handle WebSocket Disconnection
    ws.on("close", () => {
        console.log("❌ Validator Disconnected");
        changeStream.close(); // Close MongoDB change stream
    });
});
