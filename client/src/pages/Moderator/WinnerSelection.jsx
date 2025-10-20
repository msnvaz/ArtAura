import axios from 'axios';
import { AlertCircle, Award, Calculator, CheckCircle, Clock, Crown, Eye, Heart, Medal, Megaphone, MessageCircle, Search, Send, Shield, Trophy, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const WinnerSelection = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Get authentication token
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [challengeSearchTerm, setChallengeSearchTerm] = useState(''); // New: for filtering completed challenges
  const [sortBy, setSortBy] = useState('totalScore');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(null);
  
  // State for fetching challenges from database
  const [challenges, setChallenges] = useState([]);
  
  // State for fetching winners/submissions with marks
  const [winnerSubmissions, setWinnerSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  
  // State for publishing winners
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState(null);

  // Fetch challenges from backend
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenges`);
        setChallenges(response.data);
        // Debug: show how many challenges were fetched
        console.debug('Fetched challenges from API:', Array.isArray(response.data) ? response.data.length : 0);
        console.debug('Raw challenges data:', response.data);
        // Log each challenge's status
        if (Array.isArray(response.data)) {
          response.data.forEach((ch, idx) => {
            console.debug(`Challenge ${idx + 1}: "${ch.title || ch.name}" - Status: "${ch.status}"`);
          });
        }
      } catch (err) {
        console.error('Error fetching challenges:', err);
        console.error('Error details:', err.response?.data || err.message);
        // Silently fail - will use fallback mock data
      }
    };
    fetchChallenges();
  }, []);

  // Fetch winners/submissions when a challenge is selected
  // Uses Formula: MAX(0, (Likes × 10) - (Dislikes × 5))
  useEffect(() => {
    const fetchWinners = async () => {
      if (!selectedChallenge || !token) {
        setWinnerSubmissions([]);
        return;
      }
      
      setLoadingSubmissions(true);
      setSubmissionsError(null);
      
      try {
        console.log('Fetching winners for challenge:', selectedChallenge);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/challenges/${selectedChallenge}/winners`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log('Winners response:', response.data);
        
        // Map backend response to frontend format
        const submissions = response.data.map(submission => ({
          submissionId: submission.id,
          title: submission.artworkTitle,
          artistName: submission.artistName,
          imageUrl: submission.artworkImagePath,
          description: submission.artworkDescription,
          totalLikes: submission.likesCount || 0,
          totalDislikes: submission.dislikesCount || 0,
          calculatedScore: submission.marks || 0, // Marks from backend using formula
          position: submission.position || null, // 1, 2, 3 for winners
          submissionDate: submission.submissionDate,
          artistId: submission.artistId
        }));
        
        setWinnerSubmissions(submissions);
        console.log('Loaded winners with marks:', submissions);
      } catch (err) {
        console.error('Error fetching winners:', err);
        setSubmissionsError('Failed to load winners. ' + (err.response?.data || err.message));
        setWinnerSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };
    
    fetchWinners();
  }, [selectedChallenge, token]);

  // Function to publish winners to main feed
  const handlePublishWinners = async () => {
    if (!selectedChallenge) {
      setPublishError('Please select a challenge first');
      return;
    }

    const challenge = pastChallenges.find(c => String(c.id) === String(selectedChallenge));
    if (!challenge) {
      setPublishError('Challenge not found');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      // Prepare the data to publish
      const publishData = {
        challengeId: challenge.id,
        challengeName: challenge.name,
        challengeDescription: challenge.description,
        completedDate: challenge.completedDate,
        winners: challenge.winners,
        scoringCriteria: challenge.scoringCriteria,
        category: challenge.category,
        rewards: challenge.rewards
      };

      console.log('Publishing winners to main feed:', publishData);

      // API call to publish winners (uncomment when backend is ready)
      // const response = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/api/challenges/${challenge.id}/publish-winners`,
      //   publishData,
      //   {
      //     headers: { 
      //       'Authorization': `Bearer ${localStorage.getItem('token')}` 
      //     }
      //   }
      // );

      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPublishSuccess(true);
      setIsPublishing(false);

      // Show success message for 3 seconds
      setTimeout(() => {
        setPublishSuccess(false);
      }, 3000);

      console.log('Winners published successfully!');
    } catch (err) {
      console.error('Error publishing winners:', err);
      setPublishError(err.response?.data?.message || 'Failed to publish winners. Please try again.');
      setIsPublishing(false);
    }
  };

  // Calculate marks helper function (for display purposes)
  const calculateMarks = (likes, dislikes) => {
    return Math.max(0, (likes * 10) - (dislikes * 5));
  };

  const selectedChallengeData = challenges.find(c => c.id === selectedChallenge);

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // Filter and sort winner submissions
  const filteredSubmissions = winnerSubmissions
    .filter(submission => 
      submission.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalScore':
        case 'marks':
          return b.calculatedScore - a.calculatedScore;
        case 'likes':
          return b.totalLikes - a.totalLikes;
        case 'date':
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        default:
          return b.calculatedScore - a.calculatedScore;
      }
    });

  // Filter only challenges that are EXPLICITLY marked as 'completed' in database
  const completedChallenges = challenges.filter(challenge => {
    // Accept several possible status spellings (case-insensitive) coming from DB
    const status = String(challenge.status || '').toLowerCase();
    const isCompleted = status === 'completed' || status === 'complete' || status === 'finished' || status === 'done';
    console.debug(`Challenge "${challenge.title || challenge.name}" status: "${challenge.status}" → isCompleted: ${isCompleted}`);
    return isCompleted;
  }).map(challenge => {
    // Be defensive with field names coming from different API versions
    const completedDate = challenge.deadlineDateTime || challenge.completedDate || challenge.deadline || challenge.deadlineDate;
    const title = challenge.title || challenge.name || challenge.challengeName;
    const publishDateTime = challenge.publishDateTime || challenge.publishedAt || challenge.publishDate;
    const participants = challenge.participants || challenge.participantCount || challenge.maxParticipants || 0;
    const submissionsCount = challenge.submissions || challenge.submissionCount || 0;

    return {
      id: challenge.id,
      name: title || `Challenge ${challenge.id}`,
      description: challenge.description || challenge.desc || 'No description available',
      category: challenge.category || challenge.type || null,
      deadline: completedDate,
      completedDate: completedDate,
      publishDateTime: publishDateTime,
      maxParticipants: challenge.maxParticipants || participants,
      rewards: challenge.rewards || challenge.prize || null,
      requestSponsorship: challenge.requestSponsorship || false,
      status: 'completed',
      moderatorId: challenge.moderatorId || (challenge.moderator && challenge.moderator.id) || null,
      participants: participants,
      submissions: submissionsCount
    };
  }).sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));

  // Debug: log how many completed challenges we have
  console.debug('Completed challenges count:', completedChallenges.length);
  console.debug('Completed challenges:', completedChallenges.map(c => ({id: c.id, name: c.name, status: c.status})));

  // ONLY use database challenges - no mock/dummy data
  // This ensures dropdown shows actual challenge names from the challenges table
  const pastChallenges = completedChallenges;

  // Filter challenges based on search term
  const filteredPastChallenges = pastChallenges.filter(challenge => {
    if (!challengeSearchTerm) return true; // Show all if no search term
    const searchLower = challengeSearchTerm.toLowerCase();
    return (
      challenge.name?.toLowerCase().includes(searchLower) ||
      challenge.description?.toLowerCase().includes(searchLower) ||
      challenge.category?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      {/* CSS styles for button animations */}
      <style jsx>{`
        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }

        /* Ensure smooth rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full" style={{backgroundColor: '#FFD95A'}}>
                  <Trophy size={32} style={{color: '#5D3A00'}} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Winner Selection</h1>
                  <p className="text-gray-200">View calculated winners based on scoring criteria</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                  onClick={() => navigate('/moderatordashboard')}
                >
                  <Shield size={14} />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-6">
            {/* View Winners and Criteria Details Section */}
            <div className="rounded-lg shadow-sm border p-6" style={{backgroundColor: '#FFF5E1'}}>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6" style={{color: '#D87C5A'}} />
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight" style={{color: '#5D3A00'}}>View Winners and Criteria Details</h2>
                  <p className="text-sm font-light italic" style={{color: '#7f5539'}}>Select a completed challenge to view its winners and scoring criteria</p>
                </div>
              </div>

              {/* Challenge Selection Dropdown */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{color: '#362625'}}>
                  Select Completed Challenge (Sorted by Completion Date)
                </label>
                
                {/* Search Input for Filtering Challenges */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search completed challenges by name, description, or category..."
                    value={challengeSearchTerm}
                    onChange={(e) => setChallengeSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent font-medium text-gray-700 placeholder:font-normal placeholder:text-gray-400"
                    style={{borderColor: '#D87C5A', backgroundColor: 'white'}}
                  />
                  {challengeSearchTerm && (
                    <button
                      onClick={() => setChallengeSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown with filtered challenges */}
                <select
                  value={selectedChallenge}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Ensure the selected value is one of the completed challenges
                    if (val === '') {
                      setSelectedChallenge('');
                      return;
                    }
                    const exists = filteredPastChallenges.find(c => String(c.id) === String(val));
                    if (!exists) {
                      // Guard: do not allow selecting non-completed challenges
                      // Provide a friendly message and keep selection empty
                      alert('Please select a challenge that is marked as completed.');
                      setSelectedChallenge('');
                      return;
                    }
                    setSelectedChallenge(val);
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg font-semibold"
                  style={{borderColor: '#D87C5A', backgroundColor: 'white', color: '#362625'}}
                >
                  <option value="">
                    {filteredPastChallenges.length === 0 && challengeSearchTerm 
                      ? `No challenges found for "${challengeSearchTerm}"` 
                      : 'Select a challenge...'}
                  </option>
                  {filteredPastChallenges.map(challenge => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.name} - Completed: {new Date(challenge.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </option>
                  ))}
                </select>
                
                {/* Show count of filtered results */}
                {challengeSearchTerm && (
                  <p className="mt-2 text-sm" style={{color: '#7f5539'}}>
                    Showing {filteredPastChallenges.length} of {pastChallenges.length} completed challenge{pastChallenges.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Display Winners for Selected Challenge */}
              {selectedChallenge && pastChallenges.find(c => String(c.id) === String(selectedChallenge)) && (
                <div className="space-y-4">
                  {(() => {
                    const challenge = pastChallenges.find(c => String(c.id) === String(selectedChallenge));
                    // Debug: log selected challenge data
                    console.debug('Selected challenge:', challenge);
                    console.debug('Scoring criteria:', challenge?.scoringCriteria);
                    console.debug('Winners:', challenge?.winners);
                    return (
                      <>
                        {/* Challenge Info */}
                        <div className="p-4 rounded-lg" style={{backgroundColor: '#f4e8dc'}}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-xl" style={{color: '#362625'}}>{challenge.name}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                ✓ Completed
                              </span>
                            </div>
                            {challenge.category && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{backgroundColor: '#FFD95A', color: '#5D3A00'}}>
                                {challenge.category}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-4" style={{color: '#7f5539'}}>{challenge.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="font-bold" style={{color: '#362625'}}>Completed:</span>
                              <span className="ml-1 font-medium" style={{color: '#7f5539'}}>
                                {new Date(challenge.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold" style={{color: '#362625'}}>Deadline:</span>
                              <span className="ml-1 font-medium" style={{color: '#7f5539'}}>
                                {new Date(challenge.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold" style={{color: '#362625'}}>Max Participants:</span>
                              <span className="ml-1 font-medium" style={{color: '#7f5539'}}>{challenge.maxParticipants || 'Unlimited'}</span>
                            </div>
                          </div>

                          {challenge.rewards && (
                            <div className="p-3 rounded-lg mb-3" style={{backgroundColor: '#fff9e6', borderLeft: '4px solid #FFD700'}}>
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4" style={{color: '#FFD700'}} />
                                <span className="font-bold text-xs uppercase tracking-wider" style={{color: '#362625'}}>Rewards:</span>
                              </div>
                              <p className="text-sm font-medium mt-1" style={{color: '#7f5539'}}>{challenge.rewards}</p>
                            </div>
                          )}

                          {challenge.requestSponsorship && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-2 py-1 rounded" style={{backgroundColor: '#e3f2fd', color: '#1976d2'}}>
                                🤝 Sponsorship Requested
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Winners Display */}
                        <div className="bg-white rounded-lg p-6 border-2" style={{borderColor: '#D87C5A'}}>
                          <h3 className="text-xl font-extrabold tracking-tight mb-4" style={{color: '#5D3A00'}}>
                            🏆 Challenge Winners
                          </h3>
                          {challenge.winners && challenge.winners.length > 0 ? (
                            <div className="space-y-3">
                              {challenge.winners.map((winner) => (
                                <div 
                                  key={winner.position}
                                  className="flex items-center justify-between p-4 rounded-lg border"
                                  style={{
                                    backgroundColor: winner.position === 1 ? '#FFF9E6' : 
                                                   winner.position === 2 ? '#F5F5F5' : 
                                                   '#FFF5E1',
                                    borderColor: winner.position === 1 ? '#FFD700' : 
                                               winner.position === 2 ? '#C0C0C0' : 
                                               '#CD7F32'
                                  }}
                                >
                                  <div className="flex items-center gap-4">
                                    <div 
                                      className="flex items-center justify-center rounded-full w-12 h-12 font-black text-white"
                                      style={{
                                        backgroundColor: winner.position === 1 ? '#FFD700' : 
                                                       winner.position === 2 ? '#C0C0C0' : 
                                                       '#CD7F32'
                                      }}
                                    >
                                      {winner.position === 1 ? <Crown size={24} /> : 
                                       winner.position === 2 ? <Medal size={24} /> : 
                                       <Award size={24} />}
                                    </div>
                                    <div>
                                      <div className="font-bold text-lg" style={{color: '#362625'}}>
                                        {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : '🥉'} {winner.name}
                                      </div>
                                      <div className="text-sm font-medium" style={{color: '#7f5539'}}>
                                        {winner.title}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs font-bold uppercase tracking-wider" style={{color: '#D87C5A'}}>
                                      {winner.position === 1 ? '1st Place' : 
                                       winner.position === 2 ? '2nd Place' : 
                                       '3rd Place'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Trophy className="h-16 w-16 mx-auto mb-3" style={{color: '#D87C5A', opacity: 0.5}} />
                              <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                                Winners will be calculated based on submissions and scoring criteria
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Scoring Criteria Display */}
                        <div className="bg-white rounded-lg p-6 border" style={{borderColor: '#D87C5A'}}>
                          <h3 className="text-xl font-extrabold tracking-tight mb-4" style={{color: '#5D3A00'}}>
                            📊 Scoring Criteria
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg" style={{backgroundColor: '#FFF5E1'}}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#362625'}}>
                                  Likes Weight
                                </span>
                                <Heart className="h-5 w-5" style={{color: '#D87C5A'}} />
                              </div>
                              <div className="text-3xl font-black" style={{color: '#5D3A00'}}>
                                {challenge.scoringCriteria?.likesWeight || 34}%
                              </div>
                            </div>
                            <div className="p-4 rounded-lg" style={{backgroundColor: '#FFF5E1'}}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#362625'}}>
                                  Comments Weight
                                </span>
                                <MessageCircle className="h-5 w-5" style={{color: '#D87C5A'}} />
                              </div>
                              <div className="text-3xl font-black" style={{color: '#5D3A00'}}>
                                {challenge.scoringCriteria?.commentsWeight || 33}%
                              </div>
                            </div>
                            <div className="p-4 rounded-lg" style={{backgroundColor: '#FFF5E1'}}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#362625'}}>
                                  Share Weight
                                </span>
                                <Send className="h-5 w-5" style={{color: '#D87C5A'}} />
                              </div>
                              <div className="text-3xl font-black" style={{color: '#5D3A00'}}>
                                {challenge.scoringCriteria?.shareWeight || 33}%
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#e8f5e9'}}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#2e7d32'}}>
                                Total Weight:
                              </span>
                              <span className="text-lg font-black" style={{color: '#2e7d32'}}>
                                {(challenge.scoringCriteria?.likesWeight || 34) + 
                                 (challenge.scoringCriteria?.commentsWeight || 33) + 
                                 (challenge.scoringCriteria?.shareWeight || 33)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Publish Winners Button */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-dashed" style={{borderColor: '#D87C5A'}}>
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-full" style={{backgroundColor: '#D87C5A'}}>
                                <Megaphone className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold" style={{color: '#5D3A00'}}>
                                  Publish Winners to Main Feed
                                </h4>
                                <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                                  Share the winners and results with all ArtAura users
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handlePublishWinners}
                              disabled={isPublishing || !challenge.winners || challenge.winners.length === 0}
                              className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center gap-2 ${
                                isPublishing || !challenge.winners || challenge.winners.length === 0
                                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                  : 'bg-gradient-to-r from-[#D87C5A] to-[#c4664a] hover:from-[#c4664a] hover:to-[#D87C5A] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                              }`}
                            >
                              {isPublishing ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                  Publishing...
                                </>
                              ) : publishSuccess ? (
                                <>
                                  <CheckCircle className="h-5 w-5" />
                                  Published!
                                </>
                              ) : (
                                <>
                                  <Megaphone className="h-5 w-5" />
                                  Publish Winners
                                </>
                              )}
                            </button>
                          </div>

                          {/* Success Message */}
                          {publishSuccess && (
                            <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{backgroundColor: '#d4edda', borderLeft: '4px solid #28a745'}}>
                              <CheckCircle className="h-5 w-5" style={{color: '#28a745'}} />
                              <div>
                                <p className="font-bold text-sm" style={{color: '#155724'}}>
                                  Winners Published Successfully!
                                </p>
                                <p className="text-xs" style={{color: '#155724'}}>
                                  The winners are now visible on the main feed for all users.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Error Message */}
                          {publishError && (
                            <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545'}}>
                              <XCircle className="h-5 w-5" style={{color: '#dc3545'}} />
                              <div>
                                <p className="font-bold text-sm" style={{color: '#721c24'}}>
                                  Failed to Publish
                                </p>
                                <p className="text-xs" style={{color: '#721c24'}}>
                                  {publishError}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* No Winners Warning */}
                          {(!challenge.winners || challenge.winners.length === 0) && (
                            <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107'}}>
                              <AlertCircle className="h-5 w-5" style={{color: '#856404'}} />
                              <p className="text-sm font-medium" style={{color: '#856404'}}>
                                Winners must be calculated before publishing to the main feed.
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* No Challenge Selected Message or Empty Database State */}
              {!selectedChallenge && (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto mb-4" style={{color: '#D87C5A', opacity: 0.4}} />
                  {pastChallenges.length === 0 ? (
                    <>
                      <h3 className="text-lg font-bold mb-2" style={{color: '#362625'}}>No Completed Challenges Found</h3>
                      <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                        There are no completed challenges in the database yet.
                      </p>
                      <p className="text-sm font-medium mt-2" style={{color: '#7f5539'}}>
                        Completed challenges will appear here once they reach their deadline or are marked as completed.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold mb-2" style={{color: '#362625'}}>No Challenge Selected</h3>
                      <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                        Select a completed challenge above to view its winners and scoring criteria
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Current Scoring Criteria Display */}
            {selectedChallengeData?.hasCriteria && (
              <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#5D3A00'}}>Current Scoring Weights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold" style={{color: '#5D3A00'}}>{scoringCriteria.likesWeight}%</div>
                      <div style={{color: '#D87C5A'}}>Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{color: '#5D3A00'}}>{scoringCriteria.commentsWeight}%</div>
                      <div style={{color: '#D87C5A'}}>Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{color: '#5D3A00'}}>{scoringCriteria.buyerPreferenceWeight}%</div>
                      <div style={{color: '#D87C5A'}}>Buyer Preference</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{color: '#5D3A00'}}>{scoringCriteria.expertPanelWeight}%</div>
                      <div style={{color: '#D87C5A'}}>Expert Panel</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedChallengeData?.hasCriteria && (
              <>

                {/* Search and Sort */}
                <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{color: '#5D3A00'}} />
                          <input
                            type="text"
                            placeholder="Search submissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                            style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                          />
                        </div>
                      </div>
                      <div>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                          style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                        >
                          <option value="totalScore">Total Score</option>
                          <option value="likes">Likes</option>
                          <option value="expertScore">Expert Score</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Winner Podium */}
                <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4" style={{color: '#5D3A00'}}>Winners</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map(position => {
                        const winner = submissions.find(s => s.position === position);
                        return (
                          <div key={position} className={`p-4 rounded-lg border-2 ${getPositionColor(position)}`}>
                            <div className="flex items-center gap-2 mb-2">
                              {getPositionIcon(position)}
                              <span className="font-semibold">
                                {position === 1 ? '1st Place' : position === 2 ? '2nd Place' : '3rd Place'}
                              </span>
                            </div>
                            {winner ? (
                              <div>
                                <p className="font-medium">{winner.title}</p>
                                <p className="text-sm text-gray-600">{winner.participant}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Calculator className="h-4 w-4" style={{color: '#D87C5A'}} />
                                  <span className="text-sm font-medium">{winner.totalScore}/100</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No winner for this position</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Submissions List */}
                <div className="grid grid-cols-1 gap-6">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className={`rounded-lg shadow-sm border-2 hover:shadow-lg transition-shadow overflow-hidden ${submission.position ? getPositionColor(submission.position) : ''}`} style={{backgroundColor: '#FFF5E1'}}>
                      <div className="p-6">
                        <div className="flex items-start gap-6">
                          <img
                            src={submission.imageUrl}
                            alt={submission.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold" style={{color: '#5D3A00'}}>{submission.title}</h3>
                              {submission.position && (
                                <div className="flex items-center gap-1">
                                  {getPositionIcon(submission.position)}
                                  <span className="text-sm font-medium">Winner</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="text-sm">
                                <span className="text-gray-500">Participant:</span>
                                <p className="font-medium" style={{color: '#5D3A00'}}>{submission.participant}</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Total Score:</span>
                                <p className="font-bold" style={{color: '#D87C5A'}}>{submission.totalScore}/100</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Likes:</span>
                                <p className="font-medium" style={{color: '#5D3A00'}}>{submission.likes}</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Expert Score:</span>
                                <p className="font-medium" style={{color: '#5D3A00'}}>{submission.expertScore}/10</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {submission.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => setShowScoreBreakdown(showScoreBreakdown === submission.id ? null : submission.id)}
                              className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors"
                              style={{
                                borderColor: '#FFE4D6',
                                color: '#5D3A00',
                                backgroundColor: 'white'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#FFE4D6';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'white';
                              }}
                            >
                              <Eye size={16} />
                              Score Details
                            </button>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        {showScoreBreakdown === submission.id && (
                          <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: '#FFE4D6'}}>
                            <h4 className="font-medium mb-3" style={{color: '#5D3A00'}}>Score Breakdown</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-sm text-gray-600">Likes ({scoringCriteria.likesWeight}%)</div>
                                <div className="font-semibold" style={{color: '#5D3A00'}}>{submission.likesScore}/100</div>
                                <div className="text-xs text-gray-500">{submission.likes} likes</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600">Comments ({scoringCriteria.commentsWeight}%)</div>
                                <div className="font-semibold" style={{color: '#5D3A00'}}>{submission.commentsScore}/100</div>
                                <div className="text-xs text-gray-500">{submission.comments} comments</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600">Buyer Preference ({scoringCriteria.buyerPreferenceWeight}%)</div>
                                <div className="font-semibold" style={{color: '#5D3A00'}}>{submission.buyerScore}/100</div>
                                <div className="text-xs text-gray-500">{submission.buyerPreference}/10 avg</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-600">Expert Panel ({scoringCriteria.expertPanelWeight}%)</div>
                                <div className="font-semibold" style={{color: '#5D3A00'}}>{submission.expertScoreNormalized}/100</div>
                                <div className="text-xs text-gray-500">{submission.expertScore}/10 avg</div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t text-center">
                              <div className="text-sm text-gray-600">Weighted Total Score</div>
                              <div className="text-xl font-bold" style={{color: '#D87C5A'}}>{calculateWeightedScore(submission)}/100</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Past Challenges Winners Section (always visible below criteria button) */}
            <div className="rounded-lg shadow-sm border h-full relative overflow-hidden mt-8" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4" style={{color: '#5D3A00'}}>Previous Challenges Winners</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastChallenges.map((challenge) => (
                    <div key={challenge.id} className="rounded-lg border bg-white p-4" style={{borderColor: '#FFE4D6'}}>
                      <h3 className="font-semibold mb-1" style={{color: '#D87C5A'}}>{challenge.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Clock size={14} />
                        <span>Deadline: {challenge.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Users size={14} />
                        <span>{challenge.participants} participants • {challenge.submissions} submissions</span>
                      </div>
                      <div className="mt-2">
                        <span className="block text-xs font-semibold text-green-700 mb-1">Winners:</span>
                        <div className="space-y-1">
                          {challenge.winners.map((winner) => (
                            <div key={winner.position} className="flex items-center gap-2">
                              {getPositionIcon(winner.position)}
                              <span className="font-medium" style={{color: '#5D3A00'}}>
                                {winner.position === 1 ? '1st Place' : winner.position === 2 ? '2nd Place' : '3rd Place'}:
                              </span>
                              <span>{winner.name}</span>
                              <span className="text-gray-500">- {winner.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WinnerSelection;