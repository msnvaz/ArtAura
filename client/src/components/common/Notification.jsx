import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle, XCircle, Calendar, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function NotificationsPopup() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const { token, userId, role } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  // Debug logging
  useEffect(() => {
    console.log('Notification component - Role:', role, 'UserId:', userId, 'Token exists:', !!token);
  }, [role, userId, token]);

  // Fetch notifications when component mounts or when opening
  useEffect(() => {
    if (token && userId && open) {
      fetchNotifications();
    }
  }, [token, userId, role, open]);

  // Close popup if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/notifications/buyer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API_URL}/api/notifications/${notificationId}/mark-read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.is_read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'commission_accepted':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'commission_rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Don't show for non-buyers or if not logged in
  // Temporarily show for all logged-in users for debugging
  if (!token) {
    return null;
  }

  return (
    <div className="relative" ref={popupRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-slate-800 transition"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-slate-300" />
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-96 bg-[#232323] border border-[#FFD95A] rounded-xl shadow-xl z-50
                        animate-fadeInDown overflow-hidden"
        >
          <div className="p-4 border-b border-[#FFD95A] font-semibold text-white flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-[#FFD95A]">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-[#FFD95A]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD95A] mx-auto"></div>
                <p className="mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#FFD95A]">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-700 hover:bg-[#2a2a2a] transition-colors ${!notification.is_read ? 'bg-blue-900/20' : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">
                        {notification.message}
                      </p>
                      {notification.artist_deadline && (
                        <div className="flex items-center mt-2 text-xs text-[#FFD95A]">
                          <Calendar className="w-3 h-3 mr-1" />
                          Deadline: {new Date(notification.artist_deadline).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                        <div className="flex space-x-2">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#FFD95A] text-center">
              <button
                onClick={() => setOpen(false)}
                className="text-[#FFD95A] hover:underline text-sm font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
