const express = require("express");
const server = express();
const mongoose = require("mongoose");

//middleware
const bodyParser=require("body-parser");
const cors = require("cors");

server.use(bodyParser.json());
server.use(cors());

//controllers
const userController = require("./controllers/user-controller");

//post
server.post("/api/login", userController.loginUser);
server.post("/api/register", userController.registerUser);

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
