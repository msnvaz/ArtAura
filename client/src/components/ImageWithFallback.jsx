import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../util/imageUrlResolver';

/**
 * Image component with fallback handling and cache management
 * @param {string} src - Primary image source
 * @param {string} fallback - Fallback image source 
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @param {boolean} forceRefresh - Force refresh image from server
 * @param {Object} props - Other props
 */
const ImageWithFallback = ({ src, fallback, alt, className, forceRefresh = false, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src ? getImageUrl(src, forceRefresh) : fallback);
    const [hasError, setHasError] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Force refresh when src changes or forceRefresh is requested
    useEffect(() => {
        if (src) {
            const newSrc = forceRefresh ? getImageUrl(src, true) : getImageUrl(src);
            setImageSrc(newSrc);
            setHasError(false);

            if (forceRefresh) {
                setRefreshKey(prev => prev + 1);
            }
        } else {
            setImageSrc(fallback);
        }
    }, [src, fallback, forceRefresh]);

    const handleError = () => {
        console.log(`❌ Image failed to load: ${imageSrc}`);
        console.log(`📋 Original src prop: ${src}`);
        console.log(`📋 Fallback: ${fallback}`);
        if (!hasError && fallback && imageSrc !== fallback) {
            console.log(`🔄 Falling back to: ${fallback}`);
            setImageSrc(fallback);
            setHasError(true);
        }
    };

    const handleLoad = () => {
        console.log(`✅ Image loaded successfully: ${imageSrc}`);
        console.log(`📊 Image dimensions: ${imageSrc}`);
    };

    return (
        <img
            key={refreshKey} // Force re-render when refresh is needed
            src={imageSrc}
            alt={alt}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
            {...props}
        />
    );
};

export default ImageWithFallback;
