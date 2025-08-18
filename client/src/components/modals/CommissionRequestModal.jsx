import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  MessageSquare,
  Palette,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const CommissionRequestModal = ({ isOpen, onClose, artist }) => {
  const { token, role, userId } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    // Client information (auto-populated but editable)
    clientName: "",
    clientEmail: "",
    clientPhone: "",

    // Commission details
    title: "",
    artworkType: "",
    style: "",
    dimensions: "",
    budget: "",
    deadline: "",

    // Additional details
    inspirationImages: [],
    additionalNotes: "",
    urgency: "normal",
  });

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch user details when modal opens
  useEffect(() => {
    if (isOpen && token && userId && role) {
      fetchUserDetails();
    }
  }, [isOpen, token, userId, role]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;

      // Determine the correct endpoint based on user role
      let endpoint = "";
      switch (role) {
        case "artist":
          endpoint = `${API_URL}/api/artist/profile/${userId}`;
          break;
        case "buyer":
          endpoint = `${API_URL}/api/buyer/profile/${userId}`;
          break;
        case "shop":
          endpoint = `${API_URL}/api/shop/profile/${userId}`;
          break;
        default:
          console.warn("Unknown role:", role);
          return;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      setUserDetails(userData);

      // Auto-populate form with user data
      setFormData((prev) => ({
        ...prev,
        clientName:
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.name || userData.ownerName || "",
        clientEmail: userData.email || "",
        clientPhone: userData.contactNo || userData.phone || "",
      }));
    } catch (error) {
      console.error("Error fetching user details:", error);

      // Fallback: If API endpoint doesn't exist, use mock data or leave fields empty
      // This allows users to manually enter their information
      console.log("Using fallback - user can manually enter information");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      inspirationImages: [...prev.inspirationImages, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      inspirationImages: prev.inspirationImages.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) newErrors.clientName = "Name is required";
    if (!formData.clientEmail.trim())
      newErrors.clientEmail = "Email is required";
    if (!formData.title.trim())
      newErrors.title = "Commission title is required";
    if (!formData.artworkType)
      newErrors.artworkType = "Artwork type is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // 1. Upload inspiration images if any
      let imageUrls = [];
      if (formData.inspirationImages.length > 0) {
        const API_URL = import.meta.env.VITE_API_URL;
        for (const file of formData.inspirationImages) {
          const imgForm = new FormData();
          imgForm.append("image", file);
          // You should have an endpoint for image upload, e.g. /api/uploads/image
          const imgRes = await axios.post(
            `${API_URL}/api/uploads/image`,
            imgForm,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (imgRes.data && imgRes.data.imageUrl) {
            imageUrls.push(imgRes.data.imageUrl);
          }
        }
      }

      // 2. Prepare commission request data
      const commissionData = {
        ...formData,
        artistId: artist.id,
        clientId: userId,
        status: "pending",
        submittedAt: new Date().toISOString(),
        imageUrls, // pass uploaded image URLs
      };

      // 3. API call to submit commission request
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/api/commissions/request`,
        commissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Commission request submitted successfully!");
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting commission request:", error);
      alert("Failed to submit commission request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      title: "",
      artworkType: "",
      style: "",
      dimensions: "",
      budget: "",
      deadline: "",
      inspirationImages: [],
      additionalNotes: "",
      urgency: "normal",
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#FFE4D6] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#7f5539] flex items-center gap-2">
                <Palette size={24} />
                Commission Request
              </h2>
              <p className="text-[#7f5539]/70 mt-1">
                Request a custom artwork from {artist?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FFE4D6] rounded-lg transition-colors"
            >
              <X size={24} className="text-[#7f5539]" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information Section */}
          <div className="bg-[#FFF5E1] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-[#D87C5A]" />
              <h3 className="text-lg font-semibold text-[#7f5539]">
                Your Information
              </h3>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-[#7f5539]/70">
                  <div className="w-4 h-4 border-2 border-[#D87C5A] border-t-transparent rounded-full animate-spin"></div>
                  Loading your details...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.clientName ? "border-red-500" : "border-[#FFE4D6]"
                  }`}
                  placeholder="e.g., Nimal Perera, Sanduni Fernando"
                />
                {errors.clientName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    handleInputChange("clientEmail", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.clientEmail ? "border-red-500" : "border-[#FFE4D6]"
                  }`}
                  placeholder="e.g., nimal.perera@gmail.com"
                />
                {errors.clientEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.clientEmail}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    handleInputChange("clientPhone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
                  placeholder="e.g., +94 77 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Commission Details */}
          <div>
            <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center gap-2">
              <Palette size={20} />
              Commission Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Commission Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.title ? "border-red-500" : "border-[#FFE4D6]"
                  }`}
                  placeholder="Give your commission a title"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Artwork Type *
                </label>
                <select
                  value={formData.artworkType}
                  onChange={(e) =>
                    handleInputChange("artworkType", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.artworkType ? "border-red-500" : "border-[#FFE4D6]"
                  }`}
                >
                  <option value="">Select artwork type</option>
                  <option value="painting">Painting</option>
                  <option value="drawing">Drawing</option>
                  <option value="digital">Digital Art</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="photography">Photography</option>
                  <option value="other">Other</option>
                </select>
                {errors.artworkType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.artworkType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Style/Medium
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => handleInputChange("style", e.target.value)}
                  className="w-full px-3 py-2 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
                >
                  <option value="">Select style/medium</option>

                  {/* Painting Mediums */}
                  <optgroup label="Painting">
                    <option value="oil-painting">Oil Painting</option>
                    <option value="acrylic-painting">Acrylic Painting</option>
                    <option value="watercolor">Watercolor</option>
                    <option value="gouache">Gouache</option>
                    <option value="tempera">Tempera</option>
                    <option value="fresco">Fresco</option>
                  </optgroup>

                  {/* Drawing Mediums */}
                  <optgroup label="Drawing">
                    <option value="pencil">Pencil</option>
                    <option value="charcoal">Charcoal</option>
                    <option value="ink">Ink</option>
                    <option value="pastels">Pastels</option>
                    <option value="colored-pencils">Colored Pencils</option>
                    <option value="markers">Markers</option>
                  </optgroup>

                  {/* Digital */}
                  <optgroup label="Digital Art">
                    <option value="digital-painting">Digital Painting</option>
                    <option value="digital-illustration">
                      Digital Illustration
                    </option>
                    <option value="3d-modeling">3D Modeling</option>
                    <option value="pixel-art">Pixel Art</option>
                    <option value="vector-art">Vector Art</option>
                  </optgroup>

                  {/* Traditional Crafts */}
                  <optgroup label="Traditional Crafts">
                    <option value="calligraphy">Calligraphy</option>
                    <option value="woodworking">Woodworking</option>
                    <option value="ceramics">Ceramics</option>
                    <option value="textile-art">Textile Art</option>
                    <option value="printmaking">Printmaking</option>
                  </optgroup>

                  {/* Mixed Media */}
                  <optgroup label="Mixed Media">
                    <option value="collage">Collage</option>
                    <option value="mixed-media">Mixed Media</option>
                    <option value="assemblage">Assemblage</option>
                  </optgroup>

                  <option value="other">Other (specify in notes)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Dimensions
                </label>
                <select
                  value={formData.dimensions}
                  onChange={(e) =>
                    handleInputChange("dimensions", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
                >
                  <option value="">Select dimensions</option>

                  {/* Small Sizes */}
                  <optgroup label="Small (Perfect for desks & small spaces)">
                    <option value="5x7">5" × 7" (12.7 × 17.8 cm)</option>
                    <option value="8x10">8" × 10" (20.3 × 25.4 cm)</option>
                    <option value="9x12">9" × 12" (22.9 × 30.5 cm)</option>
                    <option value="11x14">11" × 14" (27.9 × 35.6 cm)</option>
                  </optgroup>

                  {/* Medium Sizes */}
                  <optgroup label="Medium (Great for wall displays)">
                    <option value="12x16">12" × 16" (30.5 × 40.6 cm)</option>
                    <option value="16x20">16" × 20" (40.6 × 50.8 cm)</option>
                    <option value="18x24">18" × 24" (45.7 × 61.0 cm)</option>
                    <option value="20x24">20" × 24" (50.8 × 61.0 cm)</option>
                  </optgroup>

                  {/* Large Sizes */}
                  <optgroup label="Large (Statement pieces)">
                    <option value="24x30">24" × 30" (61.0 × 76.2 cm)</option>
                    <option value="24x36">24" × 36" (61.0 × 91.4 cm)</option>
                    <option value="30x40">30" × 40" (76.2 × 101.6 cm)</option>
                    <option value="36x48">36" × 48" (91.4 × 121.9 cm)</option>
                  </optgroup>

                  {/* Square Formats */}
                  <optgroup label="Square Formats">
                    <option value="8x8">8" × 8" (20.3 × 20.3 cm)</option>
                    <option value="12x12">12" × 12" (30.5 × 30.5 cm)</option>
                    <option value="16x16">16" × 16" (40.6 × 40.6 cm)</option>
                    <option value="20x20">20" × 20" (50.8 × 50.8 cm)</option>
                    <option value="24x24">24" × 24" (61.0 × 61.0 cm)</option>
                  </optgroup>

                  {/* Panoramic */}
                  <optgroup label="Panoramic">
                    <option value="12x36">12" × 36" (30.5 × 91.4 cm)</option>
                    <option value="16x48">16" × 48" (40.6 × 121.9 cm)</option>
                    <option value="20x60">20" × 60" (50.8 × 152.4 cm)</option>
                  </optgroup>

                  {/* Digital Specific */}
                  <optgroup label="Digital/Print Formats">
                    <option value="1920x1080">1920 × 1080 px (HD)</option>
                    <option value="2560x1440">2560 × 1440 px (2K)</option>
                    <option value="3840x2160">3840 × 2160 px (4K)</option>
                    <option value="1080x1080">
                      1080 × 1080 px (Social Media Square)
                    </option>
                    <option value="1080x1350">
                      1080 × 1350 px (Instagram Portrait)
                    </option>
                  </optgroup>

                  <option value="custom">Custom (specify in notes)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Budget *
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.budget ? "border-red-500" : "border-[#FFE4D6]"
                  }`}
                  placeholder="e.g., Rs 25,000 - Rs 50,000"
                />
                {errors.budget && (
                  <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    handleInputChange("deadline", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.deadline ? "border-red-500" : "border-[#FFE4D6]"
                  }`}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange("urgency", e.target.value)}
                  className="w-full px-3 py-2 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A]"
                >
                  <option value="low">Low - I'm flexible with timing</option>
                  <option value="normal">Normal - Standard timeline</option>
                  <option value="high">High - Need it soon</option>
                  <option value="urgent">Urgent - Rush job</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inspiration Images */}
          <div>
            <h3 className="text-lg font-semibold text-[#7f5539] mb-4 flex items-center gap-2">
              <ImageIcon size={20} />
              Inspiration Images (Optional)
            </h3>

            <div className="border-2 border-dashed border-[#FFE4D6] rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="inspiration-upload"
              />
              <label htmlFor="inspiration-upload" className="cursor-pointer">
                <Upload className="mx-auto text-[#D87C5A] mb-2" size={48} />
                <p className="text-[#7f5539] font-medium">
                  Upload inspiration images
                </p>
                <p className="text-[#7f5539]/60 text-sm">
                  Help the artist understand your vision
                </p>
              </label>
            </div>

            {formData.inspirationImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.inspirationImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Inspiration ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] resize-none"
              placeholder="Any additional information or special requests..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#FFE4D6] text-[#7f5539] rounded-lg hover:bg-[#FFF5E1] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#D87C5A] text-white px-6 py-3 rounded-lg hover:bg-[#c06949] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionRequestModal;
