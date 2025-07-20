import React, { useState } from "react";
import { Search, Bell, LogIn, LogOut, Menu, X } from "lucide-react";
import image from "../../assets/artlover.jpeg";
import Logo from "../../assets/navbar-logo.jpg";
import NotificationsPopup from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onToggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token } = useAuth();
  const isSignedIn = !!token;

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 fixed top-0 w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo + Sidebar Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleSidebar}
                className="hidden md:flex text-slate-300 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-300 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo next to hamburger (NOT rounded) */}
              <img
                src={Logo}
                alt="System Logo"
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* Middle: Search (Desktop only) */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-3 py-2.5 w-full bg-slate-800 text-sm text-slate-200 border border-slate-700 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <NotificationsPopup />

              {/* Profile Dropdown or Sign In Button */}
              {isSignedIn ? (
                <ProfileDropdown
                  profileImage={image}
                  userName="John Doe"
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
              href="/login"
              className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition ${
                isSignedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isSignedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {isSignedIn ? "Sign Out" : "Sign In"}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
