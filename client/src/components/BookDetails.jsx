import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Rating from "./Rating";
import { getToken, checkUserOwnsBook } from "../services/auth";

const API_URL = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = getToken();
  console.log(`Token used for request: ${token}`); // Logging the token
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userHasBook, setUserHasBook] = useState(false);

  // Fetch book details
  const fetchBookDetails = async () => {
    try {
      const config = { headers: getAuthHeaders() };
      const response = await axios.get(`${API_URL}/books/${id}`, config);
      setBook(response.data);
      console.log(`Fetched book details: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Error fetching book details:", error.message);
      setError("Error fetching book details.");
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const config = { headers: getAuthHeaders() };
      const response = await axios.get(
        `${API_URL}/books/${id}/comments`,
        config
      );
      setComments(response.data);
      console.log(`Fetched comments: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
      setError("Error fetching comments.");
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const config = { headers: getAuthHeaders() };
      const response = await axios.get(
        `${API_URL}/books/${id}/ratings`,
        config
      );
      console.log(`Fetched rating response: ${JSON.stringify(response.data)}`);
      const { averageRating } = response.data;
      setAverageRating(averageRating);
      console.log(`Calculated average rating: ${averageRating}`);
    } catch (error) {
      console.error("Error fetching average rating:", error.message);
      setError("Error fetching average rating.");
    }
  };

  // Check if the user owns the book
  const checkOwnership = async () => {
    try {
      const ownsBook = await checkUserOwnsBook(id);
      setUserHasBook(ownsBook);
    } catch (error) {
      console.error("Error checking user book ownership:", error.message);
      setError("Error checking user book ownership.");
    }
  };

  // Handle adding a new comment
  const handleCommentAdded = async (newCommentText) => {
    try {
      const config = { headers: getAuthHeaders() };
      await axios.post(
        `${API_URL}/books/${id}/comments`,
        { text: newCommentText },
        config
      );
      await fetchComments(); // Re-fetch updated comments
    } catch (error) {
      console.error("Error adding comment:", error.message);
      setError("Error adding comment.");
    }
  };

  // Handle adding a new rating
  const handleRatingAdded = async (newRating) => {
    try {
      const config = { headers: getAuthHeaders() };
      await axios.post(
        `${API_URL}/books/${id}/ratings`,
        { rating: newRating },
        config
      );
      await fetchAverageRating(); // Re-fetch updated average rating
    } catch (error) {
      console.error("Error adding rating:", error.message);
      setError("Error adding rating.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchBookDetails();
      await fetchComments();
      await fetchAverageRating();
      if (getToken()) await checkOwnership();
      setLoading(false);
    };

    fetchData();
  }, [id]);

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
          <p>Price: {book.price} BHD</p>
          <p>Average Rating: {(averageRating || 0).toFixed(2)}</p>
          {getToken() ? (
            userHasBook ? (
              <>
                <Comment bookId={id} onCommentAdded={handleCommentAdded} />
                <Rating
                  bookId={id}
                  onRatingAdded={handleRatingAdded}
                  userHasBook={userHasBook} // Pass userHasBook to Rating
                />
                <div className="commentsSection">
                  <h2>Comments</h2>
                  {comments.length > 0 ? (
                    <ul>
                      {comments.map((comment) => (
                        <li key={comment._id}>
                          <p>{comment.text}</p>
                          <p>
                            <small>{comment.userId}</small>
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
              <p>You must own this book to rate it.</p>
            )
          ) : (
            <p>You need to be logged in to comment or rate this book.</p>
          )}
        </>
      ) : (
        <p>No book details available.</p>
      )}
    </div>
  );
};

export default BookDetails;
