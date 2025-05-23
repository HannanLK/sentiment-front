import { FaReddit, FaTwitter, FaYoutube } from 'react-icons/fa';

const platforms = [
  { name: 'Twitter', icon: <FaTwitter className="mr-2" /> },
  { name: 'Reddit', icon: <FaReddit className="mr-2" /> },
  { name: 'YouTube', icon: <FaYoutube className="mr-2" /> },
];

const PlatformDropdown = ({ platform, alwaysVisible }) => {
  return (
    <div className="flex space-x-2">
      {platforms.map((p) => (
        <div
          key={p.name}
          className={`flex items-center px-2 py-1 rounded transition-colors duration-150 ${platform === p.name ? 'bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600' : 'bg-gray-100 dark:bg-gray-700 border border-transparent'} ${alwaysVisible ? '' : 'opacity-50'}`}
        >
          {p.icon}
          <span className="font-medium text-sm">{p.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PlatformDropdown; 