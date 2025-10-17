import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Award,
  Target,
  ImageOff,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const RecentChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
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

        const challengesData = response.data || [];

        // Fetch submissions for each challenge to count them manually
        const challengesWithSubmissions = await Promise.all(
          challengesData.map(async (challenge) => {
            try {
              const submissionsResponse = await axios.get(
                `${API_URL}/api/buyer/challenges/${challenge.id}/submissions`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const submissionsCount = submissionsResponse.data.length;
              return {
                ...challenge,
                submissionsCount,
              };
            } catch (error) {
              console.error(
                `Error fetching submissions for challenge ${challenge.id}:`,
                error
              );
              return {
                ...challenge,
                submissionsCount: 0,
              };
            }
          })
        );

        // Sort challenges by the most recent publish date and take the top 3
        const sortedChallenges = challengesWithSubmissions
          .sort(
            (a, b) => new Date(b.publishDateTime) - new Date(a.publishDateTime)
          )
          .slice(0, 3);

        const mapped = sortedChallenges.map((challenge, idx) => ({
          id: challenge.id || idx,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          startDate: challenge.publishDateTime,
          endDate: challenge.deadlineDateTime,
          participants: challenge.submissionsCount || 0, // Updated to use manually counted submissions
          submissions: challenge.submissionsCount || 0,
          timeLeft: getTimeLeft(challenge.deadlineDateTime),
          image: undefined, // No image in DB
        }));

        setChallenges(mapped);
      } catch (error) {
        console.error("Error fetching challenges:", error);
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

  const handleChallengeClick = (challengeId) => {
    // Navigate to the ChallengeSubmissionsPage with the challengeId
    navigate(`/challenge-submissions/${challengeId}`);
  };

  const handleViewAllChallenges = () => {
    navigate("/public-challenges");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[#FFD95A]/20 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-32 bg-[#FFD95A]/20 rounded"></div>
                <div className="h-4 bg-[#FFD95A]/20 rounded w-3/4"></div>
                <div className="h-3 bg-[#FFD95A]/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#7f5539] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#D87C5A]" />
          Recent Challenges
        </h2>
      </div>

      {selectedChallenge ? (
        <div>
          <button
            onClick={() => setSelectedChallenge(null)}
            className="mb-4 text-[#D87C5A] hover:underline"
          >
            Back to Challenges
          </button>
          <h3 className="text-lg font-semibold mb-4">Submissions</h3>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-[#FFD95A]/10 rounded-lg p-4 border border-[#FFD95A]/30"
              >
                <p className="text-sm font-medium">{submission.artistName}</p>
                <img
                  src={submission.image}
                  alt={submission.title}
                  className="w-full h-28 object-cover rounded-lg mt-2"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="group cursor-pointer"
              onClick={() => handleChallengeClick(challenge.id)}
            >
              <div className="bg-[#FFD95A]/10 rounded-lg p-4 border border-[#FFD95A]/30 hover:border-[#D87C5A] transition-all duration-300 hover:shadow-md">
                <div className="relative mb-3">
                  <div className="flex items-center justify-center bg-gray-200 rounded-full w-12 h-12 mx-auto">
                    <Award className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                    {challenge.participants} joined
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-[#7f5539] text-sm line-clamp-2 group-hover:text-[#D87C5A] transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-[#7f5539]/70 text-xs line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#7f5539]/70">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#D87C5A]" />
                      <span>{challenge.prize || "Prize TBD"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D87C5A]" />
                      <span>{challenge.timeLeft}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-[#D87C5A]/20 text-[#7f5539] px-2 py-1 rounded-full">
                      {challenge.category || "Category TBD"}
                    </span>
                    <div className="flex items-center gap-1 text-[#7f5539]/70">
                      <Users className="w-3 h-3" />
                      <span>{challenge.participants} participants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!selectedChallenge && (
        <div className="mt-6 pt-4 border-t border-[#FFD95A]/30">
          <button
            onClick={handleViewAllChallenges}
            className="w-full bg-[#D87C5A] hover:bg-[#7f5539] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            Explore All Challenges
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentChallenges;
