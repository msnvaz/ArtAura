  import axios from 'axios';
import { AlertCircle, Calendar, CheckCircle, Clock, Edit, Eye, FileText, Filter, Heart, MessageCircle, Search, Send, Trash2, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChallengeList = () => {
  const { token } = useAuth();
  
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  // Default to showing only completed challenges per request
  const [filterStatus, setFilterStatus] = useState('completed');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [challengeToView, setChallengeToView] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', requestSponsorship: false });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Challenges
  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/challenges`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setChallenges(response.data);
      // Debug info to confirm how many challenges and completed ones were fetched
      try {
        const list = response.data || [];
        const completedCount = list.filter(c => {
          const s = String(c?.status || '').toLowerCase();
          return ['completed', 'complete', 'finished', 'done'].includes(s) || (c?.deadlineDateTime && new Date(c.deadlineDateTime) < new Date());
        }).length;
        console.debug('Fetched challenges:', list.length, 'Completed (detected):', completedCount);
      } catch (err) {
        console.debug('Challenge fetch debug error', err);
      }
    } catch (error) {
      setError('Failed to load challenges.');
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Helper Functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBorderClass = (status) => {
    switch (status) {
      case 'active':
        return 'border-l-4 border-green-500';
      case 'draft':
        return 'border-l-4 border-gray-400';
      case 'completed':
        return 'border-l-4 border-blue-500';
      case 'review':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const getChallengeStats = () => {
    return {
      total: challenges.length,
      draft: challenges.filter(c => getActualStatus(c) === 'draft').length,
      active: challenges.filter(c => getActualStatus(c) === 'active').length,
      review: challenges.filter(c => getActualStatus(c) === 'review').length,
      completed: challenges.filter(c => getActualStatus(c) === 'completed').length
    };
  };

  // Helper function to determine actual status based on deadline
  const getActualStatus = (challenge) => {
    // Normalize status field to be defensive against different casing/values
    const rawStatus = String(challenge?.status || '').toLowerCase();
    const completedValues = ['completed', 'complete', 'finished', 'done'];
    if (completedValues.includes(rawStatus)) return 'completed';

    // If deadline has passed, treat as completed as well
    const deadlineValue = challenge?.deadlineDateTime || challenge?.deadline || challenge?.completedDate;
    if (deadlineValue) {
      const deadline = new Date(deadlineValue);
      const now = new Date();
      if (!isNaN(deadline.getTime()) && now > deadline) {
        return 'completed';
      }
    }

    // Fallback: return normalized original status or 'draft' if empty
    return rawStatus || 'draft';
  };

  // Event Handlers
  const handleEditClick = (challenge) => {
    setChallengeToEdit(challenge);
    
    // Ensure proper datetime format for editing
    let editableDateTime = '';
    if (challenge.deadlineDateTime) {
      const dateStr = challenge.deadlineDateTime.toString();
      if (dateStr.includes('T')) {
        editableDateTime = dateStr;
      } else if (dateStr.includes(' ')) {
        // Convert MySQL format to ISO format for editing
        editableDateTime = dateStr.replace(' ', 'T');
      } else {
        // If only date, add default time
        editableDateTime = dateStr + 'T23:59:59';
      }
    }
    
    console.log('Original challenge datetime:', challenge.deadlineDateTime);
    console.log('Converted for editing:', editableDateTime);
    
    setEditForm({
      title: challenge.title || '',
      description: challenge.description || '',
      category: challenge.category || '',
      deadlineDateTime: editableDateTime,
      maxParticipants: challenge.maxParticipants || 1,
      rewards: challenge.rewards || '',
      requestSponsorship: !!challenge.requestSponsorship
    });
    setShowEditModal(true);
  };

  // Show details modal
  const handleViewClick = (challenge) => {
    setChallengeToView(challenge);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setChallengeToView(null);
  };

  // Show delete confirmation modal and set the challenge to delete
  const handleDeleteClick = (challenge) => {
    setChallengeToDelete(challenge);
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'deadlineDateTime') {
      // Handle date change - preserve time if it exists
      const currentTime = editForm.deadlineDateTime ? 
        (editForm.deadlineDateTime.includes('T') ? editForm.deadlineDateTime.split('T')[1] : '00:00:00') : 
        '00:00:00';
      const newDateTime = value ? `${value}T${currentTime}` : '';
      setEditForm((prev) => ({
        ...prev,
        deadlineDateTime: newDateTime
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setChallengeToEdit(null);
  };

  const handleSaveEdit = async () => {
    if (!challengeToEdit) return;
    
    // Validate required fields
    if (!editForm.title || !editForm.description || !editForm.category || 
        !editForm.deadlineDateTime || !editForm.maxParticipants) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Prepare the payload for the backend
      let formattedDeadlineDateTime = '';
      if (editForm.deadlineDateTime && editForm.deadlineDateTime.trim() !== '') {
        // Get clean datetime string
        const dateTimeStr = editForm.deadlineDateTime.trim();
        
        console.log('Processing datetime:', dateTimeStr);
        
        if (dateTimeStr.includes('T')) {
          try {
            // Parse the ISO datetime and convert to MySQL format
            const dateObj = new Date(dateTimeStr);
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
              setError('Invalid deadline date/time. Please check your input.');
              return;
            }
            
            // Format as YYYY-MM-DD HH:MM:SS
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            
            formattedDeadlineDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          } catch (error) {
            console.error('Error parsing datetime:', error);
            setError('Invalid deadline date/time format. Please check your input.');
            return;
          }
        } else if (dateTimeStr.length >= 10) {
          // Only date provided, add default end-of-day time
          formattedDeadlineDateTime = `${dateTimeStr} 23:59:59`;
        } else {
          setError('Invalid deadline date format. Please select a valid date.');
          return;
        }
      } else {
        setError('Deadline date and time are required.');
        return;
      }

      // Final validation of the formatted datetime
      if (!formattedDeadlineDateTime || formattedDeadlineDateTime.length < 19) {
        setError('Failed to format deadline datetime. Please check your input.');
        return;
      }

      console.log('Original datetime from form:', editForm.deadlineDateTime);
      console.log('Formatted datetime for backend:', formattedDeadlineDateTime);

      const payload = {
        id: challengeToEdit.id,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        deadlineDateTime: formattedDeadlineDateTime,
        maxParticipants: parseInt(editForm.maxParticipants) || 1,
        rewards: editForm.rewards || '',
        requestSponsorship: editForm.requestSponsorship || false
      };
      
      console.log('Full payload being sent:', JSON.stringify(payload, null, 2));
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/challenges/${challengeToEdit.id}`,
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh the challenges list to show updated data
      await fetchChallenges();
      
      setShowEditModal(false);
      setChallengeToEdit(null);
      setEditForm({});
      setError(null);
      
      // Show success message
      alert('Challenge updated successfully!');
    } catch (err) {
      console.error('Error updating challenge:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('You are not authorized to edit challenges.');
      } else if (err.response?.status === 404) {
        setError('Challenge not found.');
      } else {
        setError('Failed to update challenge. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setChallengeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!challengeToDelete) return;
    setDeleteLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/challenges/${challengeToDelete.id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      // Remove the deleted challenge from the list
      setChallenges((prev) => prev.filter((c) => c.id !== challengeToDelete.id));
      setShowDeleteModal(false);
      setChallengeToDelete(null);
    } catch (error) {
      setError('Failed to delete challenge.');
      console.error('Error deleting challenge:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const actualStatus = getActualStatus(challenge);
    const matchesFilter = filterStatus === 'all' || actualStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* All custom styles removed; use Tailwind for transitions and animation */}

      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      

      <div className="min-h-screen page-container" style={{backgroundColor: '#FFF5E1'}}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-amber-900 tracking-tight">All Challenges</h2>
          <p className="text-base font-light text-amber-600 mt-2 italic">View and manage challenge details</p>
        </div>
      </div>

      {/* Stats Cards */}
      {(() => {
        const stats = getChallengeStats();
        return (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-300 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Total Challenges</p>
                  <p className="text-3xl font-black text-amber-900 mt-1">{stats.total}</p>
                </div>
                <Trophy className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Draft</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats.draft}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Active</p>
                  <p className="text-3xl font-extrabold text-green-900 mt-1">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">Under Review</p>
                  <p className="text-3xl font-extrabold text-yellow-900 mt-1">{stats.review}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Completed</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">{stats.completed}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 smooth-transition">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium text-gray-700 placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
          </div>
            <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-semibold text-gray-700"
            >
              <option value="all">Show All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      {loading ? (
        <div className="text-center py-12">
          <span className="text-lg text-gray-600">Loading challenges...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <span className="text-lg text-red-600">{error}</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              const actualStatus = getActualStatus(challenge);
              return (
              <div
                key={challenge.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow card-animate ${getStatusBorderClass(actualStatus)} flex flex-col h-full`}
              >
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">{challenge.category}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(actualStatus)}`}>
                      {actualStatus?.charAt(0).toUpperCase() + actualStatus?.slice(1)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    {challenge.title}
                    {challenge.requestSponsorship && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Sponsorship</span>
                    )}
                  </h3>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{challenge.description}</p>

                  {/* Rewards & Prizes section - consistent with details modal */}
                  {(challenge.rewards || challenge.prizes) && (
                    <div className="mb-2">
                      <span className="font-semibold flex items-center gap-2 text-amber-800">
                        <Trophy size={16} className="text-amber-600" /> Rewards & Prizes:
                      </span>
                      {challenge.rewards && (
                        <div className="ml-6 text-sm text-gray-700">
                          <span className="font-semibold">Rewards:</span> <span>{challenge.rewards}</span>
                        </div>
                      )}
                      {challenge.prizes && (
                        <div className="ml-6 text-sm text-gray-700">
                          <span className="font-semibold">Prizes:</span> <span>{challenge.prizes}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} className="text-amber-600" />
                      <span>
                        <span className="font-semibold">Deadline:</span> 
                        {challenge.deadlineDateTime ? 
                          ` ${new Date(challenge.deadlineDateTime).toLocaleDateString()} at ${new Date(challenge.deadlineDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                          : ' -'
                        }
                      </span>
                    </div>
                    {challenge.maxParticipants !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={16} className="text-amber-600" />
                        <span><span className="font-semibold">Max Participants:</span> {challenge.maxParticipants}</span>
                      </div>
                    )}
                  </div>

                  {/* Fixed Scoring System Info */}
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-blue-600 rounded-full">
                        <Trophy size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-bold text-blue-900">Fixed Marks Scoring</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-2 border border-green-200 shadow-sm">
                        <div className="flex justify-center mb-1">
                          <Heart size={14} className="text-red-500" />
                        </div>
                        <div className="text-xl font-bold text-green-600 text-center">+10</div>
                        <div className="text-xs text-gray-700 text-center font-medium">Per Like</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-red-200 shadow-sm">
                        <div className="flex justify-center mb-1">
                          <Heart size={14} className="text-gray-500" style={{ transform: "rotate(180deg)" }} />
                        </div>
                        <div className="text-xl font-bold text-red-600 text-center">-5</div>
                        <div className="text-xs text-gray-700 text-center font-medium">Per Dislike</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1"></div>
                  {/* Action icons always at the bottom, now aligned left */}
                  <div className="flex justify-start gap-2 pt-4 border-t border-gray-200 mt-4">
                    <button
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate"
                      onClick={() => handleViewClick(challenge)}
                      title="View Details"
                      style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors btn-animate"
                      onClick={() => handleEditClick(challenge)}
                      title="Edit Challenge"
                      style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <Edit size={16} style={{ color: '#0D6EFD' }} />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors btn-animate"
                      onClick={() => handleDeleteClick(challenge)}
                      title="Delete Challenge"
                      style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <Trash2 size={16} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Single Challenge Details Modal rendered only once outside the map */}
          {showDetailsModal && challengeToView && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100 relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#362625] mb-2">Challenge Details</h3>
                </div>
                <div className="space-y-4 text-left">
                  <div>
                    <span className="font-semibold flex items-center gap-2">
                      <Trophy size={16} className="text-amber-600" /> Title:
                    </span>
                    <span className="text-gray-800 ml-6">{challengeToView.title}</span>
                  </div>
                  <div>
                    <span className="font-semibold flex items-center gap-2">
                      <Edit size={16} className="text-amber-600" /> Description:
                    </span>
                    <span className="text-gray-700 ml-6 block text-justify">{challengeToView.description}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold flex items-center gap-2">
                        <Filter size={16} className="text-amber-600" /> Category:
                      </span>
                      <span className="text-gray-700 ml-6">{challengeToView.category === 'Other' ? 'Other (Custom Category)' : challengeToView.category}</span>
                    </div>
                    {/* Status field removed from Challenge Details modal for consistency */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold flex items-center gap-2">
                        <Calendar size={16} className="text-amber-600" /> <span className="font-semibold">Deadline:</span>
                      </span>
                      <span className="text-gray-700">
                        {challengeToView.deadlineDateTime ? 
                          `${new Date(challengeToView.deadlineDateTime).toLocaleDateString()} at ${new Date(challengeToView.deadlineDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                          : '-'
                        }
                      </span>
                    </div>
                    {challengeToView.createdDateTime && (
                      <div>
                        <span className="font-semibold">Created:</span> <span className="text-gray-700">{new Date(challengeToView.createdDateTime).toLocaleDateString()}</span>
                      </div>
                    )}
                    {challengeToView.updatedDateTime && (
                      <div>
                        <span className="font-semibold">Last Updated:</span> <span className="text-gray-700">{new Date(challengeToView.updatedDateTime).toLocaleDateString()}</span>
                      </div>
                    )}
                    {challengeToView.maxParticipants !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold flex items-center gap-2">
                          <Users size={16} className="text-amber-600" /> Max Participants:
                        </span>
                        <span className="text-gray-700">{challengeToView.maxParticipants}</span>
                      </div>
                    )}
                    {challengeToView.participants !== undefined && (
                      <div>
                        <span className="font-semibold">Participants:</span> <span className="text-gray-700">{challengeToView.participants}</span>
                      </div>
                    )}
                    {challengeToView.submissions !== undefined && (
                      <div>
                        <span className="font-semibold">Submissions:</span> <span className="text-gray-700">{challengeToView.submissions}</span>
                      </div>
                    )}
                  </div>

                  {/* Draft label with dark box if status is draft */}
                  {challengeToView.requestSponsorship && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-2">
                      <div className="font-semibold text-blue-700 mb-1">Sponsorship Requested</div>
                    </div>
                  )}

                  {/* Rewards & Prizes section - consistent with other details */}
                  {(challengeToView.rewards || challengeToView.prizes) && (
                    <div className="mt-2">
                      <span className="font-semibold flex items-center gap-2">
                        <Trophy size={16} className="text-amber-600" /> Rewards & Prizes:
                      </span>
                      {challengeToView.rewards && (
                        <div className="ml-6">
                          <span className="font-semibold">Rewards:</span> <span className="text-gray-700">{challengeToView.rewards}</span>
                        </div>
                      )}
                      {challengeToView.prizes && (
                        <div className="ml-6">
                          <span className="font-semibold">Prizes:</span> <span className="text-gray-700">{challengeToView.prizes}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fixed Scoring System */}
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-lg p-6 mt-2 border-2 border-blue-300">
                    <div className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Trophy size={18} className="text-blue-600" />
                      Fixed Marks Scoring System
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart size={16} className="text-red-500" />
                          <span className="text-sm font-medium text-gray-700">Each Like</span>
                        </div>
                        <div className="text-3xl font-bold text-green-600">+10</div>
                        <div className="text-xs text-gray-500">marks added</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart size={16} className="text-gray-500" style={{ transform: "rotate(180deg)" }} />
                          <span className="text-sm font-medium text-gray-700">Each Dislike</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600">-5</div>
                        <div className="text-xs text-gray-500">marks deducted</div>
                      </div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                      <p className="text-sm text-blue-900">
                        <span className="font-bold">Scoring Formula:</span> Score = (Total Likes × 10) - (Total Dislikes × 5)
                      </p>
                    </div>
                  </div>
                </div>
                {/* Close button at the bottom */}
                <div className="flex gap-4 justify-center mt-8">
                  <button
                    type="button"
                    onClick={handleCloseDetails}
                    className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
      )}
          </div>
        </div>
      </div>
    {/* Edit Challenge Modal */}
    {showEditModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#362625] mb-2">Edit Challenge</h3>
          </div>
          <form className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Trophy size={16} className="text-amber-600" /> Title</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Users size={16} className="text-amber-600" /> Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={editForm.maxParticipants || ''}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Edit size={16} className="text-amber-600" /> Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Filter size={16} className="text-amber-600" /> Category</label>
              <input
                list="edit-category-options"
                type="text"
                name="category"
                value={editForm.category || ''}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoComplete="off"
              />
              <datalist id="edit-category-options">
                <option value="Traditional Art" />
                <option value="Abstract Art" />
                <option value="Portrait" />
                <option value="Landscape" />
                <option value="Street Art" />
                <option value="Other" />
              </datalist>
            </div>
            {/* Status field removed from Edit Challenge modal as requested */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Calendar size={16} className="text-amber-600" /> Deadline Date</label>
              <input
                type="date"
                name="deadlineDateTime"
                value={editForm.deadlineDateTime ? editForm.deadlineDateTime.split('T')[0] : ''}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Calendar size={16} className="text-amber-600" /> Deadline Time</label>
              <input
                type="time"
                name="deadlineTime"
                value={editForm.deadlineDateTime ? (editForm.deadlineDateTime.includes('T') ? editForm.deadlineDateTime.split('T')[1]?.slice(0,5) : '00:00') : ''}
                onChange={(e) => {
                  const dateOnly = editForm.deadlineDateTime ? editForm.deadlineDateTime.split('T')[0] : '';
                  if (dateOnly && e.target.value) {
                    const newDateTime = `${dateOnly}T${e.target.value}:00`;
                    console.log('Setting new datetime:', newDateTime); // Debug log
                    setEditForm(prev => ({ ...prev, deadlineDateTime: newDateTime }));
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Trophy size={16} className="text-amber-600" /> Rewards</label>
              <textarea
                name="rewards"
                value={editForm.rewards || ''}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={2}
                placeholder="Optional: Describe the rewards and prizes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Trophy size={16} className="text-amber-600" /> Request Sponsorship
                <input
                  type="checkbox"
                  name="requestSponsorship"
                  checked={editForm.requestSponsorship}
                  onChange={handleEditFormChange}
                  className="ml-2 accent-amber-600 h-4 w-4"
                />
              </label>
            </div>
            {/* No sponsorship type/message fields in edit modal */}
            <div className="flex gap-4 justify-center mt-6">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-gradient-to-r from-yellow-300 to-orange-400 text-[#362625] rounded-xl hover:from-orange-400 hover:to-yellow-300 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[120px]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#362625] mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Are you sure you want to delete the challenge "{challengeToDelete?.title}"?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCancelDelete}
                disabled={deleteLoading}
                className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className={`px-6 py-3 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white rounded-xl hover:from-[#c0392b] hover:to-[#a93226] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[120px] ${deleteLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ChallengeList;