"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Filter, FileEdit, ChevronRight } from "lucide-react";
import LetterCard from "@/components/ui/LetterCard";

// Dữ liệu giả lập cho Thư Nháp
const MOCK_DRAFTS = [
  {
    id: "d1",
    recipient: "Chưa có người nhận",
    subject: "Gửi Crush (Viết dở)",
    date: new Date().toISOString(),
    status: "draft",
    avatar: null 
  },
  {
    id: "d2",
    recipient: "Nhân sự",
    subject: "Feedback công ty",
    date: "2023-11-20T15:30:00Z",
    status: "draft",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HR"
  },
];

export default function DraftsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // CẬP NHẬT: Tìm kiếm cả theo Tên người nhận và Chủ đề
  const filteredDrafts = MOCK_DRAFTS.filter(d => 
    d.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 md:p-10 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-[#1C1C1C]">
              Thư Nháp
            </h1>
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">
             Những ý tưởng còn dang dở
           </p>
        </div>

        {/* TOOLBAR */}
        <div className="relative w-full md:w-auto flex items-center gap-3">
             <div className="relative flex-1 md:w-80">
                <input 
                    type="text" 
                    placeholder="Tìm trong nháp..." 
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
      {filteredDrafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDrafts.map((draft, index) => (
                <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <LetterCard
                        id={draft.id}
                        name={draft.recipient}
                        label="Bản nháp:"
                        subject={draft.subject}
                        date={draft.date}
                        status="draft"
                        avatar={draft.avatar}
                        onClick={() => router.push(`/compose?id=${draft.id}`)} // Logic tốt: Mở editor với ID nháp
                    />
                </motion.div>
            ))}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-3xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileEdit size={32} className="text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-500">Không có bản nháp nào</p>
              <p className="text-sm text-gray-400">Hộp thư nháp trống trơn</p>
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