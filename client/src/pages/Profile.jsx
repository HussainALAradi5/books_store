import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUserDetails } from "../services/auth";
import AdminPanel from "../components/AdminPanel";
import RequestAdmin from "../components/RequestAdmin";

const API_URL = "http://localhost:3000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newEmail: "",
  });
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userDetails = response.data;

        setUser(userDetails);
        setIsAdmin(userDetails.admin);
        setFormData({
          username: userDetails.username,
          email: userDetails.email,
          password: "",
          newEmail: userDetails.email,
        });
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setError("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) {
        setFormError("You must be logged in to update your details.");
        return;
      }

      await axios.put(
        `${API_URL}/user/edit`,
        {
          email: user.email, // Current email to identify user
          username: formData.username,
          password: formData.password,
          newEmail: formData.newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser({
        ...user,
        username: formData.username,
        email: formData.newEmail,
      });
      setFormError("");
      alert("User details updated successfully.");
    } catch (error) {
      console.error("Error updating user details:", error.message);
      setFormError("Error updating user details.");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    updateUserDetails();
  };

  const deleteUserAccount = async () => {
    try {
      const token = getToken();
      if (!token) {
        setDeleteError("You must be logged in to delete your account.");
        return;
      }

      await axios.delete(`${API_URL}/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
        },
      });

      // Handle successful account deletion
      setUser(null);
      alert("Your account has been deleted.");
    } catch (error) {
      console.error("Error deleting user account:", error.message);
      setDeleteError("Error deleting user account.");
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteUserAccount();
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : user ? (
        <div className="profile-card">
          <div className="profile-header">
            <h1>{user.username}'s Profile</h1>
          </div>
          <div className="profile-body">
            <div className="profile-info">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Active:</strong> {user.isActive ? "Yes" : "No"}
              </p>
              <p>
                <strong>Admin:</strong> {user.admin ? "Yes" : "No"}
              </p>
            </div>

            {!isAdmin && <RequestAdmin />}
            {isAdmin && <AdminPanel setBookDetails={handleSetBookDetails} />}

            <form onSubmit={handleFormSubmit} className="update-form">
              <h2>Update Your Details</h2>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">New Email</label>
                <input
                  type="email"
                  id="email"
                  name="newEmail"
                  value={formData.newEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {formError && <p className="error-message">{formError}</p>}
              <button type="submit">Update</button>
            </form>

            {deleteError && <p className="error-message">{deleteError}</p>}
            <button onClick={handleDelete} className="delete-button">
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
