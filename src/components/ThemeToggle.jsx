// src/components/ThemeToggle.jsx
import { useEffect, useState } from "react";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";

export default function ThemeToggle({ onThemeChange }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    onThemeChange(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    onThemeChange(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="text-xl">
      {theme === "dark" ? <MdOutlineLightMode /> : <MdDarkMode />}
    </button>
  );
}
