import { useState } from "react";
import axios from "axios";

const RequestAdmin = () => {
  const [reason, setReason] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleRequestAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/user/requestAdmin",
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatusMessage({ text: "Request sent successfully!", type: "success" });
    } catch (error) {
      console.error("Error sending admin request:", error.message);
      setStatusMessage({ text: "Error sending request.", type: "error" });
    }
  };

  return (
    <div className="request-admin">
      <h2>Request Admin Access</h2>
      <p>Please provide a reason for requesting admin access.</p>
      <label htmlFor="reason">Reason:</label>
      <textarea
        id="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter your reason here..."
      />
      <button onClick={handleRequestAdmin}>Send Request</button>
      {statusMessage && (
        <div className={`status-message status-${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
};

export default RequestAdmin;
