import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  BarChart3, 
  History, 
  User, 
  Menu, 
  X,
  Home,
  Bell,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Edit3
} from 'lucide-react';
import Layout from '../components/delivery/Layout';
import DeliveryDashboard from '../components/delivery/DeliveryDashboard';
import DeliveryRequestsList from '../components/delivery/DeliveryRequestsList';
import ActiveDeliveries from '../components/delivery/ActiveDeliveries';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../util/axiosInstance';

const DeliveryPartnerPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('John Doe');
  const [partnerLoading, setPartnerLoading] = useState(true);
  const { userId } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Delivery Requests', icon: Package },
    { id: 'active', label: 'Active Deliveries', icon: Truck },
    { id: 'history', label: 'Delivery History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Fetch partner name on component mount
  useEffect(() => {
    const fetchPartnerName = async () => {
      if (userId) {
        try {
          setPartnerLoading(true);
          const response = await axiosInstance.get(`/delivery-partner/name/${userId}`);
          if (response.data && response.data.partnerName) {
            setPartnerName(response.data.partnerName);
          }
        } catch (error) {
          console.error('Failed to fetch partner name:', error);
          setPartnerName('Delivery Partner'); // Fallback name
        } finally {
          setPartnerLoading(false);
        }
      } else {
        setPartnerName('Delivery Partner'); // Default fallback
        setPartnerLoading(false);
      }
    };

    fetchPartnerName();
  }, [userId]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DeliveryDashboard />;
      case 'requests':
        return <DeliveryRequestsList />;
      case 'active':
        return <ActiveDeliveries />;
      case 'history':
        return <DeliveryHistory />;
      case 'profile':
        return <DeliveryProfile />;
      default:
        return <DeliveryDashboard />;
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
                    {partnerLoading ? 'Loading...' : `Welcome back, ${partnerName}!`}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button className="relative p-2 text-white hover:text-yellow-200 btn-animate">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
                
                <div className="flex items-center ml-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFD95A" }}
                  >
                    <User className="h-4 w-4" style={{ color: "#5D3A00" }} />
                  </div>
                  <span className="ml-2 text-sm font-medium text-white hidden sm:block">
                    {partnerLoading ? 'Loading...' : partnerName}
                  </span>
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
      </div>
    </Layout>
  );
};

// Placeholder components for the remaining sections
const DeliveryHistory = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery History</h1>
      <p className="text-gray-600">View your completed deliveries and earnings history</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery History</h3>
      <p className="text-gray-600">This section will show your completed deliveries with filtering and search options.</p>
    </div>
  </div>
);

const DeliveryProfile = () => {
  const [profileData, setProfileData] = useState({
    partnerName: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedName, setEditedName] = useState('');
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const { userId } = useAuth();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/delivery-partner/profile/${userId}`);
          if (response.data && response.data.profile) {
            setProfileData(response.data.profile);
            setEditedName(response.data.profile.partnerName || '');
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  const handleUpdateName = async () => {
    if (!editedName.trim()) return;
    
    try {
      setSaving(true);
      const response = await axiosInstance.put(`/delivery-partner/profile/${userId}/name`, {
        partnerName: editedName.trim()
      });
      
      if (response.data && response.data.success) {
        setProfileData(prev => ({ ...prev, partnerName: editedName.trim() }));
        setIsEditing(false);
        // Show success message (you can add a toast notification here)
        console.log('Name updated successfully');
      }
    } catch (error) {
      console.error('Failed to update name:', error);
      // Show error message (you can add a toast notification here)
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await axiosInstance.put(`/delivery-partner/profile/${userId}/password`, {
        newPassword: passwordData.newPassword
      });
      
      if (response.data && response.data.success) {
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
        alert('Password updated successfully');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
          <div className="flex justify-center items-center">
            <div 
              className="animate-spin rounded-full h-16 w-16 border-b-2"
              style={{ borderColor: '#5D3A00' }}
            ></div>
          </div>
          <p className="mt-4" style={{ color: '#D87C5A' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your delivery partner profile and account settings</p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold" style={{ color: '#5D3A00' }}>Profile Information</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5D3A00' }}>
              Email Address (Username)
            </label>
            <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
              <Mail className="h-5 w-5 mr-3" style={{ color: '#D87C5A' }} />
              <span className="text-gray-700">{profileData.email || 'Not available'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Partner Name Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5D3A00' }}>
              Partner Name
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-300 rounded-lg focus-within:border-orange-300">
                  <User className="h-5 w-5 mr-3" style={{ color: '#D87C5A' }} />
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 outline-none"
                    placeholder="Enter your partner name"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateName}
                    disabled={saving || !editedName.trim()}
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: '#5D3A00',
                      color: 'white'
                    }}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(profileData.partnerName || '');
                    }}
                    className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                <User className="h-5 w-5 mr-3" style={{ color: '#D87C5A' }} />
                <span className="text-gray-700">{profileData.partnerName || 'Not set'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold" style={{ color: '#5D3A00' }}>Security Settings</h2>
        </div>
        
        <div className="p-6">
          {!showPasswordSection ? (
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-3" style={{ color: '#D87C5A' }} />
                <div>
                  <h3 className="font-medium" style={{ color: '#5D3A00' }}>Password</h3>
                  <p className="text-sm text-gray-500">Last updated: Not available</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordSection(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#FFE4D6',
                  color: '#5D3A00'
                }}
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium" style={{ color: '#5D3A00' }}>Change Password</h3>
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5D3A00' }}>
                  New Password
                </label>
                <div className="flex items-center p-3 border border-gray-300 rounded-lg focus-within:border-orange-300">
                  <Lock className="h-5 w-5 mr-3" style={{ color: '#D87C5A' }} />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="flex-1 outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5D3A00' }}>
                  Confirm New Password
                </label>
                <div className="flex items-center p-3 border border-gray-300 rounded-lg focus-within:border-orange-300">
                  <Lock className="h-5 w-5 mr-3" style={{ color: '#D87C5A' }} />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="flex-1 outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-sm text-gray-500">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Should contain a mix of letters and numbers</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#5D3A00',
                    color: 'white'
                  }}
                >
                  {passwordLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({ newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerPage;
