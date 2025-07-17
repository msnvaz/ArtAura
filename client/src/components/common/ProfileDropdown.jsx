import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  ShoppingBag,
  Heart,
  Star,
  HelpCircle,
} from "lucide-react";

const ProfileDropdown = ({
  profileImage,
  userName = "John Doe",
  isSignedIn,
  onSignOut,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: ShoppingBag, label: "Orders", href: "/orders" },
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: Star, label: "Reviews", href: "/reviews" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Image Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border-2 border-white"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#1C0E09] border border-white rounded-xl shadow-lg py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">{userName}</p>
                <p className="text-white/60 text-sm">Artist</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-white/20 pt-1">
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-[#D87C5A] hover:bg-[#D87C5A]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
