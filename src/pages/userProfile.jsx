import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function UserProfile() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="size-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">John Doe</h2>
          <p className="text-gray-600">john.doe@example.com</p>
        </div>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">Welcome to your profile page!</p>
      </div>
    </div>
  );
}
