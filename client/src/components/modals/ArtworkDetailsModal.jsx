import React, { useEffect, useState } from "react";
import { X, ShoppingCart, BadgeCheck } from "lucide-react";
import ImageZoomLens from "../artworks/ImageZoomLense";

const ArtworkDetailsModal = ({ isOpen, onClose, artwork, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (isOpen) setQty(1);
  }, [isOpen, artwork]);

  if (!isOpen || !artwork) return null;

  const inc = () => setQty((q) => Math.min(q + 1, artwork?.stock ?? 99_999));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const stockOut = artwork.inStock === false || artwork.stock === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-[101] bg-white w-[95vw] max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-[#FFD95A]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFD95A] bg-[#FFF8E8]">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-[#7f5539] truncate">
              {artwork.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm">
              {artwork.artistAvatarUrl && (
                <img
                  src={artwork.artistAvatarUrl}
                  alt={artwork.artistName}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-[#7f5539]/70 truncate">
                {artwork.artistName}
              </span>
              {artwork.verified && (
                <span
                  title="Verified artist"
                  className="inline-flex items-center gap-1 text-[#7f5539] text-xs"
                >
                  <BadgeCheck className="w-4 h-4" /> Verified
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#FFD95A]/40 text-[#7f5539]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 p-5">
          {/* Image with Zoom */}
          <div className="bg-white md:rounded-xl overflow-hidden border border-[#FFD95A]/60">
            <div className="w-full h-72 md:h-[420px]">
              <ImageZoomLens
                src={artwork.imageUrl}
                alt={artwork.title}
                zoom={4.8}
                lensSize={250}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    "Failed to load artwork image:",
                    artwork.imageUrl
                  );
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-2xl font-bold text-[#D87C5A]">
                LKR {artwork.price?.toLocaleString()}
              </div>
              <div
                className={`mt-1 text-sm ${
                  stockOut ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {stockOut
                  ? "Out of stock"
                  : `In stock${
                      artwork.stock ? ` · ${artwork.stock} available` : ""
                    }`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[#7f5539]/60">Medium</div>
                <div className="text-[#7f5539] font-medium">
                  {artwork.medium || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[#7f5539]/60">Size</div>
                <div className="text-[#7f5539] font-medium">
                  {artwork.size || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[#7f5539]/60">Year</div>
                <div className="text-[#7f5539] font-medium">
                  {artwork.year || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[#7f5539]/60">Category</div>
                <div className="text-[#7f5539] font-medium">
                  {artwork.category || "N/A"}
                </div>
              </div>
            </div>

            {artwork.tags && (
              <div>
                <div className="text-xs text-[#7f5539]/60 mb-1">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {String(artwork.tags)
                    .split(",")
                    .slice(0, 8)
                    .map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        className="px-2 py-0.5 bg-[#FFD95A]/40 text-[#7f5539] text-xs rounded-full"
                      >
                        {t.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {artwork.description && (
              <div>
                <div className="text-xs text-[#7f5539]/60 mb-1">
                  Description
                </div>
                <p className="text-sm text-[#7f5539]/90 leading-relaxed whitespace-pre-line">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Add to cart */}
            <div className="mt-auto pt-2 flex items-center gap-3">
              <div className="inline-flex items-center border border-[#FFD95A] rounded-lg overflow-hidden">
                <button
                  onClick={dec}
                  className="px-3 py-2 text-[#7f5539] hover:bg-[#FFD95A]/40"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value || "1", 10)))
                  }
                  className="w-14 text-center py-2 outline-none text-[#7f5539]"
                />
                <button
                  onClick={inc}
                  className="px-3 py-2 text-[#7f5539] hover:bg-[#FFD95A]/40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                disabled={stockOut}
                onClick={async () => {
                  await onAddToCart(artwork.artworkId || artwork.id, qty);
                  onClose?.();
                }}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  stockOut
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#D87C5A] hover:bg-[#7f5539] text-white"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {stockOut ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailsModal;
