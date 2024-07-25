const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const receiptCtrl = require("../controllers/receipt");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

// Public routes
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

// Middleware applied here will affect all routes below
router.use(authenticate);

// Admin routes
router.post("/requestAdmin", userCtrl.requestAdmin);
router.get("/requests", authorizeAdmin, userCtrl.getRequests);
router.put("/requests/:id/accept", authorizeAdmin, userCtrl.acceptRequest);
router.put("/requests/:id/reject", authorizeAdmin, userCtrl.rejectRequest);

// User profile and management
router.get("/profile", userCtrl.viewUserData);
router.put("/edit", userCtrl.edit);
router.delete("/:id", authorizeAdmin, userCtrl.delete);
router.get("/books", userCtrl.viewBooks);

// Route to fetch user receipts
router.get("/receipts", receiptCtrl.getUserReceipts);

module.exports = router;
