import {
  Home,
  ShoppingCart,
  Bell,
  LogOut,
  Package,
  Handshake,
  BarChart3,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const mockUser = {
  name: "John Doe",
  image: "/src/assets/user.png",
};

const mainLinks = [
  { name: "Dashboard", path: "/shop/dashboard", icon: Home },
  { name: "Orders", path: "/shop/orders", icon: ShoppingCart },
  { name: "Catalog", path: "/shop/catalog", icon: Package },
  { name: "Analytics", path: "/shop/analytics", icon: BarChart3 },
  { name: "Sponsorships", path: "/shop/sponsorships", icon: Handshake },

  {
    name: "Notifications",
    path: "/portal/notifications",
    icon: Bell,
    hasBell: true,
  },
];

const logoutLink = { name: "Log out", path: "/", icon: LogOut };

function Sidebar() {
  const { token, logout } = useAuth();
  const isSignedIn = !!token;
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div
      className={`
        h-screen bg-gradient-to-b from-[#362625] to-[#362625]
        w-20 md:w-64
        flex flex-col justify-between
        shadow-xl border-r border-[#FFD95A]/30
        rounded-tr-2xl rounded-br-2xl
        transition-all duration-300
        fixed top-0 left-0 z-40
      `}
    >
      {/* Top Section */}
      <div>
        <div className="hidden md:flex flex-col items-center text-center mt-6 mb-12">
          <img
            src="/src/assets/logo.jpg"
            alt="ArtAura Logo"
            className="w-15 h-12 mb-2  shadow-lg  object-contain"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-[#FFD95A] to-[#D87C5A] bg-clip-text text-transparent select-none">
            ArtAura
          </span>
          <span className="text-base font-medium text-[#FFD95A]">
            Shop Portal
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3 px-2">
          {mainLinks.map(({ name, path, icon: Icon, hasBell }) => (
            <NavLink
              key={name}
              to={path}
              end={name === "Home"}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#FFD95A]/90 text-[#362625] shadow border-l-4 border-[#FFD95A] scale-105"
                    : "text-[#FFD95A] hover:bg-[#FFE9A0]/60 hover:scale-105"
                }`
              }
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {hasBell && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFD95A] rounded-full" />
                )}
              </div>
              <span className="hidden md:inline transition-all duration-300">
                {name}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User Info + Auth */}
      <div className="mt-6 space-y-6 pb-10">
        {/* User Info - Only show when signed in */}
        {isSignedIn && (
          <div className="flex flex-col items-center justify-center gap-3 px-4">
            <NavLink to="/shop/profile">
              <Avatar className="h-12 w-12 ring-2 ring-[#FFD95A] bg-[#362625] hover:scale-105 transition-transform">
                {mockUser.image ? (
                  <AvatarImage src={mockUser.image} alt={mockUser.name} />
                ) : (
                  <AvatarFallback className="text-[#FFD95A] font-bold text-lg">
                    {mockUser.name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
            </NavLink>

            <div className="hidden md:flex flex-col text-sm text-center leading-tight">
              <span className="font-semibold text-[#FFD95A]">
                {mockUser.name}
              </span>
            </div>
          </div>
        )}

        {/* Auth Button */}
        {isSignedIn ? (
          <button
            onClick={handleLogoutClick}
            className="group flex items-center justify-center gap-4 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-[#FFD95A] hover:bg-[#e74c3c] hover:text-white hover:scale-100 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden md:inline transition-all duration-300">
              {logoutLink.name}
            </span>
          </button>
        ) : (
          <a
            href="/"
            className="group flex items-center justify-center gap-4 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-[#FFD95A] hover:bg-[#D87C5A] hover:text-white hover:scale-100 w-full no-underline"
            style={{ textDecoration: "none" }}
          >
            <User className="h-5 w-5" />
            <span className="hidden md:inline transition-all duration-300">
              Login
            </span>
          </a>
        )}

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
      </div>
    </div>
  );
}

export default Sidebar;
