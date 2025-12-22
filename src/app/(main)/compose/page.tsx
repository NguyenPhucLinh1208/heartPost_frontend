'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; 
import { Canvas, useThree } from '@react-three/fiber'; 
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';

import { Envelope } from '@/components/letter-designer/canvas/envelope/Envelope';
import { Letter } from '@/components/letter-designer/canvas/envelope/Letter';
import { AssetStore } from '@/components/letter-designer/AssetStore';
import { AssetItem } from '@/components/letter-designer/assets';

// --- TYPE ---
interface DesignState {
  color: string;
  innerColor?: string;
  texture: string | null;
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

export default function ComposePage() {
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
    texture: null, 
    name: 'Mặc định' 
  });
  
  const [bgData, setBgData] = useState<DesignState>({ 
    color: '#111111', 
    texture: null, 
    name: 'Tối Giản' 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleStoreSelect = (type: 'envelope' | 'paper' | 'background', item: AssetItem) => {
    if (type === 'envelope') {
        setEnvelopeData(prev => ({ 
            ...prev, 
            color: item.color || '#ffffff', 
            texture: item.thumb || null, 
            name: item.name,
            // FIX: Reset màu mặt trong khi chọn mẫu mới để tránh lệch tông
            innerColor: '#f4f4f4' 
        }));
    } else if (type === 'paper') {
        setLetterData({ 
            color: item.color || '#ffffff', 
            texture: item.thumb || null, 
            name: item.name 
        });
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
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        // Logic upload giữ nguyên
        if (type === 'content') setLetterData(prev => ({ ...prev, texture: result, name: 'Nội dung (Ảnh)' }));
        else if (type === 'envelope') setEnvelopeData(prev => ({ ...prev, texture: result, name: 'Ảnh Custom' }));
        else if (type === 'letter') setLetterData(prev => ({ ...prev, texture: result, name: 'Ảnh Custom' }));
        else if (type === 'background') setBgData(prev => ({ ...prev, texture: result, name: 'Ảnh Custom' }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isLidOpen) setIsLetterOpen(false);
  }, [isLidOpen]);

  return (
    <div style={styles.container}>
      
      <AssetStore 
        isOpen={isStoreOpen} 
        onClose={() => setIsStoreOpen(false)}
        onSelect={handleStoreSelect}
      />

      <div style={styles.canvasArea}>
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
              <Letter 
                color={letterData.color} 
                image={letterData.texture} 
                isOpen={isLetterOpen} 
                speed={speed} 
              />
            </group>
          </Float>
          
          <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </Canvas>
      </div>

      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        
        <div style={styles.header}>
          <h2 style={styles.logo}>HEARTPOST</h2>
          <button style={styles.btnOutline} onClick={() => setIsStoreOpen(true)}>Cửa Hàng</button>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <label style={styles.label}>TRẠNG THÁI</label>
          <div style={styles.row}>
            <button style={isLidOpen ? styles.btnActive : styles.btn} onClick={() => setIsLidOpen(!isLidOpen)}>
              {isLidOpen ? "Đóng Nắp" : "Mở Nắp"}
            </button>
            <button style={isLetterOpen ? styles.btnActive : styles.btn} onClick={() => setIsLetterOpen(!isLetterOpen)} disabled={!isLidOpen}>
              {isLetterOpen ? "Cất Thư" : "Xem Thư"}
            </button>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <label style={styles.label}>THIẾT KẾ</label>
          
          {/* --- Item: Phong Bì --- */}
          <div style={styles.listItem}>
             <div style={styles.itemLeft}>
                <div style={{
                  ...styles.thumb, 
                  background: envelopeData.texture ? `url(${envelopeData.texture}) center/cover` : envelopeData.color
                }}></div>
                <div style={styles.itemText}>
                    <div style={styles.itemName}>Phong Bì</div>
                    <div style={styles.itemDesc}>{envelopeData.name}</div>
                </div>
             </div>
             
             <div style={styles.controlsRight}>
                <div style={styles.controlRow}>
                    <span style={styles.controlLabel}>Ngoài</span>
                    <input 
                        type="color" 
                        style={styles.colorPicker} 
                        value={envelopeData.color} 
                        // FIX: KHÔNG reset texture về null khi chỉnh màu => Cho phép tint màu
                        onChange={e => setEnvelopeData(prev => ({...prev, color: e.target.value}))}
                    />
                    
                    {/* FIX: Logic nút Up/Xóa */}
                    {envelopeData.texture ? (
                        <button style={styles.btnIconRed} onClick={() => setEnvelopeData(prev => ({...prev, texture: null, name: 'Màu Tùy Chỉnh'}))}>✕</button>
                    ) : (
                        <>
                           <label htmlFor="envelope-upload" style={styles.btnIcon}>Up</label>
                           <input type="file" id="envelope-upload" style={{display:'none'}} onChange={(e) => handleFileUpload(e, 'envelope')}/>
                        </>
                    )}
                </div>
                
                <div style={styles.controlRow}>
                    <span style={styles.controlLabel}>Trong</span>
                    <input 
                        type="color" 
                        style={styles.colorPicker} 
                        value={envelopeData.innerColor || '#f4f4f4'} 
                        onChange={e => setEnvelopeData(prev => ({...prev, innerColor: e.target.value}))}
                    />
                    <div style={styles.btnPlaceholder}></div>
                </div>
             </div>
          </div>

          {/* --- Item: Giấy Thư --- */}
          <div style={styles.listItem}>
             <div style={styles.itemLeft}>
                <div style={{
                  ...styles.thumb, 
                  background: letterData.texture ? `url(${letterData.texture}) center/cover` : letterData.color
                }}></div>
                <div style={styles.itemText}>
                    <div style={styles.itemName}>Giấy Thư</div>
                    <div style={styles.itemDesc}>{letterData.name}</div>
                </div>
             </div>
             
             <div style={styles.controlsRight}>
                 <div style={styles.controlRow}>
                    <span style={styles.controlLabel}>Giấy</span>
                    <input 
                        type="color" 
                        style={styles.colorPicker} 
                        value={letterData.color} 
                        // FIX: Cho phép tint màu giấy
                        onChange={e => setLetterData(prev => ({...prev, color: e.target.value}))}
                    />
                    {letterData.texture ? (
                         <button style={styles.btnIconRed} onClick={() => setLetterData(prev => ({...prev, texture: null, name: 'Màu Tùy Chỉnh'}))}>✕</button>
                    ) : (
                        <>
                           <label htmlFor="letter-upload" style={styles.btnIcon}>Up</label>
                           <input type="file" id="letter-upload" style={{display:'none'}} onChange={(e) => handleFileUpload(e, 'letter')}/>
                        </>
                    )}
                 </div>
                 <div style={{height: '24px'}}></div> 
             </div>
          </div>

          {/* --- Item: Phông Nền --- */}
          <div style={styles.listItem}>
             <div style={styles.itemLeft}>
                <div style={{
                  ...styles.thumb, 
                  background: bgData.texture ? `url(${bgData.texture}) center/cover` : bgData.color
                }}></div>
                <div style={styles.itemText}>
                    <div style={styles.itemName}>Phông Nền</div>
                    <div style={styles.itemDesc}>{bgData.name}</div>
                </div>
             </div>

             <div style={styles.controlsRight}>
                 <div style={styles.controlRow}>
                    <span style={styles.controlLabel}>Nền</span>
                    <input 
                        type="color" 
                        style={styles.colorPicker} 
                        value={bgData.color} 
                        onChange={e => setBgData(prev => ({...prev, color: e.target.value, texture: null}))}
                    />
                     {bgData.texture ? (
                         <button style={styles.btnIconRed} onClick={() => setBgData(prev => ({...prev, texture: null, name: 'Màu Tùy Chỉnh'}))}>✕</button>
                    ) : (
                        <>
                           <label htmlFor="bg-upload" style={styles.btnIcon}>Up</label>
                           <input type="file" id="bg-upload" style={{display:'none'}} onChange={(e) => handleFileUpload(e, 'background')}/>
                        </>
                    )}
                 </div>
                 <div style={{height: '24px'}}></div>
             </div>
          </div>

        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <label style={styles.label}>NỘI DUNG</label>
          <div style={styles.row}>
             <button style={styles.btn} onClick={() => fileInputRef.current?.click()}>Upload Ảnh</button>
             <input type="file" accept="image/*" ref={fileInputRef} style={{display: 'none'}} onChange={(e) => handleFileUpload(e, 'content')} />

             <button style={styles.btn} onClick={() => cameraInputRef.current?.click()}>Chụp Ảnh</button>
             <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{display: 'none'}} onChange={(e) => handleFileUpload(e, 'content')} />
          </div>
          <p style={styles.hint}>Hỗ trợ ảnh JPG, PNG hoặc chụp trực tiếp.</p>
        </div>

        <div style={styles.footer}>
          <button style={styles.btnPrimary}>XUẤT ẢNH PNG / GỬI THƯ</button>
        </div>

      </div>
    </div>
  );
}

// --- CSS STYLES ---
const styles: Record<string, React.CSSProperties> = {
  container: { 
    display: 'flex', height: '100vh', width: '100vw', background: '#000', color: '#eee', 
    fontFamily: 'sans-serif', overflow: 'hidden',
    position: 'fixed', top: 0, left: 0, zIndex: 50, 
  },
  canvasArea: { flex: 1, position: 'relative' },
  sidebar: { 
    width: '300px', background: '#1c1c1c', borderLeft: '1px solid #333', 
    display: 'flex', flexDirection: 'column', padding: '20px', gap: '15px', 
    zIndex: 10, boxSizing: 'border-box' 
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '16px', fontWeight: 'bold', margin: 0, letterSpacing: '1px', color: '#fff' },
  btnOutline: { 
    background: 'transparent', border: '1px solid #555', color: '#ccc', 
    padding: '6px 12px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase' 
  },
  divider: { height: '1px', background: '#333', width: '100%' },
  section: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '10px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' },
  row: { display: 'flex', gap: '10px' },
  btn: { 
    flex: 1, background: '#2a2a2a', border: '1px solid #333', color: '#ccc', 
    padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', 
    transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' 
  },
  btnActive: { 
    flex: 1, background: '#eee', border: '1px solid #fff', color: '#000', 
    padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  btnPrimary: { 
    width: '100%', background: '#3b82f6', border: 'none', color: '#fff', 
    padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' 
  },
  listItem: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
    padding: '10px', background: '#252525', borderRadius: '6px', border: '1px solid #333' 
  },
  itemLeft: { display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }, 
  thumb: { width: '36px', height: '36px', borderRadius: '4px', border: '1px solid #444', flexShrink: 0 },
  itemText: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  itemName: { fontSize: '12px', color: '#fff', fontWeight: '500' },
  itemDesc: { fontSize: '10px', color: '#888', marginTop: '2px' },
  controlsRight: { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' },
  controlRow: { display: 'flex', alignItems: 'center', gap: '6px', height: '24px' },
  controlLabel: { fontSize: '10px', color: '#666', textAlign: 'right', width: '35px', whiteSpace: 'nowrap' }, 
  colorPicker: { 
    width: '24px', height: '24px', padding: 0, border: '1px solid #444', 
    borderRadius: '3px', background: 'none', cursor: 'pointer' 
  },
  btnIcon: { 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor:'pointer', fontSize: '9px', color: '#ccc', 
    border: '1px solid #444', background: '#333',
    padding: '0', borderRadius: '3px', 
    height: '24px', width: '30px', 
    transition: 'background 0.2s'
  },
  // Nút xóa màu đỏ
  btnIconRed: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor:'pointer', fontSize: '10px', color: '#ff6b6b', 
    border: '1px solid #444', background: '#2a1a1a',
    padding: '0', borderRadius: '3px', 
    height: '24px', width: '30px', 
  },
  btnPlaceholder: { width: '30px', height: '24px', border: '1px solid transparent' },
  hint: { fontSize: '10px', color: '#555', margin: 0, fontStyle: 'italic' },
  footer: { marginTop: 'auto' }
};