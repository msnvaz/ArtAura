import React, { useState, useRef } from 'react';
import { Camera, X, Save, Upload, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

const ChangeCoverModal = ({
    isOpen,
    onClose,
    currentCoverImage,
    onSave,
    onCancel,
    artistProfile
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File size must be less than 10MB');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (selectedImage) {
            onSave(selectedImage);
            handleReset();
        }
    };

    const handleCancel = () => {
        handleReset();
        onCancel();
    };

    const handleReset = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
                    <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
                        <Camera className="mr-2" size={24} />
                        Change Cover Photo
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
                    {/* Current Cover Preview */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#7f5539] mb-3">Current Cover Photo</h3>
                        <div className="relative h-32 md:h-40 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={currentCoverImage}
                                alt="Current cover"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="absolute bottom-3 left-3 text-white">
                                <h4 className="font-bold">{artistProfile.name}</h4>
                                <p className="text-sm opacity-90">{artistProfile.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#7f5539] mb-3">Upload New Cover Photo</h3>

                        {!imagePreview ? (
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                        ? 'border-[#7f5539] bg-[#7f5539]/5'
                                        : 'border-[#7f5539]/30 hover:border-[#7f5539]/50'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <Upload className="h-12 w-12 text-[#7f5539]/40" />
                                    </div>
                                    <div>
                                        <button
                                            onClick={triggerFileInput}
                                            className="bg-[#7f5539] text-white px-6 py-3 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium inline-block"
                                        >
                                            Choose Photo
                                        </button>
                                        <p className="text-sm text-[#7f5539]/60 mt-2">
                                            Or drag and drop an image here
                                        </p>
                                        <p className="text-xs text-[#7f5539]/50">
                                            Recommended: 1200x400px or larger. JPG, PNG, GIF. Max size: 10MB.
                                        </p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Preview */}
                                <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={imagePreview}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <h4 className="font-bold">{artistProfile.name}</h4>
                                        <p className="text-sm opacity-90">{artistProfile.location}</p>
                                    </div>
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <button
                                            onClick={triggerFileInput}
                                            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                                            title="Change Image"
                                        >
                                            <Camera size={16} />
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                                            title="Remove Image"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Image Tools */}
                                <div className="flex items-center justify-center space-x-4 p-4 bg-[#fdf9f4]/30 rounded-lg">
                                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-[#7f5539]">
                                        <ZoomIn size={16} />
                                        <span className="text-sm">Zoom In</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-[#7f5539]">
                                        <ZoomOut size={16} />
                                        <span className="text-sm">Zoom Out</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-[#7f5539]">
                                        <Move size={16} />
                                        <span className="text-sm">Reposition</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-[#7f5539]">
                                        <RotateCcw size={16} />
                                        <span className="text-sm">Rotate</span>
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    {/* Cover Photo Guidelines */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Cover Photo Tips</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Use high-quality images that represent your artistic style</li>
                            <li>• Recommended dimensions: 1200x400 pixels or larger</li>
                            <li>• Make sure important content isn't covered by your profile info</li>
                            <li>• Choose images that look good on both desktop and mobile</li>
                            <li>• Avoid images with too much text or small details</li>
                        </ul>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-4 p-6 border-t border-[#fdf9f4]/50">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!selectedImage}
                        className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        <span>Save Cover Photo</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeCoverModal;
