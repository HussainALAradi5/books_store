// controllers/rating.js
const Rating = require("../models/rating");
const Book = require("../models/book");
const User = require("../models/user");

// Add a rating to a book
const rateThisBook = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    // Check if the book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send("Book not found.");
    }

    // Check if the user owns the book
    const user = await User.findById(req.user.id);
    if (!user.books.includes(id)) {
      return res.status(403).send("You don't own this book.");
    }

    // Create a new rating in the DB
    const newRating = new Rating({
      book: id,
      user: req.user.id,
      rating,
    });

    await newRating.save();

    res.status(201).send("Rating added successfully.");
  } catch (error) {
    console.error("Error adding rating:", error.message);
    res.status(400).send("Error adding rating.");
  }
};

// Calculate and show total rating for a book
const showTotalRating = async (req, res) => {
  const { id } = req.params; // Book ID

  try {
    // Check if the book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send("Book not found.");
    }

    // Calculate total ratings for the book
    const totalRatings = await Rating.aggregate([
      { $match: { book: id } },
      { $group: { _id: null, total: { $sum: "$rating" }, count: { $sum: 1 } } },
      { $project: { _id: 0, total: 1, count: 1 } },
    ]);

    if (totalRatings.length === 0) {
      return res.status(404).send("No ratings found for this book.");
    }

    const { total, count } = totalRatings[0];
    const averageRating = total / count;

    res.status(200).json({ totalRatings: total, count, averageRating });
  } catch (error) {
    console.error("Error calculating total rating:", error.message);
    res.status(400).send("Error calculating total rating.");
  }
};

module.exports = {
  rateThisBook,
  showTotalRating,
};
