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
  Plus
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';
import  adminUserApi  from '../../services/adminUserApi';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { formatPrice } = useCurrency();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
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
          setShowConfirmPopup(false);
          setConfirmAction(null);
        } catch (err) {
          setError('Failed to update user status.');
          setShowConfirmPopup(false);
          setConfirmAction(null);
        }
      },
      onCancel: () => {
        setShowConfirmPopup(false);
        setConfirmAction(null);
      }
    });
    setShowConfirmPopup(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === 'all' || user.status?.toLowerCase() === filterStatus.toLowerCase();
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

  // User Details Modal
  const UserModal = () => {
    if (!showUserModal || !selectedUser) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
          <div className="p-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3" style={{color: '#5D3A00'}}>Personal Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span> 
                    <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span> 
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span> 
                    <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                      backgroundColor: selectedUser.userType === 'artist' ? '#FFE4D6' : selectedUser.userType === 'moderator' ? '#FFD95A' : selectedUser.userType === 'buyer' ? '#E8F5E8' : '#FFF5E1',
                      color: '#5D3A00'
                    }}>
                      {selectedUser.userType}
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
                    <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  {selectedUser.userType === 'artist' && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Views:</span> 
                        <span className="font-bold" style={{color: '#D87C5A'}}>{selectedUser.totalViews || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Followers:</span> 
                        <span className="font-bold" style={{color: '#D87C5A'}}>{selectedUser.totalFollowers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Sales:</span> 
                        <span className="font-bold" style={{color: '#D87C5A'}}>{selectedUser.totalSales || 0}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Account Status:</span> 
                    <span className={selectedUser.status === 'Suspended' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                      {selectedUser.status === 'Suspended' ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <X size={16} />
                Back
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

  // Confirmation Popup Component
  const ConfirmationPopup = () => {
    if (!showConfirmPopup || !confirmAction) return null;

    const isBlocking = confirmAction.type === 'block';
    const actionColor = isBlocking ? '#E74C3C' : '#27AE60';
    const iconBgColor = isBlocking ? '#F1948A' : '#82E0AA';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{color: '#5D3A00'}}>
                {isBlocking ? 'Block User' : 'Unblock User'}
              </h3>
              <button
                onClick={confirmAction.onCancel}
                className="p-2 rounded-lg transition-colors"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Header with Icon */}
            <div className="flex items-center justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor }}
              >
                {isBlocking ? (
                  <UserX size={32} style={{ color: actionColor }} />
                ) : (
                  <UserCheck size={32} style={{ color: actionColor }} />
                )}
              </div>
            </div>

            {/* User Info */}
            <div 
              className="rounded-lg p-3 mb-4"
              style={{ backgroundColor: '#FFF5E1', border: '1px solid #FFE4D6' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#D87C5A' }}
                >
                  {confirmAction.user?.firstName?.charAt(0)}{confirmAction.user?.lastName?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium" style={{ color: '#5D3A00' }}>
                    {confirmAction.user?.firstName} {confirmAction.user?.lastName}
                  </div>
                  <div className="text-sm" style={{ color: '#D87C5A' }}>
                    {confirmAction.user?.email}
                  </div>
                  <span 
                    className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                    style={{
                      backgroundColor: confirmAction.user?.userType === 'artist' ? '#FFE4D6' : 
                                     confirmAction.user?.userType === 'moderator' ? '#FFD95A' : 
                                     confirmAction.user?.userType === 'buyer' ? '#E8F5E8' : '#FFF5E1',
                      color: '#5D3A00'
                    }}
                  >
                    {confirmAction.user?.userType}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="mb-6">
              <p className="text-center mb-2" style={{ color: '#5D3A00' }}>
                Are you sure you want to{' '}
                <span className="font-semibold" style={{ color: actionColor }}>
                  {confirmAction.type}
                </span>{' '}
                this user?
              </p>
              <p className="text-center text-sm" style={{ color: '#666' }}>
                {isBlocking 
                  ? 'They will no longer be able to access their account.' 
                  : 'They will regain access to their account.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={confirmAction.onCancel}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={confirmAction.onConfirm}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-white flex items-center gap-2"
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
      </div>
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
            User Management ({filteredUsers.length} users)
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
          </div>
        </div>

        {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden users-table">
            <div className="overflow-x-auto">
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
                <table className="w-full">
            <thead style={{ backgroundColor: '#FFF5E1' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Artworks</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Revenue/Spent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{color: '#5D3A00'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.userId} className={`user-row ${index % 2 === 0 ? 'bg-white' : ''}`} style={{backgroundColor: index % 2 === 1 ? '#FFF5E1' : 'white'}}>
            <td className="px-6 py-4">
              <div>
                <div className="font-medium" style={{color: '#5D3A00'}}>{user.firstName} {user.lastName}</div>
                <div className="text-sm" style={{color: '#D87C5A'}}>{user.email}</div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>
              <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                backgroundColor: user.userType === 'artist' ? '#FFE4D6' : user.userType === 'moderator' ? '#FFD95A' : user.userType === 'buyer' ? '#E8F5E8' : '#FFF5E1',
                color: '#5D3A00'
              }}>
                {user.userType}
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
            <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
            <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>
            <span className="font-medium">
              {user.userType === 'artist' ? (user.total_artworks || 0) : '-'}
            </span>

            </td>
            <td className="px-6 py-4 text-sm" style={{color: '#5D3A00'}}>
                <div>
            <div className="font-medium" style={{color: '#D87C5A'}}>
              {formatPrice(user.userType === 'artist' ? (user.revenue || 0) : (user.spent || 0), "LKR")}
            </div>
            <div className="text-xs opacity-75">
              {user.userType === 'artist' ? (user.totalSales || 0) : (user.totalPurchases || 0)} {user.userType === 'artist' ? "sales" : "purchases"}
            </div>
                </div>
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
                            {user.status === 'Suspended' ? <UserCheck size={16} /> : <UserX size={16} />}
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
            )}
          </div>
        </div>

        {/* User Details Modal */}
        <UserModal />

        {/* Confirmation Popup */}
        <ConfirmationPopup />
      </div>
    </>
  );
};

export default UsersManagement;