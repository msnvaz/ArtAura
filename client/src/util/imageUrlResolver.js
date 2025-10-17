/**
 * Image URL utility with fallback support
 * Handles multiple image sources for development team sharing
 */

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

/**
 * Get image URL with fallback logic
 * @param {string} imagePath - Relative image path from backend (e.g., "/uploads/profiles/image.jpg")
 * @param {boolean} usePublicFallback - Whether to use public folder as fallback
 * @returns {string} Complete image URL
 */
export const getImageUrl = (imagePath, usePublicFallback = true) => {
  if (!imagePath) return '';

  // If image path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Primary: Backend served image
  const backendUrl = `${API_URL}${imagePath}`;

  if (!usePublicFallback) {
    return backendUrl;
  }

  // For development: Check if image exists in public folder
  // This is a synchronous check, for async use checkImageExists()
  return backendUrl;
};

/**
 * Get image URL with public folder fallback
 * @param {string} imagePath - Relative image path
 * @returns {string} Public folder image URL
 */
export const getPublicImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // Remove leading slash if present and add to public path
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `/${cleanPath}`;
};

/**
 * Check if image exists at URL (async)
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} Whether image exists
 */
export const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get image URL with automatic fallback checking
 * @param {string} imagePath - Relative image path
 * @returns {Promise<string>} Best available image URL
 */
export const getImageUrlWithFallback = async (imagePath) => {
  if (!imagePath) return '';

  const backendUrl = getImageUrl(imagePath, false);
  const publicUrl = getPublicImageUrl(imagePath);

  // Try backend first
  const backendExists = await checkImageExists(backendUrl);
  if (backendExists) {
    return backendUrl;
  }

  // Fallback to public folder
  const publicExists = await checkImageExists(publicUrl);
  if (publicExists) {
    return publicUrl;
  }

  // Return backend URL anyway (might work or show 404)
  return backendUrl;
};

/**
 * React hook for image URL with fallback
 * @param {string} imagePath - Relative image path
 * @param {string} fallbackUrl - Default fallback image
 * @returns {string} Resolved image URL
 */
export const useImageUrl = (imagePath, fallbackUrl = '') => {
  const [resolvedUrl, setResolvedUrl] = React.useState(fallbackUrl);

  React.useEffect(() => {
    if (!imagePath) {
      setResolvedUrl(fallbackUrl);
      return;
    }

    getImageUrlWithFallback(imagePath).then(url => {
      setResolvedUrl(url || fallbackUrl);
    });
  }, [imagePath, fallbackUrl]);

  return resolvedUrl;
};

// Default fallback images for different types
export const DEFAULT_IMAGES = {
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  cover: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=800',
  artwork: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400',
  post: 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400'
};

/**
 * Get artist avatar URL with fallbacks
 * @param {string} avatarPath - Avatar path from backend
 * @returns {string} Avatar URL with fallbacks
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return DEFAULT_IMAGES.avatar;
  return getImageUrl(avatarPath);
};

/**
 * Get artist cover URL with fallbacks  
 * @param {string} coverPath - Cover path from backend
 * @returns {string} Cover URL with fallbacks
 */
export const getCoverUrl = (coverPath) => {
  if (!coverPath) return DEFAULT_IMAGES.cover;
  return getImageUrl(coverPath);
};

/**
 * Get artwork image URL with fallbacks
 * @param {string} artworkPath - Artwork path from backend  
 * @returns {string} Artwork URL with fallbacks
 */
export const getArtworkUrl = (artworkPath) => {
  if (!artworkPath) return DEFAULT_IMAGES.artwork;
  return getImageUrl(artworkPath);
};
