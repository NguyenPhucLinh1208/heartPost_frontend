'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; 
import { Canvas, useThree } from '@react-three/fiber'; 
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import { ChevronLeft, Upload, Camera, X, Palette, Layout, Type } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

import { Envelope } from '@/components/letter-designer/canvas/envelope/Envelope';
import { Letter } from '@/components/letter-designer/canvas/envelope/Letter';
import { AssetStore } from '@/components/letter-designer/AssetStore';
import { AssetItem } from '@/components/letter-designer/assets';

// --- TYPE ---
interface DesignState {
  color: string;
  innerColor?: string;
  texture: string | null;         // Mẫu giấy/Phong bì (Texture nền)
  contentTexture?: string | null; // Nội dung thư (Chữ/Ảnh dán lên mặt trước)
  name: string;
}

// --- BACKGROUND COMPONENT ---
const SceneBackground = ({ color, texture }: { color: string; texture: string | null }) => {
  const { scene } = useThree();
  useEffect(() => {
    if (texture) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "Anonymous";
      loader.load(texture, (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = loadedTexture;
        scene.backgroundBlurriness = 0.05; 
      });
    } else {
      scene.background = new THREE.Color(color);
    }
  }, [color, texture, scene]);
  return null;
};

// --- NEO COMPONENT ---
const NeoSectionTitle = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-2 mb-3 border-b-2 border-black pb-1">
    <Icon size={16} className="text-black" />
    <span className="text-xs font-black tracking-widest uppercase text-black">{label}</span>
  </div>
);

