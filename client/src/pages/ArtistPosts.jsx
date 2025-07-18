import React, { useState } from "react";
import Post from "../components/community/Posts";
import { Search } from "lucide-react";

const ArtistPosts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in a real app this would come from an API
  const posts = [
    {
      id: 1,
      username: "Sarah Martinez",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      timeAgo: "2h",
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      likes: 156,
      caption:
        "Just finished this new piece! 'Sunset Dreams' took me 3 weeks to complete. The interplay of light and shadow was challenging but rewarding. #ArtistLife #OilPainting",
    },
    {
      id: 2,
      username: "Elena Rodriguez",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      timeAgo: "5h",
      image:
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg",
      likes: 89,
      caption:
        "Abstract emotions flowing through the canvas. What do you see in this piece? 🎨 #AbstractArt #ArtisticExpression",
    },
    // Add more posts as needed
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdf9f4] px-4 py-6">
      {/* Search Bar */}
      <div className="max-w-[700px] mx-auto mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/60"
            size={20}
          />
          <input
            type="text"
            placeholder="Search artists or posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#7f5539]/20 rounded-lg text-[#7f5539] placeholder-[#7f5539]/60 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
          />
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-[700px] mx-auto space-y-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-[#fdf9f4]/20 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Post {...post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPosts;
