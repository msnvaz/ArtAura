import { debugImagePath } from './debugImageUpload';

/**
 * Image URL utility with fallback support
 * Handles multiple image sources for development team sharing
 */

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Default images from public folder
export const DEFAULT_IMAGES = {
  avatar: '/art1.jpeg',
  cover: '/heritage.jpeg',
  artwork: '/art2.jpeg'
};

/**
 * Get image URL with fallback logic and cache busting
 * @param {string} imagePath - Relative image path from backend (e.g., "/uploads/profiles/image.jpg")
 * @param {boolean} bustCache - Whether to add cache busting parameter
 * @returns {string} Complete image URL
 */
export const getImageUrl = (imagePath, bustCache = false) => {
  if (!imagePath) return '';

  // If image path already starts with http, strip the domain to make it relative
  if (imagePath.startsWith('http')) {
    const url = new URL(imagePath);
    imagePath = url.pathname;
  }

  // Ensure we have a clean path that starts with /
  let cleanPath = imagePath;
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // For development, always serve images from the current frontend server (Vite dev server)
  // This ensures images stored in client/public/ are accessible
  let finalUrl = cleanPath;

  // Add cache busting for recent uploads or when explicitly requested
  if (bustCache) {
    // Use multiple cache busting parameters for better reliability
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    finalUrl += `?t=${timestamp}&r=${random}&v=${Math.floor(timestamp / 1000)}`;
  }

  return finalUrl;
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
 * Get image URL with smart fallback checking
 * @param {string} imagePath - Relative image path
 * @returns {Promise<string>} Resolved image URL
 */
export const getImageUrlWithFallback = async (imagePath) => {
  const publicUrl = getPublicImageUrl(imagePath);
  const backendUrl = `${API_URL}${imagePath}`;

  // Try frontend Vite server first (more reliable in development)
  const publicExists = await checkImageExists(publicUrl);
  if (publicExists) {
    return publicUrl;
  }

  // Fallback to backend server
  const backendExists = await checkImageExists(backendUrl);
  if (backendExists) {
    return backendUrl;
  }

  // If neither works, return frontend URL (Vite server is more reliable)
  return publicUrl;
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

    getImageUrlWithFallback(imagePath).then(setResolvedUrl);
  }, [imagePath, fallbackUrl]);

  return resolvedUrl;
};

/**
 * Get artist avatar URL with fallbacks and smart matching
 * @param {string} avatarPath - Avatar path from backend
 * @returns {string} Avatar URL with fallbacks
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    debugImagePath(avatarPath, DEFAULT_IMAGES.avatar, 'avatar');
    return DEFAULT_IMAGES.avatar;
  }

  // Handle legacy paths - if it's a profile image not in profiles subdirectory, redirect it
  if (avatarPath.includes('/uploads/profile_') && !avatarPath.includes('/uploads/profiles/')) {
    const filename = avatarPath.split('/').pop();
    const redirectedPath = `/uploads/profiles/${filename}`;
    debugImagePath(avatarPath, redirectedPath, 'avatar');
    return redirectedPath;
  }

  // For any path that exists, always trust the database and use cache busting for recent uploads

  // Check if this is a recent upload (based on timestamp in filename)
  const timestampMatch = avatarPath.match(/_(\d{13})\./);
  let shouldBustCache = false;

  if (timestampMatch) {
    const timestamp = parseInt(timestampMatch[1]);
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000); // 24 hours in milliseconds

    // If uploaded within the last day, use aggressive cache busting
    if (timestamp > oneDayAgo) {
      shouldBustCache = true;
    }
  }

  // Always use cache busting for profile images to ensure fresh content
  const processedUrl = getImageUrl(avatarPath, true); // Always bust cache for avatars
  debugImagePath(avatarPath, processedUrl, 'avatar');

  return processedUrl;
};

/**
 * Get artist cover URL with fallbacks and smart matching  
 * @param {string} coverPath - Cover path from backend
 * @returns {string} Cover URL with fallbacks
 */
export const getCoverUrl = (coverPath) => {
  if (!coverPath) {
    debugImagePath(coverPath, DEFAULT_IMAGES.cover, 'cover');
    return DEFAULT_IMAGES.cover;
  }

  // Handle legacy paths - if it's a cover image not in profiles subdirectory, redirect it
  if (coverPath.includes('/uploads/') && (coverPath.includes('cover') || coverPath.includes('bg')) && !coverPath.includes('/uploads/profiles/')) {
    const filename = coverPath.split('/').pop();
    const redirectedPath = `/uploads/profiles/${filename}`;
    debugImagePath(coverPath, redirectedPath, 'cover');
    return redirectedPath;
  }

  // For any path that exists, always trust the database and use cache busting for recent uploads

  // Check if this is a recent upload (based on timestamp in filename)
  const timestampMatch = coverPath.match(/_(\d{13})\./);
  if (timestampMatch) {
    const timestamp = parseInt(timestampMatch[1]);
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000); // 24 hours in milliseconds

    // If uploaded within the last day, trust the database path and bust cache
    if (timestamp > oneDayAgo) {
      const processedUrl = getImageUrl(coverPath, true); // Enable cache busting for recent uploads
      debugImagePath(coverPath, processedUrl, 'cover');
      return processedUrl;
    }
  }

  // Always use cache busting for cover images to ensure fresh content
  const processedUrl = getImageUrl(coverPath, true); // Always bust cache for covers
  debugImagePath(coverPath, processedUrl, 'cover');

  return processedUrl;
};

/**
 * Get artwork image URL with fallbacks
 * @param {string} artworkPath - Artwork path from backend  
 * @returns {string} Artwork URL with fallbacks
 */
export const getArtworkUrl = (artworkPath) => {
  if (!artworkPath) return DEFAULT_IMAGES.artwork;

  // Handle both old and new artwork paths

  // If it's an old path in root uploads but not in artworks subdirectory, keep it as is for backward compatibility
  if (artworkPath.includes('/uploads/') && !artworkPath.includes('/uploads/artworks/') && !artworkPath.includes('/uploads/profiles/')) {
    return getImageUrl(artworkPath, true); // Use cache busting for legacy paths too
  }

  // For new artworks in /uploads/artworks/, use cache busting
  return getImageUrl(artworkPath, true);
};
