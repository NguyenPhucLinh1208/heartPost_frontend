"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, PenTool, Mail, Zap } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useRef } from "react";
import NeoButton from '@/components/ui/NeoButton';

// --- Variants (fixed types) ---
const containerVariants: Variants = {
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
};

// --- Components ---
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="border-2 border-foreground bg-background p-6 shadow-neo w-full h-full flex flex-col items-start text-left">
    <div className="mb-4 border-2 border-foreground p-2 shadow-neo-sm bg-white">{icon}</div>
    <h3 className="font-display font-extrabold text-2xl mb-2">{title}</h3>
    <p className="text-foreground/80">{description}</p>
  </div>
);

// --- Main Page ---
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Background Texture */}
      <div className="absolute inset-0 h-full w-full bg-transparent bg-[radial-gradient(#1C1C1C_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 flex flex-col items-center">
        {/* === HERO SECTION === */}
        <section id="hero" ref={heroRef} className="relative w-full flex flex-col items-center justify-center min-h-screen text-center overflow-hidden p-4">
          {/* FIX: merge style props */}
          <motion.div
            style={{ y, backgroundImage: "url('/images/paper-texture.png')" }}
            className="absolute inset-0 bg-cover bg-center opacity-20"
          />

          <div className="relative z-10 max-w-4xl">
            <motion.h1 variants={itemVariants} className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl mb-4">
              GỬI THƯ TAY
            </motion.h1>
            <motion.h1 variants={itemVariants} className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl text-accent mb-8">
              KẾT NỐI THẬT
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 mb-10">
              Tái hiện trải nghiệm gửi thư vật lý trong thế giới số. Nơi chữ viết tay là cầu nối cho những cảm xúc chân thành nhất.
            </motion.p>
          </div>
        </section>

        {/* === MARQUEE SECTION === */}
        <section className="w-full py-12 md:py-16 border-y-2 border-foreground bg-accent overflow-hidden">
          <Marquee autoFill={true} speed={60} className="flex items-center">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mx-12">CHÂN THẬT</h2>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mx-12">CÁ NHÂN</h2>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mx-12">SÁNG TẠO</h2>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mx-12">CẢM XÚC</h2>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mx-12">KẾT NỐI</h2>
          </Marquee>
        </section>

        {/* === FEATURES SECTION === */}
        <motion.section
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="w-full px-4 md:px-8 py-16 md:py-24"
        >
          <div className="max-w-5xl mx-auto">
            <motion.h2 variants={itemVariants} className="font-display font-extrabold text-4xl text-center mb-12">
              Tại Sao Chọn HeartPost?
            </motion.h2>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<PenTool size={28} className="text-accent" />}
                  title="Chữ Viết Tay Bắt Buộc"
                  description="Linh hồn của mọi lá thư. Thể hiện dấu ấn cá nhân và tình cảm không thể thay thế."
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Mail size={28} className="text-accent" />}
                  title="Trải Nghiệm Chân Thực"
                  description="Từ phong bì, con tem, đến dấu bưu điện. Mọi chi tiết đều được mô phỏng tỉ mỉ."
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Zap size={28} className="text-accent" />}
                  title="Công Nghệ & Cảm Xúc"
                  description="Tích hợp âm nhạc, hình ảnh, video và giọng nói để lá thư của bạn thêm sống động."
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* === FOOTER === */}
        <footer className="w-full text-center py-12 border-t-2 border-foreground">
          <p className="font-display font-extrabold text-lg">© 2025 HeartPost</p>
          <div className="flex justify-center gap-4 mt-2 text-foreground/70">
            <a className="hover:text-accent transition-colors">Điều khoản</a>
            <a className="hover:text-accent transition-colors">Bảo mật</a>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
