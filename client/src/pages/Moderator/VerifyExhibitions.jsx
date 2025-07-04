import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  MapPin, 
  User, 
  DollarSign, 
  Clock,
  Image,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';

const ExhibitionModeratorSystem = () => {
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
                         post.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
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
    <div className="min-h-screen bg-[#fdf9f4]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-amber-900">Exhibition Moderator</h1>
              <div className="relative">
                <Bell className="w-6 h-6 text-amber-700" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="Search exhibitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'pending', label: 'Pending Review', count: pendingCount },
              { id: 'approved', label: 'Approved', count: exhibitionPosts.filter(p => p.status === 'approved').length },
              { id: 'rejected', label: 'Rejected', count: exhibitionPosts.filter(p => p.status === 'rejected').length },
              { id: 'all', label: 'All', count: exhibitionPosts.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-900'
                    : 'border-transparent text-amber-400 hover:text-amber-700'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-amber-100 text-amber-900' : 'bg-amber-50 text-amber-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!selectedPost ? (
          <div className="grid gap-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-amber-900">{post.title}</h3>
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
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <User className="w-4 h-4" />
                          <span>{post.createdBy} ({post.userHandle})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <DollarSign className="w-4 h-4" />
                          <span>{post.feePaid}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <MapPin className="w-4 h-4" />
                          <span>{post.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(post.startDate, post.startTime)}</span>
                        </div>
                      </div>

                      <p className="text-amber-900 mb-4 line-clamp-2">{post.description}</p>

                      {post.images && post.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {post.images.slice(0, 3).map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Exhibition ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition-all transform hover:scale-105"
                                onClick={() => openImageModal(image, index)}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <ZoomIn className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          ))}
                          {post.images.length > 3 && (
                            <div 
                              className="w-20 h-20 bg-amber-50 rounded-lg border flex items-center justify-center text-xs text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors"
                              onClick={() => openImageModal(post.images[3], 3)}
                            >
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

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                      
                      {post.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(post.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(post.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
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
              <div className="text-center py-12 text-amber-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-200" />
                <p>No exhibitions found matching your criteria.</p>
              </div>
            )}
          </div>
        ) : (
          // Detailed View
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to list
                </button>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPost.status)}`}>
                  {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900 mb-4">{selectedPost.title}</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-amber-700">
                      <User className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="font-medium text-amber-900">{selectedPost.createdBy}</p>
                        <p className="text-sm text-amber-700">{selectedPost.userHandle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-amber-700">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <span>{selectedPost.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-amber-700">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <div>
                        <p>Start: {formatDateTime(selectedPost.startDate, selectedPost.startTime)}</p>
                        <p>End: {formatDateTime(selectedPost.endDate, selectedPost.endTime)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-amber-700">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <span>Fee Paid: {selectedPost.feePaid}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-amber-900">Description</h3>
                    <p className="text-amber-900 leading-relaxed">{selectedPost.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Category</h4>
                      <p className="text-amber-700">{selectedPost.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Expected Visitors</h4>
                      <p className="text-amber-700">{selectedPost.expectedVisitors}</p>
                    </div>
                  </div>

                  {selectedPost.status === 'rejected' && selectedPost.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                      <p className="text-red-700">{selectedPost.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-amber-900">Exhibition Images</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedPost.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Exhibition ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-all transform hover:scale-[1.02]"
                          onClick={() => openImageModal(image, index)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedPost.status === 'pending' && (
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                  <button
                    onClick={() => openRejectModal(selectedPost.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Reject Exhibition
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPost.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Approve Exhibition
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-3 z-10 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation buttons */}
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
                </>
              );
            })()}
            
            {/* Image */}
            <img
              src={selectedImage}
              alt="Exhibition"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image counter */}
            {(() => {
              const currentPost = selectedPost || exhibitionPosts.find(p => p.images?.includes(selectedImage));
              return currentPost && currentPost.images && currentPost.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {currentPost.images.length}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Reject Exhibition</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-amber-800 mb-2">
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
                    <span className="text-sm text-amber-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {rejectionReason === 'Custom reason' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Custom reason:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your custom rejection reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-amber-900"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
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
  );
};

export default ExhibitionModeratorSystem;