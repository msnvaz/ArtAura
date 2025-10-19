import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const ArtistProfileModal = ({ isOpen, artist, onClose }) => {
  const { token } = useAuth();
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followersCount, setFollowersCount] = React.useState(
    artist?.totalFollowers ?? 0
  );
  const API_URL = import.meta.env.VITE_API_URL;

  // Debug: log artist object to inspect id
  React.useEffect(() => {
    if (artist) {
      console.log("ArtistProfileModal artist:", artist);
    }
  }, [artist]);

  // Handle follow button click
  const handleFollow = async (artistId) => {
    console.log("Attempting to follow artist with ID:", artistId);
    console.log("Full artist object:", artist);

    if (!token) {
      alert("You must be logged in to follow an artist.");
      return;
    }

    // Try to get artist ID from different possible fields
    const actualArtistId =
      artistId || artist.id || artist.artistId || artist.user_id;

    console.log("Resolved artist ID:", actualArtistId);

    if (
      !actualArtistId ||
      actualArtistId === "undefined" ||
      actualArtistId === null
    ) {
      console.error(
        "No valid artist ID found. Available fields:",
        Object.keys(artist)
      );
      alert("Invalid artist ID. Cannot follow.");
      return;
    }

    try {
      console.log("Making follow request with artist ID:", actualArtistId);
      await axios.post(
        `${API_URL}/api/buyer/artists/${actualArtistId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      alert("Successfully followed artist!");
    } catch (err) {
      console.error("Follow error:", err.response?.data || err.message);
      alert(
        `Failed to follow artist: ${
          err.response?.data?.message || "Please try again later."
        }`
      );
    }
  };

  if (!isOpen || !artist) return null;

  // Function to format numbers with k notation
  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#FFF5E1" }}
      >
        {/* Header with cover image */}
        <div className="relative">
          <img
            src={artist.coverImageUrl ? artist.coverImageUrl : "/heritage.jpeg"}
            alt="Cover"
            className="w-full h-48 object-cover rounded-t-xl"
            onError={(e) => {
              // Robust fallback system for cover images
              const currentSrc = e.target.src;

              if (currentSrc.includes("/uploads/")) {
                // If uploads path fails, try public folder images
                e.target.src = "/heritage.jpeg";
              } else if (currentSrc.includes("heritage.jpeg")) {
                e.target.src = "/sigiriya.jpeg";
              } else if (currentSrc.includes("sigiriya.jpeg")) {
                e.target.src = "/art1.jpeg";
              } else if (currentSrc.includes("art1.jpeg")) {
                e.target.src = "/art2.jpeg";
              } else {
                // Final fallback - use a solid color background
                e.target.style.display = "none";
                e.target.parentNode.style.background =
                  "linear-gradient(135deg, #FFD95A 0%, #D87C5A 100%)";
                e.target.parentNode.style.height = "192px";
              }
            }}
          />
          <button
            className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition text-lg font-bold"
            onClick={onClose}
          >
            ×
          </button>
          {/* Avatar positioned over cover */}
          <div className="absolute -bottom-12 left-6">
            <img
              src={artist.avatarUrl || "/uploads/profiles/default-avatar.svg"}
              alt={artist.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.src = "/uploads/profiles/default-avatar.svg";
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-6 pb-6">
          {/* Artist Name and Specialization */}
          <div className="mb-6">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "#5D3A00" }}
            >
              {artist.name}
            </h2>
            <p
              className="text-lg mb-3 flex items-center gap-2"
              style={{ color: "#7f5539" }}
            >
              <Award size={18} />
              {artist.specialization}
            </p>

            {/* Badges */}
            {artist.badges && artist.badges.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {artist.badges.map((badge, idx) => (
                  <span
                    key={badge + idx}
                    className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    style={{ backgroundColor: "#FFD95A", color: "#5D3A00" }}
                  >
                    <Star size={12} />
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-1">
              <h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: "#5D3A00" }}
              >
                <TrendingUp size={20} />
                Statistics
              </h3>
              <div className="space-y-4">
                <div
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: "#FFE4D6" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Users size={24} style={{ color: "#5D3A00" }} />
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#5D3A00" }}
                  >
                    {formatNumber(artist.totalFollowers)}
                  </p>
                  <p className="text-sm" style={{ color: "#7f5539" }}>
                    Followers
                  </p>
                </div>
                <div
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: "#FFE4D6" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp size={24} style={{ color: "#5D3A00" }} />
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#5D3A00" }}
                  >
                    {formatNumber(artist.totalSales)}
                  </p>
                  <p className="text-sm" style={{ color: "#7f5539" }}>
                    Sales
                  </p>
                </div>
                <div
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: "#FFE4D6" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Star size={24} style={{ color: "#5D3A00" }} />
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#5D3A00" }}
                  >
                    4.8
                  </p>
                  <p className="text-sm" style={{ color: "#7f5539" }}>
                    Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Bio and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {artist.bio && (
                <div>
                  <h3
                    className="text-lg font-semibold mb-3 flex items-center gap-2"
                    style={{ color: "#5D3A00" }}
                  >
                    <Users size={20} />
                    About
                  </h3>
                  <p className="leading-relaxed" style={{ color: "#7f5539" }}>
                    {artist.bio}
                  </p>
                </div>
              )}

              {/* Contact Details */}
              <div>
                <h3
                  className="text-lg font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "#5D3A00" }}
                >
                  <Phone size={20} />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artist.email && (
                    <div
                      className="rounded-lg p-3 flex items-center gap-3"
                      style={{ backgroundColor: "#FFE4D6" }}
                    >
                      <Mail size={18} style={{ color: "#5D3A00" }} />
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#5D3A00" }}
                        >
                          Email
                        </p>
                        <p className="text-sm" style={{ color: "#7f5539" }}>
                          {artist.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {artist.contactNo && (
                    <div
                      className="rounded-lg p-3 flex items-center gap-3"
                      style={{ backgroundColor: "#FFE4D6" }}
                    >
                      <Phone size={18} style={{ color: "#5D3A00" }} />
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#5D3A00" }}
                        >
                          Phone
                        </p>
                        <p className="text-sm" style={{ color: "#7f5539" }}>
                          {artist.contactNo}
                        </p>
                      </div>
                    </div>
                  )}
                  {artist.location && (
                    <div
                      className="rounded-lg p-3 flex items-center gap-3"
                      style={{ backgroundColor: "#FFE4D6" }}
                    >
                      <MapPin size={18} style={{ color: "#5D3A00" }} />
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#5D3A00" }}
                        >
                          Location
                        </p>
                        <p className="text-sm" style={{ color: "#7f5539" }}>
                          {artist.location}
                        </p>
                      </div>
                    </div>
                  )}
                  {artist.rate && (
                    <div
                      className="rounded-lg p-3 flex items-center gap-3"
                      style={{ backgroundColor: "#FFE4D6" }}
                    >
                      <DollarSign size={18} style={{ color: "#5D3A00" }} />
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#5D3A00" }}
                        >
                          Rate
                        </p>
                        <p
                          className="text-sm font-mono"
                          style={{ color: "#7f5539" }}
                        >
                          {artist.rate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: "#D87C5A" }}
          >
            <button
              className={`w-full px-6 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                isFollowing ? "bg-gray-300 text-[#7f5539]" : ""
              }`}
              style={{
                backgroundColor: isFollowing ? "#FFE4D6" : "#D87C5A",
                color: isFollowing ? "#7f5539" : "white",
              }}
              disabled={isFollowing}
              onClick={() => handleFollow(artist.id)}
            >
              <Users size={20} />
              {isFollowing ? "Following" : "Follow Artist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileModal;
