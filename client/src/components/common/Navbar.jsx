import React, { useState } from "react";
import { Search, Bell, LogIn, LogOut, Menu, X } from "lucide-react";
import image from "../../assets/artlover.jpeg";
import Logo from "../../assets/navbar-logo.jpg";
import NotificationsPopup from "./Notification"; // 

const Navbar = ({ onToggleSidebar }) => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = () => setIsSignedIn(!isSignedIn);

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

            {/* Right Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-slate-300 hover:text-white p-2.5 rounded-xl hover:bg-slate-800">
                <NotificationsPopup />
              </button>

              {/* Profile Image */}
              <img
                src={image}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-slate-700"
              />

              <button
                onClick={handleAuthClick}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isSignedIn
                    ? "bg-red-600 hover:bg-red-700 shadow-lg text-white"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg text-white"
                }`}
              >
                {isSignedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {isSignedIn ? "Sign Out" : "Sign In"}
              </button>
            </div>

            {/* Mobile Right */}
            <div className="md:hidden flex items-center space-x-2">
              <button className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-slate-800">
                <Bell className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">JD</span>
              </div>
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
            <button
              onClick={handleAuthClick}
              className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition ${
                isSignedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isSignedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {isSignedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
