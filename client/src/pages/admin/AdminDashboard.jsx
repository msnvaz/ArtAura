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
  User,
  Search,
  Filter,
  Ban,
  UserCheck,
  UserX,
  ShieldAlert,
  MoreVertical,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Artwork management state
  const [artworkSearchTerm, setArtworkSearchTerm] = useState('');
  const [artworkFilterStatus, setArtworkFilterStatus] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showArtworkModal, setShowArtworkModal] = useState(false);

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

  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', type: 'Artist', status: 'Active', joinDate: '2024-01-15', artworks: 12, blocked: false },
    { id: 2, name: 'Elena Rodriguez', email: 'elena@example.com', type: 'Collector', status: 'Active', joinDate: '2024-02-20', artworks: 0, blocked: false },
    { id: 3, name: 'David Chen', email: 'david@example.com', type: 'Artist', status: 'Pending', joinDate: '2024-03-10', artworks: 5, blocked: false },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', type: 'Artist', status: 'Suspended', joinDate: '2024-01-30', artworks: 8, blocked: true },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', type: 'Collector', status: 'Active', joinDate: '2024-02-05', artworks: 0, blocked: false },
    { id: 6, name: 'Lisa Thompson', email: 'lisa@example.com', type: 'Artist', status: 'Active', joinDate: '2024-01-10', artworks: 15, blocked: false },
    { id: 7, name: 'James Davis', email: 'james@example.com', type: 'Admin', status: 'Active', joinDate: '2023-12-01', artworks: 0, blocked: false }
  ]);

  // Mock data for artworks
  const [artworks, setArtworks] = useState([
    { 
      id: 1, 
      title: 'Digital Sunset', 
      artist: 'Alex Johnson', 
      category: 'Digital Art', 
      price: 1250, 
      status: 'Approved', 
      uploadDate: '2024-01-20', 
      views: 1543, 
      likes: 89, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 2, 
      title: 'Abstract Harmony', 
      artist: 'Elena Rodriguez', 
      category: 'Painting', 
      price: 2100, 
      status: 'Pending', 
      uploadDate: '2024-02-15', 
      views: 892, 
      likes: 45, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 3, 
      title: 'Urban Photography', 
      artist: 'David Chen', 
      category: 'Photography', 
      price: 850, 
      status: 'Approved', 
      uploadDate: '2024-03-01', 
      views: 2341, 
      likes: 156, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 4, 
      title: 'Controversial Art', 
      artist: 'Sarah Wilson', 
      category: 'Mixed Media', 
      price: 3200, 
      status: 'Flagged', 
      uploadDate: '2024-02-28', 
      views: 567, 
      likes: 12, 
      blocked: true,
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 5, 
      title: 'Nature\'s Beauty', 
      artist: 'Lisa Thompson', 
      category: 'Landscape', 
      price: 1750, 
      status: 'Approved', 
      uploadDate: '2024-01-25', 
      views: 3421, 
      likes: 234, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const handleBlockArtwork = (artworkId) => {
    setArtworks(artworks.map(artwork => 
      artwork.id === artworkId ? { 
        ...artwork, 
        blocked: !artwork.blocked, 
        status: artwork.blocked ? 'Approved' : 'Flagged' 
      } : artwork
    ));
  };

  const handleBlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        blocked: !user.blocked, 
        status: user.blocked ? 'Active' : 'Suspended' 
      } : user
    ));
  };

  const stats = [
    { label: 'Total Users', value: '2,847', icon: Users, color: '#D87C5A' },
    { label: 'Active Artists', value: '1,234', icon: Palette, color: '#FFD95A' },
    { label: 'Total Revenue', value: '$45,230', icon: DollarSign, color: '#5D3A00' },
    { label: 'Pending Reports', value: '12', icon: AlertTriangle, color: '#D87C5A' }
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: index === 0 
                  ? 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Users - people working
                  : index === 1 
                  ? 'url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Artists - art gallery
                  : index === 2 
                  ? 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Revenue - money/coins
                  : 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Reports - warning/alert
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                  <h2 className="text-2xl font-bold" style={{color: '#5D3A00'}}>{stat.value}</h2>
                </div>
                <div className="p-3 rounded-lg shadow-lg" style={{backgroundColor: stat.color}}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-4" style={{color: '#5D3A00'}}>Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveSection(action.id)}
                  className="border rounded-lg p-4 text-left h-full transition-all duration-200 relative overflow-hidden"
                  style={{
                    borderColor: '#FFE4D6',
                    backgroundColor: '#FFE4D6'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFD95A';
                    e.target.style.borderColor = '#D87C5A';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(93, 58, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FFE4D6';
                    e.target.style.borderColor = '#FFE4D6';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <action.icon size={20} className="mb-2" style={{color: '#5D3A00'}} />
                  <h6 className="font-semibold mb-1" style={{color: '#5D3A00'}}>{action.label}</h6>
                  <small style={{color: '#5D3A00'}}>{action.desc}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-4" style={{color: '#5D3A00'}}>Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-50">
                  <div className="p-2 rounded shadow-sm" style={{backgroundColor: '#FFE4D6'}}>
                    <activity.icon size={16} style={{color: '#5D3A00'}} />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm" style={{color: '#5D3A00'}}>{activity.message}</p>
                    <small style={{color: '#D87C5A'}}>{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    // User management stats
    const userStats = [
      { 
        label: 'Total Users', 
        value: users.length.toLocaleString(), 
        icon: Users, 
        color: '#D87C5A',
        change: '+12%',
        changeType: 'positive'
      },
      { 
        label: 'Active Users', 
        value: users.filter(u => u.status === 'Active').length.toLocaleString(), 
        icon: UserCheck, 
        color: '#5D9CDB',
        change: '+8%',
        changeType: 'positive'
      },
      { 
        label: 'Pending Verification', 
        value: users.filter(u => u.status === 'Pending').length.toLocaleString(), 
        icon: UserX, 
        color: '#FFD95A',
        change: '-3%',
        changeType: 'negative'
      },
      { 
        label: 'Suspended Users', 
        value: users.filter(u => u.status === 'Suspended').length.toLocaleString(), 
        icon: ShieldAlert, 
        color: '#E74C3C',
        change: '-15%',
        changeType: 'positive'
      }
    ];

    return (
      <div className="space-y-6">
        {/* User Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
              {/* Background Image */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: index === 0 
                    ? 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Total users - people working
                    : index === 1 
                    ? 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Active users - verified check
                    : index === 2 
                    ? 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Pending - hourglass/waiting
                    : 'url("https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Suspended - warning shield
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{color: '#5D3A00'}}>{stat.value}</h2>
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
                  <div className="p-3 rounded-lg shadow-lg" style={{backgroundColor: stat.color}}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Header with Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
              <Users size={24} />
              User Management ({filteredUsers.length} users)
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-full sm:w-64"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                />
              </div>
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none w-full sm:w-auto"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{backgroundColor: '#FFF5E1'}}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Artworks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : ''} style={{backgroundColor: index % 2 === 1 ? '#FFF5E1' : 'white'}}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium" style={{color: '#5D3A00'}}>{user.name}</div>
                        <div className="text-sm" style={{color: '#D87C5A'}}>{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>
                      <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                        backgroundColor: user.type === 'Artist' ? '#FFE4D6' : user.type === 'Admin' ? '#FFD95A' : '#FFF5E1',
                        color: '#5D3A00'
                      }}>
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active' ? 'text-green-800 bg-green-100' :
                        user.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                        'text-red-800 bg-red-100'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>{user.joinDate}</td>
                    <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>
                      <span className="font-medium">{user.artworks}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {setSelectedUser(user); setShowUserModal(true);}}
                          className="p-2 rounded-lg transition-colors"
                          style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFD95A';
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#FFE4D6';
                            e.target.style.transform = 'scale(1)';
                          }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleBlockUser(user.id)}
                          className={`p-2 rounded-lg transition-all ${
                            user.blocked 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                          title={user.blocked ? 'Unblock User' : 'Block User'}
                        >
                          {user.blocked ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                        <button
                          className="p-2 rounded-lg transition-colors"
                          style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFD95A';
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#FFE4D6';
                            e.target.style.transform = 'scale(1)';
                          }}
                          title="More Options"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center" style={{color: '#D87C5A'}}>
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No users found</p>
              <p className="text-sm">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderArtworkManagement = () => {
    const filteredArtworks = artworks.filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
                           artwork.artist.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
                           artwork.category.toLowerCase().includes(artworkSearchTerm.toLowerCase());
      const matchesStatus = artworkFilterStatus === 'all' || artwork.status.toLowerCase() === artworkFilterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    // Artwork management stats
    const artworkStats = [
      { 
        label: 'Total Artworks', 
        value: artworks.length.toLocaleString(), 
        icon: Image, 
        color: '#D87C5A',
        change: '+18%',
        changeType: 'positive'
      },
      { 
        label: 'Approved', 
        value: artworks.filter(a => a.status === 'Approved').length.toLocaleString(), 
        icon: UserCheck, 
        color: '#5D9CDB',
        change: '+12%',
        changeType: 'positive'
      },
      { 
        label: 'Pending Review', 
        value: artworks.filter(a => a.status === 'Pending').length.toLocaleString(), 
        icon: AlertTriangle, 
        color: '#FFD95A',
        change: '+5%',
        changeType: 'neutral'
      },
      { 
        label: 'Flagged Content', 
        value: artworks.filter(a => a.status === 'Flagged').length.toLocaleString(), 
        icon: ShieldAlert, 
        color: '#E74C3C',
        change: '-25%',
        changeType: 'positive'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Artwork Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {artworkStats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
              {/* Background Image */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: index === 0 
                    ? 'url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Total artworks - art gallery
                    : index === 1 
                    ? 'url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Approved - checkmark/approval
                    : index === 2 
                    ? 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Pending - hourglass/clock
                    : 'url("https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Flagged - warning/shield
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{color: '#5D3A00'}}>{stat.value}</h2>
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: stat.changeType === 'positive' ? '#d4edda' : stat.changeType === 'negative' ? '#f8d7da' : '#fff3cd',
                          color: stat.changeType === 'positive' ? '#155724' : stat.changeType === 'negative' ? '#721c24' : '#856404'
                        }}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs opacity-75" style={{color: '#5D3A00'}}>vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg shadow-lg" style={{backgroundColor: stat.color}}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Header with Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
              <Image size={24} />
              Artwork Management ({filteredArtworks.length} artworks)
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
                <input
                  type="text"
                  placeholder="Search artworks by title, artist, or category..."
                  value={artworkSearchTerm}
                  onChange={(e) => setArtworkSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-full sm:w-64"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                />
              </div>
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
                <select
                  value={artworkFilterStatus}
                  onChange={(e) => setArtworkFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none w-full sm:w-auto"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#D87C5A', color: 'white'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
              >
                <Plus size={16} />
                Add Artwork
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    artwork.status === 'Approved' ? 'text-green-800 bg-green-100' :
                    artwork.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                    'text-red-800 bg-red-100'
                  }`}>
                    {artwork.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1" style={{color: '#5D3A00'}}>{artwork.title}</h3>
                  <p className="text-sm" style={{color: '#D87C5A'}}>by {artwork.artist}</p>
                  <p className="text-xs mt-1" style={{color: '#5D3A00'}}>{artwork.category}</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg" style={{color: '#5D3A00'}}>${artwork.price.toLocaleString()}</span>
                  <div className="flex items-center gap-3 text-sm" style={{color: '#D87C5A'}}>
                    <span>{artwork.views} views</span>
                    <span>{artwork.likes} likes</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{color: '#5D3A00'}}>Uploaded: {artwork.uploadDate}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {setSelectedArtwork(artwork); setShowArtworkModal(true);}}
                      className="p-2 rounded-lg transition-colors"
                      style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#FFD95A';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#FFE4D6';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleBlockArtwork(artwork.id)}
                      className={`p-2 rounded-lg transition-all ${
                        artwork.blocked 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                      title={artwork.blocked ? 'Approve Artwork' : 'Flag Artwork'}
                    >
                      {artwork.blocked ? <UserCheck size={16} /> : <Ban size={16} />}
                    </button>
                    <button
                      className="p-2 rounded-lg transition-colors"
                      style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#FFD95A';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#FFE4D6';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title="More Options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center" style={{color: '#D87C5A'}}>
            <Image size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No artworks found</p>
            <p className="text-sm">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    );
  };

  const renderCompetitionForm = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{color: '#5D3A00'}}>
          <Trophy size={24} />
          Create New Competition
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Competition Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter competition name"
                onChange={(e) => handleInputChange('competitionName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Theme</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter competition theme"
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Prize Amount ($)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter prize amount"
                onChange={(e) => handleInputChange('prizeAmount', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Max Participants</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter max participants"
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Competition Rules</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
              placeholder="Enter competition rules and guidelines"
              onChange={(e) => handleInputChange('rules', e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold transition-colors"
            style={{backgroundColor: '#D87C5A', color: 'white'}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
          >
            Create Competition
          </button>
        </form>
      </div>
    </div>
  );

  const renderMarketplaceForm = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{color: '#5D3A00'}}>
          <Store size={24} />
          Add Marketplace Item
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Item Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter item name"
                onChange={(e) => handleInputChange('itemName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Seller</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('seller', e.target.value)}
              >
                <option value="">Select seller</option>
                <option value="alex-johnson">Alex Johnson</option>
                <option value="elena-rodriguez">Elena Rodriguez</option>
                <option value="david-chen">David Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Category</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('marketplaceCategory', e.target.value)}
              >
                <option value="">Select category</option>
                <option value="original-art">Original Art</option>
                <option value="prints">Prints</option>
                <option value="digital-downloads">Digital Downloads</option>
                <option value="art-supplies">Art Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Price ($)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter price"
                onChange={(e) => handleInputChange('marketplacePrice', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Stock Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter stock quantity"
                onChange={(e) => handleInputChange('stock', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Condition</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Item Description</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
              placeholder="Enter detailed item description"
              onChange={(e) => handleInputChange('itemDescription', e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Item Images</label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{borderColor: '#D87C5A', backgroundColor: '#FFE4D6'}}>
              <Upload size={32} className="mx-auto mb-2" style={{color: '#5D3A00'}} />
              <p className="text-sm" style={{color: '#5D3A00'}}>Upload item images (Multiple files allowed)</p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold transition-colors"
            style={{backgroundColor: '#D87C5A', color: 'white'}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
          >
            Add to Marketplace
          </button>
        </form>
      </div>
    </div>
  );

  // User Details Modal
  const UserModal = () => {
    if (!showUserModal || !selectedUser) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{color: '#5D3A00'}}>User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Personal Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span> 
                    <span>{selectedUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span> 
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span> 
                    <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                      backgroundColor: selectedUser.type === 'Artist' ? '#FFE4D6' : selectedUser.type === 'Admin' ? '#FFD95A' : '#FFF5E1',
                      color: '#5D3A00'
                    }}>
                      {selectedUser.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedUser.status === 'Active' ? 'text-green-800 bg-green-100' :
                      selectedUser.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                      'text-red-800 bg-red-100'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Activity & Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Join Date:</span> 
                    <span>{selectedUser.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Artworks:</span> 
                    <span className="font-bold" style={{color: '#D87C5A'}}>{selectedUser.artworks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Account Status:</span> 
                    <span className={selectedUser.blocked ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                      {selectedUser.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Activity:</span> 
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  handleBlockUser(selectedUser.id);
                  setSelectedUser({...selectedUser, blocked: !selectedUser.blocked, status: selectedUser.blocked ? 'Active' : 'Suspended'});
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedUser.blocked 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {selectedUser.blocked ? <UserCheck size={16} /> : <UserX size={16} />}
                {selectedUser.blocked ? 'Unblock User' : 'Block User'}
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <Eye size={16} />
                View Profile
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#D87C5A', color: 'white'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
              >
                <Plus size={16} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Artwork Details Modal
  const ArtworkModal = () => {
    if (!showArtworkModal || !selectedArtwork) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-90vh overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{color: '#5D3A00'}}>Artwork Details</h3>
              <button
                onClick={() => setShowArtworkModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Artwork Image */}
              <div>
                <img 
                  src={selectedArtwork.imageUrl} 
                  alt={selectedArtwork.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedArtwork.status === 'Approved' ? 'text-green-800 bg-green-100' :
                    selectedArtwork.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                    'text-red-800 bg-red-100'
                  }`}>
                    {selectedArtwork.status}
                  </span>
                  <div className="text-sm" style={{color: '#D87C5A'}}>
                    {selectedArtwork.views} views • {selectedArtwork.likes} likes
                  </div>
                </div>
              </div>
              
              {/* Artwork Details */}
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold mb-2" style={{color: '#5D3A00'}}>{selectedArtwork.title}</h4>
                    <p className="text-lg" style={{color: '#D87C5A'}}>by {selectedArtwork.artist}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Category:</span>
                      <p>{selectedArtwork.category}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Price:</span>
                      <p className="text-lg font-bold" style={{color: '#5D3A00'}}>${selectedArtwork.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Upload Date:</span>
                      <p>{selectedArtwork.uploadDate}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Content Status:</span>
                      <p className={selectedArtwork.blocked ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {selectedArtwork.blocked ? 'Flagged' : 'Approved'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium" style={{color: '#5D3A00'}}>Performance Metrics:</span>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Total Views</div>
                        <div className="text-lg font-bold" style={{color: '#5D3A00'}}>{selectedArtwork.views.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-lg font-bold" style={{color: '#5D3A00'}}>{Math.round((selectedArtwork.likes / selectedArtwork.views) * 100)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  handleBlockArtwork(selectedArtwork.id);
                  setSelectedArtwork({...selectedArtwork, blocked: !selectedArtwork.blocked, status: selectedArtwork.blocked ? 'Approved' : 'Flagged'});
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedArtwork.blocked 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {selectedArtwork.blocked ? <UserCheck size={16} /> : <Ban size={16} />}
                {selectedArtwork.blocked ? 'Approve Artwork' : 'Flag as Inappropriate'}
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <Eye size={16} />
                View Full Resolution
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#D87C5A', color: 'white'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
              >
                <Plus size={16} />
                Contact Artist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'artwork', label: 'Artworks', icon: Image },
    { id: 'competition', label: 'Competitions', icon: Trophy },
    { id: 'marketplace', label: 'Marketplace', icon: Store }
  ];

  const renderContent = () => {
    // Reset search and filter when switching sections
    if (activeSection !== 'users') {
      if (searchTerm || filterStatus !== 'all') {
        setSearchTerm('');
        setFilterStatus('all');
      }
    }
    if (activeSection !== 'artwork') {
      if (artworkSearchTerm || artworkFilterStatus !== 'all') {
        setArtworkSearchTerm('');
        setArtworkFilterStatus('all');
      }
    }
    
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUserManagement();
      case 'artwork':
        return renderArtworkManagement();
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
                    // Add logout logic here
                    if (window.confirm('Are you sure you want to logout?')) {
                      // Handle logout
                      console.log('Logout clicked');
                      // You can add navigation logic here
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
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      activeSection === item.id
                        ? ''
                        : ''
                    }`}
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
        
        {/* Modals */}
        <UserModal />
        <ArtworkModal />
      </div>
    </>
  );
};

export default AdminDashboard;