import React, { useState } from "react";
import { X, Save, Lock, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Comment out API call since backend is not ready
      // const API_URL = import.meta.env.VITE_API_URL;
      // const response = await axios.put(`${API_URL}/api/user/change-password`, {
      //   currentPassword,
      //   newPassword
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${auth.token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // For demo purposes, simulate success
      if (formData.currentPassword && formData.newPassword) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
        // You could show a success message here
        alert("Password changed successfully!");
      } else {
        setError("Please fill in all fields");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div
      className={`flex items-center gap-2 text-sm ${
        met ? "text-green-600" : "text-gray-500"
      }`}
    >
      <Check
        className={`w-3 h-3 ${met ? "text-green-600" : "text-gray-300"}`}
      />
      {text}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-[#FFE4D6]">
          <h2 className="text-2xl font-bold text-[#362625] flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFE4D6] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#362625]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <Check className="w-4 h-4" />
              Password changed successfully!
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 pr-10 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#362625]/50 hover:text-[#362625]"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 pr-10 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#362625]/50 hover:text-[#362625]"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-3 p-3 bg-[#FFF5E1] rounded-lg space-y-1">
                <p className="text-sm font-medium text-[#362625] mb-2">
                  Password Requirements:
                </p>
                <PasswordRequirement
                  met={passwordValidation.minLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordValidation.hasUpperCase}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={passwordValidation.hasLowerCase}
                  text="One lowercase letter"
                />
                <PasswordRequirement
                  met={passwordValidation.hasNumbers}
                  text="One number"
                />
                <PasswordRequirement
                  met={passwordValidation.hasSpecialChar}
                  text="One special character"
                />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#362625] mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 pr-10 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#362625]/50 hover:text-[#362625]"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
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
              disabled={
                loading ||
                !passwordValidation.isValid ||
                formData.newPassword !== formData.confirmPassword
              }
              className="flex-1 px-6 py-3 bg-[#D87C5A] text-white rounded-lg hover:bg-[#c06949] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
