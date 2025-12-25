import React from "react";
import { PhoneIcon, VideoIcon, DotsIcon, ArrowLeftIcon } from "../UI/Icons";

const ChatHeader = ({
  user,
  onBackClick,
  onProfileClick,
  onlineUsers = [],
  currentUser,
}) => {
  if (!user) return <div className="p-4 border-b">Loading Chat...</div>;

  const initial = user.name ? user.name[0].toUpperCase() : "U";

  const isOnline =
    !user.isGroup &&
    onlineUsers.includes(
      user.chatData?.users?.find((u) => u._id !== currentUser?._id)?._id
    );

  const statusText = user.isGroup
    ? `${user.chatData?.users?.length || 0} Members`
    : isOnline
    ? "Online"
    : "Offline";

  return (
    <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-100 bg-white shadow-sm">
      <div className="flex items-center">
        <button
          className="lg:hidden p-2 mr-2 text-gray-600 hover:text-purple-600"
          onClick={onBackClick}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <div
          className="flex items-center cursor-pointer"
          onClick={onProfileClick}
        >
          <div className="relative">
            {user.pic ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.pic}
                alt={user.name}
              />
            ) : (
              // Fallback Avatar
              <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-800">
                {initial}
              </div>
            )}

            <span
              className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
          <div className="ml-3">
            <p className="text-lg font-semibold text-gray-800">{user.name}</p>
            <p
              className={`text-sm ${
                isOnline ? "text-green-600" : "text-gray-500"
              }`}
            >
              {statusText}
            </p>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 text-gray-500">
        <PhoneIcon className="w-6 h-6 hover:text-purple-600 cursor-pointer" />
        <VideoIcon className="w-6 h-6 hover:text-purple-600 cursor-pointer" />
        <DotsIcon className="w-6 h-6 hover:text-purple-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatHeader;
