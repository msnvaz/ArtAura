import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  Clock,
  AlertCircle,
  BarChart3,
  FileText,
  Download,
  Search,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminDeliveryApi from '../../services/adminDeliveryApi';

const DeliveryManagement = () => {
  const { token } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [deliveryData, setDeliveryData] = useState({
    stats: {
      totalDeliveries: 0,
      activeDeliveries: 0,
      completedDeliveries: 0,
      totalDeliveryPartners: 0,
      pendingRequests: 0,
      avgDeliveryTime: 0,
      avgRating: 0
    },
    deliveries: [],
    deliveryPartners: [],
    recentActivity: []
  });

  const [error, setError] = useState(null);

  // Load delivery data
  const loadDeliveryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch statistics and delivery requests in parallel
      const [statsResponse, deliveriesResponse] = await Promise.all([
        adminDeliveryApi.getDeliveryStatistics(),
        adminDeliveryApi.getAllDeliveryRequests()
      ]);

      if (statsResponse.success && deliveriesResponse.success) {
        // Transform backend data to match frontend expectations
        const transformedDeliveries = deliveriesResponse.data.map(delivery => ({
          id: delivery.id,
          requestId: `${delivery.requestType.toUpperCase()}-${delivery.id}`,
          artwork: delivery.artworkTitle || 'N/A',
          artist: delivery.artistName || 'N/A',
          buyer: delivery.buyerName || 'N/A',
          deliveryPartner: null, // Will be populated when delivery partner data is available
          partnerPhone: null,
          status: mapDeliveryStatus(delivery.deliveryStatus),
          createdDate: delivery.orderDate ? new Date(delivery.orderDate).toISOString().split('T')[0] : 'N/A',
          deliveredDate: null,
          rating: null,
          pickupAddress: delivery.pickupAddress || 'N/A',
          pickupCity: delivery.pickupCity || 'N/A',
          deliveryAddress: delivery.shippingAddress || 'N/A',
          deliveryCity: extractCityFromAddress(delivery.shippingAddress),
          requestType: delivery.requestType,
          artistId: delivery.artistId,
          buyerId: delivery.buyerId,
          buyerEmail: delivery.buyerEmail,
          buyerPhone: delivery.buyerPhone,
          shippingAddress: delivery.shippingAddress,
          artworkType: delivery.artworkType,
          artworkDimensions: delivery.artworkDimensions
        }));

        setDeliveryData({
          stats: {
            totalDeliveries: statsResponse.data.totalDeliveries || 0,
            activeDeliveries: statsResponse.data.activeDeliveries || 0,
            completedDeliveries: statsResponse.data.completedDeliveries || 0,
            totalDeliveryPartners: statsResponse.data.totalDeliveryPartners || 0,
            pendingRequests: statsResponse.data.pendingRequests || 0,
            avgDeliveryTime: statsResponse.data.avgDeliveryTime || 0,
            avgRating: statsResponse.data.avgRating || 0
          },
          deliveries: transformedDeliveries,
          deliveryPartners: [], // Will be populated when partner API is available
          recentActivity: generateRecentActivity(transformedDeliveries.slice(0, 5))
        });
      } else {
        throw new Error('Failed to fetch delivery data');
      }
    } catch (error) {
      console.error('Error loading delivery data:', error);
      setError(error.error || 'Failed to load delivery data');
      
      // Set empty data on error
      setDeliveryData({
        stats: {
          totalDeliveries: 0,
          activeDeliveries: 0,
          completedDeliveries: 0,
          totalDeliveryPartners: 0,
          pendingRequests: 0,
          avgDeliveryTime: 0,
          avgRating: 0
        },
        deliveries: [],
        deliveryPartners: [],
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map backend delivery status to frontend status
  const mapDeliveryStatus = (backendStatus) => {
    if (!backendStatus || backendStatus === 'N/A') return 'pending_assignment';
    
    const statusMap = {
      'pending': 'pending_assignment',
      'accepted': 'accepted',
      'outForDelivery': 'in_transit',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    return statusMap[backendStatus] || 'pending_assignment';
  };

  // Helper function to display status with proper words
  const getStatusDisplayName = (status) => {
    const statusDisplayMap = {
      'pending': 'Pending',
      'pending_assignment': 'Pending',
      'accepted': 'Accepted',
      'picked_up': 'Picked Up',
      'in_transit': 'Out for Delivery',
      'outForDelivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'N/A': 'Not Assigned'
    };
    
    return statusDisplayMap[status] || status;
  };

  // Helper function to extract city from shipping address
  const extractCityFromAddress = (address) => {
    if (!address) return 'N/A';
    
    // Try to extract city from address (this is a simple implementation)
    const parts = address.split(',');
    return parts.length >= 2 ? parts[1].trim() : 'N/A';
  };

  // Helper function to generate recent activity from deliveries
  const generateRecentActivity = (recentDeliveries) => {
    return recentDeliveries.map((delivery, index) => ({
      id: index + 1,
      type: delivery.status === 'delivered' ? 'delivery_completed' : 'new_request',
      message: delivery.status === 'delivered' 
        ? `Delivery ${delivery.requestId} completed`
        : `New delivery request ${delivery.requestId} created`,
      timestamp: delivery.createdDate + ' ' + new Date().toLocaleTimeString(),
      severity: delivery.status === 'delivered' ? 'success' : 'info'
    }));
  };

  useEffect(() => {
    loadDeliveryData();
  }, []);

  // Refresh data function
  const refreshData = () => {
    loadDeliveryData();
  };

  // Handle status filter change
  const handleStatusFilterChange = async (newStatus) => {
    setStatusFilter(newStatus);
    
    if (newStatus === 'all') {
      loadDeliveryData();
      return;
    }

    setLoading(true);
    try {
      const response = await adminDeliveryApi.getDeliveryRequestsByStatus(mapFrontendStatusToBackend(newStatus));
      
      if (response.success) {
        const transformedDeliveries = response.data.map(delivery => ({
          id: delivery.id,
          requestId: `${delivery.requestType.toUpperCase()}-${delivery.id}`,
          artwork: delivery.artworkTitle || 'N/A',
          artist: delivery.artistName || 'N/A',
          buyer: delivery.buyerName || 'N/A',
          deliveryPartner: null,
          partnerPhone: null,
          status: mapDeliveryStatus(delivery.deliveryStatus),
          createdDate: delivery.orderDate ? new Date(delivery.orderDate).toISOString().split('T')[0] : 'N/A',
          deliveredDate: null,
          rating: null,
          pickupAddress: delivery.pickupAddress || 'N/A',
          pickupCity: delivery.pickupCity || 'N/A',
          deliveryAddress: delivery.shippingAddress || 'N/A',
          deliveryCity: extractCityFromAddress(delivery.shippingAddress),
          requestType: delivery.requestType,
          artistId: delivery.artistId,
          buyerId: delivery.buyerId,
          buyerEmail: delivery.buyerEmail,
          buyerPhone: delivery.buyerPhone,
          shippingAddress: delivery.shippingAddress,
          artworkType: delivery.artworkType,
          artworkDimensions: delivery.artworkDimensions
        }));

        setDeliveryData(prev => ({
          ...prev,
          deliveries: transformedDeliveries
        }));
      }
    } catch (error) {
      console.error('Error filtering by status:', error);
      setError('Failed to filter delivery requests');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map frontend status to backend status
  const mapFrontendStatusToBackend = (frontendStatus) => {
    const statusMap = {
      'pending_assignment': 'pending',
      'accepted': 'accepted',
      'picked_up': 'accepted', // Map to accepted for now
      'in_transit': 'outForDelivery',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    return statusMap[frontendStatus] || frontendStatus;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_assignment': 
      case 'pending': return 'bg-red-100 text-red-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': 
      case 'outForDelivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'N/A': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartnerStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeliveries = deliveryData.deliveries.filter(delivery => {
    const matchesSearch = (delivery.artwork || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (delivery.artist || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (delivery.buyer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (delivery.requestId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

const renderOverview = () => (
    <div className="space-y-8">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#FFE4D6' }}>
                        <Package className="h-8 w-8" style={{ color: '#5D3A00' }} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Deliveries</p>
                        <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.totalDeliveries}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#FFD95A' }}>
                        <Truck className="h-8 w-8" style={{ color: '#5D3A00' }} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium whitespace-nowrap" style={{ color: '#D87C5A' }}>Active Deliveries</p>
                        <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.activeDeliveries}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#FFE4D6' }}>
                        <AlertTriangle className="h-8 w-8" style={{ color: '#D87C5A' }} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium whitespace-nowrap" style={{ color: '#D87C5A' }}>Pending Requests</p>
                        <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.pendingRequests}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D3A00' }}>Delivery Performance</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#D87C5A' }}>Completion Rate</span>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>
                            {deliveryData.stats.totalDeliveries > 0 
                                ? Math.round((deliveryData.stats.completedDeliveries / deliveryData.stats.totalDeliveries) * 100) 
                                : 0}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#D87C5A' }}>Delivered Orders</span>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.completedDeliveries}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#D87C5A' }}>Commission Requests</span>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>
                            {deliveryData.deliveries.filter(d => d.requestType === 'commission_request').length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D3A00' }}>Status Breakdown</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5" style={{ color: '#D87C5A' }} />
                            <span className="ml-2 text-sm font-medium" style={{ color: '#5D3A00' }}>
                                Pending Requests
                            </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.pendingRequests}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                        <div className="flex items-center">
                            <Truck className="h-5 w-5" style={{ color: '#D87C5A' }} />
                            <span className="ml-2 text-sm font-medium" style={{ color: '#5D3A00' }}>
                                Out for Delivery
                            </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>
                            {deliveryData.deliveries.filter(d => d.status === 'in_transit').length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D3A00' }}>Recent Activity</h3>
                <div className="space-y-3">
                    {deliveryData.recentActivity.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="text-xs" style={{ color: '#D87C5A' }}>
                            <p className="font-medium">{activity.message}</p>
                            <p className="text-gray-500">{activity.timestamp}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

  const renderDeliveries = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#D87C5A' }} />
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: '#FFE4D6', focusRingColor: '#D87C5A' }}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#FFE4D6' }}
            >
              <option value="all">All Statuses</option>
              <option value="pending_assignment">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_transit">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={refreshData}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2" 
              style={{ backgroundColor: '#D87C5A' }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#FFE4D6' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Artwork & Parties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Pickup Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Delivery Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <tr key={`${delivery.requestType}-${delivery.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>{delivery.requestId}</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>{delivery.createdDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>{delivery.artwork}</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>
                      Artist: {delivery.artist} | Buyer: {delivery.buyer}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#5D3A00', maxWidth: '200px', wordWrap: 'break-word' }}>
                      {delivery.pickupAddress}
                    </div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>
                      Artist Location
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#5D3A00', maxWidth: '200px', wordWrap: 'break-word' }}>
                      {delivery.deliveryAddress}
                    </div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>
                      Buyer Location
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(delivery.status)}`}>
                      {getStatusDisplayName(delivery.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
          <div className="flex justify-center items-center">
            <div 
              className="animate-spin rounded-full h-16 w-16 border-b-2"
              style={{ borderColor: '#5D3A00' }}
            ></div>
          </div>
          <p className="mt-4" style={{ color: '#D87C5A' }}>Loading delivery Handling...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
          <div className="flex justify-center items-center mb-4">
            <AlertCircle className="h-16 w-16" style={{ color: '#D87C5A' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D3A00' }}>Error Loading Data</h3>
          <p className="mb-4" style={{ color: '#D87C5A' }}>{error}</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 mx-auto" 
            style={{ backgroundColor: '#D87C5A' }}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'deliveries':
        return renderDeliveries();
      case 'partners':
        return renderPartners();
      default:
        return renderOverview();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'deliveries', label: 'All Deliveries', icon: Package }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5D3A00' }}>Delivery Review</h2>
          <p style={{ color: '#D87C5A' }}>Monitor and manage all delivery operations</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div style={{ borderBottom: "1px solid #FFE4D6" }}>
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2"
                style={{
                  borderBottomColor: activeTab === tab.id ? "#5D3A00" : "transparent",
                  color: activeTab === tab.id ? "#5D3A00" : "#D87C5A",
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default DeliveryManagement;
