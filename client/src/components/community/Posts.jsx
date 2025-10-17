import React, { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Post = ({
  username,
  avatar,
  timeAgo,
  image,
  likes,
  caption,
  postId,
  userId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const likesCount = likes || 0; // Ensure likes has a default value
  const [likesCountState, setLikesCountState] = useState(likesCount);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
      console.log("Sending postId to backend:", postId);
      const response = await axios.post(
        `${API_BASE_URL}/api/aposts/toggle-like`,
        {
          postId, // Ensure postId is passed as a prop to the component
          userId, // Ensure userId is passed as a prop to the component
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      const updatedPost = response.data;
      setLikesCountState(updatedPost.likes); // Update the likes count with the new value from the backend
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#fdf9f4]/40 overflow-hidden shadow-xl mb-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          <img
            src={avatar}
            alt={username}
            className="w-9 h-9 rounded-full object-cover border-2 border-[#ffe4d6]"
          />
          <div>
            <h3 className="text-[#7f5539] font-semibold text-sm">{username}</h3>
            <p className="text-[#7f5539]/60 text-xs">{timeAgo}</p>
          </div>
        </div>
      </div>

      <img
        src={image}
        alt="Post"
        className="w-full object-cover aspect-[4/3] max-h-72"
      />

      <div className="p-3 sm:p-4">
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full ${
              isLiked
                ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                : "text-[#7f5539]/60 hover:text-red-500 hover:bg-[#ffe4d6]"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        <p className="text-[#7f5539] font-semibold text-xs mb-1">
          {likesCount.toLocaleString()} likes
        </p>
        <p className="text-[#7f5539] text-sm">
          <span className="font-semibold text-[#7f5539]">{username}</span>{" "}
          {caption}
        </p>
      </div>
    </div>
  );
};

export default Post;
