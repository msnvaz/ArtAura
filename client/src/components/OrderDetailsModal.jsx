import React, { useState } from "react";
import {
  XCircle,
  Star,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Calendar,
  User,
} from "lucide-react";
import ReviewModal from "./ReviewModal";
import Toast from "./Toast";

const API_URL = import.meta.env.VITE_API_URL;

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({ name: "", id: null });
  const [ratedArtists, setRatedArtists] = useState(new Set());
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  if (!isOpen || !order) return null;

  const makeRatedKey = (artistId) =>
    `rated:shop:${order.id}:${artistId ?? "unknown"}`;
  const isDelivered =
    ["delivered", "completed"].includes(
      String(order.status || "").toLowerCase()
    ) || String(order.deliveryStatus || "").toLowerCase() === "delivered";

  const syncRatedFromStorage = () => {
    const next = new Set();
    (order.items || []).forEach((it) => {
      const key = makeRatedKey(it.artistId);
      if (localStorage.getItem(key) === "1") next.add(it.artistId);
    });
    setRatedArtists(next);
  };

  const handleReviewSubmit = async (reviewData) => {
    const artistId = selectedArtist.id;
    const orderId = order.id;
    const buyerId = order.buyerId;
    const token = localStorage.getItem("token"); // or your actual token key
    console.log(
      "Submitting review for artistId:",
      artistId,
      "orderId:",
      orderId,
      "buyerId:",
      buyerId,
      reviewData
    );
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          artistId,
          buyerId,
          orderId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        setToast({
          isVisible: true,
          message: "Failed to submit review: " + err,
          type: "error",
        });
        return;
      }
      // Persist rated flag locally to prevent duplicates client-side
      if (artistId != null) {
        localStorage.setItem(makeRatedKey(artistId), "1");
        setRatedArtists((prev) => new Set(prev).add(artistId));
      }
      setToast({
        isVisible: true,
        message: "Review submitted successfully!",
        type: "success",
      });
      setShowReviewModal(false);
    } catch (e) {
      setToast({
        isVisible: true,
        message: "Error submitting review: " + e.message,
        type: "error",
      });
    }
  };

  const openReviewModal = (artistName, artistId) => {
    setSelectedArtist({ name: artistName, id: artistId });
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    const baseClass = "w-4 h-4";
    switch (status) {
      case "delivered":
        return <CheckCircle className={baseClass} />;
      case "shipped":
        return <CheckCircle className={baseClass} />;
      case "processing":
        return <Clock className={baseClass} />;
      case "pending":
        return <Calendar className={baseClass} />;
      case "cancelled":
        return <XCircle className={baseClass} />;
      default:
        return <Clock className={baseClass} />;
    }
  };

  const renderStars = (rating = 5, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 hover:text-yellow-300"
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#D87C5A] to-[#7f5539] p-6 rounded-t-2xl">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="opacity-90">Order ID: {order.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Order Status & Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Order Status
                </h3>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </div>
              </div>
              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Order Date
                </h3>
                <p className="text-[#7f5539]">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : ""}
                </p>
              </div>
              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Total Amount
                </h3>
                <p className="text-2xl font-bold text-[#D87C5A]">
                  LKR {order.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* All Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Order Info
                </h3>
                <div className="space-y-2 text-[#7f5539]/80">
                  <div>
                    <span className="font-medium">Order ID:</span> {order.id}
                  </div>
                  <div>
                    <span className="font-medium">Buyer ID:</span>{" "}
                    {order.buyerId}
                  </div>
                  <div>
                    <span className="font-medium">First Name:</span>{" "}
                    {order.firstName || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Last Name:</span>{" "}
                    {order.lastName || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {order.email || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Contact Number:</span>{" "}
                    {order.contactNumber || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Shipping Address:</span>{" "}
                    {order.shippingAddress || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Shipping Fee:</span> LKR{" "}
                    {order.shippingFee?.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod || "-"}
                  </div>
                </div>
              </div>
              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Status & Payment
                </h3>
                <div className="space-y-2 text-[#7f5539]/80">
                  <div>
                    <span className="font-medium">Status:</span> {order.status}
                  </div>
                  <div>
                    <span className="font-medium">Order Date:</span>{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : ""}
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> LKR{" "}
                    {order.totalAmount?.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Shipping Fee:</span> LKR{" "}
                    {order.shippingFee?.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold text-[#7f5539] mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => {
                    const alreadyRated =
                      ratedArtists.has(item.artistId) ||
                      localStorage.getItem(makeRatedKey(item.artistId)) === "1";
                    return (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-4 p-4 border border-[#FFD95A] rounded-lg"
                      >
                        {/* Artwork Image */}
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg border border-[#FFD95A] mb-2"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-[#7f5539] text-lg">
                            {item.title}
                          </h4>
                          <div className="text-[#7f5539]/70 text-sm">
                            Medium: {item.medium}
                          </div>
                          <div className="text-[#7f5539]/70 text-sm">
                            Size: {item.size}
                          </div>
                          <div className="text-[#7f5539]/70 text-sm">
                            Quantity: {item.quantity}
                          </div>
                          <div className="text-[#7f5539]/70 text-sm">
                            Price: LKR {item.price?.toLocaleString()}
                          </div>
                          {/* Artist Info */}
                          <div className="flex items-center gap-2 mt-2">
                            {item.artistAvatarUrl && (
                              <img
                                src={item.artistAvatarUrl}
                                alt="Artist Avatar"
                                className="w-8 h-8 rounded-full border border-[#FFD95A]"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-[#7f5539]">
                                {item.artistName}
                              </div>
                              <div className="text-xs text-[#7f5539]/70">
                                Email: {item.artistEmail}
                              </div>
                              <div className="text-xs text-[#7f5539]/70">
                                Location: {item.artistLocation}
                              </div>
                              <div className="text-xs text-[#7f5539]/70">
                                Contact: {item.artistContactNo}
                              </div>
                            </div>
                            <button
                              disabled={!isDelivered || alreadyRated}
                              onClick={() =>
                                openReviewModal(item.artistName, order.artistId)
                              }
                              className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                !isDelivered || alreadyRated
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-[#D87C5A] hover:bg-[#7f5539] text-white"
                              }`}
                              onMouseEnter={syncRatedFromStorage}
                            >
                              {alreadyRated ? "Rated" : "Rate"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[#7f5539]/70">
                    No items in this order.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#FFD95A]">
              <button
                onClick={onClose}
                className="border border-[#D87C5A] text-[#D87C5A] hover:bg-[#D87C5A] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        artistName={selectedArtist.name}
        artistId={selectedArtist.id}
        onSubmitReview={handleReviewSubmit}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
    </>
  );
};

export default OrderDetailsModal;
