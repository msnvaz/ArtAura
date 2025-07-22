import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import { X, RotateCw, Save, RefreshCw, Crop, Sliders } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';
import '../../styles/ImageEditor.css';

const ImageEditorModal = ({ isOpen, onClose, imageFile, onSave }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [rotation, setRotation] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [aspectRatio, setAspectRatio] = useState();
    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('crop');

    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    // Initialize the crop when image loads
    const onImageLoad = useCallback((e) => {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
        console.log('Image loaded:', { width, height, naturalWidth, naturalHeight });

        // Set a default crop if none exists
        if (!crop) {
            const defaultCrop = centerCrop(
                makeAspectCrop(
                    {
                        unit: '%',
                        width: 80,
                    },
                    aspectRatio,
                    width,
                    height
                ),
                width,
                height
            );
            console.log('Setting default crop:', defaultCrop);
            setCrop(defaultCrop);
            setCompletedCrop(convertToPixelCrop(defaultCrop, naturalWidth, naturalHeight));
        }
    }, [aspectRatio, crop]);

    // Handle crop change
    const onCropChange = useCallback((_, percentCrop) => {
        setCrop(percentCrop);
    }, []);

    const onCropComplete = useCallback((c) => {
        console.log('Crop completed:', c);
        setCompletedCrop(c);
    }, []);

    // Create preview image with all adjustments
    const generatePreview = useCallback(() => {
        if (!imgRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = imgRef.current;

        if (!ctx || !image || !image.complete || image.naturalWidth === 0) return;

        // Get crop dimensions or use full image
        const cropPixels = completedCrop ? convertToPixelCrop(
            completedCrop,
            image.naturalWidth,
            image.naturalHeight
        ) : {
            x: 0,
            y: 0,
            width: image.naturalWidth,
            height: image.naturalHeight
        };

        // Set canvas dimensions to match crop
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

        // Handle rotation - rotate around center of canvas
        if (rotation !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // Draw the cropped image
        ctx.drawImage(
            image,
            cropPixels.x,
            cropPixels.y,
            cropPixels.width,
            cropPixels.height,
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Restore context state
        ctx.restore();

        // Convert to blob and create preview URL
        canvas.toBlob((blob) => {
            if (blob) {
                // Clean up previous preview URL
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }
                const previewUrl = URL.createObjectURL(blob);
                setImagePreview(previewUrl);
            }
        }, 'image/jpeg', 0.95);
    }, [completedCrop, rotation, brightness, contrast, saturation, imagePreview]);

    // Save the edited image
    const handleSave = useCallback(async () => {
        console.log('Save button clicked');

        if (!imgRef.current || !imageFile) {
            console.error('Missing image reference or file');
            return;
        }

        const image = imgRef.current;

        // Wait for image to be fully loaded
        if (!image.complete || image.naturalWidth === 0) {
            console.error('Image not loaded properly');
            return;
        }

        console.log('Image details:', {
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight
        });

        try {
            // Create a new canvas for the final output
            const outputCanvas = document.createElement('canvas');
            const outputCtx = outputCanvas.getContext('2d');

            if (!outputCtx) {
                console.error('Could not get canvas context');
                return;
            }

            // Get crop dimensions or use full image
            let cropPixels;
            if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
                cropPixels = convertToPixelCrop(
                    completedCrop,
                    image.naturalWidth,
                    image.naturalHeight
                );
                console.log('Using crop:', cropPixels);
            } else {
                // If no crop, use the full image
                cropPixels = {
                    x: 0,
                    y: 0,
                    width: image.naturalWidth,
                    height: image.naturalHeight
                };
                console.log('Using full image:', cropPixels);
            }

            // Validate crop dimensions
            if (cropPixels.width <= 0 || cropPixels.height <= 0) {
                console.error('Invalid crop dimensions:', cropPixels);
                return;
            }

            // Handle rotation - adjust canvas dimensions
            let canvasWidth = cropPixels.width;
            let canvasHeight = cropPixels.height;

            if (rotation === 90 || rotation === 270) {
                canvasWidth = cropPixels.height;
                canvasHeight = cropPixels.width;
            }

            outputCanvas.width = canvasWidth;
            outputCanvas.height = canvasHeight;

            console.log('Canvas dimensions:', { canvasWidth, canvasHeight, rotation });

            // Clear and prepare canvas
            outputCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            outputCtx.save();

            // Apply filters
            outputCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            console.log('Applied filters:', { brightness, contrast, saturation });

            // Handle rotation
            if (rotation !== 0) {
                outputCtx.translate(canvasWidth / 2, canvasHeight / 2);
                outputCtx.rotate((rotation * Math.PI) / 180);

                if (rotation === 90 || rotation === 270) {
                    outputCtx.translate(-cropPixels.height / 2, -cropPixels.width / 2);
                } else {
                    outputCtx.translate(-cropPixels.width / 2, -cropPixels.height / 2);
                }
            }

            // Draw the final image
            outputCtx.drawImage(
                image,
                cropPixels.x,
                cropPixels.y,
                cropPixels.width,
                cropPixels.height,
                0,
                0,
                cropPixels.width,
                cropPixels.height
            );

            outputCtx.restore();

            // Convert to blob and save
            outputCanvas.toBlob((blob) => {
                if (blob && blob.size > 0) {
                    console.log('Generated blob:', blob.size, 'bytes');

                    // Create a new File object with the original filename
                    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
                    const editedFileName = imageFile.name.replace(/\.[^/.]+$/, `_edited.${fileExtension}`);

                    const editedFile = new File([blob], editedFileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    console.log('Saving edited image:', editedFile.name, editedFile.size);
                    onSave(editedFile);
                } else {
                    console.error('Failed to create blob from canvas or blob is empty');
                }
            }, 'image/jpeg', 0.95);

        } catch (error) {
            console.error('Error in handleSave:', error);
        }
    }, [imageFile, completedCrop, rotation, brightness, contrast, saturation, onSave]);

    // Simple fallback save function
    const handleSimpleSave = useCallback(() => {
        console.log('Simple save - using original file');
        onSave(imageFile);
        onClose();
    }, [imageFile, onSave, onClose]);

    // Reset all adjustments
    const handleReset = () => {
        setRotation(0);
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setAspectRatio(undefined);
        setImagePreview(null);
    };

    // Rotate image
    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    React.useEffect(() => {
        // Add a small delay to ensure the image has loaded
        const timer = setTimeout(() => {
            if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
                if (completedCrop || rotation !== 0 || brightness !== 100 || contrast !== 100 || saturation !== 100) {
                    generatePreview();
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [generatePreview, completedCrop, rotation, brightness, contrast, saturation]);

    // Clean up preview URL on unmount
    React.useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (!isOpen || !imageFile) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-[#7f5539] flex items-center">
                        <Crop className="mr-2" size={20} />
                        Edit Image
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab('crop')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'crop'
                                    ? 'bg-[#7f5539] text-white'
                                    : 'bg-white text-[#7f5539] hover:bg-[#7f5539]/10'
                                }`}
                        >
                            <Crop className="inline mr-2" size={16} />
                            Crop
                        </button>
                        <button
                            onClick={() => setActiveTab('adjust')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'adjust'
                                    ? 'bg-[#7f5539] text-white'
                                    : 'bg-white text-[#7f5539] hover:bg-[#7f5539]/10'
                                }`}
                        >
                            <Sliders className="inline mr-2" size={16} />
                            Adjust
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleRotate}
                            className="p-2 bg-white text-[#7f5539] rounded-lg hover:bg-[#7f5539]/10 transition-colors"
                            title="Rotate 90°"
                        >
                            <RotateCw size={16} />
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-3 py-2 bg-white text-[#7f5539] rounded-lg hover:bg-[#7f5539]/10 transition-colors font-medium"
                            title="Reset all changes"
                        >
                            <RefreshCw className="inline mr-1" size={16} />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Image Editor */}
                    <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-gray-100">
                        <div className="relative max-w-full max-h-full">
                            {activeTab === 'crop' ? (
                                <ReactCrop
                                    crop={crop}
                                    onChange={onCropChange}
                                    onComplete={onCropComplete}
                                    aspect={aspectRatio}
                                    minWidth={50}
                                    minHeight={50}
                                >
                                    <img
                                        ref={imgRef}
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Crop preview"
                                        onLoad={onImageLoad}
                                        crossOrigin="anonymous"
                                        className="max-w-full max-h-[60vh] object-contain"
                                        style={{
                                            transform: `rotate(${rotation}deg)`,
                                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                                        }}
                                    />
                                </ReactCrop>
                            ) : (
                                <img
                                    ref={imgRef}
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Adjust preview"
                                    onLoad={onImageLoad}
                                    crossOrigin="anonymous"
                                    className="max-w-full max-h-[60vh] object-contain"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div className="w-80 p-4 bg-white border-l border-gray-200 overflow-y-auto">
                        {activeTab === 'crop' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Crop Settings</h3>

                                {/* Aspect Ratio Presets */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                setAspectRatio(undefined);
                                                setCrop(undefined);
                                            }}
                                            className={`p-2 text-sm rounded border transition-colors ${!aspectRatio
                                                    ? 'border-[#7f5539] bg-[#7f5539]/10 text-[#7f5539]'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            Free
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAspectRatio(1);
                                                if (imgRef.current) {
                                                    const { width, height } = imgRef.current;
                                                    setCrop(centerCrop(
                                                        makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
                                                        width,
                                                        height
                                                    ));
                                                }
                                            }}
                                            className={`p-2 text-sm rounded border transition-colors ${aspectRatio === 1
                                                    ? 'border-[#7f5539] bg-[#7f5539]/10 text-[#7f5539]'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            1:1 Square
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAspectRatio(4 / 3);
                                                if (imgRef.current) {
                                                    const { width, height } = imgRef.current;
                                                    setCrop(centerCrop(
                                                        makeAspectCrop({ unit: '%', width: 80 }, 4 / 3, width, height),
                                                        width,
                                                        height
                                                    ));
                                                }
                                            }}
                                            className={`p-2 text-sm rounded border transition-colors ${aspectRatio === 4 / 3
                                                    ? 'border-[#7f5539] bg-[#7f5539]/10 text-[#7f5539]'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            4:3
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAspectRatio(16 / 9);
                                                if (imgRef.current) {
                                                    const { width, height } = imgRef.current;
                                                    setCrop(centerCrop(
                                                        makeAspectCrop({ unit: '%', width: 80 }, 16 / 9, width, height),
                                                        width,
                                                        height
                                                    ));
                                                }
                                            }}
                                            className={`p-2 text-sm rounded border transition-colors ${aspectRatio === 16 / 9
                                                    ? 'border-[#7f5539] bg-[#7f5539]/10 text-[#7f5539]'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            16:9
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'adjust' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Adjustments</h3>

                                {/* Brightness */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">Brightness</label>
                                        <span className="text-sm text-gray-500">{brightness}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>

                                {/* Contrast */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">Contrast</label>
                                        <span className="text-sm text-gray-500">{contrast}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={contrast}
                                        onChange={(e) => setContrast(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>

                                {/* Saturation */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">Saturation</label>
                                        <span className="text-sm text-gray-500">{saturation}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={saturation}
                                        onChange={(e) => setSaturation(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>

                                {/* Rotation Display */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">Rotation</label>
                                        <span className="text-sm text-gray-500">{rotation}°</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setRotation(prev => (prev - 90 + 360) % 360)}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            Rotate Left
                                        </button>
                                        <button
                                            onClick={() => setRotation(prev => (prev + 90) % 360)}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            Rotate Right
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview */}
                        {imagePreview && (
                            <div className="mt-6 space-y-2">
                                <h4 className="text-sm font-medium text-gray-700">Preview</h4>
                                <div className="border border-gray-200 rounded-lg p-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSimpleSave}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center space-x-2"
                    >
                        <Save size={16} />
                        <span>Save Original</span>
                    </button>
                    <button
                        onClick={() => {
                            console.log('Save button clicked - calling handleSave');
                            handleSave().then(() => {
                                console.log('Save completed, closing modal');
                                onClose();
                            }).catch((error) => {
                                console.error('Save failed:', error);
                                // Fallback to simple save
                                handleSimpleSave();
                            });
                        }}
                        className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2"
                    >
                        <Save size={16} />
                        <span>Save Changes</span>
                    </button>
                </div>

                {/* Hidden Canvas for Processing */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default ImageEditorModal;
