import axios from "axios";

const API_URL = "http://localhost:3000/";

// Utility to get the JWT token from localStorage
export const getToken = () => localStorage.getItem("token");

// Utility to set the JWT token in localStorage
const setToken = (token) => localStorage.setItem("token", token);

// Utility to remove the JWT token from localStorage
const removeToken = () => localStorage.removeItem("token");

// Handles user login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}user/login`, {
      email,
      password,
    });
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Error logging in.";
    throw new Error(errorMessage);
  }
};

// Handles user registration
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}user/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : "Error registering.";
    throw new Error(errorMessage);
  }
};

// Checks if the user is logged in
export const isLoggedIn = async () => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await axios.get(`${API_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.loggedIn === true;
  } catch (error) {
    console.error("Error checking login status:", error.message);
    return false;
  }
};

// Logs out the user
export const logout = () => removeToken();

// Fetches user details
export const getUserDetails = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    throw new Error("Error fetching user details.");
  }
};

// Checks if the user owns a specific book
export const checkUserOwnsBook = async (bookId) => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.books.includes(bookId);
  } catch (error) {
    console.error("Error checking book ownership:", error.message);
    return false;
  }
};

// Checks if the user is active
export const checkUserActiveStatus = async () => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.isActive;
  } catch (error) {
    console.error("Error checking user active status:", error.message);
    return false;
  }
};

// Checks if the user is an admin
export const checkUserIsAdmin = async () => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.admin;
  } catch (error) {
    console.error("Error checking user admin status:", error.message);
    return false;
  }
};
