import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { 
  ShoppingCart,
  Download,
  Search,
  Filter,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  X,
  Package,
  FileText,
  Users
} from 'lucide-react';

const Orders = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    dateRange: 'all',
    status: 'all',
    includeCustomerInfo: true,
    includeItems: true
  });

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const shopId = localStorage.getItem("shopId");

        if (!shopId) {
          throw new Error("Shop ID not found. Please log in again.");
        }

        const response = await fetch(`${API_URL}/api/shop/orders?shopId=${shopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        
        // Transform backend data to frontend format
        const transformedOrders = data.map(order => {
          const items = order.items.split(', ');
          const fullName = `${order.artistFirstName} ${order.artistLastName}`;
          
          return {
            id: `#ORD-${order.orderId}`,
            orderId: order.orderId,
            customer: fullName,
            email: order.artistEmail || 'N/A',
            phone: order.artistContactNo || 'N/A',
            items: items,
            total: `Rs. ${order.totalAmount.toLocaleString()}`,
            status: order.status,
            date: new Date(order.date).toISOString().split('T')[0]
          };
        });

        setOrders(transformedOrders);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-200 text-emerald-800';
      case 'pending': return 'bg-amber-200 text-amber-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    const baseClass = "w-4 h-4 transform transition-transform duration-300 group-hover:scale-125";
    switch (status) {
      case 'approved': return <CheckCircle className={baseClass} />;
      case 'pending': return <Clock className={baseClass} />;
      case 'cancelled': return <XCircle className={baseClass} />;
      default: return <Clock className={baseClass} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExport = () => {
    // Filter orders based on export options
    let ordersToExport = [...filteredOrders];
    
    // Apply date range filter
    if (exportOptions.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch(exportOptions.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      ordersToExport = ordersToExport.filter(order => 
        new Date(order.date) >= startDate
      );
    }
    
    // Apply status filter
    if (exportOptions.status !== 'all') {
      ordersToExport = ordersToExport.filter(order => 
        order.status === exportOptions.status
      );
    }
    
    // Prepare export data
    const exportData = ordersToExport.map(order => ({
      'Order ID': order.id,
      'Customer Name': exportOptions.includeCustomerInfo ? order.customer : 'Hidden',
      'Email': exportOptions.includeCustomerInfo ? order.email : 'Hidden',
      'Phone': exportOptions.includeCustomerInfo ? order.phone : 'Hidden',
      'Items': exportOptions.includeItems ? order.items.join('; ') : 'Hidden',
      'Total Amount': order.total,
      'Status': order.status.charAt(0).toUpperCase() + order.status.slice(1),
      'Order Date': order.date
    }));

    if (exportData.length === 0) {
      alert('No orders to export with the selected filters');
      return;
    }

    // Create and download file
    let fileContent;
    let mimeType;
    let fileExtension;
    
    if (exportOptions.format === 'json') {
      fileContent = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else {
      fileContent = convertToCSV(exportData);
      mimeType = 'text/csv;charset=utf-8;';
      fileExtension = 'csv';
    }
    
    const dataBlob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `artaura-orders-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/shop/orders/${orderId}/status?status=${newStatus}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update the orders list
      setOrders(orders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

   const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Escape function for CSV values
    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };
    
    // Create CSV header row
    const headerRow = headers.map(escapeCSVValue).join(',');
    
    // Create CSV data rows
    const dataRows = data.map(row => 
      headers.map(header => escapeCSVValue(row[header])).join(',')
    );
    
    return [headerRow, ...dataRows].join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Use Navbar instead of Sidebar */}
      <div className="pt-6 px-6"> {/* Add top padding instead of left margin */}
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error loading orders</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Orders Content */}
        {!loading && !error && (
          <>
        {/* Inline Search Bar and Export Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Inline Search Bar and Filter Section */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D87C5A] w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#FFE4D6] hover:border-[#D87C5A] focus:border-[#D87C5A]  focus:ring-0 outline-none   rounded-lg text-sm"
              />
            </div>
            <div className="relative w-36">
              <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-[#D87C5A] w-4 h-4 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-[#FFE4D6]  hover:border-[#D87C5A] focus:border-[#D87C5A] focus:ring-0 outline-none   rounded-lg text-sm appearance-none"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#FFE4D6] overflow-hidden">
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#5D3A00] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFF5E1]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFF5E1]/60 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#5D3A00]">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#5D3A00]">{order.customer}</div>
                      <div className="text-sm text-[#5D3A00]/70 flex items-center gap-1">
                        <Mail className="w-3 h-3 animate-fade-in" /> {order.email}
                      </div>
                      <div className="text-sm text-[#5D3A00]/70 flex items-center gap-1">
                        <Phone className="w-3 h-3 animate-fade-in" /> {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#5D3A00] space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx}>{item}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#5D3A00]">{order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium group ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D3A00]">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => setSelectedOrder(order)} className="text-white hover:text-[#5D3A00] bg-[#D87C5A] hover:bg-[#FFD95A]/70 px-3 py-1 rounded-lg transition-all duration-300">
                        <Eye className="w-4 h-4 inline mr-1 animate-fade-in" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Orders Found */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#D87C5A] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#5D3A00] mb-2">No orders found</h3>
              <p className="text-[#5D3A00]/70">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      
       {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r p-6 rounded-t-2xl border-b border-[#FFE4D6]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                    <Package className="w-6 h-6 text-[#D87C5A]" />
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#5D3A00] mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#D87C5A]" />
                        Order Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Order ID:</span> {selectedOrder.id}</div>
                        <div><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</div>
                        <div><span className="font-medium">Total:</span> <span className="text-[#D87C5A] font-bold">{selectedOrder.total}</span></div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#5D3A00] mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#D87C5A]" />
                        Customer Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Name:</span> {selectedOrder.customer}</div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#D87C5A]" />
                          {selectedOrder.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#D87C5A]" />
                          {selectedOrder.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-semibold text-[#5D3A00] mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#D87C5A]" />
                    Order Items
                  </h3>
                  <div className="bg-[#FFF5E1] rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-[#D87C5A] rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons - Only show if status is pending */}
                {selectedOrder.status === 'pending' && (
                  <div className="border-t border-[#FFE4D6] pt-6">
                    <h3 className="text-lg font-semibold text-[#5D3A00] mb-4">
                      Update Order Status
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder.orderId, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Order
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder.orderId, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r  p-6 rounded-t-2xl border-b border-[#FFE4D6]">
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
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">Export Format</label>
                  <select
                    value={exportOptions.format}
                    onChange={(e) => setExportOptions({...exportOptions, format: e.target.value})}
                    className="w-full border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">Date Range</label>
                  <select
                    value={exportOptions.dateRange}
                    onChange={(e) => setExportOptions({...exportOptions, dateRange: e.target.value})}
                    className="w-full border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-2">Order Status</label>
                  <select
                    value={exportOptions.status}
                    onChange={(e) => setExportOptions({...exportOptions, status: e.target.value})}
                    className="w-full border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5D3A00]">Include Data</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeCustomerInfo}
                        onChange={(e) => setExportOptions({...exportOptions, includeCustomerInfo: e.target.checked})}
                        className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                      />
                      <span className="text-sm text-[#5D3A00]">Customer Information</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeItems}
                        onChange={(e) => setExportOptions({...exportOptions, includeItems: e.target.checked})}
                        className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                      />
                      <span className="text-sm text-[#5D3A00]">Order Items Details</span>
                    </label>
                  </div>
                </div>

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
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  ); 
};

export default Orders;
