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
  Eye
} from 'lucide-react';

const Orders = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      rating: 5
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
      rating: null
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
      rating: null
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
      rating: null
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
      rating: null
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
          <button className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
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
                      <Eye className="w-4 h-4 inline mr-1 animate-fade-in" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
