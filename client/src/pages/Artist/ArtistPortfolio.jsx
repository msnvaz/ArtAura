import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow, isValid } from 'date-fns';
import ArtworkDetailModal from '../../components/artworks/ArtworkDetailModal';
import EditProfileModal from '../../components/artist/EditProfileModal';
import UploadPostModal from '../../components/artworks/UploadPostModal';
import PostUploadModal from '../../components/social/PostUploadModal';
import ChangeCoverModal from '../../components/profile/ChangeCoverModal';
import EditPostModel from '../../components/artist/EditPostModel';
import { AcceptOrderModal, RejectOrderModal } from '../../components/orders/OrderModals';
import CommissionActionModal from '../../components/modals/CommissionActionModal';
import ExhibitionsSection from '../../components/artist/ExhibitionsSection';
import AchievementsSection from '../../components/artist/AchievementsSection';
import ChallengeParticipation from '../../components/artist/ChallengeParticipation';
import EditArtworkModal from '../../components/artworks/EditArtworkModal';
import DeleteConfirmationModal from '../../components/artworks/DeleteConfirmationModal';
import SmartImage from '../../components/common/SmartImage';
import ImageWithFallback from '../../components/ImageWithFallback';
import ImageDebugger from '../../components/ImageDebugger';
import PostInteractions from '../../components/social/PostInteractions';
import { getImageUrl, getAvatarUrl, getCoverUrl, getArtworkUrl } from '../../util/imageUrlResolver';
import { logProfileUpdate, clearImageCache, forceReloadProfileImages } from '../../util/debugImageUpload';
import { useAuth } from "../../context/AuthContext";
import artistArtworkOrderApi from '../../services/artistArtworkOrderApi';
import challengeParticipationApi from '../../services/challengeParticipationApi';
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
  User,
  DollarSign,
  Share2,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target,
  Globe,
  ArrowLeft,
  FileText,
  Shield,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Truck,
  CheckCircle,
  Package
} from 'lucide-react';

import { useImageWithFallback } from '../../util/imageUtils';
import { formatLKR } from '../../util/currency';
import { useNotification } from '../../context/NotificationContext';

