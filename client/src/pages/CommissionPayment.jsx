import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Package,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Rw2UhQcGakY3xP2bNoe6cwyMYCMihyNol4EJZLWWUd1D0jvQj627YPHlE01WzhFWJ12UU340FCcAkMFnnQQFmLp00EZMIL15R"
);

function StripeCommissionPaymentForm({ billingInfo, order, onSuccess }) {
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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${apiUrl}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Math.round(order.budget * 100),
            currency: "lkr",
            metadata: {
              type: "commission",
              orderId: order.orderId || order.id,
              commissionId: order.id,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      clientSecret = data.clientSecret;
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          address: {
            line1: billingInfo.address,
            city: billingInfo.city,
            state: billingInfo.state,
            postal_code: billingInfo.zipCode,
            country: "LK",
          },
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#7f5539] mb-2">
            Card Information
          </label>
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#7f5539",
                "::placeholder": {
                  color: "#7f5539",
                },
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Lock className="w-4 h-4" />
          <span className="font-medium">Secure Payment</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          We use Stripe for secure payments. Your card details are never stored
          on our servers.
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#D87C5A] hover:bg-[#7f5539] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing Payment...
          </>
        ) : (
          <>
            Complete Payment - LKR {order.budget?.toLocaleString()}
            <Lock className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}

const CommissionPayment = () => {
  const { commissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || {};

  const [billing, setBilling] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  });

  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [existingAddress, setExistingAddress] = useState(null);

  const fetchExistingAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const userData = await response.json();

      if (userData) {
        setExistingAddress({
          address: userData.streetAddress || "",
          city: userData.city || "",
          state: userData.state || "",
          zipCode: userData.zipCode || "",
          country: "Sri Lanka",
        });
      }
    } catch (error) {
      console.error("Failed to fetch existing address:", error);
    }
  };

  React.useEffect(() => {
    fetchExistingAddress();
  }, []);

  const handleUseExistingAddress = (checked) => {
    setUseExistingAddress(checked);
    if (checked && existingAddress) {
      setBilling({
        ...existingAddress,
        country: "Sri Lanka",
      });
    } else {
      setBilling({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Sri Lanka",
      });
    }
  };

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleStripeSuccess = async (stripePaymentId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");

      // Format shipping address
      const shippingAddress = `${billing.address}, ${billing.city}, ${billing.state}, ${billing.zipCode}, ${billing.country}`;

      // Save commission payment information to correct endpoint
      const commissionPaymentPayload = {
        commissionId: order.id,
        stripePaymentId: stripePaymentId,
        amount: order.budget,
        currency: "LKR",
        status: "escrow",
        shippingAddress: shippingAddress,
        paymentMethod: "stripe",
        paymentDate: new Date().toISOString(),
      };

      // Call the correct endpoint for commission payment processing
      const response = await fetch(
        `${apiUrl}/api/payment/commissions/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(commissionPaymentPayload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Navigate to confirmation page with updated order status
      const paymentId = `COMM_PAY_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      navigate("/commission-payment-confirmation", {
        state: {
          order: {
            ...order,
            status: "escrow",
            stripePaymentId: stripePaymentId,
          },
          billing: billing,
          paymentId: paymentId,
        },
      });
    } catch (error) {
      console.error("Failed to process commission payment:", error);
      // Still navigate to confirmation but show warning
      navigate("/commission-payment-confirmation", {
        state: {
          order: {
            ...order,
            status: "escrow",
            stripePaymentId: stripePaymentId,
          },
          billing: billing,
          paymentId: `COMM_PAY_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          warning:
            "Payment successful but order status update failed. Please contact support.",
        },
      });
    }
  };

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
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Commission Orders Payment
            </h1>
            <p className="text-[#7f5539]/70">
              Complete your payment for the accepted commission
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-[#D87C5A]" />
                  <h2 className="text-xl font-semibold text-[#7f5539]">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#D87C5A] text-lg mb-2">
                      {order.title || "Commission Order"}
                    </h3>
                    <p className="text-sm text-[#7f5539]/70 mb-3">
                      {order.description || "Custom artwork commission"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7f5539]/70">
                        Order ID:
                      </span>
                      <span className="font-medium text-[#7f5539]">
                        #{order.orderId || order.id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7f5539]/70">Status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {order.status || "Accepted"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7f5539]/70">
                        Requested Date:
                      </span>
                      <span className="font-medium text-[#7f5539]">
                        {formatDate(order.createdAt || order.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {order.imageUrls && order.imageUrls.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#7f5539] mb-2">
                        Reference Images
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {order.imageUrls.slice(0, 6).map((img, idx) => (
                          <img
                            key={idx}
                            src={
                              img.startsWith("/uploads/")
                                ? `${import.meta.env.VITE_API_URL}${img}`
                                : img
                            }
                            alt="Reference"
                            className="w-full h-16 object-cover rounded border border-[#FFD95A]"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-[#FFE4D6] pt-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#7f5539]">Commission Fee</span>
                        <span className="font-medium text-[#7f5539]">
                          LKR {order.budget?.toLocaleString()}
                        </span>
                      </div>
                      <hr className="border-[#FFE4D6]" />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-[#7f5539]">
                          Total
                        </span>
                        <span className="font-bold text-[#D87C5A]">
                          LKR {order.budget?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-[#D87C5A]" />
                  <h2 className="text-xl font-semibold text-[#7f5539]">
                    Shipping Address
                  </h2>
                </div>

                <div className="mb-6 p-4 bg-[#FFF5E1] border border-[#FFD95A] rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useExistingAddress}
                      onChange={(e) =>
                        handleUseExistingAddress(e.target.checked)
                      }
                      disabled={!existingAddress}
                      className="w-4 h-4 text-[#D87C5A] border-[#FFD95A] rounded focus:ring-[#D87C5A] disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-[#7f5539]">
                      Use my saved address information
                      {!existingAddress && (
                        <span className="text-xs text-[#7f5539]/50 ml-2">
                          (No saved address found)
                        </span>
                      )}
                    </span>
                  </label>
                </div>

                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        Street Address *
                      </label>
                      <input
                        name="address"
                        value={billing.address}
                        onChange={handleChange}
                        required
                        placeholder="Enter street address"
                        className="w-full border border-[#FFD95A] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        City *
                      </label>
                      <input
                        name="city"
                        value={billing.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter city"
                        className="w-full border border-[#FFD95A] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        State/Province *
                      </label>
                      <input
                        name="state"
                        value={billing.state}
                        onChange={handleChange}
                        required
                        placeholder="Enter state/province"
                        className="w-full border border-[#FFD95A] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        Zip Code *
                      </label>
                      <input
                        name="zipCode"
                        value={billing.zipCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter zip code"
                        className="w-full border border-[#FFD95A] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#7f5539] mb-2">
                        Country *
                      </label>
                      <input
                        name="country"
                        value={billing.country}
                        readOnly
                        className="w-full border border-[#FFD95A] rounded-lg p-3 bg-gray-50 text-[#7f5539] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-[#D87C5A]" />
                  <h2 className="text-xl font-semibold text-[#7f5539]">
                    Payment Method
                  </h2>
                </div>

                <Elements stripe={stripePromise}>
                  <StripeCommissionPaymentForm
                    billingInfo={billing}
                    order={order}
                    onSuccess={handleStripeSuccess}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionPayment;
