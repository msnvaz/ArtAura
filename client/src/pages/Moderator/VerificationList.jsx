import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle,
    Eye,
    FileText,
    Filter,
    MapPin,
    Search,
    Shield,
    User,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

  // Mock data for exhibitions (would be fetched from API)
  const mockExhibitions = [
    {
      id: 1,
      title: 'Traditional Sri Lankan Art Exhibition',
      description: 'Celebrating the rich heritage of traditional Sri Lankan art forms including paintings, sculptures, and handicrafts.',
      organizer: 'Kumari Perera',
      organizerEmail: 'kumari.perera@heritage.lk',
      venue: 'National Museum Auditorium',
      address: 'Sir Marcus Fernando Mawatha, Colombo 07',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      submissionDate: '2024-07-28',
      status: 'pending',
      category: 'Traditional Art',
      expectedVisitors: 800,
      artworksCount: 120,
      entryFee: 'LKR 500',
      contactPhone: '+94 76 456 7890',
      website: 'www.srilankanheritage.lk',
      verificationNotes: 'Under review. Awaiting final venue confirmation.',
      documents: [
        { name: 'Venue Permission', status: 'pending' },
        { name: 'Safety Certificate', status: 'verified' },
        { name: 'Insurance Policy', status: 'verified' },
        { name: 'Artist Agreements', status: 'pending' }
      ]
    },
    {
      id: 2,
      title: 'Young Artists Collective 2024',
      description: 'A platform for emerging young artists to showcase their innovative works and connect with art enthusiasts.',
      organizer: 'Nimesh Fernando',
      organizerEmail: 'nimesh@youngartists.lk',
      venue: 'Barefoot Gallery',
      address: '704 Galle Road, Colombo 03',
      startDate: '2024-08-25',
      endDate: '2024-09-05',
      submissionDate: '2024-07-30',
      status: 'pending',
      category: 'Mixed Media',
      expectedVisitors: 400,
      artworksCount: 60,
      entryFee: 'Free',
      contactPhone: '+94 75 234 5678',
      website: 'www.youngartistscollective.lk',
      verificationNotes: 'New submission. Initial review in progress.',
      documents: [
        { name: 'Venue Permission', status: 'verified' },
        { name: 'Safety Certificate', status: 'verified' },
        { name: 'Insurance Policy', status: 'pending' },
        { name: 'Artist Agreements', status: 'verified' }
      ]
    },
    {
      id: 3,
      title: 'Contemporary Sculpture Exhibition',
      description: 'An innovative showcase of contemporary sculpture featuring works by established and emerging artists from across Sri Lanka.',
      organizer: 'Arjuna Dissanayake',
      organizerEmail: 'arjuna.dissanayake@artspace.lk',
      venue: 'Gallery Cafe Colombo',
      address: '2 Alfred House Road, Colombo 03',
      startDate: '2024-07-15',
      endDate: '2024-08-15',
      submissionDate: '2024-06-10',
      status: 'approved',
      category: 'Contemporary Art',
      expectedVisitors: 600,
      artworksCount: 35,
      entryFee: 'LKR 300',
      contactPhone: '+94 77 345 6789',
      website: 'www.contemporarysculpture.lk',
      verificationNotes: 'All documentation verified. Excellent venue facilities and safety measures in place.',
      verifiedBy: 'Senior Moderator',
      verificationDate: '2024-06-18',
      documents: [
        { name: 'Venue Permission', status: 'verified' },
        { name: 'Safety Certificate', status: 'verified' },
        { name: 'Insurance Policy', status: 'verified' },
        { name: 'Artist Agreements', status: 'verified' }
      ]
    },
    {
      id: 4,
      title: 'Street Art & Graffiti Festival',
      description: 'Urban art festival celebrating street art, graffiti, and contemporary urban culture with live painting sessions.',
      organizer: 'Malik Rahman',
      organizerEmail: 'malik.rahman@streetart.org',
      venue: 'Urban Park Community Center',
      address: '45 Baseline Road, Colombo 09',
      startDate: '2024-08-01',
      endDate: '2024-08-03',
      submissionDate: '2024-07-05',
      status: 'rejected',
      category: 'Street Art',
      expectedVisitors: 1000,
      artworksCount: 50,
      entryFee: 'Free',
      contactPhone: '+94 71 567 8901',
      website: 'www.streetartfest.lk',
      verificationNotes: 'Venue lacks adequate security arrangements for large crowds. Insurance coverage insufficient for outdoor activities.',
      verifiedBy: 'Safety Moderator',
      verificationDate: '2024-07-12',
      rejectionReason: 'Inadequate security arrangements and insufficient insurance coverage for outdoor activities',
      documents: [
        { name: 'Venue Permission', status: 'verified' },
        { name: 'Safety Certificate', status: 'missing' },
        { name: 'Insurance Policy', status: 'pending' },
        { name: 'Artist Agreements', status: 'verified' }
      ]
    },
    {
      id: 5,
      title: 'Photography Exhibition: Ceylon Through Lens',
      description: 'A stunning collection of photographs capturing the beauty and diversity of Sri Lankan landscapes, culture, and people.',
      organizer: 'Sandamali Wickramasinghe',
      organizerEmail: 'sandamali@ceylonlens.photography',
      venue: 'Lionel Wendt Art Centre',
      address: '18 Guildford Crescent, Colombo 07',
      startDate: '2024-09-10',
      endDate: '2024-10-10',
      submissionDate: '2024-07-25',
      status: 'approved',
      category: 'Photography',
      expectedVisitors: 750,
      artworksCount: 80,
      entryFee: 'LKR 200',
      contactPhone: '+94 76 789 0123',
      website: 'www.ceylonthroughlens.lk',
      verificationNotes: 'Outstanding venue choice with professional lighting and display systems. All requirements met.',
      verifiedBy: 'Art Curator Moderator',
      verificationDate: '2024-08-01',
      documents: [
        { name: 'Venue Permission', status: 'verified' },
        { name: 'Safety Certificate', status: 'verified' },
        { name: 'Insurance Policy', status: 'verified' },
        { name: 'Artist Agreements', status: 'verified' }
      ]
    },
    {
      id: 6,
      title: 'Experimental Digital Art Showcase',
      description: 'Cutting-edge digital art installations featuring VR experiences, interactive displays, and digital multimedia artworks.',
      organizer: 'Tech Arts Collective',
      organizerEmail: 'info@techartscollective.com',
      venue: 'Innovation Hub Colombo',
      address: '100 Independence Avenue, Colombo 07',
      startDate: '2024-09-20',
      endDate: '2024-09-22',
      submissionDate: '2024-07-18',
      status: 'rejected',
      category: 'Digital Art',
      expectedVisitors: 500,
      artworksCount: 25,
      entryFee: 'LKR 800',
      contactPhone: '+94 75 234 5679',
      website: 'www.experimentaldigitalart.lk',
      verificationNotes: 'Venue electrical systems not certified for high-power digital installations. Fire safety protocols inadequate.',
      verifiedBy: 'Technical Safety Moderator',
      verificationDate: '2024-07-26',
      rejectionReason: 'Venue electrical systems not certified for high-power installations and inadequate fire safety protocols',
      documents: [
        { name: 'Venue Permission', status: 'verified' },
        { name: 'Safety Certificate', status: 'missing' },
        { name: 'Insurance Policy', status: 'verified' },
        { name: 'Artist Agreements', status: 'verified' }
      ]
    }
  ];

  useEffect(() => {
    // In a real application, this would fetch from API
    // fetchExhibitions();
    setExhibitions(mockExhibitions);
    setLoading(false);
  }, []);

  const fetchExhibitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API call would be something like:
      // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/exhibitions`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setExhibitions(response.data);
      
      // For now, using mock data
      setExhibitions(mockExhibitions);
    } catch (err) {
      console.error('Error fetching exhibitions:', err);
      setError('Failed to load exhibitions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (exhibitionId, newStatus, reason = '') => {
    try {
      // API call would be:
      // await axios.put(`${import.meta.env.VITE_API_URL}/api/exhibitions/${exhibitionId}/status`, {
      //   status: newStatus,
      //   reason: reason
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Update local state
      setExhibitions(prev => prev.map(exhibition => 
        exhibition.id === exhibitionId 
          ? { 
              ...exhibition, 
              status: newStatus,
              verificationDate: new Date().toISOString().split('T')[0],
              verifiedBy: 'Current Moderator',
              ...(newStatus === 'rejected' && reason && { rejectionReason: reason })
            }
          : exhibition
      ));

      console.log(`Exhibition ${exhibitionId} status changed to ${newStatus}`);
      if (reason) console.log(`Reason: ${reason}`);
      
    } catch (err) {
      console.error('Error updating exhibition status:', err);
      setError('Failed to update exhibition status. Please try again.');
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

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'missing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
          <div key={exhibition.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getStatusColor(exhibition.status)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(exhibition.status)}
              <span className="text-sm font-medium capitalize">{exhibition.status}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{exhibition.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exhibition.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{exhibition.startDate} - {exhibition.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User size={16} />
                <span>{exhibition.organizer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <span>{exhibition.venue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exhibition.status)}`}>
                {exhibition.status}
              </span>
              <button
                onClick={() => {
                  setSelectedExhibition(exhibition);
                  setShowDetailsModal(true);
                }}
                className="text-[#D87C5A] hover:text-[#5D3A00] font-medium text-sm flex items-center gap-1"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>

            {exhibition.status === 'rejected' && exhibition.rejectionReason && (
              <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                <strong>Reason:</strong> {exhibition.rejectionReason}
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedExhibition.title}</h3>
                  <p className="text-gray-600 mt-1">Organized by {selectedExhibition.organizer}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Exhibition Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{selectedExhibition.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Visitors</label>
                    <p className="text-gray-900">{selectedExhibition.expectedVisitors}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Artworks</label>
                    <p className="text-gray-900">{selectedExhibition.artworksCount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entry Fee</label>
                    <p className="text-gray-900">{selectedExhibition.entryFee}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedExhibition.organizerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedExhibition.contactPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <p className="text-blue-600">{selectedExhibition.website}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue Address</label>
                    <p className="text-gray-900">{selectedExhibition.address}</p>
                  </div>
                </div>
              </div>

              {/* Documents Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Document Verification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedExhibition.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-gray-900">{doc.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Status and Actions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Verification Status</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(selectedExhibition.status)}
                    <span className="font-medium capitalize">{selectedExhibition.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{selectedExhibition.verificationNotes}</p>
                  {selectedExhibition.verifiedBy && (
                    <p className="text-gray-500 text-xs">
                      Verified by {selectedExhibition.verifiedBy} on {selectedExhibition.verificationDate}
                    </p>
                  )}
                </div>

                {selectedExhibition.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedExhibition.id, 'approved');
                        setShowDetailsModal(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason) {
                          handleStatusChange(selectedExhibition.id, 'rejected', reason);
                          setShowDetailsModal(false);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationList;
