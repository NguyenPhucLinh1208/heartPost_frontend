"use client";

import { motion } from "framer-motion";
import Link from "next/link"; // Import Link for client-side navigation
import NeoButton from '@/components/ui/NeoButton'; // Import the shared NeoButton

const Header = () => {
  return (
    <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-2 border-foreground"
    >
      <nav className="flex w-full items-center justify-between px-4 md:px-8 py-4">
        <div className="font-display text-2xl font-extrabold">
          <Link href="/">HeartPost</Link>
        </div>
        <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 font-bold">
                <Link href="#features" className="hover:text-accent transition-colors">Tính năng</Link>
                <Link href="#about" className="hover:text-accent transition-colors">Giới thiệu</Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/login" passHref legacyBehavior>
                    <NeoButton className="hidden sm:block">Đăng nhập</NeoButton>
                </Link>
                <Link href="/register" passHref legacyBehavior>
                    <NeoButton>Đăng ký</NeoButton>
                </Link>
            </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
