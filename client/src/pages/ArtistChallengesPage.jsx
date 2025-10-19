import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  Award,
  Star,
  Eye,
  Heart,
  Upload,
  CheckCircle,
  Target,
  Palette,
  Camera,
  Brush,
  Zap,
  Plus,
  Edit3,
  Send,
  FileText,
  Image,
  AlertCircle,
  Timer,
  Medal,
  TrendingUp,
  Activity,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import challengeParticipationApi from "../api/challengeParticipationApi";

const ArtistChallengesPage = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [challenges, setChallenges] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showIterationModal, setShowIterationModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load active challenges with participant and submission counts
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buyer/challenges/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Map the response to include participant and submission counts from backend
      const mappedChallenges = (response.data || []).map((challenge) => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        startDate: challenge.publishDateTime,
        endDate: challenge.deadlineDateTime,
        participants: challenge.participantCount || 0, // Real participant count from DB
        submissions: challenge.submissionCount || 0, // Real submission count from DB
        difficulty: "Intermediate", // Default since not in DB
        status: challenge.status || "active",
        timeLeft: getTimeLeft(challenge.deadlineDateTime),
        rules: ["Original artwork only", "Follow challenge guidelines"],
        image:
          "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600",
        organizer: "ArtAura Team",
        tags: ["creative", "challenge"],
        joined: false, // TODO: Check if user has joined
        maxSubmissions: 3,
      }));

      setChallenges(mappedChallenges);

      // Load artist's submissions
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (userInfo.artistId) {
        const artistSubmissions =
          await challengeParticipationApi.getArtistParticipations(
            userInfo.artistId
          );
        setMySubmissions(artistSubmissions);
      }
    } catch (error) {
      console.error("Error loading challenge data:", error);
      // Fall back to mock data if API fails
      setChallenges(mockAvailableChallenges);
      setMySubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeLeft = (deadline) => {
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
  };

  useEffect(() => {
    loadData();
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

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "text-blue-600 bg-blue-100";
      case "in_review":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleJoinChallenge = (challengeId) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? {
              ...challenge,
              joined: true,
              participants: challenge.participants + 1,
            }
          : challenge
      )
    );
  };

  const handleSubmitToChallenge = (challengeId) => {
    setSelectedChallenge(challengeId);
    setShowSubmissionModal(true);
  };

  const handleIterate = (submission) => {
    setSelectedChallenge(submission);
    setShowIterationModal(true);
  };

  const SubmissionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-[#7f5539] mb-4">
          Submit Your Artwork
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Artwork Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
              placeholder="Enter artwork title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
              rows="3"
              placeholder="Describe your artwork"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Upload Artwork
            </label>
            <div className="border-2 border-dashed border-[#FFD95A] rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-[#D87C5A] mx-auto mb-2" />
              <p className="text-sm text-[#7f5539]">
                Click to upload or drag and drop
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSubmissionModal(false)}
              className="flex-1 px-4 py-2 border border-[#FFD95A] text-[#7f5539] rounded-lg hover:bg-[#FFD95A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowSubmissionModal(false)}
              className="flex-1 px-4 py-2 bg-[#D87C5A] text-white rounded-lg hover:bg-[#7f5539] transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const IterationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-6 h-6 text-[#D87C5A]" />
          <h3 className="text-lg font-bold text-[#7f5539]">
            Continue to Iterate?
          </h3>
        </div>

        <div className="bg-[#FFF5E1] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-[#D87C5A]" />
            <span className="font-medium text-[#7f5539]">
              Iteration Opportunity
            </span>
          </div>
          <p className="text-sm text-[#7f5539]/80 mb-2">
            Based on feedback and performance, you can create an improved
            version of your artwork.
          </p>
          <div className="text-xs text-[#7f5539]/60">
            Current iteration: {selectedChallenge?.iterationCount || 0} /{" "}
            {selectedChallenge?.maxIterations || 2}
          </div>
        </div>

        {selectedChallenge?.feedback && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Feedback Received
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {selectedChallenge.feedback}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Iteration Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
              rows="3"
              placeholder="Describe what you're improving in this iteration..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Upload Improved Artwork
            </label>
            <div className="border-2 border-dashed border-[#FFD95A] rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-[#D87C5A] mx-auto mb-2" />
              <p className="text-sm text-[#7f5539]">
                Upload your improved artwork
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowIterationModal(false)}
              className="flex-1 px-4 py-2 border border-[#FFD95A] text-[#7f5539] rounded-lg hover:bg-[#FFD95A] transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={() => setShowIterationModal(false)}
              className="flex-1 px-4 py-2 bg-[#D87C5A] text-white rounded-lg hover:bg-[#7f5539] transition-colors"
            >
              Submit Iteration
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ChallengeCard = ({ challenge }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300">
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
        {challenge.joined && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Joined
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-[#D87C5A]" />
          <span className="text-sm text-[#7f5539]/70">
            {challenge.category}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
              challenge.difficulty
            )}`}
          >
            {challenge.difficulty}
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

        <div className="flex gap-2">
          {!challenge.joined ? (
            <button
              onClick={() => handleJoinChallenge(challenge.id)}
              className="flex-1 bg-[#D87C5A] hover:bg-[#7f5539] text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Join Challenge
            </button>
          ) : (
            <button
              onClick={() => handleSubmitToChallenge(challenge.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Artwork
            </button>
          )}
          <button className="flex items-center justify-center w-12 h-10 border-2 border-[#FFD95A] text-[#D87C5A] rounded-lg hover:bg-[#FFD95A] hover:text-[#7f5539] transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const SubmissionCard = ({ submission }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={submission.image}
          alt={submission.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-[#D87C5A] text-white px-3 py-1 rounded-full text-sm font-bold">
          Rank #{submission.rank}
        </div>
        {submission.isIteration && (
          <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Iteration {submission.iterationCount}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
              submission.status
            )}`}
          >
            {submission.status}
          </span>
          <span className="text-sm text-[#7f5539]/70">
            {submission.challengeTitle}
          </span>
        </div>

        <h3 className="font-bold text-[#7f5539] text-lg mb-2">
          {submission.title}
        </h3>
        <p className="text-[#7f5539]/80 text-sm mb-4 line-clamp-2">
          {submission.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D87C5A]" />
            <span className="text-sm text-[#7f5539]">
              {submission.likes} likes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#D87C5A]" />
            <span className="text-sm text-[#7f5539]">
              {submission.views} views
            </span>
          </div>
        </div>

        {submission.feedback && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Feedback
              </span>
            </div>
            <p className="text-sm text-blue-700">{submission.feedback}</p>
          </div>
        )}

        <div className="flex gap-2">
          {submission.canIterate &&
            submission.iterationCount < submission.maxIterations && (
              <button
                onClick={() => handleIterate(submission)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Iterate
              </button>
            )}
          <button className="flex items-center justify-center w-12 h-10 border-2 border-[#FFD95A] text-[#D87C5A] rounded-lg hover:bg-[#FFD95A] hover:text-[#7f5539] transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "available", label: "Available Challenges", icon: Trophy },
    { id: "my-submissions", label: "My Submissions", icon: Send },
    { id: "results", label: "Results", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Artist Challenges
            </h1>
            <p className="text-[#7f5539]/70">
              Participate in challenges, submit your artwork, and iterate to
              improve
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#D87C5A] text-white"
                    : "bg-white text-[#7f5539] hover:bg-[#FFD95A]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
            </div>
          ) : (
            <>
              {activeTab === "available" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              )}

              {activeTab === "my-submissions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySubmissions.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                    />
                  ))}
                </div>
              )}

              {activeTab === "results" && (
                <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-8 text-center">
                  <Trophy className="w-16 h-16 text-[#D87C5A] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#7f5539] mb-2">
                    Challenge Results
                  </h3>
                  <p className="text-[#7f5539]/70">
                    Results will be displayed here once challenges are completed
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSubmissionModal && <SubmissionModal />}
      {showIterationModal && <IterationModal />}
    </div>
  );
};

export default ArtistChallengesPage;
