import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  UserX,
  Camera,
  Save,
  X,
  AlertTriangle,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Palette,
  Award,
  Star,
  Building,
  CreditCard,
  FileText,
  Briefcase
} from 'lucide-react';

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast, showToast, hideToast } = useToast();
  
  const [profileData, setProfileData] = useState({
    shopId: null,
    userId: null,
    shopName: '',
    ownerName: '',
    email: '',
    contactNo: '',
    businessType: '',
    businessLicense: '',
    taxId: '',
    description: '',
    status: '',
    agreedTerms: false,
    createdAt: null,
    avatar: '/src/assets/user.png'
  });

  const [editData, setEditData] = useState(profileData);

  useEffect(() => {
    const fetchShopProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        let shopId = localStorage.getItem("shopId");
        
        // Debug: Check what's in localStorage
        console.log("LocalStorage contents:", {
          token: localStorage.getItem("token"),
          shopId: localStorage.getItem("shopId"),
          userId: localStorage.getItem("userId"),
          userEmail: localStorage.getItem("userEmail")
        });
        
        // If no shopId, try to get it using email
        if (!shopId) {
          const userEmail = localStorage.getItem("userEmail");
          
          if (!userEmail) {
            throw new Error("No shop ID or email found. Please log in again.");
          }
          
          console.log("No shopId found, trying to fetch using email:", userEmail);
          
          // Try to get shop by email first
          const emailResponse = await fetch(`http://localhost:8081/api/shop/profile?email=${encodeURIComponent(userEmail)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (emailResponse.ok) {
            const shopData = await emailResponse.json();
            shopId = shopData.shopId;
            // Store the shopId for future use
            localStorage.setItem("shopId", shopId);
            console.log("Found and stored shopId:", shopId);
          } else {
            throw new Error("Shop not found for your email. Please contact support.");
          }
        }
        
        console.log("Fetching profile for shop ID:", shopId);

        const response = await fetch(`http://localhost:8081/api/shop/${shopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);
        console.log("Response URL:", response.url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Shop not found for ID: ${shopId}. Please contact support.`);
          } else if (response.status === 500) {
            const errorText = await response.text();
            console.error("Server error:", errorText);
            throw new Error(`Server error: ${errorText}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data from database:", data);
        
        // Verify we got the correct shop
        if (data.shopId != shopId) {
          console.warn(`Warning: Expected shop ID ${shopId}, but got ${data.shopId}`);
        }
        
        // Make sure all fields exist, provide defaults if needed
        const formattedData = {
          shopId: data.shopId || null,
          userId: data.userId || null,
          shopName: data.shopName || '',
          ownerName: data.ownerName || '',
          email: data.email || '',
          contactNo: data.contactNo || '',
          businessType: data.businessType || '',
          businessLicense: data.businessLicense || '',
          taxId: data.taxId || '',
          description: data.description || '',
          status: data.status || '',
          agreedTerms: data.agreedTerms || false,
          createdAt: data.createdAt || null,
          avatar: '/src/assets/user.png',
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'
        };
        
        console.log("Formatted data for shop ID", shopId, ":", formattedData);
        
        setProfileData(formattedData);
        setEditData(formattedData);
        setError(null);
        
        // Show success message with shop ID
        showToast(`✅ Profile loaded for Shop ID: ${shopId}`, "success", 2000);
        
      } catch (err) {
        console.error("Error fetching shop profile:", err);
        setError(err.message);
        showToast(`❌ ${err.message}`, "error", 4000);
      } finally {
        setLoading(false);
      }
    };
    fetchShopProfile();
  }, []); // Only run once on mount

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const updateData = {
        shopName: editData.shopName,
        ownerName: editData.ownerName,
        email: editData.email,
        contactNo: editData.contactNo,
        businessType: editData.businessType,
        businessLicense: editData.businessLicense,
        taxId: editData.taxId,
        description: editData.description
      };

      const response = await fetch(`http://localhost:8081/api/shop/update/${profileData.shopId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        showToast(`❌ ${error.message || "Failed to update profile"}`, "error", 3000);
        return;
      }

      setProfileData(editData);
      setIsEditing(false);
      showToast("✅ Profile updated successfully!", "update", 2500);
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("❌ Server error. Please try again later.", "error", 3000);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleDeactivate = () => {
    setShowDeactivateModal(false);
    // Handle deactivation logic here
    showToast("⚠️ Profile deactivated successfully", "delete", 2500);
  };

  const stats = [
    {
      label: 'Shop Status',
      value: profileData.status || 'Active',
      icon: Award,
      color: profileData.status === 'Active' ? 'bg-[#66bb6a]' : 'bg-[#ff9800]',
      textColor: profileData.status === 'Active' ? 'text-[#2e7d32]' : 'text-[#f57c00]'
    },
    {
      label: 'Business Type',
      value: profileData.businessType || 'N/A',
      icon: Briefcase,
      color: 'bg-[#D87C5A]',
      textColor: 'text-[#D87C5A]'
    },
    {
      label: 'Member Since',
      value: profileData.joinDate || 'N/A',
      icon: Calendar,
      color: 'bg-[#FFD95A]',
      textColor: 'text-[#bfa100]'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-6 px-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-6 px-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <button 
              onClick={fetchShopProfile}
              className="mt-4 bg-[#D87C5A] text-white px-4 py-2 rounded-lg hover:bg-[#c06949]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      
      <div className="pt-6 px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#5D3A00] mb-2">Shop Profile</h1>
            <p className="text-[#D87C5A] font-medium">{profileData.shopName}</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <UserX className="w-4 h-4" />
                  Deactivate
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#66bb6a] to-[#2e7d32] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-[#5D3A00] border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg hover:bg-[#FFF5E1] px-6 py-3 transform hover:scale-105 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (Left Column) */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#f3f3f3] bg-white shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fade-in">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-[#FFD95A] shadow-lg"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-[#D87C5A] text-white p-2 rounded-full hover:bg-[#c06949] transition shadow-md">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-[#5D3A00] mb-1">{profileData.ownerName}</h2>
                <p className="text-[#D87C5A] font-medium mb-4">Shop Owner</p>
                
                {/* Stats Cards */}
                <div className="space-y-3 mt-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={index} 
                        className={`rounded-xl border border-[#f3f3f3] bg-white p-4 shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] transition-all duration-500 hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-[#5D3A00]">{stat.label}</span>
                          </div>
                          <span className={`text-sm font-bold ${stat.textColor}`}>{stat.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Two Sections) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shop Information Card */}
            <div className="rounded-2xl border border-[#FFE4D6] bg-white shadow-xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#5D3A00] mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#D87C5A]" />
                Shop Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Shop Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.shopName}
                      onChange={(e) => setEditData({...editData, shopName: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00]">{profileData.shopName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Owner Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.ownerName}
                      onChange={(e) => setEditData({...editData, ownerName: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.ownerName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.contactNo}
                      onChange={(e) => setEditData({...editData, contactNo: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.contactNo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Details Card */}
            <div className="rounded-2xl border border-[#FFE4D6] bg-white shadow-xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#5D3A00] mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#D87C5A]" />
                Business Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Business Type</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.businessType}
                      onChange={(e) => setEditData({...editData, businessType: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.businessType || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Business License</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.businessLicense}
                      onChange={(e) => setEditData({...editData, businessLicense: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.businessLicense || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Tax ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.taxId}
                      onChange={(e) => setEditData({...editData, taxId: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.taxId || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Join Date</label>
                  <p className="p-3 bg-[#FFE4D6] rounded-lg text-[#5D3A00] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D87C5A]" />
                    {profileData.joinDate}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-[#5D3A00]">Description</label>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00] resize-none"
                  />
                ) : (
                  <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00]">{profileData.description || 'No description available'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deactivate Modal */}
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r p-6 rounded-t-2xl border-b border-[#FFE4D6]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-[#D87C5A]" />
                    Deactivate Shop
                  </h2>
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[#5D3A00] mb-6">
                  Are you sure you want to deactivate your shop? This action will temporarily disable your shop profile and you won't be able to manage products until you reactivate it.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="flex-1 px-4 py-2 text-[#5D3A00] border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeactivate}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
