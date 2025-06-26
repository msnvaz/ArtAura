import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Plus, 
  ShoppingCart,
  BarChart3,
  Gift,
  Star,
  Trophy
} from 'lucide-react';
import Navbar from '../../components/common/ShopNavbar';

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Products Sold', value: '156', icon: <Package className="h-5 w-5" />, change: '+23%' },
    { label: 'Revenue', value: '$4,230', icon: <TrendingUp className="h-5 w-5" />, change: '+18%' },
    { label: 'Active Products', value: '48', icon: <Store className="h-5 w-5" />, change: '+5' },
    { label: 'Customer Rating', value: '4.8', icon: <Star className="h-5 w-5" />, change: '+0.2' }
  ];

  const recentOrders = [
    { id: 'O001', customer: 'Sarah Martinez', items: 'Acrylic Paint Set, Brushes', amount: '$89.99', status: 'Shipped', date: '2024-01-15' },
    { id: 'O002', customer: 'Mike Johnson', items: 'Canvas Pack (5)', amount: '$45.00', status: 'Processing', date: '2024-01-15' },
    { id: 'O003', customer: 'Emma Wilson', items: 'Watercolor Set', amount: '$67.50', status: 'Delivered', date: '2024-01-14' }
  ];

  const topProducts = [
    { name: 'Professional Acrylic Paint Set', sales: 45, revenue: '$1,350', image: 'https://images.pexels.com/photos/1153895/pexels-photo-1153895.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Canvas Pack (10 pieces)', sales: 38, revenue: '$912', image: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Watercolor Brush Set', sales: 32, revenue: '$640', image: 'https://images.pexels.com/photos/1303550/pexels-photo-1303550.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ];

    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream/20 py-8">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-brown p-3 rounded-full">
                <Store className="h-8 w-8 text-cream" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brown">Shop Dashboard</h1>
                <p className="text-brown/70">Manage your art supply store</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/sponsorship/requests"
                className="bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition-colors font-medium flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Sponsorship Center</span>
              </Link>
              <button className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-cream/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'products', label: 'Product Catalog' },
                { id: 'orders', label: 'Orders' },
                { id: 'analytics', label: 'Sales Analytics' },
                { id: 'rewards', label: 'Reward System' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brown text-brown'
                      : 'border-transparent text-brown/60 hover:text-brown hover:border-brown/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brown/70">{stat.label}</p>
                      <p className="text-2xl font-bold text-brown">{stat.value}</p>
                    </div>
                    <div className="text-brown/60">{stat.icon}</div>
                  </div>
                  <div className="flex items-center mt-4">
                    <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                    <span className="text-brown/50 text-sm ml-2">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-cream/50">
                  <h3 className="text-lg font-semibold text-brown">Recent Orders</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-cream/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-brown">{order.customer}</p>
                          <p className="text-sm text-brown/70">{order.items}</p>
                          <p className="text-xs text-brown/50">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brown">{order.amount}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-brown hover:bg-cream/50 py-2 rounded-lg transition-colors font-medium">
                    View All Orders
                  </button>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-cream/50">
                  <h3 className="text-lg font-semibold text-brown">Top Selling Products</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-cream/30 rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-brown">{product.name}</p>
                          <p className="text-sm text-brown/70">{product.sales} units sold</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brown">{product.revenue}</p>
                          <p className="text-xs text-brown/50">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-brown hover:bg-cream/50 py-2 rounded-lg transition-colors font-medium">
                    View Full Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <Gift className="h-16 w-16 text-brown/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brown mb-2">Reward Distribution System</h3>
              <p className="text-brown/70 mb-6">
                Manage sponsorships and reward programs for art challenges and exhibitions
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="p-6 bg-cream/30 rounded-lg">
                  <h4 className="font-semibold text-brown mb-3">Sponsorship Requests</h4>
                  <p className="text-sm text-brown/70 mb-4">
                    Submit requests to sponsor art challenges and community events
                  </p>
                  <Link
                    to="/sponsorship/requests"
                    className="bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition-colors font-medium inline-block"
                  >
                    Manage Sponsorships
                  </Link>
                </div>
                <div className="p-6 bg-cream/30 rounded-lg">
                  <h4 className="font-semibold text-brown mb-3">Active Sponsorships</h4>
                  <p className="text-sm text-brown/70 mb-4">
                    Track your current sponsorship commitments and their impact
                  </p>
                  <button className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium">
                    View Sponsorships
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab !== 'overview' && activeTab !== 'rewards' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold text-brown mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h3>
            <p className="text-brown/70">
              This section is under development. More shop management features coming soon!
            </p>
          </div>
        )}
          </div>
          </div>
  </>
);
};

export default ShopDashboard;
