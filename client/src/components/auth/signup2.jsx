import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Palette,
  Store,
  ShoppingBag,
  Brush,
  ArrowRight,
  Check,
  Upload,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import AlertMessage from "../AlertMessage";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    artistType: "",
    nic: "",
    nicImage: null,
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    let endpoint = "";
    let payload = {};
    const API_URL = import.meta.env.VITE_API_URL;
    if (userType === "artist") {
      endpoint = `${API_URL}/api/artist/signup`;
      payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNo: formData.contactNo,
        password: formData.password,
        specialization: formData.specialization,
        nic: formData.nic,
        status: "Pending",
        agreedTerms: true,
      };
    } else if (userType === "buyer") {
      endpoint = `${API_URL}/api/buyer/signup`;
      payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNo: formData.contactNo,
        password: formData.password,
        agreedTerms: true,
      };
    }

    try {
      const res = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        setMessage("Registration successful! Please sign in.");
        setMessageType("success");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(res.data.message || "Registration failed");
        setMessageType("error");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong!");
      }
      setMessageType("error");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      nicImage: file,
    });
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      role: type,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf3e0] via-[#faf3e0] to-[#f5ede0] py-12 px-4">
      <div className="max-w-lg w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-[#362625] to-[#4a3532] p-4 rounded-2xl shadow-lg">
              <Palette className="h-10 w-10 text-[#faf3e0]" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-[#362625] mb-3">
            Join ArtAura
          </h2>
          <p className="text-lg text-[#362625]/70 leading-relaxed">
            Create your account and start your art journey
          </p>
        </div>

        {message && <AlertMessage type={messageType} message={message} />}

        {/* User Type Selection */}
        {!userType && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#362625] mb-2">
                Choose Your Path
              </h3>
              <p className="text-[#362625]/60">
                How do you want to join our community?
              </p>
            </div>

            <div className="space-y-4">
              {/* Artist Option */}
              <button
                onClick={() => handleUserTypeSelect("artist")}
                className="w-full p-6 border-2 border-[#362625]/10 rounded-xl hover:border-[#362625] hover:bg-[#362625]/5 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-[#362625]/10 to-[#362625]/20 p-4 rounded-xl group-hover:from-[#362625]/20 group-hover:to-[#362625]/30 transition-all duration-300">
                    <Brush className="h-7 w-7 text-[#362625]" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-xl font-bold text-[#362625] mb-1">
                      I'm an Artist
                    </h4>
                    <p className="text-[#362625]/70 text-sm leading-relaxed">
                      Create and sell your artwork, participate in challenges,
                      showcase your portfolio
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#362625]/40 group-hover:text-[#362625] transition-colors" />
                </div>
              </button>

              {/* Buyer Option */}
              <button
                onClick={() => handleUserTypeSelect("buyer")}
                className="w-full p-6 border-2 border-[#362625]/10 rounded-xl hover:border-[#362625] hover:bg-[#362625]/5 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-[#362625]/10 to-[#362625]/20 p-4 rounded-xl group-hover:from-[#362625]/20 group-hover:to-[#362625]/30 transition-all duration-300">
                    <ShoppingBag className="h-7 w-7 text-[#362625]" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-xl font-bold text-[#362625] mb-1">
                      I want to discover art
                    </h4>
                    <p className="text-[#362625]/70 text-sm leading-relaxed">
                      Browse and purchase artwork, commission custom pieces,
                      support artists
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#362625]/40 group-hover:text-[#362625] transition-colors" />
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#362625]/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#362625]/60 font-medium">
                  or
                </span>
              </div>
            </div>

            {/* Shop Registration Link */}
            <Link
              to="/register/shop"
              className="w-full bg-gradient-to-r from-[#362625] to-[#4a3532] text-[#faf3e0] p-4 rounded-xl flex justify-center items-center space-x-3 hover:from-[#4a3532] hover:to-[#362625] transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Store className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Register as Art Supply Shop</span>
            </Link>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <span className="text-[#362625]/70">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="font-semibold text-[#362625] hover:text-[#362625]/80 transition-colors underline"
              >
                Sign in here
              </Link>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {userType && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Selected User Type Display */}
            <div className="bg-gradient-to-r from-[#362625]/5 to-[#362625]/10 p-4 rounded-xl mb-8 border border-[#362625]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {userType === "artist" ? (
                    <Brush className="h-6 w-6 text-[#362625]" />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-[#362625]" />
                  )}
                  <span className="font-bold text-[#362625] text-lg">
                    Registering as{" "}
                    {userType === "artist" ? "an Artist" : "an Art Enthusiast"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUserType("")}
                  className="text-[#362625]/60 hover:text-[#362625] text-sm font-medium transition-colors"
                >
                  Change
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-bold text-[#362625] mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-bold text-[#362625] mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-[#362625] mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-bold text-[#362625] mb-2"
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactNumber"
                  name="contactNo"
                  type="text"
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                  placeholder="Enter your contact number"
                />
              </div>

              {/* Artist-specific fields */}
              {userType === "artist" && (
                <div className="space-y-6 p-6 bg-[#362625]/5 rounded-xl border border-[#362625]/10">
                  <h4 className="text-lg font-bold text-[#362625] flex items-center space-x-2">
                    <Brush className="h-5 w-5" />
                    <span>Artist Information</span>
                  </h4>

                  <div>
                    <label
                      htmlFor="artistType"
                      className="block text-sm font-bold text-[#362625] mb-2"
                    >
                      Artist Specialization{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="artistType"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent"
                    >
                      <option value="">Select your specialization</option>
                      <option value="painting">Painting</option>
                      <option value="digital">Digital Art</option>
                      <option value="photography">Photography</option>
                      <option value="sculpture">Sculpture</option>
                      <option value="drawing">Drawing & Illustration</option>
                      <option value="mixed">Mixed Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="nic"
                      className="block text-sm font-bold text-[#362625] mb-2"
                    >
                      NIC Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nic"
                      name="nic"
                      type="text"
                      required
                      value={formData.nic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                      placeholder="Enter your NIC number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nicImage"
                      className="block text-sm font-bold text-[#362625] mb-2"
                    >
                      NIC Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="nicImage"
                        name="nicImage"
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="nicImage"
                        className="w-full px-4 py-3 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent transition-all cursor-pointer flex items-center justify-center space-x-3 hover:bg-[#362625]/5"
                      >
                        <Upload className="h-5 w-5 text-[#362625]/60" />
                        <span className="text-[#362625]/70">
                          {formData.nicImage ? formData.nicImage.name : "Upload NIC Image"}
                        </span>
                      </label>
                      {formData.nicImage && (
                        <p className="text-xs text-[#362625]/60 mt-2">
                          Selected: {formData.nicImage.name}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-[#362625]/50 mt-1">
                      Upload a clear image of your National Identity Card for verification purposes
                    </p>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-[#362625] mb-2"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#362625]/50 hover:text-[#362625] transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#362625]/50 hover:text-[#362625] transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-[#362625] mb-2"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-[#362625]/20 text-[#362625] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#362625] focus:border-transparent placeholder-[#362625]/40 transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-[#362625]/50 hover:text-[#362625] transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#362625]/50 hover:text-[#362625] transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 p-4 bg-[#362625]/5 rounded-xl border border-[#362625]/10">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-5 w-5 text-[#362625] border-[#362625]/30 rounded focus:ring-[#362625] mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[#362625] leading-relaxed"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-bold text-[#362625] hover:text-[#362625]/80 transition-colors underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-bold text-[#362625] hover:text-[#362625]/80 transition-colors underline"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl text-[#faf3e0] bg-gradient-to-r from-[#362625] to-[#4a3532] hover:from-[#4a3532] hover:to-[#362625] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <span className="text-[#362625]/70">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="font-bold text-[#362625] hover:text-[#362625]/80 transition-colors underline"
                >
                  Sign in here
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
