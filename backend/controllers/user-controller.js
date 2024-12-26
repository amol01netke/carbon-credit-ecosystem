const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require(`../models/user.js`);
const { hash } = require("crypto");

// //functions
// const isNameValid = (firstName, lastName) => {
// // The name should not contain any whitespaces and should consist of letters
// const nameRegex = /^[a-zA-Z]+$/;

// // Check if both first and last names match the regex
// return nameRegex.test(firstName) && nameRegex.test(lastName);
// };

// const isEmailValid = (email) => {
// const emailRegex = /^[^\s@]+@gmail\.com$/;
// return emailRegex.test(email) && email.length <= 30;
// };

// const isPasswordValid = (password) => {
// const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+{}|;:'",.<>?\/`~\\\[\]\-=]+$/;
// return (
//   passwordRegex.test(password) && password.length >= 6 && password.length <= 8
// );
// };

// const createToken = (id) => {
// return jwt.sign({ userId: id }, process.env.JWT_KEY || "cjhwebsite", {
//   expiresIn: "1h",
// });
// };

// const decodeToken = (token) => {
// const decodedToken = jwt.verify(token, process.env.JWT_KEY || "cjhwebsite", {
//   expiresIn: "1h",
// });

// return decodedToken.userId;
// };

// const refreshToken = async (req, res) => {
// try {
//   const token = req.headers.authorization.split(" ")[1];

//   const userId = decodeToken(token);

//   const newToken = createToken(userId);

//   res
//     .status(200)
//     .json({ message: "Token refreshed successfully!", newToken });
// } catch (error) {
//   res.status(500).json({ error: "Internal Server Error." });
// }
// };

// const checkTokenExpiry = async (req, res) => {
// try {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ error: "Token is missing" });
//   }

//   try {
//     const decodedToken = jwt.verify(
//       token,
//       process.env.JWT_KEY || "cjhwebsite",
//       {
//         expiresIn: "1h",
//       }
//     );

//     const expirationTime = decodedToken.exp * 1000;
//     const currentTime = Date.now();

//     res.status(200).json({ isExpired: currentTime > expirationTime });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error." });
//   }
// } catch (error) {
//   res.status(500).json({ error: "Internal Server Error." });
// }
// };

// //get
// const getUserProfile = async (req, res) => {
// try {
//   const token = req.headers.authorization.split(" ")[1];

//   const userId = decodeToken(token);

//   const user = await User.findOne({ _id: userId });

//   if (user) {
//     res.status(200).json(user);
//   } else {
//     return res.status(404).json({ error: "User not found." });
//   }
// } catch (error) {
//   console.log(error);
//   res.status(500).json({ error: "Internal Server Error." });
// }
// };

// const getUserProfileByUsername = async (req, res) => {
// try {
//   const username = req.params.username;

//   const email = `${username}@gmail.com`;
//   console.log(email);

//   const user = await User.findOne({ email });

//   if (user) {
//     console.log(user);
//     res.status(200).json(user);
//   } else {
//     return res.status(404).json({ error: "User not found." });
//   }
// } catch (error) {
//   res.status(500).json({ error: "Internal Server Error." });
// }
// };

//post
const loginUser = async (req, res) => {
try {
  const { username, password } = req.body;

  // if (!isEmailValid(email)) {
  //   return res.status(400).json({ error: "Please provide a valid email." });
  // }

  // if (!isPasswordValid(password)) {
  //   return res
  //     .status(400)
  //     .json({ error: "Password should be 6 to 8 characters." });
  // }

  const user = await User.findOne({ username });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    //const token = createToken(user._id);

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

const registerUser = async (req, res) => {
try {
  const { email, walletAddress, username, password } = req.body;

//   if (!isNameValid(firstName, lastName)) {
//     return res.status(400).json({ error: "Name cannot have whitespaces." });
//   }

//   if (!isEmailValid(email)) {
//     return res.status(400).json({ error: "Please enter a valid email." });
//   }

//   if (!isPasswordValid(password)) {
//     return res
//       .status(400)
//       .json({ error: "Password should be 6 to 8 characters." });
//   }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        walletAddress,
        username,
        password:hashedPassword,
    });

    // const token = createToken(user._id);

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

exports.loginUser = loginUser;
exports.registerUser = registerUser;
