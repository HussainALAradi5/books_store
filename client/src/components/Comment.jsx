import { useState } from "react";
import axios from "axios";
import { getToken } from "../services/auth";

const API_URL = "http://localhost:3000";

const Comment = ({ bookId, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated.");

      await axios.post(
        `${API_URL}/books/${bookId}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment("");
      onCommentAdded(); // Notify parent component to update comments
    } catch (error) {
      console.error("Error adding comment:", error.message);
      setError("Error adding comment.");
    }
  };

  return (
    <div className="comment">
      <h2>Add a Comment</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Write your comment here..."
          required
        />
        <button type="submit">Submit Comment</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Comment;
