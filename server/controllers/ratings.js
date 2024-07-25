const Rating = require("../models/rating");
const Book = require("../models/book");
const mongoose = require("mongoose"); // To include the ObjectId

const rateThisBook = async (req, res) => {
  const { id } = req.params; // Book ID from URL
  const { rating } = req.body; // Rating from request body
  const userId = req.user.id; // Extract user ID from authenticated request

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating value" });
  }

  try {
    // Find book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if user has already rated this book
    const existingRating = await Rating.findOne({
      user: userId,
      book: book._id,
    });

    if (existingRating) {
      // Update existing rating if necessary
      existingRating.rating = rating;
      await existingRating.save();

      // Ensure the rating ID is in the book's ratings array
      if (!book.ratings.includes(existingRating._id)) {
        book.ratings.push(existingRating._id);
        await book.save();
      }

      return res.status(200).json({ message: "Rating updated successfully" });
    }

    // Create and save the new rating
    const newRating = new Rating({
      user: userId,
      book: book._id,
      rating,
    });

    await newRating.save();

    // Add the new rating to the Book's ratings array
    book.ratings.push(newRating._id);
    await book.save();

    res.status(201).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: "Failed to add rating" });
  }
};

const checkUserRating = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  try {
    // Find the rating for the specific user and book
    const rating = await Rating.findOne({ user: userId, book: bookId });

    // Send back the rating if found, otherwise null
    if (rating) {
      res.status(200).json({ rating: rating.rating });
    } else {
      res.status(200).json({ rating: null });
    }
  } catch (error) {
    console.error("Error checking user rating:", error.message);
    res.status(500).json({ error: "Failed to check user rating" });
  }
};

// Helper function to calculate total ratings and count
const getTotalRatingData = async (bookId) => {
  try {
    const totalRatings = await Rating.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: null, total: { $sum: "$rating" }, count: { $sum: 1 } } },
      { $project: { _id: 0, total: 1, count: 1 } },
    ]);

    if (totalRatings.length === 0) {
      return { total: 0, count: 0 };
    }

    return totalRatings[0];
  } catch (error) {
    console.error("Error fetching total rating data:", error.message);
    throw new Error(error.message);
  }
};

// Calculate and show total ratings for a book
const showTotalRating = async (req, res) => {
  const { id } = req.params; // Book ID

  try {
    // Check if the book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send("Book not found.");
    }

    // Get total ratings and count using the helper function
    const { total, count } = await getTotalRatingData(id);

    res.status(200).json({ totalRatings: total, count });
  } catch (error) {
    console.error("Error calculating total rating:", error.message);
    res.status(400).send("Error calculating total rating.");
  }
};

// Calculate and show average rating for a book
const showAverageRating = async (req, res) => {
  const { id } = req.params; // Book ID

  try {
    // Get total ratings and count using the helper function
    const { total, count } = await getTotalRatingData(id);

    // Ensure total and count are numbers
    const totalRatingsNumber = parseFloat(total) || 0;
    const countNumber = parseInt(count, 10) || 0;

    // Calculate average rating
    const averageRating =
      countNumber > 0 ? totalRatingsNumber / countNumber : 0; // Handle division by zero

    // Format average rating to 2 decimal places
    const formattedAverageRating = averageRating.toFixed(2);

    res.status(200).json({ averageRating: parseFloat(formattedAverageRating) });
  } catch (error) {
    console.error("Error calculating average rating:", error.message);
    res.status(400).send("Error calculating average rating.");
  }
};

module.exports = {
  rateThisBook,
  showTotalRating,
  showAverageRating,
  checkUserRating,
};
