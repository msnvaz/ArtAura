import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Palette,
  BarChart3,
  Shield,
  Settings,
  User,
  Trophy,
  RefreshCw
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import adminOverviewApi from '../../services/adminOverviewApi';

const Overview = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalArtists: 0,
    activeArtists: 0,
    platformFees: 0
  });
  const { formatPrice } = useCurrency();

  // Fetch overview data from backend
  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await adminOverviewApi.getOverviewStatistics();
      setOverviewData({
        totalUsers: data.totalUsers || 0,
        totalArtists: data.totalArtists || 0,
        activeArtists: data.activeArtists || 0,
        platformFees: data.platformFees || 0
      });
    } catch (err) {
      console.error('Error fetching overview data:', err);
      setError('Failed to load overview data - using mock data');
      // Use mock data that matches expected values when backend is not available
      setOverviewData({
        totalUsers: 4, // This should match Users.jsx count (artists + buyers + moderators)
        totalArtists: 2, // Total artists in system
        activeArtists: 1, // Active artists only
        platformFees: 137.55 // Sum of all fee_amount from platform_fees table
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
    setIsLoaded(true);
  }, []);

  const stats = [
    { 
      label: 'Total Users', 
      value: loading ? '...' : overviewData.totalUsers.toLocaleString(), 
      icon: Users, 
      color: '#D87C5A' 
    },
    { 
      label: 'Total Artists', 
      value: loading ? '...' : overviewData.totalArtists.toLocaleString(), 
      icon: Palette, 
      color: '#FFD95A' 
    },
    { 
      label: 'Platform Fees Earned', 
      value: loading ? '...' : overviewData.platformFees.toLocaleString(undefined, { style: 'currency', currency: 'LKR' }),
      icon: DollarSign, 
      color: '#5D3A00' 
    }
  ];

  const quickActions = [
    { id: 'users', label: 'User Management', icon: Users, desc: 'Manage user accounts and verifications' },
    { id: 'content', label: 'Content Moderation', icon: Shield, desc: 'Review reported content and violations' },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3, desc: 'View detailed platform statistics' },
    { id: 'settings', label: 'System Settings', icon: Settings, desc: 'Configure platform settings' }
  ];

  const recentActivity = [
    { 
      type: 'user', 
      message: `Total of ${overviewData.totalUsers} users registered on platform`, 
      time: 'System stats', 
      icon: User 
    },
    { 
      type: 'payment', 
      message: `Platform earned ${formatPrice(overviewData.platformFees)} in fees`, 
      time: 'Financial stats', 
      icon: DollarSign 
    },
    { 
      type: 'artists', 
      message: `${overviewData.totalArtists} total artists on platform`, 
      time: 'Artist stats', 
      icon: Palette 
    },
    { 
      type: 'active', 
      message: `${overviewData.activeArtists} artists currently active`, 
      time: 'Active stats', 
      icon: Trophy 
    }
  ];

  return (
    <>
      {/* Add smooth animations */}
      <style>{`
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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .overview-container {
          animation: smoothFadeIn 0.4s ease-out;
        }

        .stats-grid {
          animation: slideInUp 0.5s ease-out 0.1s both;
        }

        .actions-section {
          animation: slideInUp 0.5s ease-out 0.2s both;
        }

        .activity-section {
          animation: slideInUp 0.5s ease-out 0.3s both;
        }

        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="w-full overview-container">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{color: '#5D3A00'}}>Admin Overview</h1>
            <p className="text-lg" style={{color: '#D87C5A'}}>Platform statistics and insights</p>
          </div>
          <button
            onClick={fetchOverviewData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: loading ? '#cccccc' : '#D87C5A',
              color: 'white'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#C06F4A';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#D87C5A';
              }
            }}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden stat-card" style={{backgroundColor: '#FFF5E1'}}>
              {/* Background Image */}
              <div 
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: index === 0 
                    ? 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Users - people working
                    : index === 1 
                    ? 'url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Artists - art gallery
                    : 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Platform fees - money/coins
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="p-4 relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                    <h2 className="text-2xl font-bold" style={{color: '#5D3A00'}}>
                      {loading ? (
                        <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </h2>
                  </div>
                  <div className="p-3 rounded-lg shadow-lg" style={{backgroundColor: stat.color}}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden actions-section" style={{backgroundColor: '#FFF5E1'}}>
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="p-5 relative z-10">
              <h2 className="text-xl font-bold mb-4" style={{color: '#5D3A00'}}>Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="border rounded-lg p-4 text-left h-full transition-all duration-200 relative overflow-hidden"
                    style={{
                      borderColor: '#FFE4D6',
                      backgroundColor: '#FFE4D6'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#FFD95A';
                      e.target.style.borderColor = '#D87C5A';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(93, 58, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#FFE4D6';
                      e.target.style.borderColor = '#FFE4D6';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <action.icon size={20} className="mb-2" style={{color: '#5D3A00'}} />
                    <h6 className="font-semibold mb-1" style={{color: '#5D3A00'}}>{action.label}</h6>
                    <small style={{color: '#5D3A00'}}>{action.desc}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden activity-section" style={{backgroundColor: '#FFF5E1'}}>
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4" style={{color: '#5D3A00'}}>Recent Activity</h2>
              <div className="flex flex-col gap-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-50">
                    <div className="p-2 rounded shadow-sm" style={{backgroundColor: '#FFE4D6'}}>
                      <activity.icon size={16} style={{color: '#5D3A00'}} />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm" style={{color: '#5D3A00'}}>{activity.message}</p>
                      <small style={{color: '#D87C5A'}}>{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
