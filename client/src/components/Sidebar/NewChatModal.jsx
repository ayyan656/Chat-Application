import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { SearchIcon, PlusIcon, ArrowLeftIcon } from "../UI/Icons";

const ENDPOINT = "http://localhost:5000";

const ContactListItem = ({ user, onSelect, isSelected, isGroupMember }) => (
  <div
    className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl"
    onClick={() => onSelect(user)}
  >
    <img
      className="h-10 w-10 rounded-full object-cover"
      src={user.pic}
      alt={user.name}
    />
    <div className="flex-1 min-w-0 ml-3">
      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>
    {isGroupMember ? (
      <span className="text-xs text-green-600 font-semibold">Added</span>
    ) : (
      <button
        className={`p-1.5 rounded-full ${
          isSelected
            ? "bg-purple-600 text-white"
            : "border border-gray-300 text-gray-400"
        }`}
      >
        {isSelected ? (
          <ArrowLeftIcon className="w-4 h-4 transform rotate-180" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )}
      </button>
    )}
  </div>
);

const NewChatModal = ({ onClose, onGroupCreate, currentUser, fetchChats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]); 
  const [view, setView] = useState("main"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- API: Search Users ---
  const handleSearch = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      // API Call to search users
      const { data } = await axios.get(
        `${ENDPOINT}/api/user?search=${searchTerm}`,
        config
      );
      setSearchResults(data);
    } catch {
      setError("Failed to load search results.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentUser.token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const handleAccessChat = async (user) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      await axios.post(`${ENDPOINT}/api/chat`, { userId: user._id }, config);

      // Success: refresh chat list and close modal
      fetchChats();
      onClose();
    } catch {
      setError("Failed to start chat.");
    } finally {
      setLoading(false);
    }
  };

  // --- Group Creation Handlers ---
  const handleMemberSelect = (user) => {
    setSelectedMembers((prev) =>
      prev.find((m) => m._id === user._id)
        ? prev.filter((m) => m._id !== user._id)
        : [...prev, user]
    );
  };

  const handleGroupSubmit = () => {
    const userIds = selectedMembers.map((u) => u._id);

    if (groupName && userIds.length > 0) {
      onGroupCreate({ name: groupName, users: userIds });
    }
  };

  const renderMainView = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Chat / Group</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-600 hover:text-red-600"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
          {error}
        </div>
      )}

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search people or groups"
          className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-3 mb-6">
        <button
          className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          onClick={() => setView("createGroup")}
        >
          <PlusIcon className="w-6 h-6 mr-3 text-purple-600" />
          <span className="font-semibold text-gray-800">Create New Group</span>
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Search Results
      </h3>
      <div className="space-y-1 overflow-y-auto flex-1">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : searchResults.length > 0 ? (
          searchResults.map((user) => (
            <ContactListItem
              key={user._id}
              user={user}
              onSelect={handleAccessChat}
              isSelected={false}
            />
          ))
        ) : searchTerm && !loading ? (
          <div className="text-center text-gray-500">No users found.</div>
        ) : (
          <div className="text-center text-gray-400">
            Start typing to search users.
          </div>
        )}
      </div>
    </>
  );

  const renderCreateGroupView = () => (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={() => setView("main")}
          className="p-2 mr-3 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Create Group</h2>
      </div>

      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Group Name (e.g., Design Bro's)"
        className="w-full py-2 px-4 border border-gray-300 rounded-xl mb-3 focus:ring-purple-500 focus:border-purple-500"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users to add..."
          className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-3 mb-4 border-b border-gray-100">
        {selectedMembers.length > 0 ? (
          selectedMembers.map((m) => (
            <div key={m._id} className="relative flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={m.pic}
                alt={m.name}
              />
              <button
                onClick={() => handleMemberSelect(m)}
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
              >
                x
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Select members below...</p>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-3">Users Found</h3>
      <div className="space-y-1 overflow-y-auto flex-1">
        {loading ? (
          <div className="text-center text-gray-500">Searching...</div>
        ) : searchResults.length > 0 ? (
          searchResults.map((user) => (
            <ContactListItem
              key={user._id}
              user={user}
              onSelect={handleMemberSelect}
              isSelected={selectedMembers.find((m) => m._id === user._id)}
            />
          ))
        ) : searchTerm && !loading ? (
          <div className="text-center text-gray-500">No users found.</div>
        ) : (
          <div className="text-center text-gray-400">
            Start typing to find users to add.
          </div>
        )}
      </div>

      <button
        className={`w-full py-3 mt-4 font-bold text-white rounded-xl transition-colors ${
          groupName && selectedMembers.length > 0
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={handleGroupSubmit}
        disabled={!groupName || selectedMembers.length === 0}
      >
        Create Group ({selectedMembers.length} Members)
      </button>
    </>
  );

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-50 p-6 flex flex-col">
      {view === "main" && renderMainView()}
      {view === "createGroup" && renderCreateGroupView()}
    </div>
  );
};

export default NewChatModal;
