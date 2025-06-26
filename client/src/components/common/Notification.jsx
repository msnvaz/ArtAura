import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

const notificationsMock = [
  { id: 1, text: 'New comment on your post', time: '2m ago' },
  { id: 2, text: 'Your artwork got featured!', time: '1h ago' },
  { id: 3, text: 'New follower: @artlover', time: '3h ago' },
  { id: 4, text: 'Challenge deadline approaching', time: '1d ago' },
];

export default function NotificationsPopup() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  // Close popup if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={popupRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-slate-800 transition"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-slate-300" />
        {/* Optional: small red dot for unread */}
        <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50
                        animate-fadeInDown overflow-hidden">
          <div className="p-4 border-b border-slate-700 font-semibold text-slate-200">
            Notifications
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notificationsMock.length === 0 && (
              <li className="p-4 text-slate-400 text-center">No new notifications</li>
            )}
            {notificationsMock.map((notif) => (
              <li
                key={notif.id}
                className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center text-slate-300"
              >
                <span className="text-sm">{notif.text}</span>
                <span className="text-xs text-slate-500 ml-2">{notif.time}</span>
              </li>
            ))}
          </ul>
          <div className="p-3 border-t border-slate-700 text-center">
            <button
              onClick={() => alert('Redirect to all notifications')}
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
