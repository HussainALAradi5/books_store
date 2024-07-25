const Rating = require("../models/rating");
const Book = require("../models/book");
const User = require("../models/user");

// Add a rating to a book
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

      // Update the Book's ratings array to reflect the updated rating
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
  console.log(`Calculating total ratings for book ID ${bookId}`);

  try {
    const totalRatings = await Rating.aggregate([
      { $match: { book: bookId } },
      { $group: { _id: null, total: { $sum: "$rating" }, count: { $sum: 1 } } },
      { $project: { _id: 0, total: 1, count: 1 } },
    ]);

    console.log(`Total ratings data: ${JSON.stringify(totalRatings)}`);

    if (totalRatings.length === 0) {
      return { totalRatings: 0, count: 0 };
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

  console.log(`Fetching total rating for book ID ${id}`);

  try {
    // Check if the book exists
    const book = await Book.findById(id);
    if (!book) {
      console.error("Book not found.");
      return res.status(404).send("Book not found.");
    }

    // Get total ratings and count using the helper function
    const { totalRatings, count } = await getTotalRatingData(id);

    res.status(200).json({ totalRatings, count });
  } catch (error) {
    console.error("Error calculating total rating:", error.message);
    res.status(400).send("Error calculating total rating.");
  }
};

// Calculate and show average rating for a book
const showAverageRating = async (req, res) => {
  const { id } = req.params; // Book ID

  console.log(`Fetching average rating for book ID ${id}`);

  try {
    // Get total ratings and count using the helper function
    const { totalRatings, count } = await getTotalRatingData(id);

    // Calculate average rating
    const averageRating = count > 0 ? totalRatings / count : 0; // Handle division by zero

    console.log(`Average rating: ${averageRating}`);
    res.status(200).json({ averageRating });
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
