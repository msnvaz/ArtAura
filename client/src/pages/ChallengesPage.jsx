import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  Award,
  Star,
  Eye,
  Heart,
  Filter,
  Search,
  Grid,
  List,
  Play,
  CheckCircle,
  Target,
  Palette,
  Camera,
  Brush,
  Zap,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CartSidebar from "../components/cart/CartSidebar";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const ChallengesPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Sri Lankan themed mock challenges
  const mockActiveChallenges = [
    {
      id: 1,
      title: "Kolam Mask Design Contest",
      description:
        "Design a traditional Kolam mask reflecting Sri Lankan folklore and cultural symbolism.",
      category: "Traditional Art",
      startDate: "2025-07-01",
      endDate: "2025-07-31",
      prize: "Rs. 500,000",
      participants: 120,
      submissions: 80,
      difficulty: "Intermediate",
      status: "active",
      timeLeft: "13 days",
      rules: [
        "Original designs only",
        "Must reflect Sri Lankan traditions",
        "Submit high-resolution artwork",
      ],
      image: "/mask.jpg", // public image
      organizer: "Department of Cultural Affairs",
      tags: ["kolam", "culture", "traditional"],
    },
    {
      id: 2,
      title: "Rural Life Through the Lens",
      description:
        "Capture the heart of rural Sri Lanka — farming, traditions, and everyday life.",
      category: "Photography",
      startDate: "2025-07-15",
      endDate: "2025-08-15",
      prize: "Rs. 300,000",
      participants: 98,
      submissions: 64,
      difficulty: "Beginner",
      status: "active",
      timeLeft: "28 days",
      rules: [
        "Photos must be taken in Sri Lanka",
        "No heavy editing",
        "Submit in JPG or RAW format",
      ],
      image: "/ruralLife.jpeg", // public image
      organizer: "Lanka Art Collective",
      tags: ["rural", "culture", "photography"],
    },
    {
      id: 3,
      title: "Temple Wall Mural Art",
      description:
        "Showcase your mural skills by reimagining Buddhist temple paintings with a modern twist.",
      category: "Religious Art",
      startDate: "2025-07-10",
      endDate: "2025-08-10",
      prize: "Rs. 400,000",
      participants: 74,
      submissions: 45,
      difficulty: "Advanced",
      status: "active",
      timeLeft: "23 days",
      rules: [
        "Themes must reflect Buddhist stories or Jataka tales",
        "Wall-sized format sketches required",
        "Include a concept note",
      ],
      image: "/templeWall.jpeg", // public image
      organizer: "Ministry of Heritage and Arts",
      tags: ["mural", "temple", "heritage"],
    },
  ];

  const categories = [
    "All Categories",
    "Traditional Art",
    "Photography",
    "Religious Art",
    "Sculpture",
    "Textile",
    "Mixed Media",
  ];

  useEffect(() => {
    setTimeout(() => {
      setChallenges(mockActiveChallenges);
      setLoading(false);
    }, 1000);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600 bg-green-100";
      case "Intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "Advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Digital Art":
        return <Palette className="w-4 h-4" />;
      case "Photography":
        return <Camera className="w-4 h-4" />;
      case "Abstract Art":
        return <Brush className="w-4 h-4" />;
      case "Street Art":
        return <Zap className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const handleJoinChallenge = (challengeId) => {
    navigate(`/challenge-submission/${challengeId}`);
  };

  const handleViewSubmissions = (challengeId) => {
    navigate(`/challenge-submissions/${challengeId}`);
  };

  const ChallengeCard = ({ challenge }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-[#D87C5A] text-white px-3 py-1 rounded-full text-sm font-bold">
          {challenge.prize}
        </div>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {challenge.timeLeft} left
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {getCategoryIcon(challenge.category)}
          <span className="text-sm text-[#7f5539]/70">
            {challenge.category}
          </span>
        </div>

        <h3 className="font-bold text-[#7f5539] text-lg mb-2">
          {challenge.title}
        </h3>
        <p className="text-[#7f5539]/80 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D87C5A]" />
            <span className="text-sm text-[#7f5539]">
              {challenge.participants} joined
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D87C5A]" />
            <span className="text-sm text-[#7f5539]">
              {challenge.submissions} submissions
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#7f5539]/70" />
          <span className="text-sm text-[#7f5539]/70">
            {new Date(challenge.startDate).toLocaleDateString()} -{" "}
            {new Date(challenge.endDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleJoinChallenge(challenge.id)}
            disabled={role === "buyer"}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              role === "buyer"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#D87C5A] hover:bg-[#7f5539] text-white"
            }`}
            title={
              role === "buyer"
                ? "Only artists can join challenges"
                : "Join this challenge"
            }
          >
            {role === "buyer" ? "View Only" : "Join Challenge"}
          </button>
          <button
            onClick={() => handleViewSubmissions(challenge.id)}
            className="flex items-center justify-center w-12 h-10 border-2 border-[#FFD95A] text-[#D87C5A] rounded-lg hover:bg-[#FFD95A] hover:text-[#7f5539] transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "All Categories" ||
      challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <CartSidebar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Art Challenges
            </h1>
            <p className="text-[#7f5539]/70">
              Compete with artists worldwide and showcase your creativity
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === "All Categories" ? "all" : category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-[#D87C5A] text-white"
                      : "bg-[#FFD95A] text-[#7f5539]"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-[#D87C5A] text-white"
                      : "bg-[#FFD95A] text-[#7f5539]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
            </div>
          ) : (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }`}
            >
              {filteredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredChallenges.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-[#FFD95A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                No challenges found
              </h3>
              <p className="text-[#7f5539]/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
