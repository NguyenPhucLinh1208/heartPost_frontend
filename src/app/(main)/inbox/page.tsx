"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Trash2, CheckCircle, Search } from "lucide-react";
import NeoButton from "@/components/ui/NeoButton"; // Assuming NeoButton is available

// --- Mock Data for Inbox ---
const MOCK_INBOX_LETTERS = [
  {
    id: "1",
    sender: "Nguyễn Văn A",
    subject: "Thư mời tham gia sự kiện",
    preview: "Chào bạn, chúng tôi xin trân trọng mời bạn tham gia sự kiện...",
    date: "2025-11-05",
    read: false,
  },
  {
    id: "2",
    sender: "Trần Thị B",
    subject: "Cảm ơn về lá thư của bạn",
    preview: "Mình rất vui khi nhận được thư của bạn. Cảm ơn bạn đã chia sẻ...",
    date: "2025-11-04",
    read: true,
  },
  {
    id: "3",
    sender: "HeartPost Team",
    subject: "Cập nhật tính năng mới",
    preview: "Chúng tôi vừa ra mắt một số tính năng mới hấp dẫn...",
    date: "2025-11-03",
    read: false,
  },
  {
    id: "4",
    sender: "Phạm Minh C",
    subject: "Về dự án sắp tới",
    preview: "Mình muốn thảo luận thêm về kế hoạch cho dự án của chúng ta...",
    date: "2025-11-02",
    read: true,
  },
];

// --- Components ---
const LetterCard = ({ letter }: { letter: typeof MOCK_INBOX_LETTERS[0] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ boxShadow: "6px 6px 0px #1C1C1C", transform: "translate(-2px, -2px)" }}
    className={`relative border-2 border-foreground bg-background p-4 shadow-neo-sm cursor-pointer transition-all duration-200 ${
      letter.read ? "" : "font-bold"
    }`}
  >
    {!letter.read && (
      <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></div>
    )}
    <div className="flex justify-between items-center mb-1">
      <h3 className="text-lg">{letter.sender}</h3>
      <span className="text-sm text-foreground/70">{letter.date}</span>
    </div>
    <p className="text-foreground/80 truncate">{letter.subject}</p>
    <p className="text-foreground/60 text-sm truncate">{letter.preview}</p>
    {/* Quick action icons could go here on hover */}
  </motion.div>
);

export default function InboxPage() {
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
        Hộp thư đến của bạn
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
            placeholder="Tìm kiếm thư..."
            className="w-full p-3 pl-10 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60" />
        </div>
        <NeoButton className="flex-shrink-0">
          <Trash2 size={20} /> Xóa đã chọn
        </NeoButton>
        <NeoButton className="flex-shrink-0">
          <CheckCircle size={20} /> Đánh dấu đã đọc
        </NeoButton>
      </motion.div>

      {/* Letter List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {MOCK_INBOX_LETTERS.map((letter) => (
          <Link href={`/letter/${letter.id}`} key={letter.id}>
            <LetterCard letter={letter} />
          </Link>
        ))}
      </motion.div>

      {MOCK_INBOX_LETTERS.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-foreground/60 py-12 border-2 border-foreground shadow-neo bg-background mt-8"
        >
          <Mail size={60} className="mx-auto mb-4 opacity-50" />
          <p className="font-bold text-xl">Hộp thư đến trống</p>
          <p>Không có lá thư nào ở đây cả.</p>
        </motion.div>
      )}
    </div>
  );
}