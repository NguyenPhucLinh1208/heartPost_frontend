'use client';

import { useState, useEffect } from 'react';
import letterService from '@/services/letterService';
import LetterViewer from '@/components/features/LetterViewer';
import { Letter } from '@/types/letter'; // Assuming you have a Letter type defined

const LetterPage = ({ params }: { params: { id: string } }) => {
    const [letterData, setLetterData] = useState<Letter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLetter = async () => {
            if (!params.id) return;

            try {
                setIsLoading(true);
                const data = await letterService.getPublicLetter(params.id);
                setLetterData(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Không thể tải được thư.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLetter();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <p className="text-xl animate-pulse">Đang tìm thư của bạn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-destructive">
                <div className="p-8 bg-destructive/10 border border-destructive rounded-lg text-center">
                    <h1 className="text-2xl font-bold">Đã xảy ra lỗi</h1>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!letterData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                 <p>Không tìm thấy dữ liệu thư.</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <LetterViewer letterData={letterData} />
        </div>
    );
};

export default LetterPage;
