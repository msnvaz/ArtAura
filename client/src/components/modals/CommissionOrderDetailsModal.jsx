import React, { useState } from "react";
import { X, Image as ImageIcon, CheckCircle } from "lucide-react";
import ReviewModal from "../ReviewModal";

const API_URL = import.meta.env.VITE_API_URL;

const CommissionOrderDetailsModal = ({ order, isOpen, onClose }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({ name: "", id: null });
  const [rated, setRated] = useState(false);

  if (!isOpen || !order) return null;

  const artistId = order.artistId ?? order.artist?.id ?? null;
  const artistName = order.artistName ?? order.artist?.name ?? "Artist";
  const ratedKey = `rated:commission:${order.id}:${artistId ?? "unknown"}`;
  // Consider both status and deliveryStatus to enable rating
  const isDelivered =
    ["delivered", "completed"].includes(
      String(order.status || "").toLowerCase()
    ) || String(order.deliveryStatus || "").toLowerCase() === "delivered";

  const checkRated = () => {
    const val = localStorage.getItem(ratedKey) === "1";
    setRated(val);
    return val;
  };

  const openReview = () => {
    setSelectedArtist({ name: artistName, id: artistId });
    setShowReviewModal(true);
  };

  const closeReview = () => setShowReviewModal(false);

  const handleSubmitReview = (data) => {
    // Persist a local flag to avoid duplicate ratings on this order for this artist
    localStorage.setItem(ratedKey, "1");
    setRated(true);
    // TODO: Call backend endpoint to save review and enforce uniqueness server-side
    console.log("Commission review submitted:", data);
    alert("Review submitted successfully!");
    setShowReviewModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFF5E1] rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-6 right-6 text-[#7f5539] hover:text-[#D87C5A] transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </button>

        <div className="p-10">
          <h2 className="text-4xl font-extrabold text-[#7f5539] mb-8 tracking-wide text-center border-b-4 border-[#D87C5A] pb-6">
            Commission Order Details
          </h2>

          {/* Artist Section + Rate */}
          {(artistId || order.artistName) && (
            <div className="mb-8 bg-white rounded-xl p-6 border-2 border-[#FFD95A] shadow-lg">
              <div className="flex items-start gap-4 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#7f5539] mb-2">
                    Artist
                  </h3>
                  <div className="text-[#7f5539]">
                    <div className="font-semibold">{artistName}</div>
                    {order.artistEmail && (
                      <div className="text-sm text-[#7f5539]/70">
                        Email: {order.artistEmail}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  disabled={!isDelivered || checkRated()}
                  onClick={openReview}
                  onMouseEnter={checkRated}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    !isDelivered || rated
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#D87C5A] hover:bg-[#7f5539] text-white"
                  }`}
                  title={
                    isDelivered
                      ? rated
                        ? "Already rated"
                        : "Rate this artist"
                      : "You can rate after delivery"
                  }
                >
                  {rated ? "Rated" : "Rate"}
                </button>
              </div>
            </div>
          )}

          {/* Client Information Section */}
          <div className="mb-8 bg-white rounded-xl p-6 border-2 border-[#FFD95A] shadow-lg">
            <h3 className="text-2xl font-bold text-[#7f5539] mb-6 border-l-6 border-[#D87C5A] pl-4">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">Name:</span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.clientName}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">Email:</span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.clientEmail}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">Phone:</span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.clientPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="mb-8 bg-white rounded-xl p-6 border-2 border-[#FFD95A] shadow-lg">
            <h3 className="text-2xl font-bold text-[#7f5539] mb-6 border-l-6 border-[#D87C5A] pl-4">
              Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">Title:</span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.title}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">Type:</span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.artworkType}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">Style:</span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.style}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">
                  Dimensions:
                </span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.dimensions}
                </span>
              </div>
            </div>
          </div>

          {/* Budget & Timeline Section */}
          <div className="mb-8 bg-white rounded-xl p-6 border-2 border-[#FFD95A] shadow-lg">
            <h3 className="text-2xl font-bold text-[#7f5539] mb-6 border-l-6 border-[#D87C5A] pl-4">
              Budget & Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">
                  Budget:
                </span>
                <span className="text-[#7f5539] font-bold text-xl bg-[#FFD95A] px-4 py-2 rounded-lg shadow-md">
                  LKR {order.budget}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">
                  Deadline:
                </span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.deadline}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">
                  Urgency:
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                    order.urgency === "high"
                      ? "bg-red-500 text-white"
                      : order.urgency === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {order.urgency}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">
                  Status:
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                    order.status === "pending"
                      ? "bg-orange-500 text-white"
                      : order.status === "accepted"
                      ? "bg-green-500 text-white"
                      : order.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#FFD95A]/30">
                <span className="font-bold text-[#D87C5A] text-lg">
                  Submitted:
                </span>
                <span className="text-[#7f5539] font-semibold bg-[#FFF5E1] px-3 py-1 rounded-md">
                  {order.submittedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section for Accepted Orders */}
          {order.status === "accepted" && (
            <div className="mb-8 bg-green-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-4 border-l-6 border-green-500 pl-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Request Accepted!
              </h3>
              <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                <p className="text-green-800 text-lg leading-relaxed mb-4">
                  🎉 Great news! The artist has accepted your commission
                  request. To proceed with the artwork creation, please complete
                  the payment within
                  <span className="font-bold"> 48 hours</span> or the request
                  will be automatically canceled.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 flex-1">
                    <span>💳</span>
                    Pay Now - LKR {order.budget}
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                    Contact Artist
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes Section */}
          {order.additionalNotes && order.additionalNotes !== "-" && (
            <div className="mb-8 bg-white rounded-xl p-6 border-2 border-[#FFD95A] shadow-lg">
              <h3 className="text-2xl font-bold text-[#7f5539] mb-6 border-l-6 border-[#D87C5A] pl-4">
                Additional Notes
              </h3>
              <div className="bg-[#FFF5E1] rounded-lg p-6 border-2 border-[#FFD95A]">
                <p className="text-[#7f5539] italic text-lg leading-relaxed font-medium">
                  {order.additionalNotes}
                </p>
              </div>
            </div>
          )}

          {/* Reference Images Section */}
          <div className="mb-4 bg-white rounded-xl p-6 border-2 border-[#FFD95A] shadow-lg">
            <h3 className="text-2xl font-bold text-[#7f5539] mb-6 border-l-6 border-[#D87C5A] pl-4 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-[#D87C5A]" /> Reference Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {order.imageUrls && order.imageUrls.length > 0 ? (
                order.imageUrls.map((img, idx) => {
                  // Extract filename from full Windows path and serve from client/public/uploads
                  let imageSrc = img;
                  if (img.includes("\\")) {
                    // If it's a full Windows path like C:\Users\aaa\Desktop\ArtAura\client\public\uploads\1760895440943_refernce-7.jpeg
                    const filename = img.split("\\").pop(); // Get just the filename
                    imageSrc = `/uploads/${filename}`; // Serve from client/public/uploads
                  } else if (img.startsWith("/uploads/")) {
                    // If it's already a relative path like /uploads/filename.jpg
                    imageSrc = img;
                  }

                  return (
                    <div key={idx} className="relative group">
                      <img
                        src={imageSrc}
                        alt={`Reference ${idx + 1}`}
                        className="w-full h-48 rounded-lg object-cover border-3 border-[#FFD95A] shadow-lg hover:scale-105 transition-transform duration-300 bg-[#FFF5E1]"
                        onError={(e) => {
                          console.error(`Failed to load image: ${imageSrc}`);
                          e.target.style.display = "none";
                        }}
                      />
                      <span className="absolute bottom-2 right-2 bg-[#D87C5A] text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                        {idx + 1}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <ImageIcon className="w-16 h-16 text-[#D87C5A]/40 mx-auto mb-4" />
                  <span className="text-[#7f5539]/60 text-lg">
                    No reference images provided
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={closeReview}
        artistName={selectedArtist.name}
        artistId={selectedArtist.id}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
};

export default CommissionOrderDetailsModal;
