import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { letterVertexShader, letterFragmentShader } from './shaders';
import { createLetterBaseTexture, createPaperGrainTexture } from './utils';

interface LetterProps {
  color?: string;           
  paperTexture?: string | null;   
  contentTexture?: string | null; 
  isOpen?: boolean;         
  speed?: number;
  // Callback báo trạng thái
  onAnimationComplete?: (isOpen: boolean) => void;
}

export const Letter: React.FC<LetterProps> = ({ 
  color = '#ffffff', 
  paperTexture = null, 
  contentTexture = null, 
  isOpen = false, 
  speed = 1.0,
  onAnimationComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const baseTexture = useMemo(() => createLetterBaseTexture(), []);
  
  const userPaperTex = useMemo(() => {
    if (!paperTexture) return null;
    const tex = new THREE.TextureLoader().load(paperTexture);
    tex.colorSpace = THREE.SRGBColorSpace; 
    return tex;
  }, [paperTexture]);

  const userContentTex = useMemo(() => {
    if (!contentTexture) return null;
    const tex = new THREE.TextureLoader().load(contentTexture);
    tex.colorSpace = THREE.SRGBColorSpace; 
    return tex;
  }, [contentTexture]);

  const grainTexture = useMemo(() => createPaperGrainTexture(), []);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uPaperMap: { value: baseTexture }, 
    uHasPaperMap: { value: false },
    uContentMap: { value: baseTexture },
    uHasContentMap: { value: false },
    uGrainMap: { value: grainTexture },
    uUnfold: { value: 0.0 },
  }), []); 

  const currentProgressRef = useRef(0);
  const lastReportedState = useRef<boolean | null>(null);

  const POS_INSIDE_Z = 0.01; 
  const POS_OUTSIDE_Z = 1.5; 
  const POS_START_Y = 1.0;   
  const POS_PEAK_Y = 3.1;    
  const POS_CENTER_Y = 0.5;  

  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      const target = isOpen ? 1 : 0;
      const step = delta * 1.0 * speed;
      
      currentProgressRef.current = THREE.MathUtils.lerp(currentProgressRef.current, target, step);
      
      // LOGIC CHECK HOÀN THÀNH
      if (Math.abs(currentProgressRef.current - target) < 0.005) {
        currentProgressRef.current = target;
        if (lastReportedState.current !== isOpen) {
            lastReportedState.current = isOpen;
            if (onAnimationComplete) onAnimationComplete(isOpen);
        }
      }

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

      const u = materialRef.current.uniforms;
      u.uUnfold.value = phase3; 
      u.uColor.value.set(color);

      if (userPaperTex) {
        u.uPaperMap.value = userPaperTex;
        u.uHasPaperMap.value = true;
      } else {
        u.uHasPaperMap.value = false;
      }

      if (userContentTex) {
        u.uContentMap.value = userContentTex;
        u.uHasContentMap.value = true;
      } else {
        u.uHasContentMap.value = false;
      }
    }
  });

  const LETTER_W = 7.0 * 0.55; 
  const LETTER_H = 4.0;         

  return (
    <mesh ref={meshRef} position={[0, 0, POS_INSIDE_Z]}>
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