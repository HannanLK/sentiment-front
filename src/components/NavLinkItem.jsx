// src/components/NavLinkItem.jsx
import { Link } from "react-router-dom";

export default function NavLinkItem({ to, label, activePath }) {
  const isActive = activePath === to;
  const activeColor = "text-[#4fc3f7]";
  const hoverColor = "hover:text-[#4fc3f7]";

  return (
    <Link
      to={to}
      className={`transition-colors duration-200 ${
        isActive ? activeColor : "text-white"
      } ${hoverColor}`}
    >
      {label}
    </Link>
  );
}
