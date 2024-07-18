const Comment = require("../models/comment");

// Add Comment
const addComment = async (req, res) => {
  try {
    // Ensure user is logged in and active
    if (!req.user || !req.user.isActive) {
      return res.status(401).end(); // Unauthorized
    }

    const { userId, bookId, comment } = req.body;

    // Create new comment
    const newComment = new Comment({
      userId,
      bookId,
      comment,
    });

    // Save comment to database
    await newComment.save();

    res.status(201).end(); // Created
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).end(); // Internal Server Error
  }
};

// Edit Comment
const editComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    // Ensure user is logged in and active
    if (!req.user || !req.user.isActive) {
      return res.status(401).end(); // Unauthorized
    }

    // Find comment by ID
    let existingComment = await Comment.findById(id);

    // Check if comment exists
    if (!existingComment) {
      return res.status(404).end(); // Not Found
    }

    // Check ownership or admin rights (example: user editing own comment)
    if (
      existingComment.userId.toString() !== req.user._id.toString() &&
      !req.user.admin
    ) {
      return res.status(403).end(); // Forbidden
    }

    // Update comment
    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).end(); // OK
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).end(); // Internal Server Error
  }
};

// Remove Comment
const removeComment = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure user is logged in and active
    if (!req.user || !req.user.isActive) {
      return res.status(401).end(); // Unauthorized
    }

    // Find comment by ID
    let existingComment = await Comment.findById(id);

    // Check if comment exists
    if (!existingComment) {
      return res.status(404).end(); // Not Found
    }

    // Check ownership or admin rights (example: user deleting own comment or admin)
    if (
      existingComment.userId.toString() !== req.user._id.toString() &&
      !req.user.admin
    ) {
      return res.status(403).end(); // Forbidden
    }

    // Remove comment
    await existingComment.remove();

    res.status(200).end(); // OK
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).end(); // Internal Server Error
  }
};

module.exports = {
  addComment,
  editComment,
  removeComment,
};
