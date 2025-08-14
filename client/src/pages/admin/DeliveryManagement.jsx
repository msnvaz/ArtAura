import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  DollarSign,
  BarChart3,
  FileText,
  Star,
  TrendingUp,
  Navigation,
  Filter,
  Download,
  Search,
  Eye,
  MoreHorizontal,
  UserCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
      totalRevenue: 0,
      avgDeliveryTime: 0,
      avgRating: 0
    },
    deliveries: [],
    deliveryPartners: [],
    recentActivity: []
  });

  // Mock data for admin delivery overview
  const mockDeliveryData = {
    stats: {
      totalDeliveries: 284,
      activeDeliveries: 12,
      completedDeliveries: 267,
      totalDeliveryPartners: 18,
      pendingRequests: 8,
      totalRevenue: 850000,
      avgDeliveryTime: 2.3,
      avgRating: 4.7
    },
    deliveries: [
      {
        id: 1,
        requestId: 'REQ001',
        artwork: 'Sunset over Sigiriya',
        artist: 'Saman Kumara',
        buyer: 'Nimal Silva',
        deliveryPartner: 'Kasun Perera',
        partnerPhone: '+94 71 234 5678',
        status: 'delivered',
        fee: 3200,
        createdDate: '2024-08-10',
        deliveredDate: '2024-08-12',
        rating: 5,
        distance: '120 km',
        pickupCity: 'Colombo',
        deliveryCity: 'Kandy'
      },
      {
        id: 2,
        requestId: 'REQ002',
        artwork: 'Traditional Mask Collection',
        artist: 'Priya Jayawardena',
        buyer: 'Ravi Perera',
        deliveryPartner: 'Nuwan Silva',
        partnerPhone: '+94 76 555 1234',
        status: 'in_transit',
        fee: 3500,
        createdDate: '2024-08-11',
        estimatedDelivery: '2024-08-16',
        rating: null,
        distance: '145 km',
        pickupCity: 'Galle',
        deliveryCity: 'Nugegoda'
      },
      {
        id: 3,
        requestId: 'REQ003',
        artwork: 'Tea Plantation Vista',
        artist: 'Chaminda Fernando',
        buyer: 'Malini Silva',
        deliveryPartner: 'Asanka Rodrigo',
        partnerPhone: '+94 77 888 9999',
        status: 'picked_up',
        fee: 2800,
        createdDate: '2024-08-12',
        estimatedDelivery: '2024-08-15',
        rating: null,
        distance: '95 km',
        pickupCity: 'Nuwara Eliya',
        deliveryCity: 'Colombo'
      },
      {
        id: 4,
        requestId: 'REQ004',
        artwork: 'Modern Abstract Canvas',
        artist: 'Ruwan Dissanayake',
        buyer: 'Sanduni Perera',
        deliveryPartner: null,
        partnerPhone: null,
        status: 'pending_assignment',
        fee: 2800,
        createdDate: '2024-08-13',
        estimatedDelivery: null,
        rating: null,
        distance: '115 km',
        pickupCity: 'Colombo',
        deliveryCity: 'Kandy'
      }
    ],
    deliveryPartners: [
      {
        id: 1,
        name: 'Kasun Perera',
        phone: '+94 71 234 5678',
        email: 'kasun.perera@email.com',
        rating: 4.8,
        totalDeliveries: 47,
        activeDeliveries: 2,
        joinDate: '2024-01-15',
        status: 'active',
        totalEarnings: 125600,
        location: 'Colombo'
      },
      {
        id: 2,
        name: 'Nuwan Silva',
        phone: '+94 76 555 1234',
        email: 'nuwan.silva@email.com',
        rating: 4.6,
        totalDeliveries: 32,
        activeDeliveries: 1,
        joinDate: '2024-02-20',
        status: 'active',
        totalEarnings: 89400,
        location: 'Gampaha'
      },
      {
        id: 3,
        name: 'Asanka Rodrigo',
        phone: '+94 77 888 9999',
        email: 'asanka.rodrigo@email.com',
        rating: 4.9,
        totalDeliveries: 28,
        activeDeliveries: 1,
        joinDate: '2024-03-10',
        status: 'active',
        totalEarnings: 76500,
        location: 'Kandy'
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'delivery_completed',
        message: 'Kasun Perera completed delivery REQ001',
        timestamp: '2024-08-14 14:30',
        severity: 'success'
      },
      {
        id: 2,
        type: 'new_request',
        message: 'New delivery request REQ004 created',
        timestamp: '2024-08-13 16:45',
        severity: 'info'
      },
      {
        id: 3,
        type: 'partner_joined',
        message: 'New delivery partner Saman Kumara joined',
        timestamp: '2024-08-13 10:20',
        severity: 'success'
      }
    ]
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDeliveryData(mockDeliveryData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyCompact = (amount) => {
    if (amount >= 1000000) {
      return `LKR ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `LKR ${(amount / 1000).toFixed(0)}K`;
    }
    return `LKR ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_assignment': return 'bg-red-100 text-red-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
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
    const matchesSearch = delivery.artwork.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

const renderOverview = () => (
    <div className="space-y-8">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        <UserCheck className="h-8 w-8" style={{ color: '#D87C5A' }} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium whitespace-nowrap" style={{ color: '#D87C5A' }}>Delivery Partners</p>
                        <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.totalDeliveryPartners}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#FFD95A' }}>
                        <DollarSign className="h-8 w-8" style={{ color: '#5D3A00' }} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Revenue</p>
                        <p className="text-2xl font-bold whitespace-nowrap" style={{ color: '#5D3A00' }}>
                            {formatCurrencyCompact(deliveryData.stats.totalRevenue)}
                        </p>
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
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#D87C5A' }}>Avg. Delivery Time</span>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.avgDeliveryTime} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#D87C5A' }}>Customer Rating</span>
                        <div className="flex items-center">
                            <Star className="h-4 w-4" style={{ color: '#FFD95A' }} />
                            <span className="text-lg font-bold ml-1" style={{ color: '#5D3A00' }}>{deliveryData.stats.avgRating}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#5D3A00' }}>Pending Actions</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5" style={{ color: '#D87C5A' }} />
                            <span className="ml-2 text-sm font-medium" style={{ color: '#5D3A00' }}>
                                Unassigned Requests
                            </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>{deliveryData.stats.pendingRequests}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5" style={{ color: '#D87C5A' }} />
                            <span className="ml-2 text-sm font-medium" style={{ color: '#5D3A00' }}>
                                Overdue Deliveries
                            </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#5D3A00' }}>2</span>
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#FFE4D6' }}
            >
              <option value="all">All Statuses</option>
              <option value="pending_assignment">Pending Assignment</option>
              <option value="accepted">Accepted</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 border" style={{ color: '#5D3A00', borderColor: '#FFE4D6' }}>
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2" style={{ backgroundColor: '#D87C5A' }}>
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
                  Delivery Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>{delivery.requestId}</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>{delivery.createdDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>{delivery.artwork}</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>
                      {delivery.artist} → {delivery.buyer}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {delivery.deliveryPartner ? (
                      <div>
                        <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>{delivery.deliveryPartner}</div>
                        <div className="text-xs" style={{ color: '#D87C5A' }}>{delivery.partnerPhone}</div>
                      </div>
                    ) : (
                      <span className="text-sm" style={{ color: '#D87C5A' }}>Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#5D3A00' }}>{delivery.pickupCity} → {delivery.deliveryCity}</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>{delivery.distance}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>
                      {formatCurrency(delivery.fee)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Eye className="h-4 w-4" style={{ color: '#D87C5A' }} />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" style={{ color: '#D87C5A' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="space-y-6">
      {/* Partner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FFE4D6' }}>
              <UserCheck className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Partners</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{deliveryData.deliveryPartners.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FFD95A' }}>
              <TrendingUp className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Active Partners</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {deliveryData.deliveryPartners.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FFE4D6' }}>
              <Star className="h-8 w-8" style={{ color: '#D87C5A' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Avg Rating</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>4.8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FFD95A' }}>
              <Package className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Deliveries</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {deliveryData.deliveryPartners.reduce((sum, p) => sum + p.totalDeliveries, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold" style={{ color: '#5D3A00' }}>Delivery Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#FFE4D6' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Deliveries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5D3A00' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryData.deliveryPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFE4D6' }}>
                        <User className="h-5 w-5" style={{ color: '#5D3A00' }} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>{partner.name}</div>
                        <div className="text-xs" style={{ color: '#D87C5A' }}>{partner.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#5D3A00' }}>{partner.phone}</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>{partner.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4" style={{ color: '#FFD95A' }} />
                      <span className="ml-1 text-sm font-medium" style={{ color: '#5D3A00' }}>{partner.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: '#5D3A00' }}>{partner.totalDeliveries} total</div>
                    <div className="text-xs" style={{ color: '#D87C5A' }}>{partner.activeDeliveries} active</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium" style={{ color: '#5D3A00' }}>
                      {formatCurrency(partner.totalEarnings)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPartnerStatusColor(partner.status)}`}>
                      {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <Eye className="h-4 w-4" style={{ color: '#D87C5A' }} />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" style={{ color: '#D87C5A' }} />
                      </button>
                    </div>
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
          <p className="mt-4" style={{ color: '#D87C5A' }}>Loading delivery management...</p>
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
    { id: 'deliveries', label: 'All Deliveries', icon: Package },
    { id: 'partners', label: 'Delivery Partners', icon: UserCheck }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5D3A00' }}>Delivery Management</h2>
          <p style={{ color: '#D87C5A' }}>Monitor and manage all delivery operations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2" style={{ color: '#5D3A00', borderColor: '#FFE4D6' }}>
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2" style={{ backgroundColor: '#D87C5A' }}>
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
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
