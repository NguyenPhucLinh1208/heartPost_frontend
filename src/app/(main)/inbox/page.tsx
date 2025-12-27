"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Filter, Mail, ChevronRight } from "lucide-react";
// Import component chuẩn từ UI thay vì khai báo lại
import LetterCard from "@/components/ui/LetterCard";

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
                        name={letter.sender}     // Sửa prop: sender -> name
                        label="Gửi từ:"          // Thêm label
                        subject={letter.subject}
                        date={letter.date}
                        status={letter.status as any} // Ép kiểu tạm thời để tránh lỗi typescript strict
                        avatar={letter.avatar}
                        onClick={() => alert("Tính năng xem thư đang được bảo trì!")} // Tạm thời thay thế router.push
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