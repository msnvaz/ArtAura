import React, { useState } from 'react';
import { ArrowLeft, Trophy, Settings, Heart, MessageCircle, ShoppingCart, Star, Shield, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScoringCriteria = () => {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [criteria, setCriteria] = useState({
    likesWeight: 25,
    commentsWeight: 25,
    buyerInterestWeight: 25,
    expertEvaluationWeight: 25
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dummy data for newly created challenges
  const availableChallenges = [
    {
      id: 'modern-art-2025',
      name: 'Modern Art Challenge 2025',
      description: 'Create innovative digital artwork showcasing modern art principles',
      status: 'active',
      participants: 156,
      submissions: 89,
      deadline: '2025-08-15',
      hasCriteria: false
    },
    {
      id: 'digital-art-comp',
      name: 'Digital Art Competition',
      description: 'Showcase your digital art skills in this exciting competition',
      status: 'active', 
      participants: 203,
      submissions: 145,
      deadline: '2025-08-30',
      hasCriteria: false
    },
    {
      id: 'ai-art-challenge',
      name: 'AI Art Innovation Challenge',
      description: 'Create stunning artwork using artificial intelligence tools',
      status: 'active',
      participants: 89,
      submissions: 67,
      deadline: '2025-09-10',
      hasCriteria: true
    },
    {
      id: 'traditional-art-fest',
      name: 'Traditional Art Festival',
      description: 'Celebrate traditional art forms and techniques',
      status: 'draft',
      participants: 0,
      submissions: 0,
      deadline: '2025-09-25',
      hasCriteria: false
    }
  ];

  // Dummy contestant data for selected challenge
  const getContestantData = (challengeId) => {
    const baseContestants = [
      {
        id: 1,
        name: 'Sarah Johnson',
        artworkTitle: 'Digital Dreams',
        submissionDate: '2025-07-15',
        likes: 234,
        comments: 45,
        buyerInterest: 8.5,
        expertScore: 9.2,
        imageUrl: 'https://images.pexels.com/photos/1292241/pexels-photo-1292241.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 2,
        name: 'Michael Chen',
        artworkTitle: 'Abstract Fusion',
        submissionDate: '2025-07-16',
        likes: 189,
        comments: 32,
        buyerInterest: 7.8,
        expertScore: 8.9,
        imageUrl: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 3,
        name: 'Emma Rodriguez',
        artworkTitle: 'Vibrant Expressions',
        submissionDate: '2025-07-17',
        likes: 156,
        comments: 28,
        buyerInterest: 9.1,
        expertScore: 8.7,
        imageUrl: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 4,
        name: 'David Kim',
        artworkTitle: 'Cosmic Journey',
        submissionDate: '2025-07-18',
        likes: 201,
        comments: 38,
        buyerInterest: 8.3,
        expertScore: 9.0,
        imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 5,
        name: 'Lisa Park',
        artworkTitle: 'Nature\'s Symphony',
        submissionDate: '2025-07-19',
        likes: 178,
        comments: 35,
        buyerInterest: 8.8,
        expertScore: 8.6,
        imageUrl: 'https://images.pexels.com/photos/1212407/pexels-photo-1212407.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];

    // Modify data based on challenge type
    return baseContestants.map(contestant => ({
      ...contestant,
      challengeId: challengeId,
      // Add some variation based on challenge
      likes: contestant.likes + Math.floor(Math.random() * 50),
      comments: contestant.comments + Math.floor(Math.random() * 15),
      buyerInterest: Math.min(10, contestant.buyerInterest + (Math.random() - 0.5)),
      expertScore: Math.min(10, contestant.expertScore + (Math.random() - 0.5))
    }));
  };

  const selectedChallengeData = availableChallenges.find(c => c.id === selectedChallenge);
  const contestants = selectedChallenge ? getContestantData(selectedChallenge) : [];

  const handleWeightChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setCriteria(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const getTotalWeight = () => {
    return criteria.likesWeight + criteria.commentsWeight + criteria.buyerInterestWeight + criteria.expertEvaluationWeight;
  };

  const isValidCriteria = () => {
    return getTotalWeight() === 100 && Object.values(criteria).every(weight => weight > 0);
  };

  const handleSubmit = () => {
    if (!isValidCriteria()) {
      alert('Please ensure all weights are greater than 0 and total equals 100%');
      return;
    }
    setIsSubmitted(true);
    console.log('Scoring criteria submitted:', criteria);
  };

  const totalPercentage = getTotalWeight();

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

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #1e40af;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #1e40af;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>

      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />

      <div className="min-h-screen" style={{ backgroundColor: '#FFF5E1' }}>
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
                  <h1 className="text-2xl font-bold text-white">Advanced Winner Selection</h1>
                  <p className="text-gray-200">
                    {selectedChallengeData ? `Challenge: ${selectedChallengeData.name}` : 'Select a challenge to begin'}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  onClick={() => navigate('/winner-selection')}
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">Back</span>
                  <span className="sm:hidden">Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Step Navigation */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium border-2 btn-animate shadow-md" style={{
              borderColor: '#10B981',
              color: '#FFFFFF',
              backgroundColor: '#10B981',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <span className="bg-white text-emerald-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-sm">1</span>
              <span className="hidden sm:inline font-semibold">Criteria</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium border-2 btn-animate shadow-md" style={{
              borderColor: '#3B82F6',
              color: '#FFFFFF',
              backgroundColor: '#3B82F6',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <span className="bg-white text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-sm">2</span>
              <span className="hidden sm:inline font-semibold">Scoring</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium border-2 btn-animate shadow-md" style={{
              borderColor: '#8B5CF6',
              color: '#FFFFFF',
              backgroundColor: '#8B5CF6',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <span className="bg-white text-purple-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-sm">3</span>
              <span className="hidden sm:inline font-semibold">Results</span>
            </div>
          </div>

        {/* Main Content */}
        <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
          <div className="p-8">
            {/* Challenge Selection Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-semibold text-amber-900">Select Challenge & Set Scoring Criteria</h2>
              </div>

              {/* Challenge Selection */}
              <div className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
                <label className="block text-sm font-medium mb-3" style={{color: '#5D3A00'}}>
                  Choose a Challenge to Define Scoring Criteria
                </label>
                <select
                  value={selectedChallenge}
                  onChange={(e) => setSelectedChallenge(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg"
                  style={{borderColor: '#FFE4D6', backgroundColor: 'white', color: '#5D3A00'}}
                  disabled={isSubmitted}
                >
                  <option value="">Select a challenge...</option>
                  {availableChallenges.map(challenge => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.name} ({challenge.status}) - {challenge.participants} participants
                    </option>
                  ))}
                </select>

                {/* Challenge Details */}
                {selectedChallengeData && (
                  <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: '#FFE4D6'}}>
                    <h4 className="font-semibold mb-2" style={{color: '#5D3A00'}}>{selectedChallengeData.name}</h4>
                    <p className="text-sm mb-3" style={{color: '#D87C5A'}}>{selectedChallengeData.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium" style={{color: '#5D3A00'}}>Status:</span>
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          selectedChallengeData.status === 'active' ? 'bg-green-100 text-green-800' : 
                          selectedChallengeData.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedChallengeData.status}
                        </span>
                      </div>
                      <div><span className="font-medium" style={{color: '#5D3A00'}}>Participants:</span> <span style={{color: '#D87C5A'}}>{selectedChallengeData.participants}</span></div>
                      <div><span className="font-medium" style={{color: '#5D3A00'}}>Submissions:</span> <span style={{color: '#D87C5A'}}>{selectedChallengeData.submissions}</span></div>
                      <div><span className="font-medium" style={{color: '#5D3A00'}}>Deadline:</span> <span style={{color: '#D87C5A'}}>{selectedChallengeData.deadline}</span></div>
                    </div>
                    
                    {/* Criteria Status */}
                    <div className="mt-3 pt-3 border-t" style={{borderColor: '#D87C5A'}}>
                      <div className={`flex items-center gap-2 text-sm ${
                        selectedChallengeData.hasCriteria ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        <Settings size={16} />
                        <span className="font-medium">
                          {selectedChallengeData.hasCriteria ? 'Scoring criteria already defined' : 'No scoring criteria set - define below'}
                        </span>
                      </div>
                    </div>

                    {/* Current Contestants Preview */}
                    {contestants.length > 0 && (
                      <div className="mt-4 pt-3 border-t" style={{borderColor: '#D87C5A'}}>
                        <h5 className="font-medium mb-2" style={{color: '#5D3A00'}}>Current Contestants ({contestants.length})</h5>
                        <div className="flex -space-x-2">
                          {contestants.slice(0, 5).map(contestant => (
                            <img
                              key={contestant.id}
                              src={contestant.imageUrl}
                              alt={contestant.name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              title={`${contestant.name} - ${contestant.artworkTitle}`}
                            />
                          ))}
                          {contestants.length > 5 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium" style={{color: '#5D3A00'}}>
                              +{contestants.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scoring Criteria Section - Only show if challenge is selected */}
            {selectedChallenge && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="h-6 w-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-900">Define Scoring Criteria</h3>
                </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-amber-800">
                <span className="font-semibold">Important:</span> Once you lock these criteria, they cannot be changed. Make sure the total percentage equals 100% before proceeding.
              </p>
            </div>

          {/* Scoring Criteria Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Likes & Engagement Weight */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold">Likes & Engagement Weight</h3>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteria.likesWeight}
                  onChange={(e) => handleWeightChange('likesWeight', e.target.value)}
                  disabled={isSubmitted}
                  className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${criteria.likesWeight}%, #fef3c7 ${criteria.likesWeight}%, #fef3c7 100%)`
                  }}
                />
                <div className="flex justify-end mt-2">
                  <span className="text-2xl font-bold text-amber-900">{criteria.likesWeight}%</span>
                </div>
              </div>
              
              <p className="text-sm text-amber-700">Based on the number of likes received</p>
            </div>

            {/* Comments & Interaction Weight */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Comments & Interaction Weight</h3>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteria.commentsWeight}
                  onChange={(e) => handleWeightChange('commentsWeight', e.target.value)}
                  disabled={isSubmitted}
                  className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${criteria.commentsWeight}%, #fef3c7 ${criteria.commentsWeight}%, #fef3c7 100%)`
                  }}
                />
                <div className="flex justify-end mt-2">
                  <span className="text-2xl font-bold text-amber-900">{criteria.commentsWeight}%</span>
                </div>
              </div>
              
              <p className="text-sm text-amber-700">Based on the number of comments received</p>
            </div>

            {/* Buyer Interest Weight */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Buyer Interest Weight</h3>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteria.buyerInterestWeight}
                  onChange={(e) => handleWeightChange('buyerInterestWeight', e.target.value)}
                  disabled={isSubmitted}
                  className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${criteria.buyerInterestWeight}%, #fef3c7 ${criteria.buyerInterestWeight}%, #fef3c7 100%)`
                  }}
                />
                <div className="flex justify-end mt-2">
                  <span className="text-2xl font-bold text-amber-900">{criteria.buyerInterestWeight}%</span>
                </div>
              </div>
              
              <p className="text-sm text-amber-700">Based on buyer interest and purchase inquiries</p>
            </div>

            {/* Expert Evaluation Weight */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Expert Evaluation Weight</h3>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteria.expertEvaluationWeight}
                  onChange={(e) => handleWeightChange('expertEvaluationWeight', e.target.value)}
                  disabled={isSubmitted}
                  className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${criteria.expertEvaluationWeight}%, #fef3c7 ${criteria.expertEvaluationWeight}%, #fef3c7 100%)`
                  }}
                />
                <div className="flex justify-end mt-2">
                  <span className="text-2xl font-bold text-amber-900">{criteria.expertEvaluationWeight}%</span>
                </div>
              </div>
              
              <p className="text-sm text-amber-700">Based on scores from expert artist evaluators</p>
            </div>
          </div>

          {/* Total Percentage */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Total Percentage:</span>
              <span className={`text-3xl font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage}%
              </span>
            </div>
          </div>

            {/* Submit Button */}
            {!isSubmitted ? (
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!isValidCriteria() || !selectedChallenge}
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors btn-animate ${
                    isValidCriteria() && selectedChallenge
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🔒 Lock Criteria & Calculate Scores
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
                    <Trophy className="h-6 w-6" />
                    <span className="text-lg font-semibold">Criteria Successfully Locked!</span>
                  </div>
                  <p className="text-green-700">
                    The scoring criteria for "{selectedChallengeData?.name}" has been saved and cannot be modified. 
                    Winners will be calculated based on these weights.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/winner-selection')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-animate"
                    >
                      View Results & Winners
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
            )}

            {/* No Challenge Selected Message */}
            {!selectedChallenge && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Challenge Selected</h3>
                <p className="text-gray-500">Please select a challenge above to define its scoring criteria.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default ScoringCriteria;