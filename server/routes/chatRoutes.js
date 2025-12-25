const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController"); 
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to access a chat (1-on-1) or fetch all chats
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);

// Group Chat Routes
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
