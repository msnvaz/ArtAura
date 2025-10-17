import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Download,
  User,
  Store,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Hash
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';
import adminVerificationApi from '../../services/adminVerificationApi';

const UserVerification = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { formatPrice } = useCurrency();

  // API state
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    setIsLoaded(true);
    fetchVerificationRequests();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchVerificationRequests();
  }, [searchTerm, selectedUserType]);

  const fetchVerificationRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      if (selectedUserType !== 'all') {
        filters.userType = selectedUserType;
      }
      
      const response = await adminVerificationApi.getAllVerificationRequests(filters);
      setVerificationRequests(response.requests || []);
    } catch (err) {
      setError('Failed to load verification requests. Please try again.');
      setVerificationRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await adminVerificationApi.getVerificationStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: stats.pending || 0 },
    { id: 'verified', label: 'Verified', count: stats.verified || 0 },
    { id: 'rejected', label: 'Rejected', count: stats.rejected || 0 },
    { id: 'all', label: 'All Requests', count: stats.total || 0 }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const getFilteredRequests = () => {
    let filtered = verificationRequests;

    if (activeTab !== 'all') {
      filtered = filtered.filter(request => request.status === activeTab);
    }

    if (selectedUserType !== 'all') {
      filtered = filtered.filter(request => request.userType === selectedUserType);
    }

    if (searchTerm) {
      filtered = filtered.filter(request => {
        const searchFields = request.userType === 'artist' 
          ? [request.firstName, request.lastName, request.email, request.nic]
          : [request.shopName, request.ownerName, request.email, request.taxId, request.ownerNic];
        
        return searchFields.some(field => 
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  };

  const handleVerificationAction = async (requestId, action) => {
    try {
      const request = verificationRequests.find(r => r.id === requestId);
      if (!request) return;

      let status;
      switch (action) {
        case 'approve':
          status = 'verified';
          break;
        case 'reject':
          status = 'rejected';
          break;
        default:
          status = action;
      }

      const result = await adminVerificationApi.updateVerificationStatus(
        requestId, 
        request.userType, 
        status
      );

      if (result.success) {
        // Refresh the data
        await fetchVerificationRequests();
        await fetchStats();
      }
    } catch (error) {
      setError('Failed to update verification status.');
      console.error('Verification action error:', error);
    }
  };

  // Artist Verification Card Component
  const ArtistVerificationCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow-sm border verification-request-card" style={{borderColor: '#FFE4D6'}}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{backgroundColor: '#FFE4D6'}}>
              <User size={24} style={{color: '#D87C5A'}} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>
                  {request.firstName} {request.lastName}
                </h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}>
                  Artist
                </span>
              </div>
              <p className="text-sm flex items-center gap-1" style={{color: '#D87C5A'}}>
                <Mail size={14} />
                {request.email}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
            {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
          </span>
        </div>

        {/* NIC Image Display */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{color: '#5D3A00'}}>
            <ImageIcon size={16} />
            NIC Image
          </h4>
          <div className="relative">
            {request.nicImageUrl ? (
              <>
                <img 
                  src={request.nicImageUrl} 
                  alt="NIC Document" 
                  className="w-full h-48 object-cover rounded-lg border"
                  style={{borderColor: '#FFE4D6'}}
                />
                <button 
                  className="absolute top-2 right-2 p-2 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
                  onClick={() => window.open(request.nicImageUrl, '_blank')}
                >
                  <Eye size={16} style={{color: '#D87C5A'}} />
                </button>
              </>
            ) : (
              <div 
                className="w-full h-48 rounded-lg border flex items-center justify-center"
                style={{borderColor: '#FFE4D6', backgroundColor: '#FFF5E1'}}
              >
                <div className="text-center">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" style={{color: '#D87C5A'}} />
                  <p className="text-sm" style={{color: '#8B4513'}}>No NIC image uploaded</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>NIC:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.nic}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Contact:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.contactNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Specialization:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.specialization}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Join Date:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{new Date(request.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleVerificationAction(request.id, 'approve')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button
              onClick={() => handleVerificationAction(request.id, 'reject')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Shop Verification Card Component
  const ShopVerificationCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow-sm border verification-request-card" style={{borderColor: '#FFE4D6'}}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{backgroundColor: '#E3F2FD'}}>
              <Store size={24} style={{color: '#1976D2'}} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>
                  {request.shopName}
                </h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#E3F2FD', color: '#5D3A00'}}>
                  Shop
                </span>
              </div>
              <p className="text-sm flex items-center gap-1" style={{color: '#D87C5A'}}>
                <Mail size={14} />
                {request.email}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
            {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
          </span>
        </div>

        {/* NIC Image Display */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{color: '#5D3A00'}}>
            <ImageIcon size={16} />
            Owner NIC Image
          </h4>
          <div className="relative">
            <img 
              src={request.nicImageUrl} 
              alt="Owner NIC Document" 
              className="w-full h-48 object-cover rounded-lg border"
              style={{borderColor: '#FFE4D6'}}
            />
            <button 
              className="absolute top-2 right-2 p-2 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
              onClick={() => window.open(request.nicImageUrl, '_blank')}
            >
              <Eye size={16} style={{color: '#D87C5A'}} />
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Owner:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.ownerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Owner NIC:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.ownerNic}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Tax ID:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.taxId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Contact:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.contactNo}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Business Type:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.businessType}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>License:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{request.businessLicense}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{color: '#D87C5A'}} />
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>Created:</span>
              <span className="text-sm" style={{color: '#8B4513'}}>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {request.description && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Description:</h4>
            <p className="text-sm p-3 rounded-lg" style={{backgroundColor: '#FFF5E1', color: '#8B4513'}}>
              {request.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleVerificationAction(request.id, 'approve')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button
              onClick={() => handleVerificationAction(request.id, 'reject')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Add smooth animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .verification-container {
          animation: smoothFadeIn 0.4s ease-out;
        }

        .verification-stats {
          animation: slideInUp 0.5s ease-out 0.1s both;
        }

        .verification-header {
          animation: slideInUp 0.5s ease-out 0.2s both;
        }

        .verification-tabs {
          animation: slideInUp 0.5s ease-out 0.3s both;
        }

        .verification-filters {
          animation: slideInUp 0.5s ease-out 0.4s both;
        }

        .verification-content {
          animation: slideInUp 0.5s ease-out 0.5s both;
        }

        .verification-stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .verification-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .verification-request-card {
          transition: all 0.2s ease;
        }

        .verification-request-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="w-full space-y-4 verification-container">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 verification-stats">
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden verification-stat-card" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Verification requests - documents
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="relative p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{color: '#8B4513'}}>Total Requests</p>
                  <p className="text-2xl font-bold" style={{color: '#5D3A00'}}>{stats.total || 0}</p>
                </div>
                <Shield size={24} style={{color: '#D87C5A'}} />
              </div>
            </div>
          </div>
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden verification-stat-card" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Pending - clock/waiting
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="relative p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{color: '#8B4513'}}>Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
                </div>
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden verification-stat-card" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Verified - checkmark/verification badge
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="relative p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{color: '#8B4513'}}>Verified Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.verified || 0}</p>
                </div>
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden verification-stat-card" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Rejection rate - statistics/charts
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="relative p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{color: '#8B4513'}}>Rejection Rate</p>
                  <p className="text-2xl font-bold text-red-600">{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%</p>
                </div>
                <XCircle size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 verification-header">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
            <Shield size={24} />
            User Verification ({getFilteredRequests().length} requests)
          </h2>
          <CurrencySelector className="flex-shrink-0" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm verification-tabs">
          <div style={{borderBottom: '1px solid #FFE4D6'}}>
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? '#5D3A00' : 'transparent',
                    color: activeTab === tab.id ? '#5D3A00' : '#D87C5A'
                  }}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id ? 'text-white' : 'bg-gray-100 text-gray-600'
                  }`} style={{backgroundColor: activeTab === tab.id ? '#D87C5A' : undefined}}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-transparent rounded-lg py-1 px-4 verification-filters">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#8B4513'}} />
              <input
                type="text"
                placeholder="Search verification requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)', focusRingColor: '#D87C5A'}}
              />
            </div>
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)', focusRingColor: '#D87C5A'}}
            >
              <option value="all">All User Types</option>
              <option value="artist">Artists</option>
              <option value="shop">Shop Owners</option>
            </select>
          </div>
        </div>

        {/* Verification Requests */}
        <div className="space-y-4 verification-content">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm border" style={{borderColor: '#FFE4D6'}}>
              <Shield size={48} className="mx-auto mb-4 opacity-50" style={{color: '#D87C5A'}} />
              <p className="text-lg font-medium mb-2" style={{color: '#5D3A00'}}>Loading verification requests...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm border" style={{borderColor: '#FFE4D6'}}>
              <Shield size={48} className="mx-auto mb-4 opacity-50" style={{color: '#D87C5A'}} />
              <p className="text-lg font-medium mb-2" style={{color: '#5D3A00'}}>{error}</p>
              <p className="text-sm" style={{color: '#8B4513'}}>Try again later</p>
            </div>
          ) : getFilteredRequests().length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm border" style={{borderColor: '#FFE4D6'}}>
              <Shield size={48} className="mx-auto mb-4 opacity-50" style={{color: '#D87C5A'}} />
              <p className="text-lg font-medium mb-2" style={{color: '#5D3A00'}}>No verification requests found</p>
              <p className="text-sm" style={{color: '#8B4513'}}>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getFilteredRequests().map((request) => (
                <div key={request.id}>
                  {request.userType === 'artist' ? (
                    <ArtistVerificationCard request={request} />
                  ) : (
                    <ShopVerificationCard request={request} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserVerification;

