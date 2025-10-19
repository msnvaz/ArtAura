import axios from 'axios';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  Eye,
  Filter,
  MapPin,
  Search,
  Shield,
  User,
  X,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const VerificationList = () => {
  const { token } = useAuth();
  
  // State for exhibitions data
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // State for status update feedback
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Fetch exhibitions from API
  useEffect(() => {
    fetchExhibitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExhibitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/exhibitions`;
      console.log('🔍 Fetching exhibitions from:', apiUrl);
      console.log('🔑 Using token:', token ? 'Yes' : 'No');
      
      const response = await axios.get(apiUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      console.log('✅ Fetched exhibitions successfully:', response.data);
      console.log('📊 Total exhibitions:', response.data.length);
      
      // Map the database fields to component fields
      const mappedExhibitions = response.data.map((exhibition, index) => {
        try {
          return {
            id: exhibition.exhibitionId || exhibition.id,
            title: exhibition.title,
            description: exhibition.description,
            organizer: exhibition.organizer || 'Not specified',
            organizerEmail: exhibition.contact_email || exhibition.contactEmail || 'Not provided',
            venue: exhibition.location || 'Not specified',
            address: exhibition.location || 'Not specified',
            startDate: exhibition.start_date || exhibition.startDate || 'TBD',
            endDate: exhibition.end_date || exhibition.endDate || 'TBD',
            startTime: exhibition.start_time || exhibition.startTime || '',
            endTime: exhibition.end_time || exhibition.endTime || '',
            submissionDate: exhibition.created_at || exhibition.createdAt || new Date().toISOString(),
            createdBy: exhibition.created_by || exhibition.createdBy || null,
            status: mapStatus(exhibition.status),
            category: exhibition.category || 'General',
            maxParticipants: exhibition.artworksCount || exhibition.max_participants || exhibition.maxParticipants || 0,
            expectedVisitors: exhibition.artworksCount || exhibition.max_participants || exhibition.maxParticipants || 0,
            artworksCount: exhibition.artworksCount || exhibition.max_participants || exhibition.maxParticipants || 0,
            entryFee: exhibition.entry_fee || exhibition.entryFee,
            contactPhone: exhibition.contact_phone || exhibition.contactPhone || 'Not provided',
            requirements: exhibition.requirements || null,
            likes: exhibition.likes || 0,
            verificationNotes: getVerificationNotes(exhibition.status),
            verifiedBy: exhibition.status === 'verified' ? 'Moderator' : null,
            verificationDate: exhibition.status === 'verified' && exhibition.created_at 
              ? (new Date(exhibition.created_at).toString() !== 'Invalid Date' 
                ? new Date(exhibition.created_at).toISOString().split('T')[0] 
                : null) 
              : null,
            rejectionReason: exhibition.status === 'rejected' ? exhibition.requirements : null,
            documents: [
              { name: 'Venue Permission', status: exhibition.status === 'verified' ? 'verified' : 'pending' },
              { name: 'Artist Agreements', status: exhibition.status === 'verified' ? 'verified' : 'pending' }
            ]
          };
        } catch (mapError) {
          console.warn(`⚠️ Error mapping exhibition at index ${index}:`, mapError);
          console.warn('Exhibition data:', exhibition);
          // Return a basic version if mapping fails
          return {
            id: exhibition.exhibitionId || exhibition.id || index,
            title: exhibition.title || 'Unknown Exhibition',
            description: exhibition.description || '',
            organizer: exhibition.organizer || 'Not specified',
            organizerEmail: exhibition.contact_email || 'N/A',
            venue: exhibition.location || 'N/A',
            address: exhibition.location || 'N/A',
            startDate: exhibition.start_date || 'TBD',
            endDate: exhibition.end_date || 'TBD',
            startTime: exhibition.start_time || null,
            endTime: exhibition.end_time || null,
            submissionDate: exhibition.created_at || null,
            status: mapStatus(exhibition.status || 'pending'),
            category: exhibition.category || 'General',
            expectedVisitors: exhibition.artworksCount || exhibition.max_participants || 0,
            artworksCount: exhibition.artworksCount || exhibition.max_participants || 0,
            maxParticipants: exhibition.artworksCount || exhibition.max_participants || 0,
            entryFee: exhibition.entry_fee || 'Free',
            contactPhone: exhibition.contact_phone || 'Not provided',
            requirements: exhibition.requirements || null,
            likes: exhibition.likes || 0,
            verificationNotes: 'Pending review.',
            verifiedBy: null,
            verificationDate: null,
            rejectionReason: null,
            documents: [
              { name: 'Venue Permission', status: 'pending' },
              { name: 'Artist Agreements', status: 'pending' }
            ]
          };
        }
      });
      
      setExhibitions(mappedExhibitions);
      console.log('✨ Mapped exhibitions:', mappedExhibitions);
    } catch (err) {
      console.error('❌ Error fetching exhibitions:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error message:', err.message);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Exhibition endpoint not found. Please check backend configuration.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the backend is running on http://localhost:8081');
      } else {
        setError(`Failed to load exhibitions: ${err.response?.data || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Map database status to component status
  const mapStatus = (dbStatus) => {
    const statusMap = {
      'pending': 'pending',
      'verified': 'approved',
      'rejected': 'rejected',
      'approved': 'approved'
    };
    return statusMap[dbStatus.toLowerCase()] || 'pending';
  };

  // Get verification notes based on status
  const getVerificationNotes = (status) => {
    const notes = {
      'pending': 'Under review. Awaiting final verification.',
      'verified': 'All documentation verified. Exhibition approved.',
      'rejected': 'Exhibition has been rejected. Check rejection reason for details.',
      'approved': 'Exhibition has been approved and verified.'
    };
    return notes[status.toLowerCase()] || 'Pending review.';
  };

  const handleStatusChange = async (exhibitionId, newStatus, reason = '') => {
    try {
      setUpdating(true);
      setError(null);
      
      // Map component status back to database status
      const dbStatus = newStatus === 'approved' ? 'verified' : newStatus;
      
      console.log(`🔄 Updating exhibition ${exhibitionId} status to ${dbStatus}`);
      
      // API call to update exhibition status
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exhibitions/${exhibitionId}/status`,
        {
          status: dbStatus,
          reason: reason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Status updated successfully:', response.data);

      // Update local state to reflect the change immediately
      setExhibitions(prev => prev.map(exhibition => 
        exhibition.id === exhibitionId 
          ? { 
              ...exhibition, 
              status: newStatus,
              verificationDate: new Date().toISOString().split('T')[0],
              verifiedBy: 'Current Moderator',
              verificationNotes: newStatus === 'approved' 
                ? 'All documentation verified. Exhibition approved.' 
                : newStatus === 'rejected'
                ? 'Exhibition has been rejected. Check rejection reason for details.'
                : exhibition.verificationNotes,
              ...(newStatus === 'rejected' && reason && { rejectionReason: reason })
            }
          : exhibition
      ));

      // Show success message
      setUpdateSuccess(true);
      setUpdateMessage(
        newStatus === 'approved' 
          ? '✅ Exhibition approved successfully!' 
          : '❌ Exhibition rejected successfully!'
      );

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
        setUpdateMessage('');
      }, 3000);

      console.log(`✅ Exhibition ${exhibitionId} status changed to ${newStatus}`);
      if (reason) console.log(`📝 Reason: ${reason}`);
      
    } catch (err) {
      console.error('❌ Error updating exhibition status:', err);
      console.error('❌ Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Exhibition not found.');
      } else {
        setError(`Failed to update exhibition status: ${err.response?.data || err.message}`);
      }
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const matchesSearch = 
      exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exhibition.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getExhibitionStats = () => {
    return {
      total: exhibitions.length,
      pending: exhibitions.filter(e => e.status === 'pending').length,
      approved: exhibitions.filter(e => e.status === 'approved').length,
      rejected: exhibitions.filter(e => e.status === 'rejected').length
    };
  };

  const stats = getExhibitionStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading exhibitions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{color: '#5D3A00'}}>Verification Management</h2>
      
      {/* Success Message */}
      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{updateMessage}</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exhibitions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Approved</p>
              <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exhibitions, organizers, or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exhibitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitions.map(exhibition => (
          <div key={exhibition.id} className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${getStatusColor(exhibition.status)}`}>
            {/* Header with Status Badge */}
            <div className="p-4 border-b border-gray-100" style={{backgroundColor: '#FFF5E1'}}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(exhibition.status)}
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(exhibition.status)}`}>
                    {exhibition.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-500">ID: {exhibition.id}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{exhibition.title}</h3>
            </div>

            {/* Body Content */}
            <div className="p-4 space-y-3">
              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{exhibition.description}</p>
              
              {/* Category Badge */}
              {exhibition.category && (
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{backgroundColor: '#FFD95A', color: '#5D3A00'}}>
                  {exhibition.category}
                </div>
              )}

              {/* Key Information */}
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-sm">
                  <Calendar size={16} className="text-[#D87C5A] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {exhibition.startDate} to {exhibition.endDate}
                    </div>
                    {(exhibition.startTime || exhibition.endTime) && (
                      <div className="text-gray-500 text-xs mt-0.5">
                        {exhibition.startTime && `🕐 ${exhibition.startTime}`}
                        {exhibition.startTime && exhibition.endTime && ' - '}
                        {exhibition.endTime && exhibition.endTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={16} className="text-[#D87C5A] flex-shrink-0" />
                  <span className="font-medium">{exhibition.organizer}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-[#D87C5A] mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{exhibition.venue || exhibition.address}</span>
                </div>
              </div>

              {/* Additional Info Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 font-medium">Entry Fee</div>
                  <div className="text-sm font-bold text-gray-900">
                    {exhibition.entryFee ? `${exhibition.entryFee}` : 'Free'}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 font-medium">Max Participants</div>
                  <div className="text-sm font-bold text-gray-900">
                    {exhibition.maxParticipants || exhibition.expectedVisitors || 0}
                  </div>
                </div>
              </div>

              {/* Contact Info Preview */}
              {(exhibition.contactPhone || exhibition.organizerEmail) && (
                <div className="text-xs text-gray-500 space-y-1 pt-2">
                  {exhibition.contactPhone && (
                    <div className="flex items-center gap-1">
                      📞 {exhibition.contactPhone}
                    </div>
                  )}
                  {exhibition.organizerEmail && (
                    <div className="flex items-center gap-1 truncate">
                      ✉️ {exhibition.organizerEmail}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setSelectedExhibition(exhibition);
                  setShowDetailsModal(true);
                }}
                className="w-full py-2 px-4 bg-gradient-to-r from-[#D87C5A] to-[#c4664a] text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                View Full Details
              </button>
            </div>

            {/* Rejection Notice */}
            {exhibition.status === 'rejected' && exhibition.rejectionReason && (
              <div className="mx-4 mb-4 p-3 text-xs bg-red-50 border border-red-200 rounded-lg">
                <strong className="text-red-800">❌ Rejection Reason:</strong>
                <p className="text-red-700 mt-1">{exhibition.rejectionReason}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredExhibitions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exhibitions found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No exhibitions have been submitted yet.'}
          </p>
        </div>
      )}

      {/* Exhibition Details Modal */}
      {showDetailsModal && selectedExhibition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full h-[95vh] flex flex-col shadow-2xl">
            {/* Compact Header - Fixed at top */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FFE8D6] to-white">
              <div className="flex justify-between items-center">
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedExhibition.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      by {selectedExhibition.organizer} • ID: #{selectedExhibition.id}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${
                    selectedExhibition.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedExhibition.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStatusIcon(selectedExhibition.status)}
                    {selectedExhibition.status}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area with better spacing */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {/* Description - Compact */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    📄 Description
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{selectedExhibition.description}</p>
                </div>

                {/* Two Column Layout for Compact View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Schedule - Compact */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Schedule
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-medium">Start:</span>
                          <span className="text-sm font-bold text-blue-900">
                            {selectedExhibition.startDate} {selectedExhibition.startTime && `• ${selectedExhibition.startTime}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-medium">End:</span>
                          <span className="text-sm font-bold text-red-900">
                            {selectedExhibition.endDate} {selectedExhibition.endTime && `• ${selectedExhibition.endTime}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location - Compact */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        Location
                      </h4>
                      <p className="text-sm text-gray-700">{selectedExhibition.venue || selectedExhibition.address}</p>
                    </div>

                    {/* Category - Compact */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Category</h4>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        🎨 {selectedExhibition.category}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Stats - Compact Grid */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Key Stats</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl mb-1">👥</div>
                          <p className="text-xs text-gray-600 mb-1">Participants</p>
                          <p className="text-lg font-bold text-green-900">{selectedExhibition.maxParticipants || 0}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="text-2xl mb-1">💰</div>
                          <p className="text-xs text-gray-600 mb-1">Entry Fee</p>
                          <p className="text-sm font-bold text-purple-900">
                            {selectedExhibition.entryFee ? `${selectedExhibition.entryFee}` : 'Free'}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-pink-50 rounded-lg border border-pink-200">
                          <div className="text-2xl mb-1">❤️</div>
                          <p className="text-xs text-gray-600 mb-1">Likes</p>
                          <p className="text-lg font-bold text-pink-900">{selectedExhibition.likes || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact - Compact */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <User className="h-4 w-4 text-orange-600" />
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">✉️ Email</p>
                          <p className="text-sm text-gray-900 font-medium break-all">{selectedExhibition.organizerEmail}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">📞 Phone</p>
                          <p className="text-sm text-gray-900 font-medium">{selectedExhibition.contactPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Submission Info - Compact */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Submission</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-bold text-gray-900">
                          {selectedExhibition.submissionDate && new Date(selectedExhibition.submissionDate).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedExhibition.createdBy && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-600">User ID:</span>
                          <span className="font-bold text-gray-900">#{selectedExhibition.createdBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requirements - Expandable if exists */}
                {selectedExhibition.requirements && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      Requirements
                    </h4>
                    <p className="text-sm text-gray-700 line-clamp-2">{selectedExhibition.requirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer with Actions */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
              {selectedExhibition.status === 'pending' ? (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={async () => {
                      if (updating) return;
                      await handleStatusChange(selectedExhibition.id, 'approved');
                      setShowDetailsModal(false);
                    }}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Approve Exhibition
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (updating) return;
                      const reason = prompt('Please provide a reason for rejection:');
                      if (reason && reason.trim()) {
                        handleStatusChange(selectedExhibition.id, 'rejected', reason);
                        setShowDetailsModal(false);
                      } else if (reason !== null) {
                        alert('Rejection reason is required.');
                      }
                    }}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <X size={18} />
                        Reject Exhibition
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className={`text-sm font-medium ${
                    selectedExhibition.status === 'approved' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {selectedExhibition.verifiedBy && selectedExhibition.verificationDate && (
                      <span>
                        Verified by {selectedExhibition.verifiedBy} on {selectedExhibition.verificationDate}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationList;
