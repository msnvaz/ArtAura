import React, { useEffect } from "react";
import {
  CheckCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Package,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/common/Navbar";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { orderId, billingInfo, orderSummary, paymentMethod } =
    location.state || {};

  // Redirect if no order data
  if (!orderId || !billingInfo || !orderSummary) {
    navigate("/shop-products");
    return null;
  }

  // Clear cart after order confirmation
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line
  }, []);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now

  const handleContinueShopping = () => {
    // Force navigation and reload if necessary
    window.location.href = "/shop-products";
  };

  const handleDownloadReceipt = () => {
    // Simulate downloading receipt
    const receiptData = {
      orderId,
      billingInfo,
      orderSummary,
      paymentMethod,
      orderDate: new Date().toLocaleDateString(),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(receiptData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `receipt-${orderId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-[#7f5539] mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-[#7f5539]/70 mb-4">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
            <div className="bg-white rounded-lg border border-[#FFD95A] p-4 inline-block">
              <p className="text-sm text-[#7f5539]/70">Order Number</p>
              <p className="text-xl font-bold text-[#D87C5A]">{orderId}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
              <h2 className="text-xl font-semibold text-[#7f5539] mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7f5539]">Subtotal</span>
                  <span className="font-medium text-[#7f5539]">
                    LKR{" "}
                    {orderSummary.subtotal.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
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
                        <span className="font-semibold">LKR 500 - 1,500</span>{" "}
                        will apply upon delivery, collected directly by the
                        delivery partner and varies based on size and weight.
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-[#FFE4D6]" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-[#7f5539]">
                    Total Paid
                  </span>
                  <span className="font-bold text-[#D87C5A]">
                    LKR{" "}
                    {orderSummary.subtotal.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="bg-[#FFF5E1] border border-[#FFD95A] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#7f5539]" />
                  <span className="text-sm font-medium text-[#7f5539]">
                    Payment Method
                  </span>
                </div>
                <p className="text-sm text-[#7f5539]/70 capitalize">
                  {paymentMethod === "credit"
                    ? "Credit Card (Stripe)"
                    : paymentMethod === "debit"
                    ? "Debit Card (Stripe)"
                    : "Stripe"}
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
              <h2 className="text-xl font-semibold text-[#7f5539] mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#7f5539]/70 mb-1">
                    Delivery Address
                  </p>
                  <div className="text-sm text-[#7f5539]">
                    <p className="font-medium">
                      {billingInfo.firstName} {billingInfo.lastName}
                    </p>
                    <p>{billingInfo.address}</p>
                    <p>
                      {billingInfo.city}, {billingInfo.state}{" "}
                      {billingInfo.zipCode}
                    </p>
                    <p>{billingInfo.country}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#7f5539]/70 mb-1">
                    Contact Information
                  </p>
                  <div className="text-sm text-[#7f5539] space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{billingInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{billingInfo.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF5E1] border border-[#FFD95A] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#7f5539]" />
                    <span className="text-sm font-medium text-[#7f5539]">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-sm text-[#7f5539]/70">
                    {estimatedDelivery.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#7f5539] mb-6">
              What's Next?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FFD95A] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-[#7f5539]" />
                </div>
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Order Processing
                </h3>
                <p className="text-sm text-[#7f5539]/70">
                  We'll prepare your order and send you tracking information
                  once shipped.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#FFD95A] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-[#7f5539]" />
                </div>
                <h3 className="font-semibold text-[#7f5539] mb-2">Delivery</h3>
                <p className="text-sm text-[#7f5539]/70">
                  Your art supplies will be delivered to your address within 5-7
                  business days.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center gap-2 bg-white border-2 border-[#FFD95A] text-[#7f5539] px-6 py-3 rounded-lg font-medium hover:bg-[#FFF5E1] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>

            <button
              onClick={handleContinueShopping}
              className="flex items-center justify-center gap-2 bg-[#D87C5A] hover:bg-[#7f5539] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#7f5539]/70 mb-2">
              Need help with your order? Contact our support team.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-[#7f5539]">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>support@artaura.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>011-2433333</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
