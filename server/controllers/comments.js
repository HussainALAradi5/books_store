const Comment = require("../models/comment");
const Book = require("../models/book");
// Add Comment

const addComment = async (req, res) => {
  const { id } = req.params; // Book ID
  const { comment } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    // Check if the user has already commented on the book
    const existingComment = await Comment.findOne({ bookId: id, userId });

    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You have already commented on this book." });
    }

    // Add the new comment
    const newComment = new Comment({
      bookId: id,
      userId,
      comment,
    });

    await newComment.save();

    // Add the new comment to the book's comments array
    await Book.findByIdAndUpdate(
      id,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};
// Edit Comment
const editComment = async (req, res) => {
  const { id } = req.params; // Comment ID
  const { comment } = req.body; // New comment text
  const userId = req.user.id; // Extract user ID from authenticated request

  if (!comment) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    let existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" }); // Not Found
    }

    if (
      existingComment.userId.toString() !== userId.toString() &&
      !req.user.admin
    ) {
      return res.status(403).json({ message: "Forbidden" }); // Forbidden
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).json({
      message: "Comment edited successfully",
      comment: existingComment,
    }); // OK
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Error editing comment" }); // Internal Server Error
  }
};

// Remove Comment
const removeComment = async (req, res) => {
  const { id } = req.params; // Comment ID
  const userId = req.user.id; // Extract user ID from authenticated request

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    // Find the comment by ID
    let existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" }); // Not Found
    }

    // Check if the user is authorized to delete the comment
    if (
      existingComment.userId.toString() !== userId.toString() &&
      !req.user.admin
    ) {
      return res.status(403).json({ message: "Forbidden" }); // Forbidden
    }

    // Remove the comment
    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment removed successfully" }); // OK
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
const checkUserComment = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const userId = req.user.id; // Extract user ID from the authenticated request

    // Check if user has commented on the book
    const comments = await Comment.find({ bookId, userId });
    return res.json({ hasCommented: comments.length > 0 });
  } catch (error) {
    console.error("Error checking user comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const checkUserCommentByEmail = async (req, res) => {
  const { id: bookId } = req.params; // Book ID from params
  const { email } = req.body; // User email from request body

  // Validate input
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Retrieve user details from the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id; // Extract user ID from user details

    // Check if the user has commented on the book
    const comments = await Comment.find({ bookId, userId });
    const hasCommented = comments.length > 0;

    return res.json({ hasCommented });
  } catch (error) {
    console.error("Error checking user comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addComment,
  editComment,
  removeComment,
  getCommentsByBookId,
  checkUserComment,
  checkUserCommentByEmail,
};
