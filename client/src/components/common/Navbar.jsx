import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  LogIn,
  LogOut,
  Menu,
  X,
  Home,
  ShoppingCart,
} from "lucide-react";
import image from "../../assets/artlover.jpeg";
import Logo from "../../assets/navbar-logo.jpg";
import NotificationsPopup from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = ({ onToggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { token, userId } = useAuth();
  const { toggleCart, getCartItemsCount } = useCart();
  const isSignedIn = !!token;
  const cartItemsCount = getCartItemsCount();

  // Fetch user profile data when component mounts or when token/userId changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userId) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (isSignedIn) {
      fetchUserProfile();
    }
  }, [token, userId, isSignedIn]);

  return (
    <>
      <nav className="bg-[#1C0E09] border-b border-[#FFD95A] fixed top-0 w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo */}
            <div className="flex items-center space-x-4">
              <img
                src={Logo}
                alt="ArtAura Logo"
                className="h-9 w-auto object-contain rounded-lg shadow"
              />
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/community"
                className="text-white font-medium hover:text-[#87CEEB] transition-colors flex items-center gap-2"
              >
                <Home className="h-5 w-5" />
              </a>
              <a
                href="/shop-products"
                className="text-white font-medium hover:text-[#87CEEB] transition-colors"
              >
                Artworks
              </a>
              <a
                href="/artists"
                className="text-white font-medium hover:text-[#87CEEB] transition-colors"
              >
                Artists
              </a>
              <a
                href="/public-challenges"
                className="text-white font-medium hover:text-[#87CEEB] transition-colors"
              >
                Challenges
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-white hover:text-[#87CEEB] transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D87C5A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <NotificationsPopup />

              {/* Profile Dropdown or Sign In Button */}
              {isSignedIn ? (
                <ProfileDropdown
                  profileImage={
                    userProfile?.image
                      ? userProfile.image.startsWith("/uploads/")
                        ? userProfile.image // Use direct path for images in public/uploads
                        : `/uploads/buyer/${userProfile.image}` // Fallback for relative paths
                      : "/default-avatar.png"
                  }
                  userName={userProfile?.name || "User"}
                  isSignedIn={isSignedIn}
                />
              ) : (
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 bg-[#87CEEB] hover:bg-[#D87C5A] text-[#1C0E09]"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-lg p-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="search"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-sm text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <a
              href="/"
              className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition ${
                isSignedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isSignedIn ? (
                <LogOut className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isSignedIn ? "Sign Out" : "Sign In"}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
