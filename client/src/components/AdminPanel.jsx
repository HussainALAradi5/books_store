import { useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [searchName, setSearchName] = useState("");
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    publishYear: "",
    price: "",
    description: "",
    poster: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [reason, setReason] = useState("");
  const [requestStatus, setRequestStatus] = useState(null);

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
        bookDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Book added successfully!");
      setBookDetails({
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
      setBookDetails({
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
        bookDetails,
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

  const handleRequestAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/users/requestAdmin",
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequestStatus("Request sent successfully!");
    } catch (error) {
      console.error("Error sending admin request:", error.message);
      setRequestStatus("Error sending request.");
    }
  };

  return (
    <div className="adminPanel">
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
            value={bookDetails.title}
            onChange={(event) =>
              setBookDetails({ ...bookDetails, title: event.target.value })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Author"
            value={bookDetails.author}
            onChange={(event) =>
              setBookDetails({ ...bookDetails, author: event.target.value })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Publish Year"
            value={bookDetails.publishYear}
            onChange={(event) =>
              setBookDetails({
                ...bookDetails,
                publishYear: event.target.value,
              })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Price"
            value={bookDetails.price}
            onChange={(event) =>
              setBookDetails({ ...bookDetails, price: event.target.value })
            }
            className="form-input"
          />
          <textarea
            placeholder="Description"
            value={bookDetails.description}
            onChange={(event) =>
              setBookDetails({
                ...bookDetails,
                description: event.target.value,
              })
            }
            className="form-textarea"
          />
          <input
            type="text"
            placeholder="Poster URL"
            value={bookDetails.poster}
            onChange={(event) =>
              setBookDetails({ ...bookDetails, poster: event.target.value })
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
          value={bookDetails.title}
          onChange={(event) =>
            setBookDetails({ ...bookDetails, title: event.target.value })
          }
          className="form-input"
        />
        <input
          type="text"
          placeholder="Author"
          value={bookDetails.author}
          onChange={(event) =>
            setBookDetails({ ...bookDetails, author: event.target.value })
          }
          className="form-input"
        />
        <input
          type="text"
          placeholder="Publish Year"
          value={bookDetails.publishYear}
          onChange={(event) =>
            setBookDetails({ ...bookDetails, publishYear: event.target.value })
          }
          className="form-input"
        />
        <input
          type="text"
          placeholder="Price"
          value={bookDetails.price}
          onChange={(event) =>
            setBookDetails({ ...bookDetails, price: event.target.value })
          }
          className="form-input"
        />
        <textarea
          placeholder="Description"
          value={bookDetails.description}
          onChange={(event) =>
            setBookDetails({ ...bookDetails, description: event.target.value })
          }
          className="form-textarea"
        />
        <input
          type="text"
          placeholder="Poster URL"
          value={bookDetails.poster}
          onChange={(event) =>
            setBookDetails({ ...bookDetails, poster: event.target.value })
          }
          className="form-input"
        />
        <button onClick={handleAddBook} className="action-button">
          Add Book
        </button>
      </div>

      <div className="admin-request-section">
        <h2>Request Admin Status</h2>
        <textarea
          placeholder="Reason for admin request"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="form-textarea"
        />
        <button onClick={handleRequestAdmin} className="action-button">
          Submit Request
        </button>
        {requestStatus && <p className="request-status">{requestStatus}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
