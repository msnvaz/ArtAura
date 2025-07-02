import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Eye,
  Star,
  ShoppingCart,
  Sparkles,
  Zap
} from 'lucide-react';

const SalesAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const salesData = [
    { month: 'Jan', revenue: 12500, orders: 125, customers: 98 },
    { month: 'Feb', revenue: 15200, orders: 142, customers: 112 },
    { month: 'Mar', revenue: 18700, orders: 167, customers: 134 },
    { month: 'Apr', revenue: 16400, orders: 156, customers: 128 },
    { month: 'May', revenue: 21300, orders: 189, customers: 145 },
    { month: 'Jun', revenue: 19800, orders: 178, customers: 139 }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Watercolor Paint Set Professional',
      sales: 89,
      revenue: 8010,
      growth: 15.2,
      category: 'Paints',
      icon: Package
    },
    {
      id: 2,
      name: 'Professional Brush Set',
      sales: 67,
      revenue: 8374,
      growth: 8.7,
      category: 'Brushes',
      icon: Package
    },
    {
      id: 3,
      name: 'Canvas Stretched Pack',
      sales: 156,
      revenue: 5382,
      growth: -3.2,
      category: 'Canvas',
      icon: Package
    },
    {
      id: 4,
      name: 'Acrylic Paint Tubes',
      sales: 43,
      revenue: 2923,
      growth: 22.1,
      category: 'Paints',
      icon: Package
    },
    {
      id: 5,
      name: 'Easel Desktop Adjustable',
      sales: 28,
      revenue: 4368,
      growth: 12.5,
      category: 'Equipment',
      icon: Package
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'Sarah Johnson',
      amount: 156.50,
      status: 'completed',
      date: '2024-03-15',
      items: 3
    },
    {
      id: '#ORD-002',
      customer: 'Mike Chen',
      amount: 89.99,
      status: 'processing',
      date: '2024-03-15',
      items: 2
    },
    {
      id: '#ORD-003',
      customer: 'Emma Davis',
      amount: 234.75,
      status: 'completed',
      date: '2024-03-14',
      items: 5
    },
    {
      id: '#ORD-004',
      customer: 'John Smith',
      amount: 67.25,
      status: 'shipped',
      date: '2024-03-14',
      items: 1
    }
  ];

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE4D6] text-[#5D3A00] border border-[#D87C5A]">✓ Completed</span>;
      case 'processing':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF5E1] text-[#5D3A00] border border-[#FFD95A]">⏳ Processing</span>;
      case 'shipped':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE4D6] text-[#5D3A00] border border-[#D87C5A]">🚚 Shipped</span>;
      default:
        return null;
    }
  };

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6 bg-[#FFF5E1] min-h-screen p-6 animate-fade-in">
      {/* Header Section */}
      <div className="rounded-2xl shadow-xl p-6 border border-[#FFE4D6] bg-gradient-to-r from-[#FFF5E1] via-[#FFD95A]/30 to-[#FFE4D6] relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD95A]/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5D3A00] to-[#D87C5A] bg-clip-text text-transparent flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#D87C5A]" />
                Sales Analytics
              </h1>
              <p className="text-[#5D3A00] mt-2 ">Track your performance and insights.</p>
            </div>
            <div className="mt-6 lg:mt-0 flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white border border-[#FFE4D6] rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-[#D87C5A] focus:border-[#D87C5A] shadow text-[#5D3A00] font-medium"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="12months">Last 12 months</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none   px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Calendar className="w-4 h-4 text-[#5D3A00]" />
                </div>
              </div>
              <button className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Download className="w-4 h-4 inline mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            icon: DollarSign, 
            title: 'Total Revenue', 
            value: `$${totalRevenue.toLocaleString()}`, 
            change: '+12.5%', 
            trend: 'up',
            color: 'bg-[#D87C5A]',
            bgColor: 'bg-[#FFE4D6]'
          },
          { 
            icon: ShoppingCart, 
            title: 'Total Orders', 
            value: totalOrders.toString(), 
            change: '+8.3%', 
            trend: 'up',
            color: 'bg-[#5D3A00]',
            bgColor: 'bg-[#FFF5E1]'
          },
          { 
            icon: Users, 
            title: 'Customers', 
            value: totalCustomers.toString(), 
            change: '+15.7%', 
            trend: 'up',
            color: 'bg-[#FFD95A]',
            bgColor: 'bg-[#FFF5E1]'
          },
          { 
            icon: TrendingUp, 
            title: 'Avg. Order Value', 
            value: `$${avgOrderValue.toFixed(2)}`, 
            change: '-2.1%', 
            trend: 'down',
            color: 'bg-[#D87C5A]',
            bgColor: 'bg-[#FFE4D6]'
          }
        ].map((metric, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-xl p-6 border border-[#FFE4D6] ${metric.bgColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.color} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                metric.trend === 'up' ? 'text-[#D87C5A] bg-[#FFE4D6]' : 'text-red-700 bg-red-100'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D3A00] mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-[#5D3A00]">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D87C5A]" />
              Sales Overview
            </h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-white border border-[#FFE4D6] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D87C5A] focus:border-[#D87C5A] text-[#5D3A00] font-medium"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2 p-4 bg-[#FFF5E1] rounded-xl">
            {salesData.map((data, index) => {
              const value = selectedMetric === 'revenue' ? data.revenue : 
                           selectedMetric === 'orders' ? data.orders : data.customers;
              const maxValue = Math.max(...salesData.map(d => 
                selectedMetric === 'revenue' ? d.revenue : 
                selectedMetric === 'orders' ? d.orders : d.customers
              ));
              const height = (value / maxValue) * 200;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-[#D87C5A] rounded-t-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-[#c06949] relative"
                      style={{ height: `${height}px` }}
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#5D3A00] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                        {selectedMetric === 'revenue' ? `$${value.toLocaleString()}` : value}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#5D3A00] mt-2 font-semibold">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D87C5A]" />
              Top Products
            </h2>
            <button className="text-[#D87C5A] hover:text-[#5D3A00] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FFE4D6] transition">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-xl transition duration-300 border border-transparent hover:border-[#FFD95A] hover:bg-[#FFF5E1] hover:shadow-lg hover:scale-[1.01]">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#D87C5A] text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#5D3A00] text-sm">{product.name}</h4>
                    <p className="text-xs text-[#5D3A00] opacity-70">{product.sales} sold • {product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#5D3A00] text-sm">${product.revenue.toLocaleString()}</p>
                  <div className={`flex items-center text-xs font-semibold ${
                    product.growth > 0 ? 'text-[#D87C5A]' : 'text-red-700'
                  }`}>
                    {product.growth > 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(product.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D87C5A]" />
            Recent Orders
          </h2>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-[#5D3A00] hover:text-[#D87C5A] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FFF5E1] transition">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="text-[#D87C5A] hover:text-[#5D3A00] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FFE4D6] transition">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#FFE4D6]">
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Order ID</th>
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Customer</th>
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Amount</th>
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Items</th>
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Status</th>
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Date</th>
                <th className="text-left py-4 px-3 text-sm font-bold text-[#5D3A00]">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#FFE4D6] hover:bg-[#FFF5E1] transition-all duration-300">
                  <td className="py-4 px-3">
                    <span className="font-mono text-xs text-[#5D3A00] bg-[#FFE4D6] px-3 py-2 rounded-lg font-semibold">{order.id}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-semibold text-[#5D3A00]">{order.customer}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-bold text-[#D87C5A] text-lg">${order.amount}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-[#5D3A00] font-medium">{order.items} items</span>
                  </td>
                  <td className="py-4 px-3">
                    {getOrderStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-[#5D3A00] text-sm font-medium opacity-70">{order.date}</span>
                  </td>
                  <td className="py-4 px-3">
                    <button className="p-2 text-[#D87C5A] hover:bg-[#FFE4D6] rounded-xl transition-all duration-300 hover:scale-110">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;