"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { HTMLMotionProps } from "framer-motion";

const NeoInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        className="w-full p-3 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans disabled:opacity-50" 
        {...props} 
    />
);

// Fixed NeoButton
type MotionButtonProps = HTMLMotionProps<"button"> & {
  className?: string;
};

const NeoButton = ({ children, className = "", ...props }: MotionButtonProps) => (
  <motion.button
    {...props}
    whileHover={{ boxShadow: "6px 6px 0px #1C1C1C", transform: "translate(-2px, -2px)" }}
    whileTap={{ boxShadow: "2px 2px 0px #1C1C1C", transform: "translate(2px, 2px)" }}
    transition={{ duration: 0.15 }}
    className={`w-full flex items-center justify-center gap-2 border-2 border-foreground bg-accent text-foreground font-bold py-3 px-8 shadow-neo disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </motion.button>
);

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            router.push('/app');
        }
    }, [isAuthenticated, isAuthLoading, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login({ email, password });
            router.push('/app');
        } catch (err: any) {
            let errorMessage = err.message || 'Có lỗi không mong muốn xảy ra.';
            if (errorMessage.includes("Incorrect email or password")) {
                errorMessage = "Email hoặc mật khẩu không chính xác. Nếu bạn chưa có tài khoản, hãy đăng ký.";
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading || isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-lg">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md"
            >
                <div className="border-2 border-foreground bg-background p-8 md:p-10 shadow-neo">
                    <motion.h1 variants={itemVariants} className="font-display font-extrabold text-4xl text-center mb-2">Đăng Nhập</motion.h1>
                    <motion.p variants={itemVariants} className="text-center text-foreground/70 mb-8">Chào mừng trở lại!</motion.p>

                    <motion.form variants={containerVariants} className="space-y-6" onSubmit={handleSubmit}>
                        <motion.div variants={itemVariants}>
                            <label className="font-bold mb-2 block">Email</label>
                            <NeoInput
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="font-bold mb-2 block">Mật khẩu</label>
                            <NeoInput
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </motion.div>

                        {error && (
                            <motion.div variants={itemVariants} className="text-red-500 text-center font-bold bg-red-100 p-3 border-2 border-red-500">
                                {error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="pt-4">
                            <NeoButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
                            </NeoButton>
                        </motion.div>
                    </motion.form>

                    <motion.div variants={itemVariants} className="text-center mt-8">
                        <p className="text-foreground/80">
                            Chưa có tài khoản? <Link href="/register" className="font-bold text-accent hover:underline">Đăng ký ngay</Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}