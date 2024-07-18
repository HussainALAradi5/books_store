const Book = require("../models/book");
const User = require("../models/user");

const addBookToUser = async (req, res) => {
  try {
    const { title, author, publishYear, price, description, poster } = req.body;
    const newBook = new Book({
      title,
      author,
      publishYear,
      price,
      description,
      poster,
    });
    await newBook.save();

    // Add the book to the user's books array
    const userId = req.user.id; // Assuming you have userId in the req.user from authentication middleware
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res.status(404);
    }
    user.books.push(newBook._id);
    await user.save();

    res.status(201).send(newBook);
  } catch (error) {
    console.error("Error adding book to user:", error.message);
    res.status(400);
  }
};

const addBookToDatabase = async (req, res) => {
  try {
    const { title, author, publishYear, price, description, poster } = req.body;
    const newBook = new Book({
      title,
      author,
      publishYear,
      price,
      description,
      poster,
    });
    await newBook.save();
    res.status(201).send(newBook);
  } catch (error) {
    console.error("Error adding book to database:", error.message);
    res.status(400);
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(400);
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      console.log("Book not found.");
      return res.status(404);
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(400);
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, publishYear, price, description, poster } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear, price, description, poster },
      { new: true }
    );
    if (!updatedBook) {
      console.log("Book not found.");
      return res.status(404);
    }
    res.status(200).send(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(400);
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      console.log("Book not found.");
      return res.status(404);
    }
    res.status(200);
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(400);
  }
};

module.exports = {
  addBookToUser,
  addBookToDatabase,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
