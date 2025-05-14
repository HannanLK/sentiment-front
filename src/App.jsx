// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/navBar";
import TextSentiment from "./pages/textSentiment.jsx";
import ProductSentiment from "./pages/productSentiment.jsx";
import SocialSentiment from "./pages/socialSentiment.jsx";
import UserProfile from "./pages/userProfile.jsx";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <div className="pt-16 bg-white text-black dark:bg-black dark:text-white min-h-screen transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Navigate to="/textSentiment" replace />} />
          <Route path="/textSentiment" element={<TextSentiment />} />
          <Route path="/productSentiment" element={<ProductSentiment />} />
          <Route path="/socialSentiment" element={<SocialSentiment />} />
          <Route path="/userProfile" element={<UserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
