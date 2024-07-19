import { Routes, Route } from "react-router-dom";
import BookDetails from "./BookDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import HomePage from "../pages/HomePage";
import NavBar from "./NavBar";
import AboutUs from "../pages/AboutUs";
import Receipt from "./Receipt";
import { useState } from "react";

const MainContainer = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div className="MainContainer">
      <NavBar
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route
          path="/login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/receipts" element={<Receipt />} />
      </Routes>
    </div>
  );
};

export default MainContainer;
