// src/components/letter-designer/canvas/envelope/Envelope.tsx

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { WORLD_W } from './constants';
const WORLD_H = 7.0; 

import { vertexShader, fragmentShader } from './shaders';
import { createShapeTexture, createPaperGrainTexture } from './utils';

interface EnvelopeProps {
  color?: string;
  innerColor?: string;
  image?: string | null;
  isOpen?: boolean;
  speed?: number;
}

export const Envelope: React.FC<EnvelopeProps> = ({ 
  color = '#ffffff',        
  innerColor = '#f4f4f4',   
  image = null,             
  isOpen = false,           
  speed = 1.0 
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // 1. CHUẨN BỊ TEXTURES
  const grainTexture = useMemo(() => createPaperGrainTexture(), []);
  const shapeTexture = useMemo(() => createShapeTexture(), []);
  
  // Xử lý Texture người dùng:
  // Nếu image = null, trả về null.
  // Nếu image có giá trị, tạo loader.
  const userTexture = useMemo(() => {
    if (!image) return null;
    const tex = new THREE.TextureLoader().load(image);
    tex.colorSpace = THREE.SRGBColorSpace; // Đảm bảo màu sắc chuẩn
    return tex;
  }, [image]);

  // 2. KHỞI TẠO UNIFORMS
  // Chỉ khởi tạo 1 lần duy nhất, giá trị sẽ được update trong useFrame
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uInnerColor: { value: new THREE.Color(innerColor) }, 
    uAlphaMap: { value: shapeTexture },
    uUserTexture: { value: null }, // Mặc định null
    uHasTexture: { value: false },
    uGrainMap: { value: grainTexture },
    
    // Các biến điều khiển nắp gấp
    uFoldTop: { value: 1.0 },    
    uFoldRight: { value: 1.0 },  
    uFoldLeft: { value: 1.0 },   
    uFoldBottom: { value: 1.0 }, 
  }), []); // Empty deps để giữ reference object không đổi

  const currentOpenRef = useRef(0);

  // 3. VÒNG LẶP RENDER
  useFrame((state, delta) => {
    const target = isOpen ? 1 : 0;
    const step = delta * 2.0 * speed;
    currentOpenRef.current = THREE.MathUtils.lerp(currentOpenRef.current, target, step);
    
    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      
      // Update màu sắc (Real-time)
      u.uColor.value.set(color);
      u.uInnerColor.value.set(innerColor);
      
      // Update góc mở
      u.uFoldTop.value = 1.0 - currentOpenRef.current;

      // Update Texture
      if (userTexture) {
        u.uUserTexture.value = userTexture;
        u.uHasTexture.value = true;
      } else {
        u.uHasTexture.value = false;
        // Có thể set uUserTexture.value = null nếu muốn chắc chắn, nhưng uHasTexture là đủ
      }
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      {/* Lưới 128x128 để đảm bảo đường gấp cong mịn màng */}
      <planeGeometry args={[WORLD_W, WORLD_H, 128, 128]} />
      
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide} 
        transparent={true}      
      />
    </mesh>
  );
};