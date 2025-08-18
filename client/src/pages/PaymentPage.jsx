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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";

const stripePromise = loadStripe(
  "pk_test_51Rw2UhQcGakY3xP2bNoe6cwyMYCMihyNol4EJZLWWUd1D0jvQj627YPHlE01WzhFWJ12UU340FCcAkMFnnQQFmLp00EZMIL15R"
);

function StripePaymentForm({ billingInfo, orderSummary, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    let clientSecret;
    try {
      // Use environment variable for backend URL and send JWT token
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token"); // Or get from context if you use AuthContext
      const response = await fetch(
        `${apiUrl}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Math.round(orderSummary.total * 100),
            currency: "lkr",
          }),
        }
      );
      const data = await response.json();
      clientSecret = data.clientSecret;
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
      return;
    }
    // Confirm card payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: billingInfo.firstName + " " + billingInfo.lastName,
          email: billingInfo.email,
        },
      },
    });
    if (result.error) {
      setError(result.error.message);
      setIsProcessing(false);
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      setIsProcessing(false);
      onSuccess(result.paymentIntent.id);
    } else {
      setError("Payment could not be completed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#FFF5E1] border border-[#FFD95A] rounded-lg p-6">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
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
    </form>
  );
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    billingInfo,
    orderSummary,
    cartItems: locationCartItems,
  } = location.state || {};
  // Use cartItems from location.state for order creation
  const { clearCart } = useCart();

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

  const handleStripeSuccess = async (stripePaymentId) => {
    clearCart();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("token");
    try {
      await fetch(`${apiUrl}/api/cart/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {}

    // Prepare order payload
    const userId = localStorage.getItem("userId"); // Or get from context
    const orderPayload = {
      buyerId: userId,
      status: "paid",
      orderDate: new Date().toISOString(),
      billingFirstName: billingInfo.firstName,
      billingLastName: billingInfo.lastName,
      billingEmail: billingInfo.email,
      billingPhone: billingInfo.phone,
      billingAddress: billingInfo.address,
      billingCity: billingInfo.city,
      billingState: billingInfo.state,
      billingZipCode: billingInfo.zipCode,
      billingCountry: billingInfo.country,
      paymentMethod: "stripe",
      stripePaymentId: stripePaymentId,
      totalAmount: orderSummary.total,
      items: (locationCartItems || []).map((item) => ({
        artworkId: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
        artistId: item.artistId || item.artist_id,
      })),
    };
    await fetch(`${apiUrl}/api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const orderId = `ORD-${Date.now()}`;
    navigate("/order-confirmation", {
      state: {
        orderId,
        billingInfo,
        orderSummary,
        paymentMethod: "card",
      },
    });
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
                <div className="mb-6 p-4 bg-[#FFF5E1] border border-[#FFD95A] rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-[#7f5539]">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-xs text-[#7f5539]/70 mt-1">
                    We use Stripe for secure payments. Your card details are
                    never stored on our servers.
                  </p>
                </div>
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    billingInfo={billingInfo}
                    orderSummary={orderSummary}
                    onSuccess={handleStripeSuccess}
                  />
                </Elements>
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
                      LKR{" "}
                      {orderSummary.subtotal.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7f5539]">Shipping</span>
                    <span className="font-medium text-[#7f5539]">
                      {orderSummary.shipping === 0
                        ? "FREE"
                        : `LKR ${orderSummary.shipping.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}`}
                    </span>
                  </div>
                  <hr className="border-[#FFE4D6]" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[#7f5539]">Total</span>
                    <span className="font-bold text-[#D87C5A]">
                      LKR{" "}
                      {orderSummary.total.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
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
