const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Generate a JWT secret if it doesn't exist
const generateJwtSecret = () => {
  return process.env.JWT_SECRET;
};

// Middleware to authenticate the user using JWT
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    console.error(
      JSON.stringify({
        action: "authenticate",
        message: "Access denied. No token provided.",
      })
    );
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const secret = generateJwtSecret();
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      JSON.stringify({
        action: "authenticate",
        message: "Invalid token.",
        error: error.message,
      })
    );
    res.status(400).send("Invalid token.");
  }
};

// Middleware to check if the user is active
const checkUserActiveStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isActive) {
      console.error(
        JSON.stringify({
          action: "checkUserActiveStatus",
          message: "User account is not active.",
        })
      );
      return res.status(403).send("Your account is not active.");
    }

    next();
  } catch (error) {
    console.error(
      JSON.stringify({
        action: "checkUserActiveStatus",
        message: "Error checking user status.",
        error: error.message,
      })
    );
    res.status(400).send("Error checking user status.");
  }
};

// Middleware to check if the user owns the book
const checkBookOwnership = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const user = await User.findById(req.user.id);

    if (!user.books.includes(bookId)) {
      console.error(
        JSON.stringify({
          action: "checkBookOwnership",
          message: "User does not own the book.",
        })
      );
      return res.status(403).send("You don't own this book.");
    }

    next();
  } catch (error) {
    console.error(
      JSON.stringify({
        action: "checkBookOwnership",
        message: "Error checking book ownership.",
        error: error.message,
      })
    );
    res.status(400).send("Error checking book ownership.");
  }
};

// Middleware to authorize admin access
const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.admin) {
      console.error(
        JSON.stringify({
          action: "authorizeAdmin",
          message: "Unauthorized. Admin access required.",
        })
      );
      return res.status(403).send("Unauthorized. Admin access required.");
    }

    next();
  } catch (error) {
    console.error(
      JSON.stringify({
        action: "authorizeAdmin",
        message: "Authorization error.",
        error: error.message,
      })
    );
    res.status(400).send("Authorization error.");
  }
};

// Hash the password
const hashPassword = async (password) => {
  const saltRounds = 3;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Compare passwords
const comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

// Check if user exists
const checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  const exists = !!user;
  return exists;
};

// Generate a JWT token
const generateToken = (user) => {
  const secret = generateJwtSecret();
  const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "1h",
  });
  return token;
};

// Get Authorization headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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
  getAuthHeaders,
};
