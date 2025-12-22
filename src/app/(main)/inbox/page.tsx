"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  Search, Filter, Lock, BookOpen, PenTool, User, 
  Mail, ChevronRight 
} from "lucide-react";

// --- MOCK DATA (Dữ liệu giả lập) ---
const MOCK_LETTERS = [
  {
    id: "1",
    sender: "Nguyễn Văn A",
    subject: "Thư mời sinh nhật",
    preview: "Chào bạn, nhớ đến dự tiệc nhé...",
    date: new Date().toISOString(),
    status: "unread",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  },
  {
    id: "2",
    sender: "Trần Thị B",
    subject: "Cảm ơn cậu nhiều",
    preview: "Món quà thật tuyệt vời...",
    date: "2023-11-20T10:00:00Z",
    status: "read",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
  },
  {
    id: "3",
    sender: "HeartPost Team",
    subject: "Cập nhật tính năng mới",
    preview: "Chúng tôi vừa ra mắt giao diện 3D...",
    date: "2023-12-01T08:30:00Z",
    status: "unread",
    avatar: null // Không có avatar
  },
  {
    id: "4",
    sender: "Bản thân tôi",
    subject: "Gửi tôi của tương lai",
    preview: "Hy vọng lúc này mày đã giàu...",
    date: "2024-01-01T00:00:00Z",
    status: "draft",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Self"
  },
  {
    id: "5",
    sender: "Lê Văn C",
    subject: "Họp lớp cấp 3",
    preview: "Đã 10 năm rồi nhỉ...",
    date: "2023-10-15T14:20:00Z",
    status: "read",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
];

// --- SUB-COMPONENT: LETTER CARD (PHONG BÌ) ---
interface LetterCardProps {
  id: string;
  sender: string;
  subject: string;
  date: string;
  status: string;
  avatar?: string | null;
  onClick: () => void;
}

const LetterCard = ({ id, sender, subject, date, status, avatar, onClick }: LetterCardProps) => {
  
  // Màu sắc sáp niêm phong theo trạng thái
  const getSealStyle = () => {
    switch (status) {
      case 'unread': return { bg: 'bg-[#FF6B6B]', border: 'border-[#D14B3D]', icon: <Lock size={14} className="text-white opacity-90"/> };
      case 'draft': return { bg: 'bg-[#FCD34D]', border: 'border-[#D97706]', icon: <PenTool size={14} className="text-yellow-900 opacity-70"/> };
      case 'read': return { bg: 'bg-gray-200', border: 'border-gray-300', icon: <BookOpen size={14} className="text-gray-500 opacity-60"/> };
      default: return { bg: 'bg-[#FF6B6B]', border: 'border-[#D14B3D]', icon: <Lock size={14} className="text-white"/> };
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
      {/* --- DECORATION: ĐƯỜNG GẤP NẮP PHONG BÌ (SVG Nền) --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-[0.03]">
         <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
            {/* Đường chéo tạo hình phong bì */}
            <path d="M0,0 L150,110 L300,0" fill="none" stroke="black" strokeWidth="8" />
            <path d="M0,200 L150,110 L300,200" fill="none" stroke="black" strokeWidth="8" />
         </svg>
      </div>

      {/* --- HEADER: TEM & DẤU BƯU ĐIỆN --- */}
      <div className="flex justify-between items-start z-10 relative">
        
        {/* Dấu bưu điện (Postmark) */}
        <div className="transform -rotate-12 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full border-2 border-black border-dashed flex items-center justify-center p-1">
                <div className="text-[9px] font-bold text-center uppercase leading-tight text-black font-mono">
                    {format(new Date(date), "dd MMM")}<br/>
                    {format(new Date(date), "yyyy")}<br/>
                    HEARTPOST
                </div>
            </div>
            {/* Vệt sóng bưu điện */}
            <div className="flex gap-1 mt-1 ml-2">
                <div className="h-0.5 w-8 bg-black"></div>
                <div className="h-0.5 w-6 bg-black"></div>
            </div>
        </div>

        {/* Con Tem (Avatar) */}
        <div className="relative transform rotate-6 shadow-sm group-hover:rotate-0 transition-transform duration-300">
             {/* Viền răng cưa giả lập */}
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

      {/* --- CENTER: SÁP NIÊM PHONG --- */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
         <div className={`w-12 h-12 rounded-full border-4 ${seal.border} ${seal.bg} shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {seal.icon}
         </div>
      </div>

      {/* --- FOOTER: NGƯỜI GỬI & TIÊU ĐỀ --- */}
      <div className="mt-auto z-10 pl-2 pr-2">
        <div className="flex flex-col items-center text-center">
            {/* Tên người gửi kiểu viết tay */}
            <h3 className="text-xl md:text-2xl text-black leading-none mb-1" style={{ fontFamily: '"Dancing Script", cursive' }}>
                {status === 'draft' ? 'Bản nháp...' : `Gửi từ: ${sender}`}
            </h3>
            
            {/* Chủ đề thư */}
            <div className="w-full border-b border-black/10 my-1"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate w-full">
                {subject}
            </p>
        </div>
      </div>

    </motion.div>
  );
};

// --- MAIN PAGE: INBOX ---
export default function InboxPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc thư theo tìm kiếm
  const filteredLetters = MOCK_LETTERS.filter(l => 
    l.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 md:p-10 pb-20">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-[#1C1C1C]">
              Hộp Thư Đến
            </h1>
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">
             Bạn có {MOCK_LETTERS.filter(l => l.status === 'unread').length} lá thư chưa mở
           </p>
        </div>

        {/* SEARCH BAR (Bo tròn + Đỏ gạch) */}
        <div className="relative w-full md:w-auto flex items-center gap-3">
             <div className="relative flex-1 md:w-80">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm người gửi, chủ đề..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all placeholder:text-gray-300 font-bold text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
             
             {/* Nút Filter */}
             <button className="p-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all">
                <Filter size={20} className="text-black" />
             </button>
        </div>
      </div>

      {/* --- GRID HIỂN THỊ THƯ (LƯỚI PHONG BÌ) --- */}
      {filteredLetters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredLetters.map((letter, index) => (
                <motion.div
                    key={letter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <LetterCard
                        id={letter.id}
                        sender={letter.sender}
                        subject={letter.subject}
                        date={letter.date}
                        status={letter.status}
                        avatar={letter.avatar}
                        onClick={() => router.push(`/letter/${letter.id}`)}
                    />
                </motion.div>
            ))}
          </div>
      ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-3xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Mail size={32} className="text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-500">Không tìm thấy lá thư nào</p>
              <p className="text-sm text-gray-400">Hãy thử tìm từ khóa khác xem sao</p>
          </div>
      )}

      {/* --- NÚT VIẾT THƯ MỚI (Floating Action Button) --- */}
      <button 
        onClick={() => router.push('/compose')}
        className="fixed bottom-8 right-8 bg-[#FF6B6B] text-white px-6 py-4 rounded-full border-2 border-black shadow-[6px_6px_0px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1C1C1C] active:translate-y-1 active:shadow-none transition-all z-40 flex items-center gap-3 group"
      >
        <span className="font-black uppercase tracking-wider text-sm">Viết Thư</span>
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
}