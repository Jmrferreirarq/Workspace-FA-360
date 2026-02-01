
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Save, X, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import fa360 from '../services/fa360';

interface TimeTrackerProps {
    projectId: string;
    projectPhase: string;
    onLogAdded: () => void;
}

export default function TimeTracker({ projectId, projectPhase, onLogAdded }: TimeTrackerProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [duration, setDuration] = useState(60); // Default 1 hour
    const [description, setDescription] = useState('');
    const [phase, setPhase] = useState(projectPhase);
    const [isSaving, setIsSaving] = useState(false);

    // Quick increment helpers
    const adjustTime = (minutes: number) => {
        setDuration(prev => Math.max(15, prev + minutes));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await fa360.logTime({
            projectId,
            date: new Date().toISOString(),
            duration,
            phase,
            description,
            userId: 'current_user' // Mock user
        });
        setIsSaving(false);
        setIsOpen(false);
        setDescription('');
        setDuration(60);
        onLogAdded(); // Refresh parent list
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg shadow-luxury-gold/20"
            >
                <Clock size={16} />
                Registar Tempo
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 w-full max-w-md relative z-10 shadow-strong overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex justify-between items-center mb-8 relative">
                                <div className="flex items-center gap-3 text-luxury-gold">
                                    <div className="p-2 bg-luxury-gold/10 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Registo de Horas</h3>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-6 relative">

                                {/* Duration Controls */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4 block">Duracao (Minutos)</label>
                                    <div className="flex items-center justify-between mb-6">
                                        <button onClick={() => adjustTime(-15)} className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors">-</button>
                                        <span className="text-5xl font-serif italic text-white flex items-baseline gap-2">
                                            {duration}<span className="text-lg font-sans not-italic text-luxury-gold opacity-50">min</span>
                                        </span>
                                        <button onClick={() => adjustTime(15)} className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors">+</button>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        {[15, 30, 60, 120].map(m => (
                                            <button key={m} onClick={() => setDuration(m)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${duration === m ? 'bg-luxury-gold text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                                                {m}m
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2 block">Fase do Projeto</label>
                                        <input
                                            type="text"
                                            value={phase}
                                            onChange={(e) => setPhase(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2 block">Descricao</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="O que foi feito?"
                                            rows={2}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-4 mt-4 bg-luxury-gold hover:bg-white hover:text-black text-black rounded-xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isSaving ? (
                                        <RotateCcw className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            <Save size={16} /> Salvar Registo
                                        </>
                                    )}
                                </button>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

