import axios from "axios";

const API_URL = "http://localhost:3000/";

// Utility to get the JWT token from localStorage
const getToken = () => localStorage.getItem("token");

// Utility to set the JWT token in localStorage
const setToken = (token) => localStorage.setItem("token", token);

// Utility to get the Authorization headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Utility to remove the JWT token from localStorage
const removeToken = () => {
  localStorage.removeItem("token");
  console.log("Token removed"); // For debugging
};

// Handles API errors
const handleError = (error) => {
  const message = error.response
    ? error.response.data.message
    : "An unexpected error occurred.";
  console.error("API error:", message); // For debugging
  return message;
};

// Handles user login
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}user/login`, {
      email,
      password,
    });
    setToken(response.data.token);
    localStorage.setItem("username", response.data.username); // Store username
    return response.data;
  } catch (error) {
    console.error("Login error:", handleError(error));
    throw new Error(handleError(error));
  }
};

// Handles user registration
const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}user/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", handleError(error));
    throw new Error(handleError(error));
  }
};

// Checks if the user is logged in
const isLoggedIn = async () => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await axios.get(`${API_URL}user/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data.loggedIn === true;
  } catch (error) {
    console.error("Error checking login status:", handleError(error));
    return false;
  }
};

// Logs out the user
const logout = () => {
  removeToken();
  console.log("User logged out"); // For debugging
};

// Fetches user details
const getUserDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}user/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", handleError(error));
    throw new Error("Error fetching user details.");
  }
};

// Checks if the user has rated a specific book
const hasUserRatedBook = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}books/${bookId}/user-rating`, {
      headers: getAuthHeaders(),
    });
    return response.data.rating !== undefined; // Return true if user has a rating, false otherwise
  } catch (error) {
    console.error("Error checking user book rating:", handleError(error));
    return false;
  }
};
const hasUserCommentedOnBook = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}books/${bookId}/user-comment`, {
      headers: getAuthHeaders(),
    });
    console.log("response:", response);
    return response.data.hasCommented;
  } catch (error) {
    console.error("Error checking user book comments:", error.message);
    return false;
  }
};
// Checks if the user owns a specific book
const checkUserOwnsBook = async (bookId) => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.books.includes(bookId);
  } catch (error) {
    console.error("Error checking book ownership:", handleError(error));
    return false;
  }
};

// Checks if the user is active
const checkUserActiveStatus = async () => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.isActive;
  } catch (error) {
    console.error("Error checking user active status:", handleError(error));
    return false;
  }
};

// Checks if the user is an admin
const checkUserIsAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}user/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data.admin;
  } catch (error) {
    console.error("Error checking user admin status:", handleError(error));
    return false;
  }
};

// Makes a user an admin
const makeAdmin = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}users/admin`,
      { email },
      { headers: getAuthHeaders() }
    );
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
  getToken,
  getAuthHeaders,
  hasUserRatedBook,
  hasUserCommentedOnBook,
};