const ArtistPortfolio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError, showInfo } = useNotification();

  // Get initial tab from URL or default to 'portfolio'
  const initialTab = searchParams.get('tab') || 'portfolio';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Handle tab changes using React Router
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Sync activeTab with URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab') || 'portfolio';
    setActiveTab(urlTab);
  }, [searchParams]);

  // Prevent navigation away from portfolio (back to login page)
  useEffect(() => {
    // Trap user on portfolio route unless logging out, but allow tab switching
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave? Please use the logout button.';
      return 'Are you sure you want to leave? Please use the logout button.';
    };

    // Listen for popstate (back/forward button)
    const handlePopState = (event) => {
      // If leaving portfolio route, trap user
      if (!window.location.pathname.includes('/artist/artistportfolio')) {
        const currentTab = searchParams.get('tab') || 'portfolio';
        const portfolioUrl = `/artist/artistportfolio?tab=${currentTab}`;
        window.history.pushState({ tab: currentTab, page: 'portfolio' }, '', portfolioUrl);
        showInfo('Please use the logout button to leave your portfolio.');
      }
      // Otherwise, allow tab switching (do nothing)
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [searchParams, showInfo]);

  // On mount, push a dummy state only once
  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'portfolio';
    const portfolioUrl = `/artist/artistportfolio?tab=${currentTab}`;
    window.history.pushState({ tab: currentTab, page: 'portfolio' }, '', portfolioUrl);
  }, []); // Only on mount

  // Helper functions for achievement display
  const getAchievementIcon = (iconType) => {
    const iconMap = {
      trophy: <Trophy className="h-4 w-4" />,
      star: <Star className="h-4 w-4" />,
      medal: <Medal className="h-4 w-4" />,
      award: <Award className="h-4 w-4" />,
      certificate: <FileText className="h-4 w-4" />,
      badge: <Shield className="h-4 w-4" />
    };
    return iconMap[iconType] || <Trophy className="h-4 w-4" />;
  };

  const getAchievementColor = (colorScheme) => {
    const colorMap = {
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      silver: 'bg-gray-100 text-gray-800 border-gray-200',
      bronze: 'bg-orange-100 text-orange-800 border-orange-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    return colorMap[colorScheme] || 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingArtwork, setIsAddingArtwork] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isChangingCover, setIsChangingCover] = useState(false);
  const [isViewingArtwork, setIsViewingArtwork] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isEditingArtwork, setIsEditingArtwork] = useState(false);
  const [isDeletingArtwork, setIsDeletingArtwork] = useState(false);

  // Post deletion confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Commission requests state
  const [commissionRequests, setCommissionRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Commission action modal state
  const [showCommissionActionModal, setShowCommissionActionModal] = useState(false);
  const [selectedCommissionRequest, setSelectedCommissionRequest] = useState(null);
  const [commissionAction, setCommissionAction] = useState('accept'); // 'accept' or 'reject'

  // Artwork orders state
  const [artworkOrders, setArtworkOrders] = useState([]);
  const [artworkOrdersCount, setArtworkOrdersCount] = useState(0);
  const [pendingDeliveryOrdersCount, setPendingDeliveryOrdersCount] = useState(0);
  const [loadingArtworkOrders, setLoadingArtworkOrders] = useState(false);

  // Challenge count state
  const [challengesCount, setChallengesCount] = useState(0);

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

  const { token, role, userId, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [portfolioPosts, setPortfolioPosts] = useState([]);
  const [postImageIndex, setPostImageIndex] = useState({}); // Track current image index for each post

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
  const [artistProfile, setArtistProfile] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [topAchievements, setTopAchievements] = useState([]);
  const [exhibitionsCount, setExhibitionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageRefreshKey, setImageRefreshKey] = useState(0); // Force image refresh

  // Debug logging for authentication and API
  useEffect(() => {
    console.log('🔍 ArtistPortfolio Debug Info:');
    console.log('API_URL:', API_URL);
    console.log('userId:', userId);
    console.log('token exists:', !!token);
    console.log('role:', role);
  }, [API_URL, userId, token, role]);

  // Debug effect to track achievementsCount changes
  useEffect(() => {
    if (achievementsCount > 0) {
      console.log('AchievementsCount updated to:', achievementsCount);
    }
  }, [achievementsCount]);

  // Reusable function to fetch artist profile data
  const fetchProfile = async (bustCache = false) => {
    console.log('🚀 fetchProfile called with:', { userId, token: !!token, bustCache });

    if (!userId || !token) {
      console.warn("Missing userId or token. Skipping profile fetch.");
      console.log("userId:", userId, "token exists:", !!token);
      return;
    }

    try {
      setLoading(true);

      // Add cache busting parameter when needed
      const url = bustCache
        ? `${API_URL}/api/artist/profile/${userId}?t=${Date.now()}`
        : `${API_URL}/api/artist/profile/${userId}`;

      console.log('📡 Making API request to:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Profile API response:', response.data);

      // Transform the response to match the expected structure
      const profileData = response.data;
      console.log('Profile data received:', profileData);

      const avatarUrl = getAvatarUrl(profileData.avatarUrl);
      const coverUrl = getCoverUrl(profileData.coverImageUrl);

      console.log('Raw avatar path from backend:', profileData.avatarUrl);
      console.log('Raw cover path from backend:', profileData.coverImageUrl);
      console.log('Processed Avatar URL:', avatarUrl);
      console.log('Processed Cover URL:', coverUrl);

      setArtistProfile({
        ...profileData,
        name: `${profileData.firstName} ${profileData.lastName}`,
        avatar: avatarUrl,
        coverImage: coverUrl,
        joinDate: profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently joined',
        phone: profileData.contactNo,
        stats: {
          artworks: profileData.artworksCount || 0,
          sales: profileData.totalSales || 0,
          followers: profileData.totalFollowers || 0,
          views: profileData.totalViews || 0
        }
      });

      console.log('✅ Artist profile updated successfully');
    } catch (error) {
      console.error("❌ Error fetching profile:", error);

      // Detailed error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      console.error("Full error config:", error.config);
      // Fallback to default profile if fetch fails
      setArtistProfile({
        name: 'Artist Profile',
        bio: 'No bio available',
        location: 'Not specified',
        joinDate: 'Recently joined',
        website: '',
        instagram: '',
        twitter: '',
        phone: '',
        email: '',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
        coverImage: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=800',
        stats: {
          artworks: 0,
          sales: 0,
          followers: 0,
          views: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch artist profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, [userId, token]);

  // Fetch recent achievements function (reusable)
  const fetchAchievementsData = async () => {
    if (!userId) {
      console.warn("Missing userId. Skipping achievements fetch.");
      return;
    }

    try {
      console.log('Fetching achievements for userId:', userId);

      // Add headers if token is available
      const config = {};
      if (token) {
        config.headers = {
          'Authorization': `Bearer ${token}`
        };
      }

      const response = await axios.get(`${API_URL}/api/achievements/artist/${userId}`, config);

      const achievements = response.data || [];
      console.log('Achievements loaded:', achievements.length);

      // Set the total count for navigation tab
      setAchievementsCount(achievements.length);

      // Transform achievements data to match the display format
      const sortedAchievements = achievements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Get the 3 most recent for sidebar
      const recentForSidebar = sortedAchievements
        .slice(0, 3)
        .map(achievement => ({
          id: achievement.achievementId,
          title: achievement.title,
          prize: achievement.prize || achievement.type,
          icon: getAchievementIcon(achievement.iconType),
          color: getAchievementColor(achievement.colorScheme)
        }));

      // Get up to 8 achievements for top section, with additional info
      const topForDisplay = sortedAchievements
        .slice(0, 8)
        .map(achievement => ({
          id: achievement.achievementId,
          title: achievement.title,
          prize: achievement.prize || achievement.type,
          type: achievement.type,
          date: new Date(achievement.achievementDate).toLocaleDateString(),
          icon: getAchievementIcon(achievement.iconType),
          color: getAchievementColor(achievement.colorScheme)
        }));

      setRecentAchievements(recentForSidebar);
      setTopAchievements(topForDisplay);
    } catch (error) {
      console.error("Error fetching recent achievements:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      setRecentAchievements([]);
      setTopAchievements([]);
      setAchievementsCount(0);
    }
  };

  // Fetch recent achievements
  useEffect(() => {
    if (userId && token) {
      fetchAchievementsData();
    }
  }, [userId, token]);

  // Fetch exhibitions count function (reusable)
  const fetchExhibitionsCount = async () => {
    if (!userId || !token) {
      console.warn("Missing userId or token. Skipping exhibitions count fetch.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/exhibitions/artist/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const exhibitions = response.data || [];
      setExhibitionsCount(exhibitions.length);
      console.log('Initial exhibitions count loaded:', exhibitions.length);
    } catch (error) {
      console.error("Error fetching exhibitions count:", error);
      setExhibitionsCount(0);
    }
  };

  // Fetch initial exhibitions count
  useEffect(() => {
    fetchExhibitionsCount();
  }, [userId, token]);

  // Fetch challenges count function
  const fetchChallengesCount = async () => {
    if (!userId || !token) {
      console.warn("Missing userId or token. Skipping challenges count fetch.");
      return;
    }

    try {
      const challengesData = await challengeParticipationApi.getActiveChallenges();
      setChallengesCount(challengesData.length);
      console.log('Initial challenges count loaded:', challengesData.length);
    } catch (error) {
      console.error("Error fetching challenges count:", error);
      setChallengesCount(0);
    }
  };

  // Fetch initial challenges count
  useEffect(() => {
    fetchChallengesCount();
  }, [userId, token]);

  // Fetch commission requests data
  const fetchCommissionRequestsData = async () => {
    if (!userId || !token) {
      console.warn("Missing userId or token. Skipping commission requests fetch.");
      return;
    }

    try {
      setLoadingRequests(true);

      // Fetch commission requests
      const requestsResponse = await axios.get(`${API_URL}/api/commission-requests/artist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (requestsResponse.data && requestsResponse.data.success) {
        setCommissionRequests(requestsResponse.data.data || []);
      }

      // Fetch commission requests count
      const countResponse = await axios.get(`${API_URL}/api/commission-requests/artist/count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (countResponse.data && countResponse.data.success) {
        const countData = countResponse.data.data;
        setRequestsCount(countData.total || 0);
        setPendingRequestsCount(countData.pending || 0);
      }

      console.log('Commission requests data loaded successfully');
    } catch (error) {
      console.error("Error fetching commission requests data:", error);
      setCommissionRequests([]);
      setRequestsCount(0);
      setPendingRequestsCount(0);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch artwork orders data
  const fetchArtworkOrdersData = async () => {
    if (!userId || !token) {
      console.warn("Missing userId or token. Skipping artwork orders fetch.");
      return;
    }

    try {
      setLoadingArtworkOrders(true);

      // Fetch artwork orders
      const ordersResponse = await artistArtworkOrderApi.getArtworkOrders();
      if (ordersResponse && ordersResponse.success) {
        setArtworkOrders(ordersResponse.data || []);
      }

      // Fetch artwork orders count
      const countResponse = await artistArtworkOrderApi.getArtworkOrdersCount();
      if (countResponse && countResponse.success) {
        const countData = countResponse.data;
        setArtworkOrdersCount(countData.total || 0);
        setPendingDeliveryOrdersCount(countData.pendingDelivery || 0);
      }

      console.log('Artwork orders data loaded successfully');
    } catch (error) {
      console.error("Error fetching artwork orders data:", error);
      setArtworkOrders([]);
      setArtworkOrdersCount(0);
      setPendingDeliveryOrdersCount(0);
    } finally {
      setLoadingArtworkOrders(false);
    }
  };

  // Handle request delivery for artwork order
  const handleArtworkOrderDeliveryRequest = async (orderId) => {
    try {
      const response = await artistArtworkOrderApi.requestDelivery(orderId);
      if (response && response.success) {
        showSuccess(response.message);
        // Refresh artwork orders data to show updated delivery status
        await fetchArtworkOrdersData();
      } else {
        showError(response.message || 'Failed to request delivery');
      }
    } catch (error) {
      console.error('Error requesting delivery:', error);
      showError(error.message || 'An error occurred while requesting delivery');
    }
  };

  // Fetch initial data
  useEffect(() => {
    if (userId && token) {
      fetchCommissionRequestsData();
      fetchArtworkOrdersData();
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!role || !userId || !token) {
        console.warn("Missing role, userId, or token. Skipping fetch.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/posts/${role}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Posts API response:', response.data);

        // Sort posts by creation date (newest first) as a fallback
        const sortedPosts = Array.isArray(response.data) ? response.data.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // Descending order (newest first)
        }) : [];

        setPortfolioPosts(sortedPosts);
        console.log('Set posts state:', sortedPosts.length, 'posts');
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [role, userId, token]); // 👈 Add these so it re-runs when context loads

  const [artworks, setArtworks] = useState([]);
  const [artworksLoading, setArtworksLoading] = useState(false);
  const [artworksError, setArtworksError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!userId) {
        console.log('No userId available, skipping artwork fetch');
        setArtworks([]);
        return;
      }

      console.log('Fetching artworks for userId:', userId);
      setArtworksLoading(true);
      setArtworksError(null);

      try {
        const token = localStorage.getItem('token');
        console.log('Token available:', !!token);

        const response = await axios.get(`${API_URL}/api/artworks/artist/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Artworks API response:', response.data);
        if (response.data && response.data.length > 0) {
          console.log('First artwork data:', response.data[0]);
          console.log('Sample imageUrl:', response.data[0]?.imageUrl);
          console.log('Artworks order (by creation date):');
          response.data.forEach((artwork, index) => {
            console.log(`${index + 1}. ${artwork.title} - Created: ${artwork.createdAt} - ID: ${artwork.artworkId}`);
          });
        }

        // Ensure response.data is an array
        const artworksData = Array.isArray(response.data) ? response.data : [];

        // Sort artworks by creation date (newest first) as a fallback
        const sortedArtworks = artworksData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });

        // Debug: Check for duplicate IDs
        const ids = sortedArtworks.map(artwork => artwork.artworkId);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          console.error('DUPLICATE ARTWORK IDs DETECTED:', ids);
          sortedArtworks.forEach((artwork, index) => {
            console.log(`${index}: ID=${artwork.artworkId}, Title=${artwork.title}`);
          });
        }

        console.log('After sorting - first artwork:', sortedArtworks[0]?.title);
        setArtworks(sortedArtworks);
        console.log('Set artworks state:', sortedArtworks.length, 'artworks');

      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        setArtworksError(error.response?.data?.message || error.message || 'Failed to load artworks');
        setArtworks([]);
      } finally {
        setArtworksLoading(false);
      }
    };

    fetchArtworks();
  }, [userId, token]); // Add token to dependencies

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
    if (isEditingProfile && artistProfile) {
      setEditedProfile({
        name: artistProfile.name || '',
        bio: artistProfile.bio || '',
        location: artistProfile.location || '',
        website: artistProfile.website || '',
        instagram: artistProfile.instagram || '',
        twitter: artistProfile.twitter || '',
        phone: artistProfile.phone || artistProfile.contactNo || '',
        email: artistProfile.email || ''
      });
    }
  }, [isEditingProfile, artistProfile]);

  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!userId || !token) {
      showError('Authentication error. Please log in again.');
      return;
    }

    try {
      // Prepare the update data
      const updateData = {
        firstName: editedProfile.name ? editedProfile.name.split(' ')[0] : artistProfile?.firstName || '',
        lastName: editedProfile.name ? editedProfile.name.split(' ').slice(1).join(' ') : artistProfile?.lastName || '',
        bio: editedProfile.bio,
        location: editedProfile.location,
        website: editedProfile.website,
        instagram: editedProfile.instagram,
        twitter: editedProfile.twitter,
        contactNo: editedProfile.phone
      };

      console.log('Updating profile:', updateData);

      const response = await axios.put(
        `${API_URL}/api/artist/profile/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Profile update response:', response.data);

      // Update the local artist profile state
      setArtistProfile(prevProfile => ({
        ...prevProfile,
        name: `${updateData.firstName} ${updateData.lastName}`,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        bio: updateData.bio,
        location: updateData.location,
        website: updateData.website,
        instagram: updateData.instagram,
        twitter: updateData.twitter,
        phone: updateData.contactNo,
        contactNo: updateData.contactNo
      }));

      setIsEditingProfile(false);
      showSuccess('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        if (error.response.status === 401) {
          showError('Authentication failed. Please log in again.');
        } else if (error.response.status === 404) {
          showError('Artist profile not found.');
        } else {
          showError(`Failed to update profile: ${error.response.data || error.response.statusText}`);
        }
      } else {
        showError('Network error. Please check your connection and try again.');
      }
    }
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

  const handleSaveArtwork = async (updatedArtworkData) => {
    try {
      // Get the artwork ID - try different possible property names
      const artworkId = updatedArtworkData.artworkId ||
        updatedArtworkData.artwork_id ||
        updatedArtworkData.id ||
        selectedArtwork?.artworkId ||
        selectedArtwork?.artwork_id ||
        selectedArtwork?.id;

      if (!artworkId) {
        console.error('No artwork ID found in:', updatedArtworkData, selectedArtwork);
        showError('Error: Artwork ID not found. Please try again.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        showError('Authentication error. Please log in again.');
        return;
      }

      console.log('Updating artwork with ID:', artworkId);
      console.log('Updated data being sent:', updatedArtworkData);
      console.log('Original artwork data:', selectedArtwork);

      let response;

      if (updatedArtworkData.imageFile) {
        // If there's an image file, use the upload endpoint with FormData
        const formData = new FormData();

        // Append all fields to FormData
        Object.keys(updatedArtworkData).forEach(key => {
          if (key !== 'imageFile' && key !== 'artworkId' && key !== 'artwork_id' && key !== 'id') {
            const value = updatedArtworkData[key];
            if (value !== null && value !== undefined) {
              formData.append(key, value);
            }
          }
        });

        // Append image file
        formData.append('image', updatedArtworkData.imageFile);

        response = await axios.put(
          `${API_URL}/api/artworks/${artworkId}/upload`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
              // Don't set Content-Type - let axios handle it automatically for multipart
            }
          }
        );
      } else {
        // If no image file, send as JSON to regular endpoint
        const jsonData = {};
        Object.keys(updatedArtworkData).forEach(key => {
          if (key !== 'imageFile' && key !== 'artworkId' && key !== 'artwork_id' && key !== 'id') {
            const value = updatedArtworkData[key];
            if (value !== null && value !== undefined) {
              jsonData[key] = value;
            }
          }
        });

        response = await axios.put(
          `${API_URL}/api/artworks/${artworkId}`,
          jsonData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      console.log('Update response:', response.data);

      // Update the artworks list with the updated artwork from server response
      setArtworks(prevArtworks =>
        prevArtworks.map(artwork => {
          const currentId = artwork.artworkId || artwork.artwork_id || artwork.id;
          if (currentId === artworkId) {
            // Use the server response data which includes updated imageUrl
            const serverData = response.data;
            return {
              ...artwork,
              ...serverData,
              // Ensure consistent ID field naming
              artworkId: serverData.artworkId || serverData.artwork_id || serverData.id || artworkId,
              // Update all possible image field variations
              imageUrl: serverData.imageUrl || serverData.image_url,
              image: serverData.imageUrl || serverData.image_url || serverData.image,
            };
          }
          return artwork;
        })
      );

      setIsEditingArtwork(false);
      setSelectedArtwork(null);

      // Show success message
      showSuccess('Artwork updated successfully!');

    } catch (error) {
      console.error('Error updating artwork:', error);

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        showError(`Failed to update artwork: ${error.response.data || error.message}`);
      } else {
        showError('Failed to update artwork. Please try again.');
      }
    }
  };

  const handleConfirmDeleteArtwork = async () => {
    if (!selectedArtwork) return;

    try {
      const token = localStorage.getItem('token');
      const artworkId = selectedArtwork.artwork_id || selectedArtwork.artworkId || selectedArtwork.id;

      await axios.delete(
        `${API_URL}/api/artworks/${artworkId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Remove the artwork from the artworks list
      setArtworks(prevArtworks =>
        prevArtworks.filter(artwork => {
          const currentId = artwork.artwork_id || artwork.artworkId || artwork.id;
          return currentId !== artworkId;
        })
      );

      setIsDeletingArtwork(false);
      setSelectedArtwork(null);

      // Show success message
      showSuccess('Artwork deleted successfully!');

    } catch (error) {
      console.error('Error deleting artwork:', error);
      showError('Failed to delete artwork. Please try again.');
    }
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

  // Navigation functions for post images
  const navigatePostImage = (postId, direction) => {
    const post = portfolioPosts.find(p => p.post_id === postId);
    if (!post || !post.images || post.images.length <= 1) return;

    setPostImageIndex(prev => {
      const currentIndex = prev[postId] || 0;
      let newIndex;

      if (direction === 'next') {
        newIndex = (currentIndex + 1) % post.images.length;
      } else {
        newIndex = currentIndex === 0 ? post.images.length - 1 : currentIndex - 1;
      }

      return {
        ...prev,
        [postId]: newIndex
      };
    });
  };

  const getCurrentImageIndex = (postId) => {
    return postImageIndex[postId] || 0;
  };

  const handleSavePost = async () => {
    const formData = new FormData();
    formData.append('caption', newPost.caption);
    formData.append('location', 'Colombo'); // optional: make dynamic

    // ✅ Add all images to FormData
    if (newPost.imageFiles && newPost.imageFiles.length > 0) {
      newPost.imageFiles.forEach((file, index) => {
        formData.append('images', file); // Use 'images' to match backend parameter
      });
    }

    // 👇 Check before making request
    if (!token || !role || !userId) {
      console.warn('Missing token, role, or userId. Aborting post creation.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/create`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Post created:', response.data);

      // Reset post state first
      setIsCreatingPost(false);
      setNewPost({
        caption: '',
        imageFiles: [],
      });

      // Show success message
      showSuccess('Post created successfully!');

      // Refresh posts from the server to get the latest data
      try {
        const postsResponse = await axios.get(
          `${API_URL}/api/posts/${role}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Sort posts by creation date (newest first) as a fallback
        const sortedPosts = Array.isArray(postsResponse.data) ? postsResponse.data.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // Descending order (newest first)
        }) : [];

        setPortfolioPosts(sortedPosts);
      } catch (fetchError) {
        console.error('Error fetching updated posts:', fetchError);
        // Fallback to adding the new post to existing posts
        setPortfolioPosts(prevPosts => [response.data, ...prevPosts]);
      }

    } catch (error) {
      console.error('Error uploading post:', error);
      showError('Failed to create post. Please try again.');
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

  const handleSaveNewArtwork = async (artworkData) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        showError('Authentication required. Please log in again.');
        return;
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('title', artworkData.title);
      formData.append('medium', artworkData.medium);
      formData.append('size', artworkData.size || '');
      formData.append('year', artworkData.year || new Date().getFullYear().toString());
      // Ensure price is properly formatted as a number string
      formData.append('price', (parseFloat(artworkData.price) || 0).toString());
      formData.append('description', artworkData.description || '');
      formData.append('category', artworkData.category || '');
      formData.append('tags', artworkData.tags || '');
      formData.append('status', 'Available'); // Default status
      formData.append('featured', 'false'); // Default not featured
      formData.append('artistId', userId);

      // Add image file if provided
      if (artworkData.imageFiles && artworkData.imageFiles.length > 0) {
        formData.append('image', artworkData.imageFiles[0]);
      }

      const response = await axios.post(
        `${API_URL}/api/artworks/create`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type - let axios handle it automatically
          }
        }
      );

      console.log('Artwork created:', response.data);

      // Add the new artwork to the artworks array
      setArtworks(prevArtworks => [response.data, ...prevArtworks]);

      // Close modal and reset form
      setIsAddingArtwork(false);
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

      // Show success message
      showSuccess('Artwork uploaded successfully!');

    } catch (error) {
      console.error('Error creating artwork:', error);

      if (error.response) {
        if (error.response.status === 401) {
          showError('Authentication failed. Please log in again.');
        } else if (error.response.status === 400) {
          showError(`Invalid data: ${error.response.data.message || 'Please check your input.'}`);
        } else {
          showError(`Failed to upload artwork: ${error.response.data.message || 'Server error'}`);
        }
      } else {
        showError('Network error. Please check your connection and try again.');
      }
    }
  };

  // ...existing code...

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
        showError("You must be logged in to delete posts.");
        return;
      }

      // Call backend delete API with Authorization header
      await axios.delete(`${API_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI after successful deletion - use post_id instead of id
      setPortfolioPosts((prevPosts) => prevPosts.filter(post => post.post_id !== postId));

      showSuccess("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      showError("Failed to delete the post. Try again.");
    }
  };

  // Handle delete confirmation
  const handleDeletePostConfirm = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  // Handle confirmed deletion
  const confirmDeletePost = async () => {
    if (postToDelete) {
      await handleDeletePost(postToDelete.post_id);
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDeletePost = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditPost = (post) => {
    setEditingItem(post);
    setShowEditModal(true);
  };

  const handleEditSavePost = async (updatedPost) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        showError("You must be logged in to edit posts.");
        return;
      }

      console.log('Updating post:', updatedPost);

      // Create FormData for multipart request as expected by backend
      const formData = new FormData();
      formData.append('caption', updatedPost.caption);

      // Add location if it exists
      if (updatedPost.location) {
        formData.append('location', updatedPost.location);
      }

      // The backend expects @RequestPart, so send as multipart/form-data
      const response = await axios.put(
        `${API_URL}/api/posts/${updatedPost.post_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let axios handle multipart/form-data
          }
        }
      );

      console.log('Update response:', response.data);

      // Update the local state with the updated data
      setPortfolioPosts(prevPosts =>
        prevPosts.map(post =>
          post.post_id === updatedPost.post_id ? { ...post, caption: updatedPost.caption, location: updatedPost.location } : post
        )
      );

      // Close the edit modal
      setShowEditModal(false);
      setEditingItem(null);

      showSuccess('Post updated successfully!');

    } catch (error) {
      console.error('Error updating post:', error);

      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);

        if (error.response.status === 401) {
          showError('Authentication failed. Please log in again.');
        } else if (error.response.status === 403) {
          showError('You are not authorized to edit this post.');
        } else if (error.response.status === 404) {
          showError('Post not found.');
        } else {
          showError(`Failed to update post: ${error.response.data || error.response.statusText}`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        showError('Network error. Please check your connection and try again.');
      } else {
        console.error('Request setup error:', error.message);
        showError('Failed to update post. Please try again.');
      }
    }
  };

  const safeFormatDistanceToNow = (date) => {
    if (!date) return "Unknown time";

    // Handle different date formats that might come from the backend
    let d;
    if (typeof date === 'string') {
      // Try parsing as ISO string first
      d = new Date(date);

      // If that fails, try parsing as timestamp
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
  };  // Handler to close the artwork detail modal
  const handleCloseArtworkView = () => {
    setIsViewingArtwork(false);
    setSelectedArtwork(null);
  };

  // Missing handler functions
  const handleViewArtworkDetail = (artwork) => {
    setSelectedArtwork(artwork);
    setIsViewingArtwork(true);
  };

  const handleEditArtwork = (artwork) => {
    console.log('Opening edit modal for artwork:', artwork);
    setSelectedArtwork(artwork);
    setIsEditingArtwork(true);
  };

  const handleDeleteArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setIsDeletingArtwork(true);
  };

  const handleCancelEditArtwork = () => {
    setIsEditingArtwork(false);
    setSelectedArtwork(null);
  };

  const handleCancelDeleteArtwork = () => {
    setIsDeletingArtwork(false);
    setSelectedArtwork(null);
  };

  // Logout functionality
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleToggleFeature = async (artwork) => {
    try {
      const artworkId = artwork.artwork_id || artwork.artworkId || artwork.id;
      const token = localStorage.getItem('token');

      if (!token) {
        showError('You must be logged in to update artwork.');
        return;
      }

      // Toggle the featured status
      const updatedData = { featured: !artwork.featured };

      // Make API call to update the backend
      const response = await axios.put(
        `${API_URL}/api/artworks/${artworkId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      const updatedArtwork = { ...artwork, ...response.data };
      setArtworks(prevArtworks =>
        prevArtworks.map(art => {
          const currentId = art.artwork_id || art.artworkId || art.id;
          return currentId === artworkId ? updatedArtwork : art;
        })
      );

      setSelectedArtwork(updatedArtwork);
      showSuccess(`Artwork ${updatedArtwork.featured ? 'featured' : 'unfeatured'} successfully!`);
    } catch (error) {
      console.error('Error toggling feature status:', error);
      showError('Failed to update feature status');
    }
  };

  const handleMarkAsSold = async (artwork) => {
    try {
      const artworkId = artwork.artwork_id || artwork.artworkId || artwork.id;
      const token = localStorage.getItem('token');

      if (!token) {
        showError('You must be logged in to update artwork.');
        return;
      }

      // Mark the artwork as sold
      const updatedData = { status: 'Sold' };

      // Make API call to update the backend
      const response = await axios.put(
        `${API_URL}/api/artworks/${artworkId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      const updatedArtwork = { ...artwork, ...response.data };
      setArtworks(prevArtworks =>
        prevArtworks.map(art => {
          const currentId = art.artwork_id || art.artworkId || art.id;
          return currentId === artworkId ? updatedArtwork : art;
        })
      );

      setSelectedArtwork(updatedArtwork);
      showSuccess('Artwork marked as sold!');
    } catch (error) {
      console.error('Error marking artwork as sold:', error);
      showError('Failed to mark artwork as sold');
    }
  };

  const handleCancelCoverChange = () => {
    setIsChangingCover(false);
  };

  const handleSaveCover = async (newCoverImage) => {
    try {
      if (!userId || !token) {
        showError('Authentication error. Please log in again.');
        return;
      }

      console.log('Uploading new cover image:', newCoverImage);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', newCoverImage);

      const response = await axios.post(
        `${API_URL}/api/artist/profile/${userId}/cover`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Cover upload response:', response.data);
      logProfileUpdate('Cover', response.data);

      // Clear old image from cache and force refresh
      if (artistProfile?.coverImage) {
        clearImageCache(artistProfile.coverImage.split('?')[0]);
      }

      // Force image refresh by updating key
      setImageRefreshKey(prev => prev + 1);

      // Immediately update local state for instant feedback
      if (response.data.imageUrl) {
        const newCoverUrl = getCoverUrl(response.data.imageUrl);
        setArtistProfile(prevProfile => ({
          ...prevProfile,
          coverImage: newCoverUrl
        }));

        // Clear cache for new image as well
        clearImageCache(newCoverUrl.split('?')[0]);
      }

      // Small delay to ensure database update is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh the profile from the server to get the latest data with cache busting
      await fetchProfile(true);

      setIsChangingCover(false);
      showSuccess('Cover image updated successfully!');

    } catch (error) {
      console.error('Error uploading cover image:', error);
      showError('Failed to update cover image. Please try again.');
    }
  };

  const handleAvatarUpload = async (avatarFile) => {
    try {
      if (!userId || !token) {
        showError('Authentication error. Please log in again.');
        return;
      }

      console.log('Uploading new avatar:', avatarFile);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', avatarFile);

      const response = await axios.post(
        `${API_URL}/api/artist/profile/${userId}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Avatar upload response:', response.data);
      logProfileUpdate('Avatar', response.data);

      // Clear old image from cache and force refresh
      if (artistProfile?.avatar) {
        clearImageCache(artistProfile.avatar.split('?')[0]);
      }

      // Force image refresh by updating key
      setImageRefreshKey(prev => prev + 1);

      // Immediately update local state for instant feedback
      if (response.data.imageUrl) {
        const newAvatarUrl = getAvatarUrl(response.data.imageUrl);
        setArtistProfile(prevProfile => ({
          ...prevProfile,
          avatar: newAvatarUrl
        }));

        // Clear cache for new image as well
        clearImageCache(newAvatarUrl.split('?')[0]);
      }

      // Small delay to ensure database update is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh the profile from the server to get the latest data with cache busting
      await fetchProfile(true);

      alert('Profile picture updated successfully!');

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to update profile picture. Please try again.');
    }
  };

  // Commission request handler functions
  const handleAcceptCommissionRequest = async (requestId, deadline) => {
    try {
      const response = await axios.post(`${API_URL}/api/commission-requests/${requestId}/accept`, {
        deadline: deadline
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        showSuccess('Commission request accepted successfully!');
        // Refresh the commission requests data
        await fetchCommissionRequestsData();
      } else {
        showError(response.data?.message || 'Failed to accept commission request');
      }
    } catch (error) {
      console.error('Error accepting commission request:', error);
      showError('An error occurred while accepting the commission request');
    }
  };

  const handleRejectCommissionRequest = async (requestId, rejectionReason) => {
    try {
      const response = await axios.post(`${API_URL}/api/commission-requests/${requestId}/reject`, {
        rejectionReason: rejectionReason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        showSuccess('Commission request rejected successfully!');
        // Refresh the commission requests data
        await fetchCommissionRequestsData();
      } else {
        showError(response.data?.message || 'Failed to reject commission request');
      }
    } catch (error) {
      console.error('Error rejecting commission request:', error);
      showError('An error occurred while rejecting the commission request');
    }
  };

  // Commission action modal handlers
  const handleOpenAcceptModal = (request) => {
    setSelectedCommissionRequest(request);
    setCommissionAction('accept');
    setShowCommissionActionModal(true);
  };

  const handleOpenRejectModal = (request) => {
    setSelectedCommissionRequest(request);
    setCommissionAction('reject');
    setShowCommissionActionModal(true);
  };

  const handleCloseCommissionActionModal = () => {
    setShowCommissionActionModal(false);
    setSelectedCommissionRequest(null);
    setCommissionAction('accept');
  };

  // Delivery request handler
  const handleRequestDelivery = async (requestId) => {
    try {
      const response = await axios.post(`${API_URL}/api/commission-requests/${requestId}/request-delivery`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        showSuccess('Delivery request submitted successfully!');

        // Update the specific commission request in state immediately
        setCommissionRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId
              ? { ...request, delivery_status: 'pending' }
              : request
          )
        );
      } else {
        showError(response.data?.message || 'Failed to request delivery');
      }
    } catch (error) {
      console.error('Error requesting delivery:', error);
      showError('An error occurred while requesting delivery');
    }
  };

  // Loading state
  if (loading || !artistProfile) {
    return (
      <div className="min-h-screen bg-[#fdf9f4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7f5539] mx-auto"></div>
          <p className="mt-4 text-[#7f5539] text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f4] py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <ImageWithFallback
            src={artistProfile.coverImage}
            fallback="/heritage.jpeg"
            alt="Cover"
            className="w-full h-full object-cover"
            forceRefresh={imageRefreshKey > 0}
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
              <ImageWithFallback
                src={artistProfile.avatar}
                fallback="/art1.jpeg"
                alt={artistProfile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                forceRefresh={imageRefreshKey > 0}
              />

              {/* Verified Badge */}
              {artistProfile.status === 'Active' && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white" title="Verified Artist">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}

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
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-[#7f5539]">{artistProfile.name}</h2>
                    {artistProfile.status === 'Active' && (
                      <div className="flex items-center" title="Verified Artist">
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      </div>
                    )}
                  </div>
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
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="bg-[#D87C5A] text-white px-6 py-2 rounded-lg hover:bg-[#c5704f] transition-colors font-medium flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
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
                  {topAchievements.length > 0 ? (
                    topAchievements.map((achievement, index) => (
                      <div
                        key={achievement.id || `top-achievement-${index}`}
                        className={`p-3 rounded-lg border-2 ${achievement.color} hover:scale-105 transition-transform cursor-pointer`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {achievement.icon}
                          <span className="font-medium text-sm">{achievement.type ? achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1) : 'Achievement'}</span>
                        </div>
                        <div className="text-xs font-medium mb-1">{achievement.title}</div>
                        <div className="text-xs opacity-75">{achievement.prize}</div>
                        <div className="text-xs opacity-60 mt-1">{achievement.date}</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Trophy className="h-12 w-12 text-[#7f5539]/30 mx-auto mb-3" />
                      <p className="text-[#7f5539]/60 mb-2">No achievements yet</p>
                      <p className="text-sm text-[#7f5539]/40">Start creating and winning competitions to earn achievements!</p>
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
                { id: 'tosell', label: 'To sell', count: Array.isArray(artworks) ? artworks.length : 0 },
                { id: 'challenges', label: 'Challenges', count: challengesCount, icon: Trophy },
                { id: 'orders', label: 'Commission Requests', count: requestsCount },
                { id: 'artwork-orders', label: 'Orders', count: artworkOrdersCount },
                { id: 'exhibitions', label: 'Exhibitions', count: exhibitionsCount },
                { id: 'achievements', label: 'Achievements', count: achievementsCount },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      // Refresh achievements data when achievements tab is clicked
                      if (tab.id === 'achievements' && userId && token) {
                        fetchAchievementsData();
                      }
                      // Refresh commission requests data when tab is clicked
                      if (tab.id === 'orders' && userId && token) {
                        fetchCommissionRequestsData();
                      }
                      // Refresh artwork orders data when tab is clicked
                      if (tab.id === 'artwork-orders' && userId && token) {
                        fetchArtworkOrdersData();
                      }
                    }}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-[#7f5539] text-[#7f5539]'
                      : 'border-transparent text-[#7f5539]/60 hover:text-[#7f5539] hover:border-[#7f5539]/30'
                      }`}
                  >
                    {tab.label}
                    {(tab.count !== undefined && tab.count !== null) && (
                      <span className="ml-2 bg-[#7f5539]/10 text-[#7f5539] px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
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
                      <span className="font-semibold text-[#7f5539]">{portfolioPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7f5539]/70">Total Comments</span>
                      <span className="font-semibold text-[#7f5539]">{portfolioPosts.reduce((sum, post) => sum + (post.comments || 0), 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7f5539]/70">Avg. Engagement</span>
                      <span className="font-semibold text-[#7f5539]">
                        {portfolioPosts.length > 0
                          ? Math.round((portfolioPosts.reduce((sum, post) => sum + (post.likes || 0) + (post.comments || 0), 0)) / portfolioPosts.length)
                          : 0}
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
                    {recentAchievements.length > 0 ? (
                      recentAchievements.map((achievement, index) => (
                        <div key={achievement.id || `recent-achievement-${index}`} className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${achievement.color}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#7f5539]">{achievement.title}</p>
                            <p className="text-xs text-[#7f5539]/60">{achievement.prize}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Trophy className="h-8 w-8 text-[#7f5539]/30 mx-auto mb-2" />
                        <p className="text-sm text-[#7f5539]/60">No achievements yet</p>
                        <p className="text-xs text-[#7f5539]/40">Start creating to earn achievements!</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleTabChange('achievements')}
                    className="w-full mt-4 text-[#7f5539] hover:text-[#6e4c34] text-sm font-medium transition-colors"
                  >
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
                      onClick={() => {
                        setNewArtwork({
                          ...newArtwork,
                          category: 'to sell',
                        });
                        setIsAddingArtwork(true);
                      }}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-[#fdf9f4]/30 rounded-lg transition-colors text-left"
                    >
                      <Plus className="h-5 w-5 text-[#7f5539]" />
                      <span className="text-[#7f5539]">Add Artwork</span>
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
                      <ImageWithFallback
                        src={artistProfile.avatar}
                        fallback="/art1.jpeg"
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
                {portfolioPosts.map((post, index) => (
                  <div
                    key={post.post_id || `post-${index}`}
                    className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={artistProfile.avatar}
                          fallback="/art1.jpeg"
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
                          onClick={() => handleDeletePostConfirm(post)}
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

                    {/* Post Images */}
                    <div className="relative">
                      {post.images && post.images.length > 0 ? (
                        <div className="relative group">
                          {/* Main Image Display */}
                          <img
                            src={post.images[getCurrentImageIndex(post.post_id)]?.startsWith('http')
                              ? post.images[getCurrentImageIndex(post.post_id)]
                              : getImageUrl(post.images[getCurrentImageIndex(post.post_id)])}
                            alt={`Post ${post.post_id} - Image ${getCurrentImageIndex(post.post_id) + 1}`}
                            className="w-full h-[32rem] object-cover"
                            onError={(e) => {
                              console.error('Failed to load post feed image:', post.images[getCurrentImageIndex(post.post_id)]);
                              console.error('Post feed: Constructed URL was:', e.target.src);
                              e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                              e.target.onerror = null;
                            }}
                          />

                          {/* Navigation Arrows (show only if multiple images) */}
                          {post.images.length > 1 && (
                            <>
                              {/* Previous Button */}
                              <button
                                onClick={() => navigatePostImage(post.post_id, 'prev')}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              >
                                <ChevronLeft size={20} />
                              </button>

                              {/* Next Button */}
                              <button
                                onClick={() => navigatePostImage(post.post_id, 'next')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                              >
                                <ChevronRight size={20} />
                              </button>

                              {/* Image Counter */}
                              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {getCurrentImageIndex(post.post_id) + 1} / {post.images.length}
                              </div>

                              {/* Dots Indicator */}
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {post.images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setPostImageIndex(prev => ({
                                      ...prev,
                                      [post.post_id]: index
                                    }))}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === getCurrentImageIndex(post.post_id)
                                      ? 'bg-white scale-125'
                                      : 'bg-white/50 hover:bg-white/80'
                                      }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        // Fallback: Show single image if images array is empty but image field exists
                        post.image && (
                          <img
                            src={post.image?.startsWith('http') ? post.image : getImageUrl(post.image)}
                            alt={`Post ${post.post_id}`}
                            className="w-full h-[32rem] object-cover"
                            onError={(e) => {
                              console.error('Failed to load post feed image:', post.image);
                              console.error('Post feed: Constructed URL was:', e.target.src);
                              e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                              e.target.onerror = null;
                            }}
                          />
                        )
                      )}
                    </div>

                    {/* Post Interactions */}
                    <PostInteractions
                      postId={post.post_id}
                      initialLikesCount={post.likes || 0}
                      initialCommentsCount={post.comments || 0}
                    />
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
                    {Array.isArray(artworks) && artworks.slice(0, 4).map((artwork, index) => (
                      <div key={artwork.artworkId || `featured-${index}-${artwork.title || 'unknown'}`} className="flex items-center space-x-3">
                        <img
                          src={artwork.imageUrl?.startsWith('http') ? artwork.imageUrl : getArtworkUrl(artwork.imageUrl)}
                          alt={artwork.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            console.error('Failed to load sidebar image:', artwork.imageUrl);
                            console.error('Sidebar: Constructed URL was:', e.target.src);
                            e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                            e.target.onerror = null;
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#7f5539]">{artwork.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-[#7f5539]/60">
                            <span>{artwork.likes_count || artwork.likes} likes</span>
                            <span>•</span>
                            <span>{artwork.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleTabChange('tosell')}
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
                    {exhibitions.map((exhibition, index) => (
                      <div key={exhibition.id || `exhibition-${index}`} className="p-3 bg-[#fdf9f4]/30 rounded-lg">
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
                  onClick={() => {
                    setNewArtwork({
                      ...newArtwork,
                      category: 'to sell',
                    });
                    setIsAddingArtwork(true);
                  }}
                  className="mt-4 md:mt-0 bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Artwork</span>
                </button>
              </div>
            </div>

            {/* Artworks Grid */}
            {artworksLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f5539] mx-auto mb-4"></div>
                  <p className="text-[#7f5539]/60">Loading artworks...</p>
                </div>
              </div>
            ) : artworksError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-red-600 mb-2">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Error Loading Artworks</h3>
                  </div>
                  <p className="text-red-600 mb-4">{artworksError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : artworks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#7f5539]/60 mb-4">
                  <Palette className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Artworks Yet</h3>
                  <p>Upload your first artwork to get started!</p>
                </div>
                <button
                  onClick={() => {
                    setNewArtwork({
                      ...newArtwork,
                      category: 'to sell',
                    });
                    setIsAddingArtwork(true);
                  }}
                  className="bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Artwork</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork, index) => (
                  <div key={artwork.artworkId || `artwork-${index}-${artwork.title || 'unknown'}`} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={artwork.imageUrl?.startsWith('http') ? artwork.imageUrl : getArtworkUrl(artwork.imageUrl)}
                        alt={artwork.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Failed to load image:', artwork.imageUrl);
                          console.error('Constructed URL was:', e.target.src);
                          e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                          e.target.onerror = null;
                        }}
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
                          onClick={() => handleEditArtwork(artwork)}
                          className="bg-white/90 text-[#7f5539] p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArtwork(artwork)}
                          className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-colors"
                        >
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
                        <span className="text-lg font-bold text-[#7f5539]">{formatLKR(artwork.price)}</span>
                        <span className="text-sm text-[#7f5539]/60">{artwork.year}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-[#7f5539]/60">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{artwork.likesCount || artwork.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{artwork.viewsCount || artwork.views || 0}</span>
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
            )}
          </div>
        )}

        {/* Commission Requests Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Commission Requests Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-2">Commission Requests</h3>
                  <p className="text-[#7f5539]/70">Manage custom artwork commission requests from customers</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-blue-600 font-medium">Total Requests: </span>
                    <span className="text-blue-800 font-bold">{requestsCount}</span>
                  </div>
                  <div className="bg-orange-50 px-4 py-2 rounded-lg">
                    <span className="text-orange-600 font-medium">Pending: </span>
                    <span className="text-orange-800 font-bold">{pendingRequestsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Requests List */}
            <div className="bg-white rounded-lg shadow-sm">
              {loadingRequests ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f5539] mx-auto"></div>
                  <p className="mt-2 text-[#7f5539]/70">Loading commission requests...</p>
                </div>
              ) : commissionRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-16 w-16 text-[#7f5539]/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#7f5539] mb-2">No Commission Requests Yet</h3>
                  <p className="text-[#7f5539]/70">You haven't received any commission requests yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#fdf9f4]/50">
                  {commissionRequests.map((request) => (
                    <div key={request.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        {/* Commission Request Info */}
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {request.referenceImages && request.referenceImages.length > 0 && (
                              <img
                                src={getImageUrl(request.referenceImages[0])}
                                alt="Reference"
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-[#7f5539] truncate">{request.title}</h4>
                              <p className="text-sm text-[#7f5539]/70 mb-2">From: {request.name} ({request.email})</p>
                              <p className="text-[#7f5539]/80 text-sm mb-3 line-clamp-2">{request.additionalNotes}</p>

                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center text-[#7f5539]/70">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Budget: LKR {request.budget}
                                </div>
                                {request.artworkType && (
                                  <div className="flex items-center text-[#7f5539]/70">
                                    <Palette className="h-4 w-4 mr-1" />
                                    Type: {request.artworkType}
                                  </div>
                                )}
                                {request.style && (
                                  <div className="flex items-center text-[#7f5539]/70">
                                    <Target className="h-4 w-4 mr-1" />
                                    Style: {request.style}
                                  </div>
                                )}
                                {request.dimensions && (
                                  <div className="flex items-center text-[#7f5539]/70">
                                    <Target className="h-4 w-4 mr-1" />
                                    Size: {request.dimensions}
                                  </div>
                                )}
                                {request.deadline && (
                                  <div className="flex items-center text-[#7f5539]/70">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Deadline: {request.deadline}
                                  </div>
                                )}
                                {request.urgency && (
                                  <div className="flex items-center text-[#7f5539]/70">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Urgency: {request.urgency}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Commission Request Status & Actions */}
                        <div className="flex flex-col items-end space-y-3">
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                              request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {request.status}
                          </span>

                          {/* Action Buttons */}
                          {request.status === 'PENDING' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenAcceptModal(request)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                              >
                                <Save className="h-4 w-4" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(request)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                              >
                                <X className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}

                          {/* Delivery Request Button for Accepted Commissions */}
                          {request.status === 'ACCEPTED' && (!request.delivery_status || request.delivery_status === 'N/A' || request.delivery_status === null || request.delivery_status === 'not_requested') && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRequestDelivery(request.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                              >
                                <Truck className="h-4 w-4" />
                                <span>Request for Delivery</span>
                              </button>
                            </div>
                          )}

                          {/* Delivery Status Display */}
                          {request.status === 'ACCEPTED' && request.delivery_status && request.delivery_status !== 'N/A' && (
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${request.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.delivery_status === 'outForDelivery' ? 'bg-blue-100 text-blue-800' :
                                  request.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                <Truck className="h-3 w-3" />
                                <span>
                                  {request.delivery_status === 'pending' ? 'Delivery Pending' :
                                    request.delivery_status === 'outForDelivery' ? 'Out for Delivery' :
                                      request.delivery_status === 'delivered' ? 'Delivered' :
                                        request.delivery_status}
                                </span>
                              </span>
                            </div>
                          )}

                          {/* Request Date */}
                          <div className="flex items-center text-xs text-[#7f5539]/50">
                            <Clock className="h-3 w-3 mr-1" />
                            {request.submittedAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Artwork Orders Tab */}
        {activeTab === 'artwork-orders' && (
          <div className="space-y-8">
            {/* Artwork Orders Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#7f5539] mb-2">Artwork Orders</h3>
                  <p className="text-[#7f5539]/70">Manage orders for your artworks and request delivery</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-blue-600 font-medium">Total Orders: </span>
                    <span className="text-blue-800 font-bold">{artworkOrdersCount}</span>
                  </div>
                  <div className="bg-orange-50 px-4 py-2 rounded-lg">
                    <span className="text-orange-600 font-medium">Pending Delivery: </span>
                    <span className="text-orange-800 font-bold">{pendingDeliveryOrdersCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork Orders List */}
            <div className="bg-white rounded-lg shadow-sm">
              {loadingArtworkOrders ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f5539] mx-auto"></div>
                  <p className="mt-2 text-[#7f5539]/70">Loading artwork orders...</p>
                </div>
              ) : artworkOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-16 w-16 text-[#7f5539]/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#7f5539] mb-2">No Artwork Orders Yet</h3>
                  <p className="text-[#7f5539]/70">You haven't received any artwork orders yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#fdf9f4]/50">
                  {artworkOrders.map((order) => (
                    <div key={order.orderId} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              {/* Order Header */}
                              <div className="flex items-center space-x-3 mb-3">
                                <h4 className="text-lg font-semibold text-[#7f5539]">
                                  Order #{order.orderId}
                                </h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  {order.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.deliveryStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                                  order.deliveryStatus === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                    order.deliveryStatus === 'outForDelivery' ? 'bg-purple-100 text-purple-800' :
                                      order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                  }`}>
                                  {order.deliveryStatus === 'outForDelivery' ? 'Out for Delivery' :
                                    order.deliveryStatus === 'N/A' ? 'No Delivery' :
                                      order.deliveryStatus}
                                </span>
                              </div>

                              {/* Buyer Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-[#7f5539]/70">Buyer</p>
                                  <p className="font-medium text-[#7f5539]">{order.buyerFullName}</p>
                                  <p className="text-sm text-[#7f5539]/60">{order.buyerEmail}</p>
                                  {order.buyerContactNumber && (
                                    <p className="text-sm text-[#7f5539]/60">{order.buyerContactNumber}</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm text-[#7f5539]/70">Order Details</p>
                                  <p className="font-medium text-[#7f5539]">
                                    Total: LKR {order.totalAmount?.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-[#7f5539]/60">
                                    Items: {order.totalItemsCount}
                                  </p>
                                  <p className="text-sm text-[#7f5539]/60">
                                    {formatDistanceToNow(new Date(order.orderDate))} ago
                                  </p>
                                </div>
                              </div>

                              {/* Order Items */}
                              {order.orderItems && order.orderItems.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm text-[#7f5539]/70 mb-2">Ordered Items:</p>
                                  <div className="space-y-2">
                                    {order.orderItems.map((item) => (
                                      <div key={item.itemId} className="flex items-center space-x-3 p-2 bg-[#fdf9f4]/30 rounded-lg">
                                        {item.artworkImageUrl && (
                                          <img
                                            src={getArtworkUrl(item.artworkImageUrl)}
                                            alt={item.artworkTitle}
                                            className="w-12 h-12 rounded-lg object-cover"
                                          />
                                        )}
                                        <div className="flex-1">
                                          <p className="font-medium text-[#7f5539] text-sm">{item.artworkTitle}</p>
                                          <div className="flex items-center space-x-4 text-xs text-[#7f5539]/60">
                                            <span>Qty: {item.quantity}</span>
                                            <span>LKR {item.price?.toFixed(2)}</span>
                                            {item.artworkMedium && <span>{item.artworkMedium}</span>}
                                            {item.artworkSize && <span>{item.artworkSize}</span>}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Shipping Address */}
                              {order.shippingAddress && (
                                <div className="mb-4">
                                  <p className="text-sm text-[#7f5539]/70 mb-1">Shipping Address:</p>
                                  <p className="text-sm text-[#7f5539]/80">{order.shippingAddress}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-col items-end space-y-3">
                          {/* Order Date */}
                          <div className="flex items-center text-xs text-[#7f5539]/50">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(order.orderDate))} ago
                          </div>

                          {/* Delivery Request Button */}
                          {(order.deliveryStatus === 'N/A' || order.deliveryStatus === null) && order.status === 'paid' && (
                            <button
                              onClick={() => handleArtworkOrderDeliveryRequest(order.orderId)}
                              className="px-4 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors text-sm font-medium flex items-center space-x-2"
                            >
                              <Truck className="h-4 w-4" />
                              <span>Request Delivery</span>
                            </button>
                          )}

                          {/* Status Messages */}
                          {order.deliveryStatus === 'pending' && (
                            <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                              Delivery request sent
                            </div>
                          )}
                          {order.deliveryStatus === 'accepted' && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                              Delivery accepted
                            </div>
                          )}
                          {order.deliveryStatus === 'delivered' && (
                            <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                              Order delivered
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <ChallengeParticipation onChallengeCountChange={setChallengesCount} />
        )}

        {/* Exhibitions Tab */}
        {activeTab === 'exhibitions' && (
          <ExhibitionsSection
            onExhibitionsCountChange={setExhibitionsCount}
          />
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <AchievementsSection
            artistId={userId}
            isOwnProfile={true}
            onAchievementsCountChange={setAchievementsCount}
            onAchievementsRefresh={fetchAchievementsData}
          />
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
                        {(portfolioPosts.reduce((sum, post) => sum + (post.likes || 0) + (post.comments || 0), 0) +
                          (Array.isArray(artworks) ? artworks.reduce((sum, art) => sum + (art.likes || 0), 0) : 0)).toLocaleString()}
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
                      {Array.isArray(artworks) && artworks.length > 0
                        ? Math.round(artworks.reduce((sum, art) => sum + (art.views || 0), 0) / artworks.length)
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Avg. Likes per Artwork</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {Array.isArray(artworks) && artworks.length > 0
                        ? Math.round(artworks.reduce((sum, art) => sum + (art.likes || 0), 0) / artworks.length)
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Target className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Conversion Rate</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {artistProfile.stats.artworks > 0
                        ? ((artistProfile.stats.sales / artistProfile.stats.artworks) * 100).toFixed(1)
                        : '0.0'}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/50 rounded-lg">
                    <div className="flex items-center">
                      <Star className="text-[#7f5539] mr-2" size={16} />
                      <span className="text-sm font-medium">Featured Artworks</span>
                    </div>
                    <span className="text-[#7f5539] font-semibold">
                      {Array.isArray(artworks) ? artworks.filter(art => art.featured).length : 0}
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
                              src={artwork.imageUrl?.startsWith('http') ? artwork.imageUrl : getArtworkUrl(artwork.imageUrl)}
                              alt={artwork.title}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                console.error('Failed to load top artwork image:', artwork.imageUrl);
                                console.error('Top artwork: Constructed URL was:', e.target.src);
                                e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                                e.target.onerror = null;
                              }}
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
                              src={post.images && post.images.length > 0 ?
                                (post.images[0]?.startsWith('http') ? post.images[0] : getImageUrl(post.images[0])) :
                                (post.image?.startsWith('http') ? post.image : getImageUrl(post.image))}
                              alt={`Post ${post.id}`}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                console.error('Failed to load post image:', post.images?.[0] || post.image);
                                console.error('Post thumbnail: Constructed URL was:', e.target.src);
                                e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                                e.target.onerror = null;
                              }}
                            />
                            <div>
                              <p className="font-medium text-[#7f5539] text-sm">
                                {post.caption.substring(0, 30)}...
                              </p>
                              <p className="text-xs text-[#7f5539]/60">{post.likes || 0} likes • {post.comments || 0} comments</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {(((post.likes || 0) + (post.comments || 0)) / 10).toFixed(1)}% engagement
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
                    {(portfolioPosts.reduce((sum, post) => sum + (post.likes || 0), 0) +
                      (Array.isArray(artworks) ? artworks.reduce((sum, art) => sum + (art.likes || 0), 0) : 0)).toLocaleString()}
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
                    {portfolioPosts.reduce((sum, post) => sum + (post.comments || 0), 0)}
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
                    ${artistProfile.stats.sales > 0
                      ? Math.round(15400 / artistProfile.stats.sales).toLocaleString()
                      : '0'}
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
        onAvatarUpload={handleAvatarUpload}
        onCoverUpload={handleSaveCover}
      />

      {/* Upload Post Modal */}
      <UploadPostModal
        isOpen={isAddingArtwork}
        onClose={handleCancelAddArtwork}
        newArtwork={newArtwork}
        onArtworkChange={handleArtworkChange}
        onImageUpload={handleImageUpload}
        onCancel={handleCancelAddArtwork}
        onSuccess={(newArtworkData) => {
          console.log('NEW ARTWORK RECEIVED:', newArtworkData);
          console.log('NEW ARTWORK ID:', newArtworkData?.artworkId);
          console.log('NEW ARTWORK TITLE:', newArtworkData?.title);

          // Add the new artwork to the front of the artworks list
          setArtworks(prevArtworks => {
            console.log('PREVIOUS ARTWORKS COUNT:', prevArtworks.length);
            const newList = [newArtworkData, ...prevArtworks];
            console.log('NEW ARTWORKS COUNT:', newList.length);
            return newList;
          });
        }}
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

      {/* Edit Artwork Modal */}
      <EditArtworkModal
        isOpen={isEditingArtwork}
        artwork={selectedArtwork}
        onClose={handleCancelEditArtwork}
        onSave={handleSaveArtwork}
        onCancel={handleCancelEditArtwork}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeletingArtwork}
        artwork={selectedArtwork}
        onConfirm={handleConfirmDeleteArtwork}
        onCancel={handleCancelDeleteArtwork}
        isLoading={false}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
            <div className="text-center">
              {/* Title */}
              <h3 className="text-2xl font-bold text-[#362625] mb-2">
                Confirm Logout
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to log out of your account?
              </p>

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelLogout}
                  className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-3 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white rounded-xl hover:from-[#c0392b] hover:to-[#a93226] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[120px]"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#362625]">
                  Delete Post
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-gray-600 mb-4 text-lg">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>

              {/* Post Preview */}
              {postToDelete && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    {postToDelete.images && postToDelete.images.length > 0 && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <SmartImage
                          src={postToDelete.images[0]}
                          alt="Post preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {postToDelete.caption || 'No caption'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(postToDelete.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDeletePost}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePost}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Action Modal */}
      <CommissionActionModal
        isOpen={showCommissionActionModal}
        onClose={handleCloseCommissionActionModal}
        onAccept={handleAcceptCommissionRequest}
        onReject={handleRejectCommissionRequest}
        request={selectedCommissionRequest}
        action={commissionAction}
      />

      {/* Debug Component - Remove this in production */}
      <ImageDebugger artistProfile={artistProfile} />
    </div>
  );
};

export default ArtistPortfolio;
