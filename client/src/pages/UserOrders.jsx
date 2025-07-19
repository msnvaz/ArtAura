import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  ArrowLeft,
  Star,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import OrderDetailsModal from "../components/OrderDetailsModal";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Mock order data - replace with actual API call
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD-001",
        date: "2024-01-15",
        status: "delivered",
        total: 89.99,
        items: [
          {
            id: 1,
            title: "Abstract Ocean Painting",
            artist: "Sarah Martinez",
            price: 89.99,
            image:
              "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
            quantity: 1,
          },
        ],
        shipping: {
          address: "123 Art Street, Creative City, CA 90210",
          method: "Standard Shipping",
          trackingNumber: "TR123456789",
        },
        payment: {
          method: "Credit Card",
          last4: "4242",
        },
      },
      {
        id: "ORD-002",
        date: "2024-01-10",
        status: "shipped",
        total: 149.97,
        items: [
          {
            id: 2,
            title: "Modern Art Print Set",
            artist: "Liam Chen",
            price: 74.99,
            image:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
            quantity: 2,
          },
        ],
        shipping: {
          address: "123 Art Street, Creative City, CA 90210",
          method: "Express Shipping",
          trackingNumber: "TR987654321",
        },
        payment: {
          method: "PayPal",
          last4: null,
        },
      },
      {
        id: "ORD-003",
        date: "2024-01-05",
        status: "processing",
        total: 199.99,
        items: [
          {
            id: 3,
            title: "Custom Portrait Commission",
            artist: "Ava Patel",
            price: 199.99,
            image:
              "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
            quantity: 1,
          },
        ],
        shipping: {
          address: "123 Art Street, Creative City, CA 90210",
          method: "Standard Shipping",
          trackingNumber: null,
        },
        payment: {
          method: "Credit Card",
          last4: "1234",
        },
      },
      {
        id: "ORD-004",
        date: "2023-12-28",
        status: "pending",
        total: 59.99,
        items: [
          {
            id: 4,
            title: "Watercolor Landscape",
            artist: "Marcus Johnson",
            price: 59.99,
            image:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
            quantity: 1,
          },
        ],
        shipping: {
          address: "123 Art Street, Creative City, CA 90210",
          method: "Standard Shipping",
          trackingNumber: null,
        },
        payment: {
          method: "Credit Card",
          last4: "5678",
        },
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
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
              Track and manage your artwork purchases
            </p>
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
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f5539]/50 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Package className="w-16 h-16 text-[#7f5539]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                  No Orders Found
                </h3>
                <p className="text-[#7f5539]/70">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't placed any orders yet"}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
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
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Total Amount:</span>
                          <br />
                          <span className="text-[#D87C5A] font-semibold">
                            ${order.total}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>
                          <br />
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-[#FFD95A]"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-[#FFF5E1] border border-[#FFD95A] flex items-center justify-center text-[#7f5539] text-xs font-medium">
                          +{order.items.length - 3}
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
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default UserOrders;
