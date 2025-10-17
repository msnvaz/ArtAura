import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token, userId, role } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch notifications when component mounts
  useEffect(() => {
    if (token && userId && role === 'BUYER') {
      fetchNotifications();
    }
  }, [token, userId, role]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/buyer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
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
        return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'commission_accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'commission_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
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

  // Don't show for artists or if not logged in
  if (role !== 'BUYER' || !token) {
    return null;
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-[#7f5539] hover:bg-[#FFE4D6] rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#FFE4D6] z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#FFE4D6] bg-[#FFF5E1]">
            <h3 className="font-semibold text-[#7f5539]">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-[#7f5539]/70">{unreadCount} unread</p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#7f5539]/60">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[#FFE4D6] hover:bg-[#FFF5E1] transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#7f5539] text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-[#7f5539]/70 mt-1">
                        {notification.message}
                      </p>
                      {notification.artistDeadline && (
                        <div className="flex items-center mt-2 text-xs text-[#7f5539]/60">
                          <Calendar className="w-3 h-3 mr-1" />
                          Deadline: {new Date(notification.artistDeadline).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#7f5539]/50">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                        <div className="flex space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#FFE4D6] bg-[#FFF5E1] text-center">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-sm text-[#7f5539] hover:text-[#5a3d28]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
