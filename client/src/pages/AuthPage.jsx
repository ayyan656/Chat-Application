import React, { useState } from "react";
import AuthForm from "../components/Auth/AuthForm";

const AuthPage = ({ onAuthSuccess }) => {
  const [view, setView] = useState("login");

  const toggleView = () => {
    setView((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Chat <span className="text-purple-600">ONN</span>
        </h1>
        <p className="text-gray-500 text-center mt-1">Real-Time Messaging</p>
      </div>

      <AuthForm
        type={view}
        onSwitchView={toggleView}
        onAuthSuccess={onAuthSuccess}
      />

      <p className="text-sm text-gray-400 mt-8">
        © 2024 Chat ONN. All rights reserved.
      </p>
    </div>
  );
};

export default AuthPage;
