// routes/user.js
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const auth = require("../middleware/auth");

// Register a new user
router.post("/register", userCtrl.register);

// Login user
router.post("/login", userCtrl.login);

// Edit user details
router.put("/edit", auth.authenticate, userCtrl.edit);

// Delete user (soft delete)
router.delete("/delete/:id", auth.authenticate, userCtrl.delete);

// Get user's books
router.get("/books", auth.authenticate, userCtrl.viewBooks);

// Purchase books (example route for buying books)
router.post(
  "/purchase",
  auth.authenticate,
  userCtrl.purchaseBooks,
  userCtrl.generateReceipt
);

// Get user receipts
router.get("/receipts", auth.authenticate, userCtrl.getUserReceipts);

// Make a user admin
router.post(
  "/admin",
  auth.authenticate,
  auth.authorizeAdmin,
  userCtrl.makeAdmin
);

module.exports = router;
