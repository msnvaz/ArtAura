import React, { useState } from 'react';
import { Award, Star, Trophy, Medal, Crown, Filter, Search, Calendar, User, Settings, Calculator, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const WinnerSelection = () => {
  const [selectedChallenge, setSelectedChallenge] = useState('web-design-2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalScore');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(null);

  const challenges = [
    { id: 'web-design-2024', name: 'Web Design Challenge 2024', status: 'active', hasCriteria: true },
    { id: 'mobile-app-innovation', name: 'Mobile App Innovation', status: 'review', hasCriteria: true },
    { id: 'ai-art-competition', name: 'AI Art Competition', status: 'completed', hasCriteria: false }
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

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Winner Selection</h1>
          <p className="text-amber-700 mt-2">View calculated winners based on scoring criteria</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/scoring-criteria"
            className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            <Settings size={20} />
            Manage Scoring Criteria
          </Link>
        </div>
      </div>

      {/* Challenge Selection & Criteria Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">Selected Challenge</label>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {challenges.map(challenge => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.name} ({challenge.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">Scoring Criteria Status</label>
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
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-medium text-amber-900 mb-3">Current Scoring Weights:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-amber-800">{scoringCriteria.likesWeight}%</div>
                <div className="text-amber-600">Likes</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-amber-800">{scoringCriteria.commentsWeight}%</div>
                <div className="text-amber-600">Comments</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-amber-800">{scoringCriteria.buyerPreferenceWeight}%</div>
                <div className="text-amber-600">Buyer Preference</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-amber-800">{scoringCriteria.expertPanelWeight}%</div>
                <div className="text-amber-600">Expert Panel</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedChallengeData?.hasCriteria ? (
        <>
          {/* Search and Sort */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="totalScore">Total Score</option>
                  <option value="likes">Likes</option>
                  <option value="expertScore">Expert Score</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Winner Podium */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">Winners</h2>
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
                          <Calculator className="h-4 w-4 text-amber-500" />
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

          {/* Submissions List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border-2 ${submission.position ? getPositionColor(submission.position) : 'border-gray-200'}`}>
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={submission.imageUrl}
                      alt={submission.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
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
                          <p className="font-medium">{submission.participant}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Total Score:</span>
                          <p className="font-bold text-amber-800">{submission.totalScore}/100</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Likes:</span>
                          <p className="font-medium">{submission.likes}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Expert Score:</span>
                          <p className="font-medium">{submission.expertScore}/10</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {submission.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setShowScoreBreakdown(showScoreBreakdown === submission.id ? null : submission.id)}
                        className="flex items-center gap-2 px-4 py-2 text-amber-800 hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        Score Details
                      </button>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  {showScoreBreakdown === submission.id && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Likes ({scoringCriteria.likesWeight}%)</div>
                          <div className="font-semibold">{submission.likesScore}/100</div>
                          <div className="text-xs text-gray-500">{submission.likes} likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Comments ({scoringCriteria.commentsWeight}%)</div>
                          <div className="font-semibold">{submission.commentsScore}/100</div>
                          <div className="text-xs text-gray-500">{submission.comments} comments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Buyer Preference ({scoringCriteria.buyerPreferenceWeight}%)</div>
                          <div className="font-semibold">{submission.buyerScore}/100</div>
                          <div className="text-xs text-gray-500">{submission.buyerPreference}/10 avg</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Expert Panel ({scoringCriteria.expertPanelWeight}%)</div>
                          <div className="font-semibold">{submission.expertScoreNormalized}/100</div>
                          <div className="text-xs text-gray-500">{submission.expertScore}/10 avg</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t text-center">
                        <div className="text-sm text-gray-600">Weighted Total Score</div>
                        <div className="text-xl font-bold text-amber-800">{calculateWeightedScore(submission)}/100</div>
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
          <Link
            to="/scoring-criteria"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            <Settings size={20} />
            Set Scoring Criteria
          </Link>
        </div>
      )}
    </div>
  );
};

export default WinnerSelection;