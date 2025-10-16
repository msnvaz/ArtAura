import {
    Package,
    MapPin,
    Phone,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Truck,
    User,
    Home,
    DollarSign,
    FileText,
    Navigation
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ActiveDeliveries = () => {
  const { token } = useAuth();
  
  // State for active deliveries data
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for active deliveries
  const mockActiveDeliveries = [
    {
      id: 2,
      requestId: 'REQ002',
      artistName: 'Priya Jayawardena',
      artistPhone: '+94 76 555 1234',
      buyerName: 'Ravi Perera',
      buyerPhone: '+94 72 444 5678',
      artwork: {
        title: 'Traditional Mask Collection',
        type: 'Wood Sculpture',
        size: '12" x 8" (Set of 3)',
        value: 'LKR 45,000'
      },
      pickupAddress: {
        street: '789 Beach Road',
        city: 'Galle',
        district: 'Southern Province',
        postalCode: '80000'
      },
      deliveryAddress: {
        street: '321 Lake View',
        city: 'Nugegoda',
        district: 'Western Province',
        postalCode: '10250'
      },
      status: 'picked_up',
      acceptedFee: 'LKR 3,500',
      pickupDate: '2024-08-16',
      estimatedDelivery: '2024-08-16',
      distance: '145 km',
      progress: {
        accepted: { completed: true, time: '2024-08-11 10:30 AM' },
        picked_up: { completed: true, time: '2024-08-16 2:15 PM' },
        in_transit: { completed: false, time: null },
        delivered: { completed: false, time: null }
      }
    },
    {
      id: 4,
      requestId: 'REQ004',
      artistName: 'Ruwan Dissanayake',
      artistPhone: '+94 77 888 9999',
      buyerName: 'Sanduni Perera',
      buyerPhone: '+94 71 222 3333',
      artwork: {
        title: 'Modern Abstract Canvas',
        type: 'Acrylic Painting',
        size: '30" x 40"',
        value: 'LKR 85,000'
      },
      pickupAddress: {
        street: '123 Art Street',
        city: 'Colombo',
        district: 'Western Province',
        postalCode: '00700'
      },
      deliveryAddress: {
        street: '456 Temple Road',
        city: 'Kandy',
        district: 'Central Province',
        postalCode: '20000'
      },
      status: 'in_transit',
      acceptedFee: 'LKR 2,800',
      pickupDate: '2024-08-15',
      estimatedDelivery: '2024-08-15',
      distance: '115 km',
      progress: {
        accepted: { completed: true, time: '2024-08-13 9:00 AM' },
        picked_up: { completed: true, time: '2024-08-15 11:00 AM' },
        in_transit: { completed: true, time: '2024-08-15 11:30 AM' },
        delivered: { completed: false, time: null }
      }
    }
  ];

  useEffect(() => {
    const fetchActiveDeliveries = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First try the new API endpoint for active deliveries
        try {
          const response = await axios.get('http://localhost:8081/api/delivery-partner/requests/active', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.data.success && response.data.requests) {
            // Transform the API data to match the component format
            const transformedDeliveries = response.data.requests.map(request => ({
              id: request.id,
              requestId: `${request.requestType === 'artwork_order' ? 'AW' : 'COM'}-${request.id}`,
              requestType: request.requestType,
              artistName: request.artistName || 'Artist Name',
              artistPhone: request.buyerPhone || 'N/A',
              buyerName: request.buyerName || 'Unknown Buyer',
              buyerPhone: request.buyerPhone || 'N/A',
              artwork: {
                title: request.artworkTitle || `${request.requestType === 'artwork_order' ? 'Artwork Order' : 'Commission'} #${request.id}`,
                type: request.artworkType || (request.requestType === 'artwork_order' ? 'Artwork' : 'Commission'),
                size: request.artworkDimensions || 'N/A',
                value: `Rs ${request.totalAmount || 0}`
              },
              pickupAddress: {
                street: request.pickupAddress || 'Pickup address to be confirmed',
                city: request.pickupCity || 'TBD',
                district: 'TBD',
                postalCode: 'TBD'
              },
              deliveryAddress: {
                full: request.shippingAddress || 'Address not provided',
                street: request.shippingAddress?.split(',')[0] || '',
                city: request.shippingAddress?.split(',')[1] || '',
                district: request.shippingAddress?.split(',')[2] || '',
                postalCode: request.shippingAddress?.split(',')[3] || ''
              },
              status: request.deliveryStatus === 'accepted' ? 'accepted' : 
                      request.deliveryStatus === 'outForDelivery' ? 'in_transit' : 'accepted',
              acceptedFee: 'Fee to be confirmed',
              pickupDate: request.orderDate ? new Date(request.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              estimatedDelivery: request.deadline ? 
                new Date(request.deadline).toISOString().split('T')[0] : 
                new Date(new Date().getTime() + 24*60*60*1000).toISOString().split('T')[0],
              distance: 'TBD',
              progress: {
                accepted: { 
                  completed: true, 
                  time: request.orderDate ? new Date(request.orderDate).toLocaleString() : 'N/A'
                },
                picked_up: { 
                  completed: request.deliveryStatus === 'outForDelivery', 
                  time: request.deliveryStatus === 'outForDelivery' ? 'Recently' : null
                },
                in_transit: { 
                  completed: request.deliveryStatus === 'outForDelivery', 
                  time: request.deliveryStatus === 'outForDelivery' ? 'Recently' : null
                },
                delivered: { completed: false, time: null }
              }
            }));
            
            setActiveDeliveries(transformedDeliveries);
            return; // Success with new API
          }
        } catch (newApiError) {
          console.log('New API not available, falling back to old API:', newApiError.message);
        }
        
        // Fallback to old API endpoint if new one fails
        const response = await axios.get('http://localhost:8081/api/delivery-status/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.success) {
          const { artworkOrders, commissionRequests } = response.data.data;
          
          // Filter only accepted and outForDelivery statuses for active deliveries
          const activeArtworkOrders = artworkOrders.filter(order => 
            order.delivery_status === 'accepted' || order.delivery_status === 'outForDelivery'
          );
          
          const activeCommissionRequests = commissionRequests.filter(commission => 
            commission.delivery_status === 'accepted' || commission.delivery_status === 'outForDelivery'
          );
          
          // Transform the API data to match the component format (old API structure)
          const transformedDeliveries = [
            ...activeArtworkOrders.map(order => ({
              id: order.id,
              requestId: `AW-${order.id}`,
              requestType: 'artwork_order',
              artistName: 'Artist Name', // You might need to fetch this separately
              artistPhone: order.contact_number || 'N/A',
              buyerName: `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Unknown Buyer',
              buyerPhone: order.contact_number || 'N/A',
              artwork: {
                title: `Artwork Order #${order.id}`,
                type: 'Artwork',
                size: 'N/A',
                value: `Rs ${order.total_amount || 0}`
              },
              pickupAddress: {
                street: 'Pickup address to be confirmed',
                city: 'TBD',
                district: 'TBD',
                postalCode: 'TBD'
              },
              deliveryAddress: {
                full: order.shipping_address || 'Address not provided',
                street: order.shipping_address?.split(',')[0] || '',
                city: order.shipping_address?.split(',')[1] || '',
                district: order.shipping_address?.split(',')[2] || '',
                postalCode: order.shipping_address?.split(',')[3] || ''
              },
              status: order.delivery_status === 'accepted' ? 'accepted' : 
                      order.delivery_status === 'outForDelivery' ? 'in_transit' : 'accepted',
              acceptedFee: order.shipping_fee ? `Rs ${order.shipping_fee}` : 'Fee not set',
              pickupDate: order.order_date ? new Date(order.order_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              estimatedDelivery: order.order_date ? new Date(new Date(order.order_date).getTime() + 24*60*60*1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              distance: 'TBD',
              progress: {
                accepted: { 
                  completed: true, 
                  time: order.order_date ? new Date(order.order_date).toLocaleString() : 'N/A'
                },
                picked_up: { 
                  completed: order.delivery_status === 'outForDelivery', 
                  time: order.delivery_status === 'outForDelivery' ? 'Recently' : null
                },
                in_transit: { 
                  completed: order.delivery_status === 'outForDelivery', 
                  time: order.delivery_status === 'outForDelivery' ? 'Recently' : null
                },
                delivered: { completed: false, time: null }
              }
            })),
            ...activeCommissionRequests.map(commission => ({
              id: commission.id,
              requestId: `COM-${commission.id}`,
              requestType: 'commission_request',
              artistName: 'Artist Name', // You might need to fetch this separately
              artistPhone: commission.phone || 'N/A',
              buyerName: commission.name || 'Unknown Buyer',
              buyerPhone: commission.phone || 'N/A',
              artwork: {
                title: commission.title || `Commission #${commission.id}`,
                type: commission.artwork_type || 'Commission',
                size: commission.dimensions || 'N/A',
                value: `Rs ${commission.budget || 0}`
              },
              pickupAddress: {
                street: 'Pickup address to be confirmed',
                city: 'TBD',
                district: 'TBD',
                postalCode: 'TBD'
              },
              deliveryAddress: {
                full: commission.shipping_address || 'Address not provided',
                street: commission.shipping_address?.split(',')[0] || '',
                city: commission.shipping_address?.split(',')[1] || '',
                district: commission.shipping_address?.split(',')[2] || '',
                postalCode: commission.shipping_address?.split(',')[3] || ''
              },
              status: commission.delivery_status === 'accepted' ? 'accepted' : 
                      commission.delivery_status === 'outForDelivery' ? 'in_transit' : 'accepted',
              acceptedFee: commission.shipping_fee ? `Rs ${commission.shipping_fee}` : 'Fee not set',
              pickupDate: commission.submitted_at ? new Date(commission.submitted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              estimatedDelivery: commission.deadline ? new Date(commission.deadline).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              distance: 'TBD',
              progress: {
                accepted: { 
                  completed: true, 
                  time: commission.submitted_at ? new Date(commission.submitted_at).toLocaleString() : 'N/A'
                },
                picked_up: { 
                  completed: commission.delivery_status === 'outForDelivery', 
                  time: commission.delivery_status === 'outForDelivery' ? 'Recently' : null
                },
                in_transit: { 
                  completed: commission.delivery_status === 'outForDelivery', 
                  time: commission.delivery_status === 'outForDelivery' ? 'Recently' : null
                },
                delivered: { completed: false, time: null }
              }
            }))
          ];
          
          setActiveDeliveries(transformedDeliveries);
        } else {
          setError(response.data.error || 'Failed to fetch active deliveries');
        }
      } catch (error) {
        console.error('Error fetching active deliveries:', error);
        setError('Failed to fetch active deliveries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDeliveries();
  }, [token]);

  const updateDeliveryStatus = async (delivery, newStatus) => {
    try {
      console.log('Updating delivery status:', { delivery, newStatus });
      
      // Convert request type to match backend expected format
      const orderType = delivery.requestType === 'artwork_order' ? 'artwork' : 'commission';
      
      let apiUrl;
      let requestData = null;
      let deliveryStatusToSend;
      
      // Map the frontend actions to backend delivery status and choose appropriate endpoint
      if (newStatus === 'picked_up' || newStatus === 'in_transit') {
        // Use the specific "out-for-delivery" endpoint
        deliveryStatusToSend = 'outForDelivery';
        apiUrl = `http://localhost:8081/api/delivery-status/${orderType}/${delivery.id}/out-for-delivery`;
      } else if (newStatus === 'delivered') {
        // Use the specific "delivered" endpoint
        deliveryStatusToSend = 'delivered';
        apiUrl = `http://localhost:8081/api/delivery-status/${orderType}/${delivery.id}/delivered`;
      } else {
        // For other status updates, use the comprehensive update endpoint
        deliveryStatusToSend = newStatus;
        apiUrl = 'http://localhost:8081/api/delivery-status/update-comprehensive';
        requestData = {
          orderId: delivery.id,
          orderType: orderType,
          deliveryStatus: deliveryStatusToSend,
          shippingFee: null,
          deliveryPartnerId: null
        };
      }

      console.log('API URL:', apiUrl);
      console.log('Delivery status to send:', deliveryStatusToSend);
      console.log('Request data:', requestData);
      
      // Make API call
      let response;
      if (requestData) {
        // POST/PUT request with body
        response = await axios.put(apiUrl, requestData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // PUT request without body (for specific endpoints)
        response = await axios.put(apiUrl, {}, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      console.log('Status update API Response:', response.data);

      if (response.data.success) {
        const currentTime = new Date().toLocaleString();
        
        setActiveDeliveries(prev => 
          prev.map(d => {
            if (d.id === delivery.id && d.requestType === delivery.requestType) {
              const updatedProgress = { ...d.progress };
              
              // Update progress based on new status
              if (newStatus === 'picked_up' || newStatus === 'in_transit') {
                // Update the delivery to "in_transit" status for UI
                updatedProgress.picked_up = { completed: true, time: currentTime };
                updatedProgress.in_transit = { completed: true, time: currentTime };
                
                return {
                  ...d,
                  status: 'in_transit', // Frontend status for display
                  progress: updatedProgress
                };
              } else if (newStatus === 'delivered') {
                updatedProgress.delivered = { completed: true, time: currentTime };
                
                // Remove from active deliveries after a delay (since it's now completed)
                setTimeout(() => {
                  setActiveDeliveries(prev => prev.filter(delivery => 
                    !(delivery.id === d.id && delivery.requestType === d.requestType)
                  ));
                }, 2000);
                
                return {
                  ...d,
                  status: 'delivered',
                  progress: updatedProgress
                };
              }
            }
            return d;
          })
        );

        const statusLabel = newStatus === 'picked_up' ? 'Out for Delivery' : 
                          newStatus === 'in_transit' ? 'In Transit' :
                          newStatus === 'delivered' ? 'Delivered' :
                          newStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        alert(`Delivery status updated successfully to: ${statusLabel}\n\nResponse: ${response.data.message}`);
      } else {
        throw new Error(response.data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to update delivery status.';
      if (error.response) {
        errorMessage += ` Status: ${error.response.status}`;
        if (error.response.data && error.response.data.error) {
          errorMessage += `\nError: ${error.response.data.error}`;
        }
        if (error.response.data && error.response.data.details) {
          errorMessage += `\nDetails: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage += ` Error: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'accepted': return { action: 'picked_up', label: 'Mark as Picked Up', icon: Package };
      case 'picked_up': return { action: 'in_transit', label: 'Start Transit', icon: Truck };
      case 'in_transit': return { action: 'delivered', label: 'Mark as Delivered', icon: CheckCircle };
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
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
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Active</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{activeDeliveries.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFD95A' }}
            >
              <Truck className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>In Transit</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {activeDeliveries.filter(d => d.status === 'in_transit').length}
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
              <Clock className="h-8 w-8" style={{ color: '#D87C5A' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Pending Pickup</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {activeDeliveries.filter(d => ['accepted', 'picked_up'].includes(d.status)).length}
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
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Earnings</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>LKR 6,300</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deliveries List */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
            <div className="flex justify-center items-center">
              <div 
                className="animate-spin rounded-full h-16 w-16 border-b-2"
                style={{ borderColor: '#5D3A00' }}
              ></div>
            </div>
            <p className="mt-4" style={{ color: '#D87C5A' }}>Loading active deliveries...</p>
          </div>
        ) : activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
            <Truck className="h-16 w-16 mx-auto mb-4" style={{ color: '#D87C5A' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#5D3A00' }}>No active deliveries</h3>
            <p style={{ color: '#D87C5A' }}>When you accept delivery requests, they will appear here for tracking.</p>
          </div>
        ) : (
          activeDeliveries.map((delivery) => {
            const nextAction = getNextAction(delivery.status);
            
            return (
              <div key={delivery.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: '#5D3A00' }}>{delivery.artwork.title}</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#D87C5A' }}>Request ID: {delivery.requestId}</p>
                      <p className="text-sm" style={{ color: '#D87C5A' }}>Delivery Fee: {delivery.acceptedFee}</p>
                    </div>
                    {nextAction && (
                      <button
                        onClick={() => updateDeliveryStatus(delivery, nextAction.action)}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                        style={{ backgroundColor: '#D87C5A' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#5D3A00'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
                      >
                        <nextAction.icon className="h-4 w-4" />
                        {nextAction.label}
                      </button>
                    )}
                  </div>

                  {/* Progress Timeline */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3" style={{ color: '#5D3A00' }}>Delivery Progress</h4>
                    <div className="flex items-center justify-between">
                      {Object.entries(delivery.progress).map(([step, data], index) => {
                        const isCompleted = data.completed;
                        const isLast = index === Object.entries(delivery.progress).length - 1;
                        
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted ? 'text-white' : 'text-gray-500'
                              }`}
                              style={{
                                backgroundColor: isCompleted ? '#5D3A00' : '#FFE4D6'
                              }}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <div className="w-2 h-2 bg-current rounded-full" />
                                )}
                              </div>
                              <p className="text-xs mt-1 text-center" style={{ color: '#D87C5A' }}>
                                {step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                              {data.time && (
                                <p className="text-xs mt-0.5" style={{ color: '#D87C5A', opacity: 0.8 }}>{data.time}</p>
                              )}
                            </div>
                            {!isLast && (
                              <div className={`flex-1 h-0.5 mx-2`}
                              style={{
                                backgroundColor: isCompleted ? '#5D3A00' : '#FFE4D6'
                              }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pickup Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Home className="h-4 w-4 mr-2 text-blue-600" />
                        Pickup Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {delivery.artistName}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {delivery.artistPhone}
                        </div>
                        <div className="flex items-start text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            {delivery.pickupAddress.street}, {delivery.pickupAddress.city}<br />
                            {delivery.pickupAddress.district} {delivery.pickupAddress.postalCode}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {delivery.pickupDate}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-green-600" />
                        Delivery Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {delivery.buyerName}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {delivery.buyerPhone}
                        </div>
                        <div className="flex items-start text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            {delivery.deliveryAddress.street}, {delivery.deliveryAddress.city}<br />
                            {delivery.deliveryAddress.district} {delivery.deliveryAddress.postalCode}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Navigation className="h-4 w-4 mr-2" />
                          Distance: {delivery.distance}
                        </div>
                      </div>
                    </div>

                    {/* Artwork Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-purple-600" />
                        Artwork Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-600">
                          <strong>Type:</strong> {delivery.artwork.type}
                        </div>
                        <div className="text-gray-600">
                          <strong>Size:</strong> {delivery.artwork.size}
                        </div>
                        <div className="text-gray-600">
                          <strong>Value:</strong> {delivery.artwork.value}
                        </div>
                        <div className="text-gray-600">
                          <strong>Est. Delivery:</strong> {delivery.estimatedDelivery}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Artist
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Buyer
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActiveDeliveries;
