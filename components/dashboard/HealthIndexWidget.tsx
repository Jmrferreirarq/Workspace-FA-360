import React from 'react';
import { Activity, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface HealthIndexProps {
  score: number;
  breakdown: {
    deadlines: number;
    cash: number;
    production: number;
    risk: number;
  };
  reason: string;
}

export default function HealthIndexWidget({ score, breakdown, reason }: HealthIndexProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getHealthColor = (val: number) => {
    if (val >= 90) return 'text-emerald-500 bg-emerald-500';
    if (val >= 70) return 'text-luxury-gold bg-luxury-gold';
    return 'text-red-500 bg-red-500';
  };

  const colorClass = getHealthColor(score);
  const textColor = colorClass.split(' ')[0];
  const bgColor = colorClass.split(' ')[1];

  return (
    <div className="md:col-span-1 glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 bg-luxury-white/50 dark:bg-black/20 flex flex-col justify-between h-full relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all">
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 mb-1">{t('health_index')}</h3>
          <div className="flex items-baseline gap-1">
             <span className={`text-4xl font-serif italic ${textColor}`}>{score}%</span>
             <span className={`text-[10px] font-bold uppercase ${textColor} opacity-80`}>{score > 90 ? t('status_excellent') : t('status_warning')}</span>
          </div>
        </div>
        <Activity size={20} className={`${textColor} opacity-50`} />
      </div>

      <div className="my-4 space-y-3">
         <HealthBar label={t('deadlines')} value={breakdown.deadlines} />
         <HealthBar label={t('cash')} value={breakdown.cash} />
         <HealthBar label={t('production')} value={breakdown.production} />
         <HealthBar label={t('risk')} value={breakdown.risk} />
      </div>

       <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
         <p className="text-[10px] text-luxury-charcoal/50 dark:text-white/50 italic leading-relaxed">
            "{reason}"
         </p>
       </div>
    </div>
  );
}

const HealthBar = ({ label, value }: { label: string, value: number }) => {
    let color = 'bg-emerald-500';
    if (value < 70) color = 'bg-luxury-gold';
    if (value < 50) color = 'bg-red-500';

    return (
        <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase text-luxury-charcoal/40 dark:text-white/40 w-16 text-right">{label}</span>
            <div className="flex-1 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
}
