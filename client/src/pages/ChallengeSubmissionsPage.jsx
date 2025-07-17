import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Filter,
  Search,
  Grid,
  List,
  Clock,
  Trophy,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
  Flag,
  Award,
  Zap,
  Palette,
  Camera,
  ArrowUp,
  ArrowDown,
  User,
  Calendar,
  Tag,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MoreHorizontal,
} from "lucide-react";
import Navbar from "../components/common/Navbar";

const ChallengeSubmissionsPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock challenge data
  const mockChallenge = {
    id: 1,
    title: "Digital Art Showcase 2025",
    description:
      "Create stunning digital artwork using any medium and showcase your creativity",
    category: "Digital Art",
    endDate: "2025-07-31",
    prize: "$1,500",
    totalSubmissions: 156,
    totalVotes: 1247,
    status: "active",
    deadline: "2025-07-31T23:59:59",
    votingDeadline: "2025-08-05T23:59:59",
    allowsVoting: true,
    votingType: "public", // public, jury, mixed
  };

  // Mock submissions data
  const mockSubmissions = [
    {
      id: 1,
      title: "Neon Dreams",
      description:
        "A vibrant digital landscape exploring the intersection of technology and nature. This piece represents the harmony between organic forms and digital aesthetics.",
      artist: {
        name: "Sarah Johnson",
        username: "@sarahj_art",
        avatar:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: true,
      },
      images: [
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      submissionDate: "2025-07-15T14:30:00Z",
      votes: 124,
      comments: 18,
      views: 342,
      tags: ["digital", "landscape", "neon", "fantasy"],
      medium: "Digital Painting",
      software: "Procreate, Photoshop",
      timeSpent: "15 hours",
      featured: true,
      artistStatement:
        "This artwork explores the relationship between technology and nature, imagining a future where digital and organic worlds coexist harmoniously.",
    },
    {
      id: 2,
      title: "Abstract Emotions",
      description:
        "An emotional journey through color and form, representing the complexity of human feelings in abstract visual language.",
      artist: {
        name: "Michael Chen",
        username: "@mchen_digital",
        avatar:
          "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: false,
      },
      images: [
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      submissionDate: "2025-07-18T09:15:00Z",
      votes: 87,
      comments: 12,
      views: 289,
      tags: ["abstract", "emotions", "colorful", "expressive"],
      medium: "Digital Art",
      software: "Adobe Illustrator",
      timeSpent: "8 hours",
      featured: false,
      artistStatement:
        "Through abstract forms and vibrant colors, I aim to capture the intangible essence of human emotions.",
    },
    {
      id: 3,
      title: "Cyberpunk City",
      description:
        "A futuristic cityscape showcasing the aesthetic of cyberpunk culture with neon lights and urban decay.",
      artist: {
        name: "Alex Rivera",
        username: "@alexr_designs",
        avatar:
          "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: true,
      },
      images: [
        "https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      submissionDate: "2025-07-20T16:45:00Z",
      votes: 203,
      comments: 31,
      views: 567,
      tags: ["cyberpunk", "city", "futuristic", "neon"],
      medium: "3D Digital Art",
      software: "Blender, Photoshop",
      timeSpent: "25 hours",
      featured: true,
      artistStatement:
        "Inspired by cyberpunk aesthetics, this piece imagines a dystopian future where technology dominates urban landscapes.",
    },
    {
      id: 4,
      title: "Minimalist Zen",
      description:
        "A serene minimalist composition focusing on balance, simplicity, and peaceful aesthetics.",
      artist: {
        name: "Emma Wilson",
        username: "@emma_zen",
        avatar:
          "https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: false,
      },
      images: [
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      submissionDate: "2025-07-22T11:20:00Z",
      votes: 156,
      comments: 24,
      views: 423,
      tags: ["minimalist", "zen", "peaceful", "balance"],
      medium: "Digital Illustration",
      software: "Adobe Illustrator",
      timeSpent: "6 hours",
      featured: false,
      artistStatement:
        "Less is more. This piece explores the power of simplicity and negative space in creating emotional impact.",
    },
    {
      id: 5,
      title: "Fantasy Forest",
      description:
        "A magical forest scene with mystical creatures and enchanted lighting effects.",
      artist: {
        name: "David Kim",
        username: "@davidk_fantasy",
        avatar:
          "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: true,
      },
      images: [
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      submissionDate: "2025-07-25T08:30:00Z",
      votes: 178,
      comments: 22,
      views: 456,
      tags: ["fantasy", "forest", "magic", "creatures"],
      medium: "Digital Painting",
      software: "Procreate, Photoshop",
      timeSpent: "20 hours",
      featured: false,
      artistStatement:
        "Drawing inspiration from folklore and mythology, this piece transports viewers to a magical realm.",
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
    const hasVoted = userVotes[submissionId];

    setUserVotes((prev) => ({
      ...prev,
      [submissionId]: !hasVoted,
    }));

    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              votes: hasVoted ? submission.votes - 1 : submission.votes + 1,
            }
          : submission
      )
    );
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (
      selectedSubmission &&
      currentImageIndex < selectedSubmission.images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const submissionDate = new Date(dateString);
    const diffInHours = Math.floor((now - submissionDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getSortedAndFilteredSubmissions = () => {
    let filtered = submissions.filter((submission) => {
      const matchesSearch =
        submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.artist.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "featured" && submission.featured) ||
        (filterBy === "recent" &&
          new Date(submission.submissionDate) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        case "oldest":
          return new Date(a.submissionDate) - new Date(b.submissionDate);
        case "mostVotes":
          return b.votes - a.votes;
        case "mostViews":
          return b.views - a.views;
        case "mostComments":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });
  };

  const filteredSubmissions = getSortedAndFilteredSubmissions();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E1]">
        <Navbar />
        <div className="pt-20 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => navigate("/public-challenges")}
                className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Challenges
              </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
                  {challenge.title} - Submissions
                </h1>
                <p className="text-[#7f5539]/70 mb-4">
                  {challenge.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-[#7f5539]/80">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {challenge.totalSubmissions} submissions
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {challenge.totalVotes} votes
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Prize: {challenge.prize}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Voting ends:{" "}
                    {new Date(challenge.votingDeadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFD95A] text-[#7f5539] rounded-lg hover:bg-[#D87C5A] hover:text-white transition-colors"
                >
                  {viewMode === "grid" ? (
                    <List className="w-4 h-4" />
                  ) : (
                    <Grid className="w-4 h-4" />
                  )}
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search submissions, artists, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                >
                  <option value="all">All Submissions</option>
                  <option value="featured">Featured</option>
                  <option value="recent">Recent (7 days)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostVotes">Most Voted</option>
                  <option value="mostViews">Most Viewed</option>
                  <option value="mostComments">Most Comments</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-[#7f5539]/70">
              Showing {filteredSubmissions.length} of {submissions.length}{" "}
              submissions
            </p>
          </div>

          {/* Submissions Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-64 flex-shrink-0" : ""
                  }`}
                >
                  <img
                    src={submission.images[0]}
                    alt={submission.title}
                    className={`w-full object-cover cursor-pointer ${
                      viewMode === "list" ? "h-48" : "h-56"
                    }`}
                    onClick={() => openModal(submission)}
                  />
                  {submission.featured && (
                    <div className="absolute top-3 left-3 bg-[#FFD95A] text-[#7f5539] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  {submission.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                      +{submission.images.length - 1}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                    {submission.views} views
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={submission.artist.avatar}
                        alt={submission.artist.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-semibold text-[#7f5539]">
                            {submission.artist.name}
                          </h4>
                          {submission.artist.verified && (
                            <div className="w-4 h-4 bg-[#D87C5A] rounded-full flex items-center justify-center">
                              <svg
                                className="w-2 h-2 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-[#7f5539]/70">
                          {submission.artist.username}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-[#7f5539]/60">
                      {getTimeAgo(submission.submissionDate)}
                    </div>
                  </div>

                  <h3 className="font-bold text-[#7f5539] text-lg mb-2">
                    {submission.title}
                  </h3>
                  <p className="text-[#7f5539]/80 text-sm mb-4 line-clamp-3">
                    {submission.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {submission.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FFD95A]/30 text-[#7f5539] px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {submission.tags.length > 3 && (
                      <span className="text-[#7f5539]/60 text-xs">
                        +{submission.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleVote(submission.id)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                          userVotes[submission.id]
                            ? "bg-[#D87C5A] text-white"
                            : "bg-[#FFD95A]/20 text-[#7f5539] hover:bg-[#FFD95A]"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            userVotes[submission.id] ? "fill-current" : ""
                          }`}
                        />
                        {submission.votes}
                      </button>
                      <div className="flex items-center gap-1 text-[#7f5539]/70">
                        <MessageCircle className="w-4 h-4" />
                        {submission.comments}
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(submission)}
                      className="text-[#D87C5A] hover:text-[#7f5539] font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-[#FFD95A] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                No submissions found
              </h3>
              <p className="text-[#7f5539]/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSubmission.artist.avatar}
                    alt={selectedSubmission.artist.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-xl font-bold text-[#7f5539]">
                        {selectedSubmission.title}
                      </h3>
                      {selectedSubmission.featured && (
                        <Star className="w-5 h-5 text-[#FFD95A]" />
                      )}
                    </div>
                    <p className="text-[#7f5539]/70">
                      by {selectedSubmission.artist.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-[#FFD95A]/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[#7f5539]" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedSubmission.images[currentImageIndex]}
                      alt={selectedSubmission.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {selectedSubmission.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          disabled={currentImageIndex === 0}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          disabled={
                            currentImageIndex ===
                            selectedSubmission.images.length - 1
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} /{" "}
                          {selectedSubmission.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedSubmission.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedSubmission.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex
                              ? "border-[#D87C5A]"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedSubmission.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#7f5539] mb-2">
                      Description
                    </h4>
                    <p className="text-[#7f5539]/80">
                      {selectedSubmission.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#7f5539] mb-2">
                      Artist Statement
                    </h4>
                    <p className="text-[#7f5539]/80">
                      {selectedSubmission.artistStatement}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-[#7f5539] mb-1">
                        Medium
                      </h4>
                      <p className="text-[#7f5539]/80">
                        {selectedSubmission.medium}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#7f5539] mb-1">
                        Software
                      </h4>
                      <p className="text-[#7f5539]/80">
                        {selectedSubmission.software}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#7f5539] mb-1">
                      Time Spent
                    </h4>
                    <p className="text-[#7f5539]/80">
                      {selectedSubmission.timeSpent}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#7f5539] mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#FFD95A]/30 text-[#7f5539] px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#FFD95A]/30">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleVote(selectedSubmission.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          userVotes[selectedSubmission.id]
                            ? "bg-[#D87C5A] text-white"
                            : "bg-[#FFD95A]/20 text-[#7f5539] hover:bg-[#FFD95A]"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            userVotes[selectedSubmission.id]
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        {selectedSubmission.votes}
                      </button>
                      <div className="flex items-center gap-2 text-[#7f5539]/70">
                        <MessageCircle className="w-5 h-5" />
                        {selectedSubmission.comments} comments
                      </div>
                      <div className="flex items-center gap-2 text-[#7f5539]/70">
                        <Eye className="w-5 h-5" />
                        {selectedSubmission.views} views
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#FFD95A]/20 rounded-full transition-colors">
                        <Share2 className="w-5 h-5 text-[#7f5539]" />
                      </button>
                      <button className="p-2 hover:bg-[#FFD95A]/20 rounded-full transition-colors">
                        <Download className="w-5 h-5 text-[#7f5539]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeSubmissionsPage;
