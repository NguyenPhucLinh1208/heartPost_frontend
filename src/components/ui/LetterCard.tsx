"use client";

import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Lock, BookOpen, PenTool, Send, User, Clock } from "lucide-react";

export interface LetterCardProps {
  id: string;
  name: string;      // Tên hiển thị (Người gửi hoặc Người nhận)
  label?: string;    // Nhãn phụ (VD: "Gửi từ:", "Gửi đến:")
  subject: string;
  date: string;
  status: 'unread' | 'read' | 'draft' | 'sent' | 'scheduled';
  avatar?: string | null;
  onClick: () => void;
}

const LetterCard = ({ name, label = "Gửi từ:", subject, date, status, avatar, onClick }: LetterCardProps) => {
  
  // Cấu hình màu sắc & Icon Sáp niêm phong theo trạng thái
  const getSealStyle = () => {
    switch (status) {
      case 'unread': return { bg: 'bg-[#FF6B6B]', border: 'border-[#D14B3D]', icon: <Lock size={14} className="text-white opacity-90"/> };
      case 'read':   return { bg: 'bg-gray-200', border: 'border-gray-300', icon: <BookOpen size={14} className="text-gray-500 opacity-60"/> };
      case 'draft':  return { bg: 'bg-[#FCD34D]', border: 'border-[#D97706]', icon: <PenTool size={14} className="text-yellow-900 opacity-70"/> };
      case 'sent':   return { bg: 'bg-blue-400', border: 'border-blue-600', icon: <Send size={14} className="text-white opacity-90"/> };
      case 'scheduled': return { bg: 'bg-purple-400', border: 'border-purple-600', icon: <Clock size={14} className="text-white opacity-90"/> };
      default:       return { bg: 'bg-[#FF6B6B]', border: 'border-[#D14B3D]', icon: <Lock size={14} className="text-white"/> };
    }
  };

  const seal = getSealStyle();

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotate: -1, boxShadow: "8px 8px 0px #1C1C1C" }}
      whileTap={{ y: 0, rotate: 0, boxShadow: "0px 0px 0px #1C1C1C" }}
      className="relative w-full aspect-[1.6/1] bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer overflow-hidden group flex flex-col justify-between p-5 transition-all"
    >
      {/* SVG DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-[0.03]">
         <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
            <path d="M0,0 L150,110 L300,0" fill="none" stroke="black" strokeWidth="8" />
            <path d="M0,200 L150,110 L300,200" fill="none" stroke="black" strokeWidth="8" />
         </svg>
      </div>

      {/* HEADER: TEM & DẤU BƯU ĐIỆN */}
      <div className="flex justify-between items-start z-10 relative">
        <div className="transform -rotate-12 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full border-2 border-black border-dashed flex items-center justify-center p-1">
                <div className="text-[9px] font-bold text-center uppercase leading-tight text-black font-mono">
                    {format(new Date(date), "dd MMM")}<br/>
                    {format(new Date(date), "yyyy")}<br/>
                    HEARTPOST
                </div>
            </div>
            <div className="flex gap-1 mt-1 ml-2">
                <div className="h-0.5 w-8 bg-black"></div>
                <div className="h-0.5 w-6 bg-black"></div>
            </div>
        </div>

        <div className="relative transform rotate-6 shadow-sm group-hover:rotate-0 transition-transform duration-300">
             <div className="absolute inset-0 bg-white border-[3px] border-dotted border-gray-300 -m-1"></div>
             <div className="relative w-12 h-14 bg-blue-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                {avatar ? (
                     <img src={avatar} alt="stamp" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                     <User size={24} className="text-blue-300" />
                )}
                <div className="absolute bottom-0 right-0 text-[8px] font-bold text-black bg-white px-1">10đ</div>
             </div>
        </div>
      </div>

      {/* CENTER: SEAL */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
         <div className={`w-12 h-12 rounded-full border-4 ${seal.border} ${seal.bg} shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {seal.icon}
         </div>
      </div>

      {/* FOOTER: INFO */}
      <div className="mt-auto z-10 pl-2 pr-2">
        <div className="flex flex-col items-center text-center">
            <h3 className="text-xl md:text-2xl text-black leading-none mb-1" style={{ fontFamily: '"Dancing Script", cursive' }}>
                {label} {name}
            </h3>
            <div className="w-full border-b border-black/10 my-1"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate w-full">
                {subject}
            </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LetterCard;