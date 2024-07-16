const express = require("express");
const auth = require("../middleware");
const router = express.Router();
const userCtrl = require("../controllers/users");
router.post("/register", userCtrl.register); // Route to register a new user
router.post("/login", userCtrl.login); // Route to login user
router.put("/edit", auth, userCtrl.edit); // Route to edit user details
router.delete("/delete/:id", auth, userCtrl.delete); // Route to delete user
