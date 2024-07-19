const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Middleware to authenticate the user using JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("Access denied. No token provided.");
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    // Use backend configuration to get JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token.", error);
    res.status(400).send("Invalid token.");
  }
};

// Middleware to check if the user is active
const checkUserActiveStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(403).send("Your account is not active.");
    }
    next();
  } catch (error) {
    console.error("Error checking user status:", error.message);
    res.status(400).send("Error checking user status.");
  }
};

// Middleware to check if the user owns the book
const checkBookOwnership = async (req, res, next) => {
  try {
    const bookId = req.params.id; // Assuming bookId is in the URL params
    const user = await User.findById(req.user.id);
    if (!user.books.includes(bookId)) {
      return res.status(403).send("You don't own this book.");
    }
    next();
  } catch (error) {
    console.error("Error checking book ownership:", error.message);
    res.status(400).send("Error checking book ownership.");
  }
};

// Middleware to authorize admin access
const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.admin) {
      console.log("Unauthorized. Admin access required.");
      return res.status(403).send("Unauthorized. Admin access required.");
    }
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(400).send("Authorization error.");
  }
};

// Hash the password
const hashPassword = async (password) => {
  const saltRounds = 3;
  return await bcrypt.hash(password, saltRounds);
};

// Compare passwords
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Check if user exists
const checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, token, {
    expiresIn: "1h",
  });
};

module.exports = {
  authenticate,
  checkUserActiveStatus,
  checkBookOwnership,
  authorizeAdmin,
  hashPassword,
  comparePassword,
  checkUserExists,
  generateToken,
};
