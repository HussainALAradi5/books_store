const User = require("../models/user");

const createUser = async (req, res) => {
  const { username, password_digest, email } = req.body;
  try {
    const newUser = new User({
      username,
      password_digest,
      email,
    });
    await newUser.save();
    console.log("new user created succasfuly with this details:", newUser);
    res.status(201);
  } catch (error) {
    console.log("error in creating user!");
    res.status(400);
  }
};

const updateUser = async (req, res) => {
  const { email: userEmail } = req.body;
  const { username, password_digest, email: newEmail } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        username,
        password_digest,
        email: newEmail,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.log("No user found with this email");
      return res.status(404);
    }
    console.log("updated user data:", updatedUser);
    res.status(201);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400);
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
      return res.status(404);
    }
    console.log("User deleted successfully", deleteUser);
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(400);
  }
};
const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return res.status(404);
    }
    console.log("User details:", user);
    res.status(200);
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(400);
  }
};
module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
};
