import React, { useState } from 'react';
import { 
  Award,
  Gift,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Percent,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  Zap,
  Crown,
  Trophy,
  Gem,
  Filter,
  Search
} from 'lucide-react';

const RewardSystem = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

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
      color: 'from-[#FFD95A] to-[#D87C5A]'
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
      color: 'from-[#5D3A00] to-[#D87C5A]'
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
      color: 'from-[#FFE4D6] to-[#D87C5A]'
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
      color: 'from-[#FFF5E1] to-[#FFD95A]'
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
      color: 'from-[#FFD95A] to-[#D87C5A]',
      bgColor: 'bg-[#FFF5E1]',
      textColor: 'text-[#5D3A00]'
    },
    {
      title: 'Total Rewards Claimed',
      value: '1,247',
      change: '+156 this week',
      trend: 'up',
      icon: Gift,
      color: 'from-[#D87C5A] to-[#5D3A00]',
      bgColor: 'bg-[#FFE4D6]',
      textColor: 'text-[#5D3A00]'
    },
    {
      title: 'Customer Engagement',
      value: '78%',
      change: '+5.2% from last month',
      trend: 'up',
      icon: Users,
      color: 'from-[#5D3A00] to-[#D87C5A]',
      bgColor: 'bg-[#FFF5E1]',
      textColor: 'text-[#5D3A00]'
    },
    {
      title: 'Rewards Budget Used',
      value: '$7,425',
      change: '62% of total budget',
      trend: 'neutral',
      icon: DollarSign,
      color: 'from-[#FFE4D6] to-[#D87C5A]',
      bgColor: 'bg-[#FFF5E1]',
      textColor: 'text-[#5D3A00]'
    }
  ];

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'Platinum': return <Crown className="w-4 h-4 text-[#5D3A00]" />;
      case 'Gold': return <Trophy className="w-4 h-4 text-[#FFD95A]" />;
      case 'Silver': return <Gem className="w-4 h-4 text-[#D87C5A]" />;
      default: return <Star className="w-4 h-4 text-[#5D3A00]" />;
    }
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-[#5D3A00] text-white';
      case 'Gold': return 'bg-[#FFD95A] text-[#5D3A00]';
      case 'Silver': return 'bg-[#D87C5A] text-white';
      default: return 'bg-[#FFE4D6] text-[#5D3A00]';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-[#FFD95A] text-[#5D3A00]';
      case 'paused': return 'bg-[#FFE4D6] text-[#D87C5A]';
      case 'scheduled': return 'bg-[#FFF5E1] text-[#5D3A00]';
      case 'ended': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 bg-[white] min-h-screen p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#FFF5E1] via-[#FFD95A]/30 to-[#FFE4D6] rounded-2xl shadow-xl p-6 border border-[#FFE4D6]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5D3A00] to-[#D87C5A] bg-clip-text text-transparent flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D87C5A]" />
              Reward System
            </h1>
            <p className="text-[#5D3A00] mt-2">Manage campaigns, track customer engagement, and boost loyalty.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-2xl shadow-lg p-6 border border-[#FFE4D6] hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-[#FFD95A] opacity-10 -translate-y-10 translate-x-10 transition-all duration-700 ${hoveredCard === index ? 'scale-150' : 'scale-100'}`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#5D3A00]/70 mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-[#5D3A00]/70 mb-2">{stat.value}</p>
                  <p className="text-xs text-[#5D3A00]/60">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#FFE4D6]">
        <div className="px-6 pt-6">
          <div className="flex space-x-1 bg-[#FFF5E1] rounded-xl p-1">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'campaigns'
                  ? 'bg-[#f8d975] text-[#5D3A00] shadow-md'
                  : 'text-[#5D3A00]/70 hover:text-[#5D3A00]'
              }`}
            >
              <Zap className="w-4 h-4" />
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'customers'
                  ? 'bg-[#f8d975] text-[#5D3A00] shadow-md'
                  : 'text-[#5D3A00]/70 hover:text-[#5D3A00]'
              }`}
            >
              <Users className="w-4 h-4" />
              Top Customers
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5D3A00]/50" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00] placeholder-[#5D3A00]/50"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#FFD95A] bg-white rounded-lg hover:bg-[#FFF5E1] transition-colors text-[#5D3A00]">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Campaigns Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rewardCampaigns.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="bg-white rounded-2xl border border-[#FFE4D6] p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${campaign.color}`}></div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${campaign.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#5D3A00]">{campaign.name}</h3>
                          <p className="text-sm text-[#5D3A00]/70">{campaign.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <div className="flex gap-1">
                          <button className="p-2 hover:bg-[#FFF5E1] rounded-lg transition-colors text-[#5D3A00]/70 hover:text-[#5D3A00]">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-[#FFF5E1] rounded-lg transition-colors text-[#5D3A00]/70 hover:text-[#5D3A00]">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-[#FFF5E1] rounded-lg transition-colors text-[#D87C5A] hover:text-[#5D3A00]">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#FFF5E1] rounded-lg p-3 border border-[#FFE4D6]">
                        <p className="text-xs text-[#5D3A00]/70 mb-1">Reward Value</p>
                        <p className="text-lg font-bold text-[#5D3A00]">{campaign.value}</p>
                      </div>
                      <div className="bg-[#FFF5E1] rounded-lg p-3 border border-[#FFE4D6]">
                        <p className="text-xs text-[#5D3A00]/70 mb-1">Claims</p>
                        <p className="text-lg font-bold text-[#5D3A00]">{campaign.claimed}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#5D3A00]/70">Budget Usage</span>
                        <span className="font-medium text-[#5D3A00]">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-[#FFE4D6] rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${campaign.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-[#5D3A00]/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
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
            <div className="space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#FFF5E1] rounded-xl p-4 border border-[#FFD95A]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFD95A] rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#5D3A00]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5D3A00]/70">Total Customers</p>
                      <p className="text-xl font-bold text-[#5D3A00]">2,847</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFE4D6] rounded-xl p-4 border border-[#D87C5A]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D87C5A] rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5D3A00]/70">Avg. Points</p>
                      <p className="text-xl font-bold text-[#5D3A00]">1,247</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFF5E1] rounded-xl p-4 border border-[#FFD95A]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#FFD95A] to-[#D87C5A] rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5D3A00]/70">Engagement Rate</p>
                      <p className="text-xl font-bold text-[#5D3A00]">78%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Customers List */}
              <div className="space-y-4">
                {topCustomers.map((customer) => (
                  <div key={customer.id} className="bg-white rounded-2xl border border-[#FFE4D6] p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#FFD95A] to-[#D87C5A] rounded-full flex items-center justify-center text-white font-bold">
                            {customer.avatar}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${getTierColor(customer.tier)}`}>
                            {getTierIcon(customer.tier)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#5D3A00] flex items-center gap-2">
                            {customer.name}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                              {customer.tier}
                            </span>
                          </h3>
                          <p className="text-sm text-[#5D3A00]/70">{customer.email}</p>
                          <p className="text-xs text-[#5D3A00]/50">Member since {new Date(customer.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center w-full md:w-auto">
                        <div>
                          <p className="text-lg font-bold text-[#FFD95A]">{customer.points.toLocaleString()}</p>
                          <p className="text-xs text-[#5D3A00]/50">Points</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#D87C5A]">${customer.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-[#5D3A00]/50">Total Spent</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#5D3A00]">{customer.rewardsUsed}</p>
                          <p className="text-xs text-[#5D3A00]/50">Rewards Used</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#FFE4D6]">
            <div className="p-6 border-b border-[#FFE4D6] bg-[#FFF5E1]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D87C5A]" />
                  Create New Campaign
                </h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-[#FFE4D6] rounded-lg transition-colors text-[#5D3A00]"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">Campaign Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-[#FFE4D6] bg-[#FFF5E1]/50 rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00] placeholder-[#5D3A00]/50" 
                    placeholder="Enter campaign name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">Reward Type</label>
                  <select 
                    className="w-full p-3 border border-[#FFE4D6] bg-[#FFF5E1]/50 rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00]"
                  >
                    <option>Percentage Discount</option>
                    <option>Fixed Amount</option>
                    <option>Free Product</option>
                    <option>Buy One Get One</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-[#FFE4D6] bg-[#FFF5E1]/50 rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">End Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-[#FFE4D6] bg-[#FFF5E1]/50 rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00]" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5D3A00] mb-2">Campaign Budget</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-[#FFE4D6] bg-[#FFF5E1]/50 rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00] placeholder-[#5D3A00]/50" 
                  placeholder="Enter budget amount" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5D3A00] mb-2">Description</label>
                <textarea 
                  rows="3" 
                  className="w-full p-3 border border-[#FFE4D6] bg-[#FFF5E1]/50 rounded-lg focus:ring-2 focus:ring-[#FFD95A] focus:border-transparent text-[#5D3A00] placeholder-[#5D3A00]/50" 
                  placeholder="Describe your campaign..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 border border-[#FFE4D6] text-[#5D3A00] rounded-lg hover:bg-[#FFF5E1] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-[white] rounded-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                >
                  <span className="relative z-10">Create Campaign</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#D87C5A] to-[#FFD95A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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