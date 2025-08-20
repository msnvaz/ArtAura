import React from 'react';
import { Eye, Heart, Star, ShoppingCart } from 'lucide-react';

const ArtworksGrid = ({
    artworks = [],
    onViewArtwork,
    onLikeArtwork,
    onOrderArtwork,
    isPublicView = false
}) => {
    // Get API URL from environment variable
    const API_URL = import.meta.env.VITE_API_URL;

    if (artworks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-[#7f5539]/40 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-[#7f5539] mb-2">No artworks available</h3>
                <p className="text-[#7f5539]/60">Check back later for new artworks.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
                <div
                    key={artwork.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                    <div className="relative">
                        <img
                            src={artwork.imageUrl?.startsWith('http') ? artwork.imageUrl : `${API_URL}${encodeURI(artwork.imageUrl || '')}`}
                            alt={artwork.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                console.error('ArtworksGrid: Failed to load image:', artwork.imageUrl);
                                console.error('ArtworksGrid: Constructed URL was:', e.target.src);
                                e.target.src = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';
                                e.target.onerror = null;
                            }}
                        />
                        {artwork.featured && (
                            <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>Featured</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                            <button
                                onClick={() => onViewArtwork?.(artwork)}
                                className="bg-white/90 text-[#7f5539] p-2 rounded-full hover:bg-white transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onLikeArtwork?.(artwork.id)}
                                className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-colors"
                            >
                                <Heart className="h-4 w-4" />
                            </button>
                        </div>
                        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${artwork.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {artwork.status}
                        </div>
                    </div>

                    <div className="p-4">
                        <h4 className="font-semibold text-[#7f5539] mb-1">{artwork.title}</h4>
                        <p className="text-sm text-[#7f5539]/70 mb-2">{artwork.medium} • {artwork.size}</p>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-[#7f5539]">{artwork.price}</span>
                            <span className="text-sm text-[#7f5539]/60">{artwork.year}</span>
                        </div>

                        <div className="flex items-center justify-between mb-3 text-sm text-[#7f5539]/60">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{artwork.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{artwork.views}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => onViewArtwork?.(artwork)}
                                className="flex-1 bg-[#7f5539]/10 text-[#7f5539] py-2 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium text-sm"
                            >
                                View Details
                            </button>
                            {isPublicView && artwork.status === 'Available' && (
                                <button
                                    onClick={() => onOrderArtwork?.(artwork)}
                                    className="flex-1 bg-[#7f5539] text-[#fdf9f4] py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium text-sm flex items-center justify-center space-x-1"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Order</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArtworksGrid;