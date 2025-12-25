import React, { useState, useRef } from "react";
import {
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  EyeIcon,
  CameraIcon,
  UploadIcon,
  TrashIcon,
  PhoneCallIcon,
  CopyIcon,
} from "../UI/Icons";

const ProfilePanel = ({ user, setUser, onClose, isOnline = false }) => {
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAboutText, setEditedAboutText] = useState(
    user.about ||
      "Fill your life experiences, Not things. Have stories to tell. Not stuff to show"
  );
  const [uploadStatus, setUploadStatus] = useState(null); 
  const [selectedFileName, setSelectedFileName] = useState(null);

  const fileInputRef = useRef(null);
  const canEdit = true;

  async function uploadToCloudinary(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://localhost:5000/upload/api", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return data.url;
  }

  const handleToggleEditAbout = () => {
    if (isEditingAbout) {
      setUser((prev) => ({ ...prev, about: editedAboutText }));
    }
    setIsEditingAbout((prev) => !prev);
  };

  const handleImageClick = (e) => {
    if (!canEdit) return;
    e.stopPropagation();
    fileInputRef.current.click();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 shadow-xl">
      <div className="flex items-center p-6">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white lg:hidden mr-4"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h3 className="text-3xl font-bold">Profile</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setSelectedFileName(file.name);
            setUploadStatus("uploading");

            try {
              const url = await uploadToCloudinary(file);

              // Update user picture
              setUser((prev) => ({
                ...prev,
                pic: url,
              }));

              // Show success message
              setUploadStatus("success");
              setTimeout(() => setUploadStatus(null), 2000);
            } catch (error) {
              console.error("Upload error:", error);
              setUploadStatus(null);
            }
          }}
        />

        <div className="relative flex justify-center py-8">
          {/* Upload Status Section */}
          {(uploadStatus || selectedFileName) && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg mb-4 text-center shadow-lg">
              <p className="text-sm font-medium">
                Choose File {selectedFileName && `${selectedFileName}`}
              </p>
              {uploadStatus === "uploading" && (
                <p className="text-xs text-purple-200 mt-1">Uploading...</p>
              )}
              {uploadStatus === "success" && (
                <p className="text-xs text-green-200 mt-1">
                  Upload successful!
                </p>
              )}
            </div>
          )}

          <div
            className="relative cursor-pointer group"
            onClick={handleImageClick}
          >
            <img
              className="h-40 w-40 rounded-2xl object-cover shadow-lg transition-transform duration-200 group-hover:scale-105"
              src={
                user.pic ||
                `https://via.placeholder.com/300/17a2b8/ffffff?text=${
                  user.name?.[0] || "U"
                }`
              }
              alt={user.name}
            />

            {/* Online Status Indicator */}
            {isOnline && (
              <span className="absolute bottom-2 right-2 block h-5 w-5 rounded-full ring-3 ring-white bg-green-500"></span>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-2xl transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                <CameraIcon className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-xs text-white font-medium block">
                  Click to change photo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-sm text-gray-400 mb-1">Name</p>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-green-500"
                    title="Online"
                  ></span>
                  <span className="text-xs font-semibold text-green-400">
                    Online
                  </span>
                </>
              ) : (
                <span className="text-xs font-semibold text-gray-400">
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-sm text-gray-400 mb-2">About</p>
          <div className="flex items-start justify-between">
            {isEditingAbout ? (
              <textarea
                className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg text-sm resize-none focus:ring-purple-500 focus:border-purple-500 text-gray-200 outline-none"
                rows="3"
                value={editedAboutText}
                onChange={(e) => setEditedAboutText(e.target.value)}
              />
            ) : (
              <p className="text-base text-gray-200 pr-4">{editedAboutText}</p>
            )}

            {canEdit && (
              <button
                onClick={handleToggleEditAbout}
                className="text-gray-400 hover:text-purple-400 p-1 flex-shrink-0 transition-colors"
              >
                {isEditingAbout ? (
                  <SaveIcon className="w-6 h-6" />
                ) : (
                  <EditIcon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Phone</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PhoneCallIcon className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-base text-white">{user.phone}</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <CopyIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
