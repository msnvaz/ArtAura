import React, { useState } from 'react';
import "/src/styles/shop/rewardSystem.css";
import { 
  Award,
  Gift,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  Edit3,
  Trash2,
  DollarSign,
  Zap,
  Crown,
  Trophy,
  Gem,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';

const RewardSystem = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const rewardCampaigns = [
    {
      id: 1,
      name: 'Summer Art Splash',
      type: 'Percentage Discount',
      value: '20%',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      claimed: 156,
      budget: 5000,
      spent: 3240,
      customers: 89,
      color: 'orange-500-red-500'
    },
    {
      id: 2,
      name: 'New Customer Welcome',
      type: 'Fixed Amount',
      value: '$15',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      claimed: 234,
      budget: 8000,
      spent: 3510,
      customers: 234,
      color: 'blue-500-purple-500'
    },
    {
      id: 3,
      name: 'Loyalty Milestone',
      type: 'Free Product',
      value: 'Canvas Set',
      status: 'paused',
      startDate: '2024-03-15',
      endDate: '2024-09-15',
      claimed: 45,
      budget: 2000,
      spent: 675,
      customers: 45,
      color: 'emerald-500-teal-500'
    },
    {
      id: 4,
      name: 'Holiday Special',
      type: 'Percentage Discount',
      value: '25%',
      status: 'scheduled',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      claimed: 0,
      budget: 10000,
      spent: 0,
      customers: 0,
      color: 'purple-500-pink-500'
    }
  ];

  const topCustomers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      tier: 'Gold',
      points: 2850,
      totalSpent: 1247,
      rewardsUsed: 8,
      joinDate: '2023-03-15',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      tier: 'Platinum',
      points: 4120,
      totalSpent: 2156,
      rewardsUsed: 12,
      joinDate: '2022-11-08',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      tier: 'Silver',
      points: 1680,
      totalSpent: 892,
      rewardsUsed: 5,
      joinDate: '2023-07-22',
      avatar: 'EW'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.r@email.com',
      tier: 'Gold',
      points: 3250,
      totalSpent: 1578,
      rewardsUsed: 9,
      joinDate: '2023-01-12',
      avatar: 'DR'
    }
  ];

  const rewardStats = [
    {
      title: 'Active Campaigns',
      value: '8',
      change: '+2 this month',
      trend: 'up',
      icon: Award,
      color: 'blue-700'
    },
    {
      title: 'Total Rewards Claimed',
      value: '1,247',
      change: '+156 this week',
      trend: 'up',
      icon: Gift,
      color: 'emerald-700'
    },
    {
      title: 'Customer Engagement',
      value: '78%',
      change: '+5.2% from last month',
      trend: 'up',
      icon: Users,
      color: 'purple-700'
    },
    {
      title: 'Rewards Budget Used',
      value: '$7,425',
      change: '62% of total budget',
      trend: 'neutral',
      icon: DollarSign,
      color: 'amber-700'
    }
  ];

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'Platinum': return <Crown className="tier-icon" />;
      case 'Gold': return <Trophy className="tier-icon" />;
      case 'Silver': return <Gem className="tier-icon" />;
      default: return <Star className="tier-icon" />;
    }
  };

  return (
    <div className="reward-system-container">
      {/* Header */}
      <div className="reward-header">
        <div className="header-background-circle"></div>
        <div className="header-content">
          <div className="header-text">
            <h1 className="reward-title">
              <Award className="reward-title-icon" />
              Reward System
            </h1>
            <p className="reward-subtitle">Manage campaigns, track customer engagement, and boost loyalty.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="create-campaign-btn"
          >
            <Plus className="btn-icon" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {rewardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-background-circle"></div>
              <div className="stat-content">
                <div className="stat-icon-container">
                  <div className={`stat-icon-wrapper ${stat.color}`}>
                    <Icon className="stat-icon" />
                  </div>
                </div>
                <div>
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className={`stat-value ${stat.color}`}>{stat.value}</p>
                  <p className="stat-change">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <div className="tab-header">
          <div className="tab-buttons">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
            >
              <Zap className="tab-icon" />
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            >
              <Users className="tab-icon" />
              Top Customers
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'campaigns' && (
            <div className="campaigns-content">
              <div className="campaign-filters">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="search-input"
                  />
                </div>
                <button className="filter-btn">
                  <Filter className="filter-icon" />
                  Filter
                </button>
              </div>

              <div className="campaigns-grid">
                {rewardCampaigns.map((campaign) => (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-header">
                      <div className="campaign-info">
                        <div className={`campaign-icon ${campaign.color}`}>
                          <Gift className="campaign-gift-icon" />
                        </div>
                        <div>
                          <h3 className="campaign-name">{campaign.name}</h3>
                          <p className="campaign-type">{campaign.type}</p>
                        </div>
                      </div>
                      <div className="campaign-actions">
                        <span className={`campaign-status ${campaign.status}`}>
                          {campaign.status}
                        </span>
                        <div className="action-buttons">
                          <button className="action-btn">
                            <Eye className="action-icon" />
                          </button>
                          <button className="action-btn">
                            <Edit3 className="action-icon" />
                          </button>
                          <button className="action-btn">
                            <Trash2 className="action-icon delete-icon" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="campaign-stats">
                      <div className="stat-box">
                        <p className="stat-label">Reward Value</p>
                        <p className="stat-value">{campaign.value}</p>
                      </div>
                      <div className="stat-box">
                        <p className="stat-label">Claims</p>
                        <p className="stat-value">{campaign.claimed}</p>
                      </div>
                    </div>

                    <div className="campaign-progress">
                      <div className="progress-header">
                        <span className="progress-label">Budget Usage</span>
                        <span className="progress-amount">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${campaign.color}`}
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                      <div className="progress-footer">
                        <span className="date-range">
                          <Calendar className="calendar-icon" />
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                        <span>{campaign.customers} customers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="customers-content">
              <div className="customer-stats-grid">
                <div className="customer-stat-card blue">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <Users className="stat-icon" />
                    </div>
                    <div>
                      <p className="stat-label">Total Customers</p>
                      <p className="stat-value">2,847</p>
                    </div>
                  </div>
                </div>
                <div className="customer-stat-card green">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <Star className="stat-icon" />
                    </div>
                    <div>
                      <p className="stat-label">Avg. Points</p>
                      <p className="stat-value">1,247</p>
                    </div>
                  </div>
                </div>
                <div className="customer-stat-card orange">
                  <div className="stat-content">
                    <div className="stat-icon-wrapper">
                      <TrendingUp className="stat-icon" />
                    </div>
                    <div>
                      <p className="stat-label">Engagement Rate</p>
                      <p className="stat-value">78%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="customers-list">
                {topCustomers.map((customer) => (
                  <div key={customer.id} className="customer-card">
                    <div className="customer-info">
                      <div className="customer-avatar-container">
                        <div className="customer-avatar">
                          {customer.avatar}
                        </div>
                        <div className={`tier-badge ${customer.tier.toLowerCase()}`}>
                          {getTierIcon(customer.tier)}
                        </div>
                      </div>
                      <div className="customer-details">
                        <h3 className="customer-name">
                          {customer.name}
                          <span className={`tier-label ${customer.tier.toLowerCase()}`}>
                            {customer.tier}
                          </span>
                        </h3>
                        <p className="customer-email">{customer.email}</p>
                        <p className="customer-join-date">Member since {new Date(customer.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="customer-stats">
                      <div className="customer-stat">
                        <p className="stat-value purple">{customer.points.toLocaleString()}</p>
                        <p className="stat-label">Points</p>
                      </div>
                      <div className="customer-stat">
                        <p className="stat-value green">${customer.totalSpent.toLocaleString()}</p>
                        <p className="stat-label">Total Spent</p>
                      </div>
                      <div className="customer-stat">
                        <p className="stat-value orange">{customer.rewardsUsed}</p>
                        <p className="stat-label">Rewards Used</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title-container">
                <h2 className="modal-title">
                  <Sparkles className="modal-title-icon" />
                  Create New Campaign
                </h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="modal-close-btn"
                >
                  <Plus className="close-icon" />
                </button>
              </div>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Campaign Name</label>
                  <input type="text" className="form-input" placeholder="Enter campaign name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Reward Type</label>
                  <select className="form-input">
                    <option>Percentage Discount</option>
                    <option>Fixed Amount</option>
                    <option>Free Product</option>
                    <option>Buy One Get One</option>
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Campaign Budget</label>
                <input type="number" className="form-input" placeholder="Enter budget amount" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="3" className="form-textarea" placeholder="Describe your campaign..."></textarea>
              </div>
              <div className="form-actions">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="submit-btn"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardSystem;