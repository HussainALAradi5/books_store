import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

const NavBar = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setAuthenticated(loggedIn);
    };

    checkAuth();
  }, []);

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
        {!authenticated && (
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
        {authenticated && (
          <li className="navItem">
            <Link className="navLink" to="/profile">
              Profile
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
