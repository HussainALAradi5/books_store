const Receipt = require("../models/receipt");
const User = require("../models/user");

// Controller function to fetch user receipts
const getUserReceipts = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user from authentication middleware

  try {
    // Fetch receipts for the user
    const receipts = await Receipt.find({ user: userId });

    res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching user receipts:", error);
    res.status(500).send("Error fetching user receipts.");
  }
};

// Automatically generate or update receipt for user on purchase
const generateReceipt = async (req, res, next) => {
  const { userId, books, totalPrice } = req.body;

  try {
    // Find an existing open receipt for the user
    let existingReceipt = await Receipt.findOne({
      user: userId,
      totalPrice: { $exists: false },
    });

    if (existingReceipt) {
      // Update existing receipt with new books and totalPrice
      existingReceipt.books.push(...books);
      existingReceipt.numberOfBooks += books.length;
      existingReceipt.totalPrice += totalPrice;
      await existingReceipt.save();
    } else {
      const newReceipt = new Receipt({
        user: userId,
        books: books,
        numberOfBooks: books.length,
        totalPrice: totalPrice,
      });

      await newReceipt.save();
    }

    await User.findByIdAndUpdate(userId, {
      $push: { receipts: existingReceipt._id },
    });

    next();
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).send("Error generating receipt.");
  }
};

module.exports = {
  getUserReceipts,
  generateReceipt,
};
