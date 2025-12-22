"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Trash2, Search, Pencil } from "lucide-react";
import NeoButton from "@/components/ui/NeoButton";

// --- Mock Data for Draft Letters ---
const MOCK_DRAFT_LETTERS = [
  {
    id: "8",
    subject: "Thư nháp gửi bạn bè",
    preview: "Chào bạn, mình đang viết một lá thư để kể về...",
    date: "2025-11-06",
  },
  {
    id: "9",
    subject: "Ý tưởng cho dự án mới",
    preview: "Đây là một số ý tưởng ban đầu mình nghĩ ra cho dự án...",
    date: "2025-11-05",
  },
  {
    id: "10",
    subject: "Thư chưa hoàn thành",
    preview: "Mình sẽ hoàn thành lá thư này sau...",
    date: "2025-11-01",
  },
];

// --- Components ---
const LetterCard = ({ letter }: { letter: typeof MOCK_DRAFT_LETTERS[0] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ boxShadow: "6px 6px 0px #1C1C1C", transform: "translate(-2px, -2px)" }}
    className="relative border-2 border-foreground bg-background p-4 shadow-neo-sm cursor-pointer transition-all duration-200"
  >
    <div className="flex justify-between items-center mb-1">
      <h3 className="text-lg">{letter.subject}</h3>
      <span className="text-sm text-foreground/70">{letter.date}</span>
    </div>
    <p className="text-foreground/60 text-sm truncate">{letter.preview}</p>
    <div className="absolute top-2 right-2 p-1 bg-accent text-background text-xs font-bold rounded-sm">
        <Pencil size={14} className="inline-block mr-1" /> Nháp
    </div>
  </motion.div>
);

export default function DraftsPage() {
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
        Thư nháp của bạn
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
            placeholder="Tìm kiếm thư nháp..."
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
        {MOCK_DRAFT_LETTERS.map((letter) => (
          <Link href={`/compose?draftId=${letter.id}`} key={letter.id}>
            <LetterCard letter={letter} />
          </Link>
        ))}
      </motion.div>

      {MOCK_DRAFT_LETTERS.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-foreground/60 py-12 border-2 border-foreground shadow-neo bg-background mt-8"
        >
          <FileText size={60} className="mx-auto mb-4 opacity-50" />
          <p className="font-bold text-xl">Chưa có thư nháp nào</p>
          <p>Hãy bắt đầu soạn một lá thư mới!</p>
        </motion.div>
      )}
    </div>
  );
}