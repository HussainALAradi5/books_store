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
          "http://localhost:3000/users/requests",
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
        `http://localhost:3000/users/requests/${id}/accept`,
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
        `http://localhost:3000/users/requests/${id}/reject`,
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
    <div className="see-request">
      {statusMessage && <p className="status-message">{statusMessage}</p>}
      <h2>Admin Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            <p>{request.username} wants admin privileges.</p>
            <button onClick={() => handleAccept(request._id)}>Accept</button>
            <button onClick={() => handleReject(request._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeeRequest;
