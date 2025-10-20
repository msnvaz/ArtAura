import React from "react";
import {
  ShoppingCart,
  LogOut,
  Package,
  Handshake,
  BarChart3,
  User,
  Menu,
  X,
  Settings,
  ChevronDown,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

// Remove mockUser - we'll fetch real data
const mainLinks = [
  { name: "Orders", path: "/shop/orders", icon: ShoppingCart },
  { name: "Catalog", path: "/shop/catalog", icon: Package },
  { name: "Analytics", path: "/shop/analytics", icon: BarChart3 },
  { name: "Sponsorships", path: "/shop/sponsorships", icon: Handshake },
];

function Navbar() {
  const { token, logout, userId } = useAuth();
  const isSignedIn = !!token;
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Add API_URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Add state for shop data
  const [shopData, setShopData] = useState({
    ownerName: "Loading...",
    shopName: "",
    avatar: "/src/assets/user.png",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null); // Track current user

  // Fetch shop data when component mounts
  useEffect(() => {
    const fetchShopData = async () => {
      if (!isSignedIn || !userId) {
        // Clear shop data when user logs out or no user
        setShopData({
          ownerName: "Loading...",
          shopName: "",
          avatar: "/src/assets/user.png",
          status: "",
        });
        setLoading(false);
        setCurrentUserId(null);
        return;
      }

      // Check if user has changed
      if (currentUserId !== null && currentUserId !== userId) {
        console.log(
          "User changed from",
          currentUserId,
          "to",
          userId,
          "- clearing old data"
        );
        setShopData({
          ownerName: "Loading...",
          shopName: "",
          avatar: "/src/assets/user.png",
          status: "",
        });
      }

      setCurrentUserId(userId);

      try {
        setLoading(true);
        const currentToken = localStorage.getItem("token");
        let shopId = localStorage.getItem("shopId");

        // Clear previous data first to avoid showing stale data
        setShopData({
          ownerName: "Loading...",
          shopName: "",
          avatar: "/src/assets/user.png",
          status: "",
        });

        // If shopId is missing or different from current userId, use userId
        if (!shopId || shopId === "null" || shopId !== userId) {
          shopId = userId;
          localStorage.setItem("shopId", shopId);
          console.log("Updated shopId in localStorage to:", shopId);
        }

        // If still no valid shopId, abort fetch
        if (!shopId || shopId === "null") {
          console.error("No valid shopId found in localStorage.");
          setLoading(false);
          return;
        }

        console.log(
          "Fetching shop data for ID:",
          shopId,
          "Current UserId:",
          userId
        );

        const response = await fetch(`${API_URL}/api/shop/${shopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Shop data fetched for navbar:", data);

          setShopData({
            ownerName: data.ownerName || "Shop Owner",
            shopName: data.shopName || "Unknown Shop",
            avatar: "/src/assets/user.png", // You can add avatar field to database later
            status: data.status || "Active",
          });
        } else {
          console.error(
            "Failed to fetch shop data:",
            response.status,
            response.statusText
          );
          setShopData({
            ownerName: "Shop Owner",
            shopName: "Unknown Shop",
            avatar: "/src/assets/user.png",
            status: "Active",
          });
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);

        // Provide more specific error information
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          console.error(
            "Network error: Cannot connect to the server. Check if the backend is running."
          );
        }

        setShopData({
          ownerName: "Shop Owner",
          shopName: "Unknown Shop",
          avatar: "/src/assets/user.png",
          status: "Active",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [isSignedIn, token, userId, API_URL]); // Added userId to dependencies

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
    setShowProfileDropdown(false);
  };

  const confirmLogout = () => {
    // Clear shop data immediately on logout
    setShopData({
      ownerName: "Loading...",
      shopName: "",
      avatar: "/src/assets/user.png",
      status: "",
    });
    setCurrentUserId(null);

    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-[#362625] to-[#362625] shadow-xl border-b border-[#FFD95A]/30 sticky top-0 z-50">
        <div className="max-w-full mx-0 px-1 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center h-16 ">
            {/* LEFT CORNER START - Logo Only */}
            <div className="flex items-center space-x-3">
              {/* ArtAura Logo */}
              <img
                src="/src/assets/logo.jpg"
                alt="ArtAura Logo"
                className="w-10 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-[#FFD95A] to-[#D87C5A] bg-clip-text text-transparent">
                  ArtAura
                </span>
                <span className="text-xs text-[#FFD95A] hidden sm:block">
                  Shop Portal
                </span>
              </div>
            </div>
            {/* LEFT CORNER END */}

            {/* Center Section - Desktop Navigation Links with increased spacing */}
            <div className="hidden md:flex items-center space-x-6">
              {mainLinks.map(({ name, path, icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? "text-[#FFD95A] bg-[#FFE9A0]/10"
                        : "text-[#FFD95A] hover:text-white"
                    }`
                  }
                >
                  {icon && React.createElement(icon, { className: "h-4 w-4" })}
                  <span className="text-sm">{name}</span>
                  {/* Beautiful hover underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#FFD95A] to-[#D87C5A] transition-all duration-300 ${
                      name === "Orders"
                        ? "w-0 group-hover:w-2/3"
                        : name === "Catalog"
                        ? "w-0 group-hover:w-3/4"
                        : name === "Analytics"
                        ? "w-0 group-hover:w-4/5"
                        : "w-0 group-hover:w-5/6"
                    }`}
                  ></span>
                </NavLink>
              ))}
            </div>

            {/* RIGHT CORNER START - Profile */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown - Desktop */}
              {isSignedIn ? (
                <div
                  className="relative hidden md:block"
                  ref={profileDropdownRef}
                >
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 rounded-lg text-[#FFD95A] hover:bg-[#FFE9A0]/20 transition-all duration-200"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-[#FFD95A] bg-[#362625]">
                        {shopData.avatar ? (
                          <AvatarImage
                            src={shopData.avatar}
                            alt={shopData.ownerName}
                          />
                        ) : (
                          <AvatarFallback className="text-[#FFD95A] font-bold text-sm">
                            {loading
                              ? "..."
                              : shopData.ownerName[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {/* Active Status Badge */}
                      {shopData.status === "Active" && (
                        <div className="absolute -top-0.5 -right-0.5 bg-[#66bb6a] text-white p-0.5 rounded-full shadow-lg border border-[#362625]">
                          <svg
                            className="w-2.5 h-2.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        showProfileDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#362625]">
                          {loading ? "Loading..." : shopData.ownerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {loading ? "..." : shopData.shopName}
                        </p>
                      </div>

                      <NavLink
                        to="/shop/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        View Profile
                      </NavLink>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>

                      {/* Add this temporarily after the avatar in the dropdown menu for debugging:
                      <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
                        <p>Debug: {JSON.stringify(shopData, null, 2)}</p>
                      </div>
                      */}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-[#FFD95A] hover:bg-[#D87C5A] hover:text-white no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Login</span>
                </a>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#FFD95A] hover:bg-[#FFE9A0]/20 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            {/* RIGHT CORNER END */}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#362625] border-t border-[#FFD95A]/30">
            <div className="px-2 py-3 space-y-1">
              {/* Mobile Navigation Links */}
              {mainLinks.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-[#FFD95A]/90 text-[#362625] shadow-md"
                        : "text-[#FFD95A] hover:bg-[#FFE9A0]/20"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                  {/* Mobile hover underline */}
                  <span
                    className={`absolute bottom-1 left-4 h-0.5 bg-gradient-to-r from-[#D87C5A] to-[#FFD95A] transition-all duration-300 ${
                      name === "Orders"
                        ? "w-0 group-hover:w-12"
                        : name === "Catalog"
                        ? "w-0 group-hover:w-14"
                        : name === "Analytics"
                        ? "w-0 group-hover:w-16"
                        : "w-0 group-hover:w-20"
                    }`}
                  ></span>
                </NavLink>
              ))}

              {/* Mobile User Section */}
              {isSignedIn && (
                <div className="border-t border-[#FFD95A]/30 pt-3 mt-3 space-y-1">
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-[#FFD95A] bg-[#362625]">
                          {shopData.avatar ? (
                            <AvatarImage
                              src={shopData.avatar}
                              alt={shopData.ownerName}
                            />
                          ) : (
                            <AvatarFallback className="text-[#FFD95A] font-bold">
                              {loading
                                ? "..."
                                : shopData.ownerName[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {/* Active Status Badge - Mobile */}
                        {shopData.status === "Active" && (
                          <div className="absolute -top-0.5 -right-0.5 bg-[#66bb6a] text-white p-1 rounded-full shadow-lg border border-[#362625]">
                            <svg
                              className="w-2.5 h-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FFD95A]">
                          {loading ? "Loading..." : shopData.ownerName}
                        </p>
                        <p className="text-xs text-[#FFD95A]/70">
                          {loading ? "..." : shopData.shopName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <NavLink
                    to="/shop/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-lg text-[#FFD95A] hover:bg-[#FFE9A0]/20 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                    <span className="absolute bottom-1 left-4 w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-[#D87C5A] to-[#FFD95A] transition-all duration-300"></span>
                  </NavLink>

                  <NavLink
                    to="/shop/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-lg text-[#FFD95A] hover:bg-[#FFE9A0]/20 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                    <span className="absolute bottom-1 left-4 w-0 group-hover:w-14 h-0.5 bg-gradient-to-r from-[#D87C5A] to-[#FFD95A] transition-all duration-300"></span>
                  </NavLink>

                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-900/20 transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                    <span className="absolute bottom-1 left-4 w-0 group-hover:w-16 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300"></span>
                  </button>
                </div>
              )}

              {/* Mobile Login Button */}
              {!isSignedIn && (
                <div className="border-t border-[#FFD95A]/30 pt-3 mt-3">
                  <a
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#FFD95A] hover:bg-[#D87C5A] hover:text-white transition-all duration-200 no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                    <span className="absolute bottom-1 left-4 w-0 group-hover:w-10 h-0.5 bg-gradient-to-r from-[#D87C5A] to-[#FFD95A] transition-all duration-300"></span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
            <div className="text-center">
              {/* Title */}
              <h3 className="text-2xl font-bold text-[#362625] mb-2">
                Confirm Logout
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to log out of your account?
              </p>

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelLogout}
                  className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-3 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white rounded-xl hover:from-[#c0392b] hover:to-[#a93226] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[120px]"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
