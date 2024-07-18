import React from "react";
import { Routes, Route } from "react-router-dom";
import BookDetails from "./BookDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import HomePage from "../pages/HomePage";
import NavBar from "./NavBar";

const MainContainer = () => {
  return (
    <div className="MainContainer">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default MainContainer;
