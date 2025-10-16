/**
 * Utility functions for handling image URLs consistently across the application
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400';

/**
 * Constructs a proper image URL from various possible image path formats
 * @param {string} imagePath - The image path (could be relative or absolute)
 * @param {string} fallback - Optional fallback image URL
 * @returns {string} - Properly formatted image URL
 */
export const getImageUrl = (imagePath, fallback = FALLBACK_IMAGE) => {
    // Return fallback if no image path provided
    if (!imagePath) {
        return fallback;
    }

    // If already a complete HTTP URL, return as-is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // If starts with slash, it's a server path - prepend base URL and encode URI
    if (imagePath.startsWith('/')) {
        return `${API_BASE_URL}${encodeURI(imagePath)}`;
    }

    // Otherwise, assume it's a relative path and add both base URL and slash
    return `${API_BASE_URL}/${encodeURI(imagePath)}`;
};

/**
 * Creates an error handler for image loading failures
 * @param {string} originalPath - The original image path that failed
 * @param {string} fallback - Optional fallback image URL
 * @returns {Function} - Error handler function
 */
export const createImageErrorHandler = (originalPath, fallback = FALLBACK_IMAGE) => {
    return (e) => {
        console.error('Failed to load image:', originalPath);
        e.target.src = fallback;
        e.target.onerror = null; // Prevent infinite error loops
    };
};

/**
 * React hook for managing image source with error handling
 * @param {string} imagePath - The original image path
 * @param {string} fallback - Optional fallback image URL
 * @returns {Object} - Object with src and onError handler
 */
export const useImageWithFallback = (imagePath, fallback = FALLBACK_IMAGE) => {
    const src = getImageUrl(imagePath, fallback);
    const onError = createImageErrorHandler(imagePath, fallback);

    return { src, onError };
};

export default {
    getImageUrl,
    createImageErrorHandler,
    useImageWithFallback,
    FALLBACK_IMAGE,
    API_BASE_URL
};
