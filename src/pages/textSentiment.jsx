// src/pages/textSentiment.jsx
import { useState, useEffect, useRef } from "react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { FaRegTrashAlt } from "react-icons/fa";
import FileUploadToggle from "../components/FileUploadToggle";
import AnalyzeButton from "../components/AnalyzeButton";

export default function TextSentiment() {
  const [text, setText] = useState("");
  const [clearFile, setClearFile] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.split(/\s+/).length < 3) {
      setWarningMessage("Please enter at least 3 words to analyze");
      setTimeout(() => {
        setWarningMessage("");
      }, 3000);
      return;
    }
    // TODO: Replace with real analysis logic
    console.log("Analyzing text:", text);
  };

  const handleClear = () => {
    setText("");
    setClearFile(true);
    setTimeout(() => setClearFile(false), 100);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-white dark:bg-[#0a1124] transition-colors duration-300">
      <div className="w-4/5 px-4 py-8">
          <h2 className="text-3xl mb-5 font-roboto font-light tracking-wide text-gray-800 dark:text-white">
            What's the vibe? Enter text to reveal its sentiment..
          </h2>
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent shadow-md">
          <Textarea
            ref={textareaRef}
            id="sentiment-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Type or paste something here..."
            className="w-full h-[200px] overflow-y-auto bg-transparent text-gray-800 dark:text-white focus:outline-none border-none px-4 py-3 font-roboto text-lg dark:bg-[#161616dc]"
          />
          {/* Action Bar Below Textarea */}
          <div className="flex flex-row justify-between items-center px-4 py-1.5 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-black rounded-b-lg gap-2">
            {/* File Upload on Left */}
            <div className="flex items-center">
              <FileUploadToggle onFileSelect={handleFileSelect} clearFileName={clearFile} />
            </div>
            {/* Analyze and Clear on Right */}
            <div className="flex items-center gap-2">
              <AnalyzeButton
                onClick={handleAnalyze}
                className="h-8 px-3 flex items-center justify-center rounded-md text-sm font-medium border border-black dark:border-blue-500 text-black dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-800 transition-colors duration-200"
              />
              <button
                className="h-8 w-8 flex items-center justify-center text-black dark:text-white border border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                title="Clear text"
                onClick={handleClear}
              >
                <FaRegTrashAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Popup */}
      {warningMessage && (
        <div className="fixed top-20 right-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out text-sm">
          {warningMessage}
        </div>
      )}
    </div>
  );
}
