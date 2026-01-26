import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Save, X } from 'lucide-react';
import { useTimer } from '../../context/TimeContext';
import { useLanguage } from '../../context/LanguageContext';
import fa360 from '../../services/fa360';

export const TimeTracker: React.FC = () => {
  const { isActive, elapsedTime, activeProject, stop, reset } = useTimer();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState('Production');

  if (!isActive && !isExpanded && elapsedTime === 0) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!activeProject) return;

    const durationMinutes = Math.max(1, Math.round(elapsedTime / 60));
    
    await fa360.logTime({
      projectId: activeProject.id,
      date: new Date().toISOString(),
      duration: durationMinutes,
      phase,
      description,
      userId: 'user-ceo' // Default for now
    });

    fa360.log(`TIMER: ${durationMinutes}m registados no projeto ${activeProject.name}`);
    
    reset();
    setShowLogModal(false);
    setIsExpanded(false);
    setDescription('');
  };

  return (
    <>
      <div className="fixed bottom-24 right-8 z-[500] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass p-1.5 rounded-full border-luxury-gold/30 shadow-2xl flex items-center gap-3 pointer-events-auto"
            >
              <div className="bg-luxury-gold text-black px-4 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="text-xs font-black tracking-widest tabular-nums">{formatTime(elapsedTime)}</span>
              </div>
              
              <div className="flex items-center gap-1 pr-1">
                <button 
                  onClick={() => setShowLogModal(true)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-luxury-charcoal dark:text-white"
                >
                  <Square size={14} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isActive && activeProject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass px-4 py-2 rounded-xl border-black/5 dark:border-white/5 shadow-xl pointer-events-auto"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-luxury-gold mb-0.5">{t('timer_active')}</p>
              <p className="text-[11px] font-bold text-luxury-charcoal dark:text-white">{activeProject.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass w-full max-w-md p-8 rounded-[2rem] border-white/10 shadow-2xl space-y-6"
            >
              <div>
                <h3 className="text-2xl font-serif italic text-white mb-2">{t('timer_save')}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold">{activeProject?.name}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2">{t('timer_phase')}</label>
                  <select 
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-luxury-gold outline-none"
                  >
                    <option value="Research">Estudo Prévio</option>
                    <option value="Production">Licenciamento</option>
                    <option value="Execution">Execução</option>
                    <option value="Meeting">Reunião</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2">{t('timer_description')}</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-luxury-gold outline-none min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
                >
                  {t('timer_cancel')}
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 rounded-xl bg-luxury-gold text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-luxury-gold/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {t('timer_save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
