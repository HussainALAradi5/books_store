import axios from "axios";
const API_URL = "http://localhost:3000/";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}user/login`, {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : "Error logging in."
    );
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}user/register`, {
      username,
      password,
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : "Error registering."
    );
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isLoggedIn = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await axios.get(`${API_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.loggedIn;
  } catch {
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

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

export const checkUserOwnsBook = async (bookId) => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.books.includes(bookId);
  } catch (error) {
    console.error("Error checking book ownership:", error.message);
    return false;
  }
};

export const checkUserActiveStatus = async () => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.isActive;
  } catch (error) {
    console.error("Error checking user active status:", error.message);
    return false;
  }
};

export const checkUserIsAdmin = async () => {
  try {
    const userDetails = await getUserDetails();
    return userDetails.admin;
  } catch (error) {
    console.error("Error checking user admin status:", error.message);
    return false;
  }
};
