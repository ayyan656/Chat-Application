import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";

import ChatSidebar from "../components/Sidebar/ChatSidebar";
import ChatBox from "../components/Chat/ChatBox";
import AppHeader from "../components/UI/AppHeader";
import ProfilePanel from "../components/Chat/ProfilePanel";
import GroupProfilePanel from "../components/Chat/GroupProfilePanel";
import NewChatModal from "../components/Sidebar/NewChatModal";
import FileUploadToBackend from "../components/FileUploadToBackend";

// ----------------- SOCKET -----------------
const ENDPOINT = "http://localhost:5000";
let socket;
let selectedChatCompare = null;

// ----------------- UTIL -----------------
const createChatObject = (chatData, currentUserId) => {
  const otherUser = chatData.isGroupChat
    ? null
    : chatData.users.find((u) => u._id !== currentUserId);

  const directChatName = otherUser?.name || "Unknown User";
  const directChatPic = otherUser?.pic || "";

  const finalName = chatData.isGroupChat ? chatData.chatName : directChatName;
  const finalPic = chatData.isGroupChat
    ? "https://via.placeholder.com/150/0000FF/FFFFFF?text=G"
    : directChatPic;

  return {
    id: chatData._id,
    name: finalName,
    isGroup: chatData.isGroupChat,
    latestMessage:
      chatData.latestMessage?.content ||
      (chatData.isGroupChat ? "Group created" : "Tap to open chat"),
    time: chatData.latestMessage?.createdAt
      ? new Date(chatData.latestMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    unread: 0,
    pic: finalPic,
    email: otherUser?.email,
    chatData: chatData,
  };
};

// ----------------- CHAT PAGE -----------------
const ChatPage = ({ currentUser: initialCurrentUser, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const currentUserId = currentUser._id;
  const authToken = currentUser.token;

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [discoverableUsers, setDiscoverableUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // UI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // ----------------- FETCH ALL DATA -----------------
  const fetchAllData = useCallback(async () => {
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    try {
      // Chats
      const { data: chatData } = await axios.get(
        `${ENDPOINT}/api/chat`,
        config
      );
      const formattedChats = chatData.map((chat) =>
        createChatObject(chat, currentUserId)
      );
      setChats(formattedChats);

      // Users
      const { data: allUsers } = await axios.get(
        `${ENDPOINT}/api/user?search=`,
        config
      );

      const chattedUserIds = new Set();
      chatData.forEach((chat) => {
        if (!chat.isGroupChat) {
          const otherUser = chat.users.find((u) => u._id !== currentUserId);
          if (otherUser) chattedUserIds.add(otherUser._id);
        }
      });

      const discoverable = allUsers.filter(
        (user) => user._id !== currentUserId && !chattedUserIds.has(user._id)
      );
      setDiscoverableUsers(discoverable);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    }
  }, [currentUserId, authToken]);

  // Log when currentUser changes
  useEffect(() => {
    console.log("currentUser changed:", currentUser.pic);
  }, [currentUser]);

  // ----------------- FETCH MESSAGES -----------------
  const fetchMessages = useCallback(async () => {
    if (!activeChat) return;
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    try {
      const { data } = await axios.get(
        `${ENDPOINT}/api/message/${activeChat.id}`,
        config
      );

      setMessages(
        data.map((msg) => ({
          id: msg._id,
          content: msg.content,
          isSender: msg.sender._id === currentUserId,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );

      socket.emit("join chat", activeChat.id);
    } catch (err) {
      console.error("Fetch Messages Error:", err);
    }
  }, [activeChat, currentUserId, authToken]);

  // ----------------- START USER CHAT -----------------
  const handleUserChatStart = async (userId) => {
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    try {
      const { data } = await axios.post(
        `${ENDPOINT}/api/chat`,
        { userId },
        config
      );
      await fetchAllData();

      const newChat = createChatObject(data, currentUserId);
      setActiveChat(newChat);
      setIsChatOpen(true);
    } catch (err) {
      console.error("Start Chat Error:", err);
    }
  };

  // ----------------- SELECT CHAT -----------------
  const handleChatSelect = (chatId) => {
    const selectedChat = chats.find((c) => c.id === chatId);
    if (!selectedChat) return;

    setActiveChat(selectedChat);
    setIsChatOpen(true);
    setIsProfileOpen(false);
    selectedChatCompare = selectedChat;
  };

  // ----------------- GROUP CREATE -----------------
  const handleGroupCreate = async (groupData) => {
    if (!groupData.name || groupData.users.length < 2) {
      alert("A group chat needs a name and at least two other members.");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    try {
      await axios.post(
        `${ENDPOINT}/api/chat/group`,
        { name: groupData.name, users: groupData.users },
        config
      );
      setIsNewChatModalOpen(false);
      fetchAllData();
    } catch (err) {
      console.error("Group Create Error:", err);
      alert("Failed to create group. Check console for details.");
    }
  };

  // ----------------- UPDATE PROFILE PICTURE -----------------
  const handleProfilePictureUpdate = async (newImageUrl, newPublicId) => {
    console.log("New profile picture:", newImageUrl, newPublicId);

    // Update local UI immediately
    setCurrentUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        pic: newImageUrl,
        profilePicPublicId: newPublicId,
      };
      console.log("Updated user pic:", updatedUser.pic);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      return updatedUser;
    });

    // Persist to DB
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await axios.put(
        `${ENDPOINT}/api/user/profile-picture`,
        {
          profilePictureUrl: newImageUrl,
          profilePicturePublicId: newPublicId,
        },
        config
      );
      console.log("Profile picture updated in DB:", response.data);
    } catch (error) {
      console.error("Failed to update profile picture in DB:", error);
      alert("Failed to save new profile picture. Please try again.");
    }
  };

  // ----------------- SOCKET.IO -----------------
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", currentUser);

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("online-users", (users) => setOnlineUsers(users));

    return () => {
      if (socket && socket.connected) socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    const messageListener = (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare.id !== newMessage.chat._id
      ) {
        fetchAllData();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: newMessage._id,
            content: newMessage.content,
            isSender: newMessage.sender._id === currentUserId,
            time: new Date(newMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    };

    socket.on("message received", messageListener);
    return () => socket.off("message received", messageListener);
  }, [fetchAllData, currentUserId]);

  // ----------------- FETCH ON MOUNT -----------------
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (activeChat) fetchMessages();
    else setMessages([]);
  }, [activeChat, fetchMessages]);

  // ----------------- RENDER -----------------
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {isNewChatModalOpen && (
        <NewChatModal
          onClose={() => setIsNewChatModalOpen(false)}
          onGroupCreate={handleGroupCreate}
          currentUser={currentUser}
        />
      )}

      <AppHeader onLogout={onLogout} activeChatUser={currentUser} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-full lg:w-1/3 xl:w-1/4 border-r ${
            isChatOpen ? "hidden lg:block" : "block"
          }`}
        >
          <ChatSidebar
            chats={chats}
            onChatSelect={handleChatSelect}
            activeChatUser={currentUser}
            onNewChatClick={() => setIsNewChatModalOpen(true)}
            discoverableUsers={discoverableUsers}
            onUserChatStart={handleUserChatStart}
            onLogout={onLogout}
            onProfilePictureUpdate={handleProfilePictureUpdate}
            FileUploadComponent={FileUploadToBackend}
            onlineUsers={onlineUsers}
          />
        </div>

        {/* Chat Box */}
        <div className={`flex-1 ${isChatOpen ? "block" : "hidden lg:block"}`}>
          {activeChat ? (
            <ChatBox
              activeChat={activeChat}
              messages={messages}
              onBackClick={() => {
                setIsChatOpen(false);
                setActiveChat(null);
              }}
              onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
              currentUser={currentUser}
              socket={socket}
              setMessages={setMessages}
              isTyping={isTyping}
              onlineUsers={onlineUsers}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </div>

        {/* Sliding Profile Panel */}
        {isProfileOpen && activeChat && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-30 z-40"
              onClick={() => setIsProfileOpen(false)}
            />
            <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-xl z-50">
              {activeChat.isGroup ? (
                <GroupProfilePanel
                  group={activeChat}
                  onClose={() => setIsProfileOpen(false)}
                  onlineUsers={onlineUsers}
                />
              ) : (
                <ProfilePanel
                  user={activeChat.chatData?.users?.find(
                    (u) => u._id !== currentUser._id
                  )}
                  setUser={setCurrentUser}
                  onClose={() => setIsProfileOpen(false)}
                  isOnline={onlineUsers.includes(
                    activeChat.chatData?.users?.find(
                      (u) => u._id !== currentUser._id
                    )?._id
                  )}
                  onlineUsers={onlineUsers}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
