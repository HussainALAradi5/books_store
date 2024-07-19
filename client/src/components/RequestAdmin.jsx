import { useState } from "react";
import { makeAdmin } from "../services/auth";

const RequestAdmin = ({ email, setMessage }) => {
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async () => {
    setLoading(true);
    try {
      const response = await makeAdmin(email);
      setMessage({ type: "success", text: response.message });
    } catch (error) {
      setMessage({ type: "error", text: "Error making user admin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleMakeAdmin} disabled={loading}>
        {loading ? "Processing..." : "Request Admin Access"}
      </button>
    </div>
  );
};

export default RequestAdmin;
