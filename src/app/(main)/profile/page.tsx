"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Key, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserUpdate } from '@/types/auth';
import { userService } from '@/services/userService'; 

// --- Reusable Components from login/register pages for consistency ---
const NeoInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        className="w-full p-3 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans disabled:opacity-50" 
        {...props} 
    />
);

const NeoButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode, className?: string }) => (
    <motion.button
      whileHover={{ boxShadow: '6px 6px 0px #1C1C1C', transform: 'translate(-2px, -2px)' }}
      whileTap={{ boxShadow: '2px 2px 0px #1C1C1C', transform: 'translate(2px, 2px)' }}
      transition={{ duration: 0.15 }}
      className={`w-full flex items-center justify-center gap-2 border-2 border-foreground bg-accent text-foreground font-bold py-3 px-8 shadow-neo disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </motion.button>
);

export default function ProfilePage() {
    const { user, token, refreshUser } = useAuth();
    const [formData, setFormData] = useState<Partial<UserUpdate>>({});
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                username: user.username || '',
                date_of_birth: user.date_of_birth || '',
                hobbies: user.hobbies || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        const payload: UserUpdate = {};

        // Add changed profile fields to payload
        for (const key in formData) {
            const formKey = key as keyof typeof formData;
            if (user && formData[formKey] !== (user[formKey as keyof typeof user] || '')) {
                payload[formKey] = formData[formKey];
            }
        }

        // Handle password change
        if (passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setError('Mật khẩu mới không khớp.');
                setIsSubmitting(false);
                return;
            }
            if (passwordData.newPassword.length < 6) {
                setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
                setIsSubmitting(false);
                return;
            }
            payload.password = passwordData.newPassword;
        }
        
        if (Object.keys(payload).length === 0) {
            setSuccess("Không có thông tin nào thay đổi.");
            setIsSubmitting(false);
            return;
        }

        try {
            await userService.updateProfile(payload, token!);
            setSuccess('Hồ sơ đã được cập nhật thành công!');
            await refreshUser(); 
        } catch (err: any) {
            setError(err.message || 'Cập nhật hồ sơ thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!user) {
        return <div className="p-8">Đang tải hồ sơ...</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-2 border-foreground bg-background p-8 shadow-neo"
                >
                    <h1 className="font-display text-4xl font-extrabold mb-8 flex items-center gap-4">
                        <User size={36} />
                        Hồ Sơ Của Bạn
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* --- Profile Information --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="font-bold mb-2 block">Họ và Tên</label>
                                <NeoInput name="full_name" value={formData.full_name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="font-bold mb-2 block">Tên người dùng</label>
                                <NeoInput name="username" value={formData.username} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="font-bold mb-2 block">Email</label>
                                <NeoInput name="email" value={user.email} disabled title="Không thể thay đổi email." />
                            </div>
                            <div>
                                <label className="font-bold mb-2 block">Ngày Sinh</label>
                                <NeoInput type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div>
                            <label className="font-bold mb-2 block">Sở thích</label>
                            <textarea
                                name="hobbies"
                                value={formData.hobbies}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full p-3 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans"
                            />
                        </div>

                        {/* --- Password Change --- */}
                        <div className="pt-6 border-t-2 border-dashed border-foreground/50">
                             <h2 className="font-display text-2xl font-extrabold mb-4 flex items-center gap-3">
                                <Lock size={24} />
                                Đổi Mật Khẩu
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-bold mb-2 block">Mật khẩu mới</label>
                                    <NeoInput type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Bỏ trống nếu không đổi" />
                                </div>
                                <div>
                                    <label className="font-bold mb-2 block">Xác nhận mật khẩu mới</label>
                                    <NeoInput type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Nhập lại mật khẩu mới" />
                                </div>
                            </div>
                        </div>

                        {/* --- Messages and Submit Button --- */}
                        {error && <div className="text-red-500 text-center font-bold bg-red-100 p-3 border-2 border-red-500">{error}</div>}
                        {success && <div className="text-green-600 text-center font-bold bg-green-100 p-3 border-2 border-green-500">{success}</div>}

                        <div className="pt-6">
                            <NeoButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </NeoButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}