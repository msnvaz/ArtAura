import React, { useState } from 'react';
import { ArrowLeft, Trophy, Settings, Heart, MessageCircle, ShoppingCart, Star, Shield, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScoringCriteria = () => {
  const navigate = useNavigate();
  const [selectedChallenge] = useState('React Component Challenge');
  const [criteria, setCriteria] = useState({
    likesWeight: 25,
    commentsWeight: 25,
    buyerInterestWeight: 25,
    expertEvaluationWeight: 25
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    <div className="min-h-screen" style={{ backgroundColor: '#fdf5e6' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/winner-selection')}
              className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-300 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-3xl font-bold text-amber-900">Advanced Winner Selection</h1>
                <p className="text-amber-700">Challenge: {selectedChallenge}</p>
              </div>
            </div>
          </div>
          
          {/* Step Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium">
              <span className="bg-white text-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              Criteria
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium">
              <span className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              Scoring
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium">
              <span className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              Results
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-amber-900">Set Scoring Criteria</h2>
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
                disabled={!isValidCriteria()}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  isValidCriteria()
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
                <p className="text-green-700">The scoring criteria has been saved and cannot be modified. Winners will be calculated based on these weights.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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
    </div>
  );
};

export default ScoringCriteria;