"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Filter, Mail, ChevronRight } from "lucide-react";
import LetterCard from "@/components/ui/LetterCard";

// Dữ liệu giả lập cho Thư Đã Gửi
const MOCK_SENT_LETTERS = [
  {
    id: "s1",
    recipient: "Người Yêu Cũ",
    subject: "Gửi em những ngày tháng cũ",
    date: "2023-11-10T10:00:00Z",
    status: "read",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ex"
  },
  {
    id: "s2",
    recipient: "Sếp Tổng",
    subject: "Đơn xin nghỉ phép",
    date: "2023-12-05T08:00:00Z",
    status: "sent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Boss"
  },
  {
    id: "s3",
    recipient: "Mẹ yêu",
    subject: "Con nhớ mẹ",
    date: "2024-01-01T00:00:00Z",
    status: "scheduled", // Thư hẹn giờ
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom"
  },
];

export default function SentPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLetters = MOCK_SENT_LETTERS.filter(l => 
    l.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 md:p-10 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-[#1C1C1C]">
              Thư Đã Gửi
            </h1>
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">
             Những cánh thư đang bay đi
           </p>
        </div>

        {/* TOOLBAR */}
        <div className="relative w-full md:w-auto flex items-center gap-3">
             <div className="relative flex-1 md:w-80">
                <input 
                    type="text" 
                    placeholder="Tìm thư đã gửi..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all placeholder:text-gray-300 font-bold text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
             <button className="p-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <Filter size={20} className="text-black" />
             </button>
        </div>
      </div>

      {/* GRID */}
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
                        name={letter.recipient}  // Hiển thị tên người nhận
                        label="Gửi đến:"         // Nhãn "Gửi đến"
                        subject={letter.subject}
                        date={letter.date}
                        status={letter.status as any}
                        avatar={letter.avatar}
                        onClick={() => router.push(`/letter/${letter.id}`)}
                    />
                </motion.div>
            ))}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-3xl">
              <Mail size={32} className="text-gray-300 mb-4" />
              <p className="text-xl font-bold text-gray-400">Chưa gửi lá thư nào</p>
          </div>
      )}

      {/* FAB */}
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