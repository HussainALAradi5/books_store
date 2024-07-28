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
      <ul className="bookGrid">
        {books.map((book) => (
          <li key={book._id}>
            <Link to={`/books/${book._id}`} className="bookLink">
              <BookCard book={book} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
