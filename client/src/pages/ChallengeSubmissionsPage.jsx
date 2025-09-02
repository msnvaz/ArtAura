import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [votingInProgress, setVotingInProgress] = useState(new Set()); // Track which submissions are being voted on

  useEffect(() => {
    fetchSubmissions();
    fetchChallengeDetails();
  }, [challengeId, sortBy]);

  const fetchChallengeDetails = async () => {
    // TODO: Add API endpoint to fetch challenge details
    // For now, set a basic challenge structure
    setChallenge({
      id: challengeId,
      title: "Challenge Details",
      description: "Loading challenge details...",
      category: "Digital Art",
      prize: "TBD",
      participants: 0,
      submissions: 0,
      status: "active",
      timeLeft: "Loading...",
      image: "/heritage.jpeg",
    });
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch challenge submissions from backend
      const submissionsResponse = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/buyer/challenges/${challengeId}/submissions`,
        {
          params: { sortBy },
          headers,
        }
      );

      // Transform API response to match frontend format
      const transformedSubmissions = submissionsResponse.data.map(
        (submission) => ({
          id: submission.submissionId,
          title: submission.title,
          artist: {
            name: submission.artistName,
            avatar:
              submission.artistAvatar ||
              "https://randomuser.me/api/portraits/women/44.jpg",
            followers: submission.artistFollowers || 0,
          },
          image: submission.imageUrl,
          description: submission.description,
          votes: submission.votesCount || 0,
          submittedAt: submission.submittedAt,
          tags: submission.tags || [],
          software: submission.softwareUsed || "Unknown",
          timeSpent: submission.timeSpent || "N/A",
          userHasVoted: submission.userHasVoted || false,
        })
      );

      setSubmissions(transformedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);

      if (error.response?.status === 401) {
        console.error("Authentication failed - token may be invalid");
        // Redirect to login page
        navigate("/");
        return;
      } else if (error.response?.status === 403) {
        console.error("Access forbidden - insufficient permissions");
      }

      // Set empty submissions on error
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (submissionId) => {
    // Prevent multiple simultaneous votes for the same submission
    if (votingInProgress.has(submissionId)) {
      console.log("Vote already in progress for submission", submissionId);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // Add to voting progress set
      setVotingInProgress((prev) => new Set(prev).add(submissionId));

      // Make API call to vote endpoint
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/buyer/challenges/submissions/${submissionId}/vote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const { voted } = response.data;

        // Update only the specific submission with server response
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId
              ? {
                  ...sub,
                  userHasVoted: voted,
                  votes: voted ? sub.votes + 1 : Math.max(sub.votes - 1, 0),
                }
              : sub
          )
        );

        console.log(
          voted ? "Vote added successfully" : "Vote removed successfully"
        );
      }
    } catch (error) {
      console.error("Error voting:", error);

      if (error.response?.status === 401) {
        console.error("Authentication failed - redirecting to login");
        navigate("/login");
      } else if (error.response?.status === 403) {
        console.error("Access forbidden - insufficient permissions");
      } else {
        console.error(
          "Vote operation failed:",
          error.response?.data?.message || error.message
        );
      }
    } finally {
      // Remove from voting progress set
      setVotingInProgress((prev) => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
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
                submission.userHasVoted
                  ? "text-[#7f5539] bg-[#FFD95A] px-2 py-1 rounded-full"
                  : "text-[#D87C5A] hover:text-[#7f5539]"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  submission.userHasVoted ? "fill-current" : ""
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

  const SubmissionModal = ({ submission, onClose }) => {
    // Get the current submission data from the main submissions array
    // This ensures the modal shows updated vote status and counts
    const currentSubmission =
      submissions.find((s) => s.id === submission.id) || submission;

    return (
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
              src={currentSubmission.image}
              alt={currentSubmission.title}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentSubmission.artist.avatar}
                alt={currentSubmission.artist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-[#7f5539] text-xl">
                  {currentSubmission.title}
                </h3>
                <p className="text-[#7f5539]/70">
                  by {currentSubmission.artist.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(currentSubmission.id)}
                  disabled={votingInProgress.has(currentSubmission.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentSubmission.userHasVoted
                      ? "bg-[#FFD95A] text-[#7f5539] border-2 border-[#7f5539]"
                      : "border border-[#FFD95A] text-[#7f5539] hover:bg-[#FFD95A]"
                  } ${
                    votingInProgress.has(currentSubmission.id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      currentSubmission.userHasVoted ? "fill-current" : ""
                    }`}
                  />
                  {votingInProgress.has(currentSubmission.id)
                    ? "Voting..."
                    : `Vote (${currentSubmission.votes})`}
                </button>
              </div>
            </div>

            <p className="text-[#7f5539] mb-4">
              {currentSubmission.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-[#FFF5E1] rounded-lg">
                <Star className="w-5 h-5 text-[#D87C5A] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#7f5539]">
                  {currentSubmission.votes}
                </p>
                <p className="text-xs text-[#7f5539]/60">Votes</p>
              </div>
              <div className="text-center p-3 bg-[#FFF5E1] rounded-lg">
                <Clock className="w-5 h-5 text-[#D87C5A] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#7f5539]">
                  {currentSubmission.timeSpent}
                </p>
                <p className="text-xs text-[#7f5539]/60">Time Spent</p>
              </div>
              <div className="text-center p-3 bg-[#FFF5E1] rounded-lg">
                <Calendar className="w-5 h-5 text-[#D87C5A] mx-auto mb-1" />
                <p className="text-sm font-medium text-[#7f5539]">
                  {formatTimeAgo(currentSubmission.submittedAt)}
                </p>
                <p className="text-xs text-[#7f5539]/60">Submitted</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentSubmission.tags.map((tag, index) => (
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
  };

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
            {submissions.map((submission) => (
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
