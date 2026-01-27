import React from 'react';
import { Database, Wifi, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface NeuralSyncProps {
  status: {
    status: 'ONLINE' | 'OFFLINE';
    lastSync?: string;
    message?: string;
  };
}

export default function NeuralSyncWidget({ status }: NeuralSyncProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isOnline = status.status === 'ONLINE';

  return (
    <div className={`md:col-span-1 glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 flex flex-col justify-between h-full ${isOnline ? 'bg-luxury-gold/[0.05] dark:bg-luxury-gold/[0.02]' : 'bg-rose-500/[0.05] dark:bg-red-500/[0.02]'} shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none transition-all`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isOnline ? 'bg-luxury-gold/10' : 'bg-white/40 dark:bg-white/5'}`}>
                <Database size={18} className={isOnline ? 'text-luxury-gold' : 'text-luxury-charcoal/30 dark:text-white/30'} />
            </div>
            <div>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 mb-0.5">{t('neural_sync')}</h3>
                 <p className={`text-xs font-bold ${isOnline ? 'text-emerald-500' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>{status.status}</p>
            </div>
        </div>
        {!isOnline && <button onClick={() => navigate('/antigravity')} className="text-[11px] font-bold text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold">{t('configure')}</button>}
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5">
             <span className="text-luxury-charcoal/40 dark:text-white/40 font-mono">{t('last_sync')}</span>
             <span className="text-luxury-charcoal/70 dark:text-white/70">{status.lastSync ? new Date(status.lastSync).toLocaleTimeString() : '--:--'}</span>
        </div>
        
        {isOnline ? (
             <button className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 flex items-center justify-center gap-2">
                 <RefreshCw size={10} /> {t('force_sync')}
             </button>
        ) : (
            <div className="flex items-center gap-2 text-[11px] text-rose-500 dark:text-red-400/80 italic">
                <AlertTriangle size={12} />
                <span>{status.message}</span>
            </div>
        )}
      </div>
    </div>
  );
}
