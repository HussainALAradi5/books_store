import { useState } from "react";
import axios from "axios";

const BooksPanel = ({ setBookDetails }) => {
  const [searchName, setSearchName] = useState("");
  const [bookDetailsState, setBookDetailsState] = useState({
    title: "",
    author: "",
    publishYear: "",
    price: "",
    description: "",
    poster: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/books/findByName",
        {
          params: { name: searchName },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedBook(response.data);
      setBookDetailsState(response.data);
      setBookDetails(response.data);
    } catch (error) {
      console.error("Error searching book:", error.message);
      alert("Error searching book.");
    }
  };

  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/books/addToDatabase",
        bookDetailsState,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Book added successfully!");
      setBookDetailsState({
        title: "",
        author: "",
        publishYear: "",
        price: "",
        description: "",
        poster: "",
      });
    } catch (error) {
      console.error("Error adding book:", error.message);
      alert("Error adding book.");
    }
  };

  const handleRemoveBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/books/${selectedBook._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Book removed successfully!");
      setSelectedBook(null);
      setBookDetailsState({
        title: "",
        author: "",
        publishYear: "",
        price: "",
        description: "",
        poster: "",
      });
    } catch (error) {
      console.error("Error removing book:", error.message);
      alert("Error removing book.");
    }
  };

  const handleEditBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/books/${selectedBook._id}`,
        bookDetailsState,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error.message);
      alert("Error updating book.");
    }
  };

  return (
    <div className="bookPanel">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search book by name"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="action-button">
          Search Book
        </button>
      </div>

      {selectedBook && (
        <div className="form-section">
          <h2>Edit Book</h2>
          <input
            type="text"
            placeholder="Title"
            value={bookDetailsState.title}
            onChange={(event) =>
              setBookDetailsState({
                ...bookDetailsState,
                title: event.target.value,
              })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Author"
            value={bookDetailsState.author}
            onChange={(event) =>
              setBookDetailsState({
                ...bookDetailsState,
                author: event.target.value,
              })
            }
            className="form-input"
          />
          <input
            type="number"
            placeholder="Publish Year"
            value={bookDetailsState.publishYear}
            onChange={(event) =>
              setBookDetailsState({
                ...bookDetailsState,
                publishYear: event.target.value,
              })
            }
            className="form-input"
            min="1900"
            max={new Date().getFullYear()} // Set max year to current year
          />
          <input
            type="number"
            placeholder="Price"
            value={bookDetailsState.price}
            onChange={(event) =>
              setBookDetailsState({
                ...bookDetailsState,
                price: event.target.value,
              })
            }
            className="form-input"
            min="0" // Ensure price is a positive number
            step="0.01" // Allow decimal values
          />
          <textarea
            placeholder="Description"
            value={bookDetailsState.description}
            onChange={(event) =>
              setBookDetailsState({
                ...bookDetailsState,
                description: event.target.value,
              })
            }
            className="form-textarea"
          />
          <input
            type="text"
            placeholder="Poster URL"
            value={bookDetailsState.poster}
            onChange={(event) =>
              setBookDetailsState({
                ...bookDetailsState,
                poster: event.target.value,
              })
            }
            className="form-input"
          />
          <button onClick={handleEditBook} className="action-button">
            Update Book
          </button>
        </div>
      )}

      <div className="remove-section">
        <h2>Remove Book</h2>
        <button onClick={handleRemoveBook} className="action-button">
          Remove Book
        </button>
      </div>

      <div className="add-section">
        <h2>Add Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={bookDetailsState.title}
          onChange={(event) =>
            setBookDetailsState({
              ...bookDetailsState,
              title: event.target.value,
            })
          }
          className="form-input"
        />
        <input
          type="text"
          placeholder="Author"
          value={bookDetailsState.author}
          onChange={(event) =>
            setBookDetailsState({
              ...bookDetailsState,
              author: event.target.value,
            })
          }
          className="form-input"
        />
        <input
          type="number"
          placeholder="Publish Year"
          value={bookDetailsState.publishYear}
          onChange={(event) =>
            setBookDetailsState({
              ...bookDetailsState,
              publishYear: event.target.value,
            })
          }
          className="form-input"
          min="1900"
          max={new Date().getFullYear()} // Set max year to current year
        />
        <input
          type="number"
          placeholder="Price"
          value={bookDetailsState.price}
          onChange={(event) =>
            setBookDetailsState({
              ...bookDetailsState,
              price: event.target.value,
            })
          }
          className="form-input"
          min="0"
          step="0.01"
        />
        <textarea
          placeholder="Description"
          value={bookDetailsState.description}
          onChange={(event) =>
            setBookDetailsState({
              ...bookDetailsState,
              description: event.target.value,
            })
          }
          className="form-textarea"
        />
        <input
          type="text"
          placeholder="Poster URL"
          value={bookDetailsState.poster}
          onChange={(event) =>
            setBookDetailsState({
              ...bookDetailsState,
              poster: event.target.value,
            })
          }
          className="form-input"
        />
        <button onClick={handleAddBook} className="action-button">
          Add Book
        </button>
      </div>
    </div>
  );
};

export default BooksPanel;