export default function ComposePage() {
  const router = useRouter(); 
  
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // State dữ liệu
  const [envelopeData, setEnvelopeData] = useState<DesignState>({ 
    color: '#ffffff', 
    innerColor: '#f4f4f4', 
    texture: null, 
    name: 'Mặc định' 
  });
  
  const [letterData, setLetterData] = useState<DesignState>({ 
    color: '#fdf4e3', 
    texture: null,          // Texture giấy (áp dụng 2 mặt)
    contentTexture: null,   // Nội dung thư (áp dụng 1 mặt)
    name: 'Mặc định' 
  });
  
  const [bgData, setBgData] = useState<DesignState>({ 
    color: '#E0E7FF', 
    texture: null, 
    name: 'Mặc định' 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleStoreSelect = (type: 'envelope' | 'paper' | 'background', item: AssetItem) => {
    if (type === 'envelope') {
        // FIX: Giữ nguyên innerColor khi chọn mẫu mới
        setEnvelopeData(prev => ({ 
            ...prev, 
            color: item.color || '#ffffff', 
            texture: item.thumb || null, 
            name: item.name,
            // innerColor: prev.innerColor (Tự động giữ nguyên do spread ...prev)
        }));
    } else if (type === 'paper') {
        // FIX: Chỉ cập nhật texture giấy, giữ nguyên nội dung (contentTexture)
        setLetterData(prev => ({ 
            ...prev,
            color: item.color || '#ffffff', 
            texture: item.thumb || null, 
            name: item.name 
        }));
    } else if (type === 'background') {
        setBgData({ 
            color: item.color || '#111111', 
            texture: item.thumb || null, 
            name: item.name 
        });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'content' | 'envelope' | 'letter' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const result = ev.target?.result as string;
        
        if (type === 'content') {
            // FIX: Upload nội dung -> Lưu vào contentTexture
            setLetterData(prev => ({ 
                ...prev, 
                contentTexture: result, 
                // name: 'Nội dung (Upload)' // Có thể cập nhật tên hoặc giữ nguyên tên giấy
            }));
            if (!isLidOpen) setIsLidOpen(true);
            setTimeout(() => {
                if (!isLetterOpen) setIsLetterOpen(true);
            }, 500);
        } else if (type === 'envelope') {
            setEnvelopeData(prev => ({ ...prev, texture: result, name: 'Ảnh Custom' }));
        } else if (type === 'letter') {
            // Upload mẫu giấy -> Lưu vào texture
            setLetterData(prev => ({ ...prev, texture: result, name: 'Giấy Custom' }));
        } else if (type === 'background') {
            setBgData(prev => ({ ...prev, texture: result, name: 'Nền Custom' }));
        }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!isLidOpen) setIsLetterOpen(false);
  }, [isLidOpen]);

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-white font-sans text-black overflow-hidden">
      
      <AssetStore 
        isOpen={isStoreOpen} 
        onClose={() => setIsStoreOpen(false)}
        onSelect={handleStoreSelect}
      />

      {/* --- CANVAS 3D --- */}
      <div className="flex-1 relative bg-gray-100">
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 2]} shadows>
          <SceneBackground color={bgData.color} texture={bgData.texture} />
          
          <ambientLight intensity={1.5} /> 
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, 5]} intensity={0.8} />

          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group>
              <Envelope 
                color={envelopeData.color} 
                innerColor={envelopeData.innerColor} 
                image={envelopeData.texture} 
                isOpen={isLidOpen} 
                speed={speed} 
              />
              {/* FIX: Truyền cả 2 loại texture vào Letter */}
              <Letter 
                color={letterData.color} 
                paperTexture={letterData.texture} 
                contentTexture={letterData.contentTexture}
                isOpen={isLetterOpen} 
                speed={speed} 
              />
            </group>
          </Float>
          
          <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </Canvas>

        {/* NÚT BACK */}
        <button 
            onClick={() => router.push('/inbox')} 
            className="absolute top-4 left-4 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all rounded-md z-50"
        >
            <ChevronLeft size={24} />
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <div className="w-[320px] bg-white border-l-4 border-black flex flex-col p-5 gap-4 overflow-y-auto shadow-[-10px_0px_20px_rgba(0,0,0,0.05)]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-black tracking-tighter uppercase italic">HeartPost<span className="text-blue-600">.3D</span></h2>
          <button 
            onClick={() => setIsStoreOpen(true)}
            className="px-3 py-1 bg-[#A3E635] text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all rounded-sm uppercase"
          >
            Cửa Hàng
          </button>
        </div>
        <div className="h-0.5 bg-black w-full opacity-10"></div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-2">
          <NeoSectionTitle icon={Layout} label="Trạng thái" />
          <div className="flex gap-2">
            <button 
                onClick={() => setIsLidOpen(!isLidOpen)}
                className={`flex-1 py-2 text-xs font-bold border-2 border-black rounded-md transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5
                    ${isLidOpen ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            >
              {isLidOpen ? "Đóng Nắp" : "Mở Nắp"}
            </button>
            <button 
                onClick={() => setIsLetterOpen(!isLetterOpen)}
                disabled={!isLidOpen}
                className={`flex-1 py-2 text-xs font-bold border-2 border-black rounded-md transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5
                    ${isLetterOpen ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}
                    ${!isLidOpen && 'opacity-50 cursor-not-allowed shadow-none'}`}
            >
              {isLetterOpen ? "Cất Thư" : "Xem Thư"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <NeoSectionTitle icon={Palette} label="Thiết kế" />
          
          <DesignItem 
            label="Phong Bì" subLabel={envelopeData.name} color={envelopeData.color} texture={envelopeData.texture}
            onColorChange={(c) => setEnvelopeData(p => ({...p, color: c}))}
            onClearTexture={() => setEnvelopeData(p => ({...p, texture: null, name: 'Màu Tùy Chỉnh'}))}
            onUpload={(e) => handleFileUpload(e, 'envelope')}
            extraColor={envelopeData.innerColor} onExtraColorChange={(c) => setEnvelopeData(p => ({...p, innerColor: c}))} extraLabel="Trong" inputId="env-up"
          />
          
          <DesignItem 
            label="Giấy Thư" subLabel={letterData.name} color={letterData.color} texture={letterData.texture}
            onColorChange={(c) => setLetterData(p => ({...p, color: c}))}
            onClearTexture={() => setLetterData(p => ({...p, texture: null, name: 'Màu Tùy Chỉnh'}))}
            onUpload={(e) => handleFileUpload(e, 'letter')} 
            inputId="let-up"
          />
          
          <DesignItem 
            label="Phông Nền" subLabel={bgData.name} color={bgData.color} texture={bgData.texture}
            onColorChange={(c) => setBgData(p => ({...p, color: c, texture: null}))}
            onClearTexture={() => setBgData(p => ({...p, texture: null, name: 'Màu Tùy Chỉnh'}))}
            onUpload={(e) => handleFileUpload(e, 'background')}
            inputId="bg-up"
          />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <NeoSectionTitle icon={Type} label="Nội dung thư" />
          <div className="flex gap-2">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-50 active:shadow-none active:translate-y-0.5 transition-all"
             >
                <Upload size={16} />
                <span className="text-xs font-bold">Tải Ảnh</span>
             </button>
             <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'content')} />

             <button 
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-50 active:shadow-none active:translate-y-0.5 transition-all"
             >
                <Camera size={16} />
                <span className="text-xs font-bold">Chụp Ảnh</span>
             </button>
             <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'content')} />
          </div>
          
          {/* Hiển thị trạng thái/nút xóa nội dung */}
          <div className="flex justify-between items-center px-1">
             <p className="text-[10px] text-gray-500 italic">Nội dung sẽ dán lên mặt trước.</p>
             {letterData.contentTexture && (
                 <button onClick={() => setLetterData(p => ({...p, contentTexture: null}))} className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer">Xóa nội dung</button>
             )}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button className="w-full py-4 bg-[#FF6B6B] border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <span className="text-white font-black uppercase tracking-wider text-sm">Gửi Thư Ngay</span>
            <span className="text-white">🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---
interface DesignItemProps {
  label: string; subLabel: string; color: string; texture: string | null;
  onColorChange: (color: string) => void; onClearTexture: () => void; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string; extraColor?: string; onExtraColorChange?: (color: string) => void; extraLabel?: string;
}

const DesignItem = ({ label, subLabel, color, texture, onColorChange, onClearTexture, onUpload, inputId, extraColor, onExtraColorChange, extraLabel }: DesignItemProps) => {
    return (
        <div className="bg-white border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded border-2 border-black flex-shrink-0 bg-cover bg-center" style={{ background: texture ? `url(${texture}) center/cover` : color }} />
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-bold text-black">{label}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{subLabel}</div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <div className="flex items-center gap-1">
                                <div className="relative w-6 h-6 overflow-hidden rounded border border-black cursor-pointer shadow-sm hover:scale-110 transition-transform">
                                    <input type="color" className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0" value={color} onChange={(e) => onColorChange(e.target.value)} />
                                </div>
                                {texture ? (
                                    <button onClick={onClearTexture} className="w-6 h-6 flex items-center justify-center bg-red-100 border border-black rounded hover:bg-red-200 text-red-600"><X size={12} strokeWidth={3} /></button>
                                ) : (
                                    <>
                                        <label htmlFor={inputId} className="w-6 h-6 flex items-center justify-center bg-gray-100 border border-black rounded cursor-pointer hover:bg-gray-200"><Upload size={12} className="text-black" /></label>
                                        <input type="file" id={inputId} className="hidden" onChange={onUpload} />
                                    </>
                                )}
                            </div>
                            {extraColor && onExtraColorChange && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase mr-1">{extraLabel}</span>
                                    <div className="relative w-6 h-6 overflow-hidden rounded border border-black cursor-pointer shadow-sm hover:scale-110 transition-transform">
                                        <input type="color" className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0" value={extraColor} onChange={(e) => onExtraColorChange(e.target.value)} />
                                    </div>
                                    <div className="w-6 h-6"></div> 
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}