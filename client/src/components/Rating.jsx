import { useState } from "react";
import axios from "axios";
import { getToken } from "../services/auth";

const API_URL = "http://localhost:3000";

const Rating = ({ bookId, onRatingAdded }) => {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated.");

      await axios.post(
        `${API_URL}/books/${bookId}/ratings`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(0);
      onRatingAdded(); // Notify parent component to update average rating
    } catch (error) {
      console.error("Error adding rating:", error.message);
      setError("Error adding rating.");
    }
  };

  return (
    <div className="rating">
      <h2>Rate This Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
        <button type="submit">Submit Rating</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Rating;
