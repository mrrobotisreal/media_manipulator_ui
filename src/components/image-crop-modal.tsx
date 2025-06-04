import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Crop } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropSave: (cropArea: CropArea) => void;
  initialCrop?: CropArea;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropSave,
  initialCrop,
}) => {
  const [cropArea, setCropArea] = useState<CropArea>(
    initialCrop || { x: 0, y: 0, width: 200, height: 200 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && imageRef.current) {
      const img = imageRef.current;
      const updateSizes = () => {
        setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageDisplaySize({ width: img.clientWidth, height: img.clientHeight });

        // Initialize crop area to center of image if no initial crop
        if (!initialCrop) {
          const centerX = (img.clientWidth - 200) / 2;
          const centerY = (img.clientHeight - 200) / 2;
          setCropArea({
            x: Math.max(0, centerX),
            y: Math.max(0, centerY),
            width: Math.min(200, img.clientWidth),
            height: Math.min(200, img.clientHeight),
          });
        }
      };

      if (img.complete) {
        updateSizes();
      } else {
        img.onload = updateSizes;
      }
    }
  }, [isOpen, imageUrl, initialCrop]);

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left - (action === 'drag' ? cropArea.x : 0),
      y: e.clientY - rect.top - (action === 'drag' ? cropArea.y : 0),
    });

    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  }, [cropArea]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || (!isDragging && !isResizing)) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const newX = Math.max(0, Math.min(mouseX - dragStart.x, imageDisplaySize.width - cropArea.width));
      const newY = Math.max(0, Math.min(mouseY - dragStart.y, imageDisplaySize.height - cropArea.height));

      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (isResizing) {
      const newWidth = Math.max(50, Math.min(mouseX - cropArea.x, imageDisplaySize.width - cropArea.x));
      const newHeight = Math.max(50, Math.min(mouseY - cropArea.y, imageDisplaySize.height - cropArea.y));

      setCropArea(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    }
  }, [isDragging, isResizing, dragStart, cropArea, imageDisplaySize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleSaveCrop = () => {
    // Convert display coordinates to natural image coordinates
    const scaleX = imageNaturalSize.width / imageDisplaySize.width;
    const scaleY = imageNaturalSize.height / imageDisplaySize.height;

    const naturalCropArea = {
      x: Math.round(cropArea.x * scaleX),
      y: Math.round(cropArea.y * scaleY),
      width: Math.round(cropArea.width * scaleX),
      height: Math.round(cropArea.height * scaleY),
    };

    onCropSave(naturalCropArea);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Crop Image
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Drag the crop area to position it, or drag the bottom-right corner to resize.
            The darker area will be removed.
          </div>

          <div
            ref={containerRef}
            className="relative inline-block cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-full max-h-96 block"
              draggable={false}
            />

            {/* Overlay with crop area */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlay for non-cropped areas */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                style={{
                  clipPath: `polygon(
                    0% 0%,
                    0% 100%,
                    ${(cropArea.x / imageDisplaySize.width) * 100}% 100%,
                    ${(cropArea.x / imageDisplaySize.width) * 100}% ${(cropArea.y / imageDisplaySize.height) * 100}%,
                    ${((cropArea.x + cropArea.width) / imageDisplaySize.width) * 100}% ${(cropArea.y / imageDisplaySize.height) * 100}%,
                    ${((cropArea.x + cropArea.width) / imageDisplaySize.width) * 100}% ${((cropArea.y + cropArea.height) / imageDisplaySize.height) * 100}%,
                    ${(cropArea.x / imageDisplaySize.width) * 100}% ${((cropArea.y + cropArea.height) / imageDisplaySize.height) * 100}%,
                    ${(cropArea.x / imageDisplaySize.width) * 100}% 100%,
                    100% 100%,
                    100% 0%
                  )`
                }}
              />

              {/* Crop area border */}
              <div
                className="absolute border-2 border-dashed border-white pointer-events-auto cursor-move"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                {/* Resize handle */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-white border border-gray-300 cursor-se-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Crop area: {cropArea.width} × {cropArea.height} pixels
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;