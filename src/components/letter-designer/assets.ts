// src/components/letter-designer/assets.ts

// Định nghĩa Interface cho TypeScript
export interface AssetItem {
  id: string;
  name: string;
  thumb: string; // Đường dẫn ảnh texture/thumbnail
  color: string; // Màu dự phòng hoặc màu chủ đạo
}

export interface AssetsCollection {
  envelopes: AssetItem[];
  papers: AssetItem[];
  backgrounds: AssetItem[];
}

// ĐƯỜNG DẪN GỐC (Trỏ vào thư mục public của Next.js)
const PATH_ENV = '/textures/envelopes/';
const PATH_PAPER = '/textures/papers/';
const PATH_BG = '/textures/backgrounds/';

export const ASSETS: AssetsCollection = {
  // 1. DANH SÁCH PHONG BÌ
  envelopes: [
    { 
      id: 'env_01', 
      name: 'Giấy Kraft Cổ Điển', 
      thumb: `${PATH_ENV}envelope_01.jpeg`, 
      color: '#ffffff' // Màu nâu giấy
    },
    { 
      id: 'env_02', 
      name: 'Họa Tiết Xanh', 
      thumb: `${PATH_ENV}envelope_02.jpeg`, 
      color: '#ffffff' 
    },
    { 
      id: 'env_03', 
      name: 'Giấy Nghệ Thuật', 
      thumb: `${PATH_ENV}envelope_03.jpeg`, 
      color: '#ffffff' 
    },
        { 
      id: 'env_04', 
      name: 'Hoa đen', 
      thumb: `${PATH_ENV}envelope_04.jpeg`, 
      color: '#ffffff' 
    },
    { 
      id: 'env_05', 
      name: 'Giấy hồng sẫm', 
      thumb: `${PATH_ENV}envelope_05.jpeg`, 
      color: '#ffffff' 
    },
  ],
  
  // 2. DANH SÁCH GIẤY VIẾT THƯ
  papers: [
    { 
      id: 'paper_01', 
      name: 'Giấy Tự Nhiên', 
      thumb: `${PATH_PAPER}paper_01.png`, 
      color: '#ffffff' 
    },
    { 
      id: 'paper_02', 
      name: 'Giấy Kẻ Ngang', 
      thumb: `${PATH_PAPER}paper_02.png`, 
      color: '#ffffff' 
    },
    { 
      id: 'paper_03', 
      name: 'Giấy Hoa Văn', 
      thumb: `${PATH_PAPER}paper_03.jpg`, 
      color: '#ffffff' 
    },
  ],

  // 3. DANH SÁCH HÌNH NỀN (BACKGROUND 3D)
  backgrounds: [
    { 
      id: 'bg_wood', 
      name: 'Bàn Gỗ', 
      thumb: `${PATH_BG}background_01.jpeg`, 
      color: '#ffffff' 
    },
    { 
      id: 'bg_simple', 
      name: 'Tối Giản', 
      thumb: `${PATH_BG}background_02.jpeg`, // Không có ảnh, dùng màu
      color: '#ffffff' 
    },
    { 
      id: 'bg_dark', 
      name: 'Bóng Đêm', 
      thumb: `${PATH_BG}background_03.jpeg`,
      color: '#ffffff' 
    },
  ]
};