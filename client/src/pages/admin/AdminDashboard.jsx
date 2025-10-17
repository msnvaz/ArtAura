import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Shield,
  Image,
  User,
  Settings,
  Truck,
} from "lucide-react";

// Import separate components
import Overview from "./Overview";
import UsersManagement from "./Users";
import ArtworkManagement from "./Artwork";
import Financial from "./Financial";
import UserVerification from "./UserVerification";
import DeliveryManagement from "./DeliveryManagement";
import { CurrencyProvider } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const { token, logout } = useAuth();
  const isSignedIn = !!token;
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Trigger immediate smooth entrance animation without delay
    setIsLoaded(true);
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "artwork", label: "Artworks", icon: Image },
    { id: "delivery", label: "Delivery Management", icon: Truck },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "verification", label: "User Verification", icon: Shield },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "users":
        return <UsersManagement />;
      case "artwork":
        return <ArtworkManagement />;
      case "delivery":
        return <DeliveryManagement />;
      case "financial":
        return <Financial />;
      case "verification":
        return <UserVerification />;
      default:
        return <Overview />;
    }
  };

  const handleLogoutClick = () => {
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
    <CurrencyProvider>
      {/* Optimized CSS styles for smoother animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popInContent {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-container {
          animation: smoothFadeIn 0.4s ease-out;
          opacity: 1;
        }

        .header-container {
          animation: slideInFromTop 0.5s ease-out 0.1s both;
        }

        .nav-container {
          animation: slideInFromTop 0.5s ease-out 0.2s both;
        }

        .content-container {
          animation: popInContent 0.4s ease-out 0.3s both;
        }

        .menu-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .menu-item:hover {
          transform: translateY(-1px);
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }

        /* Prevent flash of unstyled content */
        .dashboard-content {
          min-height: 200px;
        }

        /* Ensure smooth rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div
        className="min-h-screen page-container"
        style={{ backgroundColor: "#FFF5E1" }}
      >
        {/* Full Width Header */}
        <div
          className="w-full shadow-sm p-6 mb-8 relative header-container"
          style={{
            backgroundImage:
              'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="p-3 rounded-full smooth-transition"
                  style={{ backgroundColor: "#FFD95A" }}
                >
                  <Shield size={32} style={{ color: "#5D3A00" }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-200">Welcome back, Administrator!</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                >
                  <FileText size={14} />
                  <span className="hidden sm:inline">Generate Report</span>
                  <span className="sm:hidden">Generate</span>
                </button>

                {/* Auth Button */}
                {isSignedIn ? (
                  <button
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                    style={{
                      backgroundColor: "#D87C5A",
                      color: "white",
                      border: "none",
                    }}
                    onClick={handleLogoutClick}
                  >
                    <User size={14} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <a
                    href="/"
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate no-underline"
                    style={{
                      backgroundColor: "#D87C5A",
                      color: "white",
                      border: "none",
                      textDecoration: "none",
                    }}
                  >
                    <User size={14} />
                    <span>Login</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-4 nav-container">
            <div style={{ borderBottom: "1px solid #FFE4D6" }}>
              <nav className="flex space-x-8 px-6">
                {menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 menu-item"
                    style={{
                      borderBottomColor:
                        activeSection === item.id ? "#5D3A00" : "transparent",
                      color: activeSection === item.id ? "#5D3A00" : "#D87C5A",
                    }}
                    onMouseOver={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = "#5D3A00";
                        e.target.style.borderBottomColor = "#FFD95A";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = "#D87C5A";
                        e.target.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="content-container dashboard-content">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* New Logout Confirmation Modal */}
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
    </CurrencyProvider>
  );
};

export default AdminDashboard;
