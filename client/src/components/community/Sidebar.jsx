import React, { useState, useEffect, useRef } from 'react';
import {
  Home, MessageCircle, ShoppingBag, PlusSquare, Calendar,
  Trophy, Menu, Settings, LogOut, Bookmark, ChevronDown, UploadCloud
} from 'lucide-react';

const Sidebar = ({ isCollapsed }) => {
  const [showMore, setShowMore] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const fileInputRef = useRef(null);

  // Listen for window resize to update windowWidth
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define collapsed based on screen width and isCollapsed prop
  const collapsed = windowWidth < 768 ? true : isCollapsed;

  const navigationItems = [
    { icon: Home, label: 'Home' },
    { icon: MessageCircle, label: 'Messages' },
    { icon: ShoppingBag, label: 'Shop' },
    {
      icon: PlusSquare,
      label: 'Create',
      onClick: () => setShowUpload(prev => !prev),
    },
    { icon: Calendar, label: 'Exhibitions' },
    { icon: Trophy, label: 'Challenges' },
  ];

  return (
    <div className="relative">
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-all
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Navigation Section */}
        <nav className="flex-1 py-6 relative">
          <ul className="space-y-1 px-3">
            {navigationItems.map((item, index) => (
              <li key={index} className="relative">
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2' : 'space-x-3 px-4'
                  } py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>

                {/* Upload Panel */}
                {item.label === 'Create' && showUpload && (
                  <div
                    className={`absolute ${
                      collapsed ? 'left-20 top-0' : 'left-full top-0 ml-2'
                    } w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-lg p-4 z-50`}
                    onClick={() => fileInputRef.current.click()}
                    onDrop={e => {
                      e.preventDefault();
                      console.log('Dropped files:', e.dataTransfer.files);
                    }}
                    onDragOver={e => e.preventDefault()}
                  >
                    <div className="text-center cursor-pointer hover:text-blue-400 transition">
                      <UploadCloud className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm text-slate-300">Drag & drop or click to upload</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={e => console.log('Selected:', e.target.files)}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* More Button and its Dropdown */}
        <div className="p-3 border-t border-slate-800 relative">
          <div className="relative">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center px-2' : 'space-x-3 px-4'
              } py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl`}
              title="More"
            >
              <Menu className="w-5 h-5" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">More</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transform transition-transform ${
                      showMore ? 'rotate-180' : ''
                    }`}
                  />
                </>
              )}
            </button>

            {/* More Options Dropdown */}
            {showMore && (
              <div
                className={`absolute z-50 ${
                  collapsed ? 'left-full ml-2 bottom-0' : 'left-full ml-2 bottom-0'
                } w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 flex flex-col-reverse`}
              >
                {/* Logout at the bottom */}
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="text-sm">Logout</span>
                </a>

                {/* Saved */}
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg"
                >
                  <Bookmark className="w-4 h-4 mr-3" />
                  <span className="text-sm">Saved</span>
                </a>

                {/* Settings */}
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  <span className="text-sm">Settings</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
