import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUserDetails, logout } from "../services/auth";

const NavBar = ({ authenticated, setAuthenticated }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setAuthenticated(loggedIn);

      if (loggedIn) {
        // Fetch user data to check if user is an admin
        const userData = await getUserDetails();
        setIsAdmin(userData.admin);
      }
    };
    checkAuth();
  }, [setAuthenticated]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    navigate("/");
  };

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
