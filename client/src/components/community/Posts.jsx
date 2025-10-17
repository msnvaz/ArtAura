import React, { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import PostInteractions from '../social/PostInteractions';

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
        <p className="text-[#7f5539] text-sm mb-2">
          <span className="font-semibold text-[#7f5539]">{username}</span>{" "}
          {caption}
        </p>
        
        {/* Post Interactions */}
        <PostInteractions 
          postId={postId} 
          initialLikesCount={likes || 0}
          initialCommentsCount={0} // You can add comments count if available
        />
      </div>
    </div>
  );
};

export default Post;
