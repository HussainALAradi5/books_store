// routes/user.js
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const userCtrl = require("../controllers/users");

router.post("/register", userCtrl.register); // Route to register a new user
router.post("/login", auth.authenticate, userCtrl.login); // Route to login user
router.put("/edit", auth.authenticate, userCtrl.edit); // Route to edit user details
router.delete("/delete/:id", auth.authenticate, userCtrl.delete); // Route to delete user

module.exports = router;
