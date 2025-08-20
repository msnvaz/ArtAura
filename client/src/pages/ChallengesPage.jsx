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
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const ChallengesPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [error, setError] = useState(null);

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
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/buyer/challenges/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const mapped = (response.data || []).map((challenge, idx) => ({
          id: challenge.id || idx,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          startDate: challenge.publishDateTime,
          endDate: challenge.deadlineDateTime,
          participants: 0, // Placeholder
          submissions: 0, // Placeholder
          timeLeft: getTimeLeft(challenge.deadlineDateTime),
          image: undefined, // No image in DB
        }));
        setChallenges(mapped);
      } catch (err) {
        setError("Failed to load challenges.");
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  function getTimeLeft(deadline) {
    if (!deadline) return "N/A";
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hours`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minutes`;
  }

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
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col min-h-0">
      {/* Header with category only, removed timeLeft */}
      <div className="bg-gradient-to-br from-[#FFD95A] to-[#D87C5A] p-2 flex items-center">
        <div className="flex items-center gap-2">
          {getCategoryIcon(challenge.category)}
          <span className="text-xs font-semibold text-[#7f5539] truncate max-w-[80px]">
            {challenge.category}
          </span>
        </div>
      </div>
      {/* Title */}
      <div className="px-3 pt-2 pb-1 flex-1 flex flex-col">
        <h3 className="font-bold text-[#7f5539] text-base mb-1 line-clamp-2 min-h-[2.2rem]">
          {challenge.title}
        </h3>
        <p className="text-[#7f5539]/70 text-xs mb-1 line-clamp-2">
          {challenge.description}
        </p>
        {/* Stats */}
        <div className="flex justify-between items-center gap-2 mb-1">
          <div className="flex items-center gap-1 bg-[#FFF5E1] rounded px-2 py-1">
            <Users className="w-3 h-3 text-[#D87C5A]" />
            <span className="text-xs font-semibold text-[#7f5539]">
              {challenge.participants}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#FFF5E1] rounded px-2 py-1">
            <Target className="w-3 h-3 text-[#D87C5A]" />
            <span className="text-xs font-semibold text-[#7f5539]">
              {challenge.submissions}
            </span>
          </div>
        </div>
        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-[#7f5539]/80 mb-1">
          <Calendar className="w-3 h-3 text-[#D87C5A]" />
          <span>
            {(() => {
              const start = challenge.startDate
                ? new Date(Date.parse(challenge.startDate))
                : null;
              const end = challenge.endDate
                ? new Date(Date.parse(challenge.endDate))
                : null;
              return start && end
                ? `${start.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} - ${end.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : "";
            })()}
          </span>
        </div>
        {/* Actions */}
        <div className="flex gap-2 mt-1 mb-0">
          <button
            onClick={() => handleJoinChallenge(challenge.id)}
            disabled={role === "buyer"}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              role === "buyer"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D87C5A] to-[#7f5539] hover:from-[#7f5539] hover:to-[#5a3b28] text-white"
            }`}
            title={
              role === "buyer"
                ? "Only artists can join challenges"
                : "Join this challenge"
            }
          >
            {role === "buyer" ? "View" : "Join"}
          </button>
          <button
            onClick={() => handleViewSubmissions(challenge.id)}
            className="flex items-center justify-center w-8 h-8 border-2 border-[#FFD95A] text-[#D87C5A] rounded-lg hover:bg-[#FFD95A] hover:text-[#7f5539] transition-all"
            title="View submissions"
          >
            <Eye className="w-3 h-3" />
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
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
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
