import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEur } from '../../utils/vat';
import { useLanguage } from '../../context/LanguageContext';

interface CashflowProps {
  data: {
    overdueNet: number;
    next7Net: number;
    received30d: number;
    projected30d: number;
    vatRateHint: string;
  };
}

export default function CashflowWidget({ data }: CashflowProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="md:col-span-1 glass p-8 rounded-[0.5rem] bg-luxury-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 flex flex-col justify-between h-full group hover:border-emerald-500/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-luxury-charcoal/20 dark:text-white/20">{t('cashflow')}</div>
        <button
           onClick={() => navigate('/financial')}
           className="text-[11px] font-black uppercase tracking-[0.25em] text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white transition-all"
        >
          {t('view_all')} a†’
        </button>
      </div>

      <div>
        <div className="text-3xl font-serif font-bold italic text-luxury-charcoal dark:text-white leading-none">
            {formatEur(data.next7Net || 0)}
        </div>
        <div className="mt-2 text-[9px] sm:text-[10px] text-luxury-charcoal/30 dark:text-white/30 font-black uppercase tracking-[0.2em] sm:tracking-[0.35em]">
            NET a€¢ + IVA A  {data.vatRateHint || 'taxa legal'}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Overdue Block */}
        <div className="p-3 sm:p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
             <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-1">{t('expired')}</div>
             <div className="text-lg sm:text-xl font-mono text-rose-500 dark:text-rose-400">{formatEur(data.overdueNet || 0)}</div>
        </div>
        
        {/* Next 7 Days Block (Projected) */}
        <div className="p-3 sm:p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
             <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-1">{t('next_7_days')}</div>
             <div className="text-lg sm:text-xl font-mono text-luxury-gold">{formatEur(data.next7Net || 0)}</div> // Using next7Net as the primary tracking metric as per V2.1 plan
        </div>
      </div>
    </div>
  );
}
