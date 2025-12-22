'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle, X } from 'lucide-react';

// Reusable Neo-style components, similar to other parts of the app
const NeoInput = (props) => <input className="w-full p-3 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans" {...props} />;

const NeoButton = ({ children, className, ...props }) => (
    <motion.button
      whileHover={{ boxShadow: '6px 6px 0px #1C1C1C', transform: 'translate(-2px, -2px)' }}
      whileTap={{ boxShadow: '2px 2px 0px #1C1C1C', transform: 'translate(2px, 2px)' }}
      transition={{ duration: 0.15 }}
      className={`w-full flex items-center justify-center gap-2 border-2 border-foreground bg-accent text-foreground font-bold py-3 px-8 shadow-neo ${className}`}
      {...props}
    >{children}</motion.button>
);

const Notification = ({ type, title, message, onConfirm, onCancel, promptType = 'text' }) => {
    const [inputValue, setInputValue] = useState('');

    const getIcon = () => {
        if (title.toLowerCase().includes('lỗi') || title.toLowerCase().includes('thất bại')) {
            return <AlertTriangle size={32} className="text-red-500" />;
        }
        if (title.toLowerCase().includes('thành công') || title.toLowerCase().includes('hoàn tất')) {
            return <CheckCircle size={32} className="text-green-500" />;
        }
        return <HelpCircle size={32} className="text-blue-500" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onCancel} // Close on backdrop click
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-md bg-background border-2 border-foreground shadow-neo-lg p-8"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon()}</div>
                    <div className="flex-1">
                        <h2 className="font-display font-extrabold text-2xl mb-2">{title}</h2>
                        <p className="text-foreground/80 whitespace-pre-wrap">{message}</p>
                    </div>
                    <motion.button onClick={onCancel} whileHover={{ scale: 1.1 }} className="p-1 absolute top-4 right-4"><X /></motion.button>
                </div>

                <div className="mt-6 space-y-4">
                    {type === 'prompt' && (
                        <NeoInput
                            type={promptType}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                    )}

                    <div className="flex gap-4 pt-4">
                        {type !== 'alert' && (
                             <button type="button" onClick={onCancel} className="w-full py-3 border-2 border-foreground font-bold hover:bg-foreground/10 transition-colors">
                                {type === 'confirm' ? 'Không' : 'Hủy'}
                            </button>
                        )}
                        <NeoButton onClick={() => onConfirm(inputValue)} className="w-full">
                            {type === 'confirm' ? 'Có' : 'OK'}
                        </NeoButton>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Notification;
