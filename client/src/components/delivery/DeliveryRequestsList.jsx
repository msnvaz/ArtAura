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

  // Mock data for delivery requests (would be fetched from API)
  const mockDeliveryRequests = [
    {
      id: 1,
      artistId: 'ART001',
      artistName: 'Saman Kumara',
      artistPhone: '+94 77 123 4567',
      artistEmail: 'saman.kumara@email.com',
      pickupAddress: {
        street: '123 Temple Road',
        city: 'Kandy',
        district: 'Central Province',
        postalCode: '20000'
      },
      buyerId: 'BUY001',
      buyerName: 'Nimal Silva',
      buyerPhone: '+94 71 987 6543',
      buyerEmail: 'nimal.silva@email.com',
      deliveryAddress: {
        street: '456 Galle Road',
        city: 'Colombo',
        district: 'Western Province',
        postalCode: '00300'
      },
      artwork: {
        title: 'Sunset over Sigiriya',
        type: 'Oil Painting',
        size: '24" x 36"',
        weight: '2.5 kg',
        fragile: true,
        value: 'LKR 75,000'
      },
      pickupDate: '2024-08-15',
      preferredTime: '10:00 AM - 2:00 PM',
      requestDate: '2024-08-10',
      status: 'pending',
      urgency: 'normal',
      specialInstructions: 'Handle with extreme care. Artwork is framed and glass-protected.',
      distance: '115 km',
      estimatedDuration: '3-4 hours'
    },
    {
      id: 2,
      artistId: 'ART002',
      artistName: 'Priya Jayawardena',
      artistPhone: '+94 76 555 1234',
      artistEmail: 'priya.jay@email.com',
      pickupAddress: {
        street: '789 Beach Road',
        city: 'Galle',
        district: 'Southern Province',
        postalCode: '80000'
      },
      buyerId: 'BUY002',
      buyerName: 'Ravi Perera',
      buyerPhone: '+94 72 444 5678',
      buyerEmail: 'ravi.perera@email.com',
      deliveryAddress: {
        street: '321 Lake View',
        city: 'Nugegoda',
        district: 'Western Province',
        postalCode: '10250'
      },
      artwork: {
        title: 'Traditional Mask Collection',
        type: 'Wood Sculpture',
        size: '12" x 8" (Set of 3)',
        weight: '1.8 kg',
        fragile: true,
        value: 'LKR 45,000'
      },
      pickupDate: '2024-08-16',
      preferredTime: '2:00 PM - 6:00 PM',
      requestDate: '2024-08-11',
      status: 'accepted',
      urgency: 'high',
      specialInstructions: 'Pack individually. Each mask needs separate protective wrapping.',
      distance: '145 km',
      estimatedDuration: '4-5 hours',
      acceptedFee: 'LKR 3,500',
      acceptedDate: '2024-08-11'
    },
    {
      id: 3,
      artistId: 'ART003',
      artistName: 'Chaminda Fernando',
      artistPhone: '+94 78 999 7777',
      artistEmail: 'chaminda.f@email.com',
      pickupAddress: {
        street: '555 Hill Street',
        city: 'Nuwara Eliya',
        district: 'Central Province',
        postalCode: '22200'
      },
      buyerId: 'BUY003',
      buyerName: 'Malini Wickramasinghe',
      buyerPhone: '+94 75 333 2222',
      buyerEmail: 'malini.w@email.com',
      deliveryAddress: {
        street: '777 Marine Drive',
        city: 'Mount Lavinia',
        district: 'Western Province',
        postalCode: '10370'
      },
      artwork: {
        title: 'Tea Plantation Landscape',
        type: 'Watercolor',
        size: '18" x 24"',
        weight: '1.2 kg',
        fragile: false,
        value: 'LKR 35,000'
      },
      pickupDate: '2024-08-17',
      preferredTime: '9:00 AM - 1:00 PM',
      requestDate: '2024-08-12',
      status: 'pending',
      urgency: 'normal',
      specialInstructions: 'Can be rolled for transport if needed.',
      distance: '180 km',
      estimatedDuration: '5-6 hours'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setDeliveryRequests(mockDeliveryRequests);
      setLoading(false);
    }, 1000);
  }, []);

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
      // Here you would make an API call to accept the delivery request
      // await axios.post(`/api/delivery/accept/${selectedRequest.id}`, { fee: deliveryFee }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Update local state
      setDeliveryRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'accepted', acceptedFee: `LKR ${deliveryFee}`, acceptedDate: new Date().toISOString().split('T')[0] }
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
                      <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#D87C5A' }}>Request ID: #{request.id}</p>
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
                          {request.pickupAddress.district} {request.pickupAddress.postalCode}
                        </span>
                      </div>
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {request.pickupDate} ({request.preferredTime})
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
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Distance: {request.distance} ({request.estimatedDuration})
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
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <Package className="h-4 w-4 mr-2" />
                        Weight: {request.artwork.weight}
                      </div>
                      <div className="flex items-center" style={{ color: '#D87C5A' }}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Value: {request.artwork.value}
                      </div>
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
                      <span className="font-medium">Request Date:</span> {selectedRequest.requestDate}
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
                  <p><strong>Distance:</strong> {selectedRequest.distance}</p>
                  <p><strong>Estimated Duration:</strong> {selectedRequest.estimatedDuration}</p>
                  <p><strong>Pickup Date:</strong> {selectedRequest.pickupDate}</p>
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
