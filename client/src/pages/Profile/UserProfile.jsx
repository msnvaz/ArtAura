import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import CartSidebar from "../../components/cart/CartSidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import ChangePasswordModal from "../../components/Profile/ChangePasswordModal";
import axios from "axios";

const UserProfile = () => {
  const { token, userId, authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [deactivateAttempts, setDeactivateAttempts] = useState(0);
  const [showDeactivatePrompt, setShowDeactivatePrompt] = useState(false);
  const [showFinalDeactivateConfirm, setShowFinalDeactivateConfirm] =
    useState(false);
  const [deactivateSuccess, setDeactivateSuccess] = useState(false);
  const [deactivateError, setDeactivateError] = useState("");

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    if (!token) {
      navigate("/");
      return;
    }
    fetchUserProfile();
  }, [token, navigate, authLoading]);

  const fetchUserProfile = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      if (!token || !userId) {
        throw new Error("No auth token or userId found");
      }
      const response = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleDeactivateClick = () => {
    if (deactivateAttempts < 2) {
      setDeactivateAttempts(deactivateAttempts + 1);
      setShowDeactivatePrompt(true);
    } else {
      setShowFinalDeactivateConfirm(true);
    }
  };

  const handleDeactivateAccount = async () => {
    setDeactivateError("");
    setShowFinalDeactivateConfirm(false);
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await axios.put(
        `${API_URL}/api/users/${userId}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeactivateSuccess(true);
      setTimeout(() => {
        setDeactivateSuccess(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      setDeactivateError("Failed to deactivate account. Please try again.");
    } finally {
      setLoading(false);
    }
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
                      src={
                        profileData?.image
                          ? profileData.image.startsWith("/uploads/")
                            ? profileData.image // Use direct path for images in public/uploads
                            : `/uploads/buyer/${profileData.image}` // Fallback for relative paths
                          : "/default-avatar.png"
                      }
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
                    {/* Split name into first and last name */}
                    {profileData?.name?.split(" ")[0] || ""}{" "}
                    {profileData?.name?.split(" ").slice(1).join(" ") || ""}
                  </h2>

                  <p className="text-[#362625]/70 mb-4">
                    {profileData?.bio || ""}
                  </p>

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
                        Full Name
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] font-medium">
                        {/* First Name */}
                        {profileData?.name?.split(" ")[0] || ""}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Email Address
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#D87C5A]" />
                        {profileData?.email || ""}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Phone Number
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D87C5A]" />
                        {profileData?.contactNo || ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Last Name
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] font-medium">
                        {/* Last Name */}
                        {profileData?.name?.split(" ").slice(1).join(" ") || ""}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Address
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D87C5A]" />
                        {[
                          profileData?.streetAddress,
                          profileData?.city,
                          profileData?.state,
                          profileData?.zipCode,
                          profileData?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#362625]/70">
                        Bio
                      </label>
                      <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#362625]">
                        {profileData?.bio || ""}
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
                <button
                  onClick={handleDeactivateClick}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md mt-3 hover:bg-red-700 transition text-sm w-fit mx-auto"
                  style={{ minWidth: 0 }}
                >
                  <Lock className="w-4 h-4" />
                  Deactivate Account
                </button>
              </div>

              {/* Deactivate Prompt Modal */}
              {showDeactivatePrompt && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
                    <h2 className="text-2xl font-bold text-[#362625] mb-2">
                      Wait! Don't leave us yet!
                    </h2>
                    <p className="text-[#362625]/80 mb-6">
                      ArtAura is constantly improving. You might miss out on new
                      features, exclusive art, and community events. Would you
                      like to stay and explore more?
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setShowDeactivatePrompt(false)}
                        className="px-6 py-2 rounded-lg bg-[#FFD95A] text-[#362625] font-semibold hover:bg-[#D87C5A] hover:text-white transition"
                      >
                        I'll Stay!
                      </button>
                      <button
                        onClick={() => {
                          setShowDeactivatePrompt(false);
                          handleDeactivateClick();
                        }}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                      >
                        Still Deactivate
                      </button>
                    </div>
                  </div>
                  <style>{`
                    @keyframes fade-in {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.5s ease; }
                  `}</style>
                </div>
              )}

              {/* Final Deactivate Confirmation Modal */}
              {showFinalDeactivateConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
                    <h2 className="text-2xl font-bold text-[#362625] mb-2">
                      Are you sure?
                    </h2>
                    <p className="text-[#362625]/80 mb-6">
                      This is your last chance to stay with ArtAura. If you
                      deactivate, your account will be disabled and you'll be
                      logged out.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setShowFinalDeactivateConfirm(false)}
                        className="px-6 py-2 rounded-lg bg-[#FFD95A] text-[#362625] font-semibold hover:bg-[#D87C5A] hover:text-white transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeactivateAccount}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                      >
                        Yes, Deactivate
                      </button>
                    </div>
                  </div>
                  <style>{`
                    @keyframes fade-in {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.5s ease; }
                  `}</style>
                </div>
              )}

              {/* Success Message */}
              {deactivateSuccess && (
                <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFD95A] to-[#D87C5A] text-[#362625] px-6 py-4 rounded-xl shadow-2xl border border-[#FFD95A]">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-lg">
                      Account deactivated successfully!
                    </span>
                  </div>
                  <style>{`
                    @keyframes fade-in {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.5s ease; }
                  `}</style>
                </div>
              )}

              {/* Error Message */}
              {deactivateError && (
                <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
                  <div className="flex items-center gap-3 bg-red-100 text-red-700 px-6 py-4 rounded-xl shadow-2xl border border-red-300">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="font-semibold text-lg">
                      {deactivateError}
                    </span>
                  </div>
                  <style>{`
                    @keyframes fade-in {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.5s ease; }
                  `}</style>
                </div>
              )}
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
              userId={userId}
              token={token}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
