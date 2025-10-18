import React, { useState, useEffect } from 'react';
import { getImageUrl, getPublicImageUrl, DEFAULT_IMAGES } from '../../util/imageUrlResolver';

/**
 * Smart Image component with automatic fallback handling
 * Tries multiple image sources in order of preference
 */
const SmartImage = ({
  src,
  alt,
  className = '',
  fallbackType = 'artwork', // 'avatar', 'cover', 'artwork', 'post'
  onError,
  onLoad,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Image source priority order
  const getImageSources = (imagePath) => {
    if (!imagePath) return [DEFAULT_IMAGES[fallbackType]];

    const sources = [];

    // If already a complete URL, use it
    if (imagePath.startsWith('http')) {
      sources.push(imagePath);
    } else {
      // Try backend first, then public folder, then default
      sources.push(getImageUrl(imagePath, false)); // Backend
      sources.push(getPublicImageUrl(imagePath));   // Public folder
    }

    // Add default fallback
    sources.push(DEFAULT_IMAGES[fallbackType]);

    return sources;
  };

  const [imageSources] = useState(() => getImageSources(src));
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  // Reset when src changes
  useEffect(() => {
    const newSources = getImageSources(src);
    setCurrentSrc(newSources[0] || DEFAULT_IMAGES[fallbackType]);
    setCurrentSourceIndex(0);
    setLoading(true);
    setError(false);
  }, [src, fallbackType]);

  // Handle image load error - try next source
  const handleImageError = (e) => {
    setError(true);
    setLoading(false);

    // Try next image source
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < imageSources.length) {
      setCurrentSourceIndex(nextIndex);
      setCurrentSrc(imageSources[nextIndex]);
      setLoading(true);
      setError(false);
    } else {
      // All sources failed, use default
      setCurrentSrc(DEFAULT_IMAGES[fallbackType]);
    }

    if (onError) {
      onError(e);
    }
  };

  // Handle successful image load
  const handleImageLoad = (e) => {
    setLoading(false);
    setError(false);

    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={`relative ${loading ? 'animate-pulse bg-gray-200' : ''}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />

      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
};

export default SmartImage;
