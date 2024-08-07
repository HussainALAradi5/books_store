import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

const Login = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email.toLowerCase(), password);
      setMessage("Login successful! Redirecting...");
      setAuthenticated(true);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
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
          Login
        </button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
