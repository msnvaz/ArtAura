import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  Image,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Trophy,
  Users,
  Clock,
  Info,
  X,
} from "lucide-react";
import Navbar from "../components/common/Navbar";

const ChallengeSubmissionPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artistStatement: "",
    imageFiles: [],
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Mock challenge data - in real app, this would come from API
  const mockChallenge = {
    id: 1,
    title: "Digital Art Showcase 2025",
    description:
      "Create stunning digital artwork using any medium and showcase your creativity",
    category: "Digital Art",
    endDate: "2025-07-31",
    prize: "$1,500",
    participants: 234,
    submissions: 156,
    difficulty: "Intermediate",
    rules: [
      "Original artwork only",
      "Maximum 3 submissions per artist",
      "Digital format required (JPEG, PNG, or SVG)",
      "Minimum resolution: 1920x1080px",
      "Maximum file size: 10MB per image",
      "Artist statement must be between 100-500 words",
    ],
    submissionDeadline: "2025-07-31T23:59:59",
    maxSubmissions: 3,
    allowedFormats: ["JPEG", "PNG", "SVG"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChallenge(mockChallenge);
      setLoading(false);
    }, 1000);
  }, [challengeId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileSelect = (files) => {
    const selectedFiles = Array.from(files);
    const validFiles = [];
    const newErrors = {};

    selectedFiles.forEach((file, index) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        newErrors[`file_${index}`] = "Only image files are allowed";
        return;
      }

      // Check file size
      if (file.size > challenge.maxFileSize) {
        newErrors[`file_${index}`] = `File size must be less than ${
          challenge.maxFileSize / (1024 * 1024)
        }MB`;
        return;
      }

      // Check if total files don't exceed limit
      if (
        formData.imageFiles.length + validFiles.length >=
        challenge.maxSubmissions
      ) {
        newErrors.files = `Maximum ${challenge.maxSubmissions} files allowed`;
        return;
      }

      validFiles.push(file);
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...validFiles],
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.artistStatement.trim()) {
      newErrors.artistStatement = "Artist statement is required";
    } else if (formData.artistStatement.length < 100) {
      newErrors.artistStatement =
        "Artist statement must be at least 100 characters";
    } else if (formData.artistStatement.length > 500) {
      newErrors.artistStatement =
        "Artist statement must be less than 500 characters";
    }

    if (formData.imageFiles.length === 0) {
      newErrors.files = "At least one image is required";
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, you would upload files and submit to API
      console.log("Submitting:", formData);

      setSubmitted(true);
    } catch (error) {
      setErrors({ submit: "Failed to submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeLeft = () => {
    const now = new Date();
    const deadline = new Date(challenge.submissionDeadline);
    const timeLeft = deadline - now;

    if (timeLeft <= 0) return "Deadline passed";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return `${days} days, ${hours} hours left`;
  };

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFF5E1]">
        <Navbar />
        <div className="pt-20 pb-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#7f5539] mb-2">
                Submission Successful!
              </h2>
              <p className="text-[#7f5539]/80 mb-6">
                Your artwork has been submitted to "{challenge.title}"
                successfully. You'll receive an email confirmation shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/public-challenges")}
                  className="bg-[#D87C5A] hover:bg-[#7f5539] text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  View All Challenges
                </button>
                <button
                  onClick={() => navigate("/artist/artistdashboard")}
                  className="border-2 border-[#FFD95A] text-[#7f5539] py-2 px-6 rounded-lg font-medium hover:bg-[#FFD95A] transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />

      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/public-challenges")}
              className="flex items-center gap-2 text-[#7f5539] hover:text-[#D87C5A] mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Challenges
            </button>
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Submit to Challenge
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenge Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 sticky top-24">
                <h3 className="font-bold text-[#7f5539] text-lg mb-4">
                  {challenge.title}
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#D87C5A]" />
                    <span className="text-sm text-[#7f5539]">
                      Prize: {challenge.prize}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D87C5A]" />
                    <span className="text-sm text-[#7f5539]">
                      {getTimeLeft()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#D87C5A]" />
                    <span className="text-sm text-[#7f5539]">
                      {challenge.participants} participants
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-[#7f5539] mb-2">
                    Rules & Requirements
                  </h4>
                  <ul className="space-y-1">
                    {challenge.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="text-sm text-[#7f5539]/80 flex items-start gap-2"
                      >
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <div className="text-sm text-[#7f5539]/70">
                    Deadline:{" "}
                    {new Date(
                      challenge.submissionDeadline
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
                <h2 className="text-2xl font-bold text-[#7f5539] mb-6">
                  Submit Your Artwork
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Artwork Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                      placeholder="Enter your artwork title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                      placeholder="Describe your artwork..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Artist Statement */}
                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Artist Statement * (100-500 characters)
                    </label>
                    <textarea
                      name="artistStatement"
                      value={formData.artistStatement}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                      placeholder="Explain your creative process, inspiration, and the story behind your artwork..."
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-[#7f5539]/70">
                        {formData.artistStatement.length}/500 characters
                      </span>
                      {errors.artistStatement && (
                        <p className="text-red-500">{errors.artistStatement}</p>
                      )}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                      Upload Images * (Max {challenge.maxSubmissions} files,
                      10MB each)
                    </label>

                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "border-[#D87C5A] bg-[#FFD95A]/10"
                          : "border-[#FFD95A] hover:border-[#D87C5A]"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 text-[#D87C5A] mx-auto mb-4" />
                      <p className="text-[#7f5539] mb-2">
                        Drag and drop your images here, or{" "}
                        <label className="text-[#D87C5A] cursor-pointer hover:underline">
                          browse files
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-sm text-[#7f5539]/70">
                        Supports: JPEG, PNG, SVG • Max 10MB per file
                      </p>
                    </div>

                    {errors.files && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.files}
                      </p>
                    )}

                    {/* Selected Files */}
                    {formData.imageFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.imageFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-[#FFD95A]/10 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Image className="w-4 h-4 text-[#D87C5A]" />
                              <span className="text-sm text-[#7f5539]">
                                {file.name}
                              </span>
                              <span className="text-xs text-[#7f5539]/70">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreedToTerms"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <label
                      htmlFor="agreedToTerms"
                      className="text-sm text-[#7f5539]"
                    >
                      I agree to the challenge terms and conditions, and confirm
                      that this is my original work *
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-sm">{errors.terms}</p>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#D87C5A] hover:bg-[#7f5539] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Artwork"
                      )}
                    </button>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">{errors.submit}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSubmissionPage;