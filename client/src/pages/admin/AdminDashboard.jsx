import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  BarChart3,
  Shield,
  Image,
  User,
  Settings
} from 'lucide-react';

// Import separate components
import Overview from './Overview';
import UsersManagement from './Users';
import ArtworkManagement from './Artwork';
import Financial from './Financial';
import ComplaintsReports from './ComplaintsReports';
import UserVerification from './UserVerification';
import { CurrencyProvider } from '../../context/CurrencyContext';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger immediate smooth entrance animation without delay
    setIsLoaded(true);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'artwork', label: 'Artworks', icon: Image },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'complaints', label: 'Complaints & Reports', icon: AlertTriangle },
    { id: 'verification', label: 'User Verification', icon: Shield }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UsersManagement />;
      case 'artwork':
        return <ArtworkManagement />;
      case 'financial':
        return <Financial />;
      case 'complaints':
        return <ComplaintsReports />;
      case 'verification':
        return <UserVerification />;
      default:
        return <Overview />;
    }
  };

  return (
    <CurrencyProvider>
      {/* Optimized CSS styles for smoother animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popInContent {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-container {
          animation: smoothFadeIn 0.4s ease-out;
          opacity: 1;
        }

        .header-container {
          animation: slideInFromTop 0.5s ease-out 0.1s both;
        }

        .nav-container {
          animation: slideInFromTop 0.5s ease-out 0.2s both;
        }

        .content-container {
          animation: popInContent 0.4s ease-out 0.3s both;
        }

        .menu-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .menu-item:hover {
          transform: translateY(-1px);
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }

        /* Prevent flash of unstyled content */
        .dashboard-content {
          min-height: 200px;
        }

        /* Ensure smooth rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen page-container" style={{backgroundColor: '#FFF5E1'}}>
        {/* Full Width Header */}
        <div 
          className="w-full shadow-sm p-6 mb-8 relative header-container"
          style={{
            backgroundImage: 'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-full smooth-transition" 
                  style={{backgroundColor: '#FFD95A'}}
                >
                  <Shield size={32} style={{color: '#5D3A00'}} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-gray-200">Welcome back, Administrator!</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                {[
                  { icon: AlertTriangle, text: 'Reports', fullText: 'Review Reports' },
                  { icon: FileText, text: 'Generate', fullText: 'Generate Report' },
                  { icon: Users, text: 'Users', fullText: 'User Management' }
                ].map((btn, index) => (
                  <button
                    key={index}
                    className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                    style={{
                      borderColor: '#FFE4D6',
                      color: '#FFE4D6',
                      backgroundColor: 'rgba(255, 228, 214, 0.1)'
                    }}
                  >
                    <btn.icon size={14} />
                    <span className="hidden sm:inline">{btn.fullText}</span>
                    <span className="sm:hidden">{btn.text}</span>
                  </button>
                ))}
                
                {/* Logout Button */}
                <button
                  className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    backgroundColor: '#D87C5A',
                    color: 'white',
                    border: 'none'
                  }}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      console.log('Logout clicked');
                    }
                  }}
                >
                  <User size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-4 nav-container">
            <div style={{borderBottom: '1px solid #FFE4D6'}}>
              <nav className="flex space-x-8 px-6">
                {menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 menu-item"
                    style={{
                      borderBottomColor: activeSection === item.id ? '#5D3A00' : 'transparent',
                      color: activeSection === item.id ? '#5D3A00' : '#D87C5A'
                    }}
                    onMouseOver={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = '#5D3A00';
                        e.target.style.borderBottomColor = '#FFD95A';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = '#D87C5A';
                        e.target.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="content-container dashboard-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </CurrencyProvider>
  );
};

export default AdminDashboard;