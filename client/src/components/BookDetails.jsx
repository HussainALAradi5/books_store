import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error.message);
      }
    };

    fetchBook();
  }, [id]);

  const handleBuyBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/books/add`,
        { bookId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("You already have this book.");
      } else {
        console.error("Error buying book:", error.message);
        setMessage("Error buying book.");
      }
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="bookDetails">
      <img src={book.poster} alt={book.title} />
      <h1>{book.title}</h1>
      <h2>Author: {book.author}</h2>
      <h3>Published Year: {book.publishYear}</h3>
      <p>{book.description}</p>
      <p>Price: ${book.price}</p>
      <button onClick={handleBuyBook}>Buy</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookDetails;
