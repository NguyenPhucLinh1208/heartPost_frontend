/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)'],
        display: ['var(--font-be-vietnam-pro)'],
      },
      colors: {
        'background': '#F4F1EA',
        'foreground': '#1C1C1C',
        // SỬA: Màu Đỏ Gạch (#FF6B6B) làm màu chủ đạo
        'accent': '#FF6B6B',     
        'accent-dark': '#E55A5A', 
      },
      boxShadow: {
        'neo': '4px 4px 0px #1C1C1C',
        'neo-sm': '2px 2px 0px #1C1C1C',
        'neo-hover': '5px 5px 0px #1C1C1C',
      },
      translate: {
        'neo': '-4px',
      },
      borderColor: {
        'DEFAULT': '#1C1C1C',
      },
      // THÊM: Độ bo góc "vừa phải" (12px) dùng chung cho Nút & Khung
      borderRadius: {
        'neo': '12px', 
      }
    },
  },
  plugins: [],
}