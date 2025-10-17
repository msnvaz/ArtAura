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
    Clock,
    User,
    Home,
    FileText,
    AlertCircle,
    Search,
    Truck
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
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState('');

  // Fetch delivery requests from API
  useEffect(() => {
    const fetchDeliveryRequests = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Try the new delivery status endpoint first
        try {
          const pendingResponse = await axios.get('http://localhost:8081/api/delivery-status/pending', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (pendingResponse.data.success) {
            const { artworkOrders, commissionRequests } = pendingResponse.data.data;
            
            // Transform the new API data format
            const transformedRequests = [
              ...artworkOrders.map(order => ({
                id: order.id,
                requestType: 'artwork_order',
                artistId: order.artist_id || 'N/A',
                artistName: order.artist_name || 'Unknown Artist',
                artistPhone: order.artist_contact || order.contact_number || 'N/A',
                artistEmail: order.artist_email || order.email || 'N/A',
                buyerId: order.buyer_id,
                buyerName: `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Unknown Buyer',
                buyerPhone: order.contact_number || 'N/A',
                buyerEmail: order.email || 'N/A',
                pickupAddress: {
                  full: order.artist_address || 'Pickup address to be confirmed',
                  street: order.artist_address?.split(',')[0] || 'TBD',
                  city: order.artist_city || 'TBD',
                  district: order.artist_address?.split(',')[2] || 'TBD',
                  postalCode: order.artist_address?.split(',')[3] || 'TBD'
                },
                deliveryAddress: {
                  full: order.shipping_address || 'Address not provided',
                  street: order.shipping_address?.split(',')[0] || '',
                  city: order.shipping_address?.split(',')[1] || '',
                  district: order.shipping_address?.split(',')[2] || '',
                  postalCode: order.shipping_address?.split(',')[3] || ''
                },
                artwork: {
                  title: order.artwork_title || `Artwork Order #${order.id}`,
                  type: 'Artwork',
                  size: 'N/A',
                  weight: 'TBD',
                  fragile: true,
                  value: `Rs ${order.total_amount || 0}`
                },
                pickupDate: new Date().toISOString().split('T')[0],
                preferredTime: '10:00 AM - 6:00 PM',
                requestDate: order.order_date ? new Date(order.order_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                requestDateTime: order.order_date || new Date().toISOString(),
                status: order.delivery_status === 'accepted' ? 'accepted' : 
                        order.delivery_status === 'outForDelivery' ? 'in_progress' :
                        order.delivery_status === 'delivered' ? 'completed' : 'pending',
                urgency: 'normal',
                specialInstructions: 'Handle with care',
                distance: 'TBD',
                estimatedFee: 'Rs 2,500',
                deadline: null,
                acceptedFee: order.shipping_fee ? `Rs ${order.shipping_fee}` : null,
                acceptedDate: order.delivery_status === 'accepted' ? new Date().toISOString().split('T')[0] : null
              })),
              ...commissionRequests.map(commission => ({
                id: commission.id,
                requestType: 'commission_request',
                artistId: commission.artist_id,
                artistName: commission.artist_name || 'Unknown Artist',
                artistPhone: commission.artist_contact || commission.phone || 'N/A',
                artistEmail: commission.artist_email || commission.email || 'N/A',
                buyerId: commission.buyer_id,
                buyerName: commission.name || 'Unknown Buyer',
                buyerPhone: commission.phone || 'N/A',
                buyerEmail: commission.email || 'N/A',
                pickupAddress: {
                  full: commission.artist_address || 'Pickup address to be confirmed',
                  street: commission.artist_address?.split(',')[0] || 'TBD',
                  city: commission.artist_city || 'TBD',
                  district: commission.artist_address?.split(',')[2] || 'TBD',
                  postalCode: commission.artist_address?.split(',')[3] || 'TBD'
                },
                deliveryAddress: {
                  full: commission.shipping_address || 'Address not provided',
                  street: commission.shipping_address?.split(',')[0] || '',
                  city: commission.shipping_address?.split(',')[1] || '',
                  district: commission.shipping_address?.split(',')[2] || '',
                  postalCode: commission.shipping_address?.split(',')[3] || ''
                },
                artwork: {
                  title: commission.title || `Commission #${commission.id}`,
                  type: commission.artwork_type || 'Commission',
                  size: commission.dimensions || 'N/A',
                  weight: 'TBD',
                  fragile: true,
                  value: `Rs ${commission.budget || 0}`
                },
                pickupDate: new Date().toISOString().split('T')[0],
                preferredTime: '10:00 AM - 6:00 PM',
                requestDate: commission.submitted_at ? new Date(commission.submitted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                requestDateTime: commission.submitted_at || new Date().toISOString(),
                status: commission.delivery_status === 'accepted' ? 'accepted' : 
                        commission.delivery_status === 'outForDelivery' ? 'in_progress' :
                        commission.delivery_status === 'delivered' ? 'completed' : 'pending',
                urgency: commission.urgency || 'normal',
                specialInstructions: commission.additional_notes || 'Handle with care',
                distance: 'TBD',
                estimatedFee: 'Rs 2,500',
                deadline: commission.deadline ? new Date(commission.deadline).toISOString().split('T')[0] : null,
                acceptedFee: commission.shipping_fee ? `Rs ${commission.shipping_fee}` : null,
                acceptedDate: commission.delivery_status === 'accepted' ? new Date().toISOString().split('T')[0] : null
              }))
            ];
            
            setDeliveryRequests(transformedRequests);
            return; // Exit early if successful
          }
        } catch (newApiError) {
          console.log('New API not available, falling back to old API:', newApiError);
        }
        
        // Fallback to old API if new one fails
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
          
          // Transform API data to match frontend expected format (old format)
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

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const handleMarkInTransit = async (request) => {
    try {
      console.log('Marking as in transit for request:', request);
      
      // Convert request type to match backend expected format
      const orderType = request.requestType === 'artwork_order' ? 'artwork' : 'commission';
      
      // Make API call to mark as out for delivery
      const response = await axios.put(`http://localhost:8081/api/delivery-status/${orderType}/${request.id}/out-for-delivery`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Mark in transit API Response:', response.data);

      if (response.data.success) {
        // Update local state
        setDeliveryRequests(prev => 
          prev.map(req => 
            req.id === request.id 
              ? { ...req, status: 'in_progress' }
              : req
          )
        );

        alert('Order marked as in transit successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to mark as in transit');
      }
    } catch (error) {
      console.error('Error marking as in transit:', error);
      alert(`Failed to mark as in transit. Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleMarkDelivered = async (request) => {
    try {
      console.log('Marking as delivered for request:', request);
      
      // Convert request type to match backend expected format
      const orderType = request.requestType === 'artwork_order' ? 'artwork' : 'commission';
      
      // Make API call to mark as delivered
      const response = await axios.put(`http://localhost:8081/api/delivery-status/${orderType}/${request.id}/delivered`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Mark delivered API Response:', response.data);

      if (response.data.success) {
        // Update local state
        setDeliveryRequests(prev => 
          prev.map(req => 
            req.id === request.id 
              ? { ...req, status: 'completed' }
              : req
          )
        );

        alert('Order marked as delivered successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to mark as delivered');
      }
    } catch (error) {
      console.error('Error marking as delivered:', error);
      alert(`Failed to mark as delivered. Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmitAcceptance = async () => {
    if (!deliveryFee || isNaN(deliveryFee) || parseFloat(deliveryFee) <= 0) {
      alert('Please enter a valid delivery fee');
      return;
    }

    try {
      console.log('Starting acceptance process for request:', selectedRequest);
      
      // Get current user from localStorage and validate
      let currentUser;
      let userId;
      try {
        const userStr = localStorage.getItem('user');
        console.log('Raw user string from localStorage:', userStr);
        
        if (!userStr) {
          throw new Error('No user found in localStorage');
        }
        
        currentUser = JSON.parse(userStr);
        console.log('Parsed user object:', currentUser);
        
        // Try different possible property names for user ID
        userId = currentUser.userId || currentUser.id || currentUser.UserId || currentUser.user_id;
        
        if (!userId) {
          console.error('No userId found in user object. Available properties:', Object.keys(currentUser));
          throw new Error('No valid user ID found in user data');
        }
        
        console.log('Found userId:', userId);
      } catch (userParseError) {
        console.error('Error parsing user from localStorage:', userParseError);
        
        // If localStorage parsing fails, try to extract from JWT token
        if (token) {
          try {
            // Decode JWT token to get user info (basic decode, not verifying signature)
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('JWT payload:', payload);
              userId = payload.userId || payload.sub || payload.id || payload.UserId;
              if (userId) {
                console.log('Extracted userId from JWT:', userId);
                currentUser = { userId: userId };
              }
            }
          } catch (jwtError) {
            console.error('Error extracting from JWT:', jwtError);
          }
        }
        
        if (!userId) {
          alert('User authentication error. Please log in again.');
          return;
        }
      }
      
      // Get current user ID for delivery partner ID
      let deliveryPartnerId;
      try {
        const userResponse = await axios.get(`http://localhost:8081/api/delivery-partner/profile/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        deliveryPartnerId = userResponse.data.partnerId;
        console.log('Got delivery partner ID:', deliveryPartnerId);
      } catch (userError) {
        console.error('Error getting delivery partner ID:', userError);
        // Use the user ID as fallback
        deliveryPartnerId = userId;
        console.log('Using fallback delivery partner ID (user ID):', deliveryPartnerId);
      }

      // Convert request type to match backend expected format
      const orderType = selectedRequest.requestType === 'artwork_order' ? 'artwork' : 'commission';
      
      const requestPayload = {
        orderType: orderType,
        orderId: selectedRequest.id,
        shippingFee: parseFloat(deliveryFee),
        deliveryPartnerId: deliveryPartnerId
      };
      
      console.log('Making API call with payload:', requestPayload);

      // Make API call to accept the delivery request using the new enhanced endpoint
      const response = await axios.post('http://localhost:8081/api/delivery-status/accept-enhanced', requestPayload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        // Update local state with enhanced response data
        setDeliveryRequests(prev => 
          prev.map(req => 
            req.id === selectedRequest.id 
              ? { 
                  ...req, 
                  status: 'accepted', 
                  acceptedFee: `Rs ${deliveryFee}`, 
                  acceptedDate: new Date().toISOString().split('T')[0],
                  lastUpdated: response.data.timestamp,
                  deliveryPartnerId: deliveryPartnerId
                }
              : req
          )
        );

        setShowAcceptModal(false);
        setDeliveryFee('');
        
        // Enhanced success message with more details
        alert(`✅ Delivery request accepted successfully!\n\n` +
              `Order ID: ${selectedRequest.id}\n` +
              `Order Type: ${orderType}\n` +
              `Delivery Fee: Rs ${deliveryFee}\n` +
              `Status: ${response.data.newStatus}\n` +
              `${response.data.message || 'Request has been accepted and is ready for pickup.'}\n\n` +
              `Previous Status: ${response.data.previousStatus}\n` +
              `Updated At: ${new Date(response.data.timestamp).toLocaleString()}`);
      } else {
        console.error('API returned success=false:', response.data);
        throw new Error(response.data.error || 'Failed to accept delivery request');
      }
    } catch (error) {
      console.error('Error accepting delivery request:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Check if it's a 404 error or new endpoint not available, fallback to old endpoint
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        console.log('Enhanced endpoint not available, trying standard endpoint...');
        try {
          const fallbackResponse = await axios.post('http://localhost:8081/api/delivery-status/accept', requestPayload, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('Standard API Response:', fallbackResponse.data);

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
          alert('Delivery request accepted successfully using standard method!');
        } catch (fallbackError) {
          console.error('Standard endpoint also failed, trying legacy endpoint:', fallbackError);
          try {
            const legacyResponse = await axios.put(`http://localhost:8081/api/delivery-partner/requests/${selectedRequest.id}/accept`, {
              requestType: selectedRequest.requestType,
              deliveryFee: deliveryFee
            }, {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            console.log('Legacy API Response:', legacyResponse.data);

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
            alert('Delivery request accepted successfully using legacy method!');
          } catch (legacyError) {
            console.error('All endpoints failed:', legacyError);
            
            // Enhanced error message for complete failure
            let errorMessage = 'Failed to accept delivery request on all available endpoints.';
            
            if (legacyError.response) {
              errorMessage += ` Status: ${legacyError.response.status}`;
              if (legacyError.response.data && legacyError.response.data.error) {
                errorMessage += `\nError: ${legacyError.response.data.error}`;
              }
              if (legacyError.response.data && legacyError.response.data.details) {
                errorMessage += `\nDetails: ${legacyError.response.data.details}`;
              }
            } else {
              errorMessage += `\nError: ${legacyError.message}`;
            }
            
            errorMessage += '\n\nPlease check your network connection and try again, or contact support.';
            alert(errorMessage);
          }
        }
      } else {
        // Enhanced error handling for non-404 errors
        let errorMessage = 'Failed to accept delivery request.';
        
        if (error.response) {
          errorMessage += ` Status: ${error.response.status}`;
          if (error.response.data && error.response.data.error) {
            errorMessage += `\nError: ${error.response.data.error}`;
          }
          if (error.response.data && error.response.data.details) {
            errorMessage += `\nDetails: ${error.response.data.details}`;
          }
          
          // Specific handling for common errors
          if (error.response.status === 400) {
            errorMessage += '\n\nPlease check that all required fields are provided correctly.';
          } else if (error.response.status === 401) {
            errorMessage += '\n\nAuthentication failed. Please log in again.';
          } else if (error.response.status === 403) {
            errorMessage += '\n\nAccess denied. You may not have permission to accept this request.';
          } else if (error.response.status >= 500) {
            errorMessage += '\n\nServer error. Please try again later or contact support.';
          }
        } else if (error.request) {
          errorMessage += '\n\nNetwork error: Unable to connect to server. Please check your connection.';
        } else {
          errorMessage += `\nError: ${error.message}`;
        }
        
        alert(errorMessage);
      }
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
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      </div> */}

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
                    {/* Show different buttons based on status */}
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
                    
                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleMarkInTransit(request)}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                        style={{
                          backgroundColor: '#2563eb'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                      >
                        <Truck className="h-4 w-4 inline mr-1" />
                        Mark In Transit
                      </button>
                    )}
                    
                    {request.status === 'in_progress' && (
                      <button
                        onClick={() => handleMarkDelivered(request)}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                        style={{
                          backgroundColor: '#16a34a'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
                      >
                        <Check className="h-4 w-4 inline mr-1" />
                        Mark Delivered
                      </button>
                    )}
                    
                    {request.status === 'completed' && (
                      <span className="px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-lg">
                        ✓ Delivered
                      </span>
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

                {request.status === 'in_progress' && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
                    <p className="text-sm" style={{ color: '#1E3A8A' }}>
                      <strong>🚚 In Transit</strong> - Order is on the way to delivery location
                    </p>
                  </div>
                )}

                {request.status === 'completed' && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
                    <p className="text-sm" style={{ color: '#14532D' }}>
                      <strong>✅ Delivered</strong> - Order has been successfully delivered
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

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
