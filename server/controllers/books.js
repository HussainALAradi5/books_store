const Book = require("../models/book");
const User = require("../models/user");

const addBookToUser = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res.status(404).send("User not found.");
    }

    if (user.books.includes(bookId)) {
      return res.status(409).send({ message: "You already have this book." });
    }

    user.books.push(bookId);
    await user.save();

    res.status(201).send({ message: "Book purchased successfully." });
  } catch (error) {
    console.error("Error adding book to user:", error.message);
    res.status(400).send("Error adding book to user.");
  }
};
const findBookByName = async (req, res) => {
  const { name } = req.query; // Assuming you're sending the book name as a query parameter

  try {
    const book = await Book.findOne({ title: name });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error finding book:", error.message);
    res.status(400).send("Error finding book.");
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
    res.status(400).send("Error adding book to database.");
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(400).send("Error fetching books.");
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      console.log("Book not found.");
      return res.status(404).send("Book not found.");
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(400).send("Error fetching book.");
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
      return res.status(404).send("Book not found.");
    }
    res.status(200).send(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(400).send("Error updating book.");
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      console.log("Book not found.");
      return res.status(404).send("Book not found.");
    }
    res.status(200).send("Book deleted successfully.");
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(400).send("Error deleting book.");
  }
};

module.exports = {
  addBookToUser,
  addBookToDatabase,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  findBookByName,
};
