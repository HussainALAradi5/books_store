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
  const [userHasCommented, setUserHasCommented] = useState(false); // New state for tracking comments
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

      // Check if the user has already commented
      const token = getToken();
      if (token) {
        const userCommented = response.data.some(
          (comment) => comment.userId === token.userId
        ); // Assuming userId is stored in token
        setUserHasCommented(userCommented);
      }
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
        setIsLoggedIn(true); // Set logged-in status
        const response = await axios.get(`${API_URL}/books/${id}/user-rating`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRating = response.data.rating;
        setUserHasRated(userRating !== null);
      } else {
        setIsLoggedIn(false); // Not logged in
        setUserHasRated(false);
      }
    } catch (error) {
      console.error("Error checking user book rating:", error.message);
      setError("Error checking user book rating.");
    }
  };

  // Handle add comment
  const handleAddComment = async (commentText) => {
    if (!isLoggedIn) {
      alert("You must be logged in to add a comment.");
      return;
    }
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/books/${id}/comments`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) => [...prevComments, response.data.comment]);
      setUserHasCommented(true); // Update state to reflect that user has commented
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  // Handle edit comment
  const handleEditComment = async (commentId, newCommentText) => {
    if (!isLoggedIn) {
      alert("You must be logged in to edit a comment.");
      return;
    }
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
      console.error("Error editing comment:", error.message);
    }
  };

  // Handle remove comment
  const handleRemoveComment = async (commentId) => {
    if (!isLoggedIn) {
      alert("You must be logged in to remove a comment.");
      return;
    }
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/books/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error removing comment:", error.message);
    }
  };

  // Handle add rating
  const handleAddRating = async (rating) => {
    if (!isLoggedIn) {
      alert("You must be logged in to rate a book.");
      return;
    }
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

  // Handle purchase book
  const handlePurchaseBook = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in to purchase a book.");
      return;
    }
    try {
      const config = { headers: getAuthHeaders() };
      await axios.post(`${API_URL}/books/${id}/add`, {}, config);
      setUserHasBook(true);
    } catch (error) {
      console.error("Error purchasing book:", error.message);
      setError("Error purchasing book.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBookDetails();
      await fetchComments();
      await fetchAverageRating();
      await checkOwnership();
      await checkUserRating();
      setLoading(false);
    };

    fetchData();
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
              {isLoggedIn ? (
                <>
                  <p>You do not own this book.</p>
                  <button onClick={handlePurchaseBook}>Buy this Book</button>
                </>
              ) : (
                <p>You must be registered to purchase this book.</p>
              )}
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
            canEdit={userHasBook && isLoggedIn}
            onEditComment={handleEditComment}
            onRemoveComment={handleRemoveComment}
          />
        ))}
        {userHasBook &&
          !userHasCommented && ( // Conditional rendering
            <>
              <h3>Leave a Comment</h3>
              <Comment onAddComment={handleAddComment} />
            </>
          )}
        {!userHasBook && (
          <p>You must be registered and have the book to add comments.</p>
        )}
      </div>
      {userHasBook && (
        <div>
          <h3>Rate this Book</h3>
          {isLoggedIn ? (
            userHasRated ? (
              <p>You have already rated this book.</p>
            ) : (
              <Rating onAddRating={handleAddRating} />
            )
          ) : (
            <p>You must be registered to rate this book.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookDetails;
