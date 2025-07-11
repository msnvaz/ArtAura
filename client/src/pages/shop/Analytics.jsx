import React, { useState } from 'react';
import { useEffect } from 'react';

import Sidebar from '../../components/Sidebar';
import {  
  TrendingUp, 
  DollarSign, 
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Eye,
  Star,
  ShoppingCart,
  Zap,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  X
} from 'lucide-react';

const SalesAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isChartVisible, setIsChartVisible] = useState(false);

  const [showExportModal, setShowExportModal] = useState(false);

  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    dateRange: 'all',
    status: 'all',
    includeCustomerInfo: true,
    includeItems: true,
  });


  const handleExport = () => {
    console.log("Exporting with options:", exportOptions);
    setShowExportModal(false);
  };

  useEffect(() => {
  const timeout = setTimeout(() => {
    setIsChartVisible(true);
  }, 100); // delay start to allow fade-in

  return () => clearTimeout(timeout);
}, []);

  const salesData = [
    { month: 'Jan', revenue: 15500, orders: 125, customers: 98 },
    { month: 'Feb', revenue: 17200, orders: 142, customers: 112 },
    { month: 'Mar', revenue: 20700, orders: 167, customers: 134 },
    { month: 'Apr', revenue: 18400, orders: 156, customers: 128 },
    { month: 'May', revenue: 25300, orders: 189, customers: 145 },
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
      status: 'shipped',
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
      status: 'pending',
      date: '2024-03-14',
      items: 5
    },
    {
      id: '#ORD-004',
      customer: 'John Smith',
      amount: 67.25,
      status: 'delivered',
      date: '2024-03-14',
      items: 1
    }
  ];

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className='bg-emerald-200 text-emerald-800' />;
      case 'shipped': return <Truck className='bg-blue-200 text-blue-800' />;
      case 'processing': return <Clock className='bg-amber-200 text-amber-800' />;
      case 'pending': return <Calendar className='bg-gray-200 text-gray-800' />;
      case 'cancelled': return <XCircle className= 'bg-red-200 text-red-800' />;
      default: return <Clock className='bg-gray-100 text-gray-800'/>;
    }
  };

  const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'delivered': return 'bg-emerald-200 text-emerald-700';
    case 'shipped': return 'bg-blue-200 text-blue-700';
    case 'processing': return 'bg-amber-200 text-amber-700';
    case 'pending': return 'bg-gray-200 text-gray-700';
    case 'cancelled': return 'bg-red-200 text-red-700';
    default: return 'bg-gray-50 text-gray-600';
  }
};


  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="flex">
      <Sidebar />
    <div className="ml-20 md:ml-64 flex-1 space-y-6 bg-white min-h-screen p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        {/* Period Selector with Icon */}
         <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-[#FFE4D6] rounded-lg px-4 py-2 pr-8  focus:ring-0 outline-none  hover:border-[#D87C5A] focus:border-[#D87C5A] shadow text-sm "
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="12months">Last 12 months</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Calendar className="w-4 h-4 text-[#5D3A00]" />
            </div>
          </div>
        </div>

        {/* Export Button aligned right on medium+ screens */}
        <div className="w-full md:w-auto flex justify-end">
          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Download className="w-4 h-4 inline mr-2" />
            Export Data
          </button>
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
            iconBg: 'bg-[#D87C5A]',
            textColor: 'text-[#D87C5A]'
            
          },
          { 
            icon: ShoppingCart, 
            title: 'Total Orders', 
            value: totalOrders.toString(), 
            change: '+8.3%', 
            trend: 'up',
            iconBg: 'bg-[#FFD95A]',
            textColor: 'text-[#bfa100]'
          },
          { 
            icon: Users, 
            title: 'Customers', 
            value: totalCustomers.toString(), 
            change: '+15.7%', 
            trend: 'up',
            iconBg: 'bg-[#66bb6a]',
            textColor: 'text-[#2e7d32]'
          },
          { 
            icon: TrendingUp, 
            title: 'Avg. Order Value', 
            value: `$${avgOrderValue.toFixed(2)}`, 
            change: '-2.1%', 
            trend: 'down',
            iconBg: 'bg-[#ffb74d]',
            textColor: 'text-[#e65100]'
          }
        ].map((metric, index) => (
          <div
            key={index}
            className={`rounded-2xl border border-[#f3f3f3] bg-white  shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.iconBg} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                metric.trend === 'up' ? 'text-[#388e3c] bg-[#e8f5e9]' : 'text-red-700 bg-red-100'
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
              <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
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
              className="bg-white border border-[#FFE4D6] rounded-lg px-3 py-2 text-sm  focus:ring-0 outline-none  focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <div className="h-96 flex items-end justify-between space-x-2 p-4 bg-[#FFF5E1] rounded-xl">
            {salesData.map((data, index) => {
              const value = selectedMetric === 'revenue' ? data.revenue : 
                           selectedMetric === 'orders' ? data.orders : data.customers;
              const maxValue = Math.max(...salesData.map(d => 
                selectedMetric === 'revenue' ? d.revenue : 
                selectedMetric === 'orders' ? d.orders : d.customers
              ));
              const height = (value / maxValue) * 200;
               const barColors = ['#D87C5A', '#FFD95A', '#66BB6A', '#A1887F', '#BA68C8', '#5D3A00'];
               const barColor = barColors[index % barColors.length];
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-[#D87C5A] rounded-t-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-[#c06949] relative"
                      style={{ height: isChartVisible ? `${height}px` : '0px',
                              backgroundColor: barColor,
                              transitionDelay: `${index * 120}ms` }}
                    >
                       <div
                          className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold"
                          style={{
                            color: 'white',
                            backgroundColor: barColor,
                            border: `1px solid ${barColor}`,
                            boxShadow: `0 0 5px ${barColor}`,
                          }}
                        >
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
            {topProducts.slice(0, 5).map((product, index) => {
              const iconColors = ['#D87C5A', '#FFD95A', '#66BB6A', '#BA68C8', '#5D3A00']; // Add more if needed
              const iconBgColor = iconColors[index % iconColors.length];

              return (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-xl transition duration-300 border border-transparent hover:bg-[#FFF5E1] hover:shadow-lg hover:scale-[1.01]">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md"
                      style={{ backgroundColor: iconBgColor }}
                    >
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
                      product.growth > 0 ? 'text-[#388e3c] bg-[#e8f5e9]' : 'text-red-700 bg-red-100'
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#FFE4D6] overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between mb-6 p-6">
          <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D87C5A]" />
            Recent Orders
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-[#D87C5A] hover:text-[#5D3A00] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FFE4D6] transition">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#FFF5E1] to-[#FFE4D6]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF5E1]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FFF5E1]/60 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#5D3A00]">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#5D3A00]">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#5D3A00]">{order.items} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#D87C5A]">${order.amount}</div>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getOrderStatusBadge(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>



                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A00]">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r p-6 rounded-t-2xl border-b border-[#FFE4D6]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                  <Download className="w-6 h-6 text-[#D87C5A]" />
                  Export Orders
                </h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-[#5D3A00] mb-2">Export Format</label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
                  className="w-full border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg px-3 py-2 text-sm"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-[#5D3A00] mb-2">Date Range</label>
                <select
                  value={exportOptions.dateRange}
                  onChange={(e) => setExportOptions({ ...exportOptions, dateRange: e.target.value })}
                  className="w-full border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#5D3A00] mb-2">Order Status</label>
                <select
                  value={exportOptions.status}
                  onChange={(e) => setExportOptions({ ...exportOptions, status: e.target.value })}
                  className="w-full border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Include Checkboxes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5D3A00]">Include Data</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCustomerInfo}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeCustomerInfo: e.target.checked })}
                      className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                    />
                    <span className="text-sm text-[#5D3A00]">Sales Overview</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeItems}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeItems: e.target.checked })}
                      className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                    />
                    <span className="text-sm text-[#5D3A00]">Top Products</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeItems}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeItems: e.target.checked })}
                      className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                    />
                    <span className="text-sm text-[#5D3A00]">Orders</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 text-[#5D3A00] border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg hover:bg-[#FFF5E1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default SalesAnalytics;