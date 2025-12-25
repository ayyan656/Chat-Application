const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch messages for a specific chat
router.route("/:chatId").get(protect, allMessages);

// Send a new message
router.route("/").post(protect, sendMessage);

module.exports = router;
