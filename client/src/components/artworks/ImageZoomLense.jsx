import { useRef, useState, useEffect } from 'react';

const ImageZoomLens = ({ src, zoom = 2, lensSize = 150, onError, ...imgProps }) => {
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  // Update imgSrc when src prop changes
  useEffect(() => {
    if (src !== imgSrc && !hasErrored) {
      setImgSrc(src);
      setHasErrored(false);
    }
  }, [src]);

  const handleImageError = (e) => {
    console.error('ImageZoomLens: Failed to load image:', src);
    if (!hasErrored) { // Only fallback once to prevent infinite loops
      setHasErrored(true);
      setImgSrc('https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg?auto=compress&cs=tinysrgb&w=400');
    }
    if (onError) {
      onError(e);
    }
  };

  const handleMouseMove = (e) => {
    const { top, left, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setPosition({ x: x - lensSize / 2, y: y - lensSize / 2 });
    setBackgroundPosition(`${xPercent}% ${yPercent}%`);
  };

  const handleMouseLeave = () => {
    setPosition({ x: -9999, y: -9999 });
  };

  return (
    <div className="relative inline-block" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <img
        ref={imgRef}
        src={imgSrc}
        alt="Artwork"
        className="w-full object-cover rounded"
        onError={handleImageError}
        {...imgProps}
      />

      <div
        ref={lensRef}
        className="absolute pointer-events-none border-2 border-[#362625] rounded"
        style={{
          width: lensSize,
          height: lensSize,
          top: position.y,
          left: position.x,
          backgroundImage: `url('${imgSrc}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition,
        }}
      ></div>
    </div>
  );
};

export default ImageZoomLens;