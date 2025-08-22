import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  Calendar,
  Trophy,
  FileText,
  Send,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

const ArtistSubmissionPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  const [challenge, setChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artwork: null,
    additionalNotes: "",
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchChallengeDetails();
  }, [challengeId]);

  const fetchChallengeDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/challenges/${challengeId}`
      );
      if (response.ok) {
        const data = await response.json();
        setChallenge(data);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        artwork: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      if (errors.artwork) {
        setErrors((prev) => ({
          ...prev,
          artwork: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.artwork) newErrors.artwork = "Artwork image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append("challengeId", challengeId);
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("artwork", formData.artwork);
      submissionData.append("additionalNotes", formData.additionalNotes);

      const response = await fetch("http://localhost:8080/api/submissions", {
        method: "POST",
        body: submissionData,
      });

      if (response.ok) {
        navigate("/challenges", {
          state: {
            message:
              "Submission successful! Your artwork has been submitted to the challenge.",
          },
        });
      } else {
        throw new Error("Failed to submit artwork");
      }
    } catch (error) {
      console.error("Error submitting artwork:", error);
      alert("Failed to submit artwork. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading challenge details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/challenges")}
            className="flex items-center gap-2 px-4 py-2 text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Challenges
          </button>
        </div>

        {/* Challenge Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Trophy className="text-amber-600" size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-amber-900 mb-2">
                {challenge.title}
              </h1>
              <p className="text-amber-700 mb-4">{challenge.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-amber-600" />
                  <span className="text-amber-700">
                    Deadline:{" "}
                    {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-600" />
                  <span className="text-amber-700">
                    Category: {challenge.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-amber-600" />
                  <span className="text-amber-700">
                    Rewards: {challenge.rewards}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Upload size={20} />
            Submit Your Artwork
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Artwork Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Enter your artwork title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                placeholder="Describe your artwork, inspiration, techniques used..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Artwork Image *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.artwork ? "border-red-300" : "border-gray-300"
                  }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="artwork-upload"
                />
                <label htmlFor="artwork-upload" className="cursor-pointer">
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-amber-600">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon size={48} className="text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Upload your artwork
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              {errors.artwork && (
                <p className="text-red-500 text-sm mt-1">{errors.artwork}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Any additional information about your submission..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/challenges")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Artwork
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistSubmissionPage;
