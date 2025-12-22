'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import letterService from '@/services/letterService';
import { Letter } from '@/types/letter';
import LetterViewer from '@/components/features/LetterViewer'; // Assuming this component exists and accepts letterData
import { Loader, AlertTriangle } from 'lucide-react';

export default function PublicLetterViewPage() {
    const params = useParams();
    const token = params.token as string;

    const [letter, setLetter] = useState<Letter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            const fetchLetter = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await letterService.getPublicLetter(token);
                    setLetter(data);
                } catch (err: any) {
                    setError(err.message || 'An unknown error occurred.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLetter();
        }
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
                <Loader className="w-12 h-12 animate-spin mb-4" />
                <p className="font-bold text-xl">Đang mở thư...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="font-display font-extrabold text-3xl mb-2">Không thể mở thư</h1>
                <p className="text-red-500">{error === 'Letter not found' ? 'Bức thư này không tồn tại hoặc đã bị xóa.' : 'Đã có lỗi xảy ra.'}</p>
            </div>
        );
    }

    if (letter) {
        // The LetterViewer component needs to be able to handle the letter object
        // It was previously used inside compose/page.tsx with a slightly different data structure
        // We are adapting it here. The `letterData` prop for LetterViewer might need adjustment.
        const letterDataForViewer = {
            ...letter,
            // The viewer might expect File objects, but we have URLs/keys.
            // We pass the raw letter object and let the viewer handle it.
            // This is a potential point of failure if LetterViewer is not flexible.
        };

        return (
            <div className="w-full h-screen bg-gray-200 p-4">
                 <LetterViewer letterData={letterDataForViewer} />
            </div>
        );
    }

    return null; // Should not be reached
}
