
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Send a new message
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  console.log("sendMessage called with:", {
    content,
    chatId,
    user: req.user?._id,
  });

  if (!content || !chatId) {
    console.log("Invalid message data");
    return res.status(400).json({ message: "Invalid message data" });
  }

  try {
    // 1️⃣ Create a new message and save to DB
    const newMessage = new Message({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const message = await newMessage.save();
    console.log("Message saved in DB:", message);

    // 2️⃣ Populate sender, chat, and chat users
    await message.populate("sender", "name pic");
    await message.populate("chat");
    await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    console.log("Message after population:", message);

    // 3️⃣ Update latestMessage in chat and return updated chat
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: message._id },
      { new: true } // returns the updated chat
    );

    console.log("Chat after updating latestMessage:", updatedChat);

    // 4️⃣ Return the populated message
    return res.status(201).json(message);
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

// Fetch all messages of a chat
const allMessages = async (req, res) => {
  console.log("allMessages called for chatId:", req.params.chatId);

  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    console.log("Fetched messages count:", messages.length);

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return res.status(500).json({ message: "Failed to load messages" });
  }
};

module.exports = {
  sendMessage,
  allMessages,
};
