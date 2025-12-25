import React from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatBox = ({
  activeChat,
  messages,
  onBackClick,
  onProfileClick,
  currentUser,
  socket,
  setMessages,
  onlineUsers = [],
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader
        user={activeChat}
        onBackClick={onBackClick}
        onProfileClick={onProfileClick}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
      />

      <div
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 custom-scroll"
        style={{
          backgroundImage:
            "url(https://www.transparenttextures.com/patterns/white-subtle-squares.png)",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="text-center my-4">
          <span className="inline-block px-3 py-1 text-xs text-gray-500 bg-white rounded-full shadow">
            Today
          </span>
        </div>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <MessageInput
        activeChat={activeChat}
        currentUser={currentUser}
        socket={socket}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatBox;
