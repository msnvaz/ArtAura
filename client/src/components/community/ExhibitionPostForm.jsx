import React, { useState } from "react";
import { Calendar, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const ExhibitionPostForm = ({ exhibitionPosts, setExhibitionPosts }) => {
  const { auth } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    organizer: "",
    category: "",
    entryFee: "",
    maxParticipants: "",
    contactEmail: "",
    contactPhone: "",
    requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    "Contemporary Art",
    "Digital Art",
    "Photography",
    "Sculpture",
    "Painting",
    "Mixed Media",
    "Abstract Art",
    "Portrait",
    "Landscape",
    "Street Art",
    "Installation Art",
    "Sri Lankan Heritage Art",
    "Batik Art",
    "Traditional Masks",
    "Temple Murals",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.startDate) errors.startDate = "Start date is required.";
    if (!formData.endDate) errors.endDate = "End date is required.";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      errors.endDate = "End date cannot be earlier than start date.";
    }
    if (!formData.startTime) errors.startTime = "Start time is required.";
    if (!formData.endTime) errors.endTime = "End time is required.";
    if (!formData.organizer) errors.organizer = "Organizer is required.";
    if (!formData.contactEmail)
      errors.contactEmail = "Contact email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail))
      errors.contactEmail = "Invalid email format.";
    if (!formData.contactPhone)
      errors.contactPhone = "Contact number is required.";
    else if (!/^\d{10,}$/.test(formData.contactPhone.replace(/\D/g, "")))
      errors.contactPhone = "Invalid contact number.";
    return errors;
  };

  // When submitting, always set status to 'pending'
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const postData = {
        ...formData,
        status: "pending", // Always set status to pending
      };
      const response = await fetch(`${API_URL}/api/buyer/exhibitions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post exhibition.");
      }
      const newPost = await response.json();
      if (setExhibitionPosts) {
        setExhibitionPosts((prev) => [newPost, ...(prev || [])]);
      }
      showSuccess("Exhibition posted successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        organizer: "",
        category: "",
        entryFee: "",
        maxParticipants: "",
        contactEmail: "",
        contactPhone: "",
        requirements: "",
      });
      setShowForm(false);
      setFormErrors({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      organizer: "",
      category: "",
      entryFee: "",
      maxParticipants: "",
      contactEmail: "",
      contactPhone: "",
      requirements: "",
    });
  };

  if (!showForm) {
    return (
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] px-6 py-4 flex items-center gap-4">
          <img
            src={"https://randomuser.me/api/portraits/women/42.jpg"}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD95A]"
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 bg-[#FFF5E1] border border-[#FFD95A] rounded-full px-5 py-2 text-[#7f5539]/60 text-left hover:bg-[#FFD95A]/20 transition-colors"
          >
            Post an exhibition announcement...
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#D87C5A] hover:bg-[#7f5539] text-white font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Post Exhibition
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#7f5539] flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Post Exhibition Details
          </h3>
          <button
            onClick={handleCancel}
            className="text-[#7f5539] hover:text-[#D87C5A] p-1 rounded-full hover:bg-[#FFD95A]/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {/* Exhibition Title */}
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-1">
              Exhibition Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              placeholder="Enter exhibition title"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539] resize-none"
              placeholder="Describe the exhibition, theme, featured artists, etc."
            />
          </div>
          {/* Location and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                placeholder="e.g. Colombo Art Gallery, Colombo, Sri Lanka"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              />
              {formErrors.startDate && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.startDate}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              />
              {formErrors.endDate && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.endDate}
                </div>
              )}
            </div>
          </div>
          {/* Time and Organizer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              />
              {formErrors.startTime && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.startTime}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              />
              {formErrors.endTime && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.endTime}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Organizer *
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                placeholder="Organization name"
              />
              {formErrors.organizer && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.organizer}
                </div>
              )}
            </div>
          </div>
          {/* Entry Fee and Max Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Entry Fee (LKR)
              </label>
              <input
                type="text"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                placeholder="Free, 1000, etc. (in LKR)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                placeholder="Leave blank for unlimited"
              />
            </div>
          </div>
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                placeholder="e.g. info@lankaart.lk"
              />
              {formErrors.contactEmail && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.contactEmail}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                placeholder="e.g. 011-2345678"
              />
              {formErrors.contactPhone && (
                <div className="text-red-600 text-xs mt-1">
                  {formErrors.contactPhone}
                </div>
              )}
            </div>
          </div>
          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-1">
              Requirements/Guidelines
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539] resize-none"
              placeholder="e.g. Only Sri Lankan artists, artworks inspired by local culture, etc."
            />
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-[#FFD95A] text-[#7f5539] rounded-lg hover:bg-[#FFD95A]/20 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D87C5A] hover:bg-[#7f5539] text-white rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Exhibition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExhibitionPostForm;
