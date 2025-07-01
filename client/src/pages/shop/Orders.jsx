import { useState } from 'react';
import { 
  ShoppingCart,
  Download,
  Search,
  Filter,
  Mail,
  Phone,
  CheckCircle,
  Truck,
  Clock,
  Calendar,
  XCircle,
  Eye,
  X,
  MapPin,
  Star,
  Package,
  FileText,
  Users,
  DollarSign
} from 'lucide-react';

const Orders = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    dateRange: 'all',
    status: 'all',
    includeCustomerInfo: true,
    includeItems: true
  });

  const orders = [
    {
      id: '#ORD-001',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      items: ['Watercolor Set Premium', 'Canvas Bundle'],
      total: '$245.99',
      status: 'delivered',
      date: '2024-06-20',
      address: '123 Art Street, Creative City, CA 90210',
      rating: 5,
      trackingNumber: 'TRK-001-WC',
      notes: 'Customer requested express delivery'
    },
    {
      id: '#ORD-002',
      customer: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 987-6543',
      items: ['Acrylic Paint Set', 'Brushes Professional'],
      total: '$156.50',
      status: 'shipped',
      date: '2024-06-21',
      address: '456 Painter Ave, Artville, NY 10001',
      rating: null,
      trackingNumber: 'TRK-002-AC',
      notes: 'Standard shipping'
    },
    {
      id: '#ORD-003',
      customer: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '+1 (555) 456-7890',
      items: ['Sketch Pad A4', 'Pencil Set'],
      total: '$89.99',
      status: 'processing',
      date: '2024-06-22',
      address: '789 Draw Lane, Sketch Town, TX 75001',
      rating: null,
      trackingNumber: null,
      notes: 'Processing payment verification'
    },
    {
      id: '#ORD-004',
      customer: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 321-9876',
      items: ['Oil Paint Set', 'Canvas Large'],
      total: '$312.75',
      status: 'pending',
      date: '2024-06-23',
      address: '321 Oil St, Paint City, FL 33101',
      rating: null,
      trackingNumber: null,
      notes: 'Awaiting inventory confirmation'
    },
    {
      id: '#ORD-005',
      customer: 'Lisa Garcia',
      email: 'lisa.garcia@email.com',
      phone: '+1 (555) 654-3210',
      items: ['Marker Set', 'Drawing Paper'],
      total: '$78.25',
      status: 'cancelled',
      date: '2024-06-19',
      address: '654 Marker Rd, Color Town, WA 98001',
      rating: null,
      trackingNumber: null,
      notes: 'Customer requested cancellation'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    const baseClass = "w-4 h-4 transform transition-transform duration-300 group-hover:scale-125";
    switch (status) {
      case 'delivered': return <CheckCircle className={baseClass} />;
      case 'shipped': return <Truck className={baseClass} />;
      case 'processing': return <Clock className={baseClass} />;
      case 'pending': return <Calendar className={baseClass} />;
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
    // Simulate export functionality
    const exportData = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Customer': exportOptions.includeCustomerInfo ? order.customer : 'Hidden',
      'Email': exportOptions.includeCustomerInfo ? order.email : 'Hidden',
      'Phone': exportOptions.includeCustomerInfo ? order.phone : 'Hidden',
      'Items': exportOptions.includeItems ? order.items.join(', ') : 'Hidden',
      'Total': order.total,
      'Status': order.status,
      'Date': order.date,
      'Address': order.address
    }));

    // Create and download file
    const dataStr = exportOptions.format === 'json' 
      ? JSON.stringify(exportData, null, 2)
      : convertToCSV(exportData);
    
    const dataBlob = new Blob([dataStr], { type: exportOptions.format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-export.${exportOptions.format}`;
    link.click();
    
    setShowExportModal(false);
  };

   const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-[white] min-h-screen p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFF5E1] via-[#FFD95A]/30 to-[#FFE4D6] rounded-2xl shadow-xl p-6 border border-[#FFE4D6] animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5D3A00] to-[#D87C5A] bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#D87C5A] animate-bounce-slow" />
              Order Management
            </h1>
            <p className="text-[#5D3A00] mt-2">Track and manage all customer orders efficiently</p>
          </div>
          <button  onClick={() => setShowExportModal(true)} className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Download className="w-4 h-4 inline mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-4 border border-[#FFE4D6] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D87C5A] w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5D3A00]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-[#FFD95A] rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
                    <button className="text-[#D87C5A] hover:text-[#5D3A00] bg-[#FFE4D6] hover:bg-[#FFD95A]/70 px-3 py-1 rounded-lg transition-all duration-300">
                      <Eye onClick={() => setSelectedOrder(order)} className="w-4 h-4 inline mr-1 animate-fade-in" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
     {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#FFF5E1] to-[#FFE4D6] p-6 rounded-t-2xl border-b border-[#FFD95A]">
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
                      {selectedOrder.trackingNumber && (
                        <div><span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}</div>
                      )}
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
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-[#D87C5A] mt-1 flex-shrink-0" />
                        <span className="text-xs">{selectedOrder.address}</span>
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

              {/* Rating */}
              <div>
                <h3 className="text-lg font-semibold text-[#5D3A00] mb-3">Customer Rating</h3>
                {renderStars(selectedOrder.rating)}
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-[#5D3A00] mb-3">Notes</h3>
                  <div className="bg-[#FFF5E1] rounded-lg p-4 text-sm text-[#5D3A00]">
                    {selectedOrder.notes}
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
            <div className="bg-gradient-to-r from-[#FFF5E1] to-[#FFE4D6] p-6 rounded-t-2xl border-b border-[#FFD95A]">
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
                  className="w-full border border-[#FFD95A] rounded-lg px-3 py-2 text-sm"
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
                  className="w-full border border-[#FFD95A] rounded-lg px-3 py-2 text-sm"
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
                  className="w-full border border-[#FFD95A] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
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
                      className="rounded border-[#FFD95A]"
                    />
                    <span className="text-sm text-[#5D3A00]">Customer Information</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeItems}
                      onChange={(e) => setExportOptions({...exportOptions, includeItems: e.target.checked})}
                      className="rounded border-[#FFD95A]"
                    />
                    <span className="text-sm text-[#5D3A00]">Order Items</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 text-[#5D3A00] border border-[#FFD95A] rounded-lg hover:bg-[#FFF5E1] transition-colors"
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
  ); 
};

export default Orders;
