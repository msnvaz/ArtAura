import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Edit3,
  Trash2,
  Badge,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../components/common/Navbar";
import CartSidebar from "../components/cart/CartSidebar";
import EditPostModal from "../components/posts/EditPostModal";

const MyPosts = () => {
  const { token, role, userId } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Mock data for development
  const mockPosts = [
    {
      post_id: 1,
      title: "Digital Art Showcase 2024",
      description:
        "🎨 Join us for an exciting digital art exhibition featuring contemporary artists exploring the intersection of technology and creativity. This showcase will feature interactive installations, digital paintings, and multimedia artworks that push the boundaries of traditional art forms.",
      location: "Colombo Art Gallery, Colombo",
      startDate: "2024-02-15",
      endDate: "2024-02-25",
      startTime: "10:00",
      endTime: "18:00",
      organizer: "Digital Arts Collective",
      category: "Digital Art",
      entryFee: "Free",
      created_at: "2024-01-15T10:30:00Z",
      likes: 25,
      comments: 8,
      views: 156,
      verification_status: "verified",
      artist: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      },
    },
    {
      post_id: 2,
      title: "Contemporary Sculpture Exhibition",
      description:
        "🖼️ An exhibition featuring modern sculptural works that explore themes of identity, nature, and urban life. Artists will showcase pieces made from various materials including metal, stone, and recycled materials.",
      location: "National Museum, Kandy",
      startDate: "2024-03-01",
      endDate: "2024-03-15",
      startTime: "09:00",
      endTime: "17:00",
      organizer: "Sculpture Society of Sri Lanka",
      category: "Sculpture",
      entryFee: "LKR 500",
      created_at: "2024-01-12T15:45:00Z",
      likes: 18,
      comments: 5,
      views: 89,
      verification_status: "pending",
      artist: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      },
    },
    {
      post_id: 3,
      title: "Photography Workshop & Exhibition",
      description:
        "🎉 A unique combination of learning and showcasing! Join our photography workshop followed by an exhibition of participants' best works. Perfect for both beginners and experienced photographers.",
      location: "Cultural Center, Galle",
      startDate: "2024-02-20",
      endDate: "2024-02-22",
      startTime: "08:00",
      endTime: "20:00",
      organizer: "Galle Photography Club",
      category: "Photography",
      entryFee: "LKR 2000 (Workshop + Exhibition)",
      created_at: "2024-01-10T08:20:00Z",
      likes: 42,
      comments: 12,
      views: 234,
      verification_status: "rejected",
      artist: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      },
    },
    {
      post_id: 4,
      title: "Abstract Expressionism Showcase",
      description:
        "🌟 Dive into the world of abstract expressionism with this curated exhibition featuring local and international artists. Experience bold colors, dynamic forms, and emotional depth in contemporary abstract art.",
      location: "Modern Art Gallery, Negombo",
      startDate: "2024-04-05",
      endDate: "2024-04-20",
      startTime: "10:00",
      endTime: "19:00",
      organizer: "Modern Artists Association",
      category: "Abstract Art",
      entryFee: "LKR 300",
      created_at: "2024-01-08T14:15:00Z",
      likes: 31,
      comments: 7,
      views: 145,
      verification_status: "verified",
      artist: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      },
    },
    {
      post_id: 5,
      title: "Mixed Media Art Fair",
      description:
        "🎭 Explore the boundaries of artistic expression through mixed media artworks. This exhibition features innovative pieces combining traditional and contemporary techniques, materials, and concepts.",
      location: "Art District, Jaffna",
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      startTime: "09:30",
      endTime: "18:30",
      organizer: "Northern Arts Council",
      category: "Mixed Media",
      entryFee: "Free",
      created_at: "2024-01-05T09:30:00Z",
      likes: 15,
      comments: 3,
      views: 67,
      verification_status: "pending",
      artist: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      },
    },
    {
      post_id: 6,
      title: "Art Education Summit & Exhibition",
      description:
        "✨ A comprehensive event combining educational workshops, panel discussions, and an exhibition featuring works by art educators and students. Perfect for anyone interested in art education and community building.",
      location: "University of Arts, Colombo",
      startDate: "2024-05-15",
      endDate: "2024-05-17",
      startTime: "08:00",
      endTime: "20:00",
      organizer: "Art Education Foundation",
      category: "Contemporary Art",
      entryFee: "LKR 1500 (Full Event Access)",
      created_at: "2024-01-03T16:20:00Z",
      likes: 58,
      comments: 23,
      views: 312,
      verification_status: "verified",
      artist: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      },
    },
  ];

  // Fetch user's posts - COMMENTED OUT FOR MOCK DATA
  useEffect(() => {
    const fetchPosts = async () => {
      // Comment out authentication check for now
      // if (!role || !userId || !token) {
      //   console.warn("Missing authentication data. Redirecting to login.");
      //   navigate("/login");
      //   return;
      // }

      try {
        // Comment out actual API call
        // const API_URL = import.meta.env.VITE_API_URL;
        // const response = await axios.get(
        //   `${API_URL}/api/posts/${role}/${userId}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // setPosts(response.data);

        // Use mock data instead
        setTimeout(() => {
          setPosts(mockPosts);
          setLoading(false);
        }, 1000); // Simulate loading time
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Set mock data for development
        setPosts(mockPosts);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [role, userId, token, navigate, mockPosts]);

  // Filter posts based on search term and status
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.verification_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get verification status info
  const getVerificationStatus = (status) => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle,
          text: "Verified",
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-200",
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: AlertTriangle,
          text: "Unknown",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  // Handle post actions
  const handleEdit = (postId) => {
    const post = posts.find((p) => p.post_id === postId);
    if (post?.verification_status !== "pending") {
      alert("You can only edit posts that are pending review.");
      setShowDropdown(null);
      return;
    }

    console.log("Edit post:", postId);
    setShowDropdown(null);
    // Navigate to edit page or open edit modal
    // You can navigate to an edit form or open a modal here
    // navigate(`/edit-post/${postId}`);
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleDelete = async (postId) => {
    const post = posts.find((p) => p.post_id === postId);
    if (post?.verification_status !== "pending") {
      alert("You can only delete posts that are pending review.");
      setShowDropdown(null);
      return;
    }

    if (window.confirm("Are you sure you want to delete this pending post?")) {
      try {
        // Comment out actual API call
        // const API_URL = import.meta.env.VITE_API_URL;
        // await axios.delete(`${API_URL}/api/posts/${postId}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        // Use mock deletion instead
        setPosts(posts.filter((post) => post.post_id !== postId));
        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
    setShowDropdown(null);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
  };

  const handleSavePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_id === updatedPost.post_id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf9f4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f5539] mx-auto mb-4"></div>
          <p className="text-[#7f5539]">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      {/* Navbar */}
      <Navbar />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Main Content */}
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">My Posts</h1>
            <p className="text-[#7f5539]/70">
              Manage and track your published exhibition announcements
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7f5539]/60 mb-1">Total Posts</p>
                  <p className="text-3xl font-bold text-[#7f5539]">
                    {posts.length}
                  </p>
                </div>
                <div className="p-3 bg-[#7f5539]/10 rounded-full">
                  <Badge className="w-8 h-8 text-[#7f5539]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7f5539]/60 mb-1">Verified</p>
                  <p className="text-3xl font-bold text-green-600">
                    {
                      posts.filter((p) => p.verification_status === "verified")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7f5539]/60 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {
                      posts.filter((p) => p.verification_status === "pending")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7f5539]/60 mb-1">
                    Total Engagement
                  </p>
                  <p className="text-3xl font-bold text-[#7f5539]">
                    {posts.reduce(
                      (sum, post) =>
                        sum +
                        (post.likes || 0) +
                        (post.comments || 0) +
                        (post.views || 0),
                      0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] placeholder-[#7f5539]/60 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-[#7f5539]/60" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20">
              <div className="p-3 bg-[#7f5539]/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Badge className="w-10 h-10 text-[#7f5539]/60" />
              </div>
              <h3 className="text-2xl font-semibold text-[#7f5539] mb-3">
                No posts found
              </h3>
              <p className="text-[#7f5539]/60 mb-8 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria to find your posts"
                  : "You haven't created any exhibition posts yet. Start by creating your first post in the community section."}
              </p>
              <button
                onClick={() => navigate("/community")}
                className="bg-[#7f5539] text-white px-8 py-3 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Post</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const verificationInfo = getVerificationStatus(
                  post.verification_status
                );
                const StatusIcon = verificationInfo.icon;

                return (
                  <div
                    key={post.post_id}
                    className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${verificationInfo.bgColor} ${verificationInfo.borderColor} border`}
                        >
                          <StatusIcon
                            className={`w-4 h-4 ${verificationInfo.color}`}
                          />
                          <span
                            className={`text-xs font-medium ${verificationInfo.color}`}
                          >
                            {verificationInfo.text}
                          </span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowDropdown(
                                showDropdown === post.post_id
                                  ? null
                                  : post.post_id
                              )
                            }
                            className="text-[#7f5539]/60 hover:text-[#7f5539] p-1 rounded-full hover:bg-[#fdf9f4] transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {showDropdown === post.post_id && (
                            <div className="absolute right-0 top-8 bg-white border border-[#7f5539]/20 rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                              {post.verification_status === "pending" ? (
                                <>
                                  <button
                                    onClick={() => handleEdit(post.post_id)}
                                    className="w-full text-left px-4 py-2 text-sm text-[#7f5539] hover:bg-[#fdf9f4] transition-colors flex items-center space-x-2"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(post.post_id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </>
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                  <p className="font-medium mb-1">
                                    No actions available
                                  </p>
                                  <p className="text-xs">
                                    {post.verification_status === "verified"
                                      ? "Verified posts cannot be modified"
                                      : "Rejected posts cannot be modified"}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Post Title */}
                      <h3 className="text-xl font-bold text-[#7f5539] mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Post Description */}
                      <p className="text-[#7f5539]/80 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {post.description}
                      </p>

                      {/* Exhibition Details */}
                      <div className="space-y-3 mb-6">
                        {/* Location */}
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-[#7f5539]/10 rounded">
                            <span className="text-xs font-medium text-[#7f5539]">
                              📍
                            </span>
                          </div>
                          <span className="text-sm text-[#7f5539]/70 font-medium">
                            {post.location}
                          </span>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-[#7f5539]/10 rounded">
                            <Calendar className="w-3 h-3 text-[#7f5539]" />
                          </div>
                          <span className="text-sm text-[#7f5539]/70 font-medium">
                            {post.startDate} - {post.endDate}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-[#7f5539]/10 rounded">
                            <span className="text-xs font-medium text-[#7f5539]">
                              🎨
                            </span>
                          </div>
                          <span className="text-sm text-[#7f5539]/70 font-medium">
                            {post.category}
                          </span>
                        </div>

                        {/* Entry Fee */}
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-[#7f5539]/10 rounded">
                            <span className="text-xs font-medium text-[#7f5539]">
                              💰
                            </span>
                          </div>
                          <span className="text-sm text-[#7f5539]/70 font-medium">
                            {post.entryFee}
                          </span>
                        </div>
                      </div>

                      {/* Posted Date */}
                      <div className="flex items-center space-x-2 mb-4 p-3 bg-[#fdf9f4]/50 rounded-lg">
                        <Clock className="w-4 h-4 text-[#7f5539]/60" />
                        <span className="text-sm text-[#7f5539]/60">
                          Posted {formatDate(post.created_at)}
                        </span>
                      </div>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#fdf9f4]/50">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-[#7f5539]/60 font-medium">
                              {post.likes || 0}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-[#7f5539]/60 font-medium">
                              {post.comments || 0}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-[#7f5539]/60 font-medium">
                              {post.views || 0}
                            </span>
                          </div>
                        </div>
                        <button className="text-[#7f5539]/60 hover:text-[#7f5539] p-2 rounded-full hover:bg-[#fdf9f4] transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          isOpen={showEditModal}
          post={editingPost}
          onClose={handleCloseModal}
          onSave={handleSavePost}
        />
      )}
    </div>
  );
};

export default MyPosts;
