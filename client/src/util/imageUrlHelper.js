/**
 * Utility functions for handling image URLs
 */

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Convert a relative image URL to an absolute URL
 * @param {string} imageUrl - The image URL (could be relative or absolute)
 * @returns {string} - The absolute image URL
 */
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return '/placeholder-artwork.jpg'; // fallback image
  }

  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If it starts with /, it's a relative path from the server root
  if (imageUrl.startsWith('/')) {
    return `${BASE_URL}${imageUrl}`;
  }

  // If it doesn't start with /, assume it needs /uploads/ prefix
  if (!imageUrl.startsWith('uploads/')) {
    return `${BASE_URL}/uploads/${imageUrl}`;
  }

  // If it already has uploads/ prefix, just add the base URL
  return `${BASE_URL}/${imageUrl}`;
};

/**
 * Create a fallback image URL with error handling
 * @param {string} imageUrl - The original image URL
 * @param {string} fallback - The fallback image URL (optional)
 * @returns {object} - Object with src and onError handler
 */
export const createImageWithFallback = (imageUrl, fallback = '/placeholder-artwork.jpg') => {
  return {
    src: getFullImageUrl(imageUrl),
    onError: (e) => {
      console.warn(`Failed to load image: ${imageUrl}`);
      e.target.src = fallback;
    }
  };
};

/**
 * Check if an image URL is valid by attempting to load it
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} - Promise that resolves to true if image loads successfully
 */
export const validateImageUrl = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getFullImageUrl(imageUrl);
  });
};

export default {
  getFullImageUrl,
  createImageWithFallback,
  validateImageUrl
};
