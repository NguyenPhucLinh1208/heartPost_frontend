"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "@/components/layout/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If loading is finished and user is not authenticated, redirect to login
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // While loading, show a loading screen or null to prevent flicker
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-lg">Đang tải...</p>
            </div>
        );
    }

    // If authenticated, render the main app layout
    if (isAuthenticated) {
        return (
            <div className="flex">
                <AppSidebar />
                <main className="ml-64 w-[calc(100%-16rem)] min-h-screen bg-background/50">
                    {children}
                </main>
            </div>
        );
    }

    // If not authenticated and not loading, return null because the redirect is in progress
    return null;
}
