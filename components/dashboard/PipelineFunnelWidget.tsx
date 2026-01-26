import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FunnelStats } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PipelineProps {
  funnel: FunnelStats;
}

export default function PipelineFunnelWidget({ funnel }: PipelineProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="md:col-span-1 glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 bg-luxury-white/50 dark:bg-black/20 flex flex-col justify-between h-full group hover:border-black/10 dark:hover:border-white/10 transition-all">
       <div className="flex justify-between items-start mb-4">
        <div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 mb-1">{t('pipeline_global')}</h3>
           <p className="text-2xl font-serif italic text-luxury-charcoal dark:text-white">€{(funnel.activeValue / 1000).toFixed(1)}k <span className="text-sm not-italic font-sans opacity-60 text-luxury-charcoal/60 dark:text-white/60">{t('potential')}</span></p>
        </div>
        <button onClick={() => navigate('/calculator')} className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_15px_#D4AF3740]">
            <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
            <FunnelStep label={t('leads')} count={funnel.leads} />
            <FunnelStep label={t('negotiation')} count={funnel.negotiation} isActive />
            <FunnelStep label={t('closed')} count={0} /> {/* Need close data */}
        </div>
        
        <div className="p-3 bg-white/60 dark:bg-white/5 rounded-xl flex justify-between items-center border border-black/5 dark:border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] text-luxury-charcoal/60 dark:text-white/50 font-black uppercase tracking-wider">{t('conversion')}</span>
            <span className="text-xs font-bold text-luxury-charcoal dark:text-white">{funnel.conversionRate > 0 ? `${funnel.conversionRate}%` : '---'}</span>
        </div>
      </div>
    </div>
  );
}

const FunnelStep = ({ label, count, isActive }: { label: string, count: number, isActive?: boolean }) => (
    <div className={`p-2 rounded-lg border ${isActive ? 'bg-luxury-gold/10 border-luxury-gold/20' : 'bg-white/70 dark:bg-white/5 border-black/5 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none'}`}>
        <p className={`text-xl font-serif italic ${isActive ? 'text-luxury-gold' : 'text-luxury-charcoal/70 dark:text-white/60'}`}>{count}</p>
        <p className="text-[8px] font-bold uppercase tracking-wider text-luxury-charcoal/40 dark:text-white/30">{label}</p>
    </div>
)
