import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Rating from "./Rating";
import { getToken } from "../services/auth";

const API_URL = "http://localhost:3000";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch book details
        const bookResponse = await axios.get(`${API_URL}/books/${id}`);
        setBook(bookResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(
          `${API_URL}/books/${id}/comments`
        );
        setComments(commentsResponse.data);

        // Fetch average rating
        const ratingResponse = await axios.get(
          `${API_URL}/books/${id}/ratings`
        );
        const { totalRatings, count } = ratingResponse.data;
        const avgRating = count > 0 ? totalRatings / count : 0;
        setAverageRating(avgRating);
      } catch (error) {
        console.error(
          "Error fetching book details, comments, or ratings:",
          error.message
        );
        setError("Error fetching book details, comments, or ratings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentAdded = async () => {
    try {
      // Fetch updated comments only
      const response = await axios.get(`${API_URL}/books/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error updating comments:", error.message);
      setError("Error updating comments.");
    }
  };

  const handleRatingAdded = async () => {
    try {
      // Re-fetch average rating after adding a new rating
      const response = await axios.get(`${API_URL}/books/${id}/ratings`);
      const { totalRatings, count } = response.data;
      const avgRating = count > 0 ? totalRatings / count : 0;
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error updating average rating:", error.message);
      setError("Error updating average rating.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bookDetails">
      {book ? (
        <>
          <img src={book.poster} alt={book.title} />
          <h1>{book.title}</h1>
          <h2>Author: {book.author}</h2>
          <h3>Published Year: {book.publishYear}</h3>
          <p>{book.description}</p>
          <p>Price: ${book.price}</p>
          <p>Average Rating: {averageRating.toFixed(2)}</p>
          {getToken() ? (
            <>
              <Comment bookId={id} onCommentAdded={handleCommentAdded} />
              <Rating bookId={id} onRatingAdded={handleRatingAdded} />
              <div className="commentsSection">
                <h2>Comments</h2>
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((comment) => (
                      <li key={comment._id}>
                        <p>{comment.text}</p>
                        <p>
                          <small>{comment.author}</small>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </>
          ) : (
            <p>You need to be logged in to comment or rate this book.</p>
          )}
          {message && <p>{message}</p>}
        </>
      ) : (
        <p>No book details available.</p>
      )}
    </div>
  );
};

export default BookDetails;
