import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
    variant?: 'default' | 'gold' | 'success' | 'warning' | 'error';
}

export default function MetricCard({
    label,
    value,
    trend,
    trendUp = true,
    icon,
    variant = 'default'
}: MetricCardProps) {

    const variants = {
        default: 'bg-white/[0.02]',
        gold: 'bg-luxury-gold/[0.05] border-luxury-gold/20',
        success: 'bg-emerald-500/[0.05] border-emerald-500/20',
        warning: 'bg-amber-500/[0.05] border-amber-500/20',
        error: 'bg-red-500/[0.05] border-red-500/20',
    };

    const iconBg = {
        default: 'bg-white/10 text-luxury-gold',
        gold: 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/30',
        success: 'bg-emerald-500/20 text-emerald-500',
        warning: 'bg-amber-500/20 text-amber-500',
        error: 'bg-red-500/20 text-red-500',
    };

    return (
        <div className={`
      glass p-8 rounded-[2rem] border-white/10 
      card-interactive group
      ${variants[variant]}
    `}>
            {/* Icon */}
            <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-6
        transition-all duration-300
        group-hover:scale-110
        ${iconBg[variant]}
      `}>
                {icon}
            </div>

            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
                {label}
            </p>

            {/* Value + Trend */}
            <div className="flex items-end gap-3">
                <p className="text-4xl font-black italic text-white tracking-tight">
                    {value}
                </p>
                {trend && (
                    <span className={`
            text-sm font-bold pb-1 flex items-center gap-1
            ${trendUp ? 'text-emerald-500' : 'text-red-500'}
          `}>
                        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

