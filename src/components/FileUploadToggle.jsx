import { FaRegFileLines } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

export default function FileUploadToggle({ onFileSelect }) {
  const [showPopup, setShowPopup] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!showPopup) return;
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "text/plain" || file.name.endsWith(".csv"))) {
      onFileSelect(file);
    }
    setShowPopup(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600 border-2 border-red-800"
      >
        <FaPlus className="w-5 h-5 text-white" />
      </button>

      {showPopup && (
        <div className="absolute top-12 left-0 z-10 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-white p-2 min-w-[240px]">
          <label className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors w-full">
            <FaRegFileLines className="w-5 h-5 text-black dark:text-white" />
            <span className="text-lg text-gray-700 dark:text-gray-200 whitespace-normal text-left pl-2">Add .txt or .csv file</span>
            <input
              type="file"
              accept=".txt,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
}
