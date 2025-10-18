/**
 * Debug utility for image upload issues
 */

/**
 * Clear browser cache for specific image
 * @param {string} imageUrl - Image URL to clear from cache
 */
export const clearImageCache = (imageUrl) => {
    try {
        // Create multiple requests with different cache-busting parameters
        // This forces the browser to fetch fresh content
        const cacheBusters = [
            `?t=${Date.now()}`,
            `?refresh=${Math.random()}`,
            `?v=${Math.floor(Date.now() / 1000)}`,
            `?cb=${Date.now()}_${Math.random().toString(36).substring(7)}`
        ];

        // Create hidden image elements to force cache refresh
        cacheBusters.forEach((buster, index) => {
            setTimeout(() => {
                const img = new Image();
                img.onload = () => {
                    console.log(`🔄 Cache cleared for: ${imageUrl}${buster}`);
                };
                img.onerror = () => {
                    console.log(`⚠️ Cache clear attempt failed: ${imageUrl}${buster}`);
                };
                img.src = imageUrl + buster;
            }, index * 100); // Stagger requests
        });

        console.log(`🧹 Initiated cache clearing for: ${imageUrl}`);
    } catch (error) {
        console.error('❌ Error clearing image cache:', error);
    }
};

/**
 * Force reload all profile images
 * @param {object} profile - Profile object with avatar and coverImage
 */
export const forceReloadProfileImages = (profile) => {
    if (profile?.avatar) {
        clearImageCache(profile.avatar.split('?')[0]); // Remove existing query params
    }
    if (profile?.coverImage) {
        clearImageCache(profile.coverImage.split('?')[0]); // Remove existing query params
    }
};

export const debugImagePath = (originalPath, processedPath, imageType = 'unknown') => {
    console.group(`🔍 Debug Image Path - ${imageType}`);
    console.log('Original path from backend:', originalPath);
    console.log('Processed path for frontend:', processedPath);

    if (originalPath && originalPath.includes('uploads/profiles')) {
        console.log('✅ Path contains uploads/profiles - should work');
    } else if (originalPath) {
        console.log('⚠️ Path does not contain uploads/profiles - may need redirect');
    } else {
        console.log('❌ No path provided - will use default');
    }

    // Check if timestamp looks recent
    const timestampMatch = originalPath?.match(/_(\d{13})\./);
    if (timestampMatch) {
        const timestamp = parseInt(timestampMatch[1]);
        const now = Date.now();
        const age = now - timestamp;
        const ageMinutes = Math.floor(age / (1000 * 60));
        console.log(`⏰ Image age: ${ageMinutes} minutes old`);

        if (ageMinutes < 60) {
            console.log('🆕 Recent upload detected');
        } else {
            console.log('📅 Older upload');
        }
    }

    console.groupEnd();
};

export const logProfileUpdate = (type, response) => {
    console.group(`📤 ${type} Upload Response`);
    console.log('Server response:', response);
    if (response.imageUrl) {
        console.log('New image URL from server:', response.imageUrl);
    }
    console.groupEnd();
};
