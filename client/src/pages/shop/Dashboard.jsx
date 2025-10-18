import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  Award,
  ShoppingCart,
  Package,
  Zap,
  Handshake
} from 'lucide-react';

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard statistics from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const shopId = localStorage.getItem("shopId");

        if (!shopId) {
          throw new Error("Shop ID not found. Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/api/shop/dashboard/stats?shopId=${shopId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        console.log("Dashboard data received:", data);
        setDashboardData(data);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [API_URL]);

  // Get current month name
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  // --- Statistics Card Data (Dynamic from backend) ---
  const stats = dashboardData ? [
    {
      title: 'Total Revenue',
      value: `Rs. ${Number(dashboardData.totalRevenue || 0).toLocaleString()}`,
      change: dashboardData.revenueChange || '0.0%',
      trend: dashboardData.revenueChange?.startsWith('+') ? 'up' : 'down',
      icon: DollarSign,
      iconBg: 'bg-[#D87C5A]',
      textColor: 'text-[#D87C5A]',
    },
    {
      title: 'Products in Stock',
      value: String(dashboardData.productsInStock || 0),
      change: dashboardData.stockChange || '0.0%',
      trend: dashboardData.stockChange?.startsWith('+') ? 'up' : 'down',
      icon: Package,
      iconBg: 'bg-[#ffd95a]',
      textColor: 'text-[#bfa100]',
    },
    {
      title: `${currentMonth} Orders`,
      subtitle: 'This month',
      value: String(dashboardData.monthlyOrders || 0),
      change: dashboardData.ordersChange || '0.0%',
      trend: dashboardData.ordersChange?.startsWith('+') ? 'up' : 'down',
      icon: ShoppingCart,
      iconBg: 'bg-[#ffb74d]',
      textColor: 'text-[#e65100]',
    }
  ] : [];

  // --- Recent Activities Data (Sri Lankan Context) ---
  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      message: 'New order for Watercolor Set Premium',
      time: '2 minutes ago',
      amount: 'Rs. 2,500',
      bgColor: 'bg-[#FFD95A]',   
      iconColor: 'text-white'
    },
    {
      id: 2,
      type: 'stock',
      message: 'Low stock alert: Acrylic Paint Tubes',
      time: '15 minutes ago',
      amount: '8 items left',
      bgColor: 'bg-[#D87C5A]',   
      iconColor: 'text-white'
    },
    {
      id: 3,
      type: 'sponsorship',
      message: 'Sponsorship granted to Kamal Perera',
      time: '1 hour ago',
      amount: '15% discount',
      bgColor: 'bg-[#66bb6a]', 
      iconColor: 'text-white'
    },
    {
      id: 4,
      type: 'sale',
      message: 'New order for Canvas Bundle from Kandy',
      time: '2 hours ago',
      amount: 'Rs. 4,200',
      bgColor: 'bg-[#FFD95A]',   
      iconColor: 'text-white'
    },
    {
      id: 5,
      type: 'sponsorship',
      message: 'Sponsorship granted to Nimal Silva',
      time: '3 hours ago',
      amount: '10% discount',
      bgColor: 'bg-[#66bb6a]', 
      iconColor: 'text-white'
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D87C5A] mx-auto mb-4"></div>
              <p className="text-[#5D3A00] font-semibold">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-[#5D3A00] font-semibold text-lg mb-2">Failed to load dashboard</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Dashboard Container with proper spacing */}
      <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
        
        {/* Stats Cards Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#f3f3f3] bg-white shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg transform transition-transform duration-500 hover:rotate-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                      stat.trend === 'up' ? 'text-[#388e3c] bg-[#e8f5e9]' : 'text-red-700 bg-red-100'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5D3A00] mb-1">{stat.title}</h3>
                    {stat.subtitle && (
                      <p className="text-xs text-[#5D3A00] opacity-60 mb-2">{stat.subtitle}</p>
                    )}
                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

          {/* Recent Activities Card */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[#f3f3f3] shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D87C5A]" />
                Recent Activity
              </h2>
              <button className="text-[#D87C5A] hover:text-[#5D3A00] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FFE4D6] transition">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-xl transition duration-300 border border-transparent hover:bg-[#FFF5E1] hover:shadow-lg hover:scale-[1.01] animate-fade-in"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${activity.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                      {activity.type === 'sale' && <DollarSign className={`w-5 h-5 ${activity.iconColor}`} />}
                      {activity.type === 'stock' && <AlertCircle className={`w-5 h-5 ${activity.iconColor}`} />}
                      {activity.type === 'sponsorship' && <Handshake className={`w-5 h-5 ${activity.iconColor}`} />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#5D3A00]">{activity.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-[#5D3A00] flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                      <p className="text-sm font-bold text-[#5D3A00]">{activity.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] border border-[#f3f3f3] p-6 lg:p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-[#5D3A00] mb-6">Quick Actions</h2>
            
            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button className="w-full bg-[#5D3A00] text-white py-3 px-4 rounded-xl hover:bg-[#472d00] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
                Add New Product
              </button>
              <button className="w-full bg-[#D87C5A] text-white py-3 px-4 rounded-xl hover:bg-[#c06949] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
                Generate Sales Report
              </button>
              <button className="w-full bg-[#FFD95A] text-[#5D3A00] py-3 px-4 rounded-xl hover:bg-[#fccc2a] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
                Grant Sponsorship
              </button>
              <button className="w-full bg-[#FFE4D6] text-[#5D3A00] py-3 px-4 rounded-xl hover:bg-[#f8d0be] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
                Update Inventory
              </button>
            </div>

            {/* Today's Overview Section */}
            <div className="pt-6 border-t border-[#FFD95A]/30">
              <h3 className="text-lg font-bold text-[#5D3A00] mb-4">Today's Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-[#FFF5E1] rounded-xl border border-[#FFD95A]/20">
                  <span className="text-sm text-[#5D3A00] font-medium">Orders</span>
                  <span className="text-lg font-bold text-[#5D3A00]">
                    {dashboardData ? dashboardData.todayOrders || 0 : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#FFE4D6] rounded-xl border border-[#D87C5A]/20">
                  <span className="text-sm text-[#5D3A00] font-medium">Revenue</span>
                  <span className="text-lg font-bold text-[#5D3A00]">
                    Rs. {dashboardData ? Number(dashboardData.todayRevenue || 0).toLocaleString() : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#E8F5E9] rounded-xl border border-green-200">
                  <span className="text-sm text-[#5D3A00] font-medium">New Customers</span>
                  <span className="text-lg font-bold text-[#5D3A00]">
                    {dashboardData ? dashboardData.todayNewCustomers || 0 : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
