import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpDown,
  Download,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';

const Financial = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const financialStats = [
    {
      label: 'Total Revenue',
      value: formatPrice(125430),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: '#10B981'
    },
    {
      label: 'Commission Earned',
      value: formatPrice(18814),
      change: '+8.3%',
      changeType: 'positive',
      icon: Wallet,
      color: '#3B82F6'
    },
    {
      label: 'Artist Payouts',
      value: formatPrice(106616),
      change: '+15.2%',
      changeType: 'positive',
      icon: CreditCard,
      color: '#8B5CF6'
    },
    {
      label: 'Pending Payments',
      value: formatPrice(4250),
      change: '-5.1%',
      changeType: 'negative',
      icon: TrendingDown,
      color: '#EF4444'
    }
  ];

  const transactions = [
    {
      id: 'TXN-001',
      type: 'sale',
      description: 'Digital Sunset by Kavinda Perera',
      amount: 1250,
      commission: 187.50,
      artistPayout: 1062.50,
      date: '2024-12-20',
      status: 'completed',
      buyer: 'Nimali Fernando'
    },
    {
      id: 'TXN-002',
      type: 'sale',
      description: 'Tea Plantation Vista by Malini Gunawardana',
      amount: 1750,
      commission: 262.50,
      artistPayout: 1487.50,
      date: '2024-12-19',
      status: 'pending',
      buyer: 'Ashen Jayawardena'
    },
    {
      id: 'TXN-003',
      type: 'payout',
      description: 'Weekly payout to Kavinda Perera',
      amount: 3200,
      commission: 0,
      artistPayout: 3200,
      date: '2024-12-18',
      status: 'completed',
      buyer: 'Platform Payout'
    }
  ];

  return (
    <>
      {/* Add smooth animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .financial-container {
          animation: smoothFadeIn 0.4s ease-out;
        }

        .financial-stats {
          animation: slideInUp 0.5s ease-out 0.1s both;
        }

        .financial-header {
          animation: slideInUp 0.5s ease-out 0.2s both;
        }

        .financial-controls {
          animation: slideInUp 0.5s ease-out 0.3s both;
        }

        .financial-content {
          animation: slideInUp 0.5s ease-out 0.4s both;
        }

        .financial-stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .financial-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .transaction-row {
          transition: all 0.2s ease;
        }

        .transaction-row:hover {
          background-color: rgba(255, 228, 214, 0.3) !important;
        }
      `}</style>

      <div className="space-y-4 financial-container">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 financial-stats">
          {financialStats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden financial-stat-card" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                    <h2 className="text-xl font-bold mb-2" style={{color: '#5D3A00'}}>{stat.value}</h2>
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: stat.changeType === 'positive' ? '#d4edda' : '#f8d7da',
                          color: stat.changeType === 'positive' ? '#155724' : '#721c24'
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

        {/* Financial Management Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 financial-header">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
            <DollarSign size={24} />
            Financial Management
          </h2>
          <CurrencySelector className="flex-shrink-0" />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 financial-controls">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-full sm:w-64"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                />
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border rounded-lg"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{backgroundColor: '#D87C5A', color: 'white'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border financial-content" style={{borderColor: '#FFE4D6'}}>
          <div className="p-4 border-b" style={{borderColor: '#FFE4D6'}}>
            <h3 className="text-lg font-bold" style={{color: '#5D3A00'}}>Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{backgroundColor: '#FFF5E1'}}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Commission</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Artist Payout</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`transaction-row border-b`} style={{borderColor: '#FFE4D6'}}>
                    <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>
                      {transaction.id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium" style={{color: '#5D3A00'}}>
                          {transaction.description}
                        </p>
                        <p className="text-xs" style={{color: '#8B4513'}}>
                          {transaction.buyer}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold" style={{color: '#5D3A00'}}>
                      {formatPrice(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{color: '#5D3A00'}}>
                      {formatPrice(transaction.commission)}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{color: '#5D3A00'}}>
                      {formatPrice(transaction.artistPayout)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{color: '#8B4513'}}>
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Financial;
