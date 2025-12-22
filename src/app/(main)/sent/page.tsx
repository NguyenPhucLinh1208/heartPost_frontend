"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Send, Trash2, Search } from "lucide-react";
import NeoButton from "@/components/ui/NeoButton";

// --- Mock Data for Sent Letters ---
const MOCK_SENT_LETTERS = [
  {
    id: "5",
    recipient: "Nguyễn Văn A",
    subject: "Trả lời thư mời",
    preview: "Cảm ơn bạn đã mời, mình rất vui được tham gia sự kiện...",
    date: "2025-11-05",
  },
  {
    id: "6",
    recipient: "Trần Thị B",
    subject: "Chia sẻ về chuyến đi",
    preview: "Mình muốn kể cho bạn nghe về chuyến đi vừa rồi của mình...",
    date: "2025-11-04",
  },
  {
    id: "7",
    recipient: "Phạm Minh C",
    subject: "Cập nhật tiến độ dự án",
    preview: "Dự án của chúng ta đang tiến triển tốt, mình đã hoàn thành...",
    date: "2025-11-02",
  },
];

// --- Components ---
const LetterCard = ({ letter }: { letter: typeof MOCK_SENT_LETTERS[0] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ boxShadow: "6px 6px 0px #1C1C1C", transform: "translate(-2px, -2px)" }}
    className="relative border-2 border-foreground bg-background p-4 shadow-neo-sm cursor-pointer transition-all duration-200"
  >
    <div className="flex justify-between items-center mb-1">
      <h3 className="text-lg">Đến: {letter.recipient}</h3>
      <span className="text-sm text-foreground/70">{letter.date}</span>
    </div>
    <p className="text-foreground/80 truncate">{letter.subject}</p>
    <p className="text-foreground/60 text-sm truncate">{letter.preview}</p>
  </motion.div>
);

export default function SentPage() {
  const containerVariants = {
    visible: { transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className="p-8 md:p-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-extrabold text-4xl mb-8"
      >
        Thư đã gửi
      </motion.h1>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Tìm kiếm thư đã gửi..."
            className="w-full p-3 pl-10 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60" />
        </div>
        <NeoButton className="flex-shrink-0">
          <Trash2 size={20} /> Xóa đã chọn
        </NeoButton>
      </motion.div>

      {/* Letter List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {MOCK_SENT_LETTERS.map((letter) => (
          <Link href={`/letter/${letter.id}`} key={letter.id}>
            <LetterCard letter={letter} />
          </Link>
        ))}
      </motion.div>

      {MOCK_SENT_LETTERS.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-foreground/60 py-12 border-2 border-foreground shadow-neo bg-background mt-8"
        >
          <Send size={60} className="mx-auto mb-4 opacity-50" />
          <p className="font-bold text-xl">Chưa gửi thư nào</p>
          <p>Hãy bắt đầu gửi những lá thư đầu tiên của bạn!</p>
        </motion.div>
      )}
    </div>
  );
}