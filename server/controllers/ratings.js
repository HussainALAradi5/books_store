const Rating = require("../models/rating");
const Book = require("../models/book");

// Add a rating to a book
const rateThisBook = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    // Create a new rating document
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
  const { id } = req.params;

  try {
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
