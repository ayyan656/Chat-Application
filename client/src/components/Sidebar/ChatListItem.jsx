import React from "react";

const StackedPhotos = ({ members, isGroup }) => {
  if (!isGroup || !members || members.length === 0) return null;
  const pics = members
    .slice(0, 3)
    .map((m, i) => m.pic || `https://i.pravatar.cc/150?img=${i + 1}`);

  return (
    <div className="flex relative mr-3 flex-shrink-0">
      {pics.map((pic, index) => (
        <img
          key={index}
          className={`h-6 w-6 rounded-full object-cover border-2 border-white absolute transition-transform duration-200`}
          style={{ left: `${index * 12}px`, zIndex: pics.length - index }}
          src={pic}
          alt="Member"
        />
      ))}
      <div className="w-12 h-6"></div>{" "}
    </div>
  );
};

const DiscoverUserItem = ({ user, onSelect, isOnline = false }) => {
  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <div
      className="flex items-center p-3 cursor-pointer hover:bg-purple-50 transition-colors duration-150 rounded-xl mb-2"
      onClick={() => onSelect(user._id)}
    >
      <div className="relative flex-shrink-0">
        {user.pic ? (
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={user.pic}
            alt={user.name}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
            {initial}
          </div>
        )}
        <span
          className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        ></span>{" "}
      </div>
      <div className="flex-1 min-w-0 ml-3">
        <p className={`text-sm truncate text-gray-800 font-semibold`}>
          {user.name}
        </p>
        <p className={`text-xs truncate text-gray-500`}>New User</p>
      </div>
      <div className="ml-2 text-right flex-shrink-0">
        <span className="text-xs text-purple-600 font-semibold">
          Start Chat
        </span>
      </div>
    </div>
  );
};

const ChatListItem = ({ chat, onChatSelect, isOnline = false }) => {
  const isGroup = chat.isGroup;
  const isActive = chat.active;
  const unread = chat.unread;
  const hasMention = unread > 5;

  const initial = chat.name ? chat.name[0].toUpperCase() : "U";

  const activeClasses = isActive
    ? "bg-gray-800 text-white"
    : "hover:bg-gray-50";
  const unreadClasses =
    unread > 0 ? "text-red-500 font-semibold" : "text-gray-500";
  const nameClasses = isActive ? "text-white" : "text-gray-800";
  const latestMsgClasses = isActive ? "text-gray-300" : "text-gray-500";

  return (
    <div
      className={`flex items-center p-3 cursor-pointer transition-colors duration-150 rounded-xl mb-2 ${activeClasses}`}
      onClick={() => onChatSelect(chat.id)}
    >
      {isGroup ? (
        <StackedPhotos members={chat.chatData.users} isGroup={isGroup} />
      ) : (
        <div className="relative flex-shrink-0 mr-3">
          {chat.pic ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={chat.pic}
              alt={chat.name}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
              {initial}
            </div>
          )}

          <span
            className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${nameClasses} font-semibold`}>
          {chat.name}
        </p>
        <p className={`text-xs truncate ${latestMsgClasses}`}>
          {chat.latestMessage}
        </p>
      </div>

      <div className="ml-2 text-right flex-shrink-0 flex items-center space-x-2">
        <p className={`text-xs ${unreadClasses}`}>{chat.time}</p>

        {isGroup && hasMention && (
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-xs font-bold">
            @
          </span>
        )}

        {unread > 0 && !hasMention && (
          <span
            className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-white text-xs font-bold ${
              isGroup ? "bg-blue-500" : "bg-red-500"
            }`}
          >
            {unread}
          </span>
        )}
      </div>
    </div>
  );
};

export { ChatListItem, DiscoverUserItem };
