import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Filter,
  Search,
  MessageSquare,
  User,
  Image,
  Flag,
  Calendar,
  ArrowUpDown
} from 'lucide-react';

const ComplaintsReports = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample complaints and reports data
  const complaints = [
    {
      id: 'RPT-001',
      type: 'artwork',
      category: 'inappropriate_content',
      title: 'Inappropriate Artwork Content',
      description: 'The artwork contains inappropriate content that violates community guidelines.',
      reportedBy: {
        name: 'Sachini Rathnayake',
        id: 'USR-1234',
        email: 'sachini.rathnayake@gmail.com'
      },
      reportedItem: {
        type: 'artwork',
        title: 'Modern Expression #5',
        artist: 'Kavinda Perera',
        artistId: 'ART-5678'
      },
      priority: 'high',
      status: 'pending',
      dateReported: '2024-12-20',
      assignedTo: 'MOD-001',
      evidence: ['screenshot1.jpg', 'screenshot2.jpg']
    },
    {
      id: 'RPT-002',
      type: 'user',
      category: 'harassment',
      title: 'User Harassment',
      description: 'User is sending inappropriate messages and harassing other community members.',
      reportedBy: {
        name: 'Nimali Fernando',
        id: 'USR-2345',
        email: 'nimali.fernando@yahoo.com'
      },
      reportedItem: {
        type: 'user',
        name: 'BadUser123',
        userId: 'USR-9999'
      },
      priority: 'critical',
      status: 'investigating',
      dateReported: '2024-12-19',
      assignedTo: 'MOD-002',
      evidence: ['message_log.txt']
    },
    {
      id: 'RPT-003',
      type: 'payment',
      category: 'payment_issue',
      title: 'Payment Not Received',
      description: 'Artist has not received payment for artwork sold 2 weeks ago.',
      reportedBy: {
        name: 'Ashen Jayawardena',
        id: 'ART-3456',
        email: 'ashen.jayawardena@outlook.com'
      },
      reportedItem: {
        type: 'transaction',
        transactionId: 'TXN-7890',
        amount: '$1,250.00'
      },
      priority: 'medium',
      status: 'pending',
      dateReported: '2024-12-18',
      assignedTo: 'ADM-001',
      evidence: ['receipt.pdf', 'email_thread.pdf']
    },
    {
      id: 'RPT-004',
      type: 'exhibition',
      category: 'fraud',
      title: 'Fraudulent Exhibition Entry',
      description: 'Suspicion of artwork plagiarism in exhibition submission.',
      reportedBy: {
        name: 'Malini Gunawardana',
        id: 'ART-4567',
        email: 'malini.gunawardana@hotmail.com'
      },
      reportedItem: {
        type: 'exhibition',
        title: 'Contemporary Sri Lankan Art 2024',
        exhibitionId: 'EXH-123'
      },
      priority: 'high',
      status: 'resolved',
      dateReported: '2024-12-15',
      assignedTo: 'MOD-003',
      resolution: 'Artwork removed from exhibition after investigation confirmed plagiarism.',
      resolvedDate: '2024-12-17'
    }
  ];

  const tabs = [
    { id: 'pending', label: 'Pending Reports', count: complaints.filter(c => c.status === 'pending').length },
    { id: 'investigating', label: 'Under Investigation', count: complaints.filter(c => c.status === 'investigating').length },
    { id: 'resolved', label: 'Resolved', count: complaints.filter(c => c.status === 'resolved').length },
    { id: 'all', label: 'All Reports', count: complaints.length }
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    investigating: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const getFilteredComplaints = () => {
    let filtered = complaints;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === activeTab);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === selectedPriority);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleAction = (complaintId, action) => {
    console.log(`${action} action for complaint ${complaintId}`);
    // Implement action logic here
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'artwork': return <Image size={16} />;
      case 'user': return <User size={16} />;
      case 'payment': return <MessageSquare size={16} />;
      case 'exhibition': return <Flag size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
          {/* Background Image */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Reports - documents/files
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="relative p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{color: '#8B4513'}}>Total Reports</p>
                <p className="text-2xl font-bold" style={{color: '#5D3A00'}}>{complaints.length}</p>
              </div>
              <AlertTriangle size={24} style={{color: '#D87C5A'}} />
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
          {/* Background Image */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Pending - clock/waiting
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="relative p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{color: '#8B4513'}}>Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
          {/* Background Image */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Critical - warning/alert
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="relative p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{color: '#8B4513'}}>Critical</p>
                <p className="text-2xl font-bold text-red-600">{complaints.filter(c => c.priority === 'critical').length}</p>
              </div>
              <Flag size={24} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1', borderColor: '#FFE4D6'}}>
          {/* Background Image */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Resolved - checkmark/success symbol
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="relative p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{color: '#8B4513'}}>Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints & Reports Management Heading */}
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-2" style={{color: '#5D3A00'}}>
        <AlertTriangle size={24} />
        Complaints & Reports Management ({complaints.filter(complaint => complaint.status === activeTab).length} {activeTab} reports)
      </h2>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div style={{borderBottom: '1px solid #FFE4D6'}}>
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                style={{
                  borderBottomColor: activeTab === tab.id ? '#5D3A00' : 'transparent',
                  color: activeTab === tab.id ? '#5D3A00' : '#D87C5A'
                }}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id ? 'bg-brown-100 text-brown-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-transparent rounded-lg py-1 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#8B4513'}} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
            />
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border rounded-md"
            style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
            style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
          >
            <option value="all">All Categories</option>
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="harassment">Harassment</option>
            <option value="payment_issue">Payment Issue</option>
            <option value="fraud">Fraud</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border" style={{borderColor: '#FFE4D6'}}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{backgroundColor: '#FFF5E1'}}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>
                  <div className="flex items-center gap-2">
                    Report ID
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Reported By</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Priority</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#5D3A00'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredComplaints().map((complaint) => (
                <tr key={complaint.id} className="border-b hover:bg-gray-50" style={{borderColor: '#FFE4D6'}}>
                  <td className="px-4 py-3 text-sm font-medium" style={{color: '#5D3A00'}}>
                    {complaint.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(complaint.type)}
                      <span className="text-sm capitalize" style={{color: '#8B4513'}}>
                        {complaint.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium truncate" style={{color: '#5D3A00'}}>
                        {complaint.title}
                      </p>
                      <p className="text-xs truncate" style={{color: '#8B4513'}}>
                        {complaint.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium" style={{color: '#5D3A00'}}>
                        {complaint.reportedBy.name}
                      </p>
                      <p className="text-xs" style={{color: '#8B4513'}}>
                        {complaint.reportedBy.id}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[complaint.priority]}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{color: '#8B4513'}}>
                    {complaint.dateReported}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button 
                        className="p-1 rounded-md text-white" 
                        style={{backgroundColor: '#5D3A00'}}
                        title="View Details"
                        onClick={() => handleAction(complaint.id, 'view')}
                      >
                        <Eye size={14} />
                      </button>
                      {complaint.status === 'pending' && (
                        <>
                          <button 
                            className="p-1 rounded-md text-white bg-green-600"
                            title="Approve"
                            onClick={() => handleAction(complaint.id, 'approve')}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            className="p-1 rounded-md text-white bg-red-600"
                            title="Reject"
                            onClick={() => handleAction(complaint.id, 'reject')}
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
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

export default ComplaintsReports;
