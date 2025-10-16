import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  BarChart3, 
  History, 
  User, 
  Menu, 
  X,
  Bell,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/delivery/Layout';
import DeliveryRequestsList from '../components/delivery/DeliveryRequestsList';
import ActiveDeliveries from '../components/delivery/ActiveDeliveries';
import DeliveryHistory from '../components/delivery/DeliveryHistory';

const DeliveryPartnerPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const { logout, userId, token } = useAuth();
  const navigate = useNavigate();

  // Fetch delivery partner profile
  useEffect(() => {
    const fetchPartnerProfile = async () => {
      if (!token || !userId) return;
      
      try {
        const response = await axios.get(`http://localhost:8081/api/delivery-partner/profile/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data) {
          setPartnerProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching delivery partner profile:', error);
        // Fallback to default name if API fails
        setPartnerProfile({ partnerName: 'Delivery Partner', email: 'partner@example.com' });
      }
    };

    fetchPartnerProfile();
  }, [token, userId]);

  const navigationItems = [
    { id: 'requests', label: 'Delivery Requests', icon: Package },
    { id: 'active', label: 'Active Deliveries', icon: Truck },
    { id: 'history', label: 'Delivery History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Logout functionality
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

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <DeliveryRequestsList />;
      case 'active':
        return <ActiveDeliveries />;
      case 'history':
        return <DeliveryHistory />;
      case 'profile':
        return <DeliveryProfile />;
      default:
        return <DeliveryRequestsList />;
    }
  };

  return (
    <Layout>
      {/* Admin-style CSS animations */}
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

        .page-container {
          animation: smoothFadeIn 0.4s ease-out;
        }

        .header-container {
          animation: slideInFromTop 0.5s ease-out 0.1s both;
        }

        .sidebar-container {
          animation: slideInFromTop 0.5s ease-out 0.2s both;
        }

        .menu-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-item:hover {
          transform: translateY(-1px);
        }

        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }
      `}</style>

      <div className="min-h-screen page-container" style={{ backgroundColor: '#FFF5E1' }}>
        {/* Full Width Header - Admin Style */}
        <div
          className="w-full shadow-sm p-6 mb-8 relative header-container"
          style={{
            backgroundImage:
              'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#FFD95A" }}
                >
                  <Truck size={32} style={{ color: "#5D3A00" }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Delivery Partner Dashboard
                  </h1>
                  <p className="text-gray-200">
                    Welcome back, {partnerProfile?.partnerName || 'Delivery Partner'}!
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button className="relative p-2 text-white hover:text-yellow-200 btn-animate">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
                
                <div className="flex items-center ml-4 gap-3">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#FFD95A" }}
                    >
                      <User className="h-4 w-4" style={{ color: "#5D3A00" }} />
                    </div>
                    <span className="ml-2 text-sm font-medium text-white hidden sm:block">
                      {partnerProfile?.partnerName || 'Partner'}
                    </span>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogoutClick}
                    className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white px-4 py-2 rounded-lg hover:from-[#c0392b] hover:to-[#a93226] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 btn-animate"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Navigation Tabs - Admin Style */}
          <div className="bg-white rounded-lg shadow-sm mb-4 sidebar-container">
            <div style={{ borderBottom: "1px solid #FFE4D6" }}>
              <nav className="flex space-x-8 px-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 menu-item"
                      style={{
                        borderBottomColor:
                          activeTab === item.id ? "#5D3A00" : "transparent",
                        color: activeTab === item.id ? "#5D3A00" : "#D87C5A",
                      }}
                      onMouseOver={(e) => {
                        if (activeTab !== item.id) {
                          e.target.style.color = "#5D3A00";
                          e.target.style.borderBottomColor = "#FFD95A";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (activeTab !== item.id) {
                          e.target.style.color = "#D87C5A";
                          e.target.style.borderBottomColor = "transparent";
                        }
                      }}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Page Content */}
          <div className="dashboard-content">
            {renderContent()}
          </div>
        </div>

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
                  Are you sure you want to log out of your delivery partner account?
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
    </Layout>
  );
};

// Placeholder component for profile section
const DeliveryProfile = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
      <p className="text-gray-600">Manage your delivery partner profile and preferences</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Management</h3>
      <p className="text-gray-600">This section will contain profile settings, vehicle information, and delivery preferences.</p>
    </div>
  </div>
);

export default DeliveryPartnerPage;
