const User = require("../models/user");
const {
  hashPassword,
  comparePassword,
  checkUserExists,
} = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userExists = await checkUserExists(email);
    if (userExists) {
      console.log("User already registered with this email.");
      return res.status(400).send("User already registered with this email.");
    }

    const password_digest = await hashPassword(password);
    const newUser = new User({
      username,
      password_digest,
      email,
    });

    await newUser.save();
    console.log("New user created successfully with these details:", newUser);
    res.status(201).send("New user created successfully.");
  } catch (error) {
    console.log("Error in creating user:", error.message);
    res.status(400).send("Error in creating user.");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid email or password.");
      return res.status(400).send("Invalid email or password.");
    }
    const isMatch = await comparePassword(password, user.password_digest);

    if (!isMatch) {
      console.log("Invalid email or password.");
      return res.status(400).send("Invalid email or password.");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(400).send("Error logging in.");
  }
};

const edit = async (req, res) => {
  const { email: userEmail, username, password, newEmail } = req.body;
  try {
    const password_digest = await hashPassword(password);
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { username, password_digest, email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      console.log("No user found with this email");
      return res.status(404).send("No user found with this email.");
    }

    console.log("Updated user data:", updatedUser);
    res.status(200).send("User details updated successfully.");
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).send("Error updating user.");
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedUser) {
      console.log("User not found");
      return res.status(404).send("User not found.");
    }

    console.log("User deleted successfully");
    res.status(200).send("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(400).send("Error deleting user.");
  }
};
const viewUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the request object set by the authentication middleware

    // Find user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      console.log("User not found.");
      return res.status(404).send("User not found.");
    }

    // Return user data
    res.status(200).json({
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      admin: user.admin,
      books: user.books,
      loggedIn: true,
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(400).send("Error fetching user data.");
  }
};
// View user's books
const viewBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("books");
    if (!user) {
      console.log("User not found.");
      return res.status(404).send("User not found.");
    }
    res.status(200).send(user.books);
  } catch (error) {
    console.error("Error fetching user books:", error.message);
    res.status(400).send("Error fetching user books.");
  }
};

// Make a user admin
const makeAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user to admin
    user.admin = true;
    await user.save();

    res.status(200).json({ message: "User updated to admin" });
  } catch (error) {
    console.error("Error updating user to admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  edit,
  delete: deleteUser,
  viewBooks,
  makeAdmin,
  viewUserData,
};
