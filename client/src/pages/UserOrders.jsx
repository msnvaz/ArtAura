import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  Calendar,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import OrderDetailsModal from "../components/OrderDetailsModal";
import CommissionOrderDetailsModal from "../components/modals/CommissionOrderDetailsModal";

const API_URL = import.meta.env.VITE_API_URL;

const fetchCommissionOrders = async (setCommissionOrders, setLoading) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/commissions/my-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });
    const commissionOrders = Array.isArray(response.data) ? response.data : [];

    // Sort commission orders by date (latest first)
    const sortedCommissionOrders = commissionOrders.sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt || 0);
      const dateB = new Date(b.submittedAt || b.createdAt || 0);
      return dateB - dateA; // Latest first (descending order)
    });

    setCommissionOrders(sortedCommissionOrders);
  } catch (error) {
    setCommissionOrders([]);
  } finally {
    setLoading(false);
  }
};

// Add a delivery tracking visualization component
const renderTrackingProgress = (deliveryStatus) => {
  const steps = ["pending", "accepted", "outfordelivery", "delivered"];
  const stepLabels = ["Pending", "Accepted", "Out for Delivery", "Delivered"];
  const currentStep = steps.indexOf(deliveryStatus?.toLowerCase());

  return (
    <div className="flex items-center gap-2 mt-4 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center min-w-0">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                index <= currentStep
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs text-center mt-1 max-w-20">
              {stepLabels[index]}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-8 mx-2 ${
                index < currentStep ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Add a safeguard to handle undefined or null status
const renderDeliveryStatus = (status) => {
  if (!status || status === "N/A") {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        N/A
      </span>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    outfordelivery: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    pending: "Pending",
    accepted: "Accepted",
    outfordelivery: "Out for Delivery",
    delivered: "Delivered",
  };

  const normalizedStatus = status.toLowerCase();

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        statusColors[normalizedStatus] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[normalizedStatus] || status}
    </span>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]); // Artwork orders
  const [commissionOrders, setCommissionOrders] = useState([]); // Commissioned requests
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState("artwork"); // 'artwork' or 'commission'
  const [showCommissionOrderModal, setShowCommissionOrderModal] =
    useState(false);
  const [selectedCommissionOrder, setSelectedCommissionOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtworkOrders();
  }, []);

  const fetchArtworkOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const artworkRes = await axios.get(
        `${API_URL}/api/orders/artworks/buyer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      const artworkOrders = Array.isArray(artworkRes.data)
        ? artworkRes.data
        : [];

      // Sort artwork orders by date (latest first)
      const sortedArtworkOrders = artworkOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate || a.createdAt || 0);
        const dateB = new Date(b.orderDate || b.createdAt || 0);
        return dateB - dateA; // Latest first (descending order)
      });

      setOrders(sortedArtworkOrders);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "artwork") {
      if (orders.length === 0) fetchArtworkOrders();
    } else {
      fetchCommissionOrders(setCommissionOrders, setLoading);
    }
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
        return <Truck className={baseClass} />;
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

  // Remove search filter for now to display all orders
  const filteredArtworkOrders = orders;
  const filteredCommissionOrders = commissionOrders;
  console.log("filteredArtworkOrders:", filteredArtworkOrders);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleViewCommissionOrder = (order) => {
    setSelectedCommissionOrder(order);
    setShowCommissionOrderModal(true);
  };

  const handleCloseCommissionOrderModal = () => {
    setShowCommissionOrderModal(false);
    setSelectedCommissionOrder(null);
  };

  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handlePayCommissionOrder = (order) => {
    navigate(`/commission-payment/${order.orderId || order.id}`, {
      state: { order },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E1]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              My Orders
            </h1>
            <p className="text-[#7f5539]/70">
              Track and manage your artwork purchases and commissions
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors border ${
                activeTab === "artwork"
                  ? "bg-[#D87C5A] text-white border-[#D87C5A]"
                  : "bg-white text-[#7f5539] border-[#FFD95A]"
              }`}
              onClick={() => handleTabChange("artwork")}
            >
              Artwork Orders
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors border ${
                activeTab === "commission"
                  ? "bg-[#D87C5A] text-white border-[#D87C5A]"
                  : "bg-white text-[#7f5539] border-[#FFD95A]"
              }`}
              onClick={() => handleTabChange("commission")}
            >
              Commissioned Orders
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f5539]/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders by ID, artwork, or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Orders Section */}
          {activeTab === "artwork" ? (
            <div className="space-y-4 mb-10">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Package className="w-16 h-16 text-[#7f5539]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                    No Artwork Orders Found
                  </h3>
                  <p className="text-[#7f5539]/70">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "You haven't placed any artwork orders yet"}
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-[#7f5539]">
                            Order {order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#7f5539]/70">
                          <div>
                            <span className="font-medium">Order Date:</span>
                            <br />
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleDateString()
                              : ""}
                          </div>
                          <div>
                            <span className="font-medium">Total Amount:</span>
                            <br />
                            <span className="text-[#D87C5A] font-semibold">
                              LKR {order.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Delivery Status:
                            </span>
                            <br />
                            {renderDeliveryStatus(order.deliveryStatus)}
                          </div>
                        </div>

                        {/* Tracking Progress */}
                        {renderTrackingProgress(order.deliveryStatus)}
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center gap-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.slice(0, 3).map((item, index) => (
                            <div
                              key={index}
                              className="w-12 h-12 rounded-lg bg-[#FFF5E1] border border-[#FFD95A] flex items-center justify-center text-[#7f5539] text-xs font-medium"
                            >
                              {item.title || "No Image"}
                            </div>
                          ))
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#FFF5E1] border border-[#FFD95A] flex items-center justify-center text-[#7f5539] text-xs font-medium">
                            No Items
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4 mb-10">
              {commissionOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Package className="w-16 h-16 text-[#7f5539]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                    No Commissioned Orders Found
                  </h3>
                  <p className="text-[#7f5539]/70">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "You haven't placed any commissioned orders yet"}
                  </p>
                </div>
              ) : (
                commissionOrders.map((order) => (
                  <div
                    key={order.orderId || order.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Commission Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-[#7f5539]">
                            Commission {order.orderId || order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status?.charAt(0).toUpperCase() +
                              order.status?.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#7f5539]/70">
                          <div>
                            <span className="font-medium">Requested Date:</span>
                            <br />
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : order.submittedAt
                              ? new Date(order.submittedAt).toLocaleDateString()
                              : ""}
                          </div>
                          <div>
                            <span className="font-medium">Budget:</span>
                            <br />
                            <span className="text-[#D87C5A] font-semibold">
                              LKR {order.budget?.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Title:</span>
                            <br />
                            {order.title}
                          </div>
                          <div>
                            <span className="font-medium">
                              Delivery Status:
                            </span>
                            <br />
                            {order.status === "accepted" &&
                              renderDeliveryStatus(order.deliveryStatus)}
                          </div>
                        </div>
                      </div>
                      {/* Commission Preview */}
                      <div className="flex items-center gap-3">
                        {order.imageUrls && order.imageUrls.length > 0 ? (
                          order.imageUrls
                            .slice(0, 3)
                            .map((img, idx) => (
                              <img
                                key={idx}
                                src={
                                  img.startsWith("/uploads/")
                                    ? `${API_URL}${img}`
                                    : img
                                }
                                alt="Reference"
                                className="w-12 h-12 rounded-lg object-cover border border-[#FFD95A]"
                              />
                            ))
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#FFF5E1] border border-[#FFD95A] flex items-center justify-center text-[#7f5539] text-xs font-medium">
                            No Images
                          </div>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                        {/* Pay Now Button for Accepted Orders that haven't been paid */}
                        {(order.status === "accepted" ||
                          order.status === "ACCEPTED" ||
                          order.status === "Accepted") &&
                          !order.hasPayment && (
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                              onClick={() => handlePayCommissionOrder(order)}
                            >
                              Pay
                            </button>
                          )}

                        {/* Show Payment Status for paid orders */}
                        {order.hasPayment && (
                          <span className="bg-green-100 text-green-800 px-3 py-2 rounded text-sm font-medium">
                            ✓ Paid
                          </span>
                        )}

                        <button
                          onClick={() => handleViewCommissionOrder(order)}
                          className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={handleCloseModal}
      />
      <CommissionOrderDetailsModal
        order={selectedCommissionOrder}
        isOpen={showCommissionOrderModal}
        onClose={handleCloseCommissionOrderModal}
      />
    </div>
  );
};

export default UserOrders;
