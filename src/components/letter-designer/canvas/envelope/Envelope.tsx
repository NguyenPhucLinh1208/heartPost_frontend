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
  // Callback mới: Báo về khi animation hoàn tất
  onAnimationComplete?: (isOpen: boolean) => void; 
}

export const Envelope: React.FC<EnvelopeProps> = ({ 
  color = '#ffffff',        
  innerColor = '#f4f4f4',   
  image = null,             
  isOpen = false,           
  speed = 1.0,
  onAnimationComplete
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const grainTexture = useMemo(() => createPaperGrainTexture(), []);
  const shapeTexture = useMemo(() => createShapeTexture(), []);
  
  const userTexture = useMemo(() => {
    if (!image) return null;
    const tex = new THREE.TextureLoader().load(image);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [image]);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uInnerColor: { value: new THREE.Color(innerColor) }, 
    uAlphaMap: { value: shapeTexture },
    uUserTexture: { value: null },
    uHasTexture: { value: false },
    uGrainMap: { value: grainTexture },
    uFoldTop: { value: 1.0 },    
    uFoldRight: { value: 1.0 },  
    uFoldLeft: { value: 1.0 },   
    uFoldBottom: { value: 1.0 }, 
  }), []); 

  const currentOpenRef = useRef(0);
  const lastReportedState = useRef<boolean | null>(null); // Tránh gọi callback liên tục

  useFrame((state, delta) => {
    const target = isOpen ? 1 : 0;
    // Tăng tốc độ nội suy để snap vào vị trí nhanh hơn ở đoạn cuối
    const step = delta * 3.0 * speed; 
    
    // Lerp giá trị
    currentOpenRef.current = THREE.MathUtils.lerp(currentOpenRef.current, target, step);

    // LOGIC CHECK HOÀN THÀNH (QUAN TRỌNG)
    // Nếu khoảng cách tới đích rất nhỏ (< 0.005) -> Coi như đã xong
    if (Math.abs(currentOpenRef.current - target) < 0.005) {
        currentOpenRef.current = target; // Snap thẳng vào giá trị đích (0 hoặc 1)
        
        // Chỉ gọi callback 1 lần khi trạng thái thay đổi
        if (lastReportedState.current !== isOpen) {
            lastReportedState.current = isOpen;
            if (onAnimationComplete) onAnimationComplete(isOpen);
        }
    }

    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uColor.value.set(color);
      u.uInnerColor.value.set(innerColor);
      u.uFoldTop.value = 1.0 - currentOpenRef.current;

      if (userTexture) {
        u.uUserTexture.value = userTexture;
        u.uHasTexture.value = true;
      } else {
        u.uHasTexture.value = false;
      }
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
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