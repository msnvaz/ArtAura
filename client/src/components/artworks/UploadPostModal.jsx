import React, { useState } from 'react';
import { Plus, Upload, Save, X } from 'lucide-react';

import axios from 'axios';

const UploadPostModal = ({
    isOpen,
    onClose,
    newArtwork,
    onArtworkChange,
    onImageUpload,
    onSave, // will be replaced by internal handler
    onCancel,
    onSuccess // New callback for successful upload
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                setError('Authentication required.');
                setLoading(false);
                window.location.href = '/login';
                return;
            }

            // Validate required fields
            if (!newArtwork.title || !newArtwork.medium || !newArtwork.price) {
                setError('Please fill in all required fields (Title, Medium, Price).');
                setLoading(false);
                return;
            }

            // Create FormData for multipart upload
            const formData = new FormData();
            formData.append('title', newArtwork.title);
            formData.append('medium', newArtwork.medium);
            formData.append('size', newArtwork.size || '');
            formData.append('year', newArtwork.year || new Date().getFullYear().toString());
            formData.append('price', newArtwork.price.toString());
            formData.append('description', newArtwork.description || '');
            formData.append('category', newArtwork.category || '');
            formData.append('tags', newArtwork.tags || '');

            // Add image file if selected
            if (newArtwork.imageFiles && newArtwork.imageFiles.length > 0) {
                formData.append('image', newArtwork.imageFiles[0]);
            }

            console.log('Uploading artwork with FormData...');

            const response = await axios.post(
                `http://localhost:8081/api/artworks/artist/${userId}/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Artwork added successfully:', response.data);
            setLoading(false);

            // Show success message
            alert('Artwork added successfully!');

            // Call onSuccess callback with the new artwork data
            if (onSuccess) {
                onSuccess(response.data);
            }

            if (onClose) onClose();
        } catch (err) {
            console.error('Error adding artwork:', err.response || err);
            setError(err?.response?.data?.message || err?.message || 'Failed to add artwork.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
                    <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
                        <Plus className="mr-2" size={24} />
                        Add New Artwork
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <form className="space-y-6" onSubmit={handleSave}>
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#7f5539]">Artwork Images</h3>

                            <div className="border-2 border-dashed border-[#7f5539]/30 rounded-lg p-8 text-center hover:border-[#7f5539]/50 transition-colors">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <Upload className="h-12 w-12 text-[#7f5539]/40" />
                                    </div>
                                    <div>
                                        <label className="cursor-pointer">
                                            <span className="bg-[#7f5539] text-white px-6 py-3 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium inline-block">
                                                Choose Files
                                            </span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={onImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-sm text-[#7f5539]/60 mt-2">
                                            Upload high-quality images of your artwork. You can select multiple files.
                                        </p>
                                        <p className="text-xs text-[#7f5539]/50">
                                            Supported formats: JPG, PNG, GIF. Max size: 10MB per file.
                                        </p>
                                    </div>
                                    {newArtwork.imageFiles.length > 0 && (
                                        <div className="text-sm text-[#7f5539]">
                                            {newArtwork.imageFiles.length} file(s) selected
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#7f5539]">Artwork Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#7f5539]">Title *</label>
                                    <input
                                        type="text"
                                        value={newArtwork.title}
                                        onChange={(e) => onArtworkChange('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                        placeholder="Enter artwork title"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#7f5539]">Medium *</label>
                                    <select
                                        value={newArtwork.medium}
                                        onChange={(e) => onArtworkChange('medium', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                        required
                                    >
                                        <option value="">Select medium</option>
                                        <option value="Oil on Canvas">Oil on Canvas</option>
                                        <option value="Acrylic on Canvas">Acrylic on Canvas</option>
                                        <option value="Watercolor">Watercolor</option>
                                        <option value="Digital Art">Digital Art</option>
                                        <option value="Charcoal on Paper">Charcoal on Paper</option>
                                        <option value="Pencil Drawing">Pencil Drawing</option>
                                        <option value="Mixed Media">Mixed Media</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Sculpture">Sculpture</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#7f5539]">Size</label>
                                    <input
                                        type="text"
                                        value={newArtwork.size}
                                        onChange={(e) => onArtworkChange('size', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                        placeholder='e.g., 24" x 36"'
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#7f5539]">Year Created</label>
                                    <input
                                        type="number"
                                        value={newArtwork.year}
                                        onChange={(e) => onArtworkChange('year', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                        placeholder="2024"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#7f5539]">Price *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/60">$</span>
                                        <input
                                            type="number"
                                            value={newArtwork.price}
                                            onChange={(e) => onArtworkChange('price', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#7f5539]">Category</label>
                                    <select
                                        value={newArtwork.category}
                                        onChange={(e) => onArtworkChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                    >
                                        <option value="">Select category</option>
                                        <option value="Abstract">Abstract</option>
                                        <option value="Landscape">Landscape</option>
                                        <option value="Portrait">Portrait</option>
                                        <option value="Still Life">Still Life</option>
                                        <option value="Contemporary">Contemporary</option>
                                        <option value="Traditional">Traditional</option>
                                        <option value="Digital">Digital</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Sculpture">Sculpture</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#7f5539]">Description</label>
                                <textarea
                                    value={newArtwork.description}
                                    onChange={(e) => onArtworkChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors resize-none"
                                    placeholder="Describe your artwork, its inspiration, technique, or any interesting details..."
                                />
                                <p className="text-xs text-[#7f5539]/60">{newArtwork.description.length}/1000 characters</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#7f5539]">Tags</label>
                                <input
                                    type="text"
                                    value={newArtwork.tags}
                                    onChange={(e) => onArtworkChange('tags', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                                    placeholder="e.g., abstract, colorful, modern, landscape (separate with commas)"
                                />
                                <p className="text-xs text-[#7f5539]/60">Add relevant tags to help people discover your artwork</p>
                            </div>
                        </div>

                        {/* Pricing & Availability */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#7f5539]">Pricing & Availability</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-[#fdf9f4]/30 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="available"
                                        defaultChecked
                                        className="w-4 h-4 text-[#7f5539] border-[#7f5539]/20 rounded focus:ring-[#7f5539]/20"
                                    />
                                    <label htmlFor="available" className="text-sm font-medium text-[#7f5539]">
                                        Available for Sale
                                    </label>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-[#fdf9f4]/30 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        className="w-4 h-4 text-[#7f5539] border-[#7f5539]/20 rounded focus:ring-[#7f5539]/20"
                                    />
                                    <label htmlFor="featured" className="text-sm font-medium text-[#7f5539]">
                                        Feature in Portfolio
                                    </label>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-[#fdf9f4]/30 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="prints"
                                        className="w-4 h-4 text-[#7f5539] border-[#7f5539]/20 rounded focus:ring-[#7f5539]/20"
                                    />
                                    <label htmlFor="prints" className="text-sm font-medium text-[#7f5539]">
                                        Allow Print Sales
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Buttons - Inside form for proper submission */}
                        <div className="flex flex-col items-end space-y-2 pt-6 border-t border-[#fdf9f4]/50">
                            {error && <div className="text-red-600 text-sm mb-2 w-full text-right">{error}</div>}
                            <div className="flex items-center justify-end space-x-4 w-full">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2 disabled:opacity-60"
                                    disabled={loading}
                                >
                                    <Save size={16} />
                                    <span>{loading ? 'Adding...' : 'Add Artwork'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPostModal;