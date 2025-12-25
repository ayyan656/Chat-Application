import React, { useState } from "react";
import axios from "axios";
const BACKEND_URL = "http://localhost:5000/api/user";

const AuthForm = ({ type, onSwitchView, onAuthSuccess }) => {
  const isLogin = type === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(""); // For profile picture upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      setError("Please Select an Image.");
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app"); // Use your Cloudinary preset name
      data.append("cloud_name", "your-cloud-name"); // Use your Cloudinary cloud name

      axios
        .post(
          "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
          data
        )
        .then((res) => {
          setPic(res.data.url.toString()); // Save the image URL from Axios response
          setLoading(false);
        })
        .catch((err) => {
          console.error("Cloudinary Upload Error:", err);
          setError("Image upload failed. Try a smaller file.");
          setLoading(false);
        });
    } else {
      setError("Please Select an Image (JPEG/PNG).");
      setLoading(false);
    }
  };

  // Main API Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? `${BACKEND_URL}/login` : BACKEND_URL;
    const body = isLogin ? { email, password } : { name, email, password, pic };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(endpoint, body, config);

      onAuthSuccess(data); 
    } catch (err) {
      setError(err.response?.data?.message || "An unknown error occurred.");
      console.error("API Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {isLogin ? "Welcome Back!" : "Create Your Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Your Full Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email Address"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password Field*/}
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-colors"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {/* Profile Picture Upload  */}
        {!isLogin && (
          <div className="flex items-center space-x-3">
            <label className="text-gray-600 flex-shrink-0">
              Profile Picture (Optional):
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              onChange={(e) => postDetails(e.target.files[0])} 
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 font-bold text-white rounded-xl transition-colors flex items-center justify-center space-x-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span>{isLogin ? "Login" : "Register"}</span>
        </button>
      </form>

      {/* Switch View Link */}
      <p className="text-center text-sm text-gray-600 mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          onClick={onSwitchView}
        >
          {isLogin ? "Register Now" : "Login Here"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
