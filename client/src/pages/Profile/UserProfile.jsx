import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import CartSidebar from "../../components/cart/CartSidebar";
import { User, Mail, Phone, MapPin, Edit3, Camera, Lock } from "lucide-react";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import ChangePasswordModal from "../../components/Profile/ChangePasswordModal";
import axios from "axios";

const UserProfile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    // Comment out auth check for now since backend is not ready
    // if (!auth.token) {
    //   navigate('/login');
    //   return;
    // }
    fetchUserProfile();
  }, [navigate]); // Removed auth.token dependency

  const fetchUserProfile = async () => {
    try {
      // Comment out API call since backend is not ready
      // const API_URL = import.meta.env.VITE_API_URL;
      // const response = await axios.get(`${API_URL}/api/user/profile`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.token}`
      //   }
      // });
      // setProfileData(response.data);

      // Use mock data for now
      setProfileData({
        id: auth?.userId || 1,
        firstName: "Pawani",
        lastName: "Kumari",
        email: "pawani.kumari@gmail.com",
        phone: "+94 77 123 4567",
        streetAddress: "No. 45, Pinnawala",
        city: "Rambukkana",
        state: "Kegalle",
        postalCode: "71100",
        joinDate: "2024-01-15",
        role: auth?.role || "buyer",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        bio: "Art enthusiast and collector from Sri Lanka.",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Use mock data for now
      setProfileData({
        id: auth?.userId || 1,
        firstName: "Pawani",
        lastName: "Kumari",
        email: "pawani.kumari@gmail.com",
        phone: "+94 77 123 4567",
        streetAddress: "No. 45, Pinnawala",
        city: "Rambukkana",
        state: "Kegalle",
        postalCode: "71100",
        joinDate: "2024-01-15",
        role: auth?.role || "buyer",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        bio: "Art enthusiast and collector from Sri Lanka.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData((prev) => ({ ...prev, ...updatedData }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf3e0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#362625]"></div>
          <p className="mt-4 text-[#362625]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1] overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Main content with proper top padding */}
      <div className="pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#362625] mb-2">
              My Profile
            </h1>
            <p className="text-[#362625]/70">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6]">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-[#FFD95A] shadow-lg object-cover"
                    />
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="absolute bottom-0 right-0 bg-[#D87C5A] text-white p-3 rounded-full hover:bg-[#c06949] transition shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-[#362625] mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h2>

                  <p className="text-[#362625]/70 mb-4">{profileData.bio}</p>

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#D87C5A] text-white px-4 py-3 rounded-lg hover:bg-[#c06949] transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#362625] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#D87C5A]" />
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-2 text-[#D87C5A] hover:text-[#c06949] transition font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        First Name
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] font-medium">
                        {profileData.firstName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Email Address
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#D87C5A]" />
                        {profileData.email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Phone Number
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D87C5A]" />
                        {profileData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Last Name
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] font-medium">
                        {profileData.lastName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Address
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D87C5A]" />
                        {profileData.streetAddress}, {profileData.city},{" "}
                        {profileData.state} {profileData.postalCode}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Bio
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625]">
                        {profileData.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#362625] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#D87C5A]" />
                    Change Password
                  </h3>
                </div>

                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#D87C5A] text-white px-4 py-3 rounded-lg hover:bg-[#c06949] transition"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {showEditModal && (
            <EditProfileModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              profileData={profileData}
              onUpdate={handleProfileUpdate}
            />
          )}

          {/* Change Password Modal */}
          {showChangePasswordModal && (
            <ChangePasswordModal
              isOpen={showChangePasswordModal}
              onClose={() => setShowChangePasswordModal(false)}
              userId={profileData.id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
