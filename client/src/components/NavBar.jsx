import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, checkUserIsAdmin, logout } from "../services/auth";

const NavBar = ({ authenticated, setAuthenticated }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await isLoggedIn();
        setAuthenticated(loggedIn);

        if (loggedIn) {
          const adminStatus = await checkUserIsAdmin();
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false); // Ensure isAdmin is set to false if not logged in
        }
      } catch (error) {
        console.error(
          "Error checking authentication or admin status:",
          error.message
        );
        setIsAdmin(false); // Ensure isAdmin is set to false on error
      } finally {
        setLoading(false); // Set loading to false after checking
      }
    };
    checkAuth();
  }, [setAuthenticated]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setIsAdmin(false); // Ensure isAdmin is set to false on logout
    navigate("/");
  };

  if (loading) {
    return <div className="navbar">Loading...</div>;
  }

  return (
    <nav className="navbar">
      <ul className="navBarUl">
        <li className="navItem">
          <Link className="navLink" to="/">
            HomePage
          </Link>
        </li>
        <li className="navItem">
          <Link className="navLink" to="/about">
            About Us
          </Link>
        </li>
        {authenticated ? (
          <>
            <li className="navItem">
              <Link className="navLink" to="/receipts">
                Receipts
              </Link>
            </li>
            <li className="navItem">
              <Link className="navLink" to="/profile">
                Profile
              </Link>
            </li>
            {isAdmin && (
              <li className="navItem">
                <Link className="navLink" to="/seerequest">
                  See Requests
                </Link>
              </li>
            )}
            <li className="navItem">
              <Link className="navLink" to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="navItem">
              <Link className="navLink" to="/register">
                Register
              </Link>
            </li>
            <li className="navItem">
              <Link className="navLink" to="/login">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
