import React from 'react';
import { Users, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ProductionStats } from '../../types';

interface ProductionProps {
  stats: ProductionStats[];
}

export default function ProductionWidget({ stats }: ProductionProps) {
  const { t } = useLanguage();
  return (
    <div className="md:col-span-2 glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 bg-luxury-white/80 dark:bg-black/20 flex flex-col justify-center h-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2">
            <Users size={14} /> {t('weekly_prod')}
         </h3>
         <span className="text-[11px] font-mono text-luxury-charcoal/30 dark:text-white/30">{t('prod_subtitle')}</span>
      </div>

      <div className="space-y-4">
        {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs text-luxury-charcoal/80 dark:text-white/80 font-medium">
                    <span>{stat.member}</span>
                    <span className="font-mono text-luxury-charcoal/40 dark:text-white/40">{stat.actualHours}h <span className="text-luxury-charcoal/20 dark:text-white/20">/ {stat.plannedHours}h</span></span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-luxury-gold/80 rounded-full" style={{ width: `${(stat.actualHours / stat.plannedHours) * 100}%` }}></div>
                </div>
            </div>
        ))}
         {stats.length === 0 && <p className="text-xs text-luxury-charcoal/30 dark:text-white/30 italic text-center py-4">{t('no_prod_data')}</p>}
      </div>
    </div>
  );
}
