import axios from 'axios';
import {
  Award,
  BarChart3,
  Clock,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Star,
  Trophy,
  User,
  Users
} from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
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
    likesWeight: 34,
    commentsWeight: 33,
    shareWeight: 33
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contestantSearchTerm, setContestantSearchTerm] = useState('');

  // Winner Selection state variables
  const [selectedWinnerChallenge, setSelectedWinnerChallenge] = useState('');
  const [winnerSubmissions, setWinnerSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);

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

  // Calculate score based on formula: MAX(0, (Total Likes × 10) - (Total Dislikes × 5))
  const calculateScore = (likes, dislikes) => {
    const score = (likes * 10) - (dislikes * 5);
    return Math.max(0, score); // Minimum score is 0 (no negative scores)
  };

  // Fetch submissions for winner selection when challenge is selected
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedWinnerChallenge) {
        setWinnerSubmissions([]);
        return;
      }
      
      setLoadingSubmissions(true);
      setSubmissionsError(null);
      
      try {
        // Fetch submissions from backend with likes and dislikes
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/challenges/${selectedWinnerChallenge}/submissions/reactions`
        );
        
        // Calculate scores for each submission
        const submissionsWithScores = response.data.map(submission => ({
          ...submission,
          totalLikes: submission.likesCount || 0,
          totalDislikes: submission.dislikesCount || 0,
          calculatedScore: calculateScore(submission.likesCount || 0, submission.dislikesCount || 0)
        }));
        
        // Sort by calculated score in descending order
        const sortedSubmissions = submissionsWithScores.sort((a, b) => 
          b.calculatedScore - a.calculatedScore
        );
        
        // Assign positions to top 3
        const submissionsWithPositions = sortedSubmissions.map((sub, index) => ({
          ...sub,
          position: index < 3 ? index + 1 : null
        }));
        
        setWinnerSubmissions(submissionsWithPositions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setSubmissionsError('Failed to load submissions. Using mock data for demonstration.');
        
        // Fallback to mock data for demonstration
        const mockSubmissions = [
          {
            submissionId: 1,
            title: 'Artwork 1',
            artistName: 'Nadeesha Perera',
            imageUrl: 'https://images.pexels.com/photos/1292241/pexels-photo-1292241.jpeg?auto=compress&cs=tinysrgb&w=400',
            totalLikes: 45,
            totalDislikes: 3,
            calculatedScore: calculateScore(45, 3),
            position: 1
          },
          {
            submissionId: 2,
            title: 'Artwork 2',
            artistName: 'Kasun Fernando',
            imageUrl: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400',
            totalLikes: 38,
            totalDislikes: 5,
            calculatedScore: calculateScore(38, 5),
            position: 2
          },
          {
            submissionId: 3,
            title: 'Artwork 3',
            artistName: 'Tharushi Silva',
            imageUrl: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400',
            totalLikes: 32,
            totalDislikes: 4,
            calculatedScore: calculateScore(32, 4),
            position: 3
          },
          {
            submissionId: 4,
            title: 'Artwork 4',
            artistName: 'Amila Jayawardena',
            imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
            totalLikes: 28,
            totalDislikes: 6,
            calculatedScore: calculateScore(28, 6),
            position: null
          },
          {
            submissionId: 5,
            title: 'Artwork 5',
            artistName: 'Sanduni Wijesekara',
            imageUrl: 'https://images.pexels.com/photos/1212407/pexels-photo-1212407.jpeg?auto=compress&cs=tinysrgb&w=400',
            totalLikes: 25,
            totalDislikes: 8,
            calculatedScore: calculateScore(25, 8),
            position: null
          }
        ].sort((a, b) => b.calculatedScore - a.calculatedScore);
        
        setWinnerSubmissions(mockSubmissions);
      } finally {
        setLoadingSubmissions(false);
      }
    };
    
    fetchSubmissions();
  }, [selectedWinnerChallenge]);

  // Dummy contestant data for scoring criteria
  const getContestantData = (challengeId) => {
    const baseContestants = [
      {
        id: 1,
        name: 'Nadeesha Perera',
        artworkTitle: 'Artwork 1',
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
        artworkTitle: 'Artwork 2',
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
        artworkTitle: 'Artwork 3',
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
        likesWeight: 30,
        commentsWeight: 40,
        shareWeight: 30,
        defined: true
      },
      2: { // Kandy Perahera Digital Art Contest
        likesWeight: 35,
        commentsWeight: 30,
        shareWeight: 35,
        defined: true
      },
      3: { // Ceylon Tea Plantation Landscape Art
        likesWeight: 40,
        commentsWeight: 30,
        shareWeight: 30,
        defined: true
      },
      4: { // Sigiriya Rock Fortress Art Challenge
        likesWeight: 30,
        commentsWeight: 35,
        shareWeight: 35,
        defined: true
      },
      5: { // Galle Fort Architecture Drawing Contest
        likesWeight: 34,
        commentsWeight: 33,
        shareWeight: 33,
        defined: false
      }
    };

    return challengeCriteria[challengeId] || {
      likesWeight: 34,
      commentsWeight: 33,
      shareWeight: 33,
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
    return criteria.likesWeight + criteria.commentsWeight + criteria.shareWeight;
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
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "#5D3A00" }}
                  >
                    {stat.name}
                  </p>
                  <h2
                    className="text-3xl font-black mb-2"
                    style={{ color: "#5D3A00" }}
                  >
                    {stat.value}
                  </h2>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
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
                      className="text-xs font-light italic opacity-75"
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
            <h2 className="text-2xl font-extrabold tracking-tight mb-4" style={{ color: "#5D3A00" }}>
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
                      setActiveSection("winner"); // Changed to switch to Winners tab
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
                    className="font-bold mb-1"
                    style={{ color: "#5D3A00" }}
                  >
                    {action.label}
                  </h6>
                  <small className="font-medium" style={{ color: "#5D3A00" }}>{action.desc}</small>
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
            <h2 className="text-2xl font-extrabold tracking-tight mb-4" style={{ color: "#5D3A00" }}>
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
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#362625]">Scoring & Evaluation</h2>
                <p className="text-sm font-light italic text-[#7f5539]">Review contestant performance based on Likes, Comments & Share metrics</p>
              </div>
            </div>

            {/* Challenge Selection */}
            <div className="bg-white rounded-lg border border-[#d87c5a] p-6 mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{color: '#362625'}}>
                Select Challenge for Scoring
              </label>
              <select
                value={selectedScoringChallenge}
                onChange={(e) => setSelectedScoringChallenge(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg font-semibold"
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
                  <h4 className="font-extrabold mb-2" style={{color: '#362625'}}>{selectedScoringChallengeData.title}</h4>
                  <p className="text-sm font-medium mb-3" style={{color: '#7f5539'}}>{selectedScoringChallengeData.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-bold" style={{color: '#362625'}}>Status:</span>
                      <span className={`ml-1 px-2 py-1 rounded text-xs font-semibold ${
                        selectedScoringChallengeData.status === 'active' ? 'bg-green-100 text-green-800' : 
                        selectedScoringChallengeData.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        selectedScoringChallengeData.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedScoringChallengeData.status}
                      </span>
                    </div>
                    <div><span className="font-bold" style={{color: '#362625'}}>Participants:</span> <span className="font-medium" style={{color: '#7f5539'}}>{selectedScoringChallengeData.participants}</span></div>
                    <div><span className="font-bold" style={{color: '#362625'}}>Submissions:</span> <span className="font-medium" style={{color: '#7f5539'}}>{selectedScoringChallengeData.submissions}</span></div>
                    <div><span className="font-bold" style={{color: '#362625'}}>Deadline:</span> <span className="font-medium" style={{color: '#7f5539'}}>{selectedScoringChallengeData.deadline}</span></div>
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
              <div className="bg-gradient-to-br from-[#f4e8dc] to-[#ffe4d6] border-2 border-[#d87c5a] rounded-xl p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-[#d87c5a]">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#362625]">
                      Scoring Criteria for "{selectedScoringChallengeData?.title}"
                    </h3>
                    <p className="text-sm font-light italic text-[#7f5539] mt-1">
                      {challengeSpecificCriteria.defined ? 
                        '✓ Custom scoring weights applied to this challenge' : 
                        '⚙ Default scoring weights applied to this challenge'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Likes & Engagement Weight */}
                  <div className="bg-white rounded-xl p-6 text-center border-2 border-[#d87c5a] shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-blue-100">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-[#d87c5a] mb-2">{challengeSpecificCriteria.likesWeight}%</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#362625] mb-1">Likes & Engagement Weight</div>
                    <div className="text-xs font-medium text-[#7f5539]">Social popularity metric</div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{width: `${challengeSpecificCriteria.likesWeight}%`}}
                      ></div>
                    </div>
                  </div>

                  {/* Comments & Interaction Weight */}
                  <div className="bg-white rounded-xl p-6 text-center border-2 border-[#d87c5a] shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-green-100">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-[#d87c5a] mb-2">{challengeSpecificCriteria.commentsWeight}%</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#362625] mb-1">Comments & Interaction Weight</div>
                    <div className="text-xs font-medium text-[#7f5539]">Community engagement</div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{width: `${challengeSpecificCriteria.commentsWeight}%`}}
                      ></div>
                    </div>
                  </div>

                  {/* Share Weight */}
                  <div className="bg-white rounded-xl p-6 text-center border-2 border-[#d87c5a] shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-purple-100">
                        <Send className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-[#d87c5a] mb-2">{challengeSpecificCriteria.shareWeight}%</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#362625] mb-1">Share Weight</div>
                    <div className="text-xs font-medium text-[#7f5539]">Viral spread potential</div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all" 
                        style={{width: `${challengeSpecificCriteria.shareWeight}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Total Verification */}
                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-500 flex items-center justify-center gap-3">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    Total Weight: {challengeSpecificCriteria.likesWeight + challengeSpecificCriteria.commentsWeight + challengeSpecificCriteria.shareWeight}% 
                    {(challengeSpecificCriteria.likesWeight + challengeSpecificCriteria.commentsWeight + challengeSpecificCriteria.shareWeight) === 100 ? ' ✓ Valid' : ' ⚠ Invalid'}
                  </span>
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
                  {filteredScoringContestants.map((contestant) => (
                    <div key={`${contestant.challengeId}-${contestant.id}`} className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900">{contestant.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Trophy size={14} className="text-[#d87c5a]" />
                            Artwork: <span className="font-medium">{contestant.artworkTitle}</span>
                          </p>
                          <p className="text-xs text-[#7f5539] font-medium mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            Submitted: {contestant.submissionDate}
                          </p>
                        </div>
                        <div className="text-right bg-gradient-to-br from-[#d87c5a] to-[#b85a3a] text-white rounded-xl p-4 shadow-lg">
                          <div className="text-3xl font-bold">
                            {Math.round((
                              contestant.likes/250*challengeSpecificCriteria.likesWeight + 
                              contestant.comments/50*challengeSpecificCriteria.commentsWeight + 
                              contestant.buyerInterest*10*challengeSpecificCriteria.shareWeight/100
                            ))}
                          </div>
                          <div className="text-xs opacity-90">Total Score</div>
                        </div>
                      </div>
                      
                      {/* Performance Metrics with Percentages */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-lg">
                        {/* Likes & Engagement Metric */}
                        <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Heart size={16} className="text-blue-600" />
                              <span className="text-xs font-semibold text-gray-700">Likes & Engagement</span>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {challengeSpecificCriteria.likesWeight}%
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{contestant.likes}</div>
                          <div className="text-xs text-gray-500 mb-2">Raw Count</div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all" 
                              style={{width: `${Math.min(100, (contestant.likes/250)*100)}%`}}
                            ></div>
                          </div>
                          <div className="text-xs text-blue-600 font-semibold mt-1">
                            Contributes: {Math.round(contestant.likes/250*challengeSpecificCriteria.likesWeight)} pts
                          </div>
                        </div>

                        {/* Comments & Interaction Metric */}
                        <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MessageCircle size={16} className="text-green-600" />
                              <span className="text-xs font-semibold text-gray-700">Comments & Interaction</span>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                              {challengeSpecificCriteria.commentsWeight}%
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{contestant.comments}</div>
                          <div className="text-xs text-gray-500 mb-2">Raw Count</div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all" 
                              style={{width: `${Math.min(100, (contestant.comments/50)*100)}%`}}
                            ></div>
                          </div>
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            Contributes: {Math.round(contestant.comments/50*challengeSpecificCriteria.commentsWeight)} pts
                          </div>
                        </div>

                        {/* Share Weight Metric */}
                        <div className="bg-white rounded-lg p-3 border border-purple-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Send size={16} className="text-purple-600" />
                              <span className="text-xs font-semibold text-gray-700">Share Weight</span>
                            </div>
                            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                              {challengeSpecificCriteria.shareWeight}%
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{contestant.buyerInterest.toFixed(1)}/10</div>
                          <div className="text-xs text-gray-500 mb-2">Engagement Score</div>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all" 
                              style={{width: `${(contestant.buyerInterest/10)*100}%`}}
                            ></div>
                          </div>
                          <div className="text-xs text-purple-600 font-semibold mt-1">
                            Contributes: {Math.round(contestant.buyerInterest*10*challengeSpecificCriteria.shareWeight/100)} pts
                          </div>
                        </div>
                      </div>

                      {/* Score Breakdown Summary */}
                      <div className="border-t-2 border-gray-200 pt-4">
                        <h5 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <BarChart3 size={14} className="text-[#d87c5a]" />
                          Score Breakdown Based on Challenge Criteria
                        </h5>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-300">
                            <div className="text-xl font-bold text-blue-700">
                              {Math.round(contestant.likes/250*challengeSpecificCriteria.likesWeight)}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">Likes Score</div>
                            <div className="text-xs text-gray-600 mt-1">({challengeSpecificCriteria.likesWeight}% weight)</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-300">
                            <div className="text-xl font-bold text-green-700">
                              {Math.round(contestant.comments/50*challengeSpecificCriteria.commentsWeight)}
                            </div>
                            <div className="text-xs text-green-600 font-medium">Interaction Score</div>
                            <div className="text-xs text-gray-600 mt-1">({challengeSpecificCriteria.commentsWeight}% weight)</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center border border-purple-300">
                            <div className="text-xl font-bold text-purple-700">
                              {Math.round(contestant.buyerInterest*10*challengeSpecificCriteria.shareWeight/100)}
                            </div>
                            <div className="text-xs text-purple-600 font-medium">Share Score</div>
                            <div className="text-xs text-gray-600 mt-1">({challengeSpecificCriteria.shareWeight}% weight)</div>
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
      case 'winner': {
        // Generate dummy winners for demonstration (legacy function for completed challenges)
        const generateDummyWinners = () => {
          const artistNames = [
            'Kasun Perera', 'Nadeeka Silva', 'Tharindu Fernando', 'Amaya Jayawardena',
            'Dilshan Rajapaksa', 'Sachini Bandara', 'Ravindu Wijesekara', 'Kavitha Gunaratne',
            'Chamod Wickramasinghe', 'Nimali Dissanayake', 'Isuru Kumara', 'Sanduni Mendis'
          ];
          const artworkTitles = [
            'Artwork 1', 'Artwork 2', 'Artwork 3', 'Artwork 4',
            'Artwork 5', 'Artwork 6', 'Artwork 7', 'Artwork 8',
            'Artwork 9', 'Artwork 10', 'Artwork 11', 'Artwork 12'
          ];
          
          // Generate 3 random winners
          const winners = [];
          const usedIndices = new Set();
          
          for (let i = 1; i <= 3; i++) {
            let randomIndex;
            do {
              randomIndex = Math.floor(Math.random() * artistNames.length);
            } while (usedIndices.has(randomIndex));
            
            usedIndices.add(randomIndex);
            
            winners.push({
              position: i,
              name: artistNames[randomIndex],
              title: artworkTitles[randomIndex]
            });
          }
          
          return winners;
        };
        
        // Filter only challenges that are EXPLICITLY marked as 'completed' in database
        const completedChallenges = challenges.filter(challenge => {
          return challenge.status === 'completed';
        }).map(challenge => {
          // Calculate completion date:
          // - If status is 'completed', use deadline as completion date
          // - Otherwise, use deadline as completion date
          const completedDate = challenge.deadlineDateTime;
          
          return {
            id: challenge.id,
            name: challenge.title,
            description: challenge.description || 'No description available',
            category: challenge.category,
            deadline: challenge.deadlineDateTime,
            completedDate: completedDate,
            publishDateTime: challenge.publishDateTime,
            maxParticipants: challenge.maxParticipants,
            rewards: challenge.rewards,
            requestSponsorship: challenge.requestSponsorship,
            status: 'completed',
            moderatorId: challenge.moderatorId,
            participants: 0, // Will be populated from submissions data
            submissions: 0, // Will be populated from submissions data
            scoringCriteria: challenge.scoringCriteria || {
              likesWeight: 34,
              commentsWeight: 33,
              shareWeight: 33
            },
            winners: generateDummyWinners() // Generate dummy winners
          };
        }).sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));        const previousChallenges = completedChallenges.length > 0 ? completedChallenges : [
          {
            id: 'abstract-art-contest',
            name: 'Abstract Art Contest',
            description: 'A national web design challenge for creative portfolios and landing pages.',
            deadline: '2025-07-30',
            completedDate: '2025-07-30',
            status: 'completed',
            participants: 180,
            submissions: 120,
            scoringCriteria: {
              likesWeight: 35,
              commentsWeight: 30,
              shareWeight: 35
            },
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
            completedDate: '2024-09-15',
            status: 'completed',
            participants: 140,
            submissions: 90,
            scoringCriteria: {
              likesWeight: 40,
              commentsWeight: 30,
              shareWeight: 30
            },
            winners: [
              { position: 1, name: 'Liam Wong', title: 'Neon Cityscape' },
              { position: 2, name: 'Maria Garcia', title: 'Surreal Portrait' },
              { position: 3, name: 'Chen Wei', title: 'Fantasy Forest' }
            ]
          },
          {
            id: 'landscape-photography-2025',
            name: 'Landscape Photography Challenge',
            description: 'Capture the beauty of nature in stunning landscape photography.',
            deadline: '2025-06-20',
            completedDate: '2025-06-20',
            status: 'completed',
            participants: 95,
            submissions: 75,
            scoringCriteria: {
              likesWeight: 30,
              commentsWeight: 35,
              shareWeight: 35
            },
            winners: [
              { position: 1, name: 'Nuwan Perera', title: 'Misty Mountains' },
              { position: 2, name: 'Chamari Silva', title: 'Golden Hour Beach' },
              { position: 3, name: 'Rohan Fernando', title: 'Valley of Colors' }
            ]
          }
        ].sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate)); // Sort by completion date, most recent first
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
            {/* View Winners and Criteria Details Section */}
            <div className="rounded-lg shadow-sm border p-6 mb-6" style={{backgroundColor: '#FFF5E1'}}>
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
                <select
                  value={selectedWinnerChallenge}
                  onChange={(e) => setSelectedWinnerChallenge(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg font-semibold"
                  style={{borderColor: '#D87C5A', backgroundColor: 'white', color: '#362625'}}
                >
                  <option value="">Select a challenge...</option>
                  {previousChallenges.map(challenge => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.name} - Completed: {new Date(challenge.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Winners for Selected Challenge */}
              {selectedWinnerChallenge && previousChallenges.find(c => String(c.id) === String(selectedWinnerChallenge)) && (
                <div className="space-y-4">
                  {(() => {
                    const challenge = previousChallenges.find(c => String(c.id) === String(selectedWinnerChallenge));
                    return (
                      <>
                        {/* Challenge Info */}
                        <div className="p-4 rounded-lg" style={{backgroundColor: '#f4e8dc'}}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-xl" style={{color: '#362625'}}>{challenge.name}</h4>
                              <span className="px-2 py-1 rounded text-xs font-bold" style={{backgroundColor: '#60a5fa', color: 'white'}}>✓ Completed</span>
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
                                {new Date(challenge.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold" style={{color: '#362625'}}>Deadline:</span>
                              <span className="ml-1 font-medium" style={{color: '#7f5539'}}>
                                {new Date(challenge.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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

                        {/* All Submissions with Calculated Scores */}
                        <div className="bg-white rounded-lg p-6 border-2" style={{borderColor: '#D87C5A'}}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-extrabold tracking-tight" style={{color: '#5D3A00'}}>
                              All Submissions - Calculated Scores
                            </h3>
                            <div className="text-sm px-3 py-1 rounded-lg" style={{backgroundColor: '#FFF5E1', color: '#7f5539'}}>
                              Formula: MAX(0, (Likes × 10) - (Dislikes × 5))
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            All submissions ranked by calculated score. Top 3 are highlighted as winners.
                          </p>

                          {loadingSubmissions ? (
                            <div className="text-center py-12">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#D87C5A'}}></div>
                              <p className="text-sm font-medium" style={{color: '#7f5539'}}>Loading submissions...</p>
                            </div>
                          ) : submissionsError ? (
                            <div className="text-center py-8">
                              <p className="text-sm text-orange-600 mb-2">{submissionsError}</p>
                              <p className="text-xs text-gray-500">Showing demo data below</p>
                            </div>
                          ) : null}

                          {winnerSubmissions.length > 0 ? (
                            <>
                              <div className="space-y-4 mb-6">
                                {winnerSubmissions.filter(submission => submission.position && submission.position <= 3).map((submission, index) => {
                                  const getPositionBadge = (position) => {
                                    if (position === 1) return { icon: '🥇', label: '1st Place', bgColor: '#FFF9E6', borderColor: '#FFD700' };
                                    if (position === 2) return { icon: '🥈', label: '2nd Place', bgColor: '#F5F5F5', borderColor: '#C0C0C0' };
                                    if (position === 3) return { icon: '🥉', label: '3rd Place', bgColor: '#FFF5E1', borderColor: '#CD7F32' };
                                    return null;
                                  };

                                  const positionBadge = getPositionBadge(submission.position);

                                  return (
                                    <div 
                                      key={submission.submissionId || index}
                                      className="p-6 rounded-xl border-2 transition-all hover:shadow-xl"
                                      style={{
                                        backgroundColor: positionBadge ? positionBadge.bgColor : 'white',
                                        borderColor: positionBadge ? positionBadge.borderColor : '#E5E7EB'
                                      }}
                                    >
                                      <div className="flex flex-col md:flex-row items-start gap-6">
                                        {/* Rank Badge */}
                                        <div className="flex-shrink-0">
                                          <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg"
                                            style={{
                                              backgroundColor: positionBadge.borderColor,
                                              color: 'white'
                                            }}
                                          >
                                            {positionBadge.icon}
                                          </div>
                                        </div>

                                        {/* Submission Image */}
                                        {submission.imageUrl && (
                                          <img 
                                            src={submission.imageUrl} 
                                            alt={submission.title}
                                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                                          />
                                        )}

                                        {/* Submission Details */}
                                        <div className="flex-1">
                                          <div className="flex items-start justify-between mb-3">
                                            <div>
                                              <h4 className="font-extrabold text-2xl mb-1" style={{color: '#362625'}}>
                                                {submission.title}
                                              </h4>
                                              <p className="text-base font-semibold" style={{color: '#7f5539'}}>
                                                by {submission.artistName}
                                              </p>
                                            </div>
                                            <span className="px-4 py-2 rounded-full text-sm font-bold shadow-md" style={{
                                              backgroundColor: positionBadge.borderColor,
                                              color: 'white'
                                            }}>
                                              {positionBadge.label}
                                            </span>
                                          </div>

                                          {/* Score Summary */}
                                          <div className="grid grid-cols-4 gap-3">
                                            <div className="bg-white rounded-lg p-3 border text-center" style={{borderColor: '#34D399'}}>
                                              <span className="text-xs font-semibold text-gray-600 block mb-1">Likes</span>
                                              <div className="text-xl font-bold text-green-600">{submission.totalLikes}</div>
                                              <div className="text-xs text-gray-500">× 10 = {submission.totalLikes * 10}</div>
                                            </div>

                                            <div className="bg-white rounded-lg p-3 border text-center" style={{borderColor: '#EF4444'}}>
                                              <span className="text-xs font-semibold text-gray-600 block mb-1">Dislikes</span>
                                              <div className="text-xl font-bold text-red-600">{submission.totalDislikes}</div>
                                              <div className="text-xs text-gray-500">× 5 = {submission.totalDislikes * 5}</div>
                                            </div>

                                            <div className="bg-white rounded-lg p-3 border text-center" style={{borderColor: '#3B82F6'}}>
                                              <span className="text-xs font-semibold text-gray-600 block mb-1">Calculation</span>
                                              <div className="text-base font-medium text-blue-600">
                                                {submission.totalLikes * 10} - {submission.totalDislikes * 5}
                                              </div>
                                              <div className="text-xs text-gray-500">Raw Score</div>
                                            </div>

                                            <div className="rounded-lg p-3 border-2 text-center" style={{
                                              backgroundColor: positionBadge.borderColor,
                                              borderColor: positionBadge.borderColor
                                            }}>
                                              <span className="text-xs font-semibold text-white block mb-1">Final Score</span>
                                              <div className="text-3xl font-black text-white">{submission.calculatedScore}</div>
                                              <div className="text-xs text-white opacity-90">Points</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Single Upload Button for All Winners */}
                              <div className="flex justify-center mt-6">
                                <button
                                  onClick={() => {
                                    const topWinners = winnerSubmissions.filter(submission => submission.position && submission.position <= 3);
                                    const winnerNames = topWinners.map(w => `${w.position}. ${w.artistName} - "${w.title}"`).join('\n');
                                    const confirmUpload = window.confirm(`Upload all top 3 winners to the main feed?\n\n${winnerNames}\n\nThis action will publish all winners' artwork to the main feed.`);
                                    if (confirmUpload) {
                                      console.log('Uploading all winners to main feed:', topWinners);
                                      alert(`Successfully uploaded ${topWinners.length} winners to the main feed!`);
                                      // TODO: Implement API call to upload all winners to main feed
                                      // Example: await axios.post('/api/main-feed/winners', { winners: topWinners, challengeId: selectedWinnerChallenge });
                                    }
                                  }}
                                  className="px-8 py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
                                  style={{backgroundColor: '#D87C5A'}}
                                >
                                  <Send size={24} />
                                  Upload All Winners to Main Feed
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-12">
                              <Trophy className="h-16 w-16 mx-auto mb-3" style={{color: '#D87C5A', opacity: 0.5}} />
                              <p className="text-sm font-medium" style={{color: '#7f5539'}}>
                                No submissions found for this challenge yet.
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Submissions will appear here once artists submit their artwork.
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        );
      }
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
