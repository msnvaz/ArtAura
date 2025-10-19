import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  DollarSign,
  Package,
  ArrowRight,
  Home,
} from "lucide-react";
import Navbar from "../components/common/Navbar";

const CommissionPaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, billing, paymentId } = location.state || {};
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

        if (!token || !userId) return;

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-[#7f5539]/70">
              Your commissioned order payment has been processed successfully
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Commission Details */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-[#D87C5A]" />
                  <h2 className="text-xl font-semibold text-[#7f5539]">
                    Commission Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#D87C5A] text-lg mb-2">
                      {order?.title || "Commission Order"}
                    </h3>
                    <p className="text-sm text-[#7f5539]/70">
                      {order?.description || "Custom artwork commission"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#7f5539]/70">Order ID:</span>
                      <p className="font-medium text-[#7f5539]">
                        #{order?.orderId || order?.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7f5539]/70">Status:</span>
                      <p className="font-medium text-green-600">Paid</p>
                    </div>
                    <div>
                      <span className="text-[#7f5539]/70">Requested Date:</span>
                      <p className="font-medium text-[#7f5539]">
                        {formatDate(order?.createdAt || order?.submittedAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7f5539]/70">Payment Date:</span>
                      <p className="font-medium text-[#7f5539]">
                        {formatDate(new Date())}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#FFE4D6] pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold text-[#7f5539]">
                        Total Paid:
                      </span>
                      <span className="text-2xl font-bold text-[#D87C5A]">
                        LKR {order?.budget?.toLocaleString()}
                      </span>
                    </div>

                    {/* Delivery Charge Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-amber-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-amber-800 mb-1">
                            Additional Delivery Charges
                          </h4>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            A delivery charge of{" "}
                            <span className="font-semibold">
                              LKR 500 - 1,500
                            </span>{" "}
                            will apply upon delivery, collected directly by the
                            delivery partner and varies based on size and
                            weight.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - User Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-xl font-semibold text-[#7f5539]">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#7f5539]/70">Name:</span>
                    <p className="font-medium text-[#7f5539]">
                      {userProfile?.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#7f5539]/70">Email:</span>
                    <p className="font-medium text-[#7f5539]">
                      {userProfile?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#7f5539]/70">Phone:</span>
                    <p className="font-medium text-[#7f5539]">
                      {userProfile?.contactNo || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#7f5539]/70">Shipping Address:</span>
                    <p className="font-medium text-[#7f5539]">
                      {billing?.address}
                      <br />
                      {billing?.city}, {billing?.state} {billing?.zipCode}
                      <br />
                      {billing?.country}
                    </p>
                  </div>
                  {paymentId && (
                    <div>
                      <span className="text-[#7f5539]/70">
                        Payment Reference:
                      </span>
                      <p className="font-medium text-[#7f5539] text-xs">
                        {paymentId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-[#FFF5E1] to-[#FFE4D6] border border-[#FFD95A] rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#7f5539] mb-3">
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#D87C5A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-[#7f5539]">
                    Artist Notification
                  </p>
                  <p className="text-[#7f5539]/70">
                    The artist will be notified of your payment and will begin
                    working on your commission.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#D87C5A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-[#7f5539]">Work in Progress</p>
                  <p className="text-[#7f5539]/70">
                    You'll receive updates on the progress of your commission
                    through notifications.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#D87C5A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-[#7f5539]">
                    Completion & Delivery
                  </p>
                  <p className="text-[#7f5539]/70">
                    Once completed, your artwork will be prepared for delivery
                    to your address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/orders")}
              className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View My Orders
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionPaymentConfirmation;
