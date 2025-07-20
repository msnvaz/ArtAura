import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Heart,
  User,
  Calendar,
  Trophy,
  Star,
  Filter,
  Grid,
  List,
  Award,
  Users,
  Clock,
  Download,
  Share2,
  Flag,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CartSidebar from "../components/cart/CartSidebar";

const ChallengeSubmissionsPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Track user's votes

  // Mock challenge data
  const mockChallenge = {
    id: 1,
    title: "Digital Heritage Lanka 2025",
    description:
      "Create stunning digital artwork inspired by Sri Lankan cultural heritage, temples, and traditional motifs using any digital medium",
    category: "Digital Art",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    prize: "LKR 15,000",
    participants: 234,
    submissions: 156,
    status: "active",
    timeLeft: "13 days",
    organizer: "Digital Arts Collective Sri Lanka",
    image:
      "/heritage.jpeg",
  };

  // Mock submissions data
  const mockSubmissions = [
    {
      id: 1,
      title: "Temple of the Sacred Tooth",
      artist: {
        name: "Sanduni Perera",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        followers: 1254,
      },
      image: "/kandyTemple.jpeg", // public image
      description:
        "A vibrant digital interpretation of the sacred Temple of the Tooth in Kandy, blending traditional architecture with modern artistic vision",
      votes: 156,
      submittedAt: "2025-07-18T10:30:00Z",
      tags: ["temple", "kandy", "heritage"],
      software: "Photoshop",
      timeSpent: "12 hours",
    },
    {
      id: 2,
      title: "Lankan Tea Gardens",
      artist: {
        name: "Kasun Fernando",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        followers: 892,
      },
      image: "/teaPlants.jpeg", // public image
      description:
        "An emotional journey through the misty tea gardens of Nuwara Eliya, capturing the essence of Ceylon's hill country heritage",
      votes: 89,
      submittedAt: "2025-07-17T14:20:00Z",
      tags: ["tea", "hills", "nuwara-eliya"],
      software: "Procreate",
      timeSpent: "8 hours",
    },
    {
      id: 3,
      title: "Ancient Sigiriya Rock",
      artist: {
        name: "Priya Jayasinghe",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        followers: 2156,
      },
      image: "/sigiriya.jpeg", // public image
      description:
        "A majestic digital artwork showcasing the iconic Sigiriya Rock Fortress with traditional Kandyan artistic elements",
      votes: 234,
      submittedAt: "2025-07-16T09:00:00Z",
      tags: ["sigiriya", "fortress", "ancient"],
      software: "Blender + Photoshop",
      timeSpent: "24 hours",
    },
    {
      id: 4,
      title: "Galle Fort Heritage",
      artist: {
        name: "Dilshan Silva",
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        followers: 743,
      },
      image: "/galleFort.jpeg", // public image
      description:
        "Blending Dutch colonial architecture of Galle Fort with vibrant Sri Lankan cultural motifs and tropical elements",
      votes: 127,
      submittedAt: "2025-07-15T16:45:00Z",
      tags: ["galle", "colonial", "heritage"],
      software: "Adobe Illustrator",
      timeSpent: "15 hours",
    },
    {
      id: 5,
      title: "Colombo Street Life",
      artist: {
        name: "Nimali Wickramasinghe",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        followers: 567,
      },
      image: "/colomboLife.jpeg", // public image
      description:
        "A vibrant portrayal of modern Colombo's bustling street life, featuring tuk-tuks, vendors, and the multicultural energy of the capital",
      votes: 98,
      submittedAt: "2025-07-14T11:20:00Z",
      tags: ["colombo", "street", "urban"],
      software: "Digital Paint",
      timeSpent: "10 hours",
    },
    {
      id: 6,
      title: "Kandyan Dancer",
      artist: {
        name: "Amara Rathnayake",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        followers: 1089,
      },
      image: "/kandyanDancer.jpeg", // public image
      description:
        "Traditional Kandyan dancer captured in dynamic motion, celebrating our rich cultural dance heritage with digital artistry",
      votes: 145,
      submittedAt: "2025-07-13T08:15:00Z",
      tags: ["dance", "traditional", "culture"],
      software: "Clip Studio Paint",
      timeSpent: "18 hours",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChallenge(mockChallenge);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, [challengeId]);

  const handleVote = (submissionId) => {
    // Check if user has already voted
    if (userVotes[submissionId]) {
      // Remove vote
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, votes: sub.votes - 1 } : sub
        )
      );
      setUserVotes((prev) => ({ ...prev, [submissionId]: false }));
    } else {
      // Add vote
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, votes: sub.votes + 1 } : sub
        )
      );
      setUserVotes((prev) => ({ ...prev, [submissionId]: true }));
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const sortSubmissions = (submissions, sortBy) => {
    switch (sortBy) {
      case "newest":
        return [...submissions].sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
      case "oldest":
        return [...submissions].sort(
          (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)
        );
      case "mostVoted":
        return [...submissions].sort((a, b) => b.votes - a.votes);
      default:
        return submissions;
    }
  };

  const SubmissionCard = ({ submission }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300">
      <div
        className="relative cursor-pointer"
        onClick={() => setSelectedSubmission(submission)}
      >
        <img
          src={submission.image}
          alt={submission.title}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={submission.artist.avatar}
            alt={submission.artist.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-[#7f5539] text-sm">
              {submission.artist.name}
            </h4>
            <p className="text-xs text-[#7f5539]/60">
              {submission.artist.followers} followers
            </p>
          </div>
          <span className="text-xs text-[#7f5539]/60">
            {formatTimeAgo(submission.submittedAt)}
          </span>
        </div>

        <h3 className="font-bold text-[#7f5539] text-lg mb-2">
          {submission.title}
        </h3>
        <p className="text-[#7f5539]/80 text-sm mb-3 line-clamp-2">
          {submission.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote(submission.id)}
              className={`flex items-center gap-1 transition-colors ${
                userVotes[submission.id]
                  ? "text-[#7f5539] bg-[#FFD95A] px-2 py-1 rounded-full"
                  : "text-[#D87C5A] hover:text-[#7f5539]"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  userVotes[submission.id] ? "fill-current" : ""
                }`}
              />
              <span className="text-sm">{submission.votes}</span>
            </button>
            <div className="flex items-center gap-1 text-[#7f5539]/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{submission.timeSpent}</span>
            </div>
          </div>
          <span className="text-xs bg-[#FFD95A] text-[#7f5539] px-2 py-1 rounded-full">
            {submission.software}
          </span>
        </div>
      </div>
    </div>
  );

  const SubmissionModal = ({ submission, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
          >
            ✕
          </button>
          <img
            src={submission.image}
            alt={submission.title}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={submission.artist.avatar}
              alt={submission.artist.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-[#7f5539] text-xl">
                {submission.title}
              </h3>
              <p className="text-[#7f5539]/70">by {submission.artist.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(submission.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  userVotes[submission.id]
                    ? "bg-[#FFD95A] text-[#7f5539] border-2 border-[#7f5539]"
                    : "border border-[#FFD95A] text-[#7f5539] hover:bg-[#FFD95A]"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    userVotes[submission.id] ? "fill-current" : ""
                  }`}
                />
                Vote ({submission.votes})
              </button>
            </div>
          </div>

          <p className="text-[#7f5539] mb-4">{submission.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-[#FFF5E1] rounded-lg">
              <Star className="w-5 h-5 text-[#D87C5A] mx-auto mb-1" />
              <p className="text-sm font-medium text-[#7f5539]">
                {submission.votes}
              </p>
              <p className="text-xs text-[#7f5539]/60">Votes</p>
            </div>
            <div className="text-center p-3 bg-[#FFF5E1] rounded-lg">
              <Clock className="w-5 h-5 text-[#D87C5A] mx-auto mb-1" />
              <p className="text-sm font-medium text-[#7f5539]">
                {submission.timeSpent}
              </p>
              <p className="text-xs text-[#7f5539]/60">Time Spent</p>
            </div>
            <div className="text-center p-3 bg-[#FFF5E1] rounded-lg">
              <Calendar className="w-5 h-5 text-[#D87C5A] mx-auto mb-1" />
              <p className="text-sm font-medium text-[#7f5539]">
                {formatTimeAgo(submission.submittedAt)}
              </p>
              <p className="text-xs text-[#7f5539]/60">Submitted</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {submission.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#FFD95A] text-[#7f5539] px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E1]">
        <Navbar />
        <CartSidebar />
        <div className="pt-20 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
        </div>
      </div>
    );
  }

  const sortedSubmissions = sortSubmissions(submissions, sortBy);

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <CartSidebar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/public-challenges")}
              className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Challenges
            </button>

            <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
                    {challenge.title}
                  </h1>
                  <p className="text-[#7f5539]/80 mb-4">
                    {challenge.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Trophy className="w-4 h-4" />
                      {challenge.prize}
                    </div>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Users className="w-4 h-4" />
                      {challenge.participants} participants
                    </div>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Award className="w-4 h-4" />
                      {challenge.submissions} submissions
                    </div>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Clock className="w-4 h-4" />
                      {challenge.timeLeft} left
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-xl font-bold text-[#7f5539]">
                All Submissions ({submissions.length})
              </h2>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostVoted">Most Voted</option>
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
          </div>

          {/* Submissions Grid */}
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }`}
          >
            {sortedSubmissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>

          {/* No Results */}
          {submissions.length === 0 && (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-[#FFD95A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                No submissions yet
              </h3>
              <p className="text-[#7f5539]/70">
                Be the first to submit your artwork to this challenge!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};

export default ChallengeSubmissionsPage;
