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
} from "lucide-react";

const RecentChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for recent challenges
  const mockRecentChallenges = [
    {
      id: 1,
      title: "Digital Art Showcase 2025 (Sri Lanka)",
      description:
        "Create stunning digital artwork inspired by Sri Lankan culture or landscapes.",
      category: "Digital Art",
      prize: "LKR 450,000",
      participants: 234,
      timeLeft: "13 days",
      difficulty: "Intermediate",
      status: "active",
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400",
      featured: true,
    },
    {
      id: 2,
      title: "Abstract Expression Colombo",
      description:
        "Express emotions through abstract art forms with a Sri Lankan twist.",
      category: "Abstract Art",
      prize: "LKR 300,000",
      participants: 189,
      timeLeft: "28 days",
      difficulty: "Advanced",
      status: "active",
      image:
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=400",
      featured: false,
    },
    {
      id: 3,
      title: "Photography Masters Sri Lanka",
      description:
        "Capture everyday moments in Sri Lanka with a unique perspective.",
      category: "Photography",
      prize: "LKR 240,000",
      participants: 312,
      timeLeft: "23 days",
      difficulty: "Beginner",
      status: "active",
      image:
        "https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=400",
      featured: false,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChallenges(mockRecentChallenges);
      setLoading(false);
    }, 1000);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleChallengeClick = (challengeId) => {
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

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="group cursor-pointer"
            onClick={() => handleChallengeClick(challenge.id)}
          >
            <div className="bg-[#FFD95A]/10 rounded-lg p-4 border border-[#FFD95A]/30 hover:border-[#D87C5A] transition-all duration-300 hover:shadow-md">
              {/* Challenge Image */}
              <div className="relative mb-3">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-28 object-cover rounded-lg"
                />
                {challenge.featured && (
                  <div className="absolute top-2 left-2 bg-[#FFD95A] text-[#7f5539] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                  {challenge.participants} joined
                </div>
              </div>

              {/* Challenge Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-[#7f5539] text-sm line-clamp-2 group-hover:text-[#D87C5A] transition-colors">
                    {challenge.title}
                  </h3>
                </div>

                <p className="text-[#7f5539]/70 text-xs line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[#7f5539]/70">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-[#D87C5A]" />
                    <span>{challenge.prize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D87C5A]" />
                    <span>{challenge.timeLeft}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-[#D87C5A]/20 text-[#7f5539] px-2 py-1 rounded-full">
                    {challenge.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#7f5539]/70">
                    <Users className="w-3 h-3" />
                    <span>{challenge.participants}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-[#FFD95A]/30">
        <div className="space-y-2">
          <button
            onClick={handleViewAllChallenges}
            className="w-full bg-[#D87C5A] hover:bg-[#7f5539] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            Explore All Challenges
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentChallenges;
