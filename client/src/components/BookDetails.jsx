import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Rating from "./Rating";
import { getAuthHeaders, checkUserOwnsBook, getToken } from "../services/auth";

const API_URL = "http://localhost:3000";

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
        setUserHasRated(userRating !== null);
      } else {
        setUserHasRated(false);
      }
    } catch (error) {
      console.error("Error checking user book rating:", error.message);
      setError("Error checking user book rating.");
    }
  };

  const handleAddComment = async (commentText) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/books/${id}/comments`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) => [...prevComments, response.data.comment]);
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditComment = async (commentId, newCommentText) => {
    try {
      const token = getToken();
      await axios.put(
        `${API_URL}/books/comments/${commentId}`,
        { comment: newCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, comment: newCommentText }
            : comment
        )
      );
    } catch (error) {
      console.error(
        "Error editing comment:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/books/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error(
        "Error removing comment:",
        error.response ? error.response.data : error.message
      );
    }
  };

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

  const handlePurchaseBook = async () => {
    try {
      const config = { headers: getAuthHeaders() };
      const response = await axios.post(
        `${API_URL}/books/${id}/add`,
        {},
        config
      );
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
          <p>Price: {book.price} BHD</p>
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
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            id={comment._id}
            text={comment.comment}
            onEditComment={handleEditComment}
            onRemoveComment={handleRemoveComment}
          />
        ))}
        {getToken() && (
          <>
            <h3>Leave a Comment</h3>
            <Comment onAddComment={handleAddComment} />
          </>
        )}
      </div>
      {userHasBook && (
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
      )}
    </div>
  );
};

export default BookDetails;
