const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const ratingCtrl = require("../controllers/rating");
const commentCtrl = require("../controllers/comment");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

router.use(authenticate);

router.post("/:id/ratings", authenticate, ratingCtrl.rateThisBook);
router.get("/:id/ratings", authenticate, ratingCtrl.showTotalRating);

router.post("/:id/comments", authenticate, commentCtrl.addComment);
router.put("/comments/:id", authenticate, commentCtrl.editComment);
router.delete("/comments/:id", authenticate, commentCtrl.removeComment);

router.post("/add", authenticate, bookCtrl.addBookToUser);
router.post("/addToDatabase", authorizeAdmin, bookCtrl.addBookToDatabase);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id", authenticate, bookCtrl.getBookById);
router.put("/:id", authenticate, bookCtrl.updateBook);
router.delete("/:id", authorizeAdmin, bookCtrl.deleteBook);

module.exports = router;
