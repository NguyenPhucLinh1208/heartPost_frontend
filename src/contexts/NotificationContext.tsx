'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification from '@/components/ui/Notification'; // We will create this component next

type NotificationType = 'alert' | 'confirm' | 'prompt';

interface NotificationOptions {
    type: NotificationType;
    title: string;
    message: string;
    onConfirm?: (inputValue?: string) => void;
    onCancel?: () => void;
    promptType?: string; // e.g., 'text', 'password'
    promptDefaultValue?: string;
}

interface NotificationContextType {
    notify: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifier = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifier must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notification, setNotification] = useState<NotificationOptions | null>(null);

    const notify = useCallback((options: NotificationOptions) => {
        setNotification(options);
    }, []);

    const handleClose = () => {
        setNotification(null);
    };

    const handleConfirm = (inputValue?: string) => {
        notification?.onConfirm?.(inputValue);
        handleClose();
    };

    const handleCancel = () => {
        notification?.onCancel?.();
        handleClose();
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <AnimatePresence>
                {notification && (
                    <Notification
                        {...notification}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
};
