const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
router.get("/:id", userCtrl.getUser); //this route will lead to the user details
router.post("/create", userCtrl.createUser); //this route will lead to form to create user
router.put("/edit", userCtrl.updateUser); //this route will lead to form to update user details
router.delete("/delete/:id", userCtrl.deleteUser);
module.exports = router;
