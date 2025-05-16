import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function MobileMenu({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-90 text-white p-6 md:hidden transition-all">
      <div className="flex justify-end">
        <X size={28} className="cursor-pointer" onClick={() => setIsOpen(false)} />
      </div>
      <div className="mt-6 space-y-4 text-xl">
        <Link to="/textSentiment" onClick={() => setIsOpen(false)} className="block hover:underline">
          Text Analyzer
        </Link>
        <Link to="/productSentiment" onClick={() => setIsOpen(false)} className="block hover:underline">
          Product Reviews
        </Link>
        <Link to="/socialSentiment" onClick={() => setIsOpen(false)} className="block hover:underline">
          Social Media
        </Link>
      </div>
    </div>
  );
}
