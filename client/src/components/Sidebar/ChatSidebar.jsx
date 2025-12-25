import React, { useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  ChatIcon,
  PhoneIcon,
  MailIcon,
  LogoutIcon,
  HashtagIcon,
} from "../UI/Icons";
import { ChatListItem, DiscoverUserItem } from "./ChatListItem";
import FileUploadToBackend from "../FileUploadToBackend"; 

const ChatSidebar = ({
  chats,
  onChatSelect,
  activeChatUser,
  onNewChatClick,
  discoverableUsers,
  onUserChatStart,
  onLogout,
  onProfilePictureUpdate,
  onlineUsers,
}) => {
  const filters = ["DIRECT", "GROUPS", "PUBLIC"];
  const [activeFilter, setActiveFilter] = useState("DIRECT");

  // Filter chats based on selected filter
  const filteredChats = chats.filter((chat) => {
    if (activeFilter === "DIRECT") return !chat.isGroup;
    if (activeFilter === "GROUPS") return chat.isGroup;
    return true;
  });

  const showDiscover =
    activeFilter === "DIRECT" && discoverableUsers.length > 0;

  const handleCloudinaryUploadSuccess = (data) => {
    if (onProfilePictureUpdate) {
      onProfilePictureUpdate(data.url, data.public_id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 overflow-y-auto">
      <div className="flex space-x-4 mb-4 items-center pb-4 border-b border-gray-100">
        <div className="p-2 rounded-xl bg-purple-100 text-purple-600 relative flex-shrink-0">
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          <ChatIcon />
        </div>

        <div className="p-2 rounded-xl text-gray-500 flex-shrink-0">
          <PhoneIcon />
        </div>

        <div className="p-2 rounded-xl text-gray-500 relative flex-shrink-0">
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          <MailIcon />
        </div>

        <button
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
          onClick={onLogout}
          title="Logout"
        >
          <LogoutIcon />
        </button>

        <div className="ml-auto flex-shrink-0">
          <FileUploadToBackend onUploadSuccess={handleCloudinaryUploadSuccess}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-teal-400 to-cyan-500">
              <img
                key={activeChatUser.pic}
                className="w-full h-full object-cover"
                src={
                  activeChatUser.pic ||
                  `https://via.placeholder.com/150/17a2b8/ffffff?text=${
                    activeChatUser.name?.[0] || "U"
                  }`
                }
                alt="Current User Profile"
                title="Click to change profile picture"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.src = `https://via.placeholder.com/150/17a2b8/ffffff?text=${
                    activeChatUser.name?.[0] || "U"
                  }`;
                }}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs font-semibold">Edit</span>
                </div>
              </div>
            </div>
          </FileUploadToBackend>
        </div>
      </div>

      {/* Chats Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Chats</h2>
        <button
          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          onClick={onNewChatClick}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Filters */}
      <div className="flex text-sm space-x-4 mb-4 border-b border-gray-100 pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`font-semibold pb-1 transition-all duration-200 ${
              activeFilter === filter
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-purple-500"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onChatSelect={onChatSelect}
            isOnline={onlineUsers.includes(
              chat.chatData?.users?.find((u) => u._id !== activeChatUser._id)
                ?._id
            )}
          />
        ))}

        {showDiscover && (
          <>
            <div className="flex items-center text-gray-500 font-semibold text-xs mt-6 mb-3 border-t border-gray-100 pt-3">
              <HashtagIcon className="w-4 h-4 mr-2" /> DISCOVER PEOPLE
            </div>
            {discoverableUsers.map((user) => (
              <DiscoverUserItem
                key={user._id}
                user={user}
                onSelect={onUserChatStart}
                isOnline={onlineUsers.includes(user._id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
