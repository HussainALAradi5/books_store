const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");
const ratingCtrl = require("../controllers/ratings");
const commentCtrl = require("../controllers/comments");
const receiptCtrl = require("../controllers/receipt");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getBookById);
router.get("/:id/ratings", ratingCtrl.showTotalRating);
router.use(authenticate);
router.get("/findByName", bookCtrl.findBookByName);

router.post("/:id/ratings", ratingCtrl.rateThisBook);

router.post("/:id/comments", commentCtrl.addComment);
router.put("/comments/:id", commentCtrl.editComment);
router.delete("/comments/:id", commentCtrl.removeComment);

router.post("/add", bookCtrl.addBookToUser, receiptCtrl.generateReceipt);

router.post("/addToDatabase", authorizeAdmin, bookCtrl.addBookToDatabase);
router.put("/:id", authorizeAdmin, bookCtrl.updateBook);
router.delete("/:id", authorizeAdmin, bookCtrl.deleteBook);

module.exports = router;
