// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";

import NavBar from "./components/navBar";
import TextSentiment from "./pages/textSentiment.jsx";
import SocialSentiment from "./pages/socialSentiment.jsx";

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
      
      {/* Toast notification context */}
      <Toaster position="bottom-right" richColors theme="system" />

      <div className="pt-16 bg-white text-black dark:bg-[#0a1124] dark:text-white min-h-screen transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Navigate to="/textSentiment" replace />} />
          <Route path="/textSentiment" element={<TextSentiment />} />
          <Route path="/socialSentiment" element={<SocialSentiment />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
