import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Play, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Phase {
  id: string;
  labelPT: string;
  labelEN: string;
  status: 'completed' | 'current' | 'upcoming' | 'delayed';
  date?: string;
}

interface ProjectTimelineProps {
  currentPhaseId: string;
  phasesOverride?: Phase[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ currentPhaseId, phasesOverride }) => {
  const { t, locale } = useLanguage();

  const defaultPhases: Phase[] = [
    { id: 'EP', labelPT: 'Estudo Prévio', labelEN: 'Preliminary Study', status: 'upcoming' },
    { id: 'LIC', labelPT: 'Licenciamento', labelEN: 'Licensing', status: 'upcoming' },
    { id: 'EXEC', labelPT: 'Execução', labelEN: 'Execution', status: 'upcoming' },
    { id: 'OBRA', labelPT: 'Obra', labelEN: 'Construction', status: 'upcoming' }
  ];

  const phases = (phasesOverride || defaultPhases).map(p => {
    let status: Phase['status'] = 'upcoming';
    const currentIndex = defaultPhases.findIndex(x => x.id === currentPhaseId);
    const thisIndex = defaultPhases.findIndex(x => x.id === p.id);

    if (thisIndex < currentIndex) status = 'completed';
    else if (thisIndex === currentIndex) status = 'current';
    
    return { ...p, status };
  });

  return (
    <div className="w-full py-12 px-2">
      {/* Connector Line (Desktop) */}
      <div className="relative hidden md:block">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5 dark:bg-white/10 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-[1.5px] bg-luxury-gold -translate-y-1/2 z-0 transition-all duration-1000" 
          style={{ width: `${(phases.filter(p => p.status === 'completed' || p.status === 'current').length - 0.5) / (phases.length - 1) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
        {phases.map((phase, idx) => (
          <div key={phase.id} className="flex flex-col items-center text-center group">
            {/* Step Marker */}
            <motion.div
              initial={false}
              animate={{
                scale: phase.status === 'current' ? 1.1 : 1,
                backgroundColor: phase.status === 'completed' ? '#D4AF37' : (phase.status === 'current' ? '#000' : 'rgba(255,255,255,0.05)')
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 mb-6 ${
                phase.status === 'completed' ? 'border-luxury-gold text-black' : 
                phase.status === 'current' ? 'border-luxury-gold dark:bg-black text-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 
                'border-black/5 dark:border-white/10 text-luxury-charcoal/30 dark:text-white/20'
              }`}
            >
              {phase.status === 'completed' && <Check size={18} />}
              {phase.status === 'current' && <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Play size={14} className="fill-current ml-0.5" /></motion.div>}
              {phase.status === 'upcoming' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            </motion.div>

            {/* Content */}
            <div className="space-y-1">
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                phase.status === 'current' ? 'text-luxury-gold' : 'text-luxury-charcoal/40 dark:text-white/30'
              }`}>
                {locale === 'pt' ? phase.labelPT : phase.labelEN}
              </p>
              
              {phase.status === 'current' && (
                <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-luxury-gold uppercase tracking-tighter">
                   <Clock size={10} />
                   <span>Em Curso</span>
                </div>
              )}

              {phase.status === 'completed' && (
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Concluído</span>
              )}

              {phase.status === 'upcoming' && (
                <span className="text-[9px] font-bold text-luxury-charcoal/20 dark:text-white/10 uppercase tracking-tighter">Agendado</span>
              )}
            </div>

            {/* Mobile Connection Line */}
            {idx < phases.length - 1 && (
              <div className="h-8 w-[1px] bg-black/5 dark:bg-white/10 mt-6 md:hidden" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
