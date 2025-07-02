import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkDetailModal from '../../components/artworks/ArtworkDetailModal';
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
  const portfolioPosts = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Working on my latest piece! The creative process is always so fulfilling. #artistlife #workinprogress',
      likes: 89,
      comments: 12,
      timestamp: '2024-06-28',
      type: 'image'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Just finished "Sunset Dreams"! This piece took me 3 weeks to complete. What do you think? 🎨',
      likes: 156,
      comments: 24,
      timestamp: '2024-06-25',
      type: 'image'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Behind the scenes of my studio setup. Organization is key to creativity! ✨',
      likes: 67,
      comments: 8,
      timestamp: '2024-06-22',
      type: 'image'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Experimenting with digital art techniques. Technology opens so many new possibilities! 💻🎨',
      likes: 94,
      comments: 16,
      timestamp: '2024-06-20',
      type: 'image'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Nature is my greatest inspiration. This mountain view is going into my next watercolor series 🏔️',
      likes: 112,
      comments: 19,
      timestamp: '2024-06-18',
      type: 'image'
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1742370/pexels-photo-1742370.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Portrait study session today. Capturing human emotion through charcoal is such a meditative process.',
      likes: 78,
      comments: 11,
      timestamp: '2024-06-15',
      type: 'image'
    }
  ];

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
          <button className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
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
              <button className="absolute bottom-0 right-0 bg-[#7f5539] text-[#fdf9f4] p-2 rounded-full hover:bg-[#6e4c34] transition-colors">
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
                    <button className="w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left">
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
                        <button className="w-full text-left px-4 py-2 bg-[#fdf9f4]/50 hover:bg-[#fdf9f4]/70 rounded-full text-[#7f5539]/60 transition-colors">
                          What's on your mind, {artistProfile.name.split(' ')[0]}?
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#fdf9f4]/30">
                      <button className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-[#7f5539]">
                        <Camera className="h-5 w-5" />
                        <span className="font-medium">Photo/Video</span>
                      </button>
                      <button className="bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium">
                        Post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feed Posts */}
                {portfolioPosts.map((post) => (
                  <div
                    key={post.id}
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
                          <p className="text-xs text-[#7f5539]/60">{post.timestamp}</p>
                        </div>
                      </div>
                      <button className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Post Caption */}
                    <div className="px-5 pb-4">
                      <p className="text-[#7f5539] leading-relaxed">{post.caption}</p>
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={`Post ${post.id}`}
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
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
              <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
                <Edit className="mr-2" size={24} />
                Edit Profile
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Profile Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Profile Images</h3>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7f5539]">Cover Image</label>
                  <div className="relative h-32 rounded-lg overflow-hidden border-2 border-dashed border-[#7f5539]/30 hover:border-[#7f5539]/50 transition-colors">
                    <img
                      src={artistProfile.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <button className="bg-[#7f5539] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Camera size={16} />
                        <span>Change Cover</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7f5539]">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={artistProfile.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button className="absolute -bottom-1 -right-1 bg-[#7f5539] text-white p-2 rounded-full hover:bg-[#6e4c34] transition-colors">
                        <Camera size={12} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <button className="bg-[#7f5539]/10 text-[#7f5539] px-4 py-2 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium flex items-center space-x-2">
                        <Upload size={16} />
                        <span>Upload New Picture</span>
                      </button>
                      <p className="text-xs text-[#7f5539]/60 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#7f5539]">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Full Name *</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Location</label>
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Phone</label>
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7f5539]">Bio</label>
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors resize-none"
                    placeholder="Tell us about yourself, your artistic style, and what inspires you..."
                  />
                  <p className="text-xs text-[#7f5539]/60">{editedProfile.bio.length}/500 characters</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#7f5539]">Online Presence</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Website</label>
                    <input
                      type="url"
                      value={editedProfile.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="www.yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Instagram</label>
                    <input
                      type="text"
                      value={editedProfile.instagram}
                      onChange={(e) => handleProfileChange('instagram', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-[#7f5539]">Twitter</label>
                    <input
                      type="text"
                      value={editedProfile.twitter}
                      onChange={(e) => handleProfileChange('twitter', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#7f5539]">Privacy Settings</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                    <div>
                      <p className="font-medium text-[#7f5539] text-sm">Public Profile</p>
                      <p className="text-xs text-[#7f5539]/60">Allow others to find and view your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                    <div>
                      <p className="font-medium text-[#7f5539] text-sm">Show Contact Information</p>
                      <p className="text-xs text-[#7f5539]/60">Display email and phone on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                    <div>
                      <p className="font-medium text-[#7f5539] text-sm">Portfolio Analytics</p>
                      <p className="text-xs text-[#7f5539]/60">Allow collection of viewing statistics</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-[#fdf9f4]/50">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Artwork Modal */}
      {isAddingArtwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
              <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
                <Plus className="mr-2" size={24} />
                Add New Artwork
              </h2>
              <button
                onClick={handleCancelAddArtwork}
                className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form className="space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#7f5539]">Artwork Images</h3>

                  <div className="border-2 border-dashed border-[#7f5539]/30 rounded-lg p-8 text-center hover:border-[#7f5539]/50 transition-colors">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-[#7f5539]/40" />
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <span className="bg-[#7f5539] text-white px-6 py-3 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium inline-block">
                            Choose Files
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-[#7f5539]/60 mt-2">
                          Upload high-quality images of your artwork. You can select multiple files.
                        </p>
                        <p className="text-xs text-[#7f5539]/50">
                          Supported formats: JPG, PNG, GIF. Max size: 10MB per file.
                        </p>
                      </div>
                      {newArtwork.imageFiles.length > 0 && (
                        <div className="text-sm text-[#7f5539]">
                          {newArtwork.imageFiles.length} file(s) selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#7f5539]">Artwork Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#7f5539]">Title *</label>
                      <input
                        type="text"
                        value={newArtwork.title}
                        onChange={(e) => handleArtworkChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                        placeholder="Enter artwork title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#7f5539]">Medium *</label>
                      <select
                        value={newArtwork.medium}
                        onChange={(e) => handleArtworkChange('medium', e.target.value)}
                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                        required
                      >
                        <option value="">Select medium</option>
                        <option value="Oil on Canvas">Oil on Canvas</option>
                        <option value="Acrylic on Canvas">Acrylic on Canvas</option>
                        <option value="Watercolor">Watercolor</option>
                        <option value="Digital Art">Digital Art</option>
                        <option value="Charcoal on Paper">Charcoal on Paper</option>
                        <option value="Pencil Drawing">Pencil Drawing</option>
                        <option value="Mixed Media">Mixed Media</option>
                        <option value="Photography">Photography</option>
                        <option value="Sculpture">Sculpture</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#7f5539]">Size</label>
                      <input
                        type="text"
                        value={newArtwork.size}
                        onChange={(e) => handleArtworkChange('size', e.target.value)}
                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                        placeholder='e.g., 24" x 36"'
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#7f5539]">Year Created</label>
                      <input
                        type="number"
                        value={newArtwork.year}
                        onChange={(e) => handleArtworkChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                        placeholder="2024"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#7f5539]">Price *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/60">$</span>
                        <input
                          type="number"
                          value={newArtwork.price}
                          onChange={(e) => handleArtworkChange('price', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#7f5539]">Category</label>
                      <select
                        value={newArtwork.category}
                        onChange={(e) => handleArtworkChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      >
                        <option value="">Select category</option>
                        <option value="Abstract">Abstract</option>
                        <option value="Landscape">Landscape</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Still Life">Still Life</option>
                        <option value="Contemporary">Contemporary</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Digital">Digital</option>
                        <option value="Photography">Photography</option>
                        <option value="Sculpture">Sculpture</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Description</label>
                    <textarea
                      value={newArtwork.description}
                      onChange={(e) => handleArtworkChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors resize-none"
                      placeholder="Describe your artwork, its inspiration, technique, or any interesting details..."
                    />
                    <p className="text-xs text-[#7f5539]/60">{newArtwork.description.length}/1000 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7f5539]">Tags</label>
                    <input
                      type="text"
                      value={newArtwork.tags}
                      onChange={(e) => handleArtworkChange('tags', e.target.value)}
                      className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                      placeholder="e.g., abstract, colorful, modern, landscape (separate with commas)"
                    />
                    <p className="text-xs text-[#7f5539]/60">Add relevant tags to help people discover your artwork</p>
                  </div>
                </div>

                {/* Pricing & Availability */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#7f5539]">Pricing & Availability</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-[#fdf9f4]/30 rounded-lg">
                      <input
                        type="checkbox"
                        id="available"
                        defaultChecked
                        className="w-4 h-4 text-[#7f5539] border-[#7f5539]/20 rounded focus:ring-[#7f5539]/20"
                      />
                      <label htmlFor="available" className="text-sm font-medium text-[#7f5539]">
                        Available for Sale
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-[#fdf9f4]/30 rounded-lg">
                      <input
                        type="checkbox"
                        id="featured"
                        className="w-4 h-4 text-[#7f5539] border-[#7f5539]/20 rounded focus:ring-[#7f5539]/20"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-[#7f5539]">
                        Feature in Portfolio
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-[#fdf9f4]/30 rounded-lg">
                      <input
                        type="checkbox"
                        id="prints"
                        className="w-4 h-4 text-[#7f5539] border-[#7f5539]/20 rounded focus:ring-[#7f5539]/20"
                      />
                      <label htmlFor="prints" className="text-sm font-medium text-[#7f5539]">
                        Allow Print Sales
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-[#fdf9f4]/50">
              <button
                onClick={handleCancelAddArtwork}
                className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveArtwork}
                className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Add Artwork</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ArtistPortfolio;