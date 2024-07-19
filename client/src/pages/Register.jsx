import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(username, email, password);
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Error registering. Please try again.😐");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Register</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="username" className="auth-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="email" className="auth-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password" className="auth-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Register
        </button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
