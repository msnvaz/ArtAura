import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, TrendingUp, Users } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getBadgeLabel = (rankCriteria) => {
  switch (rankCriteria) {
    case "rate":
      return "Top Rated";
    case "total_followers":
      return "Popular";
    case "total_sales":
      return "Rising Star";
    default:
      return "Artist";
  }
};

const getBadgeColor = (badge) => {
  switch (badge) {
    case "Top Rated":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    case "Rising Star":
      return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    case "Popular":
      return "bg-gradient-to-r from-green-400 to-green-600 text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const Badge = ({ badge }) => (
  <span
    className={`text-xs px-3 py-1 rounded-full font-semibold shadow-md whitespace-nowrap ${getBadgeColor(
      badge
    )}`}
    style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis" }}
  >
    {badge}
  </span>
);

const TopArtists = () => {
  const navigate = useNavigate();
  const [topArtists, setTopArtists] = useState([]);

  // Helper function to get correct avatar path
  const getAvatarPath = (avatarUrl) => {
    if (!avatarUrl) return "/uploads/profiles/default-avatar.svg";
    // If it's already a full URL or starts with /, return as is
    if (avatarUrl.startsWith("http") || avatarUrl.startsWith("/")) {
      return avatarUrl;
    }
    // Otherwise, assume it's a relative path and prepend /
    return `/${avatarUrl}`;
  };

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/buyer/artists/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Rank artists based on rate, total_followers, and total_sales
        const rankedArtists = response.data
          .sort((a, b) => {
            if (b.rate !== a.rate) {
              return b.rate - a.rate; // Primary: Higher rate first
            } else if (b.total_followers !== a.total_followers) {
              return b.total_followers - a.total_followers; // Secondary: More followers first
            } else {
              return b.total_sales - a.total_sales; // Tertiary: More sales first
            }
          })
          .slice(0, 8); // Limit to top 8 artists

        // Add badges to ranked artists based on their rank criteria
        const artistsWithBadges = rankedArtists.map((artist, index) => {
          let rankCriteria = "rate";

          // Compare with the previous artist to determine the rank criteria
          if (index > 0 && artist.rate === rankedArtists[index - 1].rate) {
            rankCriteria = "total_followers";

            if (
              artist.total_followers ===
              rankedArtists[index - 1].total_followers
            ) {
              rankCriteria = "total_sales";
            }
          }

          return { ...artist, badge: getBadgeLabel(rankCriteria) };
        });

        setTopArtists(artistsWithBadges);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    fetchTopArtists();
  }, []);

  const handleDiscoverMoreArtists = () => {
    navigate("/artists");
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#7f5539] flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Top Artists
        </h3>
        <button className="text-sm text-[#D87C5A] hover:text-[#7f5539] font-medium">
          See All
        </button>
      </div>

      <div className="space-y-3">
        {topArtists.map((artist, index) => (
          <div
            key={artist.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#FFF5E1] transition-colors cursor-pointer"
          >
            <div className="relative">
              <img
                src={getAvatarPath(artist.avatarUrl)} // Use avatarUrl field and helper function
                alt={artist.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD95A]"
                onError={(e) => {
                  e.target.src = "/uploads/profiles/default-avatar.svg";
                }}
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D87C5A] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-[#7f5539] truncate">
                  {artist.name}
                </p>
                <Badge badge={artist.badge || "Top Rated"} />
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#7f5539]/70">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-[#FFD95A]" />
                  <span>{artist.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{artist.totalFollowers}</span>
                </div>
                <span>• {artist.totalSales || 0} sales</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleDiscoverMoreArtists}
        className="w-full mt-4 py-2 bg-[#FFF5E1] hover:bg-[#FFD95A] text-[#7f5539] rounded-lg font-medium transition-colors"
      >
        Discover More Artists
      </button>
    </div>
  );
};

export default TopArtists;
