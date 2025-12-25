const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoute = require("./routes/upload.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// -------- MIDDLEWARE ----------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// -------- ROUTES ----------
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/upload", uploadRoute);

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

// -------- START SERVER ----------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ============================================
//  SOCKET.IO - REAL ONLINE USER TRACKING
// ============================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Socket Connected:", socket.id);

  // When a user logs in, frontend sends user data
  socket.on("setup", (userData) => {
    if (!userData || !userData._id) return;

    socket.join(userData._id);

    // Add user to online list
    onlineUsers.set(userData._id, socket.id);
    console.log("🟢 User Online:", userData._id);

    // Send updated online users list to ALL clients
    io.emit("online-users", Array.from(onlineUsers.keys()));

    socket.emit("connected");
  });

  // Join specific chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("📌 Joined Chat:", chatId);
  });

  // Typing indicator
  socket.on("typing", (chatId) => socket.in(chatId).emit("typing"));
  socket.on("stop typing", (chatId) => socket.in(chatId).emit("stop typing"));

  // New message event
  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat || !chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket.in(user._id).emit("message received", newMessage);
    });
  });

  // Remove user when socket disconnects
  socket.on("disconnect", () => {
    console.log("🔴 Socket Disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("🔴 User Offline:", userId);

        // Send updated user list to everyone
        io.emit("online-users", Array.from(onlineUsers.keys()));
      }
    }
  });
});
