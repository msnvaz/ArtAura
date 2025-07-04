import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  BarChart3,
  Shield,
  Image,
  Store,
  User,
  Settings
} from 'lucide-react';

// Import separate components
import Overview from './Overview';
import UsersManagement from './Users';
import ArtworkManagement from './Artwork';
import MarketplaceManagement from './Marketplace';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'artwork', label: 'Artworks', icon: Image },
    { id: 'marketplace', label: 'Marketplace', icon: Store }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UsersManagement />;
      case 'artwork':
        return <ArtworkManagement />;
      case 'marketplace':
        return <MarketplaceManagement />;
      default:
        return <Overview />;
    }
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen" style={{backgroundColor: '#FFF5E1'}}>
        {/* Full Width Header */}
        <div 
          className="w-full shadow-sm p-6 mb-8 relative"
          style={{
            backgroundImage: 'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full" style={{backgroundColor: '#FFD95A'}}>
                  <Shield size={32} style={{color: '#5D3A00'}} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-gray-200">Welcome back, Administrator!</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFE4D6';
                    e.target.style.color = '#5D3A00';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 228, 214, 0.1)';
                    e.target.style.color = '#FFE4D6';
                  }}
                >
                  <AlertTriangle size={14} />
                  <span className="hidden sm:inline">Review Reports</span>
                  <span className="sm:hidden">Reports</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFE4D6';
                    e.target.style.color = '#5D3A00';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 228, 214, 0.1)';
                    e.target.style.color = '#FFE4D6';
                  }}
                >
                  <FileText size={14} />
                  <span className="hidden sm:inline">Generate Report</span>
                  <span className="sm:hidden">Generate</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFE4D6';
                    e.target.style.color = '#5D3A00';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 228, 214, 0.1)';
                    e.target.style.color = '#FFE4D6';
                  }}
                >
                  <Users size={14} />
                  <span className="hidden sm:inline">User Management</span>
                  <span className="sm:hidden">Users</span>
                </button>
                
                {/* Logout Button */}
                <button
                  className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    backgroundColor: '#D87C5A',
                    color: 'white',
                    border: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#B85A3A';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#D87C5A';
                  }}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      console.log('Logout clicked');
                    }
                  }}
                >
                  <User size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div style={{borderBottom: '1px solid #FFE4D6'}}>
              <nav className="flex space-x-8 px-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                    style={{
                      borderBottomColor: activeSection === item.id ? '#5D3A00' : 'transparent',
                      color: activeSection === item.id ? '#5D3A00' : '#D87C5A'
                    }}
                    onMouseOver={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = '#5D3A00';
                        e.target.style.borderBottomColor = '#FFD95A';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = '#D87C5A';
                        e.target.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;