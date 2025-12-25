import React from "react";

const MessageBubble = ({ message }) => {
  const isSender = message.isSender;
  const bubbleClasses = isSender
    ? "bg-purple-600 text-white rounded-tr-none self-end"
    : "bg-gray-100 text-gray-800 rounded-tl-none self-start";
  const alignClasses = isSender ? "justify-end" : "justify-start";

  return (
    <div className={`flex w-full ${alignClasses} mb-3`}>
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${bubbleClasses}`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <span
          className={`text-[10px] opacity-75 mt-1 ${
            isSender ? "text-purple-200" : "text-gray-500"
          } block text-right`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;

