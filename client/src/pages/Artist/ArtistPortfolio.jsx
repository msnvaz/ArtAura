import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';

const ArtistPortfolio = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Mock artist data
  const artistProfile = {
    name: 'Sarah Martinez',
    bio: 'Contemporary artist specializing in abstract expressionism and digital art. My work explores the intersection of emotion and color, creating pieces that speak to the human experience.',
    location: 'New York, NY',
    joinDate: 'January 2023',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                { id: 'portfolio', label: 'Portfolio', count: artworks.length },
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

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            {/* Add Artwork Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-2">My Artworks</h3>
                  <p className="text-[#7f5539]/70">Manage your portfolio and showcase your best work</p>
                </div>
                <button className="mt-4 md:mt-0 bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2">
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
                      <button className="bg-white/90 text-[#7f5539] p-2 rounded-full hover:bg-white transition-colors">
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
                      <button className="text-[#7f5539] hover:text-[#6e4c34] transition-colors font-medium">
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
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Palette className="h-16 w-16 text-[#7f5539]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7f5539] mb-2">Portfolio Analytics</h3>
            <p className="text-[#7f5539]/70 mb-6">
              Detailed insights about your portfolio performance, views, and engagement
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-[#fdf9f4]/30 rounded-lg">
                <h4 className="font-semibold text-[#7f5539] mb-2">View Analytics</h4>
                <p className="text-sm text-[#7f5539]/70">Track how many people view your artworks</p>
              </div>
              <div className="p-4 bg-[#fdf9f4]/30 rounded-lg">
                <h4 className="font-semibold text-[#7f5539] mb-2">Engagement Metrics</h4>
                <p className="text-sm text-[#7f5539]/70">Monitor likes, shares, and interactions</p>
              </div>
              <div className="p-4 bg-[#fdf9f4]/30 rounded-lg">
                <h4 className="font-semibold text-[#7f5539] mb-2">Sales Performance</h4>
                <p className="text-sm text-[#7f5539]/70">Analyze your artwork sales and revenue</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPortfolio;