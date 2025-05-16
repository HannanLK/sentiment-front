// src/components/FileUploadToggle.jsx
import { FaRegFileLines, FaPlus } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

export default function FileUploadToggle({ onFileSelect, clearFileName }) {
  const [showPopup, setShowPopup] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (clearFileName) {
      setUploadedFileName("");
    }
  }, [clearFileName]);

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
      setUploadedFileName(file.name);
      onFileSelect(file);
    }
    setShowPopup(false);
  };

  return (
    <div className="relative flex items-center gap-2" ref={wrapperRef}>
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
        title="Upload file"
      >
        <FaPlus className="w-4 h-4 text-black dark:text-white" />
      </button>
      {uploadedFileName && (
        <span className="text-lg text-gray-700 dark:text-gray-200 pl-2 font-light">
          <span className="font-normal"> Uploaded:</span> <span className="pl-2">{uploadedFileName}</span>
        </span>
      )}

      {showPopup && (
        <div className="absolute top-12 left-0 z-10 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-white p-2 min-w-[240px]">
          <label className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors w-full">
            <FaRegFileLines className="w-5 h-5 text-black dark:text-white" />
            <span className="text-lg text-gray-700 dark:text-gray-200 whitespace-normal text-left pl-2">
              Add .txt or .csv file
            </span>
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
