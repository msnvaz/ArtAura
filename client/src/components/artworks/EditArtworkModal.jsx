import React, { useState, useEffect } from 'react';
import {
    X,
    Save,
    Upload,
    Palette,
    Calendar,
    FileText,
    Tag,
    Ruler,
    Star
} from 'lucide-react';

const EditArtworkModal = ({
    isOpen,
    artwork,
    onClose,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        title: '',
        medium: '',
        size: '',
        year: '',
        price: '',
        description: '',
        category: '',
        tags: '',
        status: 'Available',
        featured: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form data when artwork changes
    useEffect(() => {
        if (artwork && isOpen) {
            setFormData({
                title: artwork.title || '',
                medium: artwork.medium || '',
                size: artwork.size || '',
                year: artwork.year || '',
                price: artwork.price || '',  // Keep as is for now
                description: artwork.description || '',
                category: artwork.category || '',
                tags: artwork.tags || '',
                status: artwork.status || 'Available',
                featured: artwork.featured || false
            });
            setImagePreview(artwork.imageUrl ? `http://localhost:8081${artwork.imageUrl}` : '');

            // IMPORTANT: Clear any previously selected image file when switching artworks
            setImageFile(null);
        }
    }, [artwork, isOpen]);    // Clear image file state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setImageFile(null);
            setImagePreview('');
        }
    }, [isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submissionData = {
                ...formData,
                price: parseFloat(formData.price) || 0, // Ensure price is a number
                artworkId: artwork.artworkId || artwork.id,
                imageFile: imageFile
            };

            await onSave(submissionData);
            onClose();
        } catch (error) {
            console.error('Error updating artwork:', error);
            alert('Failed to update artwork. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            medium: '',
            size: '',
            year: '',
            price: '',
            description: '',
            category: '',
            tags: '',
            status: 'Available',
            featured: false
        });
        setImageFile(null);
        setImagePreview('');
        onClose();
    };

    if (!isOpen || !artwork) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
                    <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
                        <Palette className="mr-2" size={24} />
                        Edit Artwork
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Image */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Artwork Image</h3>

                            {/* Image Preview */}
                            <div className="border-2 border-dashed border-[#7f5539]/30 rounded-lg p-4 text-center">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Artwork preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(artwork.imageUrl ? `http://localhost:8081${artwork.imageUrl}` : '');
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-[#7f5539]/60">
                                        <Upload className="mx-auto h-12 w-12 mb-4" />
                                        <p>Upload new image (optional)</p>
                                    </div>
                                )}
                            </div>

                            {/* File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                            />
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Artwork Details</h3>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                    <FileText className="inline mr-1" size={16} />
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                    placeholder="Enter artwork title"
                                    required
                                />
                            </div>

                            {/* Medium */}
                            <div>
                                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                    <Palette className="inline mr-1" size={16} />
                                    Medium *
                                </label>
                                <input
                                    type="text"
                                    value={formData.medium}
                                    onChange={(e) => handleInputChange('medium', e.target.value)}
                                    className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                    placeholder="e.g., Oil on Canvas, Digital Art, Watercolor"
                                    required
                                />
                            </div>

                            {/* Size and Year Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                        <Ruler className="inline mr-1" size={16} />
                                        Size
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={(e) => handleInputChange('size', e.target.value)}
                                        className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                        placeholder="e.g., 24' x 36'"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                        <Calendar className="inline mr-1" size={16} />
                                        Year
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={(e) => handleInputChange('year', e.target.value)}
                                        className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                        placeholder={new Date().getFullYear().toString()}
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                    <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded mr-1">LKR</span>
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                    placeholder="Enter price in LKR"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Category and Status Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                        <Tag className="inline mr-1" size={16} />
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                    >
                                        <option value="">Select category</option>
                                        <option value="abstract">Abstract</option>
                                        <option value="landscape">Landscape</option>
                                        <option value="portrait">Portrait</option>
                                        <option value="digital">Digital Art</option>
                                        <option value="photography">Photography</option>
                                        <option value="sculpture">Sculpture</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#7f5539] mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Reserved">Reserved</option>
                                    </select>
                                </div>
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                                    className="w-4 h-4 text-[#7f5539] border-[#7f5539]/30 rounded focus:ring-[#7f5539]"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-[#7f5539] flex items-center">
                                    <Star className="mr-1" size={16} />
                                    Featured Artwork
                                </label>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                    <Tag className="inline mr-1" size={16} />
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => handleInputChange('tags', e.target.value)}
                                    className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                                    placeholder="Enter tags separated by commas"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                                    <FileText className="inline mr-1" size={16} />
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border border-[#7f5539]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent resize-none"
                                    placeholder="Describe your artwork..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#fdf9f4]/50 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                            disabled={isLoading}
                        >
                            <Save className="h-4 w-4" />
                            <span>{isLoading ? 'Updating...' : 'Update Artwork'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArtworkModal;