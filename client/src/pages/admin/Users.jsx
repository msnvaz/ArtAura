import React, { useState } from 'react';
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

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

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

  const handleBlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        blocked: !user.blocked, 
        status: user.blocked ? 'Active' : 'Suspended' 
      } : user
    ));
  };

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
                      backgroundColor: selectedUser.type === 'Artist' ? '#FFE4D6' : selectedUser.type === 'Admin' ? '#FFD95A' : selectedUser.type === 'Collector' ? '#E8F5E8' : '#FFF5E1',
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
                      backgroundColor: user.type === 'Artist' ? '#FFE4D6' : user.type === 'Admin' ? '#FFD95A' : user.type === 'Collector' ? '#E8F5E8' : '#FFF5E1',
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

      {/* User Details Modal */}
      <UserModal />
    </div>
  );
};

export default UsersManagement;
