import React, { useState, useEffect } from "react";
import { X, Save, Upload, User, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const EditProfileModal = ({ isOpen, onClose, profileData, onUpdate }) => {
  const { token, userId } = useAuth();
  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    streetAddress: profileData?.streetAddress || "",
    city: profileData?.city || "",
    state: profileData?.state || "",
    postalCode: profileData?.postalCode || "",
    bio: profileData?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    setFormData({
      firstName: profileData?.name?.split(" ")[0] || "",
      lastName: profileData?.name?.split(" ").slice(1).join(" ") || "",
      email: profileData?.email || "",
      phone: profileData?.contactNo || "",
      streetAddress: profileData?.streetAddress || "",
      city: profileData?.city || "",
      state: profileData?.state || "",
      postalCode: profileData?.zipCode || "",
      bio: profileData?.bio || "",
    });
  }, [profileData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const formDataObj = new FormData();
      // Use existing profileData for unchanged fields
      formDataObj.append(
        "profile",
        new Blob(
          [
            JSON.stringify({
              name: `${
                formData.firstName || profileData?.name?.split(" ")[0] || ""
              } ${
                formData.lastName ||
                profileData?.name?.split(" ").slice(1).join(" ") ||
                ""
              }`.trim(),
              email: formData.email || profileData?.email || "",
              contactNo: formData.phone || profileData?.contactNo || "",
              streetAddress:
                formData.streetAddress || profileData?.streetAddress || "",
              city: formData.city || profileData?.city || "",
              state: formData.state || profileData?.state || "",
              zipCode: formData.postalCode || profileData?.zipCode || "",
              bio: formData.bio || profileData?.bio || "",
            }),
          ],
          { type: "application/json" }
        )
      );
      if (selectedFile) {
        formDataObj.append("image", selectedFile);
      }
      const response = await axios.put(
        `${API_URL}/api/users/${userId}`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#FFE4D6]">
          <h2 className="text-2xl font-bold text-[#362625] flex items-center gap-2">
            <User className="w-6 h-6" />
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFE4D6] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#362625]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={previewUrl || profileData.avatar}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#FFD95A]"
              />
              <label className="absolute bottom-0 right-0 bg-[#D87C5A] text-white p-2 rounded-full cursor-pointer hover:bg-[#c06949] transition">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-[#362625]/70">
              Click the upload icon to change your profile picture
            </p>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#362625] mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#362625] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
              placeholder="Enter your street address"
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="State"
              />
            </div>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="mt-2 px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
              placeholder="Postal Code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#FFE4D6] text-[#362625] rounded-lg hover:bg-[#FFE4D6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#D87C5A] text-white rounded-lg hover:bg-[#c06949] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
