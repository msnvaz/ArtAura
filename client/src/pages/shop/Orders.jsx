import { useState } from 'react';
import "/src/styles/shop/orders.css"; // Assuming you have a CSS file for styles

import { 
  ShoppingCart, 
  Download, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Eye,
  CheckCircle,
  Truck,
  Clock,
  Calendar,
  XCircle
} from 'react-feather';

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
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <div>
            <h1 className="header-title">
              <ShoppingCart className="header-icon" />
              Order Management
            </h1>
            <p className="header-subtitle">Track and manage all customer orders</p>
          </div>
          <button className="export-button">
            <Download className="button-icon" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-filter-group">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <Filter className="filter-icon" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
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
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-table-container">
        <div className="table-wrapper">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="table-row">
                  <td className="order-id">{order.id}</td>
                  <td className="customer-info">
                    <div className="customer-name">{order.customer}</div>
                    <div className="customer-email">
                      <Mail className="info-icon" />
                      {order.email}
                    </div>
                    <div className="customer-phone">
                      <Phone className="info-icon" />
                      {order.phone}
                    </div>
                  </td>
                  <td className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item">{item}</div>
                    ))}
                  </td>
                  <td className="order-total">{order.total}</td>
                  <td className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="order-date">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="order-actions">
                    <button className="view-button">
                      <Eye className="action-icon" />
                      View
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