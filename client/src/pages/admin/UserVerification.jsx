import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Download,
  Upload,
  User,
  Store,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

const UserVerification = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample verification requests data
  const verificationRequests = [
    {
      id: 'VER-001',
      userType: 'artist',
      user: {
        name: 'Nimali Fernando',
        email: 'nimali.fernando@yahoo.com',
        userId: 'ART-1234',
        registrationDate: '2024-12-15',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=150&h=150&fit=crop&crop=face'
      },
      documents: [
        {
          type: 'government_id',
          name: 'National ID Card',
          filename: 'nimali_national_id.pdf',
          uploadDate: '2024-12-15',
          status: 'uploaded'
        },
        {
          type: 'portfolio',
          name: 'Portfolio Samples',
          filename: 'nimali_portfolio.zip',
          uploadDate: '2024-12-15',
          status: 'uploaded'
        },
        {
          type: 'artist_statement',
          name: 'Artist Statement',
          filename: 'nimali_statement.pdf',
          uploadDate: '2024-12-15',
          status: 'uploaded'
        }
      ],
      status: 'pending',
      submissionDate: '2024-12-15',
      priority: 'medium',
      notes: 'Complete application with all required documents.'
    },
    {
      id: 'VER-002',
      userType: 'shop',
      user: {
        name: 'Ceylon Art Supplies',
        email: 'contact@ceylonartshop.lk',
        userId: 'SHP-5678',
        registrationDate: '2024-12-14',
        ownerName: 'Dinesh Wickramasinghe',
        businessType: 'Art Supply Store'
      },
      documents: [
        {
          type: 'business_license',
          name: 'Business License',
          filename: 'business_license.pdf',
          uploadDate: '2024-12-14',
          status: 'uploaded'
        },
        {
          type: 'tax_certificate',
          name: 'Tax Registration',
          filename: 'tax_registration.pdf',
          uploadDate: '2024-12-14',
          status: 'uploaded'
        },
        {
          type: 'owner_id',
          name: 'Owner ID Proof',
          filename: 'owner_id.pdf',
          uploadDate: '2024-12-14',
          status: 'uploaded'
        }
      ],
      status: 'under_review',
      submissionDate: '2024-12-14',
      priority: 'high',
      notes: 'Established business with good documentation.',
      reviewedBy: 'ADM-001'
    },
    {
      id: 'VER-003',
      userType: 'artist',
      user: {
        name: 'Kavinda Perera',
        email: 'kavinda.perera@gmail.com',
        userId: 'ART-2345',
        registrationDate: '2024-12-13',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      documents: [
        {
          type: 'government_id',
          name: 'Driver License',
          filename: 'kavinda_license.pdf',
          uploadDate: '2024-12-13',
          status: 'uploaded'
        },
        {
          type: 'portfolio',
          name: 'Digital Art Portfolio',
          filename: 'kavinda_portfolio.zip',
          uploadDate: '2024-12-13',
          status: 'uploaded'
        }
      ],
      status: 'verified',
      submissionDate: '2024-12-13',
      verificationDate: '2024-12-14',
      priority: 'low',
      notes: 'Verification completed successfully.',
      verifiedBy: 'ADM-002'
    },
    {
      id: 'VER-004',
      userType: 'artist',
      user: {
        name: 'Sachini Rathnayake',
        email: 'sachini.rathnayake@gmail.com',
        userId: 'ART-3456',
        registrationDate: '2024-12-12'
      },
      documents: [
        {
          type: 'government_id',
          name: 'Passport',
          filename: 'sachini_passport.pdf',
          uploadDate: '2024-12-12',
          status: 'uploaded'
        }
      ],
      status: 'rejected',
      submissionDate: '2024-12-12',
      rejectionDate: '2024-12-13',
      priority: 'low',
      notes: 'Incomplete documentation. Missing portfolio and artist statement.',
      rejectedBy: 'ADM-001',
      rejectionReason: 'Incomplete application - missing required portfolio samples and artist statement.'
    }
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: verificationRequests.filter(r => r.status === 'pending').length },
    { id: 'under_review', label: 'Under Review', count: verificationRequests.filter(r => r.status === 'under_review').length },
    { id: 'verified', label: 'Verified', count: verificationRequests.filter(r => r.status === 'verified').length },
    { id: 'rejected', label: 'Rejected', count: verificationRequests.filter(r => r.status === 'rejected').length },
    { id: 'all', label: 'All Requests', count: verificationRequests.length }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const getFilteredRequests = () => {
    let filtered = verificationRequests;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(request => request.status === activeTab);
    }

    // Filter by user type
    if (selectedUserType !== 'all') {
      filtered = filtered.filter(request => request.userType === selectedUserType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleVerificationAction = (requestId, action) => {
    console.log(`${action} verification for request ${requestId}`);
    // Implement verification logic here
  };

  const handleDocumentView = (filename) => {
    console.log(`Viewing document: ${filename}`);
    // Implement document viewing logic here
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
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
                <p className="text-2xl font-bold" style={{color: '#5D3A00'}}>{verificationRequests.length}</p>
              </div>
              <Shield size={24} style={{color: '#D87C5A'}} />
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
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
                <p className="text-2xl font-bold text-yellow-600">{verificationRequests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
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
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
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
                <p className="text-2xl font-bold text-red-600">12%</p>
              </div>
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Verification Management Heading */}
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-2" style={{color: '#5D3A00'}}>
        <Shield size={24} />
        User Verification Management ({verificationRequests.filter(req => req.status === activeTab).length} {activeTab} requests)
      </h2>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
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
                  activeTab === tab.id ? 'bg-brown-100 text-brown-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-transparent rounded-lg py-1 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#8B4513'}} />
            <input
              type="text"
              placeholder="Search verification requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
            />
          </div>
          <select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            className="px-3 py-2 border rounded-md"
            style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
          >
            <option value="all">All User Types</option>
            <option value="artist">Artists</option>
            <option value="shop">Shop Owners</option>
          </select>
        </div>
      </div>

      {/* Verification Requests */}
      <div className="space-y-4">
        {getFilteredRequests().map((request) => (
          <div key={request.id} className="bg-white rounded-lg p-6 shadow-sm border" style={{borderColor: '#FFE4D6'}}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
                      {request.user.profileImage ? (
                        <img src={request.user.profileImage} alt={request.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {request.userType === 'artist' ? <User size={24} style={{color: '#D87C5A'}} /> : <Store size={24} style={{color: '#D87C5A'}} />}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>{request.user.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.userType === 'artist' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {request.userType === 'artist' ? 'Artist' : 'Shop Owner'}
                        </span>
                      </div>
                      <p className="text-sm" style={{color: '#8B4513'}}>{request.user.email}</p>
                      <p className="text-xs" style={{color: '#8B4513'}}>ID: {request.user.userId}</p>
                      {request.user.ownerName && (
                        <p className="text-xs" style={{color: '#8B4513'}}>Owner: {request.user.ownerName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[request.priority]}`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
                      {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Submitted Documents:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {request.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md" style={{borderColor: '#FFE4D6', backgroundColor: '#FFF5E1'}}>
                        <div className="flex items-center gap-2">
                          <FileText size={16} style={{color: '#D87C5A'}} />
                          <div>
                            <p className="text-xs font-medium" style={{color: '#5D3A00'}}>{doc.name}</p>
                            <p className="text-xs" style={{color: '#8B4513'}}>{doc.uploadDate}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDocumentView(doc.filename)}
                          className="p-1 rounded-md text-white"
                          style={{backgroundColor: '#D87C5A'}}
                          title="View Document"
                        >
                          <Eye size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Notes:</h4>
                  <p className="text-sm p-3 rounded-md" style={{backgroundColor: '#FFF5E1', color: '#8B4513'}}>
                    {request.notes}
                  </p>
                  {request.rejectionReason && (
                    <div className="mt-2 p-3 rounded-md bg-red-50">
                      <h5 className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</h5>
                      <p className="text-sm text-red-700">{request.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Verification Details */}
                <div className="flex flex-wrap gap-4 text-xs" style={{color: '#8B4513'}}>
                  <span>Submitted: {request.submissionDate}</span>
                  {request.verificationDate && <span>Verified: {request.verificationDate}</span>}
                  {request.rejectionDate && <span>Rejected: {request.rejectionDate}</span>}
                  {request.reviewedBy && <span>Reviewed by: {request.reviewedBy}</span>}
                  {request.verifiedBy && <span>Verified by: {request.verifiedBy}</span>}
                  {request.rejectedBy && <span>Rejected by: {request.rejectedBy}</span>}
                </div>
              </div>

              {/* Actions */}
              {(request.status === 'pending' || request.status === 'under_review') && (
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <button
                    onClick={() => handleVerificationAction(request.id, 'view')}
                    className="px-4 py-2 rounded-md flex items-center gap-2 text-white"
                    style={{backgroundColor: '#5D3A00'}}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button
                    onClick={() => handleVerificationAction(request.id, 'approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerificationAction(request.id, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2 hover:bg-red-700"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerificationAction(request.id, 'request_more')}
                    className="px-4 py-2 rounded-md flex items-center gap-2 text-white"
                    style={{backgroundColor: '#D87C5A'}}
                  >
                    <Upload size={16} />
                    Request More Info
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserVerification;
