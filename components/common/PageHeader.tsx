import React from 'react';

interface PageHeaderProps {
  kicker?: string;
  title: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  statusIndicator?: boolean;
  customStatus?: React.ReactNode;
}

export default function PageHeader({ 
  kicker, 
  title, 
  actionLabel, 
  onAction,
  statusIndicator = false,
  customStatus
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/5 mb-8">
      <div>
         {kicker && (
           <div className="flex items-center gap-3 mb-2">
              {statusIndicator && <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>}
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/40 dark:text-white/40">{kicker}</p>
           </div>
         )}
         <h1 className="text-4xl md:text-5xl font-serif italic text-luxury-charcoal dark:text-white leading-none">
           {title}
         </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {customStatus}
        
        {actionLabel && onAction && (
            <button 
              onClick={onAction} 
              className="px-8 py-4 bg-luxury-gold text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_#D4AF3730] flex items-center gap-2"
            >
                {actionLabel}
            </button>
        )}
      </div>
    </div>
  );
}
