import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaRegEdit, FaGlobe } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <>
      {/* Footer (now above nav for mobile visibility) */}
      <footer
        className="w-full px-4 py-2 text-sm border-t border-gray-200 dark:border-gray-800
                   flex justify-between items-center
                   mb-15
                   bg-transparent text-gray-800 dark:text-gray-100
                   sm:bg-black sm:text-gray-200 sm:mb-0"
        style={{ minHeight: 40 }}
      >
        <span className="font-light">By Hannan Munas | 2025</span>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/hannanlk" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin size={20} />
          </a>
          <a href="https://x.com/HannanMunas" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter size={20} />
          </a>
          <a href="https://www.instagram.com/Hannan.lk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
        </div>
      </footer>

      {/* Mobile Bottom Nav (fixed) */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-black border-t border-gray-800 flex justify-around items-center py-1" style={{ minHeight: 48 }}>
        <NavLink
          to="/textSentiment"
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-2 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400'} group`
          }
        >
          <span className="relative flex flex-col items-center">
            <FaRegEdit size={24} className="mb-0.5" />
            <span className="text-xs font-medium">Text</span>
            {/* Animated underline */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-blue-500 transition-all duration-300 scale-x-0 group-[.active]:scale-x-100" />
          </span>
        </NavLink>
        <NavLink
          to="/socialSentiment"
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-2 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400'} group`
          }
        >
          <span className="relative flex flex-col items-center">
            <FaGlobe size={24} className="mb-0.5" />
            <span className="text-xs font-medium">Social</span>
            {/* Animated underline */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-blue-500 transition-all duration-300 scale-x-0 group-[.active]:scale-x-100" />
          </span>
        </NavLink>
      </nav>
    </>
  );
} 