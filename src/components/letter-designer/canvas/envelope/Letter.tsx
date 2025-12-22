// src/components/letter-designer/canvas/envelope/Letter.tsx

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { WORLD_W } from './constants';
import { letterVertexShader, letterFragmentShader } from './shaders';
import { createLetterBaseTexture, createPaperGrainTexture } from './utils';

interface LetterProps {
  color?: string;       // Màu giấy
  image?: string | null; // Texture giấy hoặc ảnh nội dung
  isOpen?: boolean;     // Trạng thái bay ra
  speed?: number;
}

export const Letter: React.FC<LetterProps> = ({ 
  color = '#ffffff', 
  image = null, 
  isOpen = false, 
  speed = 1.0 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. Texture nền mặc định (Giấy trắng)
  // Dùng useMemo để chỉ tạo 1 lần
  const baseTexture = useMemo(() => createLetterBaseTexture(), []);
  
  // 2. Texture người dùng (Ảnh upload hoặc chọn từ store)
  // FIX: Thêm xử lý colorSpace để màu sắc hiển thị đúng chuẩn
  const userTexture = useMemo(() => {
    if (!image) return null;
    const tex = new THREE.TextureLoader().load(image);
    tex.colorSpace = THREE.SRGBColorSpace; 
    return tex;
  }, [image]);

  // 3. Texture vân giấy
  const grainTexture = useMemo(() => createPaperGrainTexture(), []);

  // 4. Uniforms
  // FIX: Chỉ khởi tạo 1 lần, giá trị sẽ được cập nhật liên tục trong useFrame
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uMap: { value: baseTexture },
    uHasMap: { value: true },
    uGrainMap: { value: grainTexture },
    uUnfold: { value: 0.0 },
    uRoughness: { value: 0.6 }
  }), []); // Empty deps để giữ object reference ổn định

  const currentProgressRef = useRef(0);

  // --- CẤU HÌNH VỊ TRÍ ANIMATION (Giữ nguyên thông số chuẩn của bạn) ---
  const POS_INSIDE_Z = 0.01; 
  const POS_OUTSIDE_Z = 1.5; 
  const POS_START_Y = 1.0;   
  const POS_PEAK_Y = 3.1;    
  const POS_CENTER_Y = 0.5;  

  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // --- PHẦN 1: ANIMATION ---
      const target = isOpen ? 1 : 0;
      const step = delta * 0.8 * speed; 
      currentProgressRef.current = THREE.MathUtils.lerp(currentProgressRef.current, target, step);
      
      const p = currentProgressRef.current;
      const phase1 = THREE.MathUtils.smoothstep(p, 0.0, 0.4);
      const phase2 = THREE.MathUtils.smoothstep(p, 0.4, 0.75);
      const phase3 = THREE.MathUtils.smoothstep(p, 0.7, 1.0);

      let currentY = POS_START_Y;
      if (p <= 0.4) {
        currentY = THREE.MathUtils.lerp(POS_START_Y, POS_PEAK_Y, phase1);
      } else {
        currentY = THREE.MathUtils.lerp(POS_PEAK_Y, POS_CENTER_Y, phase2);
      }
      meshRef.current.position.y = currentY;
      
      const currentZ = THREE.MathUtils.lerp(POS_INSIDE_Z, POS_OUTSIDE_Z, phase2);
      meshRef.current.position.z = currentZ;

      meshRef.current.rotation.x = phase2 * -0.1;

      // --- PHẦN 2: CẬP NHẬT UNIFORMS (FIX LOGIC MÀU & TEXTURE) ---
      const u = materialRef.current.uniforms;
      
      // Update trạng thái mở giấy
      u.uUnfold.value = phase3; 
      
      // FIX: Update màu giấy Real-time
      u.uColor.value.set(color);

      // FIX: Logic ưu tiên User Texture -> Base Texture
      if (userTexture) {
        u.uMap.value = userTexture;
        u.uHasMap.value = true;
      } else {
        u.uMap.value = baseTexture; // Quay về giấy trắng nếu không có ảnh
        u.uHasMap.value = true;
      }
    }
  });

  const LETTER_W = WORLD_W * 0.55; 
  const LETTER_H = 4.0;         

  return (
    <mesh ref={meshRef} position={[0, 0, POS_INSIDE_Z]}>
      {/* Giữ nguyên lưới 32x64 để nếp gấp mượt */}
      <planeGeometry args={[LETTER_W, LETTER_H, 32, 64]} />
      
      <shaderMaterial 
        ref={materialRef}
        vertexShader={letterVertexShader}
        fragmentShader={letterFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};