import { useEffect, useState } from "react";
import { getToken, getUserDetails } from "../services/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const userDetails = await getUserDetails();
        setUser(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setError("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile">
      {error ? (
        <p className="error-message">{error}</p>
      ) : user ? (
        <div>
          <h1>Profile</h1>
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
          <div className="books">
            <h2>Books</h2>
            {user.books.length > 0 ? (
              <ul>
                {user.books.map((book) => (
                  <li key={book._id}>{book.title}</li>
                ))}
              </ul>
            ) : (
              <p>No books owned.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
