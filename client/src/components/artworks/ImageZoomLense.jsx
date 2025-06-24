import { useRef, useState } from 'react';

const ImageZoomLens = ({ src, zoom = 2, lensSize = 150 }) => {
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');

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
      <img ref={imgRef} src={src} alt="Artwork" className="w-full object-cover rounded" />

      <div
        ref={lensRef}
        className="absolute pointer-events-none border-2 border-[#362625] rounded"
        style={{
          width: lensSize,
          height: lensSize,
          top: position.y,
          left: position.x,
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition,
        }}
      ></div>
    </div>
  );
};

export default ImageZoomLens;
