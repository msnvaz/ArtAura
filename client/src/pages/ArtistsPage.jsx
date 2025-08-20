import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Users,
  Eye,
  Grid,
  List,
  SlidersHorizontal,
  Award,
  Palette,
  Camera,
  Brush,
  MessageSquare,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CartSidebar from "../components/cart/CartSidebar";
import CommissionRequestModal from "../components/modals/CommissionRequestModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Commission modal state
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/buyer/artists/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Directly use backend data, no mock merge
        setArtists(response.data);
        setFilteredArtists(response.data);
        setLoading(false);
      })
      .catch(() => {
        setArtists([]);
        setFilteredArtists([]);
        setLoading(false);
      });
  }, []);

  // Format followers count with k
  const formatFollowers = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "k";
    }
    return count;
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = artists;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialty filter
    if (
      selectedSpecialty !== "all" &&
      selectedSpecialty !== "All Specialties"
    ) {
      filtered = filtered.filter(
        (artist) => artist.specialty === selectedSpecialty
      );
    }

    // Location filter
    if (selectedLocation !== "all" && selectedLocation !== "All Locations") {
      filtered = filtered.filter(
        (artist) => artist.location === selectedLocation
      );
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "followers":
        filtered.sort((a, b) => b.followers - a.followers);
        break;
      case "artworks":
        filtered.sort((a, b) => b.artworks - a.artworks);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
    }

    setFilteredArtists(filtered);
  }, [artists, searchTerm, selectedSpecialty, selectedLocation, sortBy]);

  const handleFollowArtist = (artistId) => {
    console.log(`Following artist ${artistId}`);
    // Add follow logic here
  };

  const handleViewProfile = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  const handleOpenCommissionModal = (artist) => {
    setSelectedArtist(artist);
    setShowCommissionModal(true);
  };

  const handleCloseCommissionModal = () => {
    setSelectedArtist(null);
    setShowCommissionModal(false);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Top Rated":
        return "bg-[#D87C5A] text-white";
      case "Featured Artist":
        return "bg-[#FFD95A] text-[#7f5539]";
      case "Rising Star":
        return "bg-[#87CEEB] text-white";
      case "New Artist":
        return "bg-green-500 text-white";
      case "Top Photographer":
        return "bg-purple-500 text-white";
      case "Innovation Award":
        return "bg-[#7f5539] text-white";
      case "Emerging Talent":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getSpecialtyIcon = (specialty) => {
    switch (specialty) {
      case "Digital Art":
        return <Palette className="w-4 h-4" />;
      case "Photography":
        return <Camera className="w-4 h-4" />;
      case "Painting":
        return <Brush className="w-4 h-4" />;
      case "Sculpture":
        return <Award className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  const ArtistCard = ({ artist }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      {/* Featured Badge */}
      {artist.featured && (
        <div className="bg-gradient-to-r from-[#D87C5A] to-[#FFD95A] px-4 py-2 text-center">
          <span className="text-white text-sm font-bold">
            ✨ Featured Artist
          </span>
        </div>
      )}

      {/* Header with Avatar and Basic Info */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-[#FFD95A]"
            />
            {artist.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#D87C5A] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#7f5539] text-lg">{artist.name}</h3>
            <div className="flex items-center gap-2 text-[#7f5539]/70 text-sm">
              {getSpecialtyIcon(artist.specialization)}
              <span>{artist.specialization}</span>
            </div>
            <div className="flex items-center gap-1 text-[#7f5539]/70 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              <span>{artist.location}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[#7f5539]/80 text-sm line-clamp-3 mb-4">
          {artist.bio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[#FFD95A] mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-[#7f5539]">{artist.rate}</span>
            </div>
            <span className="text-xs text-[#7f5539]/70">
              {artist.rate} reviews
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-[#D87C5A]" />
              <span className="font-bold text-[#7f5539]">
                {formatFollowers(artist.totalFollowers)}
              </span>
            </div>
            <span className="text-xs text-[#7f5539]/70">followers</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-4 h-4 text-[#D87C5A]" />
              <span className="font-bold text-[#7f5539]">
                {artist.totalSales}
              </span>
            </div>
            <span className="text-xs text-[#7f5539]/70">artworks</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(artist.badges || []).map((badge, index) => (
            <span
              key={badge + "-" + index}
              className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(
                badge
              )}`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Portfolio Preview */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(artist.portfolioImages || []).map((image, index) => (
            <img
              key={image + "-" + index}
              src={image}
              alt={`${artist.name} artwork ${index + 1}`}
              className="w-full h-16 object-cover rounded-lg hover:scale-110 transition-transform cursor-pointer"
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleViewProfile(artist.id)}
            className="flex-1 bg-[#D87C5A] hover:bg-[#7f5539] text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={() => handleOpenCommissionModal(artist)}
            className="flex-1 bg-[#7f5539] hover:bg-[#D87C5A] text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            <MessageSquare className="w-5 h-5 inline-block -mt-1 mr-1" />
            Commission
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <CartSidebar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Discover Artists
            </h1>
            <p className="text-[#7f5539]/70">
              Connect with talented artists from around the world
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artists by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                />
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFD95A] hover:bg-[#D87C5A] text-[#7f5539] rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-[#D87C5A] text-white"
                      : "bg-[#FFD95A] text-[#7f5539]"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-[#D87C5A] text-white"
                      : "bg-[#FFD95A] text-[#7f5539]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-[#FFD95A] grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                  >
                    {specialties.map((specialty) => (
                      <option
                        key={specialty}
                        value={
                          specialty === "All Specialties" ? "all" : specialty
                        }
                      >
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                  >
                    {locations.map((location) => (
                      <option
                        key={location}
                        value={location === "All Locations" ? "all" : location}
                      >
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                  >
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="followers">Most Followers</option>
                    <option value="artworks">Most Artworks</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#7f5539]/70">
              Showing {filteredArtists.length} of {artists.length} artists
            </p>
          </div>

          {/* Artists Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 max-w-4xl mx-auto"
              }`}
            >
              {filteredArtists.map((artist, index) => (
                <ArtistCard
                  key={artist.id || `artist-${index}`}
                  artist={artist}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredArtists.length === 0 && (
            <div className="text-center py-20">
              <div className="text-[#7f5539]/50 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No artists found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Commission Request Modal */}
      <CommissionRequestModal
        isOpen={showCommissionModal}
        artist={selectedArtist}
        onClose={handleCloseCommissionModal}
      />
    </div>
  );
};

export default ArtistsPage;
