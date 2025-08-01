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
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const isSignedIn = !!token;
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
                  className="border rounded-lg p-4 text-left h-full transition-all duration-200 relative overflow-hidden"
                  style={{
                    borderColor: "#FFE4D6",
                    backgroundColor: "#FFE4D6",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#FFD95A";
                    e.target.style.borderColor = "#D87C5A";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(93, 58, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#FFE4D6";
                    e.target.style.borderColor = "#FFE4D6";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                  className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-50"
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
        // Art-related Challenge Details for Artists, including winner selection
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#5D3A00'}}>Art Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Currently Selected Active Challenge from WinnerSelection */}
              {/* Drawing Competition */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Drawing</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">National Drawing Competition</h3>
                <p className="text-gray-600 text-sm mb-4">Showcase your drawing skills on the theme "Nature and Wildlife". Open to all artists.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Deadline: 8/30/2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users size={16} />
                  <span>210 participants • 120 submissions</span>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              </div>
              {/* Landscape Painting Challenge - Another Active Challenge */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Painting</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Landscape Painting Challenge</h3>
                <p className="text-gray-600 text-sm mb-4">Paint a beautiful landscape inspired by your favorite place. All painting styles and mediums are welcome.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Deadline: 9/5/2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users size={16} />
                  <span>160 participants • 80 submissions</span>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              </div>
              {/* Portrait Art Challenge */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Portrait</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Portrait Art Challenge</h3>
                <p className="text-gray-600 text-sm mb-4">Create a portrait artwork of a famous personality using any medium of your choice.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Deadline: 9/10/2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users size={16} />
                  <span>175 participants • 98 submissions</span>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Review</span>
              </div>
              {/* Abstract Art Contest */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Abstract</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Abstract Art Contest</h3>
                <p className="text-gray-600 text-sm mb-4">Express your creativity with abstract art. All styles and mediums are welcome.</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Deadline: 9/25/2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users size={16} />
                  <span>132 participants • 70 submissions</span>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>
                {/* Winner Selection Example */}
                <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200">
                  <span className="block text-sm font-semibold text-blue-800 mb-1">Winner Selected</span>
                  <span className="block text-xs text-blue-700">Winner: Priya Sharma (Artwork: "Dreamscape")</span>
                </div>
              </div>
            </div>
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors mb-8"
              style={{backgroundColor: '#D87C5A', color: 'white'}}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#B85A3A';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#D87C5A';
              }}
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
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-h-screen" style={{ backgroundColor: "#FFF5E1" }}>
        {/* Full Width Header */}
        <div
          className="w-full shadow-sm p-6 mb-8 relative"
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
                  className="p-3 rounded-full"
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
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#FFE4D6";
                    e.target.style.color = "#5D3A00";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 228, 214, 0.1)";
                    e.target.style.color = "#FFE4D6";
                  }}
                  onClick={() => navigate("/create-challenge")}
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Create Challenge</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#FFE4D6";
                    e.target.style.color = "#5D3A00";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 228, 214, 0.1)";
                    e.target.style.color = "#FFE4D6";
                  }}
                  onClick={() => navigate("/verify-exhibition")}
                >
                  <Shield size={14} />
                  <span className="hidden sm:inline">Verify Exhibition</span>
                  <span className="sm:hidden">Verify</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#FFE4D6";
                    e.target.style.color = "#5D3A00";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 228, 214, 0.1)";
                    e.target.style.color = "#FFE4D6";
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
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: "#D87C5A",
                      color: "white",
                      border: "none",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#B85A3A";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#D87C5A";
                    }}
                    onClick={handleLogoutClick}
                  >
                    <User size={14} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <a
                    href="/"
                    className="px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap no-underline"
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
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div style={{ borderBottom: "1px solid #FFE4D6" }}>
              <nav className="flex space-x-8 px-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
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
          <div>{renderContent()}</div>
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
