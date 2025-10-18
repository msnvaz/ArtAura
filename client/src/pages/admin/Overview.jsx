import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  BarChart3,
  User,
  Trophy,
  RefreshCw,
  TrendingUp,
  CreditCard,
  Calendar,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import adminOverviewApi from '../../services/adminOverviewApi';
import adminPaymentApi from '../../services/adminPaymentApi';
import adminSettingsApi from '../../services/adminSettingsApi';

const Overview = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalArtists: 0,
    activeArtists: 0,
    platformFees: 0,
    totalTransactions: 0,
    pendingPayments: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
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
        platformFees: data.platformFees || 0,
        totalTransactions: data.totalTransactions || 0,
        pendingPayments: data.pendingPayments || 0
      });
    } catch (err) {
      console.error('Error fetching overview data:', err);
      setError('Failed to load overview data - using mock data');
      // Use mock data that matches expected values when backend is not available
      setOverviewData({
        totalUsers: 4, // This should match Users.jsx count (artists + buyers + moderators)
        totalArtists: 2, // Total artists in system
        activeArtists: 1, // Active artists only
        platformFees: 137.55, // Sum of all fee_amount from platform_fees table
        totalTransactions: 320,
        pendingPayments: 8
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent payments for recent activities
  const fetchRecentPayments = async () => {
    if (!token) return;
    
    try {
      const params = {
        page: 0,
        size: 3, // Get last 3 payments for recent activities
        sortBy: 'created_at',
        sortOrder: 'DESC'
      };
      
      const data = await adminPaymentApi.getPayments(params);
      setRecentPayments(data.payments || []);
    } catch (err) {
      console.error('Error fetching recent payments:', err);
      // Use mock data if API fails
      setRecentPayments([
        {
          id: 1,
          amount: 299.99,
          status: 'paid',
          paymentType: 'order',
          buyerName: 'John Smith',
          artistName: 'Sarah Johnson',
          orderDescription: 'Abstract Painting Commission',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          amount: 150.00,
          status: 'escrow',
          paymentType: 'commission',
          buyerName: 'Emily Davis',
          artistName: 'Michael Brown',
          commissionTitle: 'Portrait Drawing',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    }
  };

  useEffect(() => {
    fetchOverviewData();
    fetchRecentPayments();
    setIsLoaded(true);
  }, [token]);

  // Admin settings state
  const [adminSettings, setAdminSettings] = useState([]);
  const [savingId, setSavingId] = useState(null);

  const fetchAdminSettings = async () => {
    try {
      const data = await adminSettingsApi.getAllSettings();
      // normalize to settings array
      const settings = data.settings || data || [];
      setAdminSettings(settings);
    } catch (err) {
      console.error('Error fetching admin settings:', err);
    }
  };

  const handleSettingChange = (id, value) => {
    setAdminSettings(prev => prev.map(s => s.settingId === id ? { ...s, settingValue: value } : s));
  };

  const handleUpdateAllSettings = async () => {
    try {
      setSavingId('all');
      // Update all settings
      await Promise.all(
        adminSettings.map(setting => 
          adminSettingsApi.updateSetting(setting.settingId, setting.settingValue)
        )
      );
      // optionally refetch
      await fetchAdminSettings();
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSavingId(null);
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const stats = [
    { 
      label: 'Total Users', 
      value: loading ? '...' : overviewData.totalUsers.toLocaleString(), 
      icon: Users, 
      color: '#D87C5A',
      trend: ''
    },
    { 
      label: 'Total Artists', 
      value: loading ? '...' : overviewData.totalArtists.toLocaleString(), 
      icon: User, 
      color: '#FFD95A',
      trend: ''
    },
    { 
      label: 'Platform Fees Earned', 
      value: loading ? '...' : overviewData.platformFees.toLocaleString(undefined, { style: 'currency', currency: 'LKR' }),
      icon: DollarSign, 
      color: '#5D3A00',
      trend: ''
    },
    { 
      label: 'Total Transactions', 
      value: loading ? '...' : overviewData.totalTransactions.toLocaleString(), 
      icon: CreditCard, 
      color: '#4CAF50',
      trend: ''
    },
    { 
      label: 'Pending Payments', 
      value: loading ? '...' : overviewData.pendingPayments.toLocaleString(), 
      icon: Calendar, 
      color: '#FF9800',
      trend: ''
    }
  ];

  // Mini chart component for trend visualization
  const MiniChart = ({ trend }) => (
    <div className="flex items-center">
      <TrendingUp className={`w-4 h-4 mr-1 ${trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`} />
      <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
        {trend}
      </span>
    </div>
  );

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden stat-card" style={{backgroundColor: '#FFF5E1'}}>
              {/* Background Image */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: index === 0 
                    ? 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Users - people working
                    : index === 1 
                    ? 'url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Artists - art gallery
                    : index === 2
                    ? 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Platform fees - money/coins
                    : index === 3
                    ? 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Transactions - credit cards
                    : 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Pending - calendar
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-1 opacity-80" style={{color: '#5D3A00'}}>{stat.label}</p>
                    <h2 className="text-xl font-bold" style={{color: '#5D3A00'}}>
                      {loading ? (
                        <div className="animate-pulse bg-gray-300 h-6 w-16 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </h2>
                  </div>
                  <div className="p-2 rounded-lg shadow-md" style={{backgroundColor: stat.color}}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <MiniChart trend={stat.trend} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities & Admin Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities Section */}
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4 flex items-center" style={{color: '#5D3A00'}}>
                <Activity className="mr-2" size={24} />
                Recent Activities
              </h2>
              <div className="space-y-3">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment) => {
                    const timeAgo = new Date(payment.createdAt).toLocaleString();
                    const paymentDescription = payment.paymentType === 'order' 
                      ? payment.orderDescription 
                      : payment.commissionTitle;
                    
                    let activityText = '';
                    if (payment.status === 'paid') {
                      activityText = `Payment of LKR ${payment.amount} completed for "${paymentDescription}" from ${payment.buyerName} to ${payment.artistName}.`;
                    } else if (payment.status === 'escrow') {
                      activityText = `Payment of LKR ${payment.amount} held in escrow between ${payment.buyerName} and ${payment.artistName}.`;
                    } else {
                      activityText = `New ${payment.paymentType} payment of LKR ${payment.amount} initiated for "${paymentDescription}".`;
                    }

                    return (
                      <div key={payment.id} className="p-4 bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm" style={{color: '#5D3A00'}}>
                              {activityText}
                            </p>
                            <p className="text-xs mt-2 opacity-60" style={{color: '#D87C5A'}}>
                              {timeAgo}
                            </p>
                          </div>
                          <div className="ml-4 p-2 rounded-full" style={{
                            backgroundColor: payment.status === 'paid' ? '#4CAF50' : 
                                           payment.status === 'escrow' ? '#FF9800' : '#2196F3'
                          }}>
                            {payment.status === 'paid' ? (
                              <CheckCircle size={16} className="text-white" />
                            ) : payment.status === 'escrow' ? (
                              <Clock size={16} className="text-white" />
                            ) : (
                              <DollarSign size={16} className="text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Activity size={48} className="mx-auto mb-4 opacity-30" style={{color: '#5D3A00'}} />
                    <p className="text-sm opacity-60" style={{color: '#5D3A00'}}>No recent activities</p>
                  </div>
                )}
              </div>
              
            </div>
          </div>

          {/* Admin Settings Section */}
          <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
            <div className="p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4" style={{color: '#5D3A00'}}>Admin Settings</h2>
              <div className="space-y-2">
                {adminSettings.length > 0 ? (
                  adminSettings.map((setting) => (
                    <div key={setting.settingId} className="p-2 bg-white rounded border">
                      <p className="text-xs font-medium mb-1" style={{color: '#5D3A00'}}>
                        {setting.settingName.replace(/_/g, ' ')}
                      </p>
                      <input
                        type="text"
                        className="w-full border px-2 py-1 text-sm rounded"
                        value={setting.settingValue}
                        onChange={(e) => handleSettingChange(setting.settingId, e.target.value)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm opacity-60" style={{color: '#5D3A00'}}>No settings available</p>
                  </div>
                )}
              </div>
              
              {/* Single Update All Button */}
              {adminSettings.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button
                    className="w-full py-2 px-4 rounded font-medium text-sm transition-all duration-200"
                    style={{ backgroundColor: '#D87C5A', color: 'white' }}
                    onClick={handleUpdateAllSettings}
                    disabled={savingId === 'all'}
                    onMouseOver={(e) => {
                      if (savingId !== 'all') {
                        e.target.style.backgroundColor = '#C06F4A';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (savingId !== 'all') {
                        e.target.style.backgroundColor = '#D87C5A';
                      }
                    }}
                  >
                    {savingId === 'all' ? 'Updating...' : 'Update All Settings'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
