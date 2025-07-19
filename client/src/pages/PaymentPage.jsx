import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Lock,
  Calendar,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { billingInfo, orderSummary } = location.state || {};

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    paymentMethod: "credit",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no billing info
  if (!billingInfo || !orderSummary) {
    navigate("/checkout");
    return null;
  }

  const handleInputChange = (field, value) => {
    setPaymentInfo((prev) => ({
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

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4);
    }
    return digits;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    const cardDigits = paymentInfo.cardNumber.replace(/\D/g, "");
    if (!cardDigits) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardDigits.length < 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!paymentInfo.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date format (MM/YY)";
    }

    if (!paymentInfo.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (validateForm()) {
      setIsProcessing(true);

      // Simulate payment processing
      setTimeout(() => {
        const orderId = `ORD-${Date.now()}`;
        navigate("/order-confirmation", {
          state: {
            orderId,
            billingInfo,
            orderSummary,
            paymentMethod: paymentInfo.paymentMethod,
          },
        });
      }, 3000);
    }
  };

  const handleBackToBilling = () => {
    navigate("/checkout");
  };

  const getCardType = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.startsWith("4")) return "Visa";
    if (digits.startsWith("5")) return "Mastercard";
    if (digits.startsWith("3")) return "American Express";
    return "Credit Card";
  };

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">Payment</h1>
            <div className="flex items-center gap-2 text-sm text-[#7f5539]/70">
              <span>Cart</span>
              <ArrowRight className="w-4 h-4" />
              <span>Billing Information</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-medium text-[#D87C5A]">Payment</span>
              <ArrowRight className="w-4 h-4" />
              <span>Confirmation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
                <h2 className="text-xl font-semibold text-[#7f5539] mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h2>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#7f5539] mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex items-center p-3 border-2 border-[#FFE4D6] rounded-lg cursor-pointer hover:border-[#FFD95A] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={paymentInfo.paymentMethod === "credit"}
                        onChange={(e) =>
                          handleInputChange("paymentMethod", e.target.value)
                        }
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-2 text-[#7f5539]" />
                      <span className="text-[#7f5539] font-medium">
                        Credit Card
                      </span>
                    </label>

                    <label className="flex items-center p-3 border-2 border-[#FFE4D6] rounded-lg cursor-pointer hover:border-[#FFD95A] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="debit"
                        checked={paymentInfo.paymentMethod === "debit"}
                        onChange={(e) =>
                          handleInputChange("paymentMethod", e.target.value)
                        }
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-2 text-[#7f5539]" />
                      <span className="text-[#7f5539] font-medium">
                        Debit Card
                      </span>
                    </label>

                    <label className="flex items-center p-3 border-2 border-[#FFE4D6] rounded-lg cursor-pointer hover:border-[#FFD95A] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentInfo.paymentMethod === "paypal"}
                        onChange={(e) =>
                          handleInputChange("paymentMethod", e.target.value)
                        }
                        className="mr-3"
                      />
                      <span className="w-5 h-5 mr-2 bg-[#0070ba] rounded text-white text-xs flex items-center justify-center font-bold">
                        P
                      </span>
                      <span className="text-[#7f5539] font-medium">PayPal</span>
                    </label>
                  </div>
                </div>

                {/* Card Details Form */}
                {(paymentInfo.paymentMethod === "credit" ||
                  paymentInfo.paymentMethod === "debit") && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardholderName}
                        onChange={(e) =>
                          handleInputChange("cardholderName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                          errors.cardholderName
                            ? "border-red-500"
                            : "border-[#FFE4D6]"
                        }`}
                        placeholder="Enter cardholder name"
                      />
                      {errors.cardholderName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cardholderName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "cardNumber",
                              formatCardNumber(e.target.value)
                            )
                          }
                          className={`w-full px-3 py-2 pr-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                            errors.cardNumber
                              ? "border-red-500"
                              : "border-[#FFE4D6]"
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-[#7f5539]/70">
                          {getCardType(paymentInfo.cardNumber)}
                        </div>
                      </div>
                      {errors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#7f5539] mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            handleInputChange(
                              "expiryDate",
                              formatExpiryDate(e.target.value)
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                            errors.expiryDate
                              ? "border-red-500"
                              : "border-[#FFE4D6]"
                          }`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#7f5539] mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            handleInputChange(
                              "cvv",
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                            errors.cvv ? "border-red-500" : "border-[#FFE4D6]"
                          }`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Option */}
                {paymentInfo.paymentMethod === "paypal" && (
                  <div className="bg-[#FFF5E1] border border-[#FFD95A] rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-[#0070ba] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">P</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#7f5539] mb-2">
                      Pay with PayPal
                    </h3>
                    <p className="text-[#7f5539]/70 text-sm">
                      You'll be redirected to PayPal to complete your payment
                      securely.
                    </p>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-[#FFF5E1] border border-[#FFD95A] rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-[#7f5539]">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-xs text-[#7f5539]/70 mt-1">
                    Your payment information is encrypted and secure. We never
                    store your card details.
                  </p>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBackToBilling}
                    className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Billing
                  </button>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Complete Order
                        <Lock className="w-4 h-4" />
                      </>
                    )}
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

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7f5539]">Subtotal</span>
                    <span className="font-medium text-[#7f5539]">
                      ${orderSummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7f5539]">Shipping</span>
                    <span className="font-medium text-[#7f5539]">
                      {orderSummary.shipping === 0
                        ? "FREE"
                        : `$${orderSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7f5539]">Tax</span>
                    <span className="font-medium text-[#7f5539]">
                      ${orderSummary.tax.toFixed(2)}
                    </span>
                  </div>
                  <hr className="border-[#FFE4D6]" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[#7f5539]">Total</span>
                    <span className="font-bold text-[#D87C5A]">
                      ${orderSummary.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="border-t border-[#FFE4D6] pt-4">
                  <h3 className="font-semibold text-[#7f5539] mb-3">
                    Billing Address
                  </h3>
                  <div className="text-sm text-[#7f5539]/70 space-y-1">
                    <p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
