// Rating.jsx

import { useState } from "react";
import axios from "axios";
import { getToken, getUsername } from "../services/auth";

const API_URL = "http://localhost:3000";

const Rating = ({ bookId, onRatingAdded }) => {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();
      const username = getUsername(); // Retrieve username

      if (!token || !username) throw new Error("Not authenticated.");

      console.log(`Submitting rating for book ID ${bookId}: ${rating}`);

      await axios.post(
        `${API_URL}/books/${bookId}/ratings`,
        { rating, username }, // Include username in request payload
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Rating submitted successfully.");
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
          onChange={(event) => setRating(Number(event.target.value))}
          required
        />
        <button type="submit">Submit Rating</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Rating;
