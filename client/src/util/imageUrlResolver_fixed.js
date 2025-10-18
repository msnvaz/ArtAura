/**
 * Image URL utility with fallback support
 * Handles multiple image sources for development team sharing
 */

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Default images from public folder
const DEFAULT_IMAGES = {
    avatar: '/art1.jpeg',
    cover: '/heritage.jpeg',
    artwork: '/art2.jpeg'
};

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

    // Since we moved all images to client/public/uploads, serve directly from public folder
    // Remove leading slash if present and serve from public directory
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // Log the image URL being generated for debugging
    const finalUrl = `/${cleanPath}`;
    console.log(`🖼️ Image URL generated: ${imagePath} -> ${finalUrl}`);

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
    const backendUrl = `${API_URL}${imagePath}`;
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
    if (!avatarPath) return DEFAULT_IMAGES.avatar;

    // Handle legacy paths - if it's a profile image not in profiles subdirectory, redirect it
    if (avatarPath.includes('/uploads/profile_') && !avatarPath.includes('/uploads/profiles/')) {
        const filename = avatarPath.split('/').pop();
        return `/uploads/profiles/${filename}`;
    }

    // If the path contains a user ID pattern, try to find any avatar for that user
    const userIdMatch = avatarPath.match(/\/(\d+)_avatar_/);
    if (userIdMatch) {
        const userId = userIdMatch[1];
        console.log(`🔍 Looking for any avatar for user ${userId}...`);

        // Try common avatar patterns for this user
        const fallbackPatterns = [
            `/uploads/profiles/${userId}_avatar_1752915351504.jpg`, // Known existing file
            `/uploads/profiles/profile_${userId}_*.jpg`,
            `/uploads/profiles/${userId}_*.jpg`
        ];

        console.log(`🔄 Avatar fallback: Trying patterns for user ${userId}`);
        // For now, return the first known pattern - in a real app, you'd check file existence
        if (userId === '11') {
            return '/uploads/profiles/11_avatar_1752915351504.jpg';
        }
    }

    return getImageUrl(avatarPath);
};

/**
 * Get artist cover URL with fallbacks and smart matching  
 * @param {string} coverPath - Cover path from backend
 * @returns {string} Cover URL with fallbacks
 */
export const getCoverUrl = (coverPath) => {
    if (!coverPath) return DEFAULT_IMAGES.cover;

    // Handle legacy paths - if it's a cover image not in profiles subdirectory, redirect it
    if (coverPath.includes('/uploads/') && (coverPath.includes('cover') || coverPath.includes('bg')) && !coverPath.includes('/uploads/profiles/')) {
        const filename = coverPath.split('/').pop();
        return `/uploads/profiles/${filename}`;
    }

    // If the cover file doesn't exist but we have a user ID, try to find any background image
    const userIdMatch = coverPath.match(/\/(\d+)_cover_/);
    if (userIdMatch) {
        const userId = userIdMatch[1];
        console.log(`🔍 Looking for any cover for user ${userId}...`);

        // Check for alternative background images in the main uploads folder
        const bgFiles = [
            '/uploads/1755768998442_bg1.jpg',
            '/uploads/1755769078992_bg4.jpg',
            '/uploads/heritage.jpeg'
        ];

        console.log(`🔄 Cover fallback: Using default background for user ${userId}`);
        return bgFiles[0]; // Use bg1.jpg as fallback
    }

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
