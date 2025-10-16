import {
    Package,
    MapPin,
    Phone,
    Calendar,
    Palette,
    Ruler,
    DollarSign,
    Check,
    X,
    Eye,
    Clock,
    User,
    Home,
    FileText,
    AlertCircle,
    Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DeliveryRequestsList = () => {
  const { token } = useAuth();
  
  // State for delivery requests data
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState('');

  // Fetch delivery requests from API
  useEffect(() => {
    const fetchDeliveryRequests = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both delivery requests and pickup addresses
        const [requestsResponse, pickupResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/delivery-partner/requests/pending', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8081/api/delivery-partner/pickup-addresses', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        if (requestsResponse.data.success) {
          // Create a map of pickup addresses by request ID and type
          const pickupMap = new Map();
          if (pickupResponse.data.success && pickupResponse.data.addresses) {
            pickupResponse.data.addresses.forEach(addr => {
              const key = `${addr.requestType}-${addr.requestId}`;
              pickupMap.set(key, addr);
            });
          }
          
          // Transform API data to match frontend expected format
          const transformedRequests = requestsResponse.data.requests.map(req => {
            const pickupKey = `${req.requestType}-${req.id}`;
            const pickupData = pickupMap.get(pickupKey);
            
            return {
            id: req.id,
            requestType: req.requestType,
            artistId: req.artistId,
            artistName: req.artistName || 'Unknown Artist',
            artistPhone: pickupData?.artistContactNo || req.buyerPhone || 'N/A',
            artistEmail: pickupData?.artistEmail || req.buyerEmail || 'N/A',
            buyerId: req.buyerId,
            buyerName: req.buyerName,
            buyerPhone: req.buyerPhone,
            buyerEmail: req.buyerEmail,
            pickupAddress: {
              full: pickupData ? [
                pickupData.streetAddress,
                pickupData.city,
                pickupData.state,
                pickupData.country,
                pickupData.zipCode
              ].filter(Boolean).join(', ') : 'Address not available',
              street: pickupData?.streetAddress || 'N/A',
              city: pickupData?.city || 'N/A',
              district: pickupData?.state || 'N/A',
              postalCode: pickupData?.zipCode || 'N/A'
            },
            deliveryAddress: {
              full: req.shippingAddress,
              street: req.shippingAddress?.split(',')[0] || '',
              city: req.shippingAddress?.split(',')[1] || '',
              district: req.shippingAddress?.split(',')[2] || '',
              postalCode: req.shippingAddress?.split(',')[3] || ''
            },
            artwork: {
              title: req.artworkTitle,
              type: req.artworkType || 'Artwork',
              size: req.artworkDimensions || 'N/A',
              weight: 'TBD',
              fragile: true, // Assume fragile for artwork
              value: `Rs ${req.totalAmount || 0}`
            },
            pickupDate: new Date().toISOString().split('T')[0], // Default to today
            preferredTime: '10:00 AM - 6:00 PM',
            requestDate: req.orderDate ? new Date(req.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            requestDateTime: req.orderDate || new Date().toISOString(), // Keep the full datetime for detailed display
            status: 'pending',
            urgency: req.urgency || 'normal',
            specialInstructions: req.additionalNotes || 'Handle with care',
            distance: 'TBD',
            estimatedFee: 'Rs 2,500',
            deadline: req.deadline ? new Date(req.deadline).toISOString().split('T')[0] : null
          };
          });
          
          setDeliveryRequests(transformedRequests);
        } else {
          setError(requestsResponse.data.error || 'Failed to fetch delivery requests');
        }
      } catch (error) {
        console.error('Error fetching delivery requests:', error);
        setError('Failed to fetch delivery requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryRequests();
  }, [token]);

  // Filter requests based on search term and status
  const filteredRequests = deliveryRequests.filter(request => {
    const matchesSearch = 
      request.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.pickupAddress.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deliveryAddress.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const handleSubmitAcceptance = async () => {
    if (!deliveryFee || isNaN(deliveryFee) || parseFloat(deliveryFee) <= 0) {
      alert('Please enter a valid delivery fee');
      return;
    }

    try {
      // Make API call to accept the delivery request
      await axios.put(`http://localhost:8081/api/delivery-partner/requests/${selectedRequest.id}/accept`, {
        requestType: selectedRequest.requestType,
        deliveryFee: deliveryFee
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      setDeliveryRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'accepted', acceptedFee: `Rs ${deliveryFee}`, acceptedDate: new Date().toISOString().split('T')[0] }
            : req
        )
      );

      setShowAcceptModal(false);
      setDeliveryFee('');
      alert('Delivery request accepted successfully!');
    } catch (error) {
      console.error('Error accepting delivery request:', error);
      alert('Failed to accept delivery request. Please try again.');
    }
  };

  // Helper function to format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#D87C5A' }} />
              <input
                type="text"
                placeholder="Search by artist, artwork, or location..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: '#FFE4D6',
                  focusRingColor: '#5D3A00'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: '#FFE4D6',
                focusRingColor: '#5D3A00'
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <Package className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Requests</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{deliveryRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFD95A' }}
            >
              <Clock className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Pending</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {deliveryRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <Check className="h-8 w-8" style={{ color: '#D87C5A' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Accepted</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {deliveryRequests.filter(r => r.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFD95A' }}
            >
              <DollarSign className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Avg. Fee</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>LKR 3,200</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Requests List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
            <div className="flex justify-center items-center">
              <div 
                className="animate-spin rounded-full h-16 w-16 border-b-2"
                style={{ borderColor: '#5D3A00' }}
              ></div>
            </div>
            <p className="mt-4" style={{ color: '#D87C5A' }}>Loading delivery requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: '#D87C5A' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#5D3A00' }}>No delivery requests found</h3>
            <p style={{ color: '#D87C5A' }}>Try adjusting your search criteria or check back later for new requests.</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: '#5D3A00' }}>{request.artwork.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {request.requestType === 'artwork_order' ? 'Artwork Order' : 'Commission'}
                      </span>
                      <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3" style={{ color: '#D87C5A' }}>
                      <span>Request ID: #{request.id}</span>
                      <span>•</span>
                      <span>
                        {request.requestType === 'artwork_order' ? 'Ordered' : 'Submitted'}: {formatDate(request.requestDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                      style={{
                        color: '#5D3A00',
                        backgroundColor: '#FFE4D6'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      View Details
                    </button>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                        style={{
                          backgroundColor: '#D87C5A'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#5D3A00'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
                      >
                        <Check className="h-4 w-4 inline mr-1" />
                        Accept
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pickup Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center" style={{ color: '#5D3A00' }}>
                      <Home className="h-4 w-4 mr-2" style={{ color: '#D87C5A' }} />
                      Pickup Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <User className="h-4 w-4 mr-2" />
                        {request.artistName}
                      </div>
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <Phone className="h-4 w-4 mr-2" />
                        {request.artistPhone}
                      </div>
                      <div className="flex items-start" style={{ color: '#D87C5A' }}>
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {request.pickupAddress.street}, {request.pickupAddress.city}<br />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center" style={{ color: '#5D3A00' }}>
                      <Package className="h-4 w-4 mr-2" style={{ color: '#D87C5A' }} />
                      Delivery Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <User className="h-4 w-4 mr-2" />
                        {request.buyerName}
                      </div>
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <Phone className="h-4 w-4 mr-2" />
                        {request.buyerPhone}
                      </div>
                      <div className="flex items-start" style={{ color: '#D87C5A' }}>
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {request.deliveryAddress.street}, {request.deliveryAddress.city}<br />
                          {request.deliveryAddress.district} {request.deliveryAddress.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artwork Information */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center" style={{ color: '#5D3A00' }}>
                      <Palette className="h-4 w-4 mr-2" style={{ color: '#D87C5A' }} />
                      Artwork Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Type: {request.artwork.type}
                      </div>
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <Ruler className="h-4 w-4 mr-2" />
                        Size: {request.artwork.size}
                      </div>
                      {/* <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Value: {request.artwork.value}
                      </div> */}
                      {request.artwork.fragile && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Fragile Item
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {request.specialInstructions && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                    <h5 className="font-medium mb-1" style={{ color: '#5D3A00' }}>Special Instructions:</h5>
                    <p className="text-sm" style={{ color: '#D87C5A' }}>{request.specialInstructions}</p>
                  </div>
                )}

                {request.status === 'accepted' && request.acceptedFee && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                    <p className="text-sm" style={{ color: '#5D3A00' }}>
                      <strong>Accepted on {request.acceptedDate}</strong> - Delivery Fee: {request.acceptedFee}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Delivery Request Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Detailed view content would go here */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Request Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Request ID:</span> #{selectedRequest.id}
                    </div>
                    <div>
                      <span className="font-medium">Request Type:</span> 
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {selectedRequest.requestType === 'artwork_order' ? 'Artwork Order' : 'Commission Request'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">
                        {selectedRequest.requestType === 'artwork_order' ? 'Order Date:' : 'Submitted Date:'}
                      </span> {formatDate(selectedRequest.requestDate)}
                      {selectedRequest.requestDateTime && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({formatDateTime(selectedRequest.requestDateTime)})
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> 
                      <span className={`ml-2 ${getUrgencyColor(selectedRequest.urgency)}`}>
                        {selectedRequest.urgency}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Additional detailed sections would be added here */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accept Request Modal */}
      {showAcceptModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Accept Delivery Request</h2>
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  You are about to accept the delivery request for "<strong>{selectedRequest.artwork.title}</strong>".
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Request Type:</strong> {selectedRequest.requestType === 'artwork_order' ? 'Artwork Order' : 'Commission Request'}</p>
                  <p><strong>Artwork:</strong> {selectedRequest.artwork.title}</p>
                  <p><strong>Value:</strong> {selectedRequest.artwork.value}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee (LKR) *
                </label>
                <input
                  type="number"
                  id="deliveryFee"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="Enter your delivery fee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suggested range: LKR 2,000 - 5,000 based on distance and artwork type
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAcceptance}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Accept Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryRequestsList;
