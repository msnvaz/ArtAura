import React, { useState } from 'react';
import { 
  Gift, 
  Plus, 
  Calendar, 
  Trophy, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Package,
  Percent,
  Star,
  Send
} from 'lucide-react';

const SponsorshipRequests = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [rewardType, setRewardType] = useState('gift');
  const [requestForm, setRequestForm] = useState({
    rewardType: 'gift',
    rewardValue: '',
    rewardDescription: '',
    quantity: '',
    terms: '',
    sponsorshipAmount: ''
  });


  // Available challenges for sponsorship
  const availableChallenges = [
    {
      id: 1,
      title: 'Winter Landscapes Challenge',
      description: 'Capture the beauty of winter in artistic interpretations',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      participants: 45,
      maxParticipants: 100,
      currentSponsors: 2,
      totalPrizePool: '$800',
      category: 'Painting',
      difficulty: 'Intermediate',
      organizer: 'Art Community Moderators',
      image: 'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Digital Art Revolution',
      description: 'Showcase the future of digital artistic expression',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      participants: 32,
      maxParticipants: 80,
      currentSponsors: 1,
      totalPrizePool: '$1,200',
      category: 'Digital Art',
      difficulty: 'Advanced',
      organizer: 'Digital Arts Collective',
      image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Portrait Masters Competition',
      description: 'Create compelling portraits that showcase emotion',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      participants: 28,
      maxParticipants: 60,
      currentSponsors: 0,
      totalPrizePool: '$600',
      category: 'Portrait',
      difficulty: 'Expert',
      organizer: 'Portrait Society',
      image: 'https://images.pexels.com/photos/1742370/pexels-photo-1742370.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Shop's sponsorship requests
  const myRequests = [
    {
      id: 1,
      challengeTitle: 'Winter Landscapes Challenge',
      rewardType: 'gift',
      rewardDescription: 'Professional Acrylic Paint Set (24 colors)',
      rewardValue: '$120',
      quantity: 3,
      status: 'pending',
      submittedDate: '2024-01-10',
      moderatorNotes: '',
      sponsorshipAmount: '$360'
    },
    {
      id: 2,
      challengeTitle: 'Digital Art Revolution',
      rewardType: 'voucher',
      rewardDescription: '30% discount on all digital art supplies',
      rewardValue: '30%',
      quantity: 5,
      status: 'approved',
      submittedDate: '2024-01-08',
      moderatorNotes: 'Great contribution to the digital art community!',
      sponsorshipAmount: '$200'
    },
    {
      id: 3,
      challengeTitle: 'Abstract Expressions',
      rewardType: 'gift',
      rewardDescription: 'Premium Canvas Set with Easel',
      rewardValue: '$200',
      quantity: 1,
      status: 'rejected',
      submittedDate: '2024-01-05',
      moderatorNotes: 'Challenge already has sufficient sponsorship for this category.',
      sponsorshipAmount: '$200'
    }
  ];

  const handleRequestSponsorship = (challenge) => {
    setSelectedChallenge(challenge);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    // Handle form submission logic here
    console.log('Sponsorship request submitted:', {
      challenge: selectedChallenge,
      ...requestForm
    });
    setShowRequestModal(false);
    setRequestForm({
      rewardType: 'gift',
      rewardValue: '',
      rewardDescription: '',
      quantity: '',
      terms: '',
      sponsorshipAmount: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-brown p-3 rounded-full">
                <Gift className="h-8 w-8 text-cream" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brown">Sponsorship Center</h1>
                <p className="text-brown/70">Support art challenges and grow your brand</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition-colors font-medium flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Sponsorship History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-cream/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'available', label: 'Available Challenges', count: availableChallenges.length },
                { id: 'requests', label: 'My Requests', count: myRequests.length },
                { id: 'active', label: 'Active Sponsorships' },
                { id: 'rewards', label: 'Reward Distribution' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brown text-brown'
                      : 'border-transparent text-brown/60 hover:text-brown hover:border-brown/30'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 bg-brown/10 text-brown px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Available Challenges Tab */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            {availableChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={challenge.image}
                      alt={challenge.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-brown mb-2">{challenge.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-brown/60 mb-2">
                          <span className="bg-brown/10 text-brown px-2 py-1 rounded-full">{challenge.category}</span>
                          <span className="bg-brown/10 text-brown px-2 py-1 rounded-full">{challenge.difficulty}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-brown">{challenge.totalPrizePool}</div>
                        <div className="text-sm text-brown/60">Current Prize Pool</div>
                      </div>
                    </div>
                    
                    <p className="text-brown/70 mb-4">{challenge.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-brown">{challenge.participants}</div>
                        <div className="text-xs text-brown/60">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-brown">{challenge.currentSponsors}</div>
                        <div className="text-xs text-brown/60">Sponsors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-brown">{challenge.startDate}</div>
                        <div className="text-xs text-brown/60">Start Date</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-brown">{challenge.endDate}</div>
                        <div className="text-xs text-brown/60">End Date</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-brown/60">
                        Organized by {challenge.organizer}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRequestSponsorship(challenge)}
                          className="bg-brown text-cream px-6 py-2 rounded-lg hover:bg-brown/90 transition-colors font-medium flex items-center space-x-2"
                        >
                          <Gift className="h-4 w-4" />
                          <span>Sponsor Challenge</span>
                        </button>
                        <button className="border border-brown text-brown px-6 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium">
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-brown/60 mb-1">
                        <span>Participation Progress</span>
                        <span>{Math.round((challenge.participants / challenge.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-cream/50 rounded-full h-2">
                        <div
                          className="bg-brown h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(challenge.participants / challenge.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {myRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-brown mb-2">{request.challengeTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-brown/60">Reward Type:</span>
                        <div className="font-medium text-brown capitalize flex items-center space-x-1 mt-1">
                          {request.rewardType === 'gift' ? <Package className="h-4 w-4" /> : <Percent className="h-4 w-4" />}
                          <span>{request.rewardType}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-brown/60">Value:</span>
                        <div className="font-medium text-brown mt-1">{request.rewardValue}</div>
                      </div>
                      <div>
                        <span className="text-brown/60">Quantity:</span>
                        <div className="font-medium text-brown mt-1">{request.quantity}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-cream/30 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-brown mb-2">Reward Description</h4>
                  <p className="text-brown/70">{request.rewardDescription}</p>
                </div>

                {request.moderatorNotes && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    request.status === 'approved' ? 'bg-green-50 border border-green-200' :
                    request.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className="font-medium text-brown mb-2">Moderator Notes</h4>
                    <p className="text-brown/70">{request.moderatorNotes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-brown/60">
                  <span>Submitted: {request.submittedDate}</span>
                  <span>Sponsorship Amount: <span className="font-semibold text-brown">{request.sponsorshipAmount}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'active' || activeTab === 'rewards') && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Gift className="h-16 w-16 text-brown/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brown mb-2">
              {activeTab === 'active' ? 'Active Sponsorships' : 'Reward Distribution'}
            </h3>
            <p className="text-brown/70">
              {activeTab === 'active' 
                ? 'Track your ongoing sponsorship commitments and their performance'
                : 'Manage reward distribution to challenge winners'
              }
            </p>
          </div>
        )}

        {/* Sponsorship Request Modal */}
        {showRequestModal && selectedChallenge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cream/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-brown">Request Sponsorship</h2>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="text-brown/50 hover:text-brown transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-brown/70 mt-2">Sponsor: {selectedChallenge.title}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Reward Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-brown mb-3">Reward Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: 'gift', label: 'Physical Gift', icon: <Package className="h-5 w-5" />, desc: 'Art supplies, tools, etc.' },
                      { id: 'voucher', label: 'Discount Voucher', icon: <Percent className="h-5 w-5" />, desc: 'Store discounts' },
                      { id: 'service', label: 'Service/Experience', icon: <Star className="h-5 w-5" />, desc: 'Workshops, consultations' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setRequestForm({...requestForm, rewardType: type.id})}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          requestForm.rewardType === type.id
                            ? 'border-brown bg-brown/5'
                            : 'border-cream/50 hover:border-brown/30'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {type.icon}
                          <span className="font-medium text-brown">{type.label}</span>
                        </div>
                        <p className="text-sm text-brown/60">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reward Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown mb-2">Reward Value</label>
                    <input
                      type="text"
                      value={requestForm.rewardValue}
                      onChange={(e) => setRequestForm({...requestForm, rewardValue: e.target.value})}
                      placeholder={requestForm.rewardType === 'voucher' ? '20%' : '$100'}
                      className="w-full px-3 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown mb-2">Quantity</label>
                    <input
                      type="number"
                      value={requestForm.quantity}
                      onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                      placeholder="1"
                      className="w-full px-3 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown mb-2">Reward Description</label>
                  <textarea
                    value={requestForm.rewardDescription}
                    onChange={(e) => setRequestForm({...requestForm, rewardDescription: e.target.value})}
                    placeholder="Describe the reward in detail..."
                    rows={3}
                    className="w-full px-3 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown mb-2">Total Sponsorship Amount</label>
                  <input
                    type="text"
                    value={requestForm.sponsorshipAmount}
                    onChange={(e) => setRequestForm({...requestForm, sponsorshipAmount: e.target.value})}
                    placeholder="$300"
                    className="w-full px-3 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown mb-2">Terms & Conditions</label>
                  <textarea
                    value={requestForm.terms}
                    onChange={(e) => setRequestForm({...requestForm, terms: e.target.value})}
                    placeholder="Any specific terms or conditions for this sponsorship..."
                    rows={3}
                    className="w-full px-3 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-cream/50 flex space-x-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="flex-1 bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Request</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorshipRequests;