import { ArrowLeft, Award, BarChart3, Heart, MessageCircle, Settings, ShoppingCart, Star, Trophy } from 'lucide-react';
import { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Scoring, 2: Results

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
        name: 'Nadeesha Perera',
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
        name: 'Kasun Fernando',
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
        name: 'Tharushi Silva',
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
        name: 'Amila Jayawardena',
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
        name: 'Sanduni Wijesekara',
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

  // Auto-generated scoring results (dummy data)
  const getScoringResults = (challengeId) => {
    if (!challengeId) return [];
    
    const contestants = getContestantData(challengeId);
    return contestants.map(contestant => {
      // Calculate normalized scores based on criteria weights
      const likesScore = Math.min(100, (contestant.likes / 250) * 100); // Normalize likes to 100
      const commentsScore = Math.min(100, (contestant.comments / 50) * 100); // Normalize comments to 100
      const buyerScore = contestant.buyerInterest * 10; // Convert 0-10 to 0-100
      const expertScore = contestant.expertScore * 10; // Convert 0-10 to 0-100
      
      // Calculate weighted total based on current criteria
      const totalScore = (
        (likesScore * criteria.likesWeight / 100) +
        (commentsScore * criteria.commentsWeight / 100) +
        (buyerScore * criteria.buyerInterestWeight / 100) +
        (expertScore * criteria.expertEvaluationWeight / 100)
      );

      return {
        ...contestant,
        scores: {
          likes: Math.round(likesScore),
          comments: Math.round(commentsScore),
          buyerInterest: Math.round(buyerScore),
          expertEvaluation: Math.round(expertScore),
          total: Math.round(totalScore * 100) / 100
        },
        weightedBreakdown: {
          likesContribution: Math.round((likesScore * criteria.likesWeight / 100) * 100) / 100,
          commentsContribution: Math.round((commentsScore * criteria.commentsWeight / 100) * 100) / 100,
          buyerContribution: Math.round((buyerScore * criteria.buyerInterestWeight / 100) * 100) / 100,
          expertContribution: Math.round((expertScore * criteria.expertEvaluationWeight / 100) * 100) / 100
        }
      };
    }).sort((a, b) => b.scores.total - a.scores.total);
  };

  const scoringResults = getScoringResults(selectedChallenge);

  // Step navigation and results
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Scoring & Evaluation';
      case 2: return 'Results & Final Scoring';
      default: return 'Scoring';
    }
  };

  const getStepColor = (step) => {
    if (step === currentStep) {
      switch (step) {
        case 1: return 'bg-[#7f5539] text-[#fdf9f4]';
        case 2: return 'bg-[#7f5539] text-[#fdf9f4]';
        case 3: return 'bg-[#7f5539] text-[#fdf9f4]';
        default: return 'bg-[#7f5539] text-[#fdf9f4]';
      }
    } else if (step < currentStep) {
      return 'bg-[#d87c5a] text-[#fdf9f4]';
    } else {
      return 'bg-gray-200 text-gray-600';
    }
  };

  const renderStepNavigation = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${getStepColor(1)}`}>
          1. Scoring
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${getStepColor(2)}`}>
          2. Results
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            currentStep === 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#7f5539] text-[#fdf9f4] hover:bg-[#6e4c34] btn-animate'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNextStep}
          disabled={currentStep === 2 || !selectedChallenge}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            currentStep === 2 || !selectedChallenge
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#7f5539] text-[#fdf9f4] hover:bg-[#6e4c34] btn-animate'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  const handleWeightChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setCriteria(prev => {
      // Calculate the sum if this field is set to numValue
      const newCriteria = { ...prev, [field]: numValue };
      const total =
        newCriteria.likesWeight +
        newCriteria.commentsWeight +
        newCriteria.buyerInterestWeight +
        newCriteria.expertEvaluationWeight;
      // If total is over 100, adjust the changed field to not exceed 100
      if (total > 100) {
        const over = total - 100;
        newCriteria[field] = Math.max(0, numValue - over);
      }
      return newCriteria;
    });
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
    
    // Show confirmation dialog
    const confirmMessage = `The scoring criteria for "${selectedChallengeData?.name}" will be saved and cannot be modified. Winners will be calculated based on these weights.\n\nAre you sure you want to proceed?`;
    
    if (window.confirm(confirmMessage)) {
      setIsSubmitted(true);
      console.log('Scoring criteria submitted:', criteria);
    }
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
                  <h1 className="text-2xl font-bold text-white">{getStepTitle()}</h1>
                  <p className="text-gray-200">
                    {currentStep === 1 && 'Review contestant performance and scoring metrics'}
                    {currentStep === 2 && 'View detailed results and scoring breakdowns'}
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
          {/* Challenge Selection */}
          <div className="bg-white rounded-lg border border-[#d87c5a] p-6 mb-6 shadow-sm">
            <label className="block text-sm font-medium mb-3" style={{color: '#362625'}}>
              Select Challenge for Winner Selection
            </label>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg"
              style={{borderColor: '#d87c5a', backgroundColor: 'white', color: '#362625'}}
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
              <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: '#f4e8dc'}}>
                <h4 className="font-semibold mb-2" style={{color: '#362625'}}>{selectedChallengeData.name}</h4>
                <p className="text-sm mb-3" style={{color: '#7f5539'}}>{selectedChallengeData.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium" style={{color: '#362625'}}>Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      selectedChallengeData.status === 'active' ? 'bg-green-100 text-green-800' : 
                      selectedChallengeData.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedChallengeData.status}
                    </span>
                  </div>
                  <div><span className="font-medium" style={{color: '#362625'}}>Participants:</span> <span style={{color: '#7f5539'}}>{selectedChallengeData.participants}</span></div>
                  <div><span className="font-medium" style={{color: '#362625'}}>Submissions:</span> <span style={{color: '#7f5539'}}>{selectedChallengeData.submissions}</span></div>
                  <div><span className="font-medium" style={{color: '#362625'}}>Deadline:</span> <span style={{color: '#7f5539'}}>{selectedChallengeData.deadline}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          {renderStepNavigation()}

          {/* Scoring Step - Step 1 */}
          {currentStep === 1 && selectedChallenge && (
            <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-6 w-6 text-[#7f5539]" />
                  <h2 className="text-2xl font-semibold text-[#362625]">Scoring & Evaluation</h2>
                </div>
                
                <div className="bg-[#f4e8dc] border border-[#d87c5a] rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium text-[#362625] mb-4">
                    Challenge: {selectedChallengeData?.name}
                  </h3>
                  <p className="text-[#7f5539] mb-4">
                    Review current scoring criteria and contestant performance metrics
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                      <div className="text-2xl font-bold text-[#7f5539]">{criteria.likesWeight}%</div>
                      <div className="text-sm text-[#362625]">Social Engagement</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                      <div className="text-2xl font-bold text-[#7f5539]">{criteria.commentsWeight}%</div>
                      <div className="text-sm text-[#362625]">Community Interaction</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                      <div className="text-2xl font-bold text-[#7f5539]">{criteria.buyerInterestWeight}%</div>
                      <div className="text-sm text-[#362625]">Market Appeal</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                      <div className="text-2xl font-bold text-[#7f5539]">{criteria.expertEvaluationWeight}%</div>
                      <div className="text-sm text-[#362625]">Expert Assessment</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Contestant Performance Preview</h3>
                  <div className="grid gap-4">
                    {contestants.slice(0, 3).map((contestant, index) => (
                      <div key={contestant.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{contestant.name}</h4>
                            <p className="text-sm text-gray-500">Artwork: {contestant.artwork}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#7f5539]">
                              {scoringResults[index]?.scores.total}
                            </div>
                            <div className="text-sm text-gray-500">Projected Score</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{contestant.likes}</div>
                            <div className="text-xs text-gray-500">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{contestant.comments}</div>
                            <div className="text-xs text-gray-500">Comments</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{contestant.buyerInterest}/10</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{contestant.expertScore}/10</div>
                            <div className="text-xs text-gray-500">Expert</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Step - Step 2 */}
          {currentStep === 2 && selectedChallenge && (
            <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-[#7f5539]" />
                  <h2 className="text-2xl font-semibold text-[#362625]">Results & Final Scoring</h2>
                </div>
                
                <div className="bg-[#f4e8dc] border border-[#d87c5a] rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium text-[#362625] mb-2">
                    Final Results: {selectedChallengeData?.name}
                  </h3>
                  <p className="text-[#7f5539] mb-4">
                    Complete scoring breakdown and final rankings
                  </p>
                  <div className="text-sm text-[#7f5539]">
                    Total Participants: {contestants.length} • Evaluation Complete
                  </div>
                </div>

                {/* Final Rankings */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Final Rankings</h3>
                    <div className="text-sm text-gray-500">
                      Ranked by weighted total score
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {scoringResults.map((result, index) => (
                      <div key={result.id} className={`bg-white rounded-lg p-6 border-2 shadow-lg transition-all duration-200 ${
                        index === 0 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' :
                        index === 1 ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50' :
                        index === 2 ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-red-50' :
                        'border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-500 text-white' :
                              index === 2 ? 'bg-orange-500 text-white' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{result.name}</h4>
                              <p className="text-gray-600">{result.artwork}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-[#7f5539]">
                              {result.scores.total}
                            </div>
                            <div className="text-sm text-gray-500">Total Score</div>
                          </div>
                        </div>

                        {/* Detailed Score Breakdown */}
                        <div className="border-t border-gray-200 pt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Score Breakdown</h5>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-sm text-blue-600 font-medium">Social Engagement</div>
                              <div className="text-lg font-bold text-blue-800">{result.scores.likes}</div>
                              <div className="text-xs text-blue-600">
                                Weighted: {result.weightedBreakdown.likesContribution}
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-sm text-green-600 font-medium">Community</div>
                              <div className="text-lg font-bold text-green-800">{result.scores.comments}</div>
                              <div className="text-xs text-green-600">
                                Weighted: {result.weightedBreakdown.commentsContribution}
                              </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3">
                              <div className="text-sm text-orange-600 font-medium">Market Appeal</div>
                              <div className="text-lg font-bold text-orange-800">{result.scores.buyerInterest}</div>
                              <div className="text-xs text-orange-600">
                                Weighted: {result.weightedBreakdown.buyerContribution}
                              </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                              <div className="text-sm text-purple-600 font-medium">Expert Review</div>
                              <div className="text-lg font-bold text-purple-800">{result.scores.expertEvaluation}</div>
                              <div className="text-xs text-purple-600">
                                Weighted: {result.weightedBreakdown.expertContribution}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Raw Performance Data</h5>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Likes:</span>
                              <span className="font-medium ml-2">{result.likes}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Comments:</span>
                              <span className="font-medium ml-2">{result.comments}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Buyer Interest:</span>
                              <span className="font-medium ml-2">{result.buyerInterest}/10</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Expert Score:</span>
                              <span className="font-medium ml-2">{result.expertScore}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScoringCriteria;