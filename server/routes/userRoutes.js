const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateProfilePicture,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/").get(protect, allUsers); 
router.post("/login", authUser);
router.put("/profile-picture", protect, updateProfilePicture);

module.exports = router;
