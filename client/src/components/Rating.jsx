import { useState } from "react";

const Rating = ({ onAddRating }) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onAddRating(rating);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
        />
      </label>
      <button type="submit">Add Rating</button>
    </form>
  );
};

export default Rating;
