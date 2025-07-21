import {
  Award,
  BarChart3,
  Clock,
  Plus,
  Shield,
  Star,
  Trophy,
  User,
  Users,
  Calendar,
  Edit,
  Eye,
  Filter,
  Search,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const isSignedIn = !!token;
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Challenge List state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Challenge data for the integrated Challenge List
  const challenges = [
    {
      id: 1,
      title: 'Modern Art Challenge 2025',
      description: 'Create an innovative web design that showcases modern UI/UX principles.',
      status: 'active',
      publishDate: '2024-01-15',
      deadline: '2024-02-15',
      participants: 156,
      submissions: 89,
      category: 'Design'
    },
    {
      id: 2,
      title: 'Digital Art Challenge',
      description: 'Develop a mobile application that solves a real-world problem.',
      status: 'review',
      publishDate: '2024-01-10',
      deadline: '2024-02-10',
      participants: 203,
      submissions: 145,
      category: 'Development'
    },
    {
      id: 3,
      title: 'AI Art Competition',
      description: 'Create stunning artwork using artificial intelligence tools.',
      status: 'completed',
      publishDate: '2024-01-05',
      deadline: '2024-02-05',
      participants: 89,
      submissions: 67,
      category: 'Art'
    },
    {
      id: 4,
      title: 'New Art Competition August-2025',
      description: 'Build solutions for environmental challenges.',
      status: 'draft',
      publishDate: '2024-02-20',
      deadline: '2024-03-20',
      participants: 0,
      submissions: 0,
      category: 'Innovation'
    }
  ];

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
      id: "verification",
      label: "Verification",
      icon: Shield,
      desc: "Verify exhibitions and submissions",
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
      message: "New challenge created: Digital Art Showcase",
      time: "2 hours ago",
      icon: Trophy,
    },
    {
      type: "verification",
      message: "Exhibition verified: Modern Art Gallery",
      time: "4 hours ago",
      icon: Shield,
    },
    {
      type: "winner",
      message: "Winner selected: Web Design Challenge",
      time: "6 hours ago",
      icon: Award,
    },
    {
      type: "scoring",
      message: "Scoring criteria updated: AI Art Competition",
      time: "8 hours ago",
      icon: Star,
    },
  ];

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: BarChart3 },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "scoring", label: "Scoring", icon: Star },
    { id: "winner", label: "Winners", icon: Award },
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
                    else if (action.id === "verification")
                      navigate("/verify-exhibition");
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
        // Integrated Challenge Details Dashboard (previously from ChallengeList)
        return (
          <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-amber-900">All Challenges</h2>
                <p className="text-amber-700 mt-1">View and manage challenge details</p>
              </div>
              <button
                onClick={() => navigate("/create-challenge")}
                className="border px-4 py-2 rounded-lg font-medium flex items-center space-x-2 btn-animate"
                style={{
                  borderColor: '#D87C5A',
                  color: '#D87C5A',
                  backgroundColor: 'rgba(216, 124, 90, 0.1)'
                }}
              >
                <Plus size={16} />
                <span>Create Challenge</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 smooth-transition">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search challenges..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Challenge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow card-animate">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">{challenge.category}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(challenge.status)}`}>
                        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={16} />
                        <span>{challenge.participants} participants • {challenge.submissions} submissions</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                        className="text-sm font-medium text-amber-800 hover:text-amber-900 btn-animate"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        );
      case 'verification':
        // Inline Approved and Rejected Exhibitions
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#5D3A00'}}>Exhibition Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Approved Exhibition Example */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-400">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Approved</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Art Showcase 2024</h3>
                <p className="text-gray-600 text-sm mb-4">A contemporary art exhibition featuring local artists exploring themes of urban life and digital culture.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Start: 8/15/2024</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <User size={16} />
                  <span>Sarah Johnson</span>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
              </div>
              {/* Rejected Exhibition Example */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-400">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Rejected</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Art Festival</h3>
                <p className="text-gray-600 text-sm mb-4">Interactive digital art installations and VR experiences that push the boundaries of technology and creativity.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Start: 8/10/2024</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <User size={16} />
                  <span>Alex Kim</span>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>
                <div className="mt-2 text-xs text-red-700">Reason: Insufficient venue safety documentation</div>
              </div>
            </div>
          </div>
        );
      case 'scoring':
        return <div className="p-6">Scoring Criteria content coming soon...</div>;
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
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      {/* Optimized CSS styles for smoother animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popInContent {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-container {
          animation: smoothFadeIn 0.4s ease-out;
          opacity: 1;
        }

        .header-container {
          animation: slideInFromTop 0.5s ease-out 0.1s both;
        }

        .nav-container {
          animation: slideInFromTop 0.5s ease-out 0.2s both;
        }

        .content-container {
          animation: popInContent 0.4s ease-out 0.3s both;
        }

        .menu-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .menu-item:hover {
          transform: translateY(-1px);
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .card-animate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-animate:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Prevent flash of unstyled content */
        .dashboard-content {
          min-height: 200px;
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

      <div
        className="min-h-screen page-container"
        style={{ backgroundColor: "#FFF5E1" }}
      >
        {/* Full Width Header */}
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
                <div
                  className="p-3 rounded-full smooth-transition"
                  style={{ backgroundColor: "#FFD95A" }}
                >
                  <Shield size={32} style={{ color: "#5D3A00" }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Moderator Dashboard
                  </h1>
                  <p className="text-gray-200">
                    Welcome back! Here's what's happening with your challenges.
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onClick={() => navigate("/create-challenge")}
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Create Challenge</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onClick={() => navigate("/verify-exhibition")}
                >
                  <Shield size={14} />
                  <span className="hidden sm:inline">Verify Exhibition</span>
                  <span className="sm:hidden">Verify</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onClick={() => navigate("/winner-selection")}
                >
                  <Award size={14} />
                  <span className="hidden sm:inline">Select Winners</span>
                  <span className="sm:hidden">Winners</span>
                </button>

                {/* Auth Button */}
                {isSignedIn ? (
                  <button
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                    style={{
                      backgroundColor: "#D87C5A",
                      color: "white",
                      border: "none",
                    }}
                    onClick={handleLogoutClick}
                  >
                    <User size={14} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <a
                    href="/"
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate no-underline"
                    style={{
                      backgroundColor: "#D87C5A",
                      color: "white",
                      border: "none",
                      textDecoration: "none",
                    }}
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
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8 nav-container">
            <div style={{ borderBottom: "1px solid #FFE4D6" }}>
              <nav className="flex space-x-8 px-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 menu-item"
                    style={{
                      borderBottomColor:
                        activeSection === item.id ? "#5D3A00" : "transparent",
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
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#362625] mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to log out of your account?
              </p>
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
    </>
  );
};

export default ModeratorDashboard;
