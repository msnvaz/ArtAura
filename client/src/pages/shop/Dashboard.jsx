import React from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  Award,
  ShoppingCart,
  Package,
  Sparkles,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,847',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-[#D87C5A]',
      bgColor: 'bg-[#FFE4D6]',
      textColor: 'text-[#5D3A00]'
    },
    {
      title: 'Products in Stock',
      value: '1,247',
      change: '-3.2%',
      trend: 'down',
      icon: Package,
      color: 'bg-[#FFD95A]',
      bgColor: 'bg-[#FFF5E1]',
      textColor: 'text-[#5D3A00]'
    },
    {
      title: 'Active Rewards',
      value: '89',
      change: '+8.1%',
      trend: 'up',
      icon: Award,
      color: 'bg-[#FFD95A]',
      bgColor: 'bg-[#FFF5E1]',
      textColor: 'text-[#5D3A00]'
    },
    {
      title: 'Monthly Orders',
      value: '342',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-[#5D3A00]',
      bgColor: 'bg-[#FFF5E1]',
      textColor: 'text-[#5D3A00]'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      message: 'New order for Watercolor Set Premium',
      time: '2 minutes ago',
      amount: '$89.99',
      bgColor: 'bg-[#FFE4D6]',
      iconColor: 'text-[#D87C5A]'
    },
    {
      id: 2,
      type: 'stock',
      message: 'Low stock alert: Acrylic Paint Tubes',
      time: '15 minutes ago',
      amount: '5 items left',
      bgColor: 'bg-[#FFF5E1]',
      iconColor: 'text-[#5D3A00]'
    },
    {
      id: 3,
      type: 'reward',
      message: 'Reward claimed by Sarah Johnson',
      time: '1 hour ago',
      amount: '15% discount',
      bgColor: 'bg-[#FFF5E1]',
      iconColor: 'text-[#FFD95A]'
    },
    {
      id: 4,
      type: 'sale',
      message: 'New order for Canvas Bundle',
      time: '2 hours ago',
      amount: '$156.50',
      bgColor: 'bg-[#FFE4D6]',
      iconColor: 'text-[#D87C5A]'
    }
  ];

  return (
    <div className="space-y-6 bg-[#FFF5E1] min-h-screen p-6 animate-fade-in">
      <div className="rounded-2xl shadow-xl p-6 border border-[#FFE4D6] bg-gradient-to-r from-[#FFF5E1] to-[#FFE4D6] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD95A]/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5D3A00] to-[#D87C5A] bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#D87C5A]" />
                Welcome back, John!
              </h1>
              <p className="text-[#5D3A00] mt-2 ">Here's what's happening with your art supply shop today.</p>
            </div>
            <div className="bg-[#FFE4D6] rounded-xl p-4 border border-[#FFD95A] shadow">
              <p className="text-xs text-[#5D3A00] mb-1">Today</p>
              <p className="text-sm font-semibold text-[#5D3A00]">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-2xl shadow-xl p-6 border border-[#FFE4D6] ${stat.bgColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} shadow-lg transform transition-transform duration-500 hover:rotate-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                  stat.trend === 'up' ? 'text-[#D87C5A] bg-[#FFE4D6]' : 'text-red-700 bg-red-100'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#5D3A00] mb-1">{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D87C5A]" />
              Recent Activity
            </h2>
            <button className="text-[#D87C5A] hover:text-[#5D3A00] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FFE4D6] transition">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-xl transition duration-300 border border-transparent hover:border-[#FFD95A] hover:bg-[#FFF5E1] hover:shadow-lg hover:scale-[1.01] animate-fade-in"
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${activity.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                    {activity.type === 'sale' && <DollarSign className={`w-5 h-5 ${activity.iconColor}`} />}
                    {activity.type === 'stock' && <AlertCircle className={`w-5 h-5 ${activity.iconColor}`} />}
                    {activity.type === 'reward' && <Award className={`w-5 h-5 ${activity.iconColor}`} />}
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

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] animate-fade-in">
          <h2 className="text-xl font-bold text-[#5D3A00] mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-[#5D3A00] text-white py-3 px-4 rounded-xl hover:bg-[#472d00] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
              Add New Product
            </button>
            <button className="w-full bg-[#D87C5A] text-white py-3 px-4 rounded-xl hover:bg-[#c06949] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
              Create Reward Campaign
            </button>
            <button className="w-full bg-[#FFD95A] text-[#5D3A00] py-3 px-4 rounded-xl hover:bg-[#fccc2a] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
              Generate Sales Report
            </button>
            <button className="w-full bg-[#FFE4D6] text-[#5D3A00] py-3 px-4 rounded-xl hover:bg-[#f8d0be] transition shadow-md hover:shadow-lg text-sm font-medium transform hover:scale-105 duration-300">
              Update Inventory
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#FFD95A]">
            <h3 className="text-lg font-bold text-[#5D3A00] mb-4">Today's Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#FFF5E1] rounded-lg">
                <span className="text-sm text-[#5D3A00] font-medium">Orders</span>
                <span className="text-lg font-bold text-[#5D3A00]">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#FFE4D6] rounded-lg">
                <span className="text-sm text-[#5D3A00] font-medium">Revenue</span>
                <span className="text-lg font-bold text-[#5D3A00]">$1,247</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#FFF5E1] rounded-lg">
                <span className="text-sm text-[#5D3A00] font-medium">New Customers</span>
                <span className="text-lg font-bold text-[#5D3A00]">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
