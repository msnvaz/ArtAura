import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArtworkDetailModal from '../../components/artworks/ArtworkDetailModal';
import CommissionRequestModal from '../../components/modals/CommissionRequestModal';
import { formatDistanceToNow, isValid } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Heart,
    Star,
    Trophy,
    Medal,
    Award,
    Eye,
    MessageCircle,
    Share2,
    Calendar,
    MapPin,
    Globe,
    Instagram,
    Twitter,
    Phone,
    Mail,
    Palette,
    ArrowLeft,
    User,
    Users,
    TrendingUp,
    UserPlus,
    UserCheck
} from 'lucide-react';

const PublicArtistPortfolio = () => {
    const navigate = useNavigate();
    const { artistId } = useParams();
    const { token, role, userId } = useAuth();
    const [activeTab, setActiveTab] = useState('portfolio');
    const [isViewingArtwork, setIsViewingArtwork] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [isCommissionRequestOpen, setIsCommissionRequestOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    // Real data states
    const [artistProfile, setArtistProfile] = useState(null);
    const [portfolioPosts, setPortfolioPosts] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [exhibitions, setExhibitions] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    // Helper function to safely format time distance
    const safeFormatDistanceToNow = (date) => {
        if (!date) return "Unknown time";

        let d;
        if (typeof date === 'string') {
            d = new Date(date);
            if (!isValid(d)) {
                const timestamp = parseInt(date);
                if (!isNaN(timestamp)) {
                    d = new Date(timestamp);
                }
            }
        } else if (typeof date === 'number') {
            d = new Date(date);
        } else {
            d = new Date(date);
        }

        if (!isValid(d)) {
            console.warn('Invalid date provided to safeFormatDistanceToNow:', date);
            return "Unknown time";
        }

        return formatDistanceToNow(d, { addSuffix: true });
    };

    // Fetch artist data on component mount
    useEffect(() => {
        if (!artistId) {
            setError('No artist ID provided');
            setLoading(false);
            return;
        }

        fetchArtistData();
    }, [artistId]);

    const fetchArtistData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if API is available first
            try {
                // Fetch artist profile
                const profileResponse = await axios.get(`${API_URL}/api/buyer/artists/${artistId}/profile`);
                setArtistProfile(profileResponse.data);

                // Fetch artist posts
                const postsResponse = await axios.get(`${API_URL}/api/posts/artist/${artistId}`);
                setPortfolioPosts(postsResponse.data || []);

                // Fetch artist artworks
                const artworksResponse = await axios.get(`${API_URL}/api/artworks/artist/${artistId}`);
                setArtworks(artworksResponse.data || []);

                // Fetch artist exhibitions
                const exhibitionsResponse = await axios.get(`${API_URL}/api/exhibitions/artist/${artistId}`);
                setExhibitions(exhibitionsResponse.data || []);

                // Fetch artist achievements
                const achievementsResponse = await axios.get(`${API_URL}/api/achievements/artist/${artistId}`);
                setAchievements(achievementsResponse.data || []);

            } catch (apiError) {
                // If API is not available, use mock data for testing
                console.warn('API not available, using mock data');
                setArtistProfile({
                    id: artistId,
                    name: "Sample Artist",
                    bio: "This is a sample artist profile for testing purposes. The backend server is not currently running.",
                    location: "Sample City",
                    joinDate: "January 2024",
                    isVerified: true,
                    avatar: "/default-avatar.jpg",
                    coverImage: "/default-cover.jpg",
                    specialties: ["Painting", "Digital Art", "Illustration"],
                    priceRange: "$100 - $500",
                    customWorkAvailable: true,
                    website: "example.com",
                    instagram: "@sampleartist",
                    twitter: "@sampleartist",
                    stats: {
                        artworks: 25,
                        sales: 12,
                        followers: 150,
                        views: 1200
                    }
                });
                setPortfolioPosts([]);
                setArtworks([]);
                setExhibitions([]);
                setAchievements([]);
            }

        } catch (error) {
            console.error('Error fetching artist data:', error);
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                setError('Unable to connect to server. Please check if the backend is running.');
            } else if (error.response?.status === 404) {
                setError('Artist not found.');
            } else {
                setError('Failed to load artist data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFollow = async () => {
        if (!token) {
            alert('Please login to follow artists');
            return;
        }

        if (role !== 'buyer') {
            alert('Only buyers can follow artists');
            return;
        }

        try {
            if (!isFollowing) {
                await axios.post(
                    `${API_URL}/api/buyer/artists/${artistId}/follow`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setIsFollowing(true);
                // Update follower count in artist profile if available
                if (artistProfile) {
                    setArtistProfile(prev => ({
                        ...prev,
                        totalFollowers: (prev.totalFollowers || 0) + 1
                    }));
                }
                alert('Successfully followed artist!');
            } else {
                // Note: Unfollow functionality would need to be implemented in backend
                alert('Unfollow functionality coming soon!');
            }
        } catch (error) {
            console.error('Error following artist:', error);
            alert('Failed to follow artist. Please try again.');
        }
    };

    const handleViewArtworkDetail = (artwork) => {
        setSelectedArtwork(artwork);
        setIsViewingArtwork(true);
    };

    const handleCloseArtworkView = () => {
        setIsViewingArtwork(false);
        setSelectedArtwork(null);
    };

    const handleCommissionRequest = () => {
        setIsCommissionRequestOpen(true);
    };

    const handleCloseCommissionModal = () => {
        setIsCommissionRequestOpen(false);
    };

    const handleLikePost = (postId) => {
        // Handle post like
        console.log('Liked post:', postId);
    };

    const handleLikeArtwork = (artworkId) => {
        // Handle artwork like
        console.log('Liked artwork:', artworkId);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdf9f4] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f5539] mx-auto mb-4"></div>
                    <p className="text-[#7f5539] font-medium">Loading artist profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#fdf9f4] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[#7f5539] text-white px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // No artist profile loaded
    if (!artistProfile) {
        return (
            <div className="min-h-screen bg-[#fdf9f4] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#7f5539] mb-4">Artist not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[#7f5539] text-white px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf9f4] py-8">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center space-x-2 text-[#7f5539] hover:text-[#6e4c34] transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Gallery</span>
                </button>

                {/* Cover Image */}
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                    <img
                        src={artistProfile?.coverImage || '/default-cover.jpg'}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold">{artistProfile?.name || 'Artist'}</h1>
                            {artistProfile?.isVerified && (
                                <div className="bg-blue-500 rounded-full p-1">
                                    <Star className="h-5 w-5 text-white fill-current" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4 text-white/90">
                            <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{artistProfile?.location || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {artistProfile?.joinDate || 'Recently'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                        {/* Avatar */}
                        <div className="relative mb-4 md:mb-0">
                            <img
                                src={artistProfile?.avatar || '/default-avatar.jpg'}
                                alt={artistProfile?.name || 'Artist'}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h2 className="text-2xl font-bold text-[#7f5539]">{artistProfile?.name || 'Artist'}</h2>
                                        {artistProfile?.isVerified && (
                                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                                <Star className="h-3 w-3" />
                                                <span>Verified Artist</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-[#7f5539]">{artistProfile?.stats?.artworks || 0}</div>
                                            <div className="text-sm text-[#7f5539]/60">Artworks</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-[#7f5539]">{artistProfile?.stats?.sales || 0}</div>
                                            <div className="text-sm text-[#7f5539]/60">Sales</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-[#7f5539]">
                                                {(artistProfile?.stats?.followers || 0) + (isFollowing ? 1 : 0)}
                                            </div>
                                            <div className="text-sm text-[#7f5539]/60">Followers</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-[#7f5539]">{artistProfile?.stats?.views || 0}</div>
                                            <div className="text-sm text-[#7f5539]/60">Views</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                                    <button
                                        onClick={handleToggleFollow}
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${isFollowing
                                            ? 'bg-gray-200 text-[#7f5539] hover:bg-gray-300'
                                            : 'bg-[#7f5539] text-[#fdf9f4] hover:bg-[#6e4c34]'
                                            }`}
                                    >
                                        {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                                    </button>
                                    <button
                                        onClick={handleCommissionRequest}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                                    >
                                        <Palette className="h-4 w-4" />
                                        <span>Request Custom Art</span>
                                    </button>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-4">
                                <p className="text-[#7f5539]/70 leading-relaxed">{artistProfile?.bio || 'No bio available'}</p>
                            </div>

                            {/* Artist Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-semibold text-[#7f5539] mb-2">Specialties</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(artistProfile?.specialties || []).map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="bg-[#7f5539]/10 text-[#7f5539] px-3 py-1 rounded-full text-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#7f5539] mb-2">Price Range</h4>
                                    <p className="text-[#7f5539]/70">{artistProfile?.priceRange || 'Contact for pricing'}</p>
                                    {artistProfile?.customWorkAvailable && (
                                        <p className="text-green-600 text-sm mt-1">✓ Custom work available</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                {artistProfile?.website && (
                                    <a
                                        href={`https://${artistProfile.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>{artistProfile.website}</span>
                                    </a>
                                )}
                                {artistProfile?.instagram && (
                                    <a
                                        href={`https://instagram.com/${artistProfile.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors"
                                    >
                                        <Instagram className="h-4 w-4" />
                                        <span>{artistProfile.instagram}</span>
                                    </a>
                                )}
                                {artistProfile?.twitter && (
                                    <a
                                        href={`https://twitter.com/${artistProfile.twitter.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors"
                                    >
                                        <Twitter className="h-4 w-4" />
                                        <span>{artistProfile.twitter}</span>
                                    </a>
                                )}
                                {artistProfile.email && (
                                    <a
                                        href={`mailto:${artistProfile.email}`}
                                        className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors"
                                    >
                                        <Mail className="h-4 w-4" />
                                        <span>Contact</span>
                                    </a>
                                )}
                            </div>

                            {/* Achievements & Awards */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-[#7f5539] mb-3 flex items-center space-x-2">
                                    <Trophy className="h-5 w-5" />
                                    <span>Achievements & Awards</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {achievements.length > 0 ? achievements.slice(0, 4).map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className="p-3 rounded-lg border-2 bg-yellow-100 text-yellow-800 border-yellow-200 hover:scale-105 transition-transform cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-2 mb-1">
                                                <Trophy className="h-4 w-4" />
                                                <span className="font-medium text-sm">Achievement</span>
                                            </div>
                                            <div className="text-xs font-medium mb-1">{achievement.title}</div>
                                            {achievement.description && (
                                                <div className="text-xs opacity-75">{achievement.description}</div>
                                            )}
                                            {achievement.dateEarned && (
                                                <div className="text-xs opacity-60 mt-1">
                                                    {new Date(achievement.dateEarned).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center py-8 text-[#7f5539]/60">
                                            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                            <p>No achievements yet</p>
                                        </div>
                                    )}
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
                                { id: 'artworks', label: 'Artworks for Sale', count: artworks.filter(a => a.status === 'Available').length },
                                { id: 'exhibitions', label: 'Exhibitions', count: exhibitions.length },
                                { id: 'achievements', label: 'Achievements', count: achievements.length }
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

                {/* Portfolio Tab - Public View */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-0">
                        {/* Instagram-style Feed with Sidebars */}
                        <div className="max-w-[1600px] mx-auto flex gap-8">
                            {/* Left Sidebar */}
                            <div className="hidden lg:block w-96 space-y-6">
                                {/* Artist Stats Card */}
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
                                        {(achievements && achievements.length > 0) ?
                                            achievements.slice(0, 3).map((badge, index) => (
                                                <div key={badge.id || index} className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${badge?.color || 'bg-gray-100'}`}>
                                                        {badge?.icon || <Trophy className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-[#7f5539]">{badge?.title || 'Achievement'}</p>
                                                        <p className="text-xs text-[#7f5539]/60">{badge?.prize || 'Award'}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-[#7f5539]/60 text-sm text-center py-4">No achievements yet</p>
                                            )
                                        }
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('achievements')}
                                        className="w-full mt-4 text-[#7f5539] hover:text-[#6e4c34] text-sm font-medium transition-colors"
                                    >
                                        View All Achievements
                                    </button>
                                </div>

                                {/* Artist Contact */}
                                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                                    <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Connect with Artist</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleCommissionRequest}
                                            className="w-full flex items-center space-x-3 p-3 hover:bg-green-50 rounded-lg transition-colors text-left"
                                        >
                                            <Palette className="h-5 w-5 text-green-600" />
                                            <span className="text-green-600 font-medium">Request Custom Art</span>
                                        </button>
                                        <button
                                            onClick={handleToggleFollow}
                                            className={`w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left ${isFollowing ? 'bg-gray-50' : ''
                                                }`}
                                        >
                                            <Users className="h-5 w-5 text-[#7f5539]" />
                                            <span className="text-[#7f5539]">
                                                {isFollowing ? 'Following' : 'Follow Artist'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Feed */}
                            <div className="flex-1 max-w-4xl space-y-8">
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
                                                    <p className="text-xs text-[#7f5539]/60">{safeFormatDistanceToNow(post.timestamp)}</p>
                                                </div>
                                            </div>
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
                                                    <button
                                                        onClick={() => handleLikePost(post.id)}
                                                        className="flex items-center space-x-1 text-[#7f5539] hover:text-red-500 transition-colors"
                                                    >
                                                        <Heart className="h-7 w-7" />
                                                    </button>
                                                    <button className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors">
                                                        <MessageCircle className="h-7 w-7" />
                                                    </button>
                                                    <button className="flex items-center space-x-1 text-[#7f5539] hover:text-[#6e4c34] transition-colors">
                                                        <Share2 className="h-7 w-7" />
                                                    </button>
                                                </div>
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
                                                <div className="w-9 h-9 rounded-full bg-[#7f5539]/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-[#7f5539]" />
                                                </div>
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
                            </div>

                            {/* Right Sidebar */}
                            <div className="hidden xl:block w-80 space-y-6">
                                {/* Suggested Artists or Related */}
                                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                                    <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Artist Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-[#7f5539]/60" />
                                            <span className="text-[#7f5539]/70">{artistProfile.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-[#7f5539]/60" />
                                            <span className="text-[#7f5539]/70">Joined {artistProfile?.joinDate || 'Recently'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Palette className="h-4 w-4 text-[#7f5539]/60" />
                                            <span className="text-[#7f5539]/70">{(artistProfile?.specialties || []).join(', ') || 'Various specialties'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Available Artworks Preview */}
                                <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/20 p-6">
                                    <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Available Artworks</h3>
                                    <div className="space-y-3">
                                        {artworks.filter(artwork => artwork.status === 'Available').slice(0, 3).map((artwork) => (
                                            <div key={artwork.id} className="flex items-center space-x-3 cursor-pointer hover:bg-[#fdf9f4]/30 p-2 rounded-lg transition-colors"
                                                onClick={() => handleViewArtworkDetail(artwork)}>
                                                <img
                                                    src={artwork.image}
                                                    alt={artwork.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-[#7f5539]">{artwork.title}</p>
                                                    <p className="text-xs text-[#7f5539]/60">{artwork.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('artworks')}
                                        className="w-full mt-4 text-[#7f5539] hover:text-[#6e4c34] text-sm font-medium transition-colors"
                                    >
                                        View All Artworks
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Artworks for Sale Tab */}
                {activeTab === 'artworks' && (
                    <div className="space-y-8">
                        {/* Artworks Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {artworks.filter(artwork => artwork.status === 'Available').map((artwork) => (
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
                                            <button
                                                onClick={() => handleLikeArtwork(artwork.id)}
                                                className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-colors"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Available
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h4 className="font-semibold text-[#7f5539] mb-1">{artwork.title}</h4>
                                        <p className="text-sm text-[#7f5539]/70 mb-2">{artwork.medium} • {artwork.size}</p>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-bold text-[#7f5539]">{artwork.price}</span>
                                            <span className="text-sm text-[#7f5539]/60">{artwork.year}</span>
                                        </div>

                                        <div className="flex items-center justify-between mb-3 text-sm text-[#7f5539]/60">
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
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewArtworkDetail(artwork)}
                                                className="w-full bg-[#7f5539]/10 text-[#7f5539] py-2 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium text-sm"
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
                        <h3 className="text-lg font-semibold text-[#7f5539] mb-6">Exhibitions</h3>
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
                        {(achievements && achievements.length > 0) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {achievements.map((badge, index) => (
                                    <div
                                        key={badge.id || index}
                                        className={`p-6 rounded-lg border-2 ${badge.color || 'border-gray-200'} hover:shadow-lg transition-shadow`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-white rounded-full">
                                                {badge?.icon || <Trophy className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">{badge?.title || 'Achievement'}</h4>
                                                <p className="text-sm opacity-75 mb-2">{badge?.prize || 'Award'}</p>
                                                <p className="text-xs opacity-60">{badge?.date || 'Date unknown'}</p>
                                                <div className="mt-3">
                                                    <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-xs font-medium">
                                                        {badge?.type ? (badge.type.charAt(0).toUpperCase() + badge.type.slice(1)) : 'Award'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Trophy className="h-12 w-12 text-[#7f5539]/30 mx-auto mb-4" />
                                <p className="text-[#7f5539]/60">No achievements to display</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Artwork Detail Modal */}
            <ArtworkDetailModal
                isOpen={isViewingArtwork}
                artwork={selectedArtwork}
                onClose={handleCloseArtworkView}
                isPublicView={true}
            />

            {/* Commission Request Modal */}
            {artistProfile && (
                <CommissionRequestModal
                    isOpen={isCommissionRequestOpen}
                    onClose={handleCloseCommissionModal}
                    artist={artistProfile}
                />
            )}
        </div>
    );
};

export default PublicArtistPortfolio;