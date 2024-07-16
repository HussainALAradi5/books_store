const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Middleware to authenticate the user using JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("Access denied. No token provided.");
    return res.status(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("token:", token);
    next();
  } catch (error) {
    console.error("Invalid token.", error);
    res.status(400);
  }
};

// hash the password
const hashPassword = async (password) => {
  const saltRounds = 3;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`received password:${password} and hash:${hash}`);
  return hash;
};

// compare passwords(the one from the client with the one hashed from the server-side)
const comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  console.log(
    `this is the compare:\nreceived password:${password} and hash:${hash}`
  );
  return match;
};

const checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  console.log("is user exist?", user);
  return user ? true : false;
};

module.exports = {
  authenticate,
  hashPassword,
  comparePassword,
  checkUserExists,
};
