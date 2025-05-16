// src/pages/textSentiment.jsx
import { useState } from "react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { FaRegTrashAlt } from "react-icons/fa";
import FileUploadToggle from "../components/FileUploadToggle";
import AnalyzeButton from "../components/AnalyzeButton";

export default function TextSentiment() {
  const [text, setText] = useState("");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setText((prev) => prev + "\n" + e.target.result);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    // TODO: Replace with real analysis logic
    console.log("Analyzing text:", text);
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-white dark:bg-[#0a1124] transition-colors duration-300">
      <div className="w-4/5 px-4 py-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            What's the vibe? Enter your text to reveal its sentiment
          </h2>
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent shadow-sm">
          <Textarea
            id="sentiment-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Type or paste something here..."
            className="w-full resize-none min-h-[200px] max-h-[500px] overflow-auto bg-transparent text-gray-800 dark:text-white focus:outline-none border-none px-4 py-3 text-base"
          />
          {/* Action Bar Below Textarea */}
          <div className="flex flex-row justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-b-lg gap-2">
            {/* File Upload on Left */}
            <div className="flex items-center">
              <FileUploadToggle onFileSelect={handleFileSelect} />
            </div>
            {/* Analyze and Clear on Right */}
            <div className="flex items-center gap-2">
              <AnalyzeButton
                onClick={handleAnalyze}
                className="h-10 px-4 flex items-center justify-center rounded-md font-semibold text-base border border-black dark:border-blue-500 bg-white dark:bg-blue-900 text-black dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-800 transition-colors duration-200"
              />
              <button
                className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-md border border-transparent hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                title="Clear text"
                onClick={handleClear}
              >
                <FaRegTrashAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
