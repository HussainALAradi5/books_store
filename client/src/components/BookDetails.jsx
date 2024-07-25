import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Rating from "./Rating";
import { getAuthHeaders, checkUserOwnsBook, getToken } from "../services/auth";
const API_URL = "http://localhost:3000";
console.log("token:", getToken());
console.log("getAuthHeaders:", getAuthHeaders());

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userHasBook, setUserHasBook] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);

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
      const { averageRating } = response.data;
      setAverageRating(averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error.message);
      setError("Error fetching average rating.");
    }
  };

  // Check if the user owns the book
  const checkOwnership = async () => {
    try {
      const ownsBook = await checkUserOwnsBook(id);
      console.log("user own book:", ownsBook);
      setUserHasBook(ownsBook);
    } catch (error) {
      console.error("Error checking book ownership:", error.message);
      setError("Error checking book ownership.");
    }
  };

  // Check if the user has rated the book
  const checkUserRating = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await axios.get(`${API_URL}/books/${id}/user-rating`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRating = response.data.rating;
        console.log("Fetched user rating:", userRating); // Debug log
        setUserHasRated(userRating !== null); // Update this to handle null
      } else {
        setUserHasRated(false);
      }
    } catch (error) {
      console.error("Error checking user book rating:", error.message);
      setError("Error checking user book rating.");
    }
  };

  // Add a comment
  /*  const handleAddComment = async (commentText) => {
    try {
      const config = { headers: getAuthHeaders() };
      await axios.post(
        `${API_URL}/books/${id}/comments`,
        { text: commentText },
        config
      );
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error.message);
      setError("Error adding comment.");
    }
  }; */
  const handleAddComment = async (commentText) => {
    try {
      const token = getToken();

      const response = await axios.post(
        `http://localhost:3000/books/${id}/comments`,
        { comment: commentText }, // Ensure this is the correct structure
        { headers: { Authorization: `Bearer ${token}` } } // Include auth headers if necessary
      );
      console.log("Comment added:", response.data);
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Add a rating
  const handleAddRating = async (rating) => {
    try {
      const config = { headers: getAuthHeaders() };
      await axios.post(`${API_URL}/books/${id}/ratings`, { rating }, config);
      fetchAverageRating();
      setUserHasRated(true);
    } catch (error) {
      console.error("Error adding rating:", error.message);
      setError("Error adding rating.");
    }
  };

  // Purchase the book
  const handlePurchaseBook = async () => {
    try {
      const config = { headers: getAuthHeaders() };
      console.log(`Sending request to: ${API_URL}/books/${id}/add`);
      const response = await axios.post(
        `${API_URL}/books/${id}/add`,
        {},
        config
      );
      console.log(`Response: ${JSON.stringify(response.data)}`);
      setUserHasBook(true);
    } catch (error) {
      console.error("Error purchasing book:", error.message);
      setError("Error purchasing book.");
    }
  };

  useEffect(() => {
    fetchBookDetails();
    fetchComments();
    fetchAverageRating();
    checkOwnership();
    checkUserRating();
    setLoading(false);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bookDetails-container">
      {book && (
        <>
          <h2>{book.title}</h2>
          <p>{book.description}</p>
          <p>Published: {book.publishYear}</p>
          <p>Average Rating: {averageRating}</p>
          <p>price: {book.price} BHD</p>
          {userHasBook ? (
            <p>You own this book.</p>
          ) : (
            <>
              <p>You do not own this book.</p>
              <button onClick={handlePurchaseBook}>Buy this Book</button>
            </>
          )}
          {book.poster && (
            <img src={book.poster} alt={book.title} className="book-poster" />
          )}
        </>
      )}
      <div>
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <Comment key={index} text={comment.text} />
        ))}
        {getToken() && (
          <>
            <h3>Leave a Comment</h3>
            <Comment onAddComment={handleAddComment} />
          </>
        )}
      </div>
      <div>
        <h3>Rate this Book</h3>
        {getToken() ? (
          userHasRated ? (
            <p>You have already rated this book.</p>
          ) : (
            <Rating onAddRating={handleAddRating} />
          )
        ) : (
          <p>Please log in to rate this book.</p>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
