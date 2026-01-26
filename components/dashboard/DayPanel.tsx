import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface DayPanelProps {
  data: {
    urgentTasks: any[];
    urgentPayments: any[];
    idleProjects: any[];
  };
}

export default function DayPanel({ data }: DayPanelProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const hasHighlights = data.urgentTasks.length > 0 || data.urgentPayments.length > 0 || data.idleProjects.length > 0;

  if (!hasHighlights) {
    return (
      <div className="glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center border-black/5 dark:border-white/5 bg-emerald-500/5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
          <Clock className="text-emerald-500" size={32} />
        </div>
        <h3 className="text-2xl font-serif italic text-luxury-charcoal dark:text-white mb-2">{t('day_panel_title')}</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">{t('day_panel_no_urgent')}</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden rounded-[2.5rem] border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-2xl">
      <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
        <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white flex items-center gap-3">
          <span className="w-8 h-[1px] bg-luxury-gold"></span>
          {t('day_panel_title')}
        </h3>
        <button onClick={() => navigate('/tasks')} className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold hover:opacity-70 transition-opacity">
          {t('view_all')} →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/5">
        
        {/* SECTION: URGENTE */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={16} className="text-rose-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">{t('day_panel_urgent')}</h4>
          </div>
          <div className="space-y-4">
            {data.urgentTasks.length > 0 ? data.urgentTasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => navigate('/tasks')}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">{task.title}</span>
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter whitespace-nowrap ml-2">{t('day_panel_due_today')}</span>
                </div>
                {task.projectKey && <p className="text-[9px] font-bold text-luxury-charcoal/40 dark:text-white/40 uppercase tracking-widest">{task.projectKey}</p>}
              </div>
            )) : (
              <p className="text-[10px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

        {/* SECTION: FINANCEIRO */}
        <div className="p-8 space-y-6 bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard size={16} className="text-luxury-gold" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">{t('day_panel_financial')}</h4>
          </div>
          <div className="space-y-4">
            {data.urgentPayments.length > 0 ? data.urgentPayments.map((pay) => (
              <div 
                key={pay.id} 
                onClick={() => navigate('/financial')}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">{pay.title}</span>
                  <span className="text-[10px] font-serif italic text-luxury-gold">{Math.round(pay.amountNet).toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter text-luxury-charcoal/40 dark:text-white/40">
                  <span>{pay.status}</span>
                  <span>{new Date(pay.date).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <p className="text-[10px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

        {/* SECTION: STANDBY */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={16} className="text-luxury-charcoal/40 dark:text-white/40" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/40 dark:text-white/40">{t('day_panel_attention')}</h4>
          </div>
          <div className="space-y-4">
            {data.idleProjects.length > 0 ? data.idleProjects.map((proj) => (
              <div 
                key={proj.id} 
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="group cursor-pointer"
              >
                <h5 className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1 mb-1">{proj.name || proj.title}</h5>
                <p className="text-[9px] font-black text-rose-500/70 uppercase tracking-tighter">
                  {t('day_panel_idle_desc')} {Math.floor((Date.now() - new Date(proj.nextActionDate || Date.now()).getTime()) / (1000 * 3600 * 24))} {t('day_panel_days')}
                </p>
              </div>
            )) : (
              <p className="text-[10px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
