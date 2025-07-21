import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Send,
  Shield,
  Trophy,
  Sparkles,
  Users,
  Target,
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
  const [showSponsorshipSection, setShowSponsorshipSection] = useState(false);
  const [sponsorshipType, setSponsorshipType] = useState("");
  const [sponsorshipMessage, setSponsorshipMessage] = useState("");
  const [isSponsorshipSubmitting, setIsSponsorshipSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Digital Art",
    "Traditional Art",
    "Photography",
    "Sculpture",
    "Mixed Media",
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
        sponsorshipRequest: requestSponsorship
          ? {
              type: sponsorshipType,
              message: sponsorshipMessage,
            }
          : null,
      };

      if (onSubmit) await onSubmit(challengeData);

      // Show success message
      alert("Challenge created successfully!");

      // Reset form
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

      // Navigate back to dashboard
      navigate("/moderatordashboard");
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Error creating challenge. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSponsorshipRequest = async () => {
    setIsSponsorshipSubmitting(true);
    try {
      // You can adjust this payload as needed
      const sponsorshipData = {
        challenge: formData, // send the current challenge form data
        type: sponsorshipType,
        message: sponsorshipMessage,
      };
      // TODO: Replace with your backend call
      alert("Sponsorship request sent to shops!");
      setShowSponsorshipSection(false);
      setSponsorshipType("");
      setSponsorshipMessage("");
    } catch (error) {
      alert("Failed to send sponsorship request.");
    } finally {
      setIsSponsorshipSubmitting(false);
    }
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
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-h-screen" style={{ backgroundColor: "#FFF5E1" }}>
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
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap"
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FFE4D6",
                    backgroundColor: "rgba(255, 228, 214, 0.1)",
                  }}
                  onClick={() => navigate("/challenges")}
                >
                  <Trophy size={14} />
                  <span className="hidden sm:inline">View Challenges</span>
                  <span className="sm:hidden">Challenges</span>
                </button>
                <button
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap"
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
            className="rounded-lg shadow-sm border h-full relative overflow-hidden"
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
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.category ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: errors.category ? "#DC2626" : "#FFE4D6",
                          backgroundColor: "white",
                          color: "#5D3A00",
                        }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
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

                {/* Sponsorship Request (inside form) */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={requestSponsorship}
                      onChange={(e) => setRequestSponsorship(e.target.checked)}
                      className="accent-amber-800 h-4 w-4"
                    />
                    Request Sponsorships for this Challenge?
                  </label>
                  {requestSponsorship && (
                    <div className="space-y-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-1">
                          Expected Sponsorship Type
                        </label>
                        <select
                          value={sponsorshipType}
                          onChange={(e) => setSponsorshipType(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg bg-white text-amber-900 border-amber-300 focus:ring-2 focus:ring-amber-800"
                        >
                          <option value="">Select type...</option>
                          <option value="Monetary">Monetary</option>
                          <option value="Gift">Gift</option>
                          <option value="Voucher">Voucher</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-1">
                          Message to Shops (optional)
                        </label>
                        <textarea
                          value={sponsorshipMessage}
                          onChange={(e) =>
                            setSponsorshipMessage(e.target.value)
                          }
                          rows={3}
                          placeholder="Describe what kind of sponsorship you expect, or any special notes..."
                          className="w-full px-4 py-2 border rounded-lg bg-white text-amber-900 border-amber-300 focus:ring-2 focus:ring-amber-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div
                  className="flex justify-end pt-6 border-t"
                  style={{ borderColor: "#FFE4D6" }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium ${
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
