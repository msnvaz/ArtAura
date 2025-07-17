import React, { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";

const Post = ({ username, avatar, timeAgo, image, likes, caption }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
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
        <button className="text-[#7f5539]/60 hover:text-[#7f5539] p-2 rounded-full hover:bg-[#ffe4d6]">
          <MoreHorizontal className="w-5 h-5" />
        </button>
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
          <button className="text-[#7f5539]/60 hover:text-[#7f5539] p-2 rounded-full hover:bg-[#ffe4d6]">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="text-[#7f5539]/60 hover:text-[#7f5539] p-2 rounded-full hover:bg-[#ffe4d6]">
            <Share className="w-5 h-5" />
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
