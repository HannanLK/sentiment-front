import { BsFillLightningChargeFill } from "react-icons/bs";

export default function AnalyzeButton({ onClick }) {
  return (
    <button
      className="flex items-center gap-1 border rounded px-3 py-1 text-sm font-medium shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
      onClick={onClick}
    >
      <BsFillLightningChargeFill className="text-yellow-500" />
      Analyze Text
    </button>
  );
}
