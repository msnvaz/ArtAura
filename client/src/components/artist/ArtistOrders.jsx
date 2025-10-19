import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Store, Calendar, Hash } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ArtistOrders = () => {
    const { userId, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, cancelled

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('📦 Fetching orders for artist:', userId);

            const response = await axios.get(`${API_URL}/api/artist-orders/artist/${userId}`, {
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

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f5539]"></div>
                <span className="ml-3 text-[#7f5539]">Loading your orders...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast notifications */}
            <Toaster position="top-right" />
            
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#7f5539] mb-2">My Orders</h2>
                        <p className="text-[#7f5539]/70">Track your product orders</p>
                    </div>
                    <Package className="h-10 w-10 text-[#7f5539]/30" />
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
                            ? 'You haven\'t placed any orders yet'
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
                                                {order.productName}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-[#7f5539]/60">
                                                <div className="flex items-center space-x-1">
                                                    <Hash className="h-3 w-3" />
                                                    <span>Order #{order.orderId}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Store className="h-3 w-3" />
                                                    <span>{order.shopName}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(order.status)}
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>

                                    {/* Order Info */}
                                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-[#7f5539]/10">
                                        <div>
                                            <p className="text-xs text-[#7f5539]/60 mb-1">Quantity</p>
                                            <p className="text-sm font-medium text-[#7f5539]">
                                                {order.quantity} {order.quantity === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#7f5539]/60 mb-1">Total Amount</p>
                                            <p className="text-sm font-medium text-[#7f5539]">
                                                LKR {order.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#7f5539]/60 mb-1">Status</p>
                                            <p className="text-sm font-medium text-[#7f5539]">
                                                {order.status === 'pending' && 'Waiting for shop approval'}
                                                {order.status === 'approved' && 'Order confirmed'}
                                                {order.status === 'cancelled' && 'Order cancelled'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtistOrders;
