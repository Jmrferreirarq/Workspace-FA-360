import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function Toast({
    type,
    title,
    message,
    duration = 5000,
    onClose,
    action
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle2,
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            iconBg: 'bg-emerald-500/20 text-emerald-500',
        },
        error: {
            icon: XCircle,
            bg: 'bg-red-500/10 border-red-500/20',
            iconBg: 'bg-red-500/20 text-red-500',
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-500/10 border-amber-500/20',
            iconBg: 'bg-amber-500/20 text-amber-500',
        },
        info: {
            icon: Info,
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            iconBg: 'bg-indigo-500/20 text-indigo-500',
        },
    };

    const { icon: Icon, bg, iconBg } = config[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`
            fixed bottom-32 right-6 z-[400]
            flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl
            max-w-sm shadow-strong
            ${bg}
          `}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                        <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{title}</p>
                        {message && (
                            <p className="text-xs text-white/50 mt-0.5">{message}</p>
                        )}
                    </div>

                    {action && (
                        <button
                            onClick={action.onClick}
                            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-luxury-gold border border-luxury-gold/30 rounded-full hover:bg-luxury-gold/10 transition-all"
                        >
                            {action.label}
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

