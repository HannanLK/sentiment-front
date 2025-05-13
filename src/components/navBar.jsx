import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Switch } from "./ui/switch"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./ui/navigation-menu"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="w-full flex items-center justify-between bg-neutral-900 text-white px-4 py-2 shadow-md relative">
      {/* Avatar on the left */}
      <Link to="/userProfile" className="flex items-center z-20">
        <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      {/* Desktop Nav */}
      <div className="hidden md:flex flex-1 items-center justify-between ml-4">
        <Link to="/textSentiment" className="text-3xl font-normal italic font-[Italiana] tracking-wide hover:opacity-80 transition-opacity">
          VibeCheck
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/textSentiment" className="px-6 py-2 text-lg font-light border-b-2 border-white/80 hover:opacity-80 transition-all">
                  Text Analyzer
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/productSentiment" className="px-6 py-2 text-lg font-light hover:border-b-2 hover:border-white/80 hover:opacity-80 transition-all">
                  Product Reviews
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/socialSentiment" className="px-6 py-2 text-lg font-light hover:border-b-2 hover:border-white/80 hover:opacity-80 transition-all">
                  Social Media
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4 ml-4">
          <Switch />
        </div>
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden z-20 p-2 ml-auto"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Open navigation menu"
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/70 z-10 flex flex-col items-end">
          <div className="w-3/4 max-w-xs bg-neutral-900 h-full p-6 flex flex-col gap-6 animate-slide-in-right">
            <Link
              to="/userProfile"
              className="flex items-center mb-4"
              onClick={() => setMobileOpen(false)}
            >
              <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-lg font-medium">Profile</span>
            </Link>
            <Link
              to="/textSentiment"
              className="text-2xl font-[Italiana] mb-4 hover:opacity-80 transition-opacity"
              onClick={() => setMobileOpen(false)}
            >
              VibeCheck
            </Link>
            <Link
              to="/textSentiment"
              className="py-2 text-lg font-light border-b border-white/20 hover:opacity-80 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Text Analyzer
            </Link>
            <Link
              to="/productSentiment"
              className="py-2 text-lg font-light border-b border-white/20 hover:opacity-80 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Product Reviews
            </Link>
            <Link
              to="/socialSentiment"
              className="py-2 text-lg font-light border-b border-white/20 hover:opacity-80 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Social Media
            </Link>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm">Theme</span>
              <Switch />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}


