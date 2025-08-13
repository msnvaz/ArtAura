import React, { useState } from 'react';
import { Camera, X, Save, Image, Video, Smile, MapPin, Users, Edit3 } from 'lucide-react';
import ImageEditorModal from '../modals/ImageEditorModal';

const PostUploadModal = ({
    isOpen,
    onClose,
    newPost,
    onPostChange,
    onImageUpload,
    onSave,
    onCancel,
    artistProfile
}) => {
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [currentEditingImage, setCurrentEditingImage] = useState(null);
    const [currentEditingIndex, setCurrentEditingIndex] = useState(null);

    const handleEditImage = (imageFile, index) => {
        setCurrentEditingImage(imageFile);
        setCurrentEditingIndex(index);
        setIsEditingImage(true);
    };

    const handleSaveEditedImage = (editedFile) => {
        if (currentEditingIndex !== null && newPost.imageFiles) {
            const updatedFiles = [...newPost.imageFiles];
            updatedFiles[currentEditingIndex] = editedFile;
            onPostChange('imageFiles', updatedFiles);
        }
        setIsEditingImage(false);
        setCurrentEditingImage(null);
        setCurrentEditingIndex(null);
    };

    const handleCloseEditor = () => {
        setIsEditingImage(false);
        setCurrentEditingImage(null);
        setCurrentEditingIndex(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#fdf9f4]/50">
                    <h2 className="text-xl font-bold text-[#7f5539]">Create Post</h2>
                    <button
                        onClick={onClose}
                        className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={artistProfile.avatar}
                            alt={artistProfile.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-[#7f5539]">{artistProfile.name}</h3>
                            <p className="text-sm text-[#7f5539]/60">Public</p>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-4">
                        {/* Caption Input */}
                        <div>
                            <textarea
                                value={newPost.caption}
                                onChange={(e) => onPostChange('caption', e.target.value)}
                                placeholder={`What's on your mind, ${artistProfile.name.split(' ')[0]}?`}
                                className="w-full p-3 border-none resize-none text-[#7f5539] placeholder-[#7f5539]/50 text-lg leading-relaxed focus:outline-none"
                                rows={4}
                                maxLength={2000}
                            />
                            <div className="text-right text-sm text-[#7f5539]/50">
                                {newPost.caption.length}/2000
                            </div>
                        </div>

                        {/* Image Preview */}
                        {newPost.imageFiles && newPost.imageFiles.length > 0 && (
                            <div className="relative">
                                <div className="grid grid-cols-1 gap-2">
                                    {Array.from(newPost.imageFiles).map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Upload preview ${index + 1}`}
                                                className="w-full h-64 object-cover rounded-lg"
                                            />

                                            {/* Image Controls */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditImage(file, index)}
                                                        className="bg-[#7f5539] text-white p-2 rounded-full hover:bg-[#6e4c34] transition-colors"
                                                        title="Edit Image"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const newFiles = Array.from(newPost.imageFiles).filter((_, i) => i !== index);
                                                            onPostChange('imageFiles', newFiles);
                                                        }}
                                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                        title="Remove Image"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Always visible remove button for mobile */}
                                            <button
                                                onClick={() => {
                                                    const newFiles = Array.from(newPost.imageFiles).filter((_, i) => i !== index);
                                                    onPostChange('imageFiles', newFiles);
                                                }}
                                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors md:hidden"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Post Options */}
                        <div className="border border-[#fdf9f4] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[#7f5539] font-medium">Add to your post</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {/* Photo/Video Upload */}
                                <label className="cursor-pointer">
                                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full transition-colors">
                                        <Image className="h-5 w-5 text-green-600" />
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={onImageUpload}
                                        className="hidden"
                                    />
                                </label>

                                {/* Tag People */}
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </button>

                                {/* Add Emoji */}
                                <button className="flex items-center justify-center w-10 h-10 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors">
                                    <Smile className="h-5 w-5 text-yellow-600" />
                                </button>

                                {/* Add Location */}
                                <button className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full transition-colors">
                                    <MapPin className="h-5 w-5 text-red-600" />
                                </button>
                            </div>
                        </div>

                        {/* Post Settings */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                                <span className="text-[#7f5539] font-medium">Comments</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newPost.allowComments}
                                        onChange={(e) => onPostChange('allowComments', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                                <span className="text-[#7f5539] font-medium">Likes</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newPost.allowLikes}
                                        onChange={(e) => onPostChange('allowLikes', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                                <span className="text-[#7f5539] font-medium">Share</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newPost.allowSharing}
                                        onChange={(e) => onPostChange('allowSharing', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-[#fdf9f4]/50">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={!newPost.caption.trim() && (!newPost.imageFiles || newPost.imageFiles.length === 0)}
                        className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        <span>Post</span>
                    </button>
                </div>
            </div>

            {/* Image Editor Modal */}
            <ImageEditorModal
                isOpen={isEditingImage}
                onClose={handleCloseEditor}
                imageFile={currentEditingImage}
                onSave={handleSaveEditedImage}
            />
        </div>
    );
};

export default PostUploadModal;
