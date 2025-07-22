import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const notification = {
            id,
            message,
            type,
            duration
        };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const showSuccess = (message, duration) => addNotification(message, 'success', duration);
    const showError = (message, duration) => addNotification(message, 'error', duration);
    const showWarning = (message, duration) => addNotification(message, 'warning', duration);
    const showInfo = (message, duration) => addNotification(message, 'info', duration);

    return (
        <NotificationContext.Provider value={{
            addNotification,
            showSuccess,
            showError,
            showWarning,
            showInfo
        }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = ({ notifications, onRemove }) => {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={() => onRemove(notification.id)}
                />
            ))}
        </div>
    );
};

const NotificationItem = ({ notification, onRemove }) => {
    const { message, type } = notification;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50 border-green-200',
                    text: 'text-green-800',
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    button: 'text-green-400 hover:text-green-600'
                };
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200',
                    text: 'text-red-800',
                    icon: <XCircle className="h-5 w-5 text-red-600" />,
                    button: 'text-red-400 hover:text-red-600'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50 border-yellow-200',
                    text: 'text-yellow-800',
                    icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
                    button: 'text-yellow-400 hover:text-yellow-600'
                };
            default:
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    text: 'text-blue-800',
                    icon: <Info className="h-5 w-5 text-blue-600" />,
                    button: 'text-blue-400 hover:text-blue-600'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className={`${styles.bg} border rounded-lg p-4 shadow-lg max-w-md animate-in slide-in-from-right-full duration-300`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {styles.icon}
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${styles.text}`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={onRemove}
                    className={`ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7f5539] ${styles.button}`}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
