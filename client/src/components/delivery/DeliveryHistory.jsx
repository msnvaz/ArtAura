import React, { useState, useEffect } from 'react';
import {
  Package,
  Calendar,
  MapPin,
  User,
  Search,
  Filter,
  Download,
  CheckCircle,
  FileText,
  Clock,
  Palette,
  Image,
  RefreshCw,
  Eye,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import deliveryPartnerApi from '../../services/deliveryPartnerApi';

const DeliveryHistory = () => {
  const { token } = useAuth();
  
  // State for delivery history data
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, artwork_order, commission_request
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch delivery history from API
  useEffect(() => {
    const fetchDeliveryHistory = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Try the new API endpoint for delivered requests
        try {
          const response = await deliveryPartnerApi.getDeliveredDeliveries();
          
          if (response.success && response.requests) {
            // Transform the API data to match the component format
            const transformedHistory = response.requests.map(request => ({
              id: request.id,
              requestId: `${request.requestType === 'artwork_order' ? 'AW' : 'COM'}-${request.id}`,
              requestType: request.requestType,
              artistName: request.artistName || 'Artist Name',
              buyerName: request.buyerName || 'Unknown Buyer',
              buyerEmail: request.buyerEmail || 'N/A',
              buyerPhone: request.buyerPhone || 'N/A',
              artwork: {
                title: request.artworkTitle || `${request.requestType === 'artwork_order' ? 'Artwork Order' : 'Commission'} #${request.id}`,
                type: request.artworkType || (request.requestType === 'artwork_order' ? 'Artwork' : 'Commission'),
                dimensions: request.artworkDimensions || 'N/A',
                value: `Rs ${request.totalAmount || 0}`
              },
              deliveryAddress: {
                full: request.shippingAddress || 'Address not provided'
              },
              deliveryStatus: request.deliveryStatus,
              orderDate: request.orderDate || new Date().toISOString(),
              deliveredDate: request.orderDate || new Date().toISOString(), // Would need actual delivered date from DB
              // Additional commission-specific fields
              commissionStyle: request.commissionStyle,
              deadline: request.deadline,
              urgency: request.urgency,
              additionalNotes: request.additionalNotes
            }));
            
            setDeliveryHistory(transformedHistory);
            return;
          }
        } catch (newApiError) {
          console.log('New API not available, using mock data:', newApiError.message);
        }
        
        // Fallback to mock data for demonstration
        const mockDeliveryHistory = [
          {
            id: 1,
            requestId: 'AW-001',
            requestType: 'artwork_order',
            artistName: 'Priya Jayawardena',
            buyerName: 'Ravi Perera',
            buyerEmail: 'ravi.perera@gmail.com',
            buyerPhone: '+94 72 444 5678',
            artwork: {
              title: 'Traditional Mask Collection',
              type: 'Wood Sculpture',
              dimensions: '12" x 8" (Set of 3)',
              value: 'Rs 45,000'
            },
            deliveryAddress: {
              full: '321 Lake View, Nugegoda, Western Province, 10250'
            },
            deliveryStatus: 'delivered',
            orderDate: '2024-06-15T10:30:00',
            deliveredDate: '2024-06-20T16:45:00'
          },
          {
            id: 2,
            requestId: 'COM-005',
            requestType: 'commission_request',
            artistName: 'Sandun Perera',
            buyerName: 'Amara Silva',
            buyerEmail: 'amara.silva@gmail.com',
            buyerPhone: '+94 77 333 4444',
            artwork: {
              title: 'Custom Portrait Painting',
              type: 'Oil Painting',
              dimensions: '16" x 20"',
              value: 'Rs 25,000'
            },
            deliveryAddress: {
              full: '123 Main Street, Kandy, Central Province, 20000'
            },
            deliveryStatus: 'delivered',
            orderDate: '2024-08-05T09:15:00',
            deliveredDate: '2024-08-12T16:20:00',
            commissionStyle: 'oil-painting',
            urgency: 'normal'
          },
          {
            id: 3,
            requestId: 'AW-003',
            requestType: 'artwork_order',
            artistName: 'Ruwan Dissanayake',
            buyerName: 'Sanduni Perera',
            buyerEmail: 'sanduni.p@gmail.com',
            buyerPhone: '+94 71 222 3333',
            artwork: {
              title: 'Modern Abstract Canvas',
              type: 'Acrylic Painting',
              dimensions: '30" x 40"',
              value: 'Rs 85,000'
            },
            deliveryAddress: {
              full: '456 Temple Road, Kandy, Central Province, 20000'
            },
            deliveryStatus: 'delivered',
            orderDate: '2024-07-28T14:20:00',
            deliveredDate: '2024-08-05T11:10:00'
          }
        ];
        
        setDeliveryHistory(mockDeliveryHistory);
      } catch (error) {
        console.error('Error fetching delivery history:', error);
        setError('Failed to fetch delivery history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryHistory();
  }, [token]);

  // Filter and sort deliveries
  const filteredAndSortedHistory = deliveryHistory
    .filter(delivery => {
      // Filter by search term
      const matchesSearch = 
        delivery.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.artwork.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by type
      const matchesType = typeFilter === 'all' || delivery.requestType === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'orderDate':
          aValue = new Date(a.orderDate);
          bValue = new Date(b.orderDate);
          break;
        case 'deliveredDate':
          aValue = new Date(a.deliveredDate);
          bValue = new Date(b.deliveredDate);
          break;
        case 'buyerName':
          aValue = a.buyerName.toLowerCase();
          bValue = b.buyerName.toLowerCase();
          break;
        case 'artistName':
          aValue = a.artistName.toLowerCase();
          bValue = b.artistName.toLowerCase();
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium hover:text-amber-600 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="artwork_order">Artwork Orders</option>
              <option value="commission_request">Commission Requests</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Delivery History Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="flex justify-center items-center">
              <div 
                className="animate-spin rounded-full h-16 w-16 border-b-2"
                style={{ borderColor: '#5D3A00' }}
              ></div>
            </div>
            <p className="mt-4" style={{ color: '#D87C5A' }}>Loading delivery history...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-red-500 mb-4">
              <Package className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Error Loading History</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        ) : filteredAndSortedHistory.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#D87C5A' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#5D3A00' }}>No delivery history found</h3>
            <p style={{ color: '#D87C5A' }}>
              {searchTerm || typeFilter !== 'all' 
                ? 'No deliveries match your current filters.' 
                : 'You haven\'t completed any deliveries yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton field="requestId">Request ID</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artwork Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton field="buyerName">Customer</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton field="artistName">Artist</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton field="orderDate">Order Date</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton field="deliveredDate">Delivered Date</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedHistory.map((delivery) => (
                  <tr key={`${delivery.requestType}-${delivery.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: delivery.requestType === 'artwork_order' ? '#FFE4D6' : '#FFD95A' 
                          }}
                        >
                          {delivery.requestType === 'artwork_order' ? 
                            <Image className="h-4 w-4" style={{ color: '#5D3A00' }} /> : 
                            <Palette className="h-4 w-4" style={{ color: '#5D3A00' }} />
                          }
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{delivery.requestId}</div>
                          <div className="text-sm text-gray-500">
                            {delivery.requestType === 'artwork_order' ? 'Artwork' : 'Commission'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{delivery.artwork.title}</div>
                      <div className="text-sm text-gray-500">{delivery.artwork.type}</div>
                      <div className="text-sm text-gray-500">{delivery.artwork.dimensions}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{delivery.buyerName}</div>
                      <div className="text-sm text-gray-500">{delivery.buyerEmail}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{delivery.artistName}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(delivery.orderDate)}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(delivery.deliveredDate)}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(delivery)}
                        className="text-amber-600 hover:text-amber-900 text-sm font-medium flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDelivery && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Delivery Details - {selectedDelivery.requestId}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Artwork Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Artwork Information
                  </h4>
                  <div className="space-y-2">
                    <div><strong>Title:</strong> {selectedDelivery.artwork.title}</div>
                    <div><strong>Type:</strong> {selectedDelivery.artwork.type}</div>
                    <div><strong>Dimensions:</strong> {selectedDelivery.artwork.dimensions}</div>
                    <div><strong>Value:</strong> {selectedDelivery.artwork.value}</div>
                    {selectedDelivery.commissionStyle && (
                      <div><strong>Style:</strong> {selectedDelivery.commissionStyle}</div>
                    )}
                    {selectedDelivery.urgency && (
                      <div><strong>Urgency:</strong> {selectedDelivery.urgency}</div>
                    )}
                  </div>
                </div>
                
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {selectedDelivery.buyerName}</div>
                    <div><strong>Email:</strong> {selectedDelivery.buyerEmail}</div>
                    <div><strong>Phone:</strong> {selectedDelivery.buyerPhone}</div>
                    <div><strong>Artist:</strong> {selectedDelivery.artistName}</div>
                  </div>
                </div>
                
                {/* Delivery Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Information
                  </h4>
                  <div className="space-y-2">
                    <div><strong>Address:</strong> {selectedDelivery.deliveryAddress.full}</div>
                    <div><strong>Status:</strong> 
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline Information
                  </h4>
                  <div className="space-y-2">
                    <div><strong>Order Date:</strong> {formatDateTime(selectedDelivery.orderDate)}</div>
                    <div><strong>Delivered Date:</strong> {formatDateTime(selectedDelivery.deliveredDate)}</div>
                  </div>
                </div>
              </div>
              
              {selectedDelivery.additionalNotes && (
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900">Additional Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedDelivery.additionalNotes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;