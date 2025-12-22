"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface NeoButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

const NeoButton = ({ children, className = "", variant = 'primary', ...props }: NeoButtonProps) => {
  
  // Base styles: Flex center, font bold, border dày 2px
  const baseStyles = "flex items-center justify-center gap-2 font-bold py-3 px-8 border-2 border-foreground transition-all";
  
  // STYLE MỚI:
  // - bg-accent: Màu đỏ gạch
  // - text-white: Chữ trắng nổi bật
  // - rounded-neo: Bo góc vừa phải (12px) -> Thay cho rounded-full
  const defaultClass = "bg-accent text-white rounded-neo shadow-neo";

  return (
    <motion.button
      // Hiệu ứng Hover: Nổi lên & Bóng đổ sâu hơn
      whileHover={{ 
        boxShadow: '6px 6px 0px #1C1C1C', 
        transform: 'translate(-2px, -2px)' 
      }}
      // Hiệu ứng Click: Lún xuống & Tắt bóng
      whileTap={{ 
        boxShadow: '0px 0px 0px #1C1C1C', 
        transform: 'translate(2px, 2px)' 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${defaultClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeoButton;