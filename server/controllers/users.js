const User = require("../models/user");
const {
  hashPassword,
  comparePassword,
  checkUserExists,
} = require("../middleware/auth");

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

module.exports = {
  register,
  login,
  edit,
  delete: deleteUser,
};
