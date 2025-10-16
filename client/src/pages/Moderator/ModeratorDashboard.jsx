import {
  Award,
  BarChart3,
  Clock,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Trophy,
  User,
  Users
} from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import ChallengeList from './ChallengeList';
import VerificationList from './VerificationList';

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const isSignedIn = !!token;
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Challenge List state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Scoring Criteria state variables
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [selectedScoringChallenge, setSelectedScoringChallenge] = useState('');
  const [criteria, setCriteria] = useState({
    likesWeight: 25,
    commentsWeight: 25,
    buyerInterestWeight: 25,
    expertEvaluationWeight: 25
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contestantSearchTerm, setContestantSearchTerm] = useState('');

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Challenge data fetched from backend
  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [challengesError, setChallengesError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoadingChallenges(true);
      setChallengesError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenges`);
        setChallenges(response.data);
      } catch (err) {
        setChallengesError('Failed to load challenges.');
      } finally {
        setLoadingChallenges(false);
      }
    };
    fetchChallenges();
  }, []);

  // Dummy contestant data for scoring criteria
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

  // Function to get challenge-specific criteria
  const getChallengeSpecificCriteria = (challengeId) => {
    // Mock challenge-specific criteria data
    const challengeCriteria = {
      1: { // Sri Lankan Heritage Art Challenge 2025
        likesWeight: 20,
        commentsWeight: 30,
        buyerInterestWeight: 20,
        expertEvaluationWeight: 30,
        defined: true
      },
      2: { // Kandy Perahera Digital Art Contest
        likesWeight: 30,
        commentsWeight: 25,
        buyerInterestWeight: 25,
        expertEvaluationWeight: 20,
        defined: true
      },
      3: { // Ceylon Tea Plantation Landscape Art
        likesWeight: 25,
        commentsWeight: 20,
        buyerInterestWeight: 30,
        expertEvaluationWeight: 25,
        defined: true
      },
      4: { // Sigiriya Rock Fortress Art Challenge
        likesWeight: 15,
        commentsWeight: 25,
        buyerInterestWeight: 25,
        expertEvaluationWeight: 35,
        defined: true
      },
      5: { // Galle Fort Architecture Drawing Contest
        likesWeight: 25,
        commentsWeight: 25,
        buyerInterestWeight: 25,
        expertEvaluationWeight: 25,
        defined: false
      }
    };

    return challengeCriteria[challengeId] || {
      likesWeight: 25,
      commentsWeight: 25,
      buyerInterestWeight: 25,
      expertEvaluationWeight: 25,
      defined: false
    };
  };

  const selectedChallengeData = challenges.find(c => c.id === selectedChallenge);
  const contestants = selectedChallenge ? getContestantData(selectedChallenge) : [];

  // Scoring criteria functions
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
    
    // Show confirmation dialog
    const confirmMessage = `The scoring criteria for "${selectedChallengeData?.title}" will be saved and cannot be modified. Winners will be calculated based on these weights.\n\nAre you sure you want to proceed?`;
    
    if (window.confirm(confirmMessage)) {
      setIsSubmitted(true);
      console.log('Scoring criteria submitted:', criteria);
    }
  };

  const totalPercentage = getTotalWeight();

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

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || challenge.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      name: "Active Challenges",
      value: "12",
      icon: Trophy,
      color: "#D87C5A",
      change: "+2.1%",
      changeType: "increase",
    },
    {
      name: "Total Participants",
      value: "1,247",
      icon: Users,
      color: "#FFD95A",
      change: "+12.5%",
      changeType: "increase",
    },
    {
      name: "Pending Reviews",
      value: "23",
      icon: Clock,
      color: "#5D3A00",
      change: "-4.3%",
      changeType: "decrease",
    },
    {
      name: "Winners Selected",
      value: "89",
      icon: Award,
      color: "#D87C5A",
      change: "+8.2%",
      changeType: "increase",
    },
  ];

  const quickActions = [
    {
      id: "challenges",
      label: "Challenge Management",
      icon: Trophy,
      desc: "Create and manage art challenges",
    },
    {
      id: "scoring",
      label: "Scoring Criteria",
      icon: Star,
      desc: "Set up scoring criteria for challenges",
    },
    {
      id: "winner",
      label: "Winner Selection",
      icon: Award,
      desc: "Select winners for completed challenges",
    },
  ];

  const recentActivity = [
    {
      type: "challenge",
      message: "New challenge created: Sri Lankan Heritage Art Challenge 2025",
      time: "2 hours ago",
      icon: Trophy,
    },
    {
      type: "winner",
      message: "Winner selected: Kandy Perahera Digital Art Contest",
      time: "4 hours ago",
      icon: Award,
    },
    {
      type: "scoring",
      message: "Scoring criteria updated: Ceylon Tea Plantation Landscape Art",
      time: "6 hours ago",
      icon: Star,
    },
    {
      type: "challenge",
      message: "Challenge deadline approaching: Galle Fort Architecture Contest",
      time: "8 hours ago",
      icon: Trophy,
    },
  ];

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: BarChart3 },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "scoring", label: "Scoring", icon: Star },
    { id: "winner", label: "Winners", icon: Award },
    { id: "verification", label: "Verification", icon: Shield },
  ];

  const renderDashboard = () => (
    <div className="w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg shadow-sm border h-full relative overflow-hidden"
            style={{ backgroundColor: "#FFF5E1" }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  index === 0
                    ? 'url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Challenges - trophy/competition
                    : index === 1
                    ? 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Participants - people
                    : index === 2
                    ? 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Pending - clock/waiting
                    : 'url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Winners - award/medal
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#5D3A00" }}
                  >
                    {stat.name}
                  </p>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "#5D3A00" }}
                  >
                    {stat.value}
                  </h2>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          stat.changeType === "increase"
                            ? "#d4edda"
                            : "#f8d7da",
                        color:
                          stat.changeType === "increase"
                            ? "#155724"
                            : "#721c24",
                      }}
                    >
                      {stat.change}
                    </span>
                    <span
                      className="text-xs opacity-75"
                      style={{ color: "#5D3A00" }}
                    >
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className="p-3 rounded-lg shadow-lg"
                  style={{ backgroundColor: stat.color }}
                >
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-lg shadow-sm border h-full relative overflow-hidden"
          style={{ backgroundColor: "#FFF5E1" }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#5D3A00" }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    if (action.id === "challenges") navigate("/challenges");
                    else if (action.id === "scoring")
                      navigate("/scoring-criteria");
                    else if (action.id === "winner")
                      navigate("/winner-selection");
                  }}
                  className="border rounded-lg p-4 text-left h-full btn-animate"
                  style={{
                    borderColor: "#FFE4D6",
                    backgroundColor: "#FFE4D6",
                  }}
                >
                  <action.icon
                    size={20}
                    className="mb-2"
                    style={{ color: "#5D3A00" }}
                  />
                  <h6
                    className="font-semibold mb-1"
                    style={{ color: "#5D3A00" }}
                  >
                    {action.label}
                  </h6>
                  <small style={{ color: "#5D3A00" }}>{action.desc}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rounded-lg shadow-sm border h-full relative overflow-hidden"
          style={{ backgroundColor: "#FFF5E1" }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#5D3A00" }}>
              Recent Activity
            </h2>
            <div className="flex flex-col gap-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg"
                >
                  <div
                    className="p-2 rounded shadow-sm"
                    style={{ backgroundColor: "#FFE4D6" }}
                  >
                    <activity.icon size={16} style={{ color: "#5D3A00" }} />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm" style={{ color: "#5D3A00" }}>
                      {activity.message}
                    </p>
                    <small style={{ color: "#D87C5A" }}>{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case 'challenges':
        return <ChallengeList />;
      case 'scoring':
        // Get selected challenge data for scoring
        const selectedScoringChallengeData = challenges.find(c => c.id === parseInt(selectedScoringChallenge));
        const challengeSpecificCriteria = selectedScoringChallenge ? getChallengeSpecificCriteria(parseInt(selectedScoringChallenge)) : null;

        // Get contestants for selected challenge only (if selected)
        const scoringContestants = selectedScoringChallenge ? 
          getContestantData(parseInt(selectedScoringChallenge)).map(contestant => ({
            ...contestant,
            challengeTitle: selectedScoringChallengeData?.title,
            challengeId: selectedScoringChallenge
          })) : [];

        // Filter contestants based on search term
        const filteredScoringContestants = scoringContestants.filter(contestant =>
          contestant.name.toLowerCase().includes(contestantSearchTerm.toLowerCase()) ||
          contestant.artworkTitle.toLowerCase().includes(contestantSearchTerm.toLowerCase())
        );

        return (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-[#7f5539]" />
              <h2 className="text-2xl font-semibold text-[#362625]">Scoring & Evaluation</h2>
            </div>

            {/* Challenge Selection */}
            <div className="bg-white rounded-lg border border-[#d87c5a] p-6 mb-6">
              <label className="block text-sm font-medium mb-3" style={{color: '#362625'}}>
                Select Challenge for Scoring
              </label>
              <select
                value={selectedScoringChallenge}
                onChange={(e) => setSelectedScoringChallenge(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg"
                style={{borderColor: '#d87c5a', backgroundColor: 'white', color: '#362625'}}
              >
                <option value="">Select a challenge...</option>
                {challenges.map(challenge => (
                  <option key={challenge.id} value={challenge.id}>
                    {challenge.title} ({challenge.status}) - {challenge.participants} participants
                  </option>
                ))}
              </select>

              {/* Challenge Details */}
              {selectedScoringChallengeData && (
                <div className="mt-4 p-4 rounded-lg" style={{backgroundColor: '#f4e8dc'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#362625'}}>{selectedScoringChallengeData.title}</h4>
                  <p className="text-sm mb-3" style={{color: '#7f5539'}}>{selectedScoringChallengeData.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium" style={{color: '#362625'}}>Status:</span>
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        selectedScoringChallengeData.status === 'active' ? 'bg-green-100 text-green-800' : 
                        selectedScoringChallengeData.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        selectedScoringChallengeData.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedScoringChallengeData.status}
                      </span>
                    </div>
                    <div><span className="font-medium" style={{color: '#362625'}}>Participants:</span> <span style={{color: '#7f5539'}}>{selectedScoringChallengeData.participants}</span></div>
                    <div><span className="font-medium" style={{color: '#362625'}}>Submissions:</span> <span style={{color: '#7f5539'}}>{selectedScoringChallengeData.submissions}</span></div>
                    <div><span className="font-medium" style={{color: '#362625'}}>Deadline:</span> <span style={{color: '#7f5539'}}>{selectedScoringChallengeData.deadline}</span></div>
                  </div>
                  
                  {/* Criteria Status */}
                  <div className="mt-3 pt-3 border-t" style={{borderColor: '#d87c5a'}}>
                    <div className={`flex items-center gap-2 text-sm ${
                      challengeSpecificCriteria?.defined ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      <Settings size={16} />
                      <span className="font-medium">
                        {challengeSpecificCriteria?.defined ? 'Scoring criteria defined for this challenge' : 'Using default scoring criteria'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Scoring Criteria Display - Only show if challenge is selected */}
            {selectedScoringChallenge && challengeSpecificCriteria && (
              <div className="bg-[#f4e8dc] border border-[#d87c5a] rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-[#362625] mb-4">
                  Current Scoring Criteria for "{selectedScoringChallengeData?.title}"
                </h3>
                <p className="text-[#7f5539] mb-4">
                  {challengeSpecificCriteria.defined ? 
                    'Custom scoring weights defined for this challenge' : 
                    'Default scoring weights applied to this challenge'
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                    <div className="text-2xl font-bold text-[#7f5539]">{challengeSpecificCriteria.likesWeight}%</div>
                    <div className="text-sm text-[#362625]">Social Engagement</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                    <div className="text-2xl font-bold text-[#7f5539]">{challengeSpecificCriteria.commentsWeight}%</div>
                    <div className="text-sm text-[#362625]">Community Interaction</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                    <div className="text-2xl font-bold text-[#7f5539]">{challengeSpecificCriteria.buyerInterestWeight}%</div>
                    <div className="text-sm text-[#362625]">Market Appeal</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-[#d87c5a]">
                    <div className="text-2xl font-bold text-[#7f5539]">{challengeSpecificCriteria.expertEvaluationWeight}%</div>
                    <div className="text-sm text-[#362625]">Expert Assessment</div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Contestants - Only show if challenge is selected */}
            {selectedScoringChallenge && (
              <div className="bg-white rounded-lg border border-[#d87c5a] p-6 mb-6">
                <label className="block text-sm font-medium mb-3" style={{color: '#362625'}}>
                  Search Contestants and Artworks
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{color: '#7f5539'}} />
                  <input
                    type="text"
                    placeholder="Search by contestant name or artwork title..."
                    value={contestantSearchTerm}
                    onChange={(e) => setContestantSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg"
                    style={{borderColor: '#d87c5a', backgroundColor: 'white', color: '#362625'}}
                  />
                </div>
              </div>
            )}

            {/* Contestants Performance List - Only show if challenge is selected */}
            {selectedScoringChallenge && challengeSpecificCriteria && (
              <div className="bg-white rounded-lg border border-[#d87c5a] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Contestant Performance for "{selectedScoringChallengeData?.title}"
                  </h3>
                  <div className="text-sm text-gray-500">
                    {filteredScoringContestants.length} contestant{filteredScoringContestants.length !== 1 ? 's' : ''} found
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {filteredScoringContestants.map((contestant, index) => (
                    <div key={`${contestant.challengeId}-${contestant.id}`} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{contestant.name}</h4>
                          <p className="text-sm text-gray-500">Artwork: {contestant.artworkTitle}</p>
                          <p className="text-xs text-[#7f5539] font-medium mt-1">Submission Date: {contestant.submissionDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#7f5539]">
                            {Math.round((
                              contestant.likes/250*challengeSpecificCriteria.likesWeight + 
                              contestant.comments/50*challengeSpecificCriteria.commentsWeight + 
                              contestant.buyerInterest*10*challengeSpecificCriteria.buyerInterestWeight/100 + 
                              contestant.expertScore*10*challengeSpecificCriteria.expertEvaluationWeight/100
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">Calculated Score</div>
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{contestant.likes}</div>
                          <div className="text-xs text-gray-500">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{contestant.comments}</div>
                          <div className="text-xs text-gray-500">Comments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{contestant.buyerInterest.toFixed(1)}/10</div>
                          <div className="text-xs text-gray-500">Market Appeal</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{contestant.expertScore.toFixed(1)}/10</div>
                          <div className="text-xs text-gray-500">Expert Score</div>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="border-t pt-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="bg-blue-50 rounded p-2 text-center">
                            <div className="font-medium text-blue-800">
                              {Math.round(contestant.likes/250*challengeSpecificCriteria.likesWeight)}
                            </div>
                            <div className="text-blue-600">Social ({challengeSpecificCriteria.likesWeight}%)</div>
                          </div>
                          <div className="bg-green-50 rounded p-2 text-center">
                            <div className="font-medium text-green-800">
                              {Math.round(contestant.comments/50*challengeSpecificCriteria.commentsWeight)}
                            </div>
                            <div className="text-green-600">Community ({challengeSpecificCriteria.commentsWeight}%)</div>
                          </div>
                          <div className="bg-orange-50 rounded p-2 text-center">
                            <div className="font-medium text-orange-800">
                              {Math.round(contestant.buyerInterest*10*challengeSpecificCriteria.buyerInterestWeight/100)}
                            </div>
                            <div className="text-orange-600">Market ({challengeSpecificCriteria.buyerInterestWeight}%)</div>
                          </div>
                          <div className="bg-purple-50 rounded p-2 text-center">
                            <div className="font-medium text-purple-800">
                              {Math.round(contestant.expertScore*10*challengeSpecificCriteria.expertEvaluationWeight/100)}
                            </div>
                            <div className="text-purple-600">Expert ({challengeSpecificCriteria.expertEvaluationWeight}%)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredScoringContestants.length === 0 && scoringContestants.length > 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No contestants found</h3>
                      <p className="text-gray-500">
                        Try adjusting your search terms.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Challenge Selected Message */}
            {!selectedScoringChallenge && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Challenge Selected</h3>
                <p className="text-gray-500">Please select a challenge above to view its scoring criteria and contestant performance.</p>
              </div>
            )}
          </div>
        );
      case 'winner':
        // Mock previous challenges data (should match WinnerSelection)
        const previousChallenges = [
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
        const getPositionIcon = (position) => {
          switch (position) {
            case 1:
              return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
              return <Award className="h-5 w-5 text-gray-400" />;
            case 3:
              return <Award className="h-5 w-5 text-amber-600" />;
            default:
              return null;
          }
        };
        return (
          <div className="p-6">
            <button
              onClick={() => navigate('/scoring-criteria')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg mb-8 btn-animate"
              style={{backgroundColor: '#D87C5A', color: 'white'}}
            >
              <Star size={20} />
              Set Scoring Criteria
            </button>
            <div className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4" style={{color: '#5D3A00'}}>Previous Challenges Winners</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {previousChallenges.map((challenge) => (
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
        );
      case 'verification':
        return <VerificationList />;
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      {/* Consistent CSS styles for smoother animations and layout (matches AdminDashboard) */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popInContent {
          from { opacity: 0; transform: translateY(10px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .page-container { animation: smoothFadeIn 0.4s ease-out; opacity: 1; }
        .header-container { animation: slideInFromTop 0.5s ease-out 0.1s both; }
        .nav-container { animation: slideInFromTop 0.5s ease-out 0.2s both; }
        .content-container { animation: popInContent 0.4s ease-out 0.3s both; }
        .menu-item { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); opacity: 1; transform: translateY(0); }
        .menu-item:hover { transform: translateY(-1px); }
        .smooth-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-animate { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); opacity: 1; transform: translateY(0); }
        .btn-animate:hover { transform: translateY(-1px) scale(1.02); }
        .card-animate { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-animate:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .dashboard-content { min-height: 200px; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      <div className="min-h-screen page-container" style={{ backgroundColor: "#FFF5E1" }}>
        {/* Header (matches AdminDashboard) */}
        <div
          className="w-full shadow-sm p-6 mb-8 relative header-container"
          style={{
            backgroundImage:
              'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full smooth-transition" style={{ backgroundColor: "#FFD95A" }}>
                  <Shield size={32} style={{ color: "#5D3A00" }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Moderator Dashboard</h1>
                  <p className="text-gray-200">Welcome back! Here's what's happening with your challenges.</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{ borderColor: "#FFE4D6", color: "#FFE4D6", backgroundColor: "rgba(255, 228, 214, 0.1)" }}
                  onClick={() => navigate("/create-challenge")}
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Create Challenge</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{ borderColor: "#FFE4D6", color: "#FFE4D6", backgroundColor: "rgba(255, 228, 214, 0.1)" }}
                  onClick={() => navigate("/winner-selection")}
                >
                  <Award size={14} />
                  <span className="hidden sm:inline">Select Winners</span>
                  <span className="sm:hidden">Winners</span>
                </button>
                {isSignedIn ? (
                  <button
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                    style={{ backgroundColor: "#D87C5A", color: "white", border: "none" }}
                    onClick={handleLogoutClick}
                  >
                    <User size={14} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <a
                    href="/"
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate no-underline"
                    style={{ backgroundColor: "#D87C5A", color: "white", border: "none", textDecoration: "none" }}
                  >
                    <User size={14} />
                    <span>Login</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Navigation Tabs (matches AdminDashboard) */}
          <div className="bg-white rounded-lg shadow-sm mb-8 nav-container">
            <div style={{ borderBottom: "1px solid #FFE4D6" }}>
              <nav className="flex space-x-8 px-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 menu-item"
                    style={{
                      borderBottomColor: activeSection === item.id ? "#5D3A00" : "transparent",
                      color: activeSection === item.id ? "#5D3A00" : "#D87C5A",
                    }}
                    onMouseOver={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = "#5D3A00";
                        e.target.style.borderBottomColor = "#FFD95A";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = "#D87C5A";
                        e.target.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Content */}
          <div className="content-container dashboard-content">{renderContent()}</div>
        </div>

        {/* Logout Confirmation Modal (matches AdminDashboard) */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#362625] mb-2">Confirm Logout</h3>
                <p className="text-gray-600 mb-8 text-lg">Are you sure you want to log out of your account?</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={cancelLogout}
                    className="px-6 py-3 bg-gray-100 text-[#362625] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 min-w-[120px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-6 py-3 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white rounded-xl hover:from-[#c0392b] hover:to-[#a93226] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[120px]"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ModeratorDashboard;
