import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const { token, role, userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    // Only show notification bell for artists or buyers
    if (!token || (role !== 'artist' && role !== 'buyer' && role !== 'BUYER')) {
        return null;
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications and unread count
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();

        // Set up polling for real-time updates (every 30 seconds)
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [token, userId, role]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            let response;

            if (role === 'artist') {
                response = await axios.get(`${API_URL}/api/notifications/artist`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else if (role === 'buyer' || role === 'BUYER') {
                response = await axios.get(`${API_URL}/api/notifications/buyer/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            if (response?.data?.success) {
                const notifs = response.data.notifications || response.data.data || [];
                setNotifications(notifs);
                setUnreadCount(response.data.unreadCount || notifs.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Fail silently for better UX
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            let response;

            if (role === 'artist') {
                response = await axios.get(`${API_URL}/api/notifications/artist/count`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else if (role === 'buyer' || role === 'BUYER') {
                // For buyers, we'll count from the notifications list
                const notifResponse = await axios.get(`${API_URL}/api/notifications/buyer/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (notifResponse?.data?.success) {
                    const notifs = notifResponse.data.data || [];
                    setUnreadCount(notifs.filter(n => !n.isRead).length);
                }
                return;
            }

            if (response?.data?.success) {
                setUnreadCount(response.data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
            // Fail silently
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            let response;

            if (role === 'artist') {
                response = await axios.put(
                    `${API_URL}/api/notifications/artist/${notificationId}/read`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else if (role === 'buyer' || role === 'BUYER') {
                response = await axios.post(
                    `${API_URL}/api/notifications/${notificationId}/mark-read`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            if (response?.data?.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif => {
                        const id = notif.notificationId || notif.id;
                        return id === notificationId
                            ? { ...notif, isRead: true }
                            : notif;
                    })
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            if (role === 'artist') {
                const response = await axios.put(
                    `${API_URL}/api/notifications/artist/mark-all-read`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    // Update local state
                    setNotifications(prev =>
                        prev.map(notif => ({ ...notif, isRead: true }))
                    );
                    setUnreadCount(0);
                }
            }
            // TODO: Implement mark all as read for buyers if needed
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications(); // Refresh when opening
        }
    };

    const formatNotificationTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            return 'Unknown time';
        }
    };

    const getNotificationId = (notification) => {
        return notification.notificationId || notification.id;
    };

    const getNotificationBody = (notification) => {
        return notification.notificationBody || notification.message || notification.content;
    };

    const getNotificationTime = (notification) => {
        return notification.createdAt || notification.timestamp || notification.created_at;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-white hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-[#7f5539]">Notifications</h3>
                        <div className="flex space-x-2">
                            {unreadCount > 0 && role === 'artist' && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-[#7f5539] hover:text-[#6e4c34] flex items-center space-x-1"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="h-4 w-4" />
                                    <span>Mark all read</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={getNotificationId(notification)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                    onClick={() => !notification.isRead && markAsRead(getNotificationId(notification))}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                                {getNotificationBody(notification)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatNotificationTime(getNotificationTime(notification))}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex items-center">
                                            {!notification.isRead ? (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" title="Unread"></div>
                                            ) : (
                                                <Check className="h-4 w-4 text-green-500" title="Read" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50 text-center">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // You could navigate to a full notifications page here
                                }}
                                className="text-sm text-[#7f5539] hover:text-[#6e4c34] font-medium"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
