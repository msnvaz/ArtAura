import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  Plus,
  Upload,
  Eye,
  Settings,
  BarChart3,
  Shield,
  Image,
  Trophy,
  Store,
  Palette,
  User
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Data submitted successfully!');
    setFormData({});
  };

  const stats = [
    { label: 'Total Users', value: '2,847', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Artists', value: '1,234', icon: Palette, color: 'bg-green-500' },
    { label: 'Total Revenue', value: '$45,230', icon: DollarSign, color: 'bg-cyan-500' },
    { label: 'Pending Reports', value: '12', icon: AlertTriangle, color: 'bg-red-500' }
  ];

  const quickActions = [
    { id: 'users', label: 'User Management', icon: Users, desc: 'Manage user accounts and verifications' },
    { id: 'content', label: 'Content Moderation', icon: Shield, desc: 'Review reported content and violations' },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3, desc: 'View detailed platform statistics' },
    { id: 'settings', label: 'System Settings', icon: Settings, desc: 'Configure platform settings' }
  ];

  const recentActivity = [
    { type: 'user', message: 'New artist registration: Alex Johnson', time: '2 hours ago', icon: User },
    { type: 'payment', message: 'Payment processed: $1,250 to Elena Rodriguez', time: '4 hours ago', icon: DollarSign },
    { type: 'report', message: 'Content reported: Inappropriate artwork', time: '6 hours ago', icon: AlertTriangle },
    { type: 'exhibition', message: 'Exhibition approved: Digital Art Showcase', time: '8 hours ago', icon: Trophy }
  ];

  const renderDashboard = () => (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg text-white p-6">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-200 mb-4">Manage and oversee the entire ArtAura platform</p>
          <div className="flex gap-3">
            <button className="bg-white text-slate-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-100 transition-colors">
              <AlertTriangle size={16} />
              Review Reports
            </button>
            <button className="bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-500 transition-colors">
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border h-full">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">{stat.label}</p>
                  <h2 className="text-2xl font-bold">{stat.value}</h2>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveSection(action.id)}
                  className="border border-gray-300 rounded-lg p-4 text-left h-full hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  <action.icon size={20} className="text-gray-600 mb-2" />
                  <h6 className="font-semibold mb-1">{action.label}</h6>
                  <small className="text-gray-600">{action.desc}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <activity.icon size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm">{activity.message}</p>
                    <small className="text-gray-600">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserForm = () => (
    <div className="w-full">
      <div className="max-w-full">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users size={24} />
              Add New User
            </h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                  >
                    <option value="">Select user type</option>
                    <option value="artist">Artist</option>
                    <option value="collector">Collector</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArtworkForm = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 d-flex align-items-center gap-2">
                <Image size={24} />
                Add New Artwork
              </h2>
              <div>
                <div className="row mb-4">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Artwork Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter artwork title"
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Artist</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('artist', e.target.value)}
                    >
                      <option value="">Select artist</option>
                      <option value="alex-johnson">Alex Johnson</option>
                      <option value="elena-rodriguez">Elena Rodriguez</option>
                      <option value="david-chen">David Chen</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="digital">Digital Art</option>
                      <option value="painting">Painting</option>
                      <option value="sculpture">Sculpture</option>
                      <option value="photography">Photography</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter price"
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Enter artwork description"
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Artwork Images</label>
                  <div className="border border-2 border-dashed rounded p-4 text-center" style={{borderColor: '#dee2e6'}}>
                    <Upload size={32} className="mx-auto text-muted mb-2" />
                    <p className="text-muted small mb-0">Upload artwork images (Multiple files allowed)</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Add Artwork
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompetitionForm = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 d-flex align-items-center gap-2">
                <Trophy size={24} />
                Create New Competition
              </h2>
              <div>
                <div className="row mb-4">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Competition Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter competition name"
                      onChange={(e) => handleInputChange('competitionName', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Theme</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter competition theme"
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Prize Amount ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter prize amount"
                      onChange={(e) => handleInputChange('prizeAmount', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Max Participants</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter max participants"
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Competition Rules</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Enter competition rules and guidelines"
                    onChange={(e) => handleInputChange('rules', e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Create Competition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplaceForm = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 d-flex align-items-center gap-2">
                <Store size={24} />
                Add Marketplace Item
              </h2>
              <div>
                <div className="row mb-4">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter item name"
                      onChange={(e) => handleInputChange('itemName', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Seller</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('seller', e.target.value)}
                    >
                      <option value="">Select seller</option>
                      <option value="alex-johnson">Alex Johnson</option>
                      <option value="elena-rodriguez">Elena Rodriguez</option>
                      <option value="david-chen">David Chen</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('marketplaceCategory', e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="original-art">Original Art</option>
                      <option value="prints">Prints</option>
                      <option value="digital-downloads">Digital Downloads</option>
                      <option value="art-supplies">Art Supplies</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter price"
                      onChange={(e) => handleInputChange('marketplacePrice', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter stock quantity"
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Condition</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                    >
                      <option value="">Select condition</option>
                      <option value="new">New</option>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Item Description</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Enter detailed item description"
                    onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Item Images</label>
                  <div className="border border-2 border-dashed rounded p-4 text-center" style={{borderColor: '#dee2e6'}}>
                    <Upload size={32} className="mx-auto text-muted mb-2" />
                    <p className="text-muted small mb-0">Upload item images (Multiple files allowed)</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Add to Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Add User', icon: Users },
    { id: 'artwork', label: 'Add Artwork', icon: Image },
    { id: 'competition', label: 'Create Competition', icon: Trophy },
    { id: 'marketplace', label: 'Add Marketplace Item', icon: Store }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUserForm();
      case 'artwork':
        return renderArtworkForm();
      case 'competition':
        return renderCompetitionForm();
      case 'marketplace':
        return renderMarketplaceForm();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100" style={{backgroundColor: '#f8fafc'}}>
        {/* Sidebar */}
        <div className="position-fixed start-0 top-0 bg-white shadow border-end" style={{width: '256px', height: '100vh', zIndex: 40}}>
          <div className="p-3 border-bottom">
            <h1 className="h5 fw-bold mb-0">ArtAura Admin</h1>
          </div>
          <nav className="p-3">
            <ul className="list-unstyled">
              {menuItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`btn w-100 d-flex align-items-center gap-3 text-start ${
                      activeSection === item.id
                        ? 'btn-primary bg-opacity-10 text-primary border-0'
                        : 'btn-outline-light text-dark border-0'
                    }`}
                    style={{
                      backgroundColor: activeSection === item.id ? 'rgba(13, 110, 253, 0.1)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{marginLeft: '256px', padding: '1.5rem'}}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;