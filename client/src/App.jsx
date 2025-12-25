import React, { useState } from "react";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";

const App = () => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const handleAuthSuccess = (userInfo) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    setUser(userInfo);

    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("chat-app-chats");
    setUser(null);

    window.location.reload();
  };

  if (user) {
    return <ChatPage currentUser={user} onLogout={handleLogout} />;
  } else {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }
};

export default App;
