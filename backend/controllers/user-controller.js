const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Generator = require(`../models/generator.js`);
const Consumer = require(`../models/consumer.js`);
const Validator = require(`../models/validator.js`);
const { hash } = require("crypto");

//LOGIN
const loginGenerator = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Generator.findOne({ username });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password." });
      }

      res.status(200).json({
        message: "User logged in successfully!",
      });
    } else {
      return res.status(404).json({ error: "Email is not registered." });
    }
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const loginConsumer = async (req, res) => {
  try {
    const { username, password } = req.body;
  
    const user = await Consumer.findOne({ username });
  
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password." });
      }
  
      res.status(200).json({
        message: "User logged in successfully!",
      });
    } else {
      return res.status(404).json({ error: "Email is not registered." });
    }
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const loginValidator = async (req, res) => {
  try {
    const { username, password } = req.body;
  
    const user = await Validator.findOne({ username });
  
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password." });
      }
  
      res.status(200).json({
        message: "User logged in successfully!",
      });
    } else {
      return res.status(404).json({ error: "Email is not registered." });
    }
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//REGISTRATION
const registerGenerator = async (req, res) => {
  try {
    const { firstName,lastName, email, username, password } = req.body;

    const existingUser = await Generator.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Generator.create({
          firstName,
          lastName,
          email,
          username,
          password:hashedPassword,
      });

      return res.status(201).json({
        message: "User registered successfully!",
      });
    } else {
      return res.status(400).json({ error: "Email is already registered." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const registerConsumer = async (req, res) => {
  try {
    const { firstName,lastName, email, username, password } = req.body;

    const existingUser = await Consumer.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Consumer.create({
          firstName,
          lastName,
          email,
          username,
          password:hashedPassword,
      });

      return res.status(201).json({
        message: "User registered successfully!",
      });
    } else {
      return res.status(400).json({ error: "Email is already registered." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

const registerValidator = async (req, res) => {
  try {
    const { firstName,lastName, email, username, password } = req.body;

    const existingUser = await Validator.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Validator.create({
          firstName,
          lastName,
          email,
          username,
          password:hashedPassword,
      });

      return res.status(201).json({
        message: "User registered successfully!",
      });
    } else {
      return res.status(400).json({ error: "Email is already registered." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.loginGenerator = loginGenerator;
exports.loginConsumer=loginConsumer;
exports.loginValidator=loginValidator;

exports.registerGenerator=registerGenerator;
exports.registerConsumer=registerConsumer;
exports.registerValidator=registerValidator;