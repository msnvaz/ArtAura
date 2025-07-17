import React from "react";
import { Star, TrendingUp, Users } from "lucide-react";

const TopArtists = () => {
  const topArtists = [
    {
      id: 1,
      name: "Sarah Martinez",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      reviews: 124,
      followers: 2840,
      rating: 4.9,
      badge: "Top Rated",
    },
    {
      id: 2,
      name: "Liam Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      reviews: 98,
      followers: 1950,
      rating: 4.8,
      badge: "Rising Star",
    },
    {
      id: 3,
      name: "Ava Patel",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      reviews: 87,
      followers: 1620,
      rating: 4.7,
      badge: "Popular",
    },
    {
      id: 4,
      name: "Marcus Johnson",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      reviews: 73,
      followers: 1450,
      rating: 4.6,
      badge: "Trending",
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
      reviews: 65,
      followers: 1200,
      rating: 4.5,
      badge: "Featured",
    },
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Top Rated":
        return "bg-[#D87C5A] text-white";
      case "Rising Star":
        return "bg-[#FFD95A] text-[#7f5539]";
      case "Popular":
        return "bg-[#87CEEB] text-white";
      case "Trending":
        return "bg-[#7f5539] text-white";
      case "Featured":
        return "bg-[#FFF5E1] text-[#7f5539] border border-[#7f5539]";
      default:
        return "bg-gray-200 text-gray-700";
    }
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
                src={artist.avatar}
                alt={artist.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD95A]"
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
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(
                    artist.badge
                  )}`}
                >
                  {artist.badge}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#7f5539]/70">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-[#FFD95A]" />
                  <span>{artist.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{artist.followers}</span>
                </div>
                <span>• {artist.reviews} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 bg-[#FFF5E1] hover:bg-[#FFD95A] text-[#7f5539] rounded-lg font-medium transition-colors">
        Discover More Artists
      </button>
    </div>
  );
};

export default TopArtists;
