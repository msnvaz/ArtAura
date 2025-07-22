import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  ShieldAlert,
  MoreVertical,
  X,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';
import adminUserApi from '../../services/adminUserApi';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandType, setExpandType] = useState(null); // 'details' or 'confirm'
  const { formatPrice } = useCurrency();
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // API state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1) : undefined
      };
      const response = await adminUserApi.getAllUsers(filters);
      // Flatten response if paginated
      setUsers(response.users || response.content || []);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterStatus]);

  const handleBlockUser = async (userId, userType, status) => {
    const newStatus = status === 'Suspended' ? 'Active' : 'Suspended';
    const actionText = newStatus === 'Suspended' ? 'block' : 'unblock';
    const user = users.find(u => u.userId === userId);
    
    setConfirmAction({
      type: actionText,
      user: user,
      onConfirm: async () => {
        try {
          const result = await adminUserApi.updateUserStatus(userId, userType, newStatus);
          if (result.success) {
            setUsers(prevUsers =>
              prevUsers.map(u =>
                u.userId === userId ? { ...u, ...result.user, status: newStatus } : u
              )
            );
            if (selectedUser && selectedUser.userId === userId && result.user) {
              setSelectedUser({ ...selectedUser, ...result.user, status: newStatus });
            }
          }
          setExpandedRow(null);
          setExpandType(null);
          setConfirmAction(null);
        } catch (err) {
          setError('Failed to update user status.');
          setExpandedRow(null);
          setExpandType(null);
          setConfirmAction(null);
        }
      },
      onCancel: () => {
        setExpandedRow(null);
        setExpandType(null);
        setConfirmAction(null);
      }
    });
    setExpandedRow(userId);
    setExpandType('confirm');
    setSelectedUser(user);
  };

  const handleViewDetails = (user) => {
    if (expandedRow === user.userId && expandType === 'details') {
      setExpandedRow(null);
      setExpandType(null);
      setSelectedUser(null);
    } else {
      setExpandedRow(user.userId);
      setExpandType('details');
      setSelectedUser(user);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === 'all' || user.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesType =
      filterType === 'all' || user.userType?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
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

  // Toggle Switch Component
  const TypeToggleSwitch = () => {
    const types = ['all', 'artist', 'buyer', 'shop', 'moderator'];
    
    return (
      <div className="flex items-center gap-2 bg-white rounded-lg p-1 border" style={{borderColor: '#FFE4D6'}}>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              filterType === type 
                ? 'text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              backgroundColor: filterType === type ? '#D87C5A' : 'transparent',
              transform: filterType === type ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  // User Details Row Component
  const UserDetailsRow = ({ user }) => {
    if (!user) return null;
    
    return (
      <tr>
        <td colSpan="7" className="px-0 py-0">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 mx-4 my-2 rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
                  <User size={20} />
                  User Details
                </h3>
                <button
                  onClick={() => {setExpandedRow(null); setExpandType(null); setSelectedUser(null);}}
                  className="p-2 rounded-lg transition-colors"
                  style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
                >
                  <ChevronUp size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Personal Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span> 
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span> 
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span> 
                      <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                        backgroundColor: user.userType === 'artist' ? '#FFE4D6' : user.userType === 'moderator' ? '#FFD95A' : user.userType === 'buyer' ? '#E8F5E8' : user.userType === 'shop' ? '#E3F2FD' : '#FFF5E1',
                        color: '#5D3A00'
                      }}>
                        {user.userType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active' ? 'text-green-800 bg-green-100' :
                        user.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                        'text-red-800 bg-red-100'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Activity & Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Join Date:</span> 
                      <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    {user.userType === 'artist' && (
                      <>
                        <div className="flex justify-between">
                          <span className="font-medium">Total Views:</span> 
                          <span className="font-bold" style={{color: '#D87C5A'}}>{user.totalViews || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Total Followers:</span> 
                          <span className="font-bold" style={{color: '#D87C5A'}}>{user.totalFollowers || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Total Sales:</span> 
                          <span className="font-bold" style={{color: '#D87C5A'}}>{user.totalSales || 0}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Account Status:</span> 
                      <span className={user.status === 'Suspended' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {user.status === 'Suspended' ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {setExpandedRow(null); setExpandType(null); setSelectedUser(null);}}
                  className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
                >
                  <ChevronUp size={16} />
                  Collapse
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
        </td>
      </tr>
    );
  };

  // Confirmation Row Component
  const ConfirmationRow = ({ action }) => {
    if (!action) return null;

    const isBlocking = action.type === 'block';
    const actionColor = isBlocking ? '#E74C3C' : '#27AE60';
    const bgColor = isBlocking ? 'from-red-50 to-pink-50' : 'from-green-50 to-emerald-50';
    const borderColor = isBlocking ? 'border-red-400' : 'border-green-400';

    return (
      <tr>
        <td colSpan="7" className="px-0 py-0">
          <div className={`bg-gradient-to-r ${bgColor} border-l-4 ${borderColor} mx-4 my-2 rounded-lg`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
                  {isBlocking ? <UserX size={20} /> : <UserCheck size={20} />}
                  {isBlocking ? 'Block User' : 'Unblock User'}
                </h3>
                <button
                  onClick={action.onCancel}
                  className="p-2 rounded-lg transition-colors"
                  style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
                >
                  <ChevronUp size={16} />
                </button>
              </div>

              <div className="mb-6">
                <p className="mb-2" style={{ color: '#5D3A00' }}>
                  Are you sure you want to{' '}
                  <span className="font-semibold" style={{ color: actionColor }}>
                    {action.type}
                  </span>{' '}
                  <span className="font-semibold">this user</span>?
                </p>
                <p className="text-sm" style={{ color: '#666' }}>
                  {isBlocking 
                    ? 'They will no longer be able to access their account.' 
                    : 'They will regain access to their account.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={action.onCancel}
                  className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={action.onConfirm}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-white flex items-center gap-2"
                  style={{ backgroundColor: actionColor }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = isBlocking ? '#C0392B' : '#229954';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = `0 4px 12px ${actionColor}40`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = actionColor;
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isBlocking ? <UserX size={16} /> : <UserCheck size={16} />}
                  {isBlocking ? 'Block User' : 'Unblock User'}
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      {/* Add smooth animations */}
      <style jsx>{`
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

        .users-container {
          animation: smoothFadeIn 0.4s ease-out;
        }

        .users-stats {
          animation: slideInUp 0.5s ease-out 0.1s both;
        }

        .users-header {
          animation: slideInUp 0.5s ease-out 0.2s both;
        }

        .users-filters {
          animation: slideInUp 0.5s ease-out 0.3s both;
        }

        .users-table {
          animation: slideInUp 0.5s ease-out 0.4s both;
        }

        .user-stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .user-row {
          transition: all 0.2s ease;
        }

        .user-row:hover {
          background-color: rgba(255, 228, 214, 0.3) !important;
        }
      `}</style>

      <div className="space-y-4 users-container">
        {/* User Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 users-stats">
          {userStats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden user-stat-card" style={{backgroundColor: '#FFF5E1'}}>
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
              <div className="p-3 relative z-10">
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

        {/* User Management Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 users-header">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
            <Users size={24} />
            Users ({filteredUsers.length} users)
          </h2>
          <CurrencySelector className="flex-shrink-0" />
        </div>

        {/* Search and Filters */}
        <div className="bg-transparent rounded-lg py-1 px-4 users-filters">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-full sm:w-64"
                style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none w-full sm:w-auto"
                style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <TypeToggleSwitch />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden users-table">
          <div className="overflow-x-auto min-w-full">
            {loading ? (
              <div className="p-8 text-center" style={{ color: '#D87C5A' }}>
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Loading users...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center" style={{ color: '#D87C5A' }}>
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">{error}</p>
                <p className="text-sm">Try again later</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center" style={{ color: '#D87C5A' }}>
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No users found</p>
                <p className="text-sm">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <table className="w-full min-w-max">
                <thead style={{ backgroundColor: '#FFF5E1' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>User</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>Type</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>Status</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>Join Date</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>Artworks</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>Revenue/Spent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap" style={{color: '#5D3A00'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <React.Fragment key={user.userId}>
                      <tr className={`user-row ${index % 2 === 0 ? 'bg-white' : ''} ${expandedRow === user.userId ? 'border-b-0' : ''}`} style={{backgroundColor: index % 2 === 1 ? '#FFF5E1' : 'white'}}>
                        <td className="px-4 py-4 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate" style={{color: '#5D3A00'}}>{user.firstName} {user.lastName}</div>
                            <div className="text-sm truncate" style={{color: '#D87C5A'}}>{user.email}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap" style={{color: '#5D3A00'}}>
                          <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                            backgroundColor: user.userType === 'artist' ? '#FFE4D6' : user.userType === 'moderator' ? '#FFD95A' : user.userType === 'buyer' ? '#E8F5E8' : user.userType === 'shop' ? '#E3F2FD' : '#FFF5E1',
                            color: '#5D3A00'
                          }}>
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'Active' ? 'text-green-800 bg-green-100' :
                            user.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                            'text-red-800 bg-red-100'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap" style={{color: '#5D3A00'}}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                        <td className="px-3 py-4 text-sm text-center whitespace-nowrap" style={{color: '#5D3A00'}}>
                          <span className="font-medium">
                            {user.userType === 'artist' ? (user.total_artworks || 0) : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap" style={{color: '#5D3A00'}}>
                          <div className="text-center">
                            <div className="font-medium" style={{color: '#D87C5A'}}>
                              {formatPrice(user.userType === 'artist' ? (user.revenue || 0) : (user.spent || 0), "LKR")}
                            </div>
                            <div className="text-xs opacity-75">
                              {user.userType === 'artist' ? (user.totalSales || 0) : (user.totalPurchases || 0)} {user.userType === 'artist' ? "sales" : "purchases"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="p-2 rounded-lg transition-colors"
                              style={{backgroundColor: expandedRow === user.userId && expandType === 'details' ? '#FFD95A' : '#FFE4D6', color: '#5D3A00'}}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#FFD95A';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = expandedRow === user.userId && expandType === 'details' ? '#FFD95A' : '#FFE4D6';
                                e.target.style.transform = 'scale(1)';
                              }}
                              title="View Details"
                            >
                              {expandedRow === user.userId && expandType === 'details' ? <ChevronUp size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              onClick={() => handleBlockUser(user.userId, user.userType, user.status)}
                              className={`p-2 rounded-lg transition-all ${
                                user.status === 'Suspended' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                              onMouseOver={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'scale(1)';
                              }}
                              title={user.status === 'Suspended' ? 'Unblock User' : 'Block User'}
                            >
                              {user.status === 'Suspended' ? <UserCheck size={14} /> : <UserX size={14} />}
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
                              <MoreVertical size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded Row Content */}
                      {expandedRow === user.userId && expandType === 'details' && (
                        <UserDetailsRow user={selectedUser} />
                      )}
                      {expandedRow === user.userId && expandType === 'confirm' && (
                        <ConfirmationRow action={confirmAction} />
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersManagement;