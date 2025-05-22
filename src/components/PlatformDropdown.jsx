import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaReddit, FaTwitter, FaYoutube } from 'react-icons/fa'; // Assuming react-icons is used

const PlatformDropdown = ({ platform }) => {
  const renderPlatformIcon = (platformName) => {
    switch (platformName) {
      case 'Reddit':
        return <FaReddit className="mr-2" />;
      case 'Twitter':
        return <FaTwitter className="mr-2" />;
      case 'YouTube':
        return <FaYoutube className="mr-2" />;
      default:
        return null;
    }
  };

  const renderPlatformName = (platformName) => {
    switch (platformName) {
      case 'Reddit':
        return 'Reddit';
      case 'Twitter':
        return 'Twitter';
      case 'YouTube':
        return 'YouTube';
      default:
        return 'Select Platform';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center dark:border-gray-700 dark:text-gray-200 dark:bg-gray-800">
          {platform ? renderPlatformIcon(platform) : null}
          {renderPlatformName(platform)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-gray-900 dark:border-gray-700">
        {/* We might not need selectable items if it's auto-detected, but keeping the structure */}
        {/* <DropdownMenuItem>Reddit</DropdownMenuItem>
        <DropdownMenuItem>Twitter</DropdownMenuItem>
        <DropdownMenuItem>YouTube</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlatformDropdown; 