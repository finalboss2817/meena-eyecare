
import React, { useState, useEffect, useRef } from 'react';
import { productService } from '../../services/productService';
import { virtualTryOnService } from '../../services/virtualTryOnService';
import type { Product, TryOnState } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Icon } from '../../components/Icon';

interface VirtualTryOnPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export const VirtualTryOnPage: React.FC<VirtualTryOnPageProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tryOnState, setTryOnState] = useState<TryOnState>(virtualTryOnService.getState());
  const [isDragging, setIsDragging] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [processedFrameUrl, setProcessedFrameUrl] = useState<string | null>(null);
  
  const dragStartPos = useRef({ x: 0, y: 0 });
  const frameStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const p = await productService.getProductById(productId);
      setProduct(p || null);
      if (p) setProcessedFrameUrl(p.image_url);
      setIsLoading(false);
    };
    fetchProduct();
  }, [productId]);
  
  useEffect(() => {
    virtualTryOnService.saveState(tryOnState);
  }, [tryOnState]);

  // Advanced UX: Remove white background from product image using Canvas
  useEffect(() => {
    if (!product) return;

    if (removeBackground) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = product.image_url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Iterate through pixels
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // If pixel is very light (near white), make it transparent
                if (r > 240 && g > 240 && b > 240) {
                    data[i + 3] = 0; // Set Alpha to 0
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            setProcessedFrameUrl(canvas.toDataURL());
        };
    } else {
        setProcessedFrameUrl(product.image_url);
    }
  }, [removeBackground, product]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setTryOnState(prev => ({ ...prev, userImage: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    frameStartPos.current = { x: tryOnState.frameX, y: tryOnState.frameY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    // Convert pixel delta to percentage delta
    const { width, height } = containerRef.current.getBoundingClientRect();
    const dxPercent = (dx / width) * 100;
    const dyPercent = (dy / height) * 100;

    setTryOnState(prev => ({
      ...prev,
      frameX: frameStartPos.current.x + dxPercent,
      frameY: frameStartPos.current.y + dyPercent,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleReset = () => {
    const shouldClear = window.confirm("This will remove your uploaded photo and reset the frame position. Are you sure?");
    if(shouldClear) {
        virtualTryOnService.clearState();
        setTryOnState(virtualTryOnService.getState());
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <button onClick={() => onNavigate(`user/product/${productId}`)} className="flex items-center text-primary mb-6 hover:underline font-semibold">
        <Icon name="chevron-left" className="w-5 h-5 mr-1" />
        Back to Product Details
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Virtual Try-On</h1>
        <p className="text-gray-600">You are trying on: <span className="font-bold text-primary">{product.name}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative bg-gray-200 rounded-lg shadow-lg overflow-hidden select-none" 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {tryOnState.userImage ? (
            <>
              <img src={tryOnState.userImage} alt="User" className="w-full h-full object-cover pointer-events-none" />
              {processedFrameUrl && (
                <img 
                    src={processedFrameUrl} 
                    alt="Frame"
                    className={`absolute transition-transform duration-75 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{
                    left: `${tryOnState.frameX}%`,
                    top: `${tryOnState.frameY}%`,
                    transform: `translate(-50%, -50%) scale(${tryOnState.frameScale}) rotate(${tryOnState.frameRotation}deg)`,
                    width: `${25 * tryOnState.frameScale}%`
                    }}
                    onMouseDown={handleMouseDown}
                    draggable={false}
                />
              )}
            </>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-center p-8">
                <Icon name="user" className="w-24 h-24 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">Upload Your Photo</h2>
                <p className="text-gray-500 mb-6">For the best results, use a well-lit, front-facing portrait.</p>
                <label className="bg-primary text-white font-bold py-3 px-6 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-3">Controls</h2>
          <div className="space-y-6">
             
             <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={removeBackground} 
                        onChange={(e) => setRemoveBackground(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
                    />
                    <span className="text-sm font-semibold text-gray-800">Remove Frame Background</span>
                </label>
                <p className="text-xs text-gray-600 mt-1 ml-8">Check this if the frame has a white box around it to make it transparent.</p>
             </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Resize Frame</label>
                <input type="range" min="0.5" max="2.5" step="0.05" value={tryOnState.frameScale} onChange={e => setTryOnState(p => ({...p, frameScale: parseFloat(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Rotate Frame</label>
                <div className="flex items-center space-x-4 mt-2">
                    <button onClick={() => setTryOnState(p => ({...p, frameRotation: p.frameRotation - 5}))} className="btn-secondary w-full text-sm">Rotate Left</button>
                    <button onClick={() => setTryOnState(p => ({...p, frameRotation: p.frameRotation + 5}))} className="btn-secondary w-full text-sm">Rotate Right</button>
                </div>
            </div>
             <div className="border-t pt-4">
                 <button onClick={handleReset} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Reset & Change Photo
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};