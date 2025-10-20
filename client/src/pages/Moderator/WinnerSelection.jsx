import axios from 'axios';
import { Check, Copy, Gift, Mail, Phone, Send, Shield, Store, ThumbsDown, ThumbsUp, Trophy, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WinnerSelection = () => {
  const navigate = useNavigate();
  
  // State for fetching challenges with winners from database
  const [challengesWithWinners, setChallengesWithWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null); // Track which code was copied
  
  // State for rewards modal
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [selectedChallengeForRewards, setSelectedChallengeForRewards] = useState(null);
  const [rewardsData, setRewardsData] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);

  // Fetch completed challenges and their winners on component mount
  useEffect(() => {
    const fetchCompletedChallengesWithWinners = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch completed challenges
        const challengesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/challenges/completed`,
          {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          }
        );
        
        console.log('✅ Fetched completed challenges:', challengesResponse.data.length);
        
        // Fetch winners and sponsorship status for each challenge
        const challengesWithWinnersData = await Promise.all(
          challengesResponse.data.map(async (challenge) => {
            try {
              // Fetch winners
              const winnersResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/challenges/${challenge.id}/winners`,
                {
                  headers: token ? {
                    'Authorization': `Bearer ${token}`
                  } : {}
                }
              );
              
              // Fetch sponsorship offers to check if any rewards are sent
              let hasValidRewards = false;
              try {
                const sponsorshipsResponse = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/sponsorships/offers/challenge/${challenge.id}`,
                  {
                    headers: token ? {
                      'Authorization': `Bearer ${token}`
                    } : {}
                  }
                );
                // Check if any sponsorship has status 'valid'
                hasValidRewards = sponsorshipsResponse.data?.some(reward => reward.status === 'valid') || false;
              } catch (err) {
                console.log(`No sponsorships for challenge ${challenge.id}`);
              }
              
              return {
                ...challenge,
                winners: winnersResponse.data || [],
                hasValidRewards: hasValidRewards
              };
            } catch (err) {
              console.error(`Error fetching winners for challenge ${challenge.id}:`, err);
              return {
                ...challenge,
                winners: [],
                hasValidRewards: false
              };
            }
          })
        );
        
        setChallengesWithWinners(challengesWithWinnersData);
        console.log('✅ Fetched challenges with winners:', challengesWithWinnersData.length);
      } catch (err) {
        console.error('❌ Error fetching completed challenges:', err);
        setError('Failed to load completed challenges');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompletedChallengesWithWinners();
  }, []);

  // Function to copy discount code to clipboard
  const copyDiscountCode = async (code, challengeId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(challengeId);
      setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy code');
    }
  };

  // Function to open rewards modal and fetch sponsorship data
  const openRewardsModal = async (challenge) => {
    console.log('🔍 Opening rewards modal for challenge:', challenge.id, challenge.title);
    console.log('🔍 Full challenge object:', challenge);
    setSelectedChallengeForRewards(challenge);
    setShowRewardsModal(true);
    setLoadingRewards(true);
    setRewardsData([]);
    
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL}/api/sponsorships/offers/challenge/${challenge.id}`;
      console.log('🔄 Fetching from URL:', url);
      console.log('🔑 Token present:', !!token);
      
      const response = await axios.get(url, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      console.log('✅ Full API response:', response);
      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', response.data);
      console.log('✅ Response data type:', typeof response.data);
      console.log('✅ Is array:', Array.isArray(response.data));
      console.log('📊 Number of rewards:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log('📋 First reward details:', response.data[0]);
        console.log('📋 All rewards:', JSON.stringify(response.data, null, 2));
      }
      
      setRewardsData(response.data || []);
      console.log('✅ Rewards data set in state');
    } catch (err) {
      console.error('❌ Error fetching rewards:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error message:', err.message);
      console.error('❌ Full error:', JSON.stringify(err, null, 2));
      setRewardsData([]);
    } finally {
      setLoadingRewards(false);
      console.log('✅ Loading complete');
    }
  };

  // Function to close rewards modal
  const closeRewardsModal = () => {
    setShowRewardsModal(false);
    setSelectedChallengeForRewards(null);
    setRewardsData([]);
  };

  // Function to send reward to winner (update status to 'valid')
  const sendRewardToWinner = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/sponsorships/offers/${offerId}/status`,
        { status: 'valid' },
        {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Reward sent successfully:', response.data);
      
      // Refresh the rewards data in modal
      if (selectedChallengeForRewards) {
        const updatedRewards = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sponsorships/offers/challenge/${selectedChallengeForRewards.id}`,
          {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          }
        );
        setRewardsData(updatedRewards.data || []);
        
        // Update the main challenges list to reflect the button change
        setChallengesWithWinners(prevChallenges => 
          prevChallenges.map(challenge => 
            challenge.id === selectedChallengeForRewards.id 
              ? { ...challenge, hasValidRewards: true }
              : challenge
          )
        );
      }
      
      alert('Reward sent to winner successfully!');
    } catch (err) {
      console.error('❌ Error sending reward:', err);
      alert('Failed to send reward: ' + (err.response?.data?.message || err.message));
    }
  };

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
            {/* View Winners Section */}
            <div className="rounded-lg shadow-sm border p-6" style={{backgroundColor: '#FFF5E1'}}>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6" style={{color: '#D87C5A'}} />
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight" style={{color: '#5D3A00'}}>Completed Challenges Winners</h2>
                  <p className="text-sm font-light italic" style={{color: '#7f5539'}}>View winners for all completed challenges</p>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#D87C5A'}}></div>
                  <p className="text-sm font-medium" style={{color: '#7f5539'}}>Loading challenges...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-sm font-medium" style={{color: '#D87C5A'}}>{error}</p>
                </div>
              )}

              {/* No Challenges State */}
              {!loading && !error && challengesWithWinners.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto mb-4" style={{color: '#D87C5A', opacity: 0.4}} />
                  <h3 className="text-lg font-bold mb-2" style={{color: '#362625'}}>No Completed Challenges Found</h3>
                  <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                    There are no completed challenges in the database yet.
                  </p>
                </div>
              )}

              {/* Challenges List */}
              {!loading && !error && challengesWithWinners.length > 0 && (
                <div className="space-y-8">
                  {challengesWithWinners.map((challenge) => (
                    <div key={challenge.id} className="border rounded-lg p-6" style={{backgroundColor: 'white', borderColor: '#D87C5A'}}>
                      {/* Challenge Header */}
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold" style={{color: '#362625'}}>
                            {challenge.title}
                          </h3>
                          {/* Discount Code Button */}
                          {challenge.discountCode && (
                            <button
                              onClick={() => copyDiscountCode(challenge.discountCode, challenge.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                              style={{
                                backgroundColor: copiedCode === challenge.id ? '#4CAF50' : '#D87C5A',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              {copiedCode === challenge.id ? (
                                <>
                                  <Check size={16} />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={16} />
                                  <span className="font-mono">{challenge.discountCode}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center flex-wrap gap-3 text-sm mb-3" style={{color: '#7f5539'}}>
                          <span className="flex items-center gap-1">
                            <Trophy size={14} />
                            Completed: {new Date(challenge.deadlineDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {challenge.participantCount || 0} Participants
                          </span>
                          
                          {challenge.category && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}>
                              {challenge.category}
                            </span>
                          )}
                        </div>
                        
                        {challenge.description && (
                          <p className="mt-2 text-sm" style={{color: '#7f5539'}}>
                            {challenge.description}
                          </p>
                        )}

                        {/* Send Reward to Winner / View Rewards Button */}
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              console.log('🎯 Button clicked for challenge:', challenge);
                              console.log('🎯 Challenge ID:', challenge.id);
                              console.log('🎯 Challenge ID type:', typeof challenge.id);
                              console.log('🎯 Has valid rewards:', challenge.hasValidRewards);
                              openRewardsModal(challenge);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                            style={{
                              backgroundColor: challenge.hasValidRewards ? '#4CAF50' : '#D87C5A',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {challenge.hasValidRewards ? (
                              <>
                                <Check size={18} />
                                <span>View Rewards</span>
                              </>
                            ) : (
                              <>
                                <Gift size={18} />
                                <span>Send Reward to Winner</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Winners */}
                      {challenge.winners && challenge.winners.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="text-lg font-bold mb-3" style={{color: '#362625'}}>
                            🏆 Winners
                          </h4>
                          {challenge.winners.map((winner, index) => (
                            <div 
                              key={winner.id || index} 
                              className="p-4 border rounded-lg"
                              style={{borderColor: '#FFE4D6', backgroundColor: '#FFF5E1'}}
                            >
                              <div className="flex items-start gap-4">
                                {/* Position Badge */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white flex-shrink-0"
                                  style={{backgroundColor: index === 0 ? '#D4AF37' : index === 1 ? '#C0C0C0' : '#CD7F32'}}>
                                  {winner.position || index + 1}
                                </div>

                                {/* Artist Avatar */}
                                {winner.artistAvatar && (
                                  <img 
                                    src={winner.artistAvatar} 
                                    alt={winner.artistName}
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                    style={{border: '2px solid #D87C5A'}}
                                  />
                                )}

                                {/* Winner Info */}
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-bold text-lg" style={{color: '#362625'}}>
                                        {winner.artistName || `Artist ${winner.artistId}`}
                                      </p>
                                      {winner.artworkTitle && (
                                        <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                                          📷 {winner.artworkTitle}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {/* Score */}
                                    {winner.marks !== undefined && winner.marks !== null && (
                                      <div className="text-right">
                                        <p className="font-bold text-2xl" style={{color: '#D87C5A'}}>
                                          {winner.marks}
                                        </p>
                                        <p className="text-xs" style={{color: '#7f5539'}}>points</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Artwork Description */}
                                  {winner.artworkDescription && (
                                    <p className="text-sm mb-2" style={{color: '#7f5539'}}>
                                      {winner.artworkDescription}
                                    </p>
                                  )}

                                  {/* Like/Dislike Counts */}
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1" style={{color: '#4CAF50'}}>
                                      <ThumbsUp size={14} />
                                      <span className="font-semibold">{winner.likesCount || 0}</span> Likes
                                    </span>
                                    <span className="flex items-center gap-1" style={{color: '#F44336'}}>
                                      <ThumbsDown size={14} />
                                      <span className="font-semibold">{winner.dislikesCount || 0}</span> Dislikes
                                    </span>
                                  </div>

                                  {/* Submission Date */}
                                  {winner.submissionDate && (
                                    <p className="text-xs mt-2" style={{color: '#7f5539'}}>
                                      Submitted: {new Date(winner.submissionDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Trophy className="h-12 w-12 mx-auto mb-3" style={{color: '#D87C5A', opacity: 0.3}} />
                          <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                            No winners declared yet for this challenge
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rewards Modal */}
        {showRewardsModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeRewardsModal}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{backgroundColor: '#FFF5E1'}}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b" style={{backgroundColor: '#D87C5A', borderColor: '#5D3A00'}}>
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Challenge Rewards & Sponsorships</h2>
                </div>
                <button
                  onClick={closeRewardsModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Challenge Info */}
                {selectedChallengeForRewards && (
                  <div className="mb-6 p-4 rounded-lg border" style={{backgroundColor: 'white', borderColor: '#FFE4D6'}}>
                    <h3 className="text-xl font-bold mb-2" style={{color: '#362625'}}>
                      {selectedChallengeForRewards.title}
                    </h3>
                    <p className="text-sm" style={{color: '#7f5539'}}>
                      {selectedChallengeForRewards.description}
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {loadingRewards && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#D87C5A'}}></div>
                    <p className="text-sm font-medium" style={{color: '#7f5539'}}>Loading rewards...</p>
                  </div>
                )}

                {/* No Rewards */}
                {!loadingRewards && rewardsData.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="h-16 w-16 mx-auto mb-4" style={{color: '#D87C5A', opacity: 0.4}} />
                    <h3 className="text-lg font-bold mb-2" style={{color: '#362625'}}>No Sponsorships Found</h3>
                    <p className="text-sm font-medium mb-3" style={{color: '#7f5539'}}>
                      This challenge doesn't have any sponsorship offers in the database yet.
                    </p>
                    {selectedChallengeForRewards && (
                      <div className="mt-4 p-4 rounded-lg text-left max-w-md mx-auto" style={{backgroundColor: '#FFE4D6'}}>
                        <p className="text-xs font-semibold mb-2" style={{color: '#5D3A00'}}>
                          💡 Debug Info:
                        </p>
                        <p className="text-xs mb-1" style={{color: '#7f5539'}}>
                          Challenge ID: <span className="font-mono font-bold">{selectedChallengeForRewards.id}</span>
                        </p>
                        <p className="text-xs mb-1" style={{color: '#7f5539'}}>
                          Challenge Title: <span className="font-semibold">{selectedChallengeForRewards.title}</span>
                        </p>
                        <p className="text-xs mb-1" style={{color: '#7f5539'}}>
                          Rewards Data Length: <span className="font-mono font-bold">{rewardsData.length}</span>
                        </p>
                        <p className="text-xs mb-1" style={{color: '#7f5539'}}>
                          Loading State: <span className="font-mono font-bold">{loadingRewards ? 'true' : 'false'}</span>
                        </p>
                        <p className="text-xs mt-3 p-2 rounded" style={{color: '#5D3A00', backgroundColor: '#FFD95A'}}>
                          <strong>Check browser console (F12) for detailed API response!</strong>
                        </p>
                        <p className="text-xs mt-2" style={{color: '#7f5539'}}>
                          To add sponsorships, shops need to create offers for this challenge through the Shop Dashboard.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Rewards List */}
                {!loadingRewards && rewardsData.length > 0 && (
                  <div className="space-y-4">
                    {rewardsData.map((reward, index) => (
                      <div 
                        key={reward.id || index} 
                        className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                        style={{backgroundColor: 'white', borderColor: '#D87C5A'}}
                      >
                        {/* Reward Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full" style={{backgroundColor: '#FFE4D6'}}>
                              <Store className="h-6 w-6" style={{color: '#D87C5A'}} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold" style={{color: '#362625'}}>
                                {reward.shopName}
                              </h4>
                              {reward.shopOwnerName && (
                                <p className="text-sm" style={{color: '#7f5539'}}>
                                  Owner: {reward.shopOwnerName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Discount Badge */}
                          <div className="text-center px-4 py-2 rounded-lg" style={{backgroundColor: '#4CAF50'}}>
                            <p className="text-2xl font-bold text-white">
                              {reward.discountPercentage}%
                            </p>
                            <p className="text-xs text-white">OFF</p>
                          </div>
                        </div>

                        {/* Shop Description */}
                        {reward.shopDescription && (
                          <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{color: '#7f5539', backgroundColor: '#FFF5E1'}}>
                            {reward.shopDescription}
                          </p>
                        )}

                        {/* Shop Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {reward.shopEmail && (
                            <div className="flex items-center gap-2 text-sm p-2 rounded" style={{backgroundColor: '#FFF5E1'}}>
                              <Mail size={16} style={{color: '#D87C5A'}} />
                              <a href={`mailto:${reward.shopEmail}`} className="hover:underline" style={{color: '#362625'}}>
                                {reward.shopEmail}
                              </a>
                            </div>
                          )}
                          {reward.shopContactNo && (
                            <div className="flex items-center gap-2 text-sm p-2 rounded" style={{backgroundColor: '#FFF5E1'}}>
                              <Phone size={16} style={{color: '#D87C5A'}} />
                              <a href={`tel:${reward.shopContactNo}`} className="hover:underline" style={{color: '#362625'}}>
                                {reward.shopContactNo}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Discount Code */}
                        <div className="border-t pt-4" style={{borderColor: '#FFE4D6'}}>
                          <p className="text-sm font-medium mb-2" style={{color: '#7f5539'}}>Discount Code:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-2 rounded-lg font-mono text-lg font-bold" style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}>
                              {reward.discountCode}
                            </code>
                            <button
                              onClick={() => copyDiscountCode(reward.discountCode, reward.id)}
                              className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                              style={{
                                backgroundColor: copiedCode === reward.id ? '#4CAF50' : '#D87C5A',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              {copiedCode === reward.id ? (
                                <>
                                  <Check size={16} />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={16} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Status and Send to Winner Section */}
                        <div className="border-t mt-4 pt-4" style={{borderColor: '#FFE4D6'}}>
                          <div className="flex items-center justify-between">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{color: '#7f5539'}}>Status:</p>
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{
                                  backgroundColor: reward.status === 'valid' ? '#4CAF50' : '#FFA726',
                                  color: 'white'
                                }}
                              >
                                {reward.status === 'valid' ? '✓ Sent to Winner' : '⏳ Pending'}
                              </span>
                            </div>

                            {/* Send to Winner / View Reward Button */}
                            {reward.status !== 'valid' ? (
                              <button
                                onClick={() => sendRewardToWinner(reward.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                                style={{
                                  backgroundColor: '#4CAF50',
                                  color: 'white',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <Send size={16} />
                                <span>Send to Winner</span>
                              </button>
                            ) : (
                              <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                                style={{
                                  backgroundColor: '#5D3A00',
                                  color: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  opacity: 0.8
                                }}
                                onClick={() => {
                                  // Scroll to discount code section
                                  console.log('Reward already sent - viewing details');
                                }}
                              >
                                <Check size={16} />
                                <span>Reward Sent</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Created Date */}
                        {reward.createdAt && (
                          <p className="text-xs mt-3" style={{color: '#7f5539'}}>
                            Sponsorship offered on: {new Date(reward.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 border-t p-4" style={{backgroundColor: 'white', borderColor: '#FFE4D6'}}>
                <button
                  onClick={closeRewardsModal}
                  className="w-full px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: '#D87C5A',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WinnerSelection;