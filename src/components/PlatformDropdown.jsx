import { FaReddit, FaTwitter, FaYoutube } from 'react-icons/fa';
import React from 'react';

const platforms = [
  { value: '', name: 'Auto-detect', icon: null },
  { value: 'Twitter', name: 'Twitter', icon: <FaTwitter className="inline mr-2 align-middle" /> },
  { value: 'Reddit', name: 'Reddit', icon: <FaReddit className="inline mr-2 align-middle" /> },
  { value: 'YouTube', name: 'YouTube', icon: <FaYoutube className="inline mr-2 align-middle" /> },
];

const PlatformDropdown = ({ value, onChange, disabled }) => {
  return (
    <select
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className="h-9 rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
      aria-label="Select platform"
      style={{ minWidth: 120 }}
    >
      {platforms.map((p) => (
        <option key={p.value} value={p.value}>
          {p.name}
        </option>
      ))}
    </select>
  );
};

export default PlatformDropdown; 