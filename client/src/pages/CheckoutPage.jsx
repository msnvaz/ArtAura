import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, getCartItemsCount } = useCart();
  const { user } = useUser();
  const { token, userId } = useAuth();
  const navigate = useNavigate();

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  });

  const [useAccountDetails, setUseAccountDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!token || !userId) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    axios
      .get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfileData(res.data))
      .catch(() => setProfileData(null));
  }, [token, userId]);

  useEffect(() => {
    if (useAccountDetails && profileData) {
      setBillingInfo({
        firstName:
          profileData?.name?.split(" ")[0] || profileData?.firstName || "",
        lastName:
          profileData?.name?.split(" ").slice(1).join(" ") ||
          profileData?.lastName ||
          "",
        email: profileData?.email || "",
        phone: profileData?.contactNo || profileData?.phone || "",
        address: profileData?.streetAddress || profileData?.address || "",
        city: profileData?.city || "",
        state: profileData?.state || "",
        zipCode: profileData?.zipCode || "",
        country: profileData?.country || "Sri Lanka",
      });
    } else if (!useAccountDetails) {
      setBillingInfo({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Sri Lanka",
      });
    }
  }, [useAccountDetails, profileData]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  const handleInputChange = (field, value) => {
    setBillingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!billingInfo.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!billingInfo.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!billingInfo.email.trim()) newErrors.email = "Email is required";
    if (!billingInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!billingInfo.address.trim()) newErrors.address = "Address is required";
    if (!billingInfo.city.trim()) newErrors.city = "City is required";
    if (!billingInfo.state.trim()) newErrors.state = "State is required";
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (billingInfo.email && !emailRegex.test(billingInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateForm()) {
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
        navigate("/payment", {
          state: {
            billingInfo,
            orderSummary: { subtotal, shipping, total },
            cartItems, // Pass cartItems to PaymentPage
          },
        });
      }, 1000);
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">Checkout</h1>
            <div className="flex items-center gap-2 text-sm text-[#7f5539]/70">
              <span>Cart</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-medium text-[#D87C5A]">
                Billing Information
              </span>
              <ArrowRight className="w-4 h-4" />
              <span>Payment</span>
              <ArrowRight className="w-4 h-4" />
              <span>Confirmation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing Information Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
                <h2 className="text-xl font-semibold text-[#7f5539] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Billing Information
                </h2>
                {/* Checkbox for autofill */}
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useAccountDetails"
                    checked={useAccountDetails}
                    onChange={() => setUseAccountDetails((prev) => !prev)}
                    className="accent-[#FFD95A] w-5 h-5"
                  />
                  <label
                    htmlFor="useAccountDetails"
                    className="text-[#7f5539] font-medium cursor-pointer flex items-center gap-1"
                  >
                    Use my account details for billing
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.firstName ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.lastName ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.email ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.phone ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.address ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your street address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.city ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.state ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                        errors.zipCode ? "border-red-500" : "border-[#FFE4D6]"
                      }`}
                      placeholder="Enter your ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value="Sri Lanka"
                      disabled
                      className="w-full px-3 py-2 border border-[#FFE4D6] rounded-lg bg-gray-100 text-[#7f5539] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBackToCart}
                    className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                  </button>

                  <button
                    onClick={handleContinueToPayment}
                    disabled={isProcessing}
                    className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Continue to Payment"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-[#7f5539] mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.artwork_id} className="flex gap-3">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg border border-[#FFE4D6]"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#7f5539] text-sm">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={item.artist_image}
                            alt={item.artist_name}
                            className="w-5 h-5 rounded-full border border-[#FFD95A]"
                          />
                          <span className="text-xs text-[#7f5539]/80 font-medium">
                            {item.artist_name}
                          </span>
                        </div>
                        <p className="text-xs text-[#7f5539]/70">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-[#D87C5A]">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="border-[#FFE4D6] mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7f5539]">Subtotal</span>
                    <span className="font-medium text-[#7f5539]">
                      LKR {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7f5539]">Shipping</span>
                    <span className="font-medium text-[#7f5539]">
                      {shipping === 0
                        ? "To be decided"
                        : `LKR ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <hr className="border-[#FFE4D6]" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[#7f5539]">Total</span>
                    <span className="font-bold text-[#D87C5A]">
                      LKR{" "}
                      {total.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
