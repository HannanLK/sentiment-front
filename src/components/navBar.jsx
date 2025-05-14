// src/components/navBar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NavLinkItem from "./NavLinkItem";
import MobileMenu from "./MobileMenu";

export default function NavBar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          {/* Mobile Menu Icon */}
          <div className="md:hidden cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>

          {/* Logo */}
          <Link to="/" className="font-logo text-2xl font-bold">
            VibeCheck
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-10 tracking-wider font-open-sans text-lg">
          <NavLinkItem to="/textSentiment" label="Text Analyzer" activePath={location.pathname} />
          <NavLinkItem to="/productSentiment" label="Product Reviews" activePath={location.pathname} />
          <NavLinkItem to="/socialSentiment" label="Social Media" activePath={location.pathname} />
        </div>

        {/* Theme & Avatar */}
        <div className="flex items-center gap-4">
          <ThemeToggle onThemeChange={setTheme} />
          <Link to="/userProfile">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </>
  );
}
