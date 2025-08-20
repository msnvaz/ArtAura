import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  Heart,
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const ExhibitionPost = ({
  post_id,
  title,
  description,
  location,
  startDate,
  endDate,
  startTime,
  endTime,
  organizer,
  category,
  entryFee,
  maxParticipants,
  contactEmail,
  contactPhone,
  requirements,
  created_at,
  likes,
  comments,
  artist,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [showMenu, setShowMenu] = useState(false);
  const stompClientRef = useRef(null);

  useEffect(() => {
    setLikesCount(likes); // Always sync likesCount with prop on mount/refresh
    // Connect to WebSocket for real-time like updates
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      client.subscribe("/topic/likes", (message) => {
        const { postId, likes } = JSON.parse(message.body);
        if (String(postId) === String(post_id)) {
          setLikesCount(likes);
        }
      });
    };
    client.activate();
    stompClientRef.current = client;
    // Fetch if user has liked this post
    fetch(`${API_URL}/api/buyer/exhibitions/${post_id}/has-liked`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setIsLiked(data.liked))
      .catch(() => setIsLiked(false));
    return () => {
      client.deactivate();
    };
  }, [post_id, likes]);

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      try {
        const res = await fetch(
          `${API_URL}/api/buyer/exhibitions/${post_id}/like`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setLikesCount(data.likes);
      } catch (err) {
        setIsLiked(true);
      }
    } else {
      setIsLiked(true);
      try {
        const res = await fetch(
          `${API_URL}/api/buyer/exhibitions/${post_id}/like`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setLikesCount(data.likes);
      } catch (err) {
        setIsLiked(false);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return timeString;
    }
  };

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  // Owner check should use createdBy (buyer id) instead of artist.id
  const isOwner =
    currentUserId &&
    String(currentUserId) === String(post.createdBy || artist?.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#fdf9f4]/40 overflow-hidden mb-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#fdf9f4]/50">
        <div className="flex items-center space-x-2">
          {artist.avatar ? (
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-8 h-8 rounded-full object-cover border border-[#ffe4d6]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-[#ffe4d6] flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-[#7f5539] font-medium text-sm">
              {artist.name}
            </h3>
            <p className="text-[#7f5539]/60 text-xs">
              {getTimeAgo(created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 relative">
          <span className="bg-[#D87C5A] text-white px-2 py-1 rounded-full text-xs font-medium">
            Exhibition
          </span>
          {/* Always show 3 dots menu */}
          <div className="relative">
            <button
              className="text-[#7f5539]/60 hover:text-[#7f5539] p-1 rounded-full hover:bg-[#ffe4d6]"
              onClick={() => setShowMenu((v) => !v)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-[#fdf9f4]/50 rounded-lg shadow-lg py-2 min-w-[180px] z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (artist?.name)
                      alert(`Requesting further info from ${artist.name}`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#7f5539] hover:bg-[#fdf9f4] transition-colors flex items-center space-x-2"
                >
                  <span>Request Further Info</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-3">
        {/* Title */}
        <h2 className="text-base font-bold text-[#7f5539] mb-2 line-clamp-1">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#7f5539]/80 mb-3 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* All Exhibition Details in Compact Grid */}
        <div className="bg-[#FFF5E1] rounded-md p-2 mb-3 space-y-2">
          {/* Row 1: Location & Date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 flex-1 min-w-0">
              <MapPin className="w-3 h-3 text-[#D87C5A] flex-shrink-0" />
              <span className="text-[#7f5539] font-medium truncate">
                {location}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[#7f5539]/70 ml-2">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
          </div>

          {/* Row 2: Time & Organizer */}
          {(startTime || endTime || organizer) && (
            <div className="flex items-center justify-between text-xs">
              {(startTime || endTime) && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#D87C5A] flex-shrink-0" />
                  <span className="text-[#7f5539]/70">
                    {startTime && formatTime(startTime)}{" "}
                    {endTime && `- ${formatTime(endTime)}`}
                  </span>
                </div>
              )}
              {organizer && (
                <div className="flex items-center space-x-1 flex-1 min-w-0 ml-2">
                  <User className="w-3 h-3 text-[#D87C5A] flex-shrink-0" />
                  <span className="text-[#7f5539]/70 truncate">
                    {organizer}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Row 3: Entry Fee & Max Participants */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-[#D87C5A] flex-shrink-0" />
              <span className="text-[#7f5539]/70">
                {entryFee || "Not specified"}
              </span>
            </div>
            {maxParticipants && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-[#D87C5A] flex-shrink-0" />
                <span className="text-[#7f5539]/70">
                  Max: {maxParticipants}
                </span>
              </div>
            )}
          </div>

          {/* Row 4: Contact Info */}
          {(contactEmail || contactPhone) && (
            <div className="flex items-center justify-between text-xs">
              {contactEmail && (
                <div className="flex items-center space-x-1 flex-1 min-w-0">
                  <span className="text-[#7f5539]/60">📧</span>
                  <span className="text-[#7f5539]/70 truncate">
                    {contactEmail}
                  </span>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center space-x-1 ml-2">
                  <span className="text-[#7f5539]/60">📞</span>
                  <span className="text-[#7f5539]/70">{contactPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Row 5: Requirements (if any) */}
          {requirements && (
            <div className="text-xs">
              <div className="flex items-start space-x-1">
                <span className="text-[#7f5539]/60 flex-shrink-0">📋</span>
                <span className="text-[#7f5539]/70 line-clamp-1">
                  {requirements}
                </span>
              </div>
            </div>
          )}

          {/* Row 6: Category Badge */}
          <div className="flex justify-center pt-1">
            <span className="bg-[#7f5539] text-white px-3 py-1 rounded-full text-xs font-medium">
              {category}
            </span>
          </div>
        </div>

        {/* Compact Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#fdf9f4]/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors relative group ${
                isLiked
                  ? "text-red-500"
                  : "text-[#7f5539]/60 hover:text-red-500"
              }`}
              aria-label={isLiked ? "Unlike this post" : "Like this post"}
            >
              <span className="relative flex items-center">
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "fill-current text-red-500" : ""
                  }`}
                />
                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20 whitespace-nowrap">
                  {isLiked ? "Unlike" : "Like"}
                </span>
              </span>
              <span className="text-sm font-medium transition-colors duration-200">
                {likesCount}
              </span>
            </button>
            {/* Removed comment icon and count */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionPost;
