import { useState, useEffect } from "react";
import axios from "axios";

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/receipts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReceipts(response.data);
      } catch (error) {
        console.error("Error fetching receipts:", error.message);
        setError("Error fetching receipts.");
      }
    };

    fetchReceipts();
  }, []);

  const handleReceiptClick = (receipt) => {
    setSelectedReceipt(receipt);
  };

  return (
    <div className="receipt">
      <h1>Receipt History</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="receipts-list">
        {receipts.length > 0 ? (
          <ul>
            {receipts.map((receipt) => (
              <li key={receipt._id} onClick={() => handleReceiptClick(receipt)}>
                <p>Receipt ID: {receipt._id}</p>
                <p>Total Books: {receipt.numberOfBooks}</p>
                <p>Total Price: ${receipt.totalPrice.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No receipts available.</p>
        )}
      </div>
      {selectedReceipt && (
        <div className="receipt-details">
          <h2>Receipt Details</h2>
          <p>
            <strong>ID:</strong> {selectedReceipt._id}
          </p>
          <p>
            <strong>Total Books:</strong> {selectedReceipt.numberOfBooks}
          </p>
          <p>
            <strong>Total Price:</strong> $
            {selectedReceipt.totalPrice.toFixed(2)}
          </p>
          <div className="books-list">
            <h3>Books:</h3>
            <ul>
              {selectedReceipt.books.map((bookId) => (
                <li key={bookId}>{bookId}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;
