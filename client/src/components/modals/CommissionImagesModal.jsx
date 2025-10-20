import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { getImageUrl } from '../../util/imageUrlResolver';

const CommissionImagesModal = ({ isOpen, onClose, images, commissionTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoom, setZoom] = useState(1);

    const handlePrevious = () => {
        if (!images || images.length === 0) return;
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setZoom(1);
    };

    const handleNext = () => {
        if (!images || images.length === 0) return;
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setZoom(1);
    };

    const handleDownload = () => {
        if (!images || images.length === 0) return;
        const link = document.createElement('a');
        link.href = getImageUrl(images[currentIndex]);
        link.download = images[currentIndex].split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
    };

    // Keyboard navigation - must be called before any conditional returns
    useEffect(() => {
        if (!isOpen || !images || images.length === 0) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, images]);

    // Conditional rendering - after all hooks
    if (!isOpen || !images || images.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
                {/* Header */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-[#7f5539]">
                            Reference Images
                        </h2>
                        <p className="text-sm text-[#7f5539]/70 mt-1">
                            {commissionTitle} - Image {currentIndex + 1} of {images.length}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleZoomOut}
                            className="p-2 hover:bg-[#fdf9f4] rounded-lg transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-5 h-5 text-[#7f5539]" />
                        </button>
                        <span className="text-sm text-[#7f5539]/70 min-w-[60px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 hover:bg-[#fdf9f4] rounded-lg transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-5 h-5 text-[#7f5539]" />
                        </button>
                        <div className="w-px h-6 bg-[#7f5539]/20 mx-2" />
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-[#fdf9f4] rounded-lg transition-colors"
                            title="Download Image"
                        >
                            <Download className="w-5 h-5 text-[#7f5539]" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Close"
                        >
                            <X className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>

                {/* Main Image Container */}
                <div className="h-full flex items-center justify-center pt-24 pb-32">
                    <div className="relative max-w-full max-h-full overflow-auto bg-white/5 rounded-lg p-8">
                        <img
                            src={getImageUrl(images[currentIndex])}
                            alt={`Reference ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain transition-transform duration-200 rounded-lg shadow-2xl"
                            style={{ transform: `scale(${zoom})` }}
                            onError={(e) => {
                                // Only log in development mode
                                if (import.meta.env.DEV) {
                                    console.warn('⚠️ Modal image not found:', images[currentIndex]);
                                }
                                e.target.onerror = null;
                                // Show a better error message
                                const container = e.target.parentElement;
                                if (container && !container.querySelector('.error-message')) {
                                    e.target.style.display = 'none';
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'error-message flex flex-col items-center justify-center text-white p-8';
                                    errorDiv.innerHTML = `
                    <svg class="w-24 h-24 mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-lg font-semibold mb-2">Image Not Available</p>
                    <p class="text-sm text-white/70 mb-4">The image file could not be found on the server</p>
                    <p class="text-xs text-white/50 font-mono break-all max-w-md text-center">${images[currentIndex]}</p>
                  `;
                                    container.appendChild(errorDiv);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                            title="Previous Image"
                        >
                            <ChevronLeft className="w-6 h-6 text-[#7f5539]" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                            title="Next Image"
                        >
                            <ChevronRight className="w-6 h-6 text-[#7f5539]" />
                        </button>
                    </>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                            <div className="flex items-center space-x-3 overflow-x-auto">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setZoom(1);
                                        }}
                                        className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all ${index === currentIndex
                                                ? 'ring-4 ring-[#7f5539] scale-110'
                                                : 'ring-2 ring-[#7f5539]/20 hover:ring-[#7f5539]/50'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(image)}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-16 h-16 object-cover"
                                            onError={(e) => {
                                                e.target.src = '/art2.jpeg';
                                            }}
                                        />
                                        {index === currentIndex && (
                                            <div className="absolute inset-0 bg-[#7f5539]/20" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Keyboard Navigation Hint */}
                {images.length > 1 && (
                    <div className="absolute top-24 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-xs text-[#7f5539]/70">
                            Use ← → arrow keys to navigate
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommissionImagesModal;
