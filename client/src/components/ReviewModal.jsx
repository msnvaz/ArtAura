import React, { useState } from "react";
import { XCircle, Star, User, MessageSquare, Send } from "lucide-react";

const ReviewModal = ({
  isOpen,
  onClose,
  artistName,
  artistId,
  onSubmitReview,
}) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    artistId: artistId || null,
    artistName: artistName || "",
  });

  if (!isOpen) return null;

  const renderStars = (rating = 0, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 hover:text-yellow-300"
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ));
  };

  const handleSubmit = () => {
    if (reviewData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    // Call the parent's submit handler
    if (onSubmitReview) {
      onSubmitReview({
        ...reviewData,
        artistId: artistId,
        artistName: artistName,
      });
    }

    // Reset form and close modal
    setReviewData({ rating: 0, comment: "", artistId: null, artistName: "" });
    onClose();
  };

  const handleClose = () => {
    setReviewData({ rating: 0, comment: "", artistId: null, artistName: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#D87C5A] to-[#7f5539] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-xl font-bold">Review Artist</h3>
              <p className="opacity-90">
                Rate your experience with {artistName}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Artist Info */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D87C5A] to-[#7f5539] rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-[#7f5539]">
              {artistName}
            </h4>
          </div>

          {/* Rating */}
          <div className="text-center">
            <p className="text-[#7f5539] mb-3">
              How would you rate this artist?
            </p>
            <div className="flex justify-center gap-1">
              {renderStars(reviewData.rating, true, (rating) =>
                setReviewData({ ...reviewData, rating })
              )}
            </div>
            <p className="text-sm text-[#7f5539]/70 mt-2">
              {reviewData.rating === 0
                ? "Click to rate"
                : reviewData.rating === 1
                ? "Poor"
                : reviewData.rating === 2
                ? "Fair"
                : reviewData.rating === 3
                ? "Good"
                : reviewData.rating === 4
                ? "Very Good"
                : "Excellent"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[#7f5539] font-medium mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Your Review (Optional)
            </label>
            <textarea
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
              placeholder="Share your experience with this artist's work and service..."
              className="w-full p-3 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D87C5A] focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 border border-[#FFD95A] text-[#7f5539] hover:bg-[#FFF5E1] px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#D87C5A] hover:bg-[#7f5539] text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
