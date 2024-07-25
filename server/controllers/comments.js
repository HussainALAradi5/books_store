const Comment = require("../models/comment");

// Add Comment
const addComment = async (req, res) => {
  const { id: bookId } = req.params; // Extract book ID from URL
  const { comment } = req.body; // Extract comment from request body
  const userId = req.user._id; // Extract user ID from authenticated request
  console.log("comment:", comment);
  if (!comment) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    // Find book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Create and save the new comment
    const newComment = new Comment({
      userId,
      bookId: book._id,
      comment,
    });

    await newComment.save();

    // Optionally, you can add the new comment to the Book's comments array
    // (if you have a comments array in your Book schema)
    book.comments.push(newComment._id); // Assuming book schema has a comments array
    await book.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Edit Comment
const editComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ message: "Unauthorized" }); // Unauthorized
    }

    let existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" }); // Not Found
    }

    if (
      existingComment.userId.toString() !== req.user._id.toString() &&
      !req.user.admin
    ) {
      return res.status(403).json({ message: "Forbidden" }); // Forbidden
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).json(existingComment); // OK
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Error editing comment" }); // Internal Server Error
  }
};

// Remove Comment
const removeComment = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ message: "Unauthorized" }); // Unauthorized
    }

    let existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" }); // Not Found
    }

    if (
      existingComment.userId.toString() !== req.user._id.toString() &&
      !req.user.admin
    ) {
      return res.status(403).json({ message: "Forbidden" }); // Forbidden
    }

    await existingComment.remove();

    res.status(200).json({ message: "Comment removed" }); // OK
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" }); // Internal Server Error
  }
};

// Get Comments by Book ID
const getCommentsByBookId = async (req, res) => {
  try {
    const bookId = req.params.id;
    const comments = await Comment.find({ bookId });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments." });
  }
};

module.exports = {
  addComment,
  editComment,
  removeComment,
  getCommentsByBookId,
};
