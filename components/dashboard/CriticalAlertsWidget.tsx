import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import fa360 from '../../services/fa360';
import { buildPaymentReminderPT, buildPaymentReminderEN } from '../../utils/paymentReminder';
import { CopyModal } from './CopyModal';
import { Check, Clock, Bell } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface CriticalAlertsProps {
  alerts: any[];
}

export default function CriticalAlertsWidget({ alerts }: CriticalAlertsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [modal, setModal] = useState({ open: false, title: '', text: '' });
  const empty = alerts.length === 0;

  const onComplete = async (taskId: string) => {
    await fa360.updateTask(taskId, { completed: true });
    window.dispatchEvent(new CustomEvent('fa-sync-complete'));
  };

  const onReschedule = async (taskId: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const newDate = today.toISOString().split('T')[0];
    await fa360.updateTask(taskId, { deadline: newDate });
    window.dispatchEvent(new CustomEvent('fa-sync-complete'));
  };

  const openReminder = (a: any) => {
    // Attempt to extract payment info from alert if possible, or use fallback
    const textPT = buildPaymentReminderPT({
      client: a.client || 'Cliente',
      project: a.projectName || 'Projeto',
      milestone: a.message.replace('Pagamento vencido: ', ''),
      amountNet: a.amountNet || 0,
      vatRate: a.vatRate || 0.23,
      dueDate: a.dueDate || new Date().toISOString()
    });

    const textEN = buildPaymentReminderEN({
      client: a.client || 'Client',
      project: a.projectName || 'Project',
      milestone: a.message.replace('Payment overdue: ', ''),
      amountNet: a.amountNet || 0,
      vatRate: a.vatRate || 0.23,
      dueDate: a.dueDate || new Date().toISOString()
    });

    setModal({
      open: true,
      title: `Lembrete de Pagamento (PT/EN)`,
      text: `${textPT}\n\n---\n\n${textEN}`,
    });
  };

  return (
    <div className="md:col-span-1 glass p-8 rounded-[0.5rem] bg-luxury-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 flex flex-col h-full group hover:border-red-500/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[9px] font-black uppercase tracking-[0.45em] text-luxury-charcoal/20 dark:text-white/20">{t('critical_alerts')}</div>
        <button
          onClick={() => navigate('/tasks')} // Generalize to 'Resolve' center later
          className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white transition-all"
        >
          {t('resolve')} →
        </button>
      </div>

      {empty ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[0.25rem]">
          <span className="text-emerald-500 dark:text-emerald-400 text-sm italic font-medium">{t('no_critical_blocks')}</span>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-1 no-scrollbar max-h-[250px]">
          {alerts.slice(0, 5).map((a, idx) => (
             <div key={idx} className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-xl text-xs text-luxury-charcoal/80 dark:text-white/80 border-l-2 border-l-rose-500 shadow-sm dark:shadow-none transition-all hover:bg-black/5 dark:hover:bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="truncate font-medium">{a.message}</p>
                    {a.daysLate && <p className="text-[9px] font-mono text-rose-500 mt-1">+{a.daysLate}d atraso</p>}
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                   {a.type === 'TASK_OVERDUE' && (
                     <>
                       <Tooltip content={t('reschedule')} position="top">
                         <button 
                          onClick={() => onReschedule(a.id)}
                          className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold transition-colors"
                         >
                            <Clock size={14} />
                         </button>
                       </Tooltip>
                       <button 
                        onClick={() => onComplete(a.id)}
                        className="px-4 py-2 bg-luxury-gold text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                       >
                          <Check size={12} /> {t('complete') || 'Concluir'}
                       </button>
                     </>
                   )}
                   {a.type === 'PAYMENT_OVERDUE' && (
                     <button 
                      onClick={() => openReminder(a)}
                      className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold hover:border-luxury-gold/30 transition-all flex items-center gap-2"
                     >
                        <Bell size={12} /> {t('remind') || 'Lembrar'}
                     </button>
                   )}
                   {(a.type !== 'TASK_OVERDUE' && a.type !== 'PAYMENT_OVERDUE') && (
                      <button 
                        onClick={() => a.actionUrl && navigate(a.actionUrl)}
                        className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest"
                      >
                         {t('view') || 'Ver'}
                      </button>
                   )}
                </div>
            </div>
          ))}
        </div>
      )}

      <CopyModal 
        open={modal.open} 
        title={modal.title} 
        text={modal.text} 
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
}
