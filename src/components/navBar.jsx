// src/components/navBar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NavLinkItem from "./NavLinkItem";
import MobileMenu from "./MobileMenu";

export default function NavBar() {
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 shadow-md transition-colors duration-300 ${
          theme === "dark" ? "bg-[#333333] text-white" : "bg-black text-white"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="font-logo text-2xl font-bold">
            VibeCheck
          </Link>
        </div>

        {/* Nav Links - only show on desktop */}
        <div className="hidden sm:flex gap-10 tracking-wider font-roboto text-lg font-normal">
          <NavLinkItem to="/textSentiment" label="Text Analyzer" activePath={location.pathname} />
          <NavLinkItem to="/socialSentiment" label="Social Media" activePath={location.pathname} />
        </div>

        {/* Theme & Avatar */}
        <div className="flex items-center gap-4">
          <ThemeToggle onThemeChange={setTheme} />
        </div>
      </nav>
    </>
  );
}
