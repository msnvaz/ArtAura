import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, User, Calendar, Hash, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ShopOrdersManagement = ({ shopId }) => {
    const { token } = useAuth(); // Get JWT token for authentication
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, cancelled
    const [processingOrderId, setProcessingOrderId] = useState(null);

    useEffect(() => {
        if (shopId) {
            fetchOrders();
        }
    }, [shopId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('📦 Fetching orders for shop:', shopId);

            const response = await axios.get(`${API_URL}/api/artist-orders/shop/${shopId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data || []);
            console.log('✅ Fetched orders:', response.data);

        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOrder = async (orderId) => {
        try {
            setProcessingOrderId(orderId);
            console.log('✅ Approving order:', orderId);

            const response = await axios.put(`${API_URL}/api/artist-orders/${orderId}/approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Order approved successfully!');
                fetchOrders(); // Refresh orders
            } else {
                toast.error(response.data.message || 'Failed to approve order');
            }

        } catch (error) {
            console.error('❌ Error approving order:', error);
            const errorMessage = error.response?.data?.message || 'Failed to approve order';
            toast.error(errorMessage);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            setProcessingOrderId(orderId);
            console.log('❌ Cancelling order:', orderId);

            const response = await axios.put(`${API_URL}/api/artist-orders/${orderId}/cancel`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Order cancelled');
                fetchOrders(); // Refresh orders
            } else {
                toast.error(response.data.message || 'Failed to cancel order');
            }

        } catch (error) {
            console.error('❌ Error cancelling order:', error);
            const errorMessage = error.response?.data?.message || 'Failed to cancel order';
            toast.error(errorMessage);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-orange-500" />;
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Package className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-orange-100 text-orange-700',
            approved: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const approvedCount = orders.filter(o => o.status === 'approved').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f5539]"></div>
                <span className="ml-3 text-[#7f5539]">Loading orders...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast notifications */}
            <Toaster position="top-right" />
            
            {/* Header with Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#7f5539] mb-2">Order Management</h2>
                        <p className="text-[#7f5539]/70">Manage customer orders</p>
                    </div>
                    <ShoppingBag className="h-10 w-10 text-[#7f5539]/30" />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 mb-1">Pending Orders</p>
                                <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 mb-1">Approved Orders</p>
                                <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-blue-700">{orders.length}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2">
                    {['all', 'pending', 'approved', 'cancelled'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === filterOption
                                    ? 'bg-[#7f5539] text-white'
                                    : 'bg-[#7f5539]/10 text-[#7f5539] hover:bg-[#7f5539]/20'
                            }`}
                        >
                            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Package className="h-16 w-16 text-[#7f5539]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#7f5539] mb-2">No orders found</h3>
                    <p className="text-[#7f5539]/60">
                        {filter === 'all' 
                            ? 'No orders received yet'
                            : `No ${filter} orders`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order.orderId} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                {/* Product Image */}
                                {order.productImage && (
                                    <img
                                        src={order.productImage}
                                        alt={order.productName}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                )}

                                {/* Order Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#7f5539] mb-1">
                                                {order.productName || order.items}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-[#7f5539]/60">
                                                <div className="flex items-center space-x-1">
                                                    <Hash className="h-3 w-3" />
                                                    <span>Order #{order.orderId}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{order.artistName || 'Artist #' + order.artistId}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(order.date || order.dateTime).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(order.status)}
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>

                                    {/* Order Info */}
                                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-[#7f5539]/10 mb-4">
                                        <div>
                                            <p className="text-xs text-[#7f5539]/60 mb-1">Quantity</p>
                                            <p className="text-sm font-medium text-[#7f5539]">
                                                {order.quantity || 1} {(order.quantity || 1) === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#7f5539]/60 mb-1">Total Amount</p>
                                            <p className="text-sm font-medium text-[#7f5539]">
                                                LKR {(order.total || order.totalAmount || 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#7f5539]/60 mb-1">Product ID</p>
                                            <p className="text-sm font-medium text-[#7f5539]">
                                                #{order.productId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {order.status === 'pending' && (
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleApproveOrder(order.orderId)}
                                                disabled={processingOrderId === order.orderId}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingOrderId === order.orderId ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <CheckCircle className="h-4 w-4" />
                                                )}
                                                <span>Approve Order</span>
                                            </button>

                                            <button
                                                onClick={() => handleCancelOrder(order.orderId)}
                                                disabled={processingOrderId === order.orderId}
                                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                <span>Cancel Order</span>
                                            </button>
                                        </div>
                                    )}

                                    {order.status === 'approved' && (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm font-medium">Order has been approved and stock has been updated</span>
                                        </div>
                                    )}

                                    {order.status === 'cancelled' && (
                                        <div className="flex items-center space-x-2 text-red-600">
                                            <XCircle className="h-4 w-4" />
                                            <span className="text-sm font-medium">Order has been cancelled</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopOrdersManagement;
