import {
    BarChart3,
    Package,
    DollarSign,
    Clock,
    TrendingUp,
    Calendar,
    MapPin,
    Star,
    CheckCircle,
    Truck,
    AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DeliveryDashboard = () => {
  const { token } = useAuth();
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalDeliveries: 0,
      completedDeliveries: 0,
      activeDeliveries: 0,
      totalEarnings: 0,
      avgRating: 0,
      completionRate: 0
    },
    recentDeliveries: [],
    monthlyEarnings: [],
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock dashboard data
  const mockDashboardData = {
    stats: {
      totalDeliveries: 47,
      completedDeliveries: 43,
      activeDeliveries: 2,
      totalEarnings: 125600,
      avgRating: 4.8,
      completionRate: 91.5
    },
    recentDeliveries: [
      {
        id: 1,
        artwork: 'Sunset over Sigiriya',
        artist: 'Saman Kumara',
        buyer: 'Nimal Silva',
        deliveryDate: '2024-08-14',
        fee: 3200,
        status: 'completed',
        rating: 5
      },
      {
        id: 2,
        artwork: 'Traditional Mask Collection',
        artist: 'Priya Jayawardena',
        buyer: 'Ravi Perera',
        deliveryDate: '2024-08-13',
        fee: 3500,
        status: 'completed',
        rating: 4.5
      },
      {
        id: 3,
        artwork: 'Tea Plantation Vista',
        artist: 'Chaminda Fernando',
        buyer: 'Malini Silva',
        deliveryDate: '2024-08-12',
        fee: 2800,
        status: 'completed',
        rating: 5
      }
    ],
    monthlyEarnings: [
      { month: 'Jan', earnings: 18500 },
      { month: 'Feb', earnings: 22300 },
      { month: 'Mar', earnings: 19800 },
      { month: 'Apr', earnings: 25600 },
      { month: 'May', earnings: 21200 },
      { month: 'Jun', earnings: 27400 },
      { month: 'Jul', earnings: 24800 },
      { month: 'Aug', earnings: 15200 } // Current month (partial)
    ],
    pendingRequests: 3
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
          <div className="flex justify-center items-center">
            <div 
              className="animate-spin rounded-full h-16 w-16 border-b-2"
              style={{ borderColor: '#5D3A00' }}
            ></div>
          </div>
          <p className="mt-4" style={{ color: '#D87C5A' }}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Quick Action Cards - Admin Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="text-white p-6 rounded-lg shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #5D3A00 0%, #D87C5A 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">New Delivery Requests</h3>
              <p className="text-3xl font-bold">{dashboardData.pendingRequests}</p>
              <p className="text-gray-200 text-sm mt-1">Waiting for your response</p>
            </div>
            <Package className="h-12 w-12 text-white opacity-80" />
          </div>
          <div className="mt-4">
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#FFD95A',
                color: '#5D3A00'
              }}
            >
              View Requests
            </button>
          </div>
        </div>

        <div 
          className="text-white p-6 rounded-lg shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #D87C5A 0%, #FFD95A 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D3A00' }}>Active Deliveries</h3>
              <p className="text-3xl font-bold" style={{ color: '#5D3A00' }}>{dashboardData.stats.activeDeliveries}</p>
              <p className="text-sm mt-1" style={{ color: '#5D3A00', opacity: 0.8 }}>In progress</p>
            </div>
            <Truck className="h-12 w-12" style={{ color: '#5D3A00', opacity: 0.8 }} />
          </div>
          <div className="mt-4">
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#5D3A00',
                color: 'white'
              }}
            >
              Track Deliveries
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview - Admin Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Deliveries</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{dashboardData.stats.totalDeliveries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <DollarSign className="h-8 w-8" style={{ color: '#D87C5A' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Total Earnings</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>
                {formatCurrency(dashboardData.stats.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFD95A' }}
            >
              <Star className="h-8 w-8" style={{ color: '#5D3A00' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Average Rating</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{dashboardData.stats.avgRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <TrendingUp className="h-8 w-8" style={{ color: '#D87C5A' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#D87C5A' }}>Completion Rate</p>
              <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{dashboardData.stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Earnings Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: '#5D3A00' }}>Monthly Earnings</h3>
            <BarChart3 className="h-5 w-5" style={{ color: '#D87C5A' }} />
          </div>
          <div className="space-y-4">
            {dashboardData.monthlyEarnings.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#D87C5A' }}>{data.month}</span>
                <div className="flex items-center flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: '#5D3A00',
                        width: `${(data.earnings / Math.max(...dashboardData.monthlyEarnings.map(d => d.earnings))) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#5D3A00' }}>
                  {formatCurrency(data.earnings)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: '#5D3A00' }}>Recent Deliveries</h3>
            <Clock className="h-5 w-5" style={{ color: '#D87C5A' }} />
          </div>
          <div className="space-y-4">
            {dashboardData.recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFE4D6' }}>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#5D3A00' }}>{delivery.artwork}</p>
                  <p className="text-xs" style={{ color: '#D87C5A' }}>{delivery.artist} → {delivery.buyer}</p>
                  <p className="text-xs" style={{ color: '#D87C5A', opacity: 0.8 }}>{delivery.deliveryDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" style={{ color: '#5D3A00' }}>
                    {formatCurrency(delivery.fee)}
                  </p>
                  <div className="flex items-center justify-end mt-1">
                    <Star className="h-3 w-3" style={{ color: '#FFD95A' }} />
                    <span className="text-xs ml-1" style={{ color: '#D87C5A' }}>{delivery.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-6" style={{ color: '#5D3A00' }}>Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <CheckCircle className="h-6 w-6" style={{ color: '#5D3A00' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>{dashboardData.stats.completedDeliveries}</p>
            <p className="text-sm" style={{ color: '#D87C5A' }}>Completed Deliveries</p>
          </div>
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
              style={{ backgroundColor: '#FFD95A' }}
            >
              <Clock className="h-6 w-6" style={{ color: '#5D3A00' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>2.5</p>
            <p className="text-sm" style={{ color: '#D87C5A' }}>Avg. Delivery Time (days)</p>
          </div>
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              <Star className="h-6 w-6" style={{ color: '#D87C5A' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#5D3A00' }}>98%</p>
            <p className="text-sm" style={{ color: '#D87C5A' }}>Customer Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Alerts/Notifications */}
      {dashboardData.pendingRequests > 0 && (
        <div 
          className="border rounded-lg p-4"
          style={{ 
            backgroundColor: '#FFE4D6',
            borderColor: '#D87C5A'
          }}
        >
          <div className="flex">
            <AlertCircle className="h-5 w-5" style={{ color: '#D87C5A' }} />
            <div className="ml-3">
              <h3 className="text-sm font-medium" style={{ color: '#5D3A00' }}>
                You have {dashboardData.pendingRequests} pending delivery request{dashboardData.pendingRequests > 1 ? 's' : ''}
              </h3>
              <p className="text-sm mt-1" style={{ color: '#D87C5A' }}>
                Review and respond to these requests to maintain your response time rating.
              </p>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default DeliveryDashboard;
