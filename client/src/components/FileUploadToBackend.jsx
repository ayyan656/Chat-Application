// src/components/FileUploadToBackend.jsx
import React, { useState, useRef } from "react";

const FileUploadToBackend = ({ onUploadSuccess, children }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload/api", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();

      // Show success feedback
      setUploadSuccess(true);
      setTimeout(() => {
        console.log(
          "Success overlay disappearing, image should now be visible"
        );
        setUploadSuccess(false);
      }, 2000);

      if (onUploadSuccess) onUploadSuccess(data);

      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Clickable Profile Section */}
      <div
        onClick={handleClick}
        className="cursor-pointer relative"
        title="Click to upload profile picture"
      >
        {children}

        {/* Upload Status Overlay */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto mb-2"></div>
              <span className="text-xs font-semibold">Uploading...</span>
            </div>
          </div>
        )}

        {/* Success Status Overlay */}
        {uploadSuccess && (
          <div className="absolute inset-0 rounded-full bg-green-500 bg-opacity-80 flex items-center justify-center animate-pulse">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadToBackend;
