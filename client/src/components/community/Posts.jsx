import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

const Post = ({ username, avatar, timeAgo, image, likes, caption }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl mb-6">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img src={avatar} alt={username} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" />
          <div>
            <h3 className="text-slate-200 font-semibold text-sm">{username}</h3>
            <p className="text-slate-400 text-xs">{timeAgo}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-200 p-2 rounded-full hover:bg-slate-800">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <img src={image} alt="Post" className="w-full object-cover aspect-square" />

      <div className="p-4">
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full ${
              isLiked
                ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
                : 'text-slate-400 hover:text-red-500 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="text-slate-400 hover:text-slate-200 p-2 rounded-full hover:bg-slate-800">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="text-slate-400 hover:text-slate-200 p-2 rounded-full hover:bg-slate-800">
            <Share className="w-6 h-6" />
          </button>
        </div>

        <p className="text-slate-200 font-semibold text-sm mb-1">{likesCount.toLocaleString()} likes</p>
        <p className="text-slate-300 text-sm">
          <span className="font-semibold text-slate-200">{username}</span> {caption}
        </p>
      </div>
    </div>
  );
};

export default Post;
