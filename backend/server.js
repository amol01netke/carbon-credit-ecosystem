const express = require("express");
const server = express();
const mongoose = require("mongoose");

//middleware
const bodyParser=require("body-parser");
const cors = require("cors");

//ipfs
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//controllers
const userController = require("./controllers/user-controller");
const ipfsHandler=require("./handlers/IPFSHandler");

server.use(bodyParser.json());
server.use(cors());

//login
server.post("/api/login-generator", userController.loginGenerator);
server.post("/api/login-consumer", userController.loginConsumer);
server.post("/api/login-validator", userController.loginValidator);

//registration
server.post("/api/register-generator", userController.registerGenerator);
server.post("/api/register-consumer", userController.registerConsumer);
server.post("/api/register-validator", userController.registerValidator);

//upload evidence
server.post("/api/upload-soil-evidence",upload.single("file"),ipfsHandler.uploadSoilEvidence);
server.post("/api/upload-afforestation-evidence",ipfsHandler.uploadAfforestationEvidence);

//verify evidence
server.post("/api/verify-soil-evidence",ipfsHandler.verifySoilEvidence);
server.post("/api/verify-afforestation-evidence",ipfsHandler.verifyAfforestationEvidence);

//connect with database and start the server
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.peteh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
  .then(() => {
    console.log(`MongoDB connection established!`);
    server.listen(8000, () => {
      console.log(`Server is running on port 8000...`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed!`);
    console.log(error.message);
});
