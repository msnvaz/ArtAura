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
import ImageZoomLens from "../components/artworks/ImageZoomLense";

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
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buyer/challenges/${challengeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const challengeData = response.data;

      // Calculate time left
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

      setChallenge({
        id: challengeData.id,
        title: challengeData.title || "Challenge Details",
        description:
          challengeData.description || "Loading challenge details...",
        category: challengeData.category || "Digital Art",
        prize: "TBD", // Prize not in current schema
        participants: challengeData.participantCount || 0, // Real participant count from DB
        submissions: challengeData.submissionCount || 0, // Real submission count from DB
        status: challengeData.status || "active",
        timeLeft: getTimeLeft(challengeData.deadlineDateTime),
        image: "/heritage.jpeg", // Default image since not in DB
      });
    } catch (error) {
      console.error("Error fetching challenge details:", error);
      // Fallback to default challenge structure
      setChallenge({
        id: challengeId,
        title: "Challenge Details",
        description: "Could not load challenge details",
        category: "Digital Art",
        prize: "TBD",
        participants: 0,
        submissions: 0,
        status: "active",
        timeLeft: "N/A",
        image: "/heritage.jpeg",
      });
    }
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

      // Transform API response to use new challenge_participants table structure
      const transformedSubmissions = submissionsResponse.data.map(
        (submission) => ({
          // Map new challenge_participants fields
          id: submission.id,
          artworkTitle: submission.artworkTitle,
          artworkDescription: submission.artworkDescription,
          artworkImagePath: submission.artworkImagePath,
          submissionDate: submission.submissionDate,
          status: submission.status,
          rating: submission.rating,
          judgeComments: submission.judgeComments,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
          challengeId: submission.challengeId,
          artistId: submission.artistId,

          // Artist information
          artist: {
            name: submission.artistName || "Unknown Artist",
            avatar:
              submission.artistAvatar ||
              "https://randomuser.me/api/portraits/women/44.jpg",
            followers: submission.artistFollowers || 0,
          },

          // Voting information
          votes: submission.votesCount || 0,
          userHasVoted: submission.userHasVoted || false,

          // Legacy compatibility fields
          title: submission.artworkTitle,
          description: submission.artworkDescription,
          image: submission.artworkImagePath,
          submittedAt: submission.submissionDate,
          tags: [], // Not available in challenge_participants table
          software: "N/A", // Not available in challenge_participants table
          timeSpent: "N/A", // Not available in challenge_participants table
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
        alert("Please log in to vote");
        return;
      }

      // Add to voting progress set
      setVotingInProgress((prev) => new Set(prev).add(submissionId));

      console.log(`Attempting to vote for submission ${submissionId}`);

      // Make API call to vote endpoint
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/buyer/challenges/submissions/${submissionId}/vote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Vote response:", response.data);

      if (response.data.success) {
        const { voted } = response.data;

        // Update the submission state immediately for better UX
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

        // Also update selected submission if it's open in modal
        if (selectedSubmission && selectedSubmission.id === submissionId) {
          setSelectedSubmission((prev) => ({
            ...prev,
            userHasVoted: voted,
            votes: voted ? prev.votes + 1 : Math.max(prev.votes - 1, 0),
          }));
        }

        console.log(
          voted ? "Vote added successfully" : "Vote removed successfully"
        );

        // Optional: Show success message to user
        // You can add a toast notification here if you have one
      } else {
        console.error("Vote operation failed:", response.data.message);
        alert("Failed to process vote. Please try again.");
      }
    } catch (error) {
      console.error("Error voting:", error);

      if (error.response?.status === 401) {
        console.error("Authentication failed - redirecting to login");
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        console.error("Access forbidden - insufficient permissions");
        alert(
          "You don't have permission to vote. Please ensure you're logged in as a buyer."
        );
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response?.data?.message);
        alert("Server error occurred. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout");
        alert("Request timed out. Please check your connection and try again.");
      } else {
        console.error(
          "Vote operation failed:",
          error.response?.data?.message || error.message
        );
        alert("Failed to process vote. Please try again.");
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
          src={submission.artworkImagePath || submission.image}
          alt={submission.artworkTitle || submission.title}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Display rating badge if available */}
        {submission.rating && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            {submission.rating.toFixed(1)}
          </div>
        )}
        {/* Display status badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
            submission.status === "approved"
              ? "bg-green-500 text-white"
              : submission.status === "rejected"
              ? "bg-red-500 text-white"
              : submission.status === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {submission.status}
        </div>
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
            {formatTimeAgo(submission.submissionDate || submission.submittedAt)}
          </span>
        </div>

        <h3 className="font-bold text-[#7f5539] text-lg mb-2">
          {submission.artworkTitle || submission.title}
        </h3>
        <p className="text-[#7f5539]/80 text-sm mb-3 line-clamp-2">
          {submission.artworkDescription || submission.description}
        </p>

        {/* Display judge comments if available */}
        {submission.judgeComments && (
          <div className="bg-blue-50 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-1 mb-1">
              <User className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">
                Judge Feedback
              </span>
            </div>
            <p className="text-xs text-blue-700 line-clamp-2">
              {submission.judgeComments}
            </p>
          </div>
        )}

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
            {submission.rating && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Award className="w-4 h-4" />
                <span className="text-sm">{submission.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                submission.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : submission.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : submission.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {submission.status}
            </span>
            <div className="text-xs text-[#7f5539]/60 mt-1">
              {new Date(
                submission.submissionDate || submission.submittedAt
              ).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SubmissionModal = ({ submission, onClose }) => {
    // Get the current submission data from the main submissions array
    const currentSubmission =
      submissions.find((s) => s.id === submission.id) || submission;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
            >
              ✕
            </button>

            {/* Reduced image container height for better fit */}
            <div className="w-full h-[50vh] overflow-hidden rounded-t-2xl bg-gray-100 flex items-center justify-center">
              <ImageZoomLens
                src={
                  currentSubmission.artworkImagePath || currentSubmission.image
                }
                alt={currentSubmission.artworkTitle || currentSubmission.title}
                zoom={2.5}
                lensSize={200}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error(
                    "Failed to load submission image:",
                    currentSubmission.artworkImagePath ||
                      currentSubmission.image
                  );
                }}
              />
            </div>
          </div>

          {/* Compact content section */}
          <div className="p-4">
            {/* Header with artist info and voting - compact */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={currentSubmission.artist.avatar}
                alt={currentSubmission.artist.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-[#7f5539] text-lg mb-1">
                  {currentSubmission.artworkTitle || currentSubmission.title}
                </h3>
                <p className="text-[#7f5539]/70 text-sm">
                  by {currentSubmission.artist.name} •{" "}
                  {currentSubmission.artist.followers} followers
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Rating display */}
                {currentSubmission.rating && (
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1 fill-current" />
                    <p className="text-sm font-bold text-yellow-700">
                      {currentSubmission.rating.toFixed(1)}
                    </p>
                  </div>
                )}

                {/* Vote button */}
                <button
                  onClick={() => handleVote(currentSubmission.id)}
                  disabled={votingInProgress.has(currentSubmission.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
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
                  <span className="text-sm">
                    {votingInProgress.has(currentSubmission.id)
                      ? "Voting..."
                      : `${currentSubmission.votes}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Status and submission info - compact grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center p-2 bg-[#FFF5E1] rounded-lg">
                <Trophy className="w-4 h-4 text-[#D87C5A] mx-auto mb-1" />
                <p className="text-sm font-bold text-[#7f5539]">
                  {currentSubmission.votes}
                </p>
                <p className="text-xs text-[#7f5539]/60">Votes</p>
              </div>

              <div className="text-center p-2 bg-[#FFF5E1] rounded-lg">
                <Calendar className="w-4 h-4 text-[#D87C5A] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#7f5539]">
                  {new Date(
                    currentSubmission.submissionDate ||
                      currentSubmission.submittedAt
                  ).toLocaleDateString()}
                </p>
                <p className="text-xs text-[#7f5539]/60">Date</p>
              </div>

              <div className="text-center p-2 bg-[#FFF5E1] rounded-lg">
                <Flag
                  className={`w-4 h-4 mx-auto mb-1 ${
                    currentSubmission.status === "approved"
                      ? "text-green-600"
                      : currentSubmission.status === "rejected"
                      ? "text-red-600"
                      : currentSubmission.status === "pending"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                />
                <p
                  className={`text-xs font-bold capitalize ${
                    currentSubmission.status === "approved"
                      ? "text-green-700"
                      : currentSubmission.status === "rejected"
                      ? "text-red-700"
                      : currentSubmission.status === "pending"
                      ? "text-yellow-700"
                      : "text-blue-700"
                  }`}
                >
                  {currentSubmission.status}
                </p>
              </div>

              {currentSubmission.rating && (
                <div className="text-center p-2 bg-[#FFF5E1] rounded-lg">
                  <Award className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-yellow-700">
                    {currentSubmission.rating.toFixed(1)}/5
                  </p>
                </div>
              )}
            </div>

            {/* Artwork description - compact */}
            <div className="mb-3">
              <h4 className="font-bold text-[#7f5539] text-md mb-2">
                Description
              </h4>
              <p className="text-[#7f5539] text-sm leading-relaxed">
                {currentSubmission.artworkDescription ||
                  currentSubmission.description}
              </p>
            </div>

            {/* Judge comments if available - compact */}
            {currentSubmission.judgeComments && (
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-blue-800 text-sm">
                    Judge Feedback
                  </h4>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {currentSubmission.judgeComments}
                </p>
              </div>
            )}

            {/* Timestamps - compact */}
            <div className="border-t border-[#FFD95A] pt-2 text-xs text-[#7f5539]/70">
              <span>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(
                  currentSubmission.submissionDate ||
                    currentSubmission.submittedAt
                ).toLocaleString()}
              </span>
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

  // Add null check for challenge to prevent errors
  if (!challenge) {
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
                  src={challenge?.image || "/heritage.jpeg"}
                  alt={challenge?.title || "Challenge"}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
                    {challenge?.title || "Loading..."}
                  </h1>
                  <p className="text-[#7f5539]/80 mb-4">
                    {challenge?.description || "Loading challenge details..."}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Trophy className="w-4 h-4" />
                      {challenge?.prize || "TBD"}
                    </div>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Users className="w-4 h-4" />
                      {challenge?.participants || 0} participants
                    </div>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Award className="w-4 h-4" />
                      {challenge?.submissions || 0} submissions
                    </div>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Clock className="w-4 h-4" />
                      {challenge?.timeLeft || "N/A"} left
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
