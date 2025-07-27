  // Get left bar color for card based on status (verification-list style)
  // Exhibition verification style: use Tailwind border-l-4 and color classes
  const getStatusBorderClass = (status) => {
    switch (status) {
      case 'active':
        return 'border-l-4 border-green-400';
      case 'draft':
        return 'border-l-4 border-gray-400';
      case 'completed':
        return 'border-l-4 border-blue-400';
      case 'review':
        return 'border-l-4 border-yellow-400';
      default:
        return 'border-l-4 border-gray-200';
    }
  };
import axios from 'axios';
import { Calendar, Edit, Eye, Filter, Search, Trash2, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ChallengeList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/challenges`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        setChallenges(response.data);
      } catch (err) {
        setError('Failed to load challenges.');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  // State for delete confirmation popup
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  // State for details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [challengeToView, setChallengeToView] = useState(null);

  // State for edit form popup
  const [showEditModal, setShowEditModal] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', requestSponsorship: false });



  const handleEditClick = (challenge) => {
    setChallengeToEdit(challenge);
    setEditForm({
      title: challenge.title || '',
      description: challenge.description || '',
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
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setChallengeToEdit(null);
  };

  const handleSaveEdit = () => {
    // Here you would call your update API
    setShowEditModal(false);
    setChallengeToEdit(null);
    // Optionally, show a toast or reload the list
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setChallengeToDelete(null);
  };

  // State for delete loading
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    } catch (err) {
      setError('Failed to delete challenge.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || challenge.status === filterStatus;
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
          <h2 className="text-xl font-bold text-amber-900">All Challenges</h2>
          <p className="text-amber-700 mt-1">View and manage challenge details</p>
        </div>
      </div>

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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
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
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow card-animate ${getStatusBorderClass(challenge.status)} flex flex-col h-full`}
              >
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">{challenge.category}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(challenge.status)}`}>
                      {challenge.status?.charAt(0).toUpperCase() + challenge.status?.slice(1)}
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
                      <span><span className="font-semibold">Deadline:</span> {challenge.deadlineDateTime ? new Date(challenge.deadlineDateTime).toLocaleDateString() : '-'}</span>
                    </div>
                    {/* You can add participants/submissions here if you add them to the backend */}
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
            ))}
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
                      <span className="text-gray-700">{challengeToView.deadlineDateTime ? new Date(challengeToView.deadlineDateTime).toLocaleDateString() : '-'}</span>
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

                  {challengeToView.scoringCriteria && (
                    <div className="bg-amber-50 rounded-lg p-3 mt-2">
                      <div className="font-semibold text-amber-700 mb-1">Scoring Criteria</div>
                      <ul className="ml-4 mt-1 text-sm text-amber-800">
                        <li>Likes Weight: {challengeToView.scoringCriteria.likesWeight}%</li>
                        <li>Comments Weight: {challengeToView.scoringCriteria.commentsWeight}%</li>
                        <li>Buyer Interest Weight: {challengeToView.scoringCriteria.buyerInterestWeight}%</li>
                        <li>Expert Evaluation Weight: {challengeToView.scoringCriteria.expertEvaluationWeight}%</li>
                      </ul>
                    </div>
                  )}
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
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Calendar size={16} className="text-amber-600" /> Deadline</label>
              <input
                type="date"
                name="deadlineDateTime"
                value={editForm.deadlineDateTime ? editForm.deadlineDateTime.split('T')[0] : ''}
                onChange={handleEditFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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