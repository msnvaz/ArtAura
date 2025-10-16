import React, { useState, useEffect } from 'react';
import { MapPin, Package, User, Phone, Mail, Calendar, DollarSign, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtistPickupAddresses = () => {
  const [pickupAddresses, setPickupAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { token } = useAuth();

  // Fetch pickup addresses on component mount
  useEffect(() => {
    fetchPickupAddresses();
  }, [filterType]);

  const fetchPickupAddresses = async () => {
    try {
      setLoading(true);
      let endpoint = '/pickup-addresses';
      
      if (filterType === 'artworks') {
        endpoint = '/pickup-addresses/artworks';
      } else if (filterType === 'commissions') {
        endpoint = '/pickup-addresses/commissions';
      }

      const response = await axios.get(`http://localhost:8081/api/delivery-partner${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPickupAddresses(response.data.addresses || []);
      } else {
        setError('Failed to fetch pickup addresses');
      }
    } catch (error) {
      console.error('Error fetching pickup addresses:', error);
      setError('Failed to load pickup addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter addresses based on search term
  const filteredAddresses = pickupAddresses.filter(address => {
    const searchLower = searchTerm.toLowerCase();
    return (
      address.artistName.toLowerCase().includes(searchLower) ||
      address.artworkTitle.toLowerCase().includes(searchLower) ||
      address.city.toLowerCase().includes(searchLower) ||
      address.buyerName.toLowerCase().includes(searchLower)
    );
  });

  // Helper function to format date
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

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return `Rs ${parseFloat(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchPickupAddresses}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          Artist Pickup Addresses
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>{filteredAddresses.length} locations</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by artist, artwork, city, or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Requests</option>
          <option value="artworks">Artwork Orders</option>
          <option value="commissions">Commissions</option>
        </select>
      </div>

      {/* Address Cards */}
      {filteredAddresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pickup addresses found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No pending delivery requests with artist addresses available.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAddresses.map((address) => (
            <div key={`${address.requestType}-${address.requestId}`} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    address.requestType === 'artwork_order' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    address.requestType === 'artwork_order' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {address.requestType === 'artwork_order' ? 'Artwork Order' : 'Commission'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">#{address.requestId}</span>
              </div>

              {/* Artist Information */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{address.artistName}</p>
                    <p className="text-sm text-gray-600">{address.artistEmail}</p>
                  </div>
                </div>

                {address.artistContactNo && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{address.artistContactNo}</span>
                  </div>
                )}
              </div>

              {/* Pickup Address */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Pickup Address
                </h4>
                <p className="text-sm text-gray-700">
                  {[
                    address.streetAddress,
                    address.city,
                    address.state,
                    address.country,
                    address.zipCode
                  ].filter(Boolean).join(', ') || 'Address not available'}
                </p>
              </div>

              {/* Artwork Details */}
              <div className="space-y-2 mb-4">
                <div>
                  <p className="font-medium text-gray-900">{address.artworkTitle}</p>
                  <p className="text-sm text-gray-600">{address.artworkType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(address.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Buyer & Delivery Info */}
              <div className="border-t pt-4 space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Buyer</p>
                  <p className="text-sm font-medium text-gray-900">{address.buyerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery To</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{address.deliveryAddress}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Request Date</p>
                    <p className="text-sm text-gray-700">{formatDate(address.requestDate)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      address.deliveryStatus === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {address.deliveryStatus}
                    </span>
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

export default ArtistPickupAddresses;