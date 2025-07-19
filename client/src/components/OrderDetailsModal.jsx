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

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({
    name: "",
    id: null,
  });

  if (!isOpen || !order) return null;

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

  const handleReviewSubmit = (reviewData) => {
    // Here you would typically send the review to your backend
    console.log("Review submitted:", reviewData);
    alert("Review submitted successfully!");
  };

  const openReviewModal = (artistName, artistId) => {
    setSelectedArtist({
      name: artistName,
      id: artistId,
    });
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedArtist({ name: "", id: null });
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
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Order Date
                </h3>
                <p className="text-[#7f5539]">{formatDate(order.date)}</p>
              </div>

              <div className="bg-[#FFF5E1] rounded-lg p-4">
                <h3 className="font-semibold text-[#7f5539] mb-2">
                  Total Amount
                </h3>
                <p className="text-2xl font-bold text-[#D87C5A]">
                  ${order.total}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold text-[#7f5539] mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-[#FFD95A] rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#7f5539] text-lg">
                        {item.title}
                      </h4>
                      <p className="text-[#7f5539]/70 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        by {item.artist}
                      </p>
                      <p className="text-sm text-[#7f5539]/70">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#D87C5A] text-lg">
                        ${item.price}
                      </p>
                      {order.status === "delivered" && (
                        <button
                          onClick={() => openReviewModal(item.artist, item.id)}
                          className="mt-2 bg-[#D87C5A] hover:bg-[#7f5539] text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          Review Artist
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Information - Expanded */}
              <div className="bg-[#FFF5E1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[#7f5539]/70">
                      Delivery Address:
                    </p>
                    <p className="text-[#7f5539]">{order.shipping.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f5539]/70">
                      Shipping Method:
                    </p>
                    <p className="text-[#7f5539]">{order.shipping.method}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f5539]/70">
                      Estimated Delivery:
                    </p>
                    <p className="text-[#7f5539]">
                      {order.status === "delivered"
                        ? "Delivered"
                        : order.status === "shipped"
                        ? "2-3 business days"
                        : "5-7 business days after processing"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information - Expanded */}
              <div className="bg-[#FFF5E1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[#7f5539]/70">
                      Payment Method:
                    </p>
                    <p className="text-[#7f5539]">{order.payment.method}</p>
                  </div>
                  {order.payment.last4 && (
                    <div>
                      <p className="text-sm font-medium text-[#7f5539]/70">
                        Card Number:
                      </p>
                      <p className="text-[#7f5539] font-mono">
                        •••• •••• •••• {order.payment.last4}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#7f5539]/70">
                      Transaction Status:
                    </p>
                    <p className="text-green-600 font-medium">Completed</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#7f5539]/70">
                      Billing Address:
                    </p>
                    <p className="text-[#7f5539]">{order.shipping.address}</p>
                  </div>
                  <div className="pt-2 border-t border-[#FFD95A]">
                    <div className="flex justify-between">
                      <span className="text-[#7f5539]/70">Subtotal:</span>
                      <span className="text-[#7f5539]">
                        ${(order.total * 0.9).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f5539]/70">Shipping:</span>
                      <span className="text-[#7f5539]">
                        ${(order.total * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7f5539]/70">Tax:</span>
                      <span className="text-[#7f5539]">
                        ${(order.total * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-1 border-t border-[#FFD95A]">
                      <span className="text-[#7f5539]">Total:</span>
                      <span className="text-[#D87C5A]">${order.total}</span>
                    </div>
                  </div>
                </div>
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
    </>
  );
};

export default OrderDetailsModal;
