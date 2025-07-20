import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";

const EditPostModal = ({ isOpen, post, onClose, onSave }) => {
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
  const [errors, setErrors] = useState({});

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
    "Other",
  ];

  useEffect(() => {
    if (post && isOpen) {
      setFormData({
        title: post.title || "",
        description: post.description || "",
        location: post.location || "",
        startDate: post.startDate || "",
        endDate: post.endDate || "",
        startTime: post.startTime || "",
        endTime: post.endTime || "",
        organizer: post.organizer || "",
        category: post.category || "",
        entryFee: post.entryFee || "",
        maxParticipants: post.maxParticipants || "",
        contactEmail: post.contactEmail || "",
        contactPhone: post.contactPhone || "",
        requirements: post.requirements || "",
      });
      setErrors({});
    }
  }, [post, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
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
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.category) newErrors.category = "Category is required";

    // Date validation
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Here you would make the API call to update the post
      // const response = await axios.put(`/api/posts/${post.post_id}`, formData);

      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create updated post object
      const updatedPost = {
        ...post,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      onSave(updatedPost);
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
          <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
            <Edit3 className="mr-2" size={24} />
            Edit Exhibition Post
          </h2>
          <button
            onClick={handleClose}
            className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#7f5539]">
                Exhibition Details
              </h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-1">
                  Exhibition Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all ${
                    errors.title ? "border-red-300" : "border-[#7f5539]/20"
                  }`}
                  placeholder="Enter exhibition title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
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
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all resize-none ${
                    errors.description
                      ? "border-red-300"
                      : "border-[#7f5539]/20"
                  }`}
                  placeholder="Describe the exhibition, theme, featured artists, etc."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
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
                    className={`w-full px-4 py-3 border rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all ${
                      errors.location ? "border-red-300" : "border-[#7f5539]/20"
                    }`}
                    placeholder="Venue name and address"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all ${
                      errors.category ? "border-red-300" : "border-[#7f5539]/20"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#7f5539]">Schedule</h3>

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
                    className={`w-full px-4 py-3 border rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all ${
                      errors.startDate
                        ? "border-red-300"
                        : "border-[#7f5539]/20"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
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
                    className={`w-full px-4 py-3 border rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all ${
                      errors.endDate ? "border-red-300" : "border-[#7f5539]/20"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                    placeholder="Organization name"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#7f5539]">
                Additional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    Entry Fee
                  </label>
                  <input
                    type="text"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                    placeholder="Free, $10, etc."
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
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                    placeholder="Leave blank for unlimited"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all"
                    placeholder="Phone number"
                  />
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
                  rows={3}
                  className="w-full px-4 py-3 border border-[#7f5539]/20 rounded-lg text-[#7f5539] focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-all resize-none"
                  placeholder="Any special requirements, submission guidelines, etc."
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#fdf9f4]/50 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
