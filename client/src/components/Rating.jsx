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
    const token = getToken(); // Ensure token is retrieved

    if (!token) {
      console.error("Not authenticated.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/books/${bookId}/ratings`,
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Rating added successfully");
    } catch (error) {
      console.error(
        "Error adding rating:",
        error.response?.data?.message || error.message
      );
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
