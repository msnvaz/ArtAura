import { useState } from 'react';
import Navbar from '../../components/Navbar'; // Changed import
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
      id: '#ORD-2025-120',
      customer: 'Priyanka Wijesinghe',
      email: 'priyanka.w@gmail.com',
      phone: '+94 71 234 5678',
      items: ['Premium Acrylic Paint Set 24 Colors', 'Professional Canvas Board Set'],
      total: 'Rs. 18,750',
      status: 'delivered',
      date: '2025-07-20',
      address: '47/3, Reid Avenue, Colombo 07',
      rating: 5,
      trackingNumber: 'SL-TRK-120-AP',
      notes: 'Customer very satisfied with product quality'
    },
    {
      id: '#ORD-2025-121',
      customer: 'Mahesh Gunasekara',
      email: 'mahesh.g@yahoo.com',
      phone: '+94 77 345 6789',
      items: ['Digital Drawing Tablet Pro', 'Stylus Pen Set', 'Tablet Stand'],
      total: 'Rs. 45,600',
      status: 'shipped',
      date: '2025-07-21',
      address: '89, Battaramulla Road, Battaramulla',
      rating: null,
      trackingNumber: 'SL-TRK-121-DT',
      notes: 'Express delivery requested - shipped via courier'
    },
    {
      id: '#ORD-2025-122',
      customer: 'Shalini Rajapakse',
      email: 'shalini.r@hotmail.com',
      phone: '+94 76 456 7890',
      items: ['Watercolor Paper Pad A3', 'Fine Art Brushes Set'],
      total: 'Rs. 6,450',
      status: 'processing',
      date: '2025-07-21',
      address: '156/B, Peradeniya Road, Kandy',
      rating: null,
      trackingNumber: null,
      notes: 'Waiting for stock confirmation from supplier'
    },
    {
      id: '#ORD-2025-123',
      customer: 'Dinesh Perera',
      email: 'dinesh.perera@outlook.com',
      phone: '+94 70 567 8901',
      items: ['Oil Painting Starter Kit', 'Palette Knife Set', 'Canvas Stretcher Bars'],
      total: 'Rs. 22,300',
      status: 'pending',
      date: '2025-07-21',
      address: '234, Galle Road, Mount Lavinia',
      rating: null,
      trackingNumber: null,
      notes: 'Payment verification in progress'
    },
    {
      id: '#ORD-2025-124',
      customer: 'Anusha Fernando',
      email: 'anusha.f@gmail.com',
      phone: '+94 75 678 9012',
      items: ['Sketching Pencils Professional Set', 'Blending Stumps'],
      total: 'Rs. 4,200',
      status: 'cancelled',
      date: '2025-07-20',
      address: '78/A, Main Street, Negombo',
      rating: null,
      trackingNumber: null,
      notes: 'Customer found cheaper alternative elsewhere'
    },
    {
      id: '#ORD-2025-125',
      customer: 'Sampath Wickramasinghe',
      email: 'sampath.w@gmail.com',
      phone: '+94 72 789 0123',
      items: ['Calligraphy Pen Set Premium', 'Ink Bottles Assorted', 'Practice Paper'],
      total: 'Rs. 11,850',
      status: 'delivered',
      date: '2025-07-19',
      address: '123/C, Colombo Road, Gampaha',
      rating: 4,
      trackingNumber: 'SL-TRK-125-CP',
      notes: 'Delivered successfully to Gampaha office'
    },
    {
      id: '#ORD-2025-126',
      customer: 'Kavitha Jayawardena',
      email: 'kavitha.j@yahoo.com',
      phone: '+94 78 890 1234',
      items: ['Marker Set Professional 60 Colors', 'Marker Paper Pad'],
      total: 'Rs. 15,900',
      status: 'shipped',
      date: '2025-07-21',
      address: '67, Hospital Road, Kalutara',
      rating: null,
      trackingNumber: 'SL-TRK-126-MK',
      notes: 'Standard shipping to Kalutara - expected delivery tomorrow'
    },
    {
      id: '#ORD-2025-127',
      customer: 'Roshan Silva',
      email: 'roshan.silva@gmail.com',
      phone: '+94 71 901 2345',
      items: ['Easel Table Adjustable', 'Paint Palette Large', 'Brush Cleaner Solution'],
      total: 'Rs. 28,400',
      status: 'processing',
      date: '2025-07-21',
      address: '145, Queen Street, Kandy',
      rating: null,
      trackingNumber: null,
      notes: 'Large item - arranging special delivery vehicle'
    },
    {
      id: '#ORD-2025-128',
      customer: 'Malini Ranasinghe',
      email: 'malini.r@hotmail.com',
      phone: '+94 77 012 3456',
      items: ['Pastels Set Soft 48 Colors', 'Pastel Paper Textured'],
      total: 'Rs. 9,750',
      status: 'delivered',
      date: '2025-07-18',
      address: '89/1, Lake Road, Nuwara Eliya',
      rating: 5,
      trackingNumber: 'SL-TRK-128-PS',
      notes: 'Special delivery to Nuwara Eliya - customer very happy'
    },
    {
      id: '#ORD-2025-129',
      customer: 'Chamara Bandara',
      email: 'chamara.b@outlook.com',
      phone: '+94 76 123 4567',
      items: ['Graphic Design Kit Complete', 'Cutting Mat A2', 'Precision Rulers Set'],
      total: 'Rs. 31,200',
      status: 'pending',
      date: '2025-07-21',
      address: '234/A, Matara Road, Galle',
      rating: null,
      trackingNumber: null,
      notes: 'Awaiting credit card payment confirmation'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-200 text-emerald-800';
      case 'shipped': return 'bg-blue-200 text-blue-800';
      case 'processing': return 'bg-amber-200 text-amber-800';
      case 'pending': return 'bg-gray-200 text-gray-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
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
    link.download = `artaura-orders-export-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
    link.click();
    
    setShowExportModal(false);
  };

   const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating yet</span>;
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
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Use Navbar instead of Sidebar */}
      <div className="pt-6 px-6"> {/* Add top padding instead of left margin */}
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
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
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
                        {selectedOrder.trackingNumber && (
                          <div><span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}</div>
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
      </div>
    </div>
  ); 
};

export default Orders;
