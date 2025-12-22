// src/components/letter-designer/canvas/envelope/utils.ts

import * as THREE from 'three';
import { WORLD_W } from './constants';

// 1. TẠO HÌNH DÁNG PHONG BÌ (CẮT)
export function createShapeTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1,1) as any);

  const canvas = document.createElement('canvas');
  canvas.width = 1024; 
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);
  
  // Nền đen (phần bị cắt bỏ)
  ctx.fillStyle = '#000000'; 
  ctx.fillRect(0, 0, 1024, 1024);
  
  ctx.translate(512, 512);
  const scale = 1024 / WORLD_W; 
  ctx.scale(scale, -scale); 

  ctx.beginPath();
  // THÔNG SỐ CHÍNH XÁC TỪ MÃ NGUỒN CỦA BẠN
  const H = 3.2; 
  const W = 3.2; 
  const B = 2.2; 
  const BW = 1.0; 
  const R_TOP = 0.4; 

  // Vẽ hình dáng phong bì mở
  ctx.moveTo(-R_TOP, H - R_TOP); 
  ctx.quadraticCurveTo(0, H, R_TOP, H - R_TOP); 
  ctx.lineTo(W, 0); 
  ctx.lineTo(BW, -B); 
  ctx.lineTo(-BW, -B); 
  ctx.lineTo(-W, 0); 
  ctx.lineTo(-R_TOP, H - R_TOP); 
  
  // Phần giấy màu trắng (giữ lại)
  ctx.fillStyle = '#FFFFFF'; 
  ctx.fill();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

// 2. TẠO VÂN GIẤY (NOISE)
export function createPaperGrainTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1,1) as any);

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; 
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Nền trắng
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Tạo nhiễu hạt nhẹ
    const val = 230 + Math.random() * 25; 
    
    data[i] = val;     // R
    data[i+1] = val;   // G
    data[i+2] = val;   // B
    data[i+3] = 255;   // Alpha
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. TẠO TEXTURE CƠ BẢN CHO LÁ THƯ (A4 DỌC - KHÔNG DÒNG KẺ)
export function createLetterBaseTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new OffscreenCanvas(1,1) as any);

  const canvas = document.createElement('canvas');
  // Tỉ lệ 1:2 (Khổ dọc) - Chuẩn theo mã nguồn
  canvas.width = 512; 
  canvas.height = 1024; 
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Chỉ tô một màu nền trắng kem nhẹ nhàng
  ctx.fillStyle = '#ffffff'; 
  ctx.fillRect(0, 0, 512, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}