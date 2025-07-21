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
  Search,
  Eye,
  RefreshCw,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  X,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Shield,
  Users,
  Store
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';

const Financial = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
      label: 'Escrow Balance',
      value: formatPrice(24680),
      change: '+18.7%',
      changeType: 'positive',
      icon: Shield,
      color: '#3B82F6'
    },
    {
      label: 'Commission Earned',
      value: formatPrice(18814),
      change: '+8.3%',
      changeType: 'positive',
      icon: Wallet,
      color: '#8B5CF6'
    },
    {
      label: 'Pending Disputes',
      value: '3',
      change: '-2',
      changeType: 'positive',
      icon: AlertTriangle,
      color: '#EF4444'
    }
  ];

  const transactions = [
    {
      id: 'TXN-001',
      type: 'artwork_sale',
      category: 'Artwork',
      description: 'Digital Sunset by Kavinda Perera',
      amount: 1250,
      commission: 187.50,
      artistPayout: 1062.50,
      escrowAmount: 1250,
      date: '2024-12-20',
      status: 'escrow',
      deliveryStatus: 'pending_delivery',
      buyer: 'Nimali Fernando',
      seller: 'Kavinda Perera',
      sellerType: 'artist',
      buyerEmail: 'nimali.fernando@email.com',
      sellerEmail: 'kavinda.perera@email.com',
      disputeReason: null,
      estimatedDelivery: '2024-12-25'
    },
    {
      id: 'TXN-002',
      type: 'material_sale',
      category: 'Art Materials',
      description: 'Professional Paint Set - Winsor & Newton',
      amount: 450,
      commission: 67.50,
      shopPayout: 382.50,
      escrowAmount: 450,
      date: '2024-12-19',
      status: 'escrow',
      deliveryStatus: 'shipped',
      buyer: 'Ashen Jayawardena',
      seller: 'Art Supplies Lanka',
      sellerType: 'shop',
      buyerEmail: 'ashen.jay@email.com',
      sellerEmail: 'contact@artsupplieslanka.com',
      disputeReason: null,
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-12-22'
    },
    {
      id: 'TXN-003',
      type: 'artwork_sale',
      category: 'Artwork',
      description: 'Kandy Temple Painting by Malini Gunawardana',
      amount: 1750,
      commission: 262.50,
      artistPayout: 1487.50,
      escrowAmount: 0,
      date: '2024-12-18',
      status: 'completed',
      deliveryStatus: 'delivered',
      buyer: 'Rajesh Kumar',
      seller: 'Malini Gunawardana',
      sellerType: 'artist',
      buyerEmail: 'rajesh.kumar@email.com',
      sellerEmail: 'malini.g@email.com',
      disputeReason: null,
      completedDate: '2024-12-18'
    },
    {
      id: 'TXN-004',
      type: 'gallery_sale',
      category: 'Gallery Art',
      description: 'Traditional Mask Collection - Gallery One',
      amount: 3200,
      commission: 480,
      galleryPayout: 2720,
      escrowAmount: 3200,
      date: '2024-12-17',
      status: 'dispute',
      deliveryStatus: 'delivery_failed',
      buyer: 'Sarah Wilson',
      seller: 'Gallery One Colombo',
      sellerType: 'gallery',
      buyerEmail: 'sarah.wilson@email.com',
      sellerEmail: 'sales@galleryone.lk',
      disputeReason: 'Item damaged during shipping',
      disputeDate: '2024-12-19'
    },
    {
      id: 'TXN-005',
      type: 'payout',
      category: 'Payout',
      description: 'Weekly payout to Kavinda Perera',
      amount: 3200,
      commission: 0,
      artistPayout: 3200,
      escrowAmount: 0,
      date: '2024-12-16',
      status: 'completed',
      deliveryStatus: 'not_applicable',
      buyer: 'Platform Payout',
      seller: 'Kavinda Perera',
      sellerType: 'artist',
      buyerEmail: null,
      sellerEmail: 'kavinda.perera@email.com',
      disputeReason: null
    }
  ];

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Action handlers
  const handleRefund = async (transactionId, amount, reason) => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccessMessage(`Refund of ${formatPrice(amount)} processed successfully`);
      setShowRefundModal(false);
    } catch (error) {
      setErrorMessage('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseEscrow = async (transactionId) => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Escrow funds released successfully');
    } catch (error) {
      setErrorMessage('Failed to release escrow funds');
    } finally {
      setLoading(false);
    }
  };

  const handleContactParty = (transaction, party) => {
    setSelectedTransaction({ ...transaction, contactParty: party });
    setShowContactModal(true);
  };

  // Transaction Detail Modal Component
  const TransactionDetailModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b" style={{borderColor: '#FFE4D6'}}>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold" style={{color: '#5D3A00'}}>
                Transaction Details - {transaction.id}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Transaction Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>Payment Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'escrow' ? 'bg-blue-100 text-blue-800' :
                  transaction.status === 'dispute' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>Delivery Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  transaction.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  transaction.deliveryStatus === 'delivery_failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.deliveryStatus?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>Category</h4>
                <span className="text-sm font-medium" style={{color: '#D87C5A'}}>
                  {transaction.category}
                </span>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Financial Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{formatPrice(transaction.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission (15%):</span>
                    <span>{formatPrice(transaction.commission)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seller Payout:</span>
                    <span>{formatPrice(transaction.artistPayout || transaction.shopPayout || transaction.galleryPayout)}</span>
                  </div>
                  {transaction.escrowAmount > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>In Escrow:</span>
                      <span className="font-semibold">{formatPrice(transaction.escrowAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Party Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Buyer:</span>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{transaction.buyer}</span>
                      <button
                        onClick={() => handleContactParty(transaction, 'buyer')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                    {transaction.buyerEmail && (
                      <span className="text-xs text-gray-500">{transaction.buyerEmail}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Seller ({transaction.sellerType}):</span>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{transaction.seller}</span>
                      <button
                        onClick={() => handleContactParty(transaction, 'seller')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                    {transaction.sellerEmail && (
                      <span className="text-xs text-gray-500">{transaction.sellerEmail}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dispute Information */}
            {transaction.status === 'dispute' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Dispute Information</h4>
                <p className="text-red-700">{transaction.disputeReason}</p>
                {transaction.disputeDate && (
                  <p className="text-sm text-red-600 mt-1">Reported on: {transaction.disputeDate}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t" style={{borderColor: '#FFE4D6'}}>
              {transaction.status === 'escrow' && (
                <button
                  onClick={() => handleReleaseEscrow(transaction.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Release Escrow'}
                </button>
              )}
              
              {(transaction.status === 'escrow' || transaction.status === 'dispute') && (
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowRefundModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Process Refund
                </button>
              )}
              
              <button
                onClick={() => handleContactParty(transaction, 'buyer')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Buyer
              </button>
              
              <button
                onClick={() => handleContactParty(transaction, 'seller')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Refund Modal Component
  const RefundModal = ({ transaction, onClose, onRefund }) => {
    const [refundAmount, setRefundAmount] = useState(transaction?.escrowAmount || transaction?.amount || 0);
    const [refundReason, setRefundReason] = useState('');

    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6 border-b" style={{borderColor: '#FFE4D6'}}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold" style={{color: '#5D3A00'}}>Process Refund</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>
                Refund Amount
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                max={transaction.escrowAmount || transaction.amount}
                className="w-full px-3 py-2 border rounded-lg"
                style={{borderColor: '#FFE4D6'}}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatPrice(transaction.escrowAmount || transaction.amount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>
                Reason for Refund
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                style={{borderColor: '#FFE4D6'}}
                placeholder="Enter reason for refund..."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => onRefund(transaction.id, refundAmount, refundReason)}
                disabled={!refundReason.trim() || loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin mx-auto" size={16} /> : 'Process Refund'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{borderColor: '#FFE4D6'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contact Modal Component
  const ContactModal = ({ transaction, onClose }) => {
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');

    if (!transaction) return null;

    const contactInfo = transaction.contactParty === 'buyer' ? {
      name: transaction.buyer,
      email: transaction.buyerEmail,
      type: 'Buyer'
    } : {
      name: transaction.seller,
      email: transaction.sellerEmail,
      type: transaction.sellerType.charAt(0).toUpperCase() + transaction.sellerType.slice(1)
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6 border-b" style={{borderColor: '#FFE4D6'}}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold" style={{color: '#5D3A00'}}>
                Contact {contactInfo.type}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium" style={{color: '#5D3A00'}}>{contactInfo.name}</p>
              <p className="text-sm text-gray-600">{contactInfo.email}</p>
              <p className="text-xs text-gray-500">Transaction: {transaction.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                style={{borderColor: '#FFE4D6'}}
                placeholder="Enter subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg"
                style={{borderColor: '#FFE4D6'}}
                placeholder="Enter your message..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  // Send message logic here
                  setSuccessMessage(`Message sent to ${contactInfo.name}`);
                  onClose();
                }}
                disabled={!message.trim() || !subject.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Mail size={16} className="inline mr-2" />
                Send Message
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{borderColor: '#FFE4D6'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Notifications */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-green-500 hover:text-green-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showTransactionModal && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {showRefundModal && (
        <RefundModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedTransaction(null);
          }}
          onRefund={handleRefund}
        />
      )}

      {showContactModal && (
        <ContactModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowContactModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
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

        .modal-fade-in {
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .action-button {
          transition: all 0.2s ease;
        }

        .action-button:hover {
          transform: translateY(-1px);
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
        <div className="financial-controls">
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-center justify-between">
            {/* Search Input - Left Side */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" style={{color: '#5D3A00'}} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 w-80 transition-all duration-200 hover:shadow-md bg-white shadow-sm"
                style={{borderColor: '#FFE4D6'}}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filters and Export - Right Side */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" style={{color: '#5D3A00'}} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none cursor-pointer transition-all duration-200 hover:shadow-md bg-white shadow-sm w-36"
                  style={{
                    borderColor: '#FFE4D6',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235D3A00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 8px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="escrow">Escrow</option>
                  <option value="completed">Complete</option>
                  <option value="dispute">Dispute</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none cursor-pointer transition-all duration-200 hover:shadow-md bg-white shadow-sm w-32"
                  style={{
                    borderColor: '#FFE4D6',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235D3A00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 8px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="artwork_sale">Artwork</option>
                  <option value="material_sale">Materials</option>
                  <option value="gallery_sale">Gallery</option>
                  <option value="payout">Payout</option>
                </select>
              </div>
              
              {/* Time Range Filter */}
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" style={{color: '#5D3A00'}} />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none cursor-pointer transition-all duration-200 hover:shadow-md bg-white shadow-sm w-32"
                  style={{
                    borderColor: '#FFE4D6',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235D3A00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 8px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="90days">90 Days</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>

              {/* Export Button */}
              <button 
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:shadow-md shadow-sm"
                style={{backgroundColor: '#D87C5A', color: 'white'}}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#B85A3A';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#D87C5A';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border financial-content" style={{borderColor: '#FFE4D6'}}>
          <div className="p-4 border-b" style={{borderColor: '#FFE4D6'}}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold" style={{color: '#5D3A00'}}>
                Transactions ({filteredTransactions.length})
              </h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  Showing {filteredTransactions.length} of {transactions.length}
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{backgroundColor: '#FFF5E1'}}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Transaction</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Escrow</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Delivery</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`transaction-row border-b`} style={{borderColor: '#FFE4D6'}}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium" style={{color: '#5D3A00'}}>
                          {transaction.id}
                        </p>
                        <p className="text-xs" style={{color: '#8B4513'}}>
                          {transaction.date}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          transaction.type === 'artwork_sale' ? 'bg-purple-100 text-purple-800' :
                          transaction.type === 'material_sale' ? 'bg-blue-100 text-blue-800' :
                          transaction.type === 'gallery_sale' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium" style={{color: '#5D3A00'}}>
                          {transaction.description}
                        </p>
                        <div className="text-xs" style={{color: '#8B4513'}}>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {transaction.buyer}
                            </span>
                            <span>→</span>
                            <span className="flex items-center gap-1">
                              {transaction.sellerType === 'artist' ? <Users size={12} /> : <Store size={12} />}
                              {transaction.seller}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-bold" style={{color: '#5D3A00'}}>
                          {formatPrice(transaction.amount)}
                        </p>
                        <p className="text-xs" style={{color: '#8B4513'}}>
                          Commission: {formatPrice(transaction.commission)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.escrowAmount > 0 ? (
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            {formatPrice(transaction.escrowAmount)}
                          </p>
                          <p className="text-xs text-blue-500">Held in escrow</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Released</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'escrow' ? 'bg-blue-100 text-blue-800' :
                        transaction.status === 'dispute' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.deliveryStatus !== 'not_applicable' && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          transaction.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          transaction.deliveryStatus === 'delivery_failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.deliveryStatus?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}
                      {transaction.disputeReason && (
                        <div className="text-xs text-red-600 mt-1">
                          <AlertTriangle size={12} className="inline mr-1" />
                          Dispute
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionModal(true);
                          }}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {transaction.status === 'escrow' && (
                          <button
                            onClick={() => handleReleaseEscrow(transaction.id)}
                            className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors"
                            title="Release Escrow"
                            disabled={loading}
                          >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                          </button>
                        )}
                        
                        {(transaction.status === 'escrow' || transaction.status === 'dispute') && (
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowRefundModal(true);
                            }}
                            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                            title="Process Refund"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleContactParty(transaction, 'buyer')}
                          className="p-1 rounded text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Contact Buyer"
                        >
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Financial;
