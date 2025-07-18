import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { format, isValid } from "date-fns";

function EditModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    caption: item.caption || "",
    image: null, // new image file (not URL)
  });
  const [imagePreview, setImagePreview] = useState(item.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form and close modal
  const handleClose = () => {
    setFormData({ caption: item.caption || "", image: null });
    setImagePreview(item.image || null);
    setError("");
    onClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Instead of making our own API call, just pass the updated data to the parent
      // The parent (ArtistPortfolio) will handle the API call
      const updatedPost = {
        ...item,
        caption: formData.caption,
        // If there's a new image, we'd need to handle that separately
        // For now, just update the caption
      };

      console.log('EditPostModel: Sending updated post to parent:', updatedPost);

      // Call the parent's onSave function with the updated post
      onSave(updatedPost);
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: safe date formatting helper (use where needed)
  const safeFormatDate = (date) => {
    const parsedDate = new Date(date);
    if (!isValid(parsedDate)) {
      return "Invalid date";
    }
    return format(parsedDate, "dd/MM/yyyy");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close edit modal"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-[#7f5539]">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="caption">
              Caption
            </label>
            <textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              rows={4}
              placeholder="Write your caption here..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/60 resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/60"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-h-40 rounded-lg border"
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7f5539] text-white rounded hover:bg-[#5c3d2a]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
