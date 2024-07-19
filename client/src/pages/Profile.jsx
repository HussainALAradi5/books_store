import { useEffect, useState } from "react";
import { getToken, getUserDetails } from "../services/auth";
import AdminPanel from "../components/AdminPanel";
import RequestAdmin from "../components/RequestAdmin";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);

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
        setIsAdmin(userDetails.admin); // Determine if user is an admin
        console.log(userDetails.admin); // Log the admin status to verify
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setError("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSetBookDetails = (details) => {
    setBookDetails(details);
    console.log("Book details set:", details);
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
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Active:</strong> {user.isActive ? "Yes" : "No"}
              </p>
              <p>
                <strong>Admin:</strong> {user.admin ? "Yes" : "No"}
              </p>
            </div>
            <div className="profile-books">
              <h2>Books</h2>
              {user.books && user.books.length > 0 ? (
                <ul>
                  {user.books.map((book) => (
                    <li key={book._id}>{book.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No books owned.</p>
              )}
            </div>
            {!isAdmin && <RequestAdmin />}
          </div>
          {isAdmin && <AdminPanel setBookDetails={handleSetBookDetails} />}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
