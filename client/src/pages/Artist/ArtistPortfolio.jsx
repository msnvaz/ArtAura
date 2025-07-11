import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow,  isValid } from 'date-fns';
import ArtworkDetailModal from '../../components/artworks/ArtworkDetailModal';
import EditProfileModal from '../../components/artist/EditProfileModal';
import UploadPostModal from '../../components/artworks/UploadPostModal';
import PostUploadModal from '../../components/social/PostUploadModal';
import ChangeCoverModal from '../../components/profile/ChangeCoverModal';
import EditPostModel from '../../components/artist/EditPostModel';
import { useAuth } from "../../context/AuthContext"; 
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  Star,
  Trophy,
  Medal,
  Award,
  Upload,
  Save,
  X,
  Camera,
  Palette,
  Calendar,
  MapPin,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Share2,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target,
  Globe,
  ArrowLeft
} from 'lucide-react';

const ArtistPortfolio = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingArtwork, setIsAddingArtwork] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isChangingCover, setIsChangingCover] = useState(false);
  const [isViewingArtwork, setIsViewingArtwork] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const [editedProfile, setEditedProfile] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    twitter: '',
    phone: '',
    email: ''
  });
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    medium: '',
    size: '',
    year: '',
    price: '',
    description: '',
    category: '',
    tags: '',
    imageFiles: []
  });
  const [newPost, setNewPost] = useState({
    caption: '',
    imageFiles: [],
    // allowComments: true,
    // allowLikes: true,
    // allowSharing: true
  });

  const { token, role, userId} = useAuth();
  const [portfolioPosts, setPortfolioPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      if (!role || !userId || !token) {
        console.warn("Missing role, userId, or token. Skipping fetch.");
        return;
      }
  
      try {
        const response = await axios.get(
          `http://localhost:8080/api/posts/${role}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setPortfolioPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts();
  }, [role, userId, token]); // 👈 Add these so it re-runs when context loads
  
  
  // Mock artist data
  const artistProfile = {
    name: 'Sarah Martinez',
    bio: 'Contemporary artist specializing in abstract expressionism and digital art. My work explores the intersection of emotion and color, creating pieces that speak to the human experience.',
    location: 'New York, NY',
    joinDate: 'January 2023',
    website: 'www.sarahmartinez.art',
    instagram: '@sarahmartinez_art',
    twitter: '@sarah_art',
    phone: '+1 (555) 123-4567',
    email: 'sarah@sarahmartinez.art',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: {
      artworks: 24,
      sales: 18,
      followers: 342,
      views: 12847
    }
  };

  // Winner badges data
  const badges = [
    {
      id: 1,
      title: 'Abstract Emotions Challenge',
      type: 'winner',
      date: '2024-01-10',
      prize: '$600',
      icon: <Trophy className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      id: 2,
      title: 'Digital Dreams Exhibition',
      type: 'featured',
      date: '2023-12-15',
      prize: 'Featured Artist',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 3,
      title: 'Winter Landscapes',
      type: 'runner-up',
      date: '2023-11-20',
      prize: '2nd Place',
      icon: <Medal className="h-6 w-6" />,
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    {
      id: 4,
      title: 'Community Choice Award',
      type: 'special',
      date: '2023-10-05',
      prize: 'People\'s Choice',
      icon: <Award className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  // Initialize edited profile when component mounts or when editing starts
  React.useEffect(() => {
    if (isEditingProfile) {
      setEditedProfile({
        name: artistProfile.name,
        bio: artistProfile.bio,
        location: artistProfile.location,
        website: artistProfile.website,
        instagram: artistProfile.instagram,
        twitter: artistProfile.twitter,
        phone: artistProfile.phone,
        email: artistProfile.email
      });
    }
  }, [isEditingProfile]);

  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', editedProfile);
    setIsEditingProfile(false);
    // Show success notification
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset edited profile
    setEditedProfile({
      name: '',
      bio: '',
      location: '',
      website: '',
      instagram: '',
      twitter: '',
      phone: '',
      email: ''
    });
  };

  const handleArtworkChange = (field, value) => {
    setNewArtwork(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewArtwork(prev => ({
      ...prev,
      imageFiles: files
    }));
  };

  const handleSaveArtwork = () => {
    // Here you would typically save to backend
    console.log('Saving artwork:', newArtwork);
    setIsAddingArtwork(false);
    // Reset form
    setNewArtwork({
      title: '',
      medium: '',
      size: '',
      year: '',
      price: '',
      description: '',
      category: '',
      tags: '',
      imageFiles: []
    });
    // Show success notification
  };

  const handleCancelAddArtwork = () => {
    setIsAddingArtwork(false);
    // Reset form
    setNewArtwork({
      title: '',
      medium: '',
      size: '',
      year: '',
      price: '',
      description: '',
      category: '',
      tags: '',
      imageFiles: []
    });
  };

  // Post Upload Handlers
  const handlePostChange = (field, value) => {
    setNewPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePostImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewPost(prev => ({
      ...prev,
      imageFiles: files
    }));
  };

  const handleSavePost = async () => {
    const formData = new FormData();
    formData.append('caption', newPost.caption);
    formData.append('location', 'Colombo'); // optional: make dynamic
    formData.append('image', newPost.imageFiles[0]);

    // 👇 Check before making request
    if (!token || !role || !userId) {
      console.warn('Missing token, role, or userId. Aborting post creation.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/posts/create',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Post created:', response.data);

      // Reset post state
      setIsCreatingPost(false);
      setNewPost({
        caption: '',
        imageFiles: [],
      });

    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };


  const handleCancelPost = () => {
    setIsCreatingPost(false);
    // Reset form
    setNewPost({
      caption: '',
      imageFiles: [],
      // allowComments: true,
      // allowLikes: true,
      // allowSharing: true
    });
  };

  // Cover Change Handlers
  const handleSaveCover = (newCoverFile) => {
    // Here you would typically upload to backend and update the profile
    console.log('Saving new cover image:', newCoverFile);

    // For now, create a local URL to show the new image
    const newCoverUrl = URL.createObjectURL(newCoverFile);

    // Update the artist profile (in a real app, this would come from backend)
    // You might need to update a global state or refetch the profile

    setIsChangingCover(false);
    // Show success notification
    alert('Cover photo updated successfully!');
  };

  const handleCancelCoverChange = () => {
    setIsChangingCover(false);
  };

  const handleViewArtworkDetail = (artwork) => {
    setSelectedArtwork(artwork);
    setIsViewingArtwork(true);
  };

  const handleCloseArtworkView = () => {
    setIsViewingArtwork(false);
    setSelectedArtwork(null);
  };

  const handleEditArtwork = (artwork) => {
    console.log('Edit artwork:', artwork);
    // Here you would typically open an edit modal or navigate to edit page
    setIsViewingArtwork(false);
  };

  const handleDeleteArtwork = (artwork) => {
    console.log('Delete artwork:', artwork);
    // Here you would typically show a confirmation dialog and delete the artwork
    setIsViewingArtwork(false);
  };

  const handleToggleFeature = (artwork) => {
    console.log('Toggle feature for artwork:', artwork);
    // Here you would typically update the artwork's featured status
  };

  const handleMarkAsSold = (artwork) => {
    console.log('Mark as sold:', artwork);
    // Here you would typically update the artwork's status to 'Sold'
  };

  // Portfolio artworks
  const artworks = [
    {
      id: 1,
      title: 'Sunset Dreams',
      medium: 'Oil on Canvas',
      size: '24" x 36"',
      year: '2024',
      price: '$1,200',
      status: 'Available',
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 45,
      views: 234,
      featured: true
    },
    {
      id: 2,
      title: 'Urban Reflection',
      medium: 'Digital Art',
      size: 'Digital Print',
      year: '2024',
      price: '$450',
      status: 'Sold',
      image: 'https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 32,
      views: 189,
      featured: false
    },
    {
      id: 3,
      title: 'Abstract Flow',
      medium: 'Acrylic on Canvas',
      size: '18" x 24"',
      year: '2023',
      price: '$800',
      status: 'Available',
      image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 67,
      views: 345,
      featured: true
    },
    {
      id: 4,
      title: 'Mountain Serenity',
      medium: 'Watercolor',
      size: '16" x 20"',
      year: '2023',
      price: '$600',
      status: 'Available',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 28,
      views: 156,
      featured: false
    },
    {
      id: 5,
      title: 'Digital Dreams',
      medium: 'Digital Art',
      size: 'Digital Print',
      year: '2023',
      price: '$350',
      status: 'Available',
      image: 'https://images.pexels.com/photos/1546009/pexels-photo-1546009.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 41,
      views: 198,
      featured: false
    },
    {
      id: 6,
      title: 'Portrait Study',
      medium: 'Charcoal on Paper',
      size: '12" x 16"',
      year: '2023',
      price: '$400',
      status: 'Available',
      image: 'https://images.pexels.com/photos/1742370/pexels-photo-1742370.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 35,
      views: 167,
      featured: false
    }
  ];

  // Portfolio posts (Instagram-like posts)
  

  const exhibitions = [
    {
      id: 1,
      title: 'Modern Art Showcase',
      location: 'Downtown Gallery',
      date: '2024-02-15',
      status: 'Upcoming',
      artworks: 3
    },
    {
      id: 2,
      title: 'Digital Dreams Exhibition',
      location: 'Virtual Space',
      date: '2023-12-15',
      status: 'Completed',
      artworks: 2
    }
  ];

  const handleDeletePost = async (postId) => {
    try {
      // Get token (adjust based on your actual auth setup)
      const token = localStorage.getItem('token'); // or from useAuth()
  
      if (!token) {
        alert("You must be logged in to delete posts.");
        return;
      }
  
      // Call backend delete API with Authorization header
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update UI after successful deletion
      setPortfolioPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
      
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Try again.");
    }
  };

  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditPost = (post) => {
    setEditingItem(post);
    setShowEditModal(true);
  };
  
  const handleEditSavePost = (updatedPost) => {
    const updatedList = portfolioPosts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    setPortfolioPosts(updatedList);
    setShowEditModal(false);
  };

  const safeFormatDistanceToNow = (date) => {
    const d = new Date(date);
    if (!isValid(d)) return "Invalid date";
    return formatDistanceToNow(d, { addSuffix: true });
  };
  
   

  return (
    <div className="min-h-screen bg-[#fdf9f4] py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <img
            src={artistProfile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{artistProfile.name}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{artistProfile.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {artistProfile.joinDate}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsChangingCover(true)}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Camera className="h-4 w-4 inline mr-2" />
            Change Cover
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            {/* Avatar */}
            <div className="relative mb-4 md:mb-0">
              <img
                src={artistProfile.avatar}
                alt={artistProfile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                onClick={() => setIsEditingProfile(true)}
                className="absolute bottom-0 right-0 bg-[#7f5539] text-[#fdf9f4] p-2 rounded-full hover:bg-[#6e4c34] transition-colors"
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#7f5539] mb-2">{artistProfile.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.artworks}</div>
                      <div className="text-sm text-[#7f5539]/60">Artworks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.sales}</div>
                      <div className="text-sm text-[#7f5539]/60">Sales</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.followers}</div>
                      <div className="text-sm text-[#7f5539]/60">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.views}</div>
                      <div className="text-sm text-[#7f5539]/60">Views</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="mt-4 md:mt-0 bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <p className="text-[#7f5539]/70 leading-relaxed">{artistProfile.bio}</p>
              </div>

              {/* Winner Badges */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#7f5539] mb-3 flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Achievements & Awards</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-lg border-2 ${badge.color} hover:scale-105 transition-transform cursor-pointer`}

                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {badge.icon}
                        <span className="font-medium text-sm">{badge.type.charAt(0).toUpperCase() + badge.type.slice(1)}</span>
                      </div>
                      <div className="text-xs font-medium mb-1">{badge.title}</div>
                      <div className="text-xs opacity-75">{badge.prize}</div>
                      <div className="text-xs opacity-60 mt-1">{badge.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-[#fdf9f4]/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'portfolio', label: 'Portfolio', count: portfolioPosts.length },
                { id: 'tosell', label: 'To sell', count: artworks.length },
                { id: 'exhibitions', label: 'Exhibitions', count: exhibitions.length },
                { id: 'achievements', label: 'Achievements', count: badges.length },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-[#7f5539] text-[#7f5539]'
                    : 'border-transparent text-[#7f5539]/60 hover:text-[#7f5539] hover:border-[#7f5539]/30'
                    }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 bg-[#7f5539]/10 text-[#7f5539] px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Portfolio Tab - Instagram Feed */}
        {activeTab === 'portfolio' && (
          <div className="space-y-0">
            {/* Instagram-style Feed with Sidebars */}
            <div className="max-w-[1600px] mx-auto flex gap-8">
              {/* Left Sidebar */}
              <div className="hidden lg:block w-96 space-y-6">
                {/* Quick Stats Card */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Portfolio Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#7f5539]/70">Total Posts</span>
                      <span className="font-semibold text-[#7f5539]">{portfolioPosts.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7f5539]/70">Total Likes</span>
                      <span className="font-semibold text-[#7f5539]">{portfolioPosts.reduce((sum, post) => sum + post.likes, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7f5539]/70">Total Comments</span>
                      <span className="font-semibold text-[#7f5539]">{portfolioPosts.reduce((sum, post) => sum + post.comments, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7f5539]/70">Avg. Engagement</span>
                      <span className="font-semibold text-[#7f5539]">
                        {Math.round((portfolioPosts.reduce((sum, post) => sum + post.likes + post.comments, 0)) / portfolioPosts.length)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Recent Achievements</span>
                  </h3>
                  <div className="space-y-3">
                    {badges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${badge.color}`}>
                          {React.cloneElement(badge.icon, { className: "h-4 w-4" })}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#7f5539]">{badge.title}</p>
                          <p className="text-xs text-[#7f5539]/60">{badge.prize}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-[#7f5539] hover:text-[#6e4c34] text-sm font-medium transition-colors">
                    View All Achievements
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsCreatingPost(true)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left"
                    >
                      <Camera className="h-5 w-5 text-[#7f5539]" />
                      <span className="text-[#7f5539]">Create Post</span>
                    </button>
                    <button
                      onClick={() => setIsAddingArtwork(true)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left"
                    >
                      <Plus className="h-5 w-5 text-[#7f5539]" />
                      <span className="text-[#7f5539]">Add Artwork</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left">
                      <Edit className="h-5 w-5 text-[#7f5539]" />
                      <span className="text-[#7f5539]">Edit Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left">
                      <Palette className="h-5 w-5 text-[#7f5539]" />
                      <span className="text-[#7f5539]">View Analytics</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Feed */}
              <div className="flex-1 max-w-4xl space-y-8">
                {/* Add Post Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20">
                  <div className="p-4 border-b border-[#fdf9f4]/30">
                    <div className="flex items-center space-x-3">
                      <img
                        src={artistProfile.avatar}
                        alt={artistProfile.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <button
                          onClick={() => setIsCreatingPost(true)}
                          className="w-full text-left px-4 py-2 bg-[#fdf9f4]/50 hover:bg-[#fdf9f4]/70 rounded-full text-[#7f5539]/60 transition-colors"
                        >
                          What's on your mind, {artistProfile.name.split(' ')[0]}?
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#fdf9f4]/30">
                      <button
                        onClick={() => setIsCreatingPost(true)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-[#7f5539]"
                      >
                        <Camera className="h-5 w-5" />
                        <span className="font-medium">Photo/Video</span>
                      </button>
                      <button
                        onClick={() => setIsCreatingPost(true)}
                        className="bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feed Posts */}
                {portfolioPosts.map((post) => (
                  <div
                    key={post.post_id}
                    className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={artistProfile.avatar}
                          alt={artistProfile.name}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-[#7f5539]">{artistProfile.name}</h4>
                          <p className="text-xs text-[#7f5539]/60">
                            {safeFormatDistanceToNow(post.created_at)}
                          </p>

                        </div>
                      </div>
                      <div className="flex space-x-3">  {/* Flex container with horizontal spacing */}
                        <button
                        onClick={() => handleEditPost(post)}
                        className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
>                         
                        <Edit className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDeletePost(post.post_id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Post Caption */}
                    <div className="px-5 pb-4">
                      <p className="text-[#7f5539] leading-relaxed">{post.caption}</p>
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <img
                        src={`http://localhost:8080${post.image}`}
                        alt={`Post ${post.post_id}`}
                        className="w-full h-[32rem] object-cover"
                      />
                    </div>

                    {/* Post Actions */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-5">
                          <button className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors">
                            <Heart className="h-7 w-7" />
                          </button>
                          <button className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors">
                            <MessageCircle className="h-7 w-7" />
                          </button>
                          <button className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors">
                            <Upload className="h-7 w-7" />
                          </button>
                        </div>
                        <button className="text-[#7f5539] hover:text-[#6e4c34] transition-colors">
                          <Star className="h-7 w-7" />
                        </button>
                      </div>

                      {/* Like Count */}
                      <div className="mb-3">
                        <p className="font-semibold text-[#7f5539] text-base">{post.likes} likes</p>
                      </div>

                      {/* Comments Preview */}
                      <div className="space-y-2">
                        <button className="text-[#7f5539]/60 hover:text-[#7f5539] text-sm transition-colors">
                          View all {post.comments} comments
                        </button>
                      </div>

                      {/* Add Comment */}
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-[#fdf9f4]/30">
                        <img
                          src={artistProfile.avatar}
                          alt="Your avatar"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="flex-1 text-sm text-[#7f5539] placeholder-[#7f5539]/50 bg-transparent outline-none py-2"
                        />
                        <button className="text-[#7f5539] hover:text-[#6e4c34] font-semibold text-sm transition-colors">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More */}
                <div className="text-center py-8">
                  <button className="bg-[#7f5539] text-[#fdf9f4] px-8 py-3 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium">
                    Load More Posts
                  </button>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block w-96 space-y-6">
                {/* Top Artworks */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Top Artworks</span>
                  </h3>
                  <div className="space-y-3">
                    {artworks.slice(0, 4).map((artwork) => (
                      <div key={artwork.id} className="flex items-center space-x-3">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#7f5539]">{artwork.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-[#7f5539]/60">
                            <span>{artwork.likes} likes</span>
                            <span>•</span>
                            <span>{artwork.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('tosell')}
                    className="w-full mt-4 text-[#7f5539] hover:text-[#6e4c34] text-sm font-medium transition-colors"
                  >
                    View All Artworks
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Heart className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#7f5539]">Someone liked your post</p>
                        <p className="text-xs text-[#7f5539]/60">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#7f5539]">New comment on "Sunset Dreams"</p>
                        <p className="text-xs text-[#7f5539]/60">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Eye className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#7f5539]">Your artwork was viewed 50 times</p>
                        <p className="text-xs text-[#7f5539]/60">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#7f5539]">Artwork featured in gallery</p>
                        <p className="text-xs text-[#7f5539]/60">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Events</span>
                  </h3>
                  <div className="space-y-3">
                    {exhibitions.map((exhibition) => (
                      <div key={exhibition.id} className="p-3 bg-[#fdf9f4]/30 rounded-lg">
                        <p className="text-sm font-medium text-[#7f5539]">{exhibition.title}</p>
                        <p className="text-xs text-[#7f5539]/60">{exhibition.location}</p>
                        <p className="text-xs text-[#7f5539]/60">{exhibition.date}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-[#7f5539] hover:text-[#6e4c34] text-sm font-medium transition-colors">
                    View All Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* To sell Tab */}
        {activeTab === 'tosell' && (
          <div className="space-y-8">
            {/* Add Artwork Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-2">My Artworks</h3>
                  <p className="text-[#7f5539]/70">Manage your portfolio and showcase your best work</p>
                </div>
                <button
                  onClick={() => setIsAddingArtwork(true)}
                  className="mt-4 md:mt-0 bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Artwork</span>
                </button>
              </div>
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {artwork.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Featured</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => handleViewArtworkDetail(artwork)}
                        className="bg-white/90 text-[#7f5539] p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="bg-white/90 text-[#7f5539] p-2 rounded-full hover:bg-white transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${artwork.status === 'Available' ? 'bg-green-100 text-green-800' :
                      artwork.status === 'Sold' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {artwork.status}
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-[#7f5539] mb-1">{artwork.title}</h4>
                    <p className="text-sm text-[#7f5539]/70 mb-2">{artwork.medium} • {artwork.size}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-[#7f5539]">{artwork.price}</span>
                      <span className="text-sm text-[#7f5539]/60">{artwork.year}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[#7f5539]/60">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{artwork.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{artwork.views}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewArtworkDetail(artwork)}
                        className="text-[#7f5539] hover:text-[#6e4c34] transition-colors font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exhibitions Tab */}
        {activeTab === 'exhibitions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#7f5539]">My Exhibitions</h3>
              <button className="bg-[#7f5539] text-[#fdf9f4] px-4 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium">
                Apply for Exhibition
              </button>
            </div>

            <div className="space-y-4">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="p-4 bg-[#fdf9f4]/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#7f5539]">{exhibition.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${exhibition.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {exhibition.status}
                    </span>
                  </div>
                  <div className="text-sm text-[#7f5539]/70 space-y-1">
                    <p>Location: {exhibition.location}</p>
                    <p>Date: {exhibition.date}</p>
                    <p>Artworks: {exhibition.artworks} pieces</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#7f5539] mb-6">Awards & Recognition</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-6 rounded-lg border-2 ${badge.color} hover:shadow-lg transition-shadow`}

                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white rounded-full">
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{badge.title}</h4>
                      <p className="text-sm opacity-75 mb-2">{badge.prize}</p>
                      <p className="text-xs opacity-60">{badge.date}</p>
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-xs font-medium">
                          {badge.type.charAt(0).toUpperCase() + badge.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
              <h3 className="text-xl font-semibold text-[#7f5539] mb-6 flex items-center">
                <BarChart3 className="mr-2" size={24} />
                Portfolio Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Portfolio Views</p>
                      <p className="text-2xl font-bold text-blue-800">{artistProfile.stats.views.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="text-green-500 mr-1" size={16} />
                        <span className="text-green-600 text-sm">+15.3%</span>
                      </div>
                    </div>
                    <Eye className="text-blue-500" size={32} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Total Engagement</p>
                      <p className="text-2xl font-bold text-green-800">
                        {(portfolioPosts.reduce((sum, post) => sum + post.likes + post.comments, 0) +
                          artworks.reduce((sum, art) => sum + art.likes, 0)).toLocaleString()}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="text-green-500 mr-1" size={16} />
                        <span className="text-green-600 text-sm">+22.7%</span>
                      </div>
                    </div>
                    <Heart className="text-green-500" size={32} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total Followers</p>
                      <p className="text-2xl font-bold text-purple-800">{artistProfile.stats.followers}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="text-green-500 mr-1" size={16} />
                        <span className="text-green-600 text-sm">+18.2%</span>
                      </div>
                    </div>
                    <Users className="text-purple-500" size={32} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Artworks Sold</p>
                      <p className="text-2xl font-bold text-orange-800">{artistProfile.stats.sales}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="text-green-500 mr-1" size={16} />
                        <span className="text-green-600 text-sm">+12.5%</span>
                      </div>
                    </div>
                    <DollarSign className="text-orange-500" size={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Portfolio Insights */}
              <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                <h4 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center">
                  <PieChart className="mr-2" size={20} />
                  Portfolio Insights
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Eye className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Avg. Views per Artwork</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {Math.round(artworks.reduce((sum, art) => sum + art.views, 0) / artworks.length)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Avg. Likes per Artwork</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {Math.round(artworks.reduce((sum, art) => sum + art.likes, 0) / artworks.length)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Target className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Conversion Rate</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {((artistProfile.stats.sales / artistProfile.stats.artworks) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Star className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Featured Artworks</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {artworks.filter(art => art.featured).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Audience Demographics */}
              <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                <h4 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Audience Demographics
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Top Location</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">New York, USA (32%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Peak Activity</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">6-9 PM EST</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Target className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Primary Age Group</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">25-34 years (42%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">International Reach</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">23 countries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Content */}
            <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
              <h4 className="text-lg font-semibold text-[#7f5539] mb-6 flex items-center">
                <Star className="mr-2" size={20} />
                Top Performing Content
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Artworks */}
                <div>
                  <h5 className="text-md font-semibold text-[#7f5539] mb-4">Best Selling Artworks</h5>
                  <div className="space-y-3">
                    {artworks
                      .sort((a, b) => b.likes - a.likes)
                      .slice(0, 4)
                      .map((artwork, index) => (
                        <div key={artwork.id} className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-[#7f5539] text-white rounded-full text-xs font-bold">
                              {index + 1}
                            </div>
                            <img
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-[#7f5539] text-sm">{artwork.title}</p>
                              <p className="text-xs text-[#7f5539]/60">{artwork.likes} likes • {artwork.views} views</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#7f5539] text-sm">{artwork.price}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${artwork.status === 'Sold' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {artwork.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Top Posts */}
                <div>
                  <h5 className="text-md font-semibold text-[#7f5539] mb-4">Most Engaging Posts</h5>
                  <div className="space-y-3">
                    {portfolioPosts
                      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
                      .slice(0, 4)
                      .map((post, index) => (
                        <div key={post.id} className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-[#7f5539] text-white rounded-full text-xs font-bold">
                              {index + 1}
                            </div>
                            <img
                              src={post.image}
                              alt={`Post ${post.id}`}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-[#7f5539] text-sm">
                                {post.caption.substring(0, 30)}...
                              </p>
                              <p className="text-xs text-[#7f5539]/60">{post.likes} likes • {post.comments} comments</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {((post.likes + post.comments) / 10).toFixed(1)}% engagement
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
              <h4 className="text-lg font-semibold text-[#7f5539] mb-6 flex items-center">
                <Activity className="mr-2" size={20} />
                Engagement Breakdown
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <Heart className="mx-auto text-red-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-[#7f5539]">
                    {(portfolioPosts.reduce((sum, post) => sum + post.likes, 0) +
                      artworks.reduce((sum, art) => sum + art.likes, 0)).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Likes</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="text-green-500 mr-1" size={12} />
                    <span className="text-green-600 text-xs">+8.3%</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <MessageCircle className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-[#7f5539]">
                    {portfolioPosts.reduce((sum, post) => sum + post.comments, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Comments</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="text-green-500 mr-1" size={12} />
                    <span className="text-green-600 text-xs">+12.7%</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <Share2 className="mx-auto text-green-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-[#7f5539]">156</p>
                  <p className="text-sm text-gray-600">Shares</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="text-green-500 mr-1" size={12} />
                    <span className="text-green-600 text-xs">+15.2%</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <Download className="mx-auto text-purple-500 mb-2" size={24} />
                  <p className="text-2xl font-bold text-[#7f5539]">89</p>
                  <p className="text-sm text-gray-600">Downloads</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="text-green-500 mr-1" size={12} />
                    <span className="text-green-600 text-xs">+6.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue & Sales Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
              <h4 className="text-lg font-semibold text-[#7f5539] mb-6 flex items-center">
                <DollarSign className="mr-2" size={20} />
                Revenue & Sales Analytics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                  <h5 className="text-emerald-700 font-medium mb-2">Total Revenue</h5>
                  <p className="text-2xl font-bold text-emerald-800">$15,400</p>
                  <p className="text-sm text-emerald-600 mt-1">+23.5% from last month</p>
                  <div className="mt-3 text-xs text-emerald-700">
                    From {artistProfile.stats.sales} sold artworks
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <h5 className="text-blue-700 font-medium mb-2">Average Sale Price</h5>
                  <p className="text-2xl font-bold text-blue-800">
                    ${Math.round(15400 / artistProfile.stats.sales).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">+12.8% from last month</p>
                  <div className="mt-3 text-xs text-blue-700">
                    Based on recent sales
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                  <h5 className="text-amber-700 font-medium mb-2">Sales Conversion</h5>
                  <p className="text-2xl font-bold text-amber-800">
                    {((artistProfile.stats.sales / artistProfile.stats.views) * 100).toFixed(2)}%
                  </p>
                  <p className="text-sm text-amber-600 mt-1">+1.2% from last month</p>
                  <div className="mt-3 text-xs text-amber-700">
                    Views to sales ratio
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
              <h4 className="text-lg font-semibold text-[#7f5539] mb-6 flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Growth Trends (Last 30 Days)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#fdf9f4]/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="text-blue-500 mr-1" size={20} />
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-sm text-[#7f5539]/70">Portfolio Views</p>
                  <p className="text-lg font-bold text-[#7f5539]">+15.3%</p>
                </div>

                <div className="p-4 bg-[#fdf9f4]/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="text-purple-500 mr-1" size={20} />
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-sm text-[#7f5539]/70">New Followers</p>
                  <p className="text-lg font-bold text-[#7f5539]">+18.2%</p>
                </div>

                <div className="p-4 bg-[#fdf9f4]/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="text-red-500 mr-1" size={20} />
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-sm text-[#7f5539]/70">Engagement Rate</p>
                  <p className="text-lg font-bold text-[#7f5539]">+22.7%</p>
                </div>

                <div className="p-4 bg-[#fdf9f4]/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="text-green-500 mr-1" size={20} />
                    <TrendingUp className="text-green-500" size={16} />
                  </div>
                  <p className="text-sm text-[#7f5539]/70">Revenue Growth</p>
                  <p className="text-lg font-bold text-[#7f5539]">+23.5%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditingProfile}
        onClose={handleCancelEdit}
        editedProfile={editedProfile}
        onProfileChange={handleProfileChange}
        onSave={handleSaveProfile}
        artistProfile={artistProfile}
      />

      {/* Upload Post Modal */}
      <UploadPostModal
        isOpen={isAddingArtwork}
        onClose={handleCancelAddArtwork}
        newArtwork={newArtwork}
        onArtworkChange={handleArtworkChange}
        onImageUpload={handleImageUpload}
        onSave={handleSaveArtwork}
        onCancel={handleCancelAddArtwork}
      />

      {/* Artwork Detail Modal */}
      <ArtworkDetailModal
        isOpen={isViewingArtwork}
        artwork={selectedArtwork}
        onClose={handleCloseArtworkView}
        onEdit={handleEditArtwork}
        onDelete={handleDeleteArtwork}
        onToggleFeature={handleToggleFeature}
        onMarkAsSold={handleMarkAsSold}
      />

      {/* Post Upload Modal */}
      <PostUploadModal
        isOpen={isCreatingPost}
        onClose={handleCancelPost}
        newPost={newPost}
        onPostChange={handlePostChange}
        onImageUpload={handlePostImageUpload}
        onSave={handleSavePost}
        onCancel={handleCancelPost}
        artistProfile={artistProfile}
      />

      {/* Change Cover Modal */}
      <ChangeCoverModal
        isOpen={isChangingCover}
        onClose={handleCancelCoverChange}
        currentCoverImage={artistProfile.coverImage}
        onSave={handleSaveCover}
        onCancel={handleCancelCoverChange}
        artistProfile={artistProfile}
      />

      {showEditModal && editingItem && (
        <EditPostModel
          item={editingItem}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSavePost}
        />
      )}
    </div>
  );
};

export default ArtistPortfolio;