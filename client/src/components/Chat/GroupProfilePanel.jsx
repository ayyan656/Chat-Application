/* eslint-disable no-unused-vars */
import React from "react";
import { ArrowLeftIcon, PlusIcon, DotsIcon } from "../UI/Icons";

const GroupMemberItem = ({
  member,
  isAdmin,
  isGroupOwner,
  isOnline = false,
}) => (
  <div className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="relative">
      <img
        className="h-10 w-10 rounded-full object-cover"
        src={member.pic}
        alt={member.name}
      />
      {isOnline && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500"></span>
      )}
    </div>
    <div className="ml-3 flex-1">
      <p className="font-semibold text-gray-800">{member.name}</p>
      {isAdmin && <span className="text-sm text-purple-600">Admin</span>}
    </div>
    {isGroupOwner && (
      <button className="text-red-400 hover:text-red-600 text-sm p-1">
        <DotsIcon className="w-5 h-5" />
      </button>
    )}
  </div>
);

const GroupProfilePanel = ({ group, onClose, onlineUsers = [] }) => {
  const isGroupOwner = true;

  return (
    <div className="flex flex-col h-full bg-white shadow-xl rounded-xl">
      <div className="flex flex-col items-center p-6 border-b border-gray-100">
        <div className="relative h-24 w-24 mb-3 flex items-center justify-center border border-gray-300 rounded-full">
          <img
            className="h-full w-full rounded-full object-cover"
            src={
              group.pic ||
              "https://via.placeholder.com/150/0000FF/FFFFFF?text=G"
            }
            alt={group.name}
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
        <p className="text-sm text-gray-500">Group Owner: You</p>
        <p className="text-xs text-gray-400 mt-1">Created on Jan 1, 2024</p>
      </div>

      {/* Members Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <h4 className="font-semibold text-lg text-gray-700 mb-3">
          Members ({group.members.length})
        </h4>

        {/* Add Member Button */}
        {isGroupOwner && (
          <button className="flex items-center text-purple-600 font-semibold mb-4 p-2 rounded-xl hover:bg-purple-50 transition-colors">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Member
          </button>
        )}

        <div className="space-y-1">
          {group.members.map((member, index) => (
            <GroupMemberItem
              key={member.id}
              member={member}
              isAdmin={index === 0} 
              isGroupOwner={isGroupOwner}
              isOnline={onlineUsers.includes(member._id || member.id)}
            />
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full py-3 px-4 text-red-600 border border-red-200 bg-white font-semibold rounded-xl hover:bg-red-50 transition-colors">
          <span className="text-sm">Leave Group</span>
        </button>
      </div>
    </div>
  );
};

export default GroupProfilePanel;
