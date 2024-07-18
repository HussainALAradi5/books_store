import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="homePage">
      <h1>All Books</h1>
      <div className="bookGrid">
        {books.map((book) => (
          <Link to={`/book/${book._id}`} key={book._id}>
            <BookCard book={book} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
