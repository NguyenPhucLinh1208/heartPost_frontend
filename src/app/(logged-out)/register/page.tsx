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

const NeoButton = ({ children, className, ...props }: HTMLMotionProps<"button"> & { className?: string }) => (
    <motion.button
        {...props}
        whileHover={{ boxShadow: '6px 6px 0px #1C1C1C', transform: 'translate(-2px, -2px)' }}
        whileTap={{ boxShadow: '2px 2px 0px #1C1C1C', transform: 'translate(2px, 2px)' }}
        transition={{ duration: 0.15 }}
        className={`w-full flex items-center justify-center gap-2 border-2 border-foreground bg-accent text-foreground font-bold py-3 px-8 shadow-neo disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </motion.button>
);

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) router.push('/app');
    }, [isAuthenticated, isAuthLoading, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await register({ email, username, password });
            router.push('/login');
        } catch (err: any) {
            let message = err.message || 'Có lỗi không mong muốn xảy ra.';
            if (message.includes('Email already registered')) message = 'Email này đã được sử dụng.';
            else if (message.includes('Username already taken')) message = 'Tên người dùng này đã được sử dụng.';
            else if (message.includes('Password cannot be longer than 72 bytes')) message = 'Mật khẩu quá dài.';
            setError(message);
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
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md">
                <div className="border-2 border-foreground bg-background p-8 md:p-10 shadow-neo">
                    <motion.h1 variants={itemVariants} className="font-display font-extrabold text-4xl text-center mb-2">Tạo Tài Khoản</motion.h1>
                    <motion.p variants={itemVariants} className="text-center text-foreground/70 mb-8">Bắt đầu hành trình gửi gắm yêu thương.</motion.p>

                    <motion.form variants={containerVariants} className="space-y-6" onSubmit={handleSubmit}>
                        <motion.div variants={itemVariants}>
                            <label className="font-bold mb-2 block">Tên người dùng</label>
                            <NeoInput type="text" placeholder="nguyenvana" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isSubmitting} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="font-bold mb-2 block">Email</label>
                            <NeoInput type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="font-bold mb-2 block">Mật khẩu</label>
                            <NeoInput type="password" placeholder="Ít nhất 6 ký tự" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isSubmitting} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="font-bold mb-2 block">Xác nhận mật khẩu</label>
                            <NeoInput type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSubmitting} />
                        </motion.div>

                        {error && (
                            <motion.div variants={itemVariants} className="text-red-500 text-center font-bold bg-red-100 p-3 border-2 border-red-500">
                                {error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="pt-4">
                            <NeoButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                            </NeoButton>
                        </motion.div>
                    </motion.form>

                    <motion.div variants={itemVariants} className="text-center mt-8">
                        <p className="text-foreground/80">
                            Đã có tài khoản? <Link href="/login" className="font-bold text-accent hover:underline">Đăng nhập</Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}