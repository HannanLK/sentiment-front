// src/components/AnalyzeButton.jsx
import { BsFillLightningChargeFill } from "react-icons/bs";

export default function AnalyzeButton({ onClick, className, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 h-10 px-4 rounded-md font-semibold text-lg tracking-wider border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <BsFillLightningChargeFill className="text-blue-500 size-5" />
      {children || "Analyze Text"}
    </button>
  );
}
