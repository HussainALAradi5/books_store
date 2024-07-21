import axios from "axios";

const API_URL = "http://localhost:3000/";

// Utility to get the JWT token from localStorage
export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token retrieved:", token);
  return token;
};

// Utility to set the JWT token in localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
  console.log("Token set:", token);
};
const getUsername = () => {
  const username = localStorage.getItem("username");
  console.log("Username retrieved:", username);
  return username;
};
// Utility to remove the JWT token from localStorage
const removeToken = () => {
  localStorage.removeItem("token");
  console.log("Token removed");
};

// Handles API errors
const handleError = (error) => {
  const message = error.response
    ? error.response.data.message
    : "An unexpected error occurred.";
  console.error("API error:", message);
  return message;
};

// Handles user login
const login = async (email, password) => {
  console.log("Attempting to login with email:", email);
  try {
    const response = await axios.post(`${API_URL}user/login`, {
      email,
      password,
    });
    setToken(response.data.token);
    localStorage.setItem("username", response.data.username); // Store username
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", handleError(error));
    throw new Error(handleError(error));
  }
};

// Handles user registration
const register = async (username, email, password) => {
  console.log("Attempting to register with username:", username);
  try {
    const response = await axios.post(`${API_URL}user/register`, {
      username,
      email,
      password,
    });
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", handleError(error));
    throw new Error(handleError(error));
  }
};

// Checks if the user is logged in
const isLoggedIn = async () => {
  console.log("Checking if user is logged in");
  try {
    const token = getToken();
    if (!token) return false;

    const response = await axios.get(`${API_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const loggedIn = response.data.loggedIn === true;
    console.log("User logged in status:", loggedIn);
    return loggedIn;
  } catch (error) {
    console.error("Error checking login status:", handleError(error));
    return false;
  }
};

// Logs out the user
const logout = () => {
  removeToken();
  console.log("User logged out");
};

// Fetches user details
const getUserDetails = async () => {
  console.log("Fetching user details");
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("User details fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", handleError(error));
    throw new Error("Error fetching user details.");
  }
};

// Checks if the user owns a specific book
const checkUserOwnsBook = async (bookId) => {
  console.log("Checking if user owns book with ID:", bookId);
  try {
    const userDetails = await getUserDetails();
    const ownsBook = userDetails.books.includes(bookId);
    console.log("User owns book:", ownsBook);
    return ownsBook;
  } catch (error) {
    console.error("Error checking book ownership:", handleError(error));
    return false;
  }
};

// Checks if the user is active
const checkUserActiveStatus = async () => {
  console.log("Checking if user is active");
  try {
    const userDetails = await getUserDetails();
    const isActive = userDetails.isActive;
    console.log("User active status:", isActive);
    return isActive;
  } catch (error) {
    console.error("Error checking user active status:", handleError(error));
    return false;
  }
};

// Checks if the user is an admin
const checkUserIsAdmin = async () => {
  console.log("Checking if user is an admin");
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const isAdmin = response.data.admin;
    console.log("User admin status:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("Error checking user admin status:", handleError(error));
    return false;
  }
};

// Makes a user an admin
const makeAdmin = async (email) => {
  console.log("Attempting to make user admin with email:", email);
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}users/admin`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("MakeAdmin response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error making user admin:", handleError(error));
    throw new Error(handleError(error));
  }
};

// Export all functions at the end
export {
  login,
  register,
  isLoggedIn,
  logout,
  getUserDetails,
  checkUserOwnsBook,
  checkUserActiveStatus,
  checkUserIsAdmin,
  makeAdmin,
  getUsername,
};
