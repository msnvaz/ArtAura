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
      const data = new FormData();
      data.append("caption", formData.caption);

      // Append image only if new image selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      // Get JWT token from localStorage or context (adjust if needed)
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Make PUT request to backend
      const response = await axios.put(
        `http://localhost:8080/api/posts/${item.post_id}`, // confirm your ID key here
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSave(response.data); // pass updated post back to parent
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
            <label className="block text-sm font-medium" htmlFor="caption">
              Caption
            </label>
            <input
              type="text"
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/60"
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
