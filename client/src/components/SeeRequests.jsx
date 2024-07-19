import { useState, useEffect } from "react";
import axios from "axios";

const SeeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/user/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
        setStatusMessage("Error fetching requests.");
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/user/requests/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage("Request accepted successfully!");
      setRequests(requests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("Error accepting request:", error.message);
      setStatusMessage("Error accepting request.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/user/requests/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage("Request rejected successfully!");
      setRequests(requests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("Error rejecting request:", error.message);
      setStatusMessage("Error rejecting request.");
    }
  };

  return (
    <div className="see-request-container">
      {statusMessage && <p className="status-message">{statusMessage}</p>}
      <h2>Admin Requests</h2>
      <div className="request-list">
        {requests.map((request) => (
          <div className="request-card" key={request._id}>
            <p className="request-username">
              {request.username} wants admin privileges.
            </p>
            <div className="request-actions">
              <button
                className="action-button accept-button"
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </button>
              <button
                className="action-button reject-button"
                onClick={() => handleReject(request._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeRequest;
