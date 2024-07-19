const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");
const ratingCtrl = require("../controllers/ratings");
const commentCtrl = require("../controllers/comments");
const receiptCtrl = require("../controllers/receipt");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
router.get("/", bookCtrl.getAllBooks);
router.use(authenticate);

// Book routes
router.post("/:id/ratings", ratingCtrl.rateThisBook);
router.get("/:id/ratings", ratingCtrl.showTotalRating);

router.post("/:id/comments", commentCtrl.addComment);
router.put("/comments/:id", commentCtrl.editComment);
router.delete("/comments/:id", commentCtrl.removeComment);

// Add book to user's collection and generate receipt
router.post("/add", bookCtrl.addBookToUser, receiptCtrl.generateReceipt); // Handles adding book and receipt generation

// Admin routes for managing books
router.post("/addToDatabase", authorizeAdmin, bookCtrl.addBookToDatabase);

router.get("/:id", bookCtrl.getBookById);
router.put("/:id", bookCtrl.updateBook);
router.delete("/:id", authorizeAdmin, bookCtrl.deleteBook);

module.exports = router;
