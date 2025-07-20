import { Award, Calculator, Clock, Crown, Eye, Medal, Search, Settings, Shield, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WinnerSelection = () => {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState('web-design-2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalScore');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(null);

  const challenges = [
    { id: 'national-drawing-competition', name: 'National Drawing Competition', status: 'active', hasCriteria: true },
    { id: 'landscape-painting-challenge', name: 'Landscape Painting Challenge', status: 'active', hasCriteria: false }
  ];

  // Mock scoring criteria for the selected challenge
  const scoringCriteria = {
    likesWeight: 25,
    commentsWeight: 15,
    buyerPreferenceWeight: 30,
    expertPanelWeight: 30
  };

  const submissions = [
    {
      id: 1,
      title: 'Modern E-commerce Dashboard',
      participant: 'Sarah Johnson',
      submissionDate: '2024-02-10',
      imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A sleek and intuitive e-commerce dashboard with advanced analytics.',
      tags: ['UI/UX', 'Dashboard', 'E-commerce'],
      // Raw metrics
      likes: 156,
      comments: 23,
      buyerPreference: 8.5, // out of 10
      expertScore: 9.2, // out of 10
      // Calculated scores
      likesScore: 85, // normalized score out of 100
      commentsScore: 78,
      buyerScore: 85,
      expertScoreNormalized: 92,
      totalScore: 86.25,
      position: 2
    },
    {
      id: 2,
      title: 'Creative Portfolio Website',
      participant: 'Michael Chen',
      submissionDate: '2024-02-08',
      imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Innovative portfolio design with stunning animations.',
      tags: ['Portfolio', 'Animation', 'Responsive'],
      likes: 203,
      comments: 31,
      buyerPreference: 9.1,
      expertScore: 9.5,
      likesScore: 100,
      commentsScore: 100,
      buyerScore: 91,
      expertScoreNormalized: 95,
      totalScore: 95.15,
      position: 1
    },
    {
      id: 3,
      title: 'Healthcare App Interface',
      participant: 'Emma Rodriguez',
      submissionDate: '2024-02-05',
      imageUrl: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Clean and accessible healthcare application interface.',
      tags: ['Healthcare', 'Accessibility', 'Mobile'],
      likes: 189,
      comments: 27,
      buyerPreference: 8.2,
      expertScore: 8.8,
      likesScore: 93,
      commentsScore: 87,
      buyerScore: 82,
      expertScoreNormalized: 88,
      totalScore: 87.45,
      position: 3
    },
    {
      id: 4,
      title: 'Financial Dashboard',
      participant: 'David Kim',
      submissionDate: '2024-02-12',
      imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comprehensive financial dashboard with data visualization.',
      tags: ['Finance', 'Dashboard', 'Data Viz'],
      likes: 167,
      comments: 19,
      buyerPreference: 7.8,
      expertScore: 8.5,
      likesScore: 82,
      commentsScore: 61,
      buyerScore: 78,
      expertScoreNormalized: 85,
      totalScore: 79.95,
      position: null
    }
  ];

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

  const calculateWeightedScore = (submission) => {
    const { likesScore, commentsScore, buyerScore, expertScoreNormalized } = submission;
    const { likesWeight, commentsWeight, buyerPreferenceWeight, expertPanelWeight } = scoringCriteria;
    
    return (
      (likesScore * likesWeight / 100) +
      (commentsScore * commentsWeight / 100) +
      (buyerScore * buyerPreferenceWeight / 100) +
      (expertScoreNormalized * expertPanelWeight / 100)
    ).toFixed(2);
  };

  const filteredSubmissions = submissions
    .filter(submission => 
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.participant.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalScore':
          return b.totalScore - a.totalScore;
        case 'likes':
          return b.likes - a.likes;
        case 'expertScore':
          return b.expertScore - a.expertScore;
        case 'date':
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        default:
          return 0;
      }
    });

  // Use the same previousChallenges data/structure as ModeratorDashboard
  const pastChallenges = [
    {
      id: 'abstract-art-contest',
      name: 'Abstract Art Contest',
      description: 'A national web design challenge for creative portfolios and landing pages.',
      deadline: '2025-07-30',
      participants: 180,
      submissions: 120,
      winners: [
        { position: 1, name: 'Alice Smith', title: 'Modern Web Portfolio' },
        { position: 2, name: 'John Doe', title: 'Creative Landing Page' },
        { position: 3, name: 'Priya Patel', title: 'Responsive Blog UI' }
      ]
    },
    {
      id: 'digital-art-2024',
      name: 'Digital Art 2024',
      description: 'A digital art contest for surreal and fantasy artworks.',
      deadline: '2024-09-15',
      participants: 140,
      submissions: 90,
      winners: [
        { position: 1, name: 'Liam Wong', title: 'Neon Cityscape' },
        { position: 2, name: 'Maria Garcia', title: 'Surreal Portrait' },
        { position: 3, name: 'Chen Wei', title: 'Fantasy Forest' }
      ]
    }
  ];

  const handleManageCriteria = () => {
    // Logic to navigate or open criteria management
    navigate('/scoring-criteria');
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
                  onClick={handleManageCriteria}
                >
                  <Settings size={14} />
                  <span className="hidden sm:inline">Manage Criteria</span>
                  <span className="sm:hidden">Criteria</span>
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
            {/* Challenge Selection & Criteria Status */}
            <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>Selected Challenge</label>
                    <select
                      value={selectedChallenge}
                      onChange={(e) => setSelectedChallenge(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                    >
                      {challenges.map(challenge => (
                        <option key={challenge.id} value={challenge.id}>
                          {challenge.name} ({challenge.status})
                        </option>
                      ))}
                    </select>

                    {/* More details for selected challenge */}
                    {selectedChallengeData && (
                      <div className="mt-4 p-4 rounded-lg border bg-white" style={{borderColor: '#FFE4D6'}}>
                        <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>{selectedChallengeData.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium" style={{color: '#D87C5A'}}>Status:</span> {selectedChallengeData.status}</div>
                          <div><span className="font-medium" style={{color: '#D87C5A'}}>Start Date:</span> {selectedChallengeData.startDate || '2025-08-01'}</div>
                          <div><span className="font-medium" style={{color: '#D87C5A'}}>Deadline:</span> {selectedChallengeData.deadline || '2025-08-30'}</div>
                          <div><span className="font-medium" style={{color: '#D87C5A'}}>Participants:</span> {selectedChallengeData.participants || '210+'}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#5D3A00'}}>Scoring Criteria Status</label>
                    <div className={`p-3 rounded-lg border ${
                      selectedChallengeData?.hasCriteria 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {selectedChallengeData?.hasCriteria ? (
                        <div className="flex items-center gap-2">
                          <Trophy size={16} />
                          <span className="font-medium">Criteria Set - Winners Calculated</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Settings size={16} />
                          <span className="font-medium">No Criteria Set - Please Define Scoring</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Scoring Criteria Display */}
                {selectedChallengeData?.hasCriteria && (
                  <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: '#FFE4D6'}}>
                    <h3 className="font-medium mb-3" style={{color: '#5D3A00'}}>Current Scoring Weights:</h3>
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
                )}
              </div>
            </div>

            {selectedChallengeData?.hasCriteria ? (
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
            ) : (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scoring Criteria Set</h3>
                <p className="text-gray-500 mb-4">Please define scoring criteria before viewing winners.</p>
                <button
                  onClick={() => navigate('/scoring-criteria')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
                  style={{backgroundColor: '#D87C5A', color: 'white'}}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#B85A3A';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#D87C5A';
                  }}
                >
                  <Settings size={20} />
                  Set Scoring Criteria
                </button>
              </div>
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