import React, { useState } from 'react';
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  MapPin,
  Search,
  User,
  X,
  ZoomIn,
  Shield,
  Filter,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerifyExhibition = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingPostId, setRejectingPostId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

// Mock data for exhibition posts
const [exhibitionPosts, setExhibitionPosts] = useState([
  {
    id: 1,
    title: "Modern Art Showcase 2024",
    description: "A contemporary art exhibition featuring local artists exploring themes of urban life and digital culture. This immersive experience will showcase cutting-edge installations, interactive digital art pieces, and thought-provoking sculptures that challenge traditional artistic boundaries.",
    location: "Downtown Gallery, Main Street",
    startDate: "2024-08-15",
    startTime: "10:00",
    endDate: "2024-08-20",
    endTime: "18:00",
    createdBy: "Sarah Johnson",
    userHandle: "@artgallery_dt",
    status: "pending",
    feePaid: "$150",
    submittedAt: "2024-07-10T14:30:00Z",
    images: [
      "https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    ],
    category: "Contemporary Art",
    expectedVisitors: 200,
    notificationCount: 1
  },
  {
    id: 2,
    title: "Vintage Photography Collection",
    description: "A curated collection of vintage photographs from the 1950s-1980s showcasing urban development and social change. This exhibition features rare prints from renowned photographers documenting the transformation of metropolitan areas.",
    location: "Heritage Museum, Cultural District",
    startDate: "2024-09-01",
    startTime: "09:00",
    endDate: "2024-09-15",
    endTime: "17:00",
    createdBy: "Michael Chen",
    userHandle: "@vintage_lens",
    status: "pending",
    feePaid: "$200",
    submittedAt: "2024-07-12T16:45:00Z",
    images: [
      "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    ],
    category: "Photography",
    expectedVisitors: 150,
    notificationCount: 1
  },
  {
    id: 3,
    title: "Sculpture Garden Opening",
    description: "Grand opening of our new outdoor sculpture garden featuring works by international artists. This permanent installation will showcase large-scale sculptures in a beautifully landscaped environment, creating a unique dialogue between art and nature.",
    location: "City Park, Sculpture Avenue",
    startDate: "2024-07-25",
    startTime: "11:00",
    endDate: "2024-07-25",
    endTime: "16:00",
    createdBy: "Emma Rodriguez",
    userHandle: "@citypark_art",
    status: "approved",
    feePaid: "$100",
    submittedAt: "2024-07-01T09:15:00Z",
    images: [
      "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    ],
    category: "Sculpture",
    expectedVisitors: 300,
    notificationCount: 0
  },
  {
    id: 4,
    title: "Digital Art Festival",
    description: "Interactive digital art installations and VR experiences that push the boundaries of technology and creativity. Visitors will experience immersive virtual reality environments, AI-generated art, and interactive installations that respond to movement and sound.",
    location: "Tech Hub, Innovation Center",
    startDate: "2024-08-10",
    startTime: "12:00",
    endDate: "2024-08-12",
    endTime: "20:00",
    createdBy: "Alex Kim",
    userHandle: "@digital_futures",
    status: "rejected",
    feePaid: "$175",
    submittedAt: "2024-07-05T11:20:00Z",
    images: [
      "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    ],
    category: "Digital Art",
    expectedVisitors: 500,
    notificationCount: 0,
    rejectionReason: "Insufficient venue safety documentation"
  }
]);

const pendingCount = exhibitionPosts.filter(post => post.status === 'pending').length;
const totalNotifications = exhibitionPosts.reduce((sum, post) => sum + post.notificationCount, 0);

// Predefined rejection reasons
const rejectionReasons = [
  'Inappropriate content',
  'Missing required information',
  'Insufficient venue safety documentation',
  'Fee payment not verified',
  'Conflicting dates/times',
  'Venue not approved',
  'Content violates community guidelines',
  'Copyright infringement concerns',
  'Incomplete exhibition details',
  'Custom reason'
];

const filteredPosts = exhibitionPosts.filter(post => {
  const matchesTab = activeTab === 'all' || post.status === activeTab;
  const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.location.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
  return matchesTab && matchesSearch && matchesFilter;
});

const handleApprove = (postId) => {
  setExhibitionPosts(posts => 
    posts.map(post => 
      post.id === postId 
        ? { ...post, status: 'approved', notificationCount: 0 }
        : post
    )
  );
  setSelectedPost(null);
};

const handleReject = (postId, reason) => {
  setExhibitionPosts(posts => 
    posts.map(post => 
      post.id === postId 
        ? { ...post, status: 'rejected', notificationCount: 0, rejectionReason: reason }
        : post
    )
  );
  setSelectedPost(null);
  setShowRejectModal(false);
  setRejectionReason('');
  setCustomReason('');
  setRejectingPostId(null);
};

const openRejectModal = (postId) => {
  setRejectingPostId(postId);
  setShowRejectModal(true);
};

const handleRejectSubmit = () => {
  if (!rejectionReason && !customReason) {
    alert('Please select or enter a rejection reason');
    return;
  }
  
  const finalReason = rejectionReason === 'Custom reason' ? customReason : rejectionReason;
  handleReject(rejectingPostId, finalReason);
};

const closeRejectModal = () => {
  setShowRejectModal(false);
  setRejectionReason('');
  setCustomReason('');
  setRejectingPostId(null);
};

const openImageModal = (image, index = 0) => {
  setSelectedImage(image);
  setCurrentImageIndex(index);
  setShowImageModal(true);
};

const closeImageModal = () => {
  setShowImageModal(false);
  setSelectedImage(null);
  setCurrentImageIndex(0);
};

const navigateImage = (direction) => {
  const currentPost = selectedPost || exhibitionPosts.find(p => p.images?.includes(selectedImage));
  if (!currentPost || !currentPost.images) return;
  
  const newIndex = direction === 'next' 
    ? (currentImageIndex + 1) % currentPost.images.length
    : (currentImageIndex - 1 + currentPost.images.length) % currentPost.images.length;
  
  setCurrentImageIndex(newIndex);
  setSelectedImage(currentPost.images[newIndex]);
};

  const formatDateTime = (date, time) => {
    return new Date(`${date}T${time}`).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

return (
  <>
    {/* Bootstrap CSS */}
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
      rel="stylesheet" 
    />
    
    <div className="min-h-screen" style={{backgroundColor: '#FFF5E1'}}>
      {/* Full Width Header */}
      <div 
        className="w-full shadow-sm p-6 mb-8 relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full" style={{backgroundColor: '#FFD95A'}}>
                <Shield size={32} style={{color: '#5D3A00'}} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Exhibition Verification</h1>
                <p className="text-gray-200">Review and approve exhibition submissions</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2 items-center">
              <div className="relative">
                <Bell className="w-6 h-6 text-white" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </div>
              <button
                className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                style={{
                  borderColor: '#FFE4D6',
                  color: '#FFE4D6',
                  backgroundColor: 'rgba(255, 228, 214, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#FFE4D6';
                  e.target.style.color = '#5D3A00';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 228, 214, 0.1)';
                  e.target.style.color = '#FFE4D6';
                }}
                onClick={() => navigate('/moderatordashboard')}
              >
                <Shield size={14} />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Search and Filter */}
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden mb-6" style={{backgroundColor: '#FFF5E1'}}>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{color: '#5D3A00'}} />
                  <input
                    type="text"
                    placeholder="Search exhibitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent w-full"
                    style={{borderColor: '#FFE4D6', backgroundColor: 'white', color: '#5D3A00'}}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} style={{color: '#5D3A00'}} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white', color: '#5D3A00'}}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div style={{borderBottom: '1px solid #FFE4D6'}}>
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', label: 'Pending', icon: Clock },
                { id: 'approved', label: 'Approved', icon: Check },
                { id: 'rejected', label: 'Rejected', icon: X }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? '#5D3A00' : 'transparent',
                    color: activeTab === tab.id ? '#5D3A00' : '#D87C5A'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = '#5D3A00';
                      e.target.style.borderBottomColor = '#FFD95A';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = '#D87C5A';
                      e.target.style.borderBottomColor = 'transparent';
                    }
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{
                    backgroundColor: activeTab === tab.id ? '#FFE4D6' : '#F3F4F6',
                    color: activeTab === tab.id ? '#5D3A00' : '#6B7280'
                  }}>
                    {exhibitionPosts.filter(post => post.status === tab.id).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {!selectedPost ? (
            <div className="grid gap-6">
              {filteredPosts.map(post => (
                <div key={post.id} className="rounded-lg shadow-sm border hover:shadow-md transition-shadow" style={{backgroundColor: '#FFF5E1'}}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>{post.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          {post.notificationCount > 0 && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">New</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                            <User className="w-4 h-4" />
                            <span>{post.createdBy} ({post.userHandle})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                            <DollarSign className="w-4 h-4" />
                            <span>{post.feePaid}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                            <MapPin className="w-4 h-4" />
                            <span>{post.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateTime(post.startDate, post.startTime)} - {formatDateTime(post.endDate, post.endTime)}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-4" style={{color: '#5D3A00'}}>
                          {post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}
                        </p>
                        
                        {post.images && post.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.images.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Exhibition ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openImageModal(image, index)}
                              />
                            ))}
                            {post.images.length > 3 && (
                              <div className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity" 
                                   style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                                   onClick={() => openImageModal(post.images[3], 3)}>
                                +{post.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}

                        {post.status === 'rejected' && post.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-700">
                              <strong>Rejection Reason:</strong> {post.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: '#FFE4D6',
                            color: '#5D3A00',
                            border: '1px solid #FFE4D6'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFD95A';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#FFE4D6';
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        
                        {post.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(post.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(post.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="text-center py-12" style={{color: '#D87C5A'}}>
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{color: '#FFD95A'}} />
                  <p>No exhibitions found matching your criteria.</p>
                </div>
              )}
            </div>
          ) : (
            // Detailed View
            <div className="rounded-lg shadow-sm border" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: '#FFE4D6',
                      color: '#5D3A00'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#FFD95A';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#FFE4D6';
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to List
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPost.status)}`}>
                      {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h1 className="text-2xl font-bold mb-4" style={{color: '#5D3A00'}}>{selectedPost.title}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                        <User className="w-4 h-4" />
                        <span>{selectedPost.createdBy} ({selectedPost.userHandle})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                        <DollarSign className="w-4 h-4" />
                        <span>{selectedPost.feePaid}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                        <MapPin className="w-4 h-4" />
                        <span>{selectedPost.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{color: '#D87C5A'}}>
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(selectedPost.startDate, selectedPost.startTime)} - {formatDateTime(selectedPost.endDate, selectedPost.endTime)}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2" style={{color: '#5D3A00'}}>Description</h3>
                      <p className="text-sm leading-relaxed" style={{color: '#5D3A00'}}>
                        {selectedPost.description}
                      </p>
                    </div>

                    {selectedPost.images && selectedPost.images.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4" style={{color: '#5D3A00'}}>Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedPost.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Exhibition ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImageModal(image, index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPost.status === 'rejected' && selectedPost.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                        <p className="text-red-700">{selectedPost.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-1">
                    <div className="rounded-lg p-4 mb-6" style={{backgroundColor: '#FFE4D6'}}>
                      <h3 className="text-lg font-semibold mb-4" style={{color: '#5D3A00'}}>Exhibition Details</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium" style={{color: '#D87C5A'}}>Start Date & Time:</span>
                          <p className="text-sm" style={{color: '#5D3A00'}}>
                            {formatDateTime(selectedPost.startDate, selectedPost.startTime)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium" style={{color: '#D87C5A'}}>End Date & Time:</span>
                          <p className="text-sm" style={{color: '#5D3A00'}}>
                            {formatDateTime(selectedPost.endDate, selectedPost.endTime)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium" style={{color: '#D87C5A'}}>Category:</span>
                          <p className="text-sm" style={{color: '#5D3A00'}}>
                            {selectedPost.category}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium" style={{color: '#D87C5A'}}>Expected Visitors:</span>
                          <p className="text-sm" style={{color: '#5D3A00'}}>
                            {selectedPost.expectedVisitors}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium" style={{color: '#D87C5A'}}>Fee Paid:</span>
                          <p className="text-sm" style={{color: '#5D3A00'}}>
                            {selectedPost.feePaid}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedPost.status === 'pending' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleApprove(selectedPost.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Approve Exhibition
                        </button>
                        <button
                          onClick={() => openRejectModal(selectedPost.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Reject Exhibition
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-3 z-10 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img
              src={selectedImage}
              alt="Exhibition"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {(() => {
              const currentPost = selectedPost || exhibitionPosts.find(p => p.images?.includes(selectedImage));
              return currentPost && currentPost.images && currentPost.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-3 z-10 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-3 z-10 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {currentPost.images.length}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4" style={{color: '#5D3A00'}}>Reject Exhibition</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>
                Reason for rejection:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rejectionReasons.map((reason, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="rejectionReason"
                      value={reason}
                      checked={rejectionReason === reason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mr-2 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm" style={{color: '#5D3A00'}}>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {rejectionReason === 'Custom reason' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>
                  Custom reason:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your custom rejection reason..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none"
                  style={{borderColor: '#FFE4D6', color: '#5D3A00'}}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: '#FFE4D6',
                  color: '#5D3A00'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#FFD95A';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#FFE4D6';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Reject Exhibition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
);
};

export default VerifyExhibition;