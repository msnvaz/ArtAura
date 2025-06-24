import React from 'react';
import "/src/styles/shop/dashboard.css";

import { 
  DollarSign,
  Package,
  Award,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  AlertCircle,
  Zap
} from 'lucide-react';


const ArtShopDashboard = () => {

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,847',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      colorClass: 'stat-card-emerald',
      iconBgClass: 'icon-bg-emerald',
      textColor: 'text-emerald'
    },
    {
      title: 'Products in Stock',
      value: '1,247',
      change: '-3.2%',
      trend: 'down',
      icon: Package,
      colorClass: 'stat-card-blue',
      iconBgClass: 'icon-bg-blue',
      textColor: 'text-blue'
    },
    {
      title: 'Active Rewards',
      value: '89',
      change: '+8.1%',
      trend: 'up',
      icon: Award,
      colorClass: 'stat-card-amber',
      iconBgClass: 'icon-bg-amber',
      textColor: 'text-amber'
    },
    {
      title: 'Monthly Orders',
      value: '342',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      colorClass: 'stat-card-purple',
      iconBgClass: 'icon-bg-purple',
      textColor: 'text-purple'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      message: 'New order for Watercolor Set Premium',
      time: '2 minutes ago',
      amount: '$89.99',
      bgClass: 'activity-bg-emerald',
      iconColor: 'icon-color-emerald'
    },
    {
      id: 2,
      type: 'stock',
      message: 'Low stock alert: Acrylic Paint Tubes',
      time: '15 minutes ago',
      amount: '5 items left',
      bgClass: 'activity-bg-red',
      iconColor: 'icon-color-red'
    },
    {
      id: 3,
      type: 'reward',
      message: 'Reward claimed by Sarah Johnson',
      time: '1 hour ago',
      amount: '15% discount',
      bgClass: 'activity-bg-amber',
      iconColor: 'icon-color-amber'
    },
    {
      id: 4,
      type: 'sale',
      message: 'New order for Canvas Bundle',
      time: '2 hours ago',
      amount: '$156.50',
      bgClass: 'activity-bg-emerald',
      iconColor: 'icon-color-emerald'
    }
  ];

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div className="welcome-banner-bg"></div>
        <div className="welcome-content">
          <div className="welcome-header">
            <div>
              <h1 className="welcome-title">
                <Sparkles className="welcome-sparkle" />
                Welcome back, John!
              </h1>
              <p className="welcome-subtitle">Here's what's happening with your art supply shop today.</p>
            </div>
            <div className="date-box">
              <p className="date-label">Today</p>
              <p className="date-value">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.colorClass} stat-card-hover`}>
              <div className="stat-card-bg"></div>
              <div className="stat-content">
                <div className="stat-header">
                  <div className={`stat-icon ${stat.iconBgClass}`}>
                    <Icon className="stat-icon-inner" />
                  </div>
                  <div className={`stat-change ${stat.trend === 'up' ? 'change-up' : 'change-down'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="change-icon" /> : <ArrowDownRight className="change-icon" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className={`stat-value ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="main-content-grid">
        <div className="recent-activity">
          <div className="activity-header">
            <h2 className="activity-title">
              <Zap className="activity-zap" />
              Recent Activity
            </h2>
            <button className="view-all-btn">
              View All
            </button>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-container">
                  <div className={`activity-icon ${activity.bgClass}`}>
                    {activity.type === 'sale' && <DollarSign className={`activity-icon-inner ${activity.iconColor}`} />}
                    {activity.type === 'stock' && <AlertCircle className={`activity-icon-inner ${activity.iconColor}`} />}
                    {activity.type === 'reward' && <Award className={`activity-icon-inner ${activity.iconColor}`} />}
                  </div>
                </div>
                <div className="activity-details">
                  <p className="activity-message">{activity.message}</p>
                  <div className="activity-meta">
                    <p className="activity-time">
                      <Clock className="time-icon" />
                      {activity.time}
                    </p>
                    <p className="activity-amount">{activity.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2 className="actions-title">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn action-blue">
              Add New Product
            </button>
            <button className="action-btn action-emerald">
              Create Reward Campaign
            </button>
            <button className="action-btn action-amber">
              Generate Sales Report
            </button>
            <button className="action-btn action-pink">
              Update Inventory
            </button>
          </div>

          <div className="overview-section">
            <h3 className="overview-title">Today's Overview</h3>
            <div className="overview-stats">
              <div className="overview-stat stat-blue">
                <span className="stat-label">Orders</span>
                <span className="stat-value">12</span>
              </div>
              <div className="overview-stat stat-emerald">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">$1,247</span>
              </div>
              <div className="overview-stat stat-purple">
                <span className="stat-label">New Customers</span>
                <span className="stat-value">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ArtShopDashboard;
