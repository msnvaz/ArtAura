import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, ShoppingBag, HelpCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  profileImage,
  userName = "Pawani Kumari",
  isSignedIn,
  onSignOut,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: User, label: "Posts", href: "/my-posts" },
  ];

  const handleMenuItemClick = (href) => {
    setIsOpen(false);
    navigate(href);
  };

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
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.href)}
                className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/10 transition-colors w-full text-left"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-white/20 pt-1">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-[#D87C5A] hover:bg-[#D87C5A]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#362625] mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutConfirm(false);
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white rounded-xl hover:from-[#c0392b] hover:to-[#a93226] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[120px]"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
