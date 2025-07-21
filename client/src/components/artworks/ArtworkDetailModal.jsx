import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageZoomLens from './ImageZoomLense';
import {
    Eye,
    Star,
    X,
    Palette,
    Calendar,
    Heart,
    DollarSign,
    Share2,
    Download,
    Trash2,
    ArrowLeft
} from 'lucide-react';

const ArtworkDetailModal = ({
    isOpen,
    artwork,
    onClose,
    onEdit,
    onDelete,
    onToggleFeature,
    onMarkAsSold
}) => {
    const navigate = useNavigate();

    if (!isOpen || !artwork) return null;

    const handleOpenFullView = () => {
        navigate(`/artwork/${artwork.id}`, { state: { artwork } });
        onClose();
    };

    const handleToggleFeature = () => {
        if (onToggleFeature) {
            onToggleFeature(artwork);
        }
    };

    const handleMarkAsSold = () => {
        if (onMarkAsSold) {
            onMarkAsSold(artwork);
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(artwork);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(artwork);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
                    <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
                        <Eye className="mr-2" size={24} />
                        Artwork Details
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Section with Zoom */}
                        <div className="space-y-4">
                            {artwork.featured && (
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                    <Star className="h-4 w-4" />
                                    <span>Featured Artwork</span>
                                </div>
                            )}

                            <div className="relative">
                                <ImageZoomLens
                                    src={artwork.image?.startsWith('http') ? artwork.image : `http://localhost:8081${artwork.image || artwork.imageUrl}`}
                                    zoom={3}
                                    lensSize={150}
                                    className="w-full rounded-lg shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold text-[#7f5539] mb-4">{artwork.title}</h3>

                                {/* Artwork Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <Palette className="h-5 w-5 text-[#7f5539]/60" />
                                        <div>
                                            <p className="text-sm text-[#7f5539]/60">Medium</p>
                                            <p className="font-medium text-[#7f5539]">{artwork.medium}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="h-5 w-5 flex items-center justify-center">
                                            <div className="w-3 h-3 border-2 border-[#7f5539]/60"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#7f5539]/60">Size</p>
                                            <p className="font-medium text-[#7f5539]">{artwork.size}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-[#7f5539]/60" />
                                        <div>
                                            <p className="text-sm text-[#7f5539]/60">Year</p>
                                            <p className="font-medium text-[#7f5539]">{artwork.year}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className={`h-3 w-3 rounded-full ${artwork.status === 'Available' ? 'bg-green-500' :
                                            artwork.status === 'Sold' ? 'bg-red-500' :
                                                'bg-yellow-500'
                                            }`}></div>
                                        <div>
                                            <p className="text-sm text-[#7f5539]/60">Status</p>
                                            <p className="font-medium text-[#7f5539]">{artwork.status}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Engagement Stats */}
                                <div className="flex items-center space-x-6 mb-6 p-4 bg-[#fdf9f4]/50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <Heart className="h-5 w-5 text-red-500" />
                                        <span className="font-medium text-[#7f5539]">{artwork.likes} likes</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Eye className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium text-[#7f5539]">{artwork.views} views</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                        <span className="text-3xl font-bold text-green-600">{artwork.price}</span>
                                    </div>
                                    <div className="flex space-x-3">
                                        {artwork.status === 'Available' && (
                                            <button
                                                onClick={handleMarkAsSold}
                                                className="bg-[#7f5539] text-white px-6 py-3 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium"
                                            >
                                                Mark as Sold
                                            </button>
                                        )}
                                        <button
                                            onClick={handleEdit}
                                            className="bg-[#7f5539]/10 text-[#7f5539] px-6 py-3 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium"
                                        >
                                            Edit Artwork
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#7f5539] mb-3">About this artwork</h4>
                                    <p className="text-[#7f5539]/70 leading-relaxed">
                                        This beautiful piece showcases the artist's mastery of {artwork.medium?.toLowerCase()}.
                                        Created in {artwork.year}, it represents a significant work in the artist's portfolio.
                                        The piece measures {artwork.size} and demonstrates exceptional technique and artistic vision.
                                    </p>
                                </div>
                            </div>

                            {/* Additional Actions */}
                            <div className="pt-6 border-t border-[#fdf9f4]/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center space-x-2 bg-[#7f5539]/10 text-[#7f5539] px-4 py-3 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium">
                                        <Share2 className="h-4 w-4" />
                                        <span>Share</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 bg-[#7f5539]/10 text-[#7f5539] px-4 py-3 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium">
                                        <Download className="h-4 w-4" />
                                        <span>Download</span>
                                    </button>
                                    <button
                                        onClick={handleToggleFeature}
                                        className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                    >
                                        <Star className="h-4 w-4" />
                                        <span>{artwork.featured ? 'Unfeature' : 'Feature'}</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-4 p-6 border-t border-[#fdf9f4]/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleOpenFullView}
                        className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                        <span>Open Full View</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetailModal;