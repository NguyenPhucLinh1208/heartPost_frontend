"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Send, Pencil, Home, Settings, LogOut, FileText, User } from 'lucide-react'; // Added FileText icon
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NeoButton from '@/components/ui/NeoButton'; // Import the shared NeoButton

const NavLink = ({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={`flex items-center gap-3 px-4 py-3 font-bold rounded-md transition-colors ${isActive ? 'bg-accent text-background shadow-neo-sm' : 'text-foreground/70 hover:text-foreground'}`}>
            {icon}
            <span>{children}</span>
        </Link>
    );
};

const AppSidebar = () => {
    const router = useRouter();
    const { logout } = useAuth(); // Use the logout function from AuthContext

    const handleLogout = () => {
        logout(); // Clear authentication state
        router.push('/'); // Redirect to homepage
    };

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 border-r-2 border-foreground bg-background flex flex-col p-4">
            <div className="font-display text-3xl font-extrabold mb-10 px-2">
                <Link href="/app">HeartPost</Link>
            </div>
            <nav className="flex flex-col gap-2">
                <NavLink href="/app" icon={<Home size={22} />}>Trang chủ</NavLink>
                <NavLink href="/inbox" icon={<Mail size={22} />}>Hộp thư đến</NavLink>
                <NavLink href="/sent" icon={<Send size={22} />}>Thư đã gửi</NavLink>
                <NavLink href="/drafts" icon={<FileText size={22} />}>Thư nháp</NavLink> {/* Added Thư nháp */}
                <NavLink href="/profile" icon={<User size={22} />}>Hồ sơ</NavLink>
            </nav>
            <div className="mt-auto flex flex-col gap-2">
                <Link href="/compose">
                    <NeoButton>
                        <Pencil size={20} /> Soạn thư
                    </NeoButton>
                </Link>
                <div className="border-t-2 border-foreground/20 my-2"></div> {/* Visual separator */}
                <NavLink href="/settings" icon={<Settings size={22} />}>Cài đặt</NavLink>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 font-bold rounded-md transition-colors text-foreground/70 hover:text-foreground">
                    <LogOut size={22} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AppSidebar;