import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';

const Financial = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { formatPrice, currency } = useCurrency();
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample financial data
  const financialStats = [
    { 
      label: 'Total Revenue', 
      value: 125430, 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign, 
      color: '#5D3A00' 
    },
    { 
      label: 'Commission Earned', 
      value: 18815, 
      change: '+8.3%', 
      trend: 'up',
      icon: TrendingUp, 
      color: '#D87C5A' 
    },
    { 
      label: 'Artist Payouts', 
      value: 106615, 
      change: '+15.2%', 
      trend: 'up',
      icon: Users, 
      color: '#FFD95A' 
    },
    { 
      label: 'Pending Payments', 
      value: 8450, 
      change: '-5.1%', 
      trend: 'down',
      icon: Clock, 
      color: '#FF6B6B' 
    }
  ];

  const pendingPayouts = [
    {
      id: 'PAY-001',
      artistName: 'Nimali Fernando',
      artistId: 'ART-1234',
      amount: 2450.00,
      commissionRate: '15%',
      netAmount: 2082.50,
      saleDate: '2024-12-15',
      status: 'pending',
      artworkTitle: 'Kandy Sunset',
      paymentMethod: 'Bank Transfer',
      accountDetails: '****-1234'
    },
    {
      id: 'PAY-002',
      artistName: 'Ashen Jayawardena',
      artistId: 'ART-5678',
      amount: 1800.00,
      commissionRate: '15%',
      netAmount: 1530.00,
      saleDate: '2024-12-14',
      status: 'pending',
      artworkTitle: 'Colombo Streets',
      paymentMethod: 'Bank Transfer',
      accountDetails: '****-5678'
    },
    {
      id: 'PAY-003',
      artistName: 'Malini Gunawardana',
      artistId: 'ART-9012',
      amount: 3200.00,
      commissionRate: '15%',
      netAmount: 2720.00,
      saleDate: '2024-12-13',
      status: 'processing',
      artworkTitle: 'Temple Reflections',
      paymentMethod: 'Bank Transfer',
      accountDetails: '****-9012'
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN-001',
      type: 'sale',
      description: 'Artwork Sale - "Midnight Ocean"',
      artist: 'David Kim',
      buyer: 'Sarah Johnson',
      amount: '$1,500.00',
      commission: '$225.00',
      date: '2024-12-20',
      status: 'completed'
    },
    {
      id: 'TXN-002',
      type: 'payout',
      description: 'Artist Payout - Elena Rodriguez',
      artist: 'Elena Rodriguez',
      amount: '$2,082.50',
      date: '2024-12-19',
      status: 'completed'
    },
    {
      id: 'TXN-003',
      type: 'sale',
      description: 'Artwork Sale - "Golden Hour"',
      artist: 'Lisa Park',
      buyer: 'Michael Brown',
      amount: '$2,800.00',
      commission: '$420.00',
      date: '2024-12-18',
      status: 'completed'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Financial Overview', icon: DollarSign },
    { id: 'payouts', label: 'Artist Payouts', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'reports', label: 'Financial Reports', icon: TrendingUp }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border" style={{borderColor: '#FFE4D6'}}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>Revenue Trends</h3>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            style={{borderColor: '#FFE4D6', color: '#5D3A00'}}
          >
            <option value="2024-12">December 2024</option>
            <option value="2024-11">November 2024</option>
            <option value="2024-10">October 2024</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center" style={{backgroundColor: '#FFF5E1'}}>
          <div className="text-center" style={{color: '#D87C5A'}}>
            <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
            <p>Revenue Chart Placeholder</p>
            <p className="text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </div>
      
      {/* Payment Methods Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#5D3A00'}}>Payment Methods Distribution</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span style={{color: '#5D3A00'}}>Credit Card</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{backgroundColor: '#D87C5A', width: '65%'}}></div>
              </div>
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>65%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span style={{color: '#5D3A00'}}>Bank Transfer</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{backgroundColor: '#FFD95A', width: '25%'}}></div>
              </div>
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>25%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span style={{color: '#5D3A00'}}>PayPal</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{backgroundColor: '#5D3A00', width: '10%'}}></div>
              </div>
              <span className="text-sm font-medium" style={{color: '#5D3A00'}}>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="bg-transparent rounded-lg py-1 px-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#8B4513'}} />
            <input
              type="text"
              placeholder="Search by artist name or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
            />
          </div>
          <button className="px-4 py-2 rounded-md flex items-center gap-2 text-white" style={{backgroundColor: '#D87C5A'}}>
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Pending Payouts */}
      <div className="bg-white rounded-lg shadow-sm border" style={{borderColor: '#FFE4D6'}}>
        <div className="p-4 border-b" style={{borderColor: '#FFE4D6'}}>
          <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>Pending Artist Payouts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{backgroundColor: '#FFF5E1'}}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Payment ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Artist</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Artwork</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Sale Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Net Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayouts.map((payout) => (
                <tr key={payout.id} className="border-b" style={{borderColor: '#FFE4D6'}}>
                  <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>{payout.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium" style={{color: '#5D3A00'}}>{payout.artistName}</p>
                      <p className="text-xs" style={{color: '#8B4513'}}>{payout.artistId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{color: '#8B4513'}}>{payout.artworkTitle}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>{payout.amount}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>{payout.netAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 rounded-md text-white" style={{backgroundColor: '#5D3A00'}} title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="p-1 rounded-md text-white bg-green-600" title="Approve Payment">
                        <CheckCircle size={14} />
                      </button>
                      <button className="p-1 rounded-md text-white bg-red-600" title="Reject Payment">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border" style={{borderColor: '#FFE4D6'}}>
        <div className="p-4 border-b" style={{borderColor: '#FFE4D6'}}>
          <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{backgroundColor: '#FFF5E1'}}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b" style={{borderColor: '#FFE4D6'}}>
                  <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>{transaction.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{color: '#8B4513'}}>{transaction.description}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>{transaction.amount}</td>
                  <td className="px-4 py-3 text-sm" style={{color: '#8B4513'}}>{transaction.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4">
      {/* Report Generation */}
      <div className="bg-white rounded-lg p-6 shadow-sm border" style={{borderColor: '#FFE4D6'}}>
        <h3 className="text-lg font-semibold mb-4" style={{color: '#5D3A00'}}>Generate Financial Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow" style={{borderColor: '#FFE4D6'}}>
            <DollarSign size={32} className="mx-auto mb-2" style={{color: '#D87C5A'}} />
            <h4 className="font-medium" style={{color: '#5D3A00'}}>Revenue Report</h4>
            <p className="text-sm mt-1" style={{color: '#8B4513'}}>Monthly revenue breakdown</p>
          </button>
          <button className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow" style={{borderColor: '#FFE4D6'}}>
            <Users size={32} className="mx-auto mb-2" style={{color: '#D87C5A'}} />
            <h4 className="font-medium" style={{color: '#5D3A00'}}>Artist Earnings</h4>
            <p className="text-sm mt-1" style={{color: '#8B4513'}}>Artist payout summary</p>
          </button>
          <button className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow" style={{borderColor: '#FFE4D6'}}>
            <TrendingUp size={32} className="mx-auto mb-2" style={{color: '#D87C5A'}} />
            <h4 className="font-medium" style={{color: '#5D3A00'}}>Commission Report</h4>
            <p className="text-sm mt-1" style={{color: '#8B4513'}}>Platform commission analysis</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'payouts':
        return renderPayouts();
      case 'transactions':
        return renderTransactions();
      case 'reports':
        return renderReports();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-4">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialStats.map((stat, index) => (
          <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: index === 0 
                  ? 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Total Revenue - money/coins
                  : index === 1 
                  ? 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Commission - analytics
                  : index === 2 
                  ? 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Payouts - people
                  : 'url("https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Pending - clock/waiting
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="p-3 relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                  <h2 className="text-xl font-bold mb-2" style={{color: '#5D3A00'}}>{formatPrice(stat.value)}</h2>
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: stat.trend === 'up' ? '#d4edda' : '#f8d7da',
                        color: stat.trend === 'up' ? '#155724' : '#721c24'
                      }}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs opacity-75" style={{color: '#5D3A00'}}>vs last month</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg shadow-lg" style={{backgroundColor: stat.color}}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Management Heading and Currency Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
          <DollarSign size={24} />
          Financial Management
        </h2>
        <CurrencySelector className="flex-shrink-0" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div>
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                style={{
                  borderBottomColor: activeTab === tab.id ? '#5D3A00' : 'transparent',
                  color: activeTab === tab.id ? '#5D3A00' : '#D87C5A'
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Financial;
