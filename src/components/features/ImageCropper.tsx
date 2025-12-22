'use client';

import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Helper to get a cropped image Blob
function getCroppedImg(
    image: HTMLImageElement,
    crop: Crop, // crop is in pixels on the displayed image
    fileName: string
): Promise<File> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Canvas context is not available'));
    }

    // Scaling factor between the displayed image and the natural (original) image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // The canvas dimensions must be the crop size in *natural image pixels*
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    // Set high-quality rendering
    ctx.imageSmoothingQuality = 'high';

    // Source rectangle (from the natural image, in pixels)
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // Destination rectangle (on the new canvas)
    const destX = 0;
    const destY = 0;
    const destWidth = canvas.width;
    const destHeight = canvas.height;

    // Draw the high-resolution source image region onto the high-resolution canvas
    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                // Use PNG to avoid compression artifacts for the highest quality
                const file = new File([blob], fileName, { type: 'image/png' });
                resolve(file);
            },
            'image/png',
            1.0 // 1.0 means highest quality
        );
    });
}

interface ImageCropperProps {
    imageSrc: string;
    aspect: number;
    circularCrop?: boolean; // Add this prop
    onClose: () => void;
    onCropComplete: (croppedImage: File) => void;
}

const ImageCropper = ({ imageSrc, aspect, circularCrop, onClose, onCropComplete }: ImageCropperProps) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>();

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: 'px', // Use pixels from the start
                    width: width * 0.9, // Set initial crop to 90% of the displayed width
                },
                aspect,
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
    }

    const handleCrop = async () => {
        if (imgRef.current && crop?.width && crop?.height) {
            try {
                const croppedImage = await getCroppedImg(imgRef.current, crop, 'cropped-image.png');
                onCropComplete(croppedImage);
                onClose();
            } catch (e) {
                console.error('Error cropping image:', e);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-background border-2 border-foreground shadow-neo-lg w-full max-w-2xl p-6 rounded-lg">
                <h2 className="font-display font-extrabold text-2xl mb-4 text-center">Cắt ảnh</h2>
                <div className="bg-black/10 p-4 mb-4 flex justify-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(pixelCrop) => setCrop(pixelCrop)} // Directly use the pixelCrop value
                        aspect={aspect}
                        className="max-h-[60vh] mx-auto" // Added mx-auto for ReactCrop itself
                    >
                        <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Crop me" style={{ maxHeight: '60vh', display: 'block', margin: 'auto' }} />
                    </ReactCrop>
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="font-bold py-2 px-6 border-2 border-foreground hover:bg-gray-200 transition-colors">Hủy</button>
                    <button onClick={handleCrop} className="bg-accent text-background font-bold py-2 px-8 shadow-neo border-2 border-foreground hover:shadow-neo-lg hover:-translate-y-0.5 transition-all">
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
