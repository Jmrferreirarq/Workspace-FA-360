import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        type_key: string;
        client?: string;
        progress: number;
        status: 'active' | 'warning' | 'critical' | 'completed';
        lastUpdate?: string;
        deadline?: string;
        area?: string;
    };
    onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const statusConfig = {
        active: {
            border: 'border-l-emerald-500',
            bg: 'bg-emerald-500/5',
            dot: 'bg-emerald-500',
            label: t('status_construction'), // Using best fit existing keys or defaults
            labelColor: 'text-emerald-500',
        },
        warning: {
            border: 'border-l-amber-500',
            bg: 'bg-amber-500/5',
            dot: 'bg-amber-500 animate-pulse',
            label: t('status_warning'),
            labelColor: 'text-amber-500',
        },
        critical: {
            border: 'border-l-red-500',
            bg: 'bg-red-500/5',
            dot: 'bg-red-500 animate-pulse',
            label: 'URGENT', // Keep urgent global
            labelColor: 'text-red-500',
        },
        completed: {
            border: 'border-l-white/20',
            bg: 'bg-white/[0.02] opacity-60',
            dot: 'bg-white/40',
            label: t('closed'),
            labelColor: 'text-white/40',
        },
    };

    const config = statusConfig[project.status];

    const progressColor = {
        active: 'from-emerald-500 to-emerald-400',
        warning: 'from-amber-500 to-amber-400',
        critical: 'from-red-500 to-red-400',
        completed: 'from-white/40 to-white/20',
    };

    return (
        <div
            onClick={() => navigate(`/projects/${project.id}`)}
            className={`
        glass p-8 rounded-[2rem] cursor-pointer
        border-l-4 ${config.border} ${config.bg}
        card-interactive shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all
        bg-white dark:bg-transparent
      `}
        >
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-widest ${config.labelColor}`}>
                    {config.label}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black italic text-luxury-charcoal dark:text-white mb-2">
                {project.name}
            </h3>

            {/* Meta */}
            <p className="text-xs text-luxury-charcoal/50 dark:text-white/50 mb-6">
                {project.type_key} {project.area && `a€¢ ${project.area}`}
            </p>

            {/* Progress bar */}
            <div className="space-y-3">
                <div className="flex justify-between text-[11px]">
                    <span className="text-luxury-charcoal/50 dark:text-white/50">{t('card_progress')}</span>
                    <span className={`font-bold ${config.labelColor}`}>{project.progress}%</span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${progressColor[project.status]} rounded-full transition-all duration-1000`}
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                {project.status === 'warning' && project.lastUpdate && (
                    <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle size={14} />
                        <span className="text-[11px] font-bold">{t('card_no_update')} {project.lastUpdate}</span>
                    </div>
                )}

                {project.status === 'critical' && project.deadline && (
                    <div className="flex items-center gap-2 text-red-500">
                        <Clock size={14} />
                        <span className="text-[11px] font-bold">{t('card_deadline_in')} {project.deadline}</span>
                    </div>
                )}

                {(project.status === 'active' || project.status === 'completed') && (
                    <span className="text-[11px] text-luxury-charcoal/40 dark:text-white/40">
                        {t('card_updated_ago')} {project.lastUpdate || '2h'}
                    </span>
                )}

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`${t('card_msg_delete')} "${project.name}"?`)) {
                                onDelete(project.id);
                            }
                        }}
                        className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-red-500 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

