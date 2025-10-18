import axios from "axios";
import {
  Calendar,
  Clock,
  FileText,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateChallenge = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    publishDate: "",
    publishTime: "",
    deadlineDate: "",
    deadlineTime: "",
    description: "",
    category: "",
    maxParticipants: "",
    rewards: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSponsorship, setRequestSponsorship] = useState(false);
  
  // Scoring criteria state
  const [criteria, setCriteria] = useState({
    likesWeight: 34,
    commentsWeight: 33,
    shareWeight: 33
  });
  
  const navigate = useNavigate();

  const categories = [
    "Traditional Art",
    "Abstract Art",
    "Portrait",
    "Landscape",
    "Street Art",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.publishDate)
      newErrors.publishDate = "Publish date is required";
    if (!formData.publishTime)
      newErrors.publishTime = "Publish time is required";
    if (!formData.deadlineDate)
      newErrors.deadlineDate = "Deadline date is required";
    if (!formData.deadlineTime)
      newErrors.deadlineTime = "Deadline time is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.maxParticipants)
      newErrors.maxParticipants = "Max participants is required";
    if (!formData.rewards.trim())
      newErrors.rewards = "Rewards information is required";

    // Validate scoring criteria
    const totalWeight = getTotalWeight();
    if (totalWeight !== 100) {
      newErrors.criteria = "Scoring criteria weights must total exactly 100%";
    }

    if (
      formData.publishDate &&
      formData.publishTime &&
      formData.deadlineDate &&
      formData.deadlineTime
    ) {
      const publishDateTime = new Date(
        `${formData.publishDate}T${formData.publishTime}`
      );
      const deadlineDateTime = new Date(
        `${formData.deadlineDate}T${formData.deadlineTime}`
      );
      if (deadlineDateTime <= publishDateTime) {
        newErrors.deadlineDate = "Deadline must be after publish date";
        newErrors.deadlineTime = "Deadline must be after publish time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const challengeData = {
        title: formData.title.trim(),
        category: formData.category,
        publishDateTime: `${formData.publishDate}T${formData.publishTime}`,
        deadlineDateTime: `${formData.deadlineDate}T${formData.deadlineTime}`,
        description: formData.description.trim(),
        maxParticipants: parseInt(formData.maxParticipants),
        rewards: formData.rewards.trim(),
        requestSponsorship: requestSponsorship,
        // Include scoring criteria
        scoringCriteria: {
          likesWeight: criteria.likesWeight,
          commentsWeight: criteria.commentsWeight,
          shareWeight: criteria.shareWeight
        }
      };

      // Get JWT token from localStorage (adjust key if needed)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated. Please log in.");
        setIsSubmitting(false);
        return;
      }

      // Send POST request to backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenges`,
        challengeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Challenge created successfully!");
      setFormData({
        title: "",
        publishDate: "",
        publishTime: "",
        deadlineDate: "",
        deadlineTime: "",
        description: "",
        category: "",
        maxParticipants: "",
        rewards: "",
      });
      setRequestSponsorship(false);
      navigate("/moderatordashboard");
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert(
        error.response?.data?.message ||
          "Error creating challenge. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scoring criteria helper functions
  const handleWeightChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setCriteria(prev => {
      // Calculate the sum if this field is set to numValue
      const newCriteria = { ...prev, [field]: numValue };
      const total =
        newCriteria.likesWeight +
        newCriteria.commentsWeight +
        newCriteria.shareWeight;
      // If total is over 100, adjust the changed field to not exceed 100
      if (total > 100) {
        const over = total - 100;
        newCriteria[field] = Math.max(0, numValue - over);
      }
      return newCriteria;
    });
  };

  const getTotalWeight = () => {
    return criteria.likesWeight + criteria.commentsWeight + criteria.shareWeight;
  };


  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const { date: currentDate } = getCurrentDateTime();

  return (
    <>
      {/* CSS styles for button animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-container {
          animation: smoothFadeIn 0.4s ease-out;
          opacity: 1;
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .form-animate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Ensure smooth rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7f5539;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7f5539;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>

      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-h-screen page-container" style={{ backgroundColor: "#FFF5E1" }}>
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
                  <Plus size={32} style={{ color: "#5D3A00" }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Create New Challenge
                  </h1>
                  <p className="text-gray-200">
                    Set up a new art challenge for the community
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onClick={() => navigate("/moderatordashboard")}
                >
                  <Shield size={14} />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Form Container */}
          <div
            className="rounded-lg shadow-sm border h-full relative overflow-hidden form-animate"
            style={{ backgroundColor: "#FFF5E1" }}
          >
            {/* Form Header */}
            <div className="p-6 border-b" style={{ borderColor: "#FFE4D6" }}>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#FFD95A" }}
                >
                  <Sparkles size={24} style={{ color: "#5D3A00" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "#5D3A00" }}
                  >
                    Challenge Details
                  </h2>
                  <p className="text-sm" style={{ color: "#D87C5A" }}>
                    Fill in the information below to create a new art challenge
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div
                    className="flex items-center gap-2 pb-2 border-b"
                    style={{ borderColor: "#FFE4D6" }}
                  >
                    <FileText size={20} style={{ color: "#D87C5A" }} />
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#5D3A00" }}
                    >
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{ color: "#5D3A00" }}
                      >
                        <Trophy size={16} />
                        Challenge Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter an engaging challenge title..."
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.title ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.title ? "#DC2626" : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{ color: "#5D3A00" }}
                      >
                        <Target size={16} />
                        Category *
                      </label>
                      <input
                        list="category-options"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Select or type a category"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.category ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.category ? "#DC2626" : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                        autoComplete="off"
                      />
                      <datalist id="category-options">
                        {categories.map((category) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-sm font-medium mb-2"
                      style={{ color: "#5D3A00" }}
                    >
                      <Users size={16} />
                      Maximum Participants *
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      placeholder="Enter maximum number of participants (e.g., 100)"
                      min="1"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.maxParticipants ? "border-red-500" : ""
                      }`}
                      style={{
                        borderColor: errors.maxParticipants
                          ? "#DC2626"
                          : "#FFE4D6",
                        backgroundColor: "white",
                        color: "#5D3A00",
                      }}
                    />
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxParticipants}
                      </p>
                    )}
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="space-y-6">
                  <div
                    className="flex items-center gap-2 pb-2 border-b"
                    style={{ borderColor: "#FFE4D6" }}
                  >
                    <Calendar size={20} style={{ color: "#D87C5A" }} />
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#5D3A00" }}
                    >
                      Schedule
                    </h3>
                  </div>

                  {/* Publish Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{ color: "#5D3A00" }}
                      >
                        <Calendar size={16} />
                        Publish Date *
                      </label>
                      <input
                        type="date"
                        name="publishDate"
                        value={formData.publishDate}
                        onChange={handleInputChange}
                        min={getCurrentDateTime().date}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.publishDate ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.publishDate
                            ? "#DC2626"
                            : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                      />
                      {errors.publishDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.publishDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{ color: "#5D3A00" }}
                      >
                        <Clock size={16} />
                        Publish Time *
                      </label>
                      <input
                        type="time"
                        name="publishTime"
                        value={formData.publishTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.publishTime ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.publishTime
                            ? "#DC2626"
                            : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                      />
                      {errors.publishTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.publishTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Deadline Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{ color: "#5D3A00" }}
                      >
                        <Calendar size={16} />
                        Deadline Date *
                      </label>
                      <input
                        type="date"
                        name="deadlineDate"
                        value={formData.deadlineDate}
                        onChange={handleInputChange}
                        min={formData.publishDate || getCurrentDateTime().date}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.deadlineDate ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.deadlineDate
                            ? "#DC2626"
                            : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                      />
                      {errors.deadlineDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.deadlineDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{ color: "#5D3A00" }}
                      >
                        <Clock size={16} />
                        Deadline Time *
                      </label>
                      <input
                        type="time"
                        name="deadlineTime"
                        value={formData.deadlineTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.deadlineTime ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.deadlineTime
                            ? "#DC2626"
                            : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                      />
                      {errors.deadlineTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.deadlineTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                  <div
                    className="flex items-center gap-2 pb-2 border-b"
                    style={{ borderColor: "#FFE4D6" }}
                  >
                    <FileText size={20} style={{ color: "#D87C5A" }} />
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#5D3A00" }}
                    >
                      Content & Details
                    </h3>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-sm font-medium mb-2"
                      style={{ color: "#5D3A00" }}
                    >
                      <FileText size={16} />
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide a detailed description of the challenge, including rules, requirements, and judging criteria..."
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-vertical ${
                        errors.description ? "border-red-500" : ""
                      }`}
                      style={{
                        borderColor: errors.description ? "#DC2626" : "#FFE4D6",
                        backgroundColor: "white",
                        color: "#5D3A00",
                      }}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                    <p className="mt-1 text-sm" style={{ color: "#D87C5A" }}>
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {/* Rewards */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-sm font-medium mb-2"
                      style={{ color: "#5D3A00" }}
                    >
                      <Trophy size={16} />
                      Rewards & Prizes *
                    </label>
                    <textarea
                      name="rewards"
                      value={formData.rewards}
                      onChange={handleInputChange}
                      placeholder="Describe the rewards and prizes for winners (e.g., 1st place: $500, 2nd place: $300, 3rd place: $200, Recognition certificates for top 10)..."
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-vertical ${
                        errors.rewards ? "border-red-500" : ""
                      }`}
                      style={{
                        borderColor: errors.rewards ? "#DC2626" : "#FFE4D6",
                        backgroundColor: "white",
                        color: "#5D3A00",
                      }}
                    />
                    {errors.rewards && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.rewards}
                      </p>
                    )}
                    <p className="mt-1 text-sm" style={{ color: "#D87C5A" }}>
                      {formData.rewards.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Scoring Criteria Section */}
                <div className="space-y-6">
                  <div
                    className="flex items-center gap-2 pb-2 border-b"
                    style={{ borderColor: "#FFE4D6" }}
                  >
                    <Settings size={20} style={{ color: "#D87C5A" }} />
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#5D3A00" }}
                    >
                      Scoring Criteria
                    </h3>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm" style={{ color: "#7f5539" }}>
                      <span className="font-semibold">Important:</span> Define how winners will be selected. The total percentage must equal 100%.
                    </p>
                  </div>

                  {/* Scoring Criteria Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Likes & Engagement Weight */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2" style={{ color: "#362625" }}>
                        <Heart size={18} style={{ color: "#ef4444" }} />
                        <h4 className="text-base font-semibold">Likes & Engagement Weight</h4>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={criteria.likesWeight}
                          onChange={(e) => handleWeightChange('likesWeight', e.target.value)}
                          className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #7f5539 0%, #7f5539 ${criteria.likesWeight}%, #f4e8dc ${criteria.likesWeight}%, #f4e8dc 100%)`
                          }}
                        />
                        <div className="flex justify-end mt-2">
                          <span className="text-xl font-bold" style={{ color: "#362625" }}>{criteria.likesWeight}%</span>
                        </div>
                      </div>
                      
                      <p className="text-xs" style={{ color: "#7f5539" }}>Based on the number of likes received</p>
                    </div>

                    {/* Comments & Interaction Weight */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2" style={{ color: "#362625" }}>
                        <MessageCircle size={18} style={{ color: "#3b82f6" }} />
                        <h4 className="text-base font-semibold">Comments & Interaction Weight</h4>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={criteria.commentsWeight}
                          onChange={(e) => handleWeightChange('commentsWeight', e.target.value)}
                          className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #7f5539 0%, #7f5539 ${criteria.commentsWeight}%, #f4e8dc ${criteria.commentsWeight}%, #f4e8dc 100%)`
                          }}
                        />
                        <div className="flex justify-end mt-2">
                          <span className="text-xl font-bold" style={{ color: "#362625" }}>{criteria.commentsWeight}%</span>
                        </div>
                      </div>
                      
                      <p className="text-xs" style={{ color: "#7f5539" }}>Based on the number of comments received</p>
                    </div>

                    {/* Share Weight */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2" style={{ color: "#362625" }}>
                        <Send size={18} style={{ color: "#10b981" }} />
                        <h4 className="text-base font-semibold">Share Weight</h4>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={criteria.shareWeight}
                          onChange={(e) => handleWeightChange('shareWeight', e.target.value)}
                          className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #7f5539 0%, #7f5539 ${criteria.shareWeight}%, #f4e8dc ${criteria.shareWeight}%, #f4e8dc 100%)`
                          }}
                        />
                        <div className="flex justify-end mt-2">
                          <span className="text-xl font-bold" style={{ color: "#362625" }}>{criteria.shareWeight}%</span>
                        </div>
                      </div>
                      
                      <p className="text-xs" style={{ color: "#7f5539" }}>Based on the number of shares and social engagement</p>
                    </div>
                  </div>

                  {/* Total Percentage */}
                  <div className={`rounded-lg p-4 ${getTotalWeight() === 100 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold" style={{ color: getTotalWeight() === 100 ? '#15803d' : '#b91c1c' }}>Total Percentage:</span>
                      <span className={`text-2xl font-bold ${getTotalWeight() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {getTotalWeight()}%
                      </span>
                    </div>
                    {errors.criteria && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.criteria}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sponsorship Request (inside form) */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={requestSponsorship}
                      onChange={(e) => setRequestSponsorship(e.target.checked)}
                      className="accent-amber-800 h-4 w-4"
                    />
                    Request Sponsorship for this Challenge
                  </label>
                </div>

                {/* Submit Button */}
                <div
                  className="flex justify-end pt-6 border-t"
                  style={{ borderColor: "#FFE4D6" }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium btn-animate ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "focus:ring-2 focus:ring-offset-2"
                    }`}
                    style={{
                      backgroundColor: "#D87C5A",
                      color: "white",
                    }}
                  >
                    <Send size={18} />
                    {isSubmitting
                      ? "Creating Challenge..."
                      : "Create Challenge"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateChallenge;
