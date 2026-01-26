import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface TodayOpsProps {
  data: {
    overdueTasksCount: number;
    next7TasksCount: number;
    next7PaymentsCount: number;
  };
}

export default function TodayOpsWidget({ data }: TodayOpsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="md:col-span-1 glass p-8 rounded-[0.5rem] bg-luxury-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 flex flex-col justify-between h-full group hover:border-black/10 dark:hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[9px] font-black uppercase tracking-[0.45em] text-luxury-charcoal/20 dark:text-white/20">{t('today_ops')}</div>
        <button
          onClick={() => navigate('/tasks')}
          className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-gold hover:brightness-110 transition-all"
        >
          {t('open_day')} →
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Overdue Block */}
        <div className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="text-[9px] font-black uppercase tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-2">{t('delayed')}</div>
          <div className="text-2xl font-serif font-bold italic text-rose-500 dark:text-rose-400">{data.overdueTasksCount}</div>
        </div>

        {/* Next 7 Days Block */}
        <div className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="text-[9px] font-black uppercase tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-2">{t('days_7')}</div>
          <div className="text-2xl font-serif font-bold italic text-luxury-gold">{data.next7TasksCount}</div>
        </div>

        {/* Payments Block */}
        <div className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="text-[9px] font-black uppercase tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-2">{t('rec')}</div>
          <div className="text-2xl font-serif font-bold italic text-luxury-gold">{data.next7PaymentsCount}</div>
        </div>
      </div>
    </div>
  );
}
