import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const EditPostModal = ({ isOpen, post, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({ ...post });
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/buyer/exhibitions/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      const updatedPost = await response.json();
      onSave(updatedPost);
      onClose();
    } catch (error) {
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
          <h2 className="text-xl font-bold text-[#7f5539]">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539] resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              required
            />
          </div>
          {/* Add more fields as needed */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
