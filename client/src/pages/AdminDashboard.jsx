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
    { label: 'Total Users', value: '2,847', icon: Users, color: 'bg-primary' },
    { label: 'Active Artists', value: '1,234', icon: Palette, color: 'bg-success' },
    { label: 'Total Revenue', value: '$45,230', icon: DollarSign, color: 'bg-info' },
    { label: 'Pending Reports', value: '12', icon: AlertTriangle, color: 'bg-danger' }
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
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-dark text-white" style={{background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'}}>
            <div className="card-body p-4">
              <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
              <p className="text-light mb-3">Manage and oversee the entire ArtAura platform</p>
              <div className="d-flex gap-3">
                <button className="btn btn-light fw-semibold d-flex align-items-center gap-2">
                  <AlertTriangle size={16} />
                  Review Reports
                </button>
                <button className="btn btn-secondary fw-semibold d-flex align-items-center gap-2">
                  <FileText size={16} />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text small text-muted fw-semibold mb-1">{stat.label}</p>
                    <h2 className="card-title fw-bold mb-0">{stat.value}</h2>
                  </div>
                  <div className={`${stat.color} p-3 rounded-3`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="row">
        <div className="col-12 col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="card-title h4 fw-bold mb-4">Quick Actions</h2>
              <div className="row">
                {quickActions.map((action) => (
                  <div key={action.id} className="col-12 col-sm-6 mb-3">
                    <button
                      onClick={() => setActiveSection(action.id)}
                      className="btn btn-outline-secondary w-100 p-3 text-start h-100"
                      style={{transition: 'all 0.2s'}}
                    >
                      <action.icon size={20} className="text-muted mb-2" />
                      <h6 className="fw-semibold mb-1">{action.label}</h6>
                      <small className="text-muted">{action.desc}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="card-title h4 fw-bold mb-4">Recent Activity</h2>
              <div className="d-flex flex-column gap-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded">
                      <activity.icon size={16} className="text-muted" />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 small">{activity.message}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserForm = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 d-flex align-items-center gap-2">
                <Users size={24} />
                Add New User
              </h2>
              <div>
                <div className="row mb-4">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter full name"
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email address"
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">User Type</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('userType', e.target.value)}
                    >
                      <option value="">Select user type</option>
                      <option value="artist">Artist</option>
                      <option value="collector">Collector</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Profile Picture</label>
                  <div className="border border-2 border-dashed rounded p-4 text-center" style={{borderColor: '#dee2e6'}}>
                    <Upload size={32} className="mx-auto text-muted mb-2" />
                    <p className="text-muted small mb-0">Click to upload or drag and drop</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Add User
                </button>
              </div>
            </div>
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