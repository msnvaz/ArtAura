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
import { useAuth } from '../../context/AuthContext';
import CurrencySelector from '../../components/common/CurrencySelector';

const Financial = () => {
  const { token, role } = useAuth();
  const { formatPrice } = useCurrency();
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
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });
  const [paymentStatistics, setPaymentStatistics] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
    console.log('Financial component - Auth state:', { token: !!token, role });
    
    // Try to make API calls if we have a token (regardless of role for testing)
    if (token) {
      console.log('Making API calls for authenticated user');
      fetchPayments();
      fetchPaymentStatistics();
    } else {
      console.log('Loading demo data - no token available');
      // Load demo data immediately if not authenticated
      loadMockPayments();
    }
  }, [token, role]);

  useEffect(() => {
    // Try to make API calls if we have a token (regardless of role for testing)
    if (token) {
      fetchPayments();
    } else {
      // Load demo data for non-authenticated users
      loadMockPayments();
    }
  }, [filterStatus, filterType, pagination.currentPage, token, role]);

  // Fetch payments from API
  const fetchPayments = async () => {
    setLoading(true);
    console.log('fetchPayments called - token:', !!token, 'role:', role);
    
    try {
      // Check if user is authenticated and has admin role
      if (!token) {
        console.log('No token available');
        setErrorMessage('Authentication required - Please log in');
        loadMockPayments();
        return;
      }

      console.log('Making API request to:', `http://localhost:8081/api/admin/payments`);
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        size: pagination.pageSize.toString(),
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (filterType !== 'all') {
        params.append('paymentType', filterType);
      }

      const response = await fetch(`http://localhost:8081/api/admin/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        setPayments(data.payments || []);
        setPagination({
          currentPage: data.currentPage || 0,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          pageSize: data.pageSize || 10
        });
        setErrorMessage(null); // Clear any previous errors
      } else if (response.status === 403) {
        console.log('403 Forbidden - Access denied');
        setErrorMessage('Access denied - Admin privileges required');
        loadMockPayments();
      } else if (response.status === 401) {
        console.log('401 Unauthorized - Authentication expired');
        setErrorMessage('Authentication expired - Please log in again');
        loadMockPayments();
      } else {
        console.log('Server error:', response.status);
        setErrorMessage(`Server error: ${response.status} - Using demo data`);
        loadMockPayments();
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Fallback to mock data when server is not available
      setErrorMessage('Server not available - Using demo data');
      loadMockPayments();
    } finally {
      setLoading(false);
    }
  };

  // Load mock payments when server is unavailable
  const loadMockPayments = () => {
    const mockPayments = [
      {
        id: 1001,
        amount: 299.99,
        status: 'escrow',
        paymentType: 'order',
        orderDescription: 'Abstract Painting Commission',
        buyerName: 'John Smith',
        buyerEmail: 'john.smith@email.com',
        artistName: 'Sarah Johnson',
        artistEmail: 'sarah.j@email.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 1002,
        amount: 599.99,
        status: 'paid',
        paymentType: 'commission',
        commissionTitle: 'Portrait Commission',
        buyerName: 'Mike Davis',
        buyerEmail: 'mike.davis@email.com',
        artistName: 'Emily Chen',
        artistEmail: 'emily.chen@email.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 1003,
        amount: 149.99,
        status: 'refunded',
        paymentType: 'order',
        orderDescription: 'Digital Art Print',
        buyerName: 'Lisa Wilson',
        buyerEmail: 'lisa.wilson@email.com',
        artistName: 'David Brown',
        artistEmail: 'david.brown@email.com',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 1004,
        amount: 899.99,
        status: 'escrow',
        paymentType: 'commission',
        commissionTitle: 'Landscape Painting',
        buyerName: 'Robert Taylor',
        buyerEmail: 'robert.taylor@email.com',
        artistName: 'Maria Garcia',
        artistEmail: 'maria.garcia@email.com',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    setPayments(mockPayments);
    setPagination({
      currentPage: 0,
      totalPages: 1,
      totalElements: mockPayments.length,
      pageSize: 10
    });
  };

  // Fetch payment statistics
  const fetchPaymentStatistics = async () => {
    try {
      if (!token) {
        console.log('No token available for payment statistics');
        return;
      }

      const response = await fetch('http://localhost:8081/api/admin/payments/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPaymentStatistics(data);
      } else {
        console.error('Failed to fetch payment statistics:', response.status);
      }
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
    }
  };

  // Search payments
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      if (token && role === 'admin') {
        fetchPayments();
      } else {
        loadMockPayments();
      }
      return;
    }

    if (!token || role !== 'admin') {
      setErrorMessage('Authentication and admin privileges required for search');
      // Filter mock data locally
      const filtered = payments.filter(payment => 
        payment.orderDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.artistEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toString().includes(searchTerm)
      );
      setPayments(filtered);
      setPagination(prev => ({
        ...prev,
        currentPage: 0,
        totalPages: 1,
        totalElements: filtered.length
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/admin/payments/search?query=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
        setPagination(prev => ({
          ...prev,
          currentPage: 0,
          totalPages: 1,
          totalElements: data.length
        }));
        setErrorMessage(null);
      } else if (response.status === 403) {
        setErrorMessage('Access denied for search - Admin privileges required');
      } else if (response.status === 401) {
        setErrorMessage('Authentication expired - Please log in again');
      } else {
        setErrorMessage('Failed to search payments');
      }
    } catch (error) {
      console.error('Error searching payments:', error);
      setErrorMessage('Error searching payments');
    } finally {
      setLoading(false);
    }
  };

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

  // Calculate financial stats from payment statistics
  const getFinancialStats = () => {
    if (!paymentStatistics) {
      return [
        {
          label: 'Total Revenue',
          value: formatPrice(0),
          change: '0%',
          changeType: 'neutral',
          icon: DollarSign,
          color: '#10B981'
        },
        {
          label: 'Escrow Balance',
          value: formatPrice(0),
          change: '0%',
          changeType: 'neutral',
          icon: Shield,
          color: '#3B82F6'
        },
        {
          label: 'Paid Amount',
          value: formatPrice(0),
          change: '0%',
          changeType: 'neutral',
          icon: Wallet,
          color: '#8B5CF6'
        },
        {
          label: 'Total Payments',
          value: '0',
          change: '0',
          changeType: 'neutral',
          icon: CreditCard,
          color: '#F59E0B'
        }
      ];
    }

    return [
      {
        label: 'Total Revenue',
        value: formatPrice(paymentStatistics.total_amount || 0, 'LKR'),
        change: '+12.5%', // You can calculate this from historical data
        changeType: 'positive',
        icon: DollarSign,
        color: '#10B981'
      },
      {
        label: 'Escrow Balance',
        value: formatPrice(paymentStatistics.escrow_amount || 0, 'LKR'),
        change: '+18.7%',
        changeType: 'positive',
        icon: Shield,
        color: '#3B82F6'
      },
      {
        label: 'Paid Amount',
        value: formatPrice(paymentStatistics.paid_amount || 0, 'LKR'),
        change: '+8.3%',
        changeType: 'positive',
        icon: Wallet,
        color: '#8B5CF6'
      },
      {
        label: 'Total Payments',
        value: paymentStatistics.total_payments?.toString() || '0',
        change: `+${paymentStatistics.order_payments || 0} orders, +${paymentStatistics.commission_payments || 0} commissions`,
        changeType: 'neutral',
        icon: CreditCard,
        color: '#F59E0B'
      }
    ];
  };

  const financialStats = getFinancialStats();

  // Filter transactions based on search and filters
  const filteredTransactions = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.orderDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.artistEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id?.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.paymentType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Action handlers
  const handleRefund = async (paymentId, amount, reason) => {
    if (!token) {
      setErrorMessage('Authentication required for refund operations');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'refunded',
          reason: reason 
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Refund of ${formatPrice(amount, 'LKR')} processed successfully`);
        setShowRefundModal(false);
        fetchPayments(); // Refresh the list
      } else {
        setErrorMessage('Failed to process refund');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      setErrorMessage('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseEscrow = async (paymentId) => {
    if (!token) {
      setErrorMessage('Authentication required for escrow operations');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'paid' }),
      });

      if (response.ok) {
        setSuccessMessage('Escrow funds released successfully');
        fetchPayments(); // Refresh the list
      } else {
        setErrorMessage('Failed to release escrow funds');
      }
    } catch (error) {
      console.error('Error releasing escrow:', error);
      setErrorMessage('Failed to release escrow funds');
    } finally {
      setLoading(false);
    }
  };

  const handleContactParty = (payment, party) => {
    setSelectedTransaction({ ...payment, contactParty: party });
    setShowContactModal(true);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize: newSize, 
      currentPage: 0 
    }));
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
                Payment Details - PAY-{transaction.id}
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
            {/* Payment Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>Payment Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.status === 'paid' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'escrow' ? 'bg-blue-100 text-blue-800' :
                  transaction.status === 'refunded' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>Payment Type</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.paymentType === 'order' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {transaction.paymentType === 'order' ? 'Order Payment' : 'Commission Payment'}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>Amount</h4>
                <span className="text-lg font-bold" style={{color: '#D87C5A'}}>
                  {formatPrice(transaction.amount, 'LKR')}
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
                    <span className="font-semibold">{formatPrice(transaction.amount, 'LKR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission (15%):</span>
                    <span>{formatPrice(transaction.amount * 0.15, 'LKR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Artist Payout:</span>
                    <span>{formatPrice(transaction.amount * 0.85, 'LKR')}</span>
                  </div>
                  {transaction.status === 'escrow' && (
                    <div className="flex justify-between text-blue-600">
                      <span>In Escrow:</span>
                      <span className="font-semibold">{formatPrice(transaction.amount, 'LKR')}</span>
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
                      <span className="font-medium">{transaction.buyerName}</span>
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
                    <span className="text-sm text-gray-600">Artist:</span>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{transaction.artistName}</span>
                      <button
                        onClick={() => handleContactParty(transaction, 'artist')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                    {transaction.artistEmail && (
                      <span className="text-xs text-gray-500">{transaction.artistEmail}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="font-medium">{new Date(transaction.createdAt).toLocaleString()}</p>
                </div>
                {transaction.updatedAt && (
                  <div>
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <p className="font-medium">{new Date(transaction.updatedAt).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <p className="font-medium">{transaction.orderDescription || transaction.commissionTitle}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Type:</span>
                  <p className="font-medium capitalize">{transaction.paymentType}</p>
                </div>
              </div>
            </div>

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
                Maximum: {formatPrice(transaction.escrowAmount || transaction.amount, 'LKR')}
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
      {/* Authentication Check */}
      {!token && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Authentication Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please log in with admin credentials to access financial data. Showing demo data for preview.
              </p>
            </div>
          </div>
        </div>
      )}

      {token && role && role !== 'admin' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Access Restricted</h3>
              <p className="text-sm text-red-700 mt-1">
                Admin privileges required to access financial data. Showing demo data for preview.
              </p>
            </div>
          </div>
        </div>
      )}

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
      <style>{`
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
            Finances
            {loading && <RefreshCw className="animate-spin" size={20} />}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (token) {
                  fetchPayments();
                  fetchPaymentStatistics();
                } else {
                  loadMockPayments();
                }
              }}
              disabled={loading}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <CurrencySelector className="flex-shrink-0" />
          </div>
        </div>

        {/* Controls */}
        <div className="financial-controls">
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-center justify-between">
            {/* Search Input - Left Side */}
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" style={{color: '#5D3A00'}} />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 w-80 transition-all duration-200 hover:shadow-md bg-white shadow-sm"
                  style={{borderColor: '#FFE4D6'}}
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      fetchPayments();
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                disabled={loading}
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Search'}
              </button>
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
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
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
                  <option value="order">Order Payments</option>
                  <option value="commission">Commission Payments</option>
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
                {(!token || (role && role !== 'admin')) && (
                  <span className="ml-2 text-sm font-normal text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                    Demo Data
                  </span>
                )}
              </h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  Showing {filteredTransactions.length} of {payments.length}
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{backgroundColor: '#FFF5E1'}}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Escrow</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((payment, index) => (
                  <tr key={payment.id} className={`transaction-row border-b`} style={{borderColor: '#FFE4D6'}}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium" style={{color: '#5D3A00'}}>
                          PAY-{payment.id}
                        </p>
                        <p className="text-xs" style={{color: '#8B4513'}}>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          payment.paymentType === 'order' ? 'bg-purple-100 text-purple-800' :
                          payment.paymentType === 'commission' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.paymentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium" style={{color: '#5D3A00'}}>
                          {payment.orderDescription || payment.commissionTitle || 'Payment'}
                        </p>
                        <div className="text-xs" style={{color: '#8B4513'}}>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {payment.buyerName}
                            </span>
                            <span>→</span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {payment.artistName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-bold" style={{color: '#5D3A00'}}>
                          {formatPrice(payment.amount, 'LKR')}
                        </p>
                        <p className="text-xs" style={{color: '#8B4513'}}>
                          Commission: {formatPrice(payment.amount * 0.15, 'LKR')} {/* Assuming 15% commission */}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === 'escrow' ? (
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            {formatPrice(payment.amount, 'LKR')}
                          </p>
                          <p className="text-xs text-blue-500">Held in escrow</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Released</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'escrow' ? 'bg-blue-100 text-blue-800' :
                        payment.status === 'refunded' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">
                        {payment.paymentType === 'order' ? 'Order Payment' : 'Commission Payment'}
                      </span>
                      {payment.updatedAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          Updated: {new Date(payment.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(payment);
                            setShowTransactionModal(true);
                          }}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {payment.status === 'escrow' && (
                          <button
                            onClick={() => handleReleaseEscrow(payment.id)}
                            className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!token ? "Authentication required" : "Release Escrow"}
                            disabled={loading || !token}
                          >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                          </button>
                        )}
                        
                        {(payment.status === 'escrow' || payment.status === 'dispute') && (
                          <button
                            onClick={() => {
                              if (!token) {
                                setErrorMessage('Authentication required for refund operations');
                                return;
                              }
                              setSelectedTransaction(payment);
                              setShowRefundModal(true);
                            }}
                            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!token ? "Authentication required" : "Process Refund"}
                            disabled={!token}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            if (!token) {
                              setErrorMessage('Authentication required for contact operations');
                              return;
                            }
                            handleContactParty(payment, 'buyer');
                          }}
                          className="p-1 rounded text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={!token ? "Authentication required" : "Contact Buyer"}
                          disabled={!token}
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
                      No payments found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {pagination.currentPage * pagination.pageSize + 1} to {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} payments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      i === pagination.currentPage 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages - 1}
                  className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Financial;
