import SpotlightCard from '../ui/SpotlightCard';
import { Play, MoreVertical, Plus, DollarSign, Activity, Clock } from 'lucide-react';
import { useTimer } from '../../context/TimeContext';
import { useState } from 'react';

const Badge = ({ text, tone }: { text: string; tone: 'ok'|'warn'|'risk' }) => {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
      : tone === 'warn'
      ? 'bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold'
      : 'bg-rose-500/10 border-rose-500/20 text-rose-400';

  return (
    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.25em] ${cls}`}>
      {text}
    </span>
  );
};

export const ActiveProjectsCard: React.FC<{
  projects: any[];
  onOpenProject?: (projectId: string) => void;
  onOpenAll?: () => void;
}> = ({ projects, onOpenProject, onOpenAll }) => {
  const { start, isActive, activeProject } = useTimer();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  return (
    <SpotlightCard className="p-8 rounded-[0.5rem] bg-white/[0.02] border-white/5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-white/20">
          PROJETOS ATIVOS
        </div>
        <button
          onClick={onOpenAll}
          className="text-[11px] font-black uppercase tracking-[0.25em] text-luxury-gold hover:brightness-110 transition-all"
        >
          Ver todos a†’
        </button>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="p-10 bg-white/[0.02] border border-white/5 border-dashed rounded-xl text-white/35 italic text-center">
          Sem projetos ativos. Cria uma proposta para iniciar pipeline.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.slice(0, 5).map((p) => {
            const hasRisk = !!p.riskFlag;
            const tone = hasRisk ? 'risk' : 'ok';
            const badgeText = hasRisk ? 'Risco' : (String(p.status).toUpperCase() || 'ATIVO');

            return (
              <button
                key={p.projectId}
                onClick={() => onOpenProject?.(p.projectId)}
                className="w-full text-left p-5 bg-black/30 border border-white/5 rounded-[0.5rem] hover:border-luxury-gold/30 transition-all group"
              >
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-bold text-white/85 truncate group-hover:text-white transition-colors">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-luxury-gold shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-all duration-1000" 
                            style={{ width: `${p.progress}%` }} 
                          />
                        </div>
                        <span className="text-[9px] font-black text-luxury-gold/60">{p.progress}%</span>
                      </div>
                      <div className="text-[11px] text-white/35 truncate mt-1">
                        {p.client ? `Cliente: ${p.client}` : 'Cliente: a€”'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isActive && activeProject?.id === p.projectId ? (
                        <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center animate-pulse">
                            <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        </div>
                        ) : (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                start({ id: p.projectId, name: p.name });
                            }}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all group/play"
                        >
                            <Play size={10} className="fill-current group-hover/play:scale-110 transition-transform" />
                        </button>
                        )}

                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenu(openMenu === p.projectId ? null : p.projectId);
                                }}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            >
                                <MoreVertical size={14} />
                            </button>

                            {openMenu === p.projectId && (
                                <div className="absolute right-0 top-10 w-48 glass rounded-2xl border border-white/10 shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                    <button className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-luxury-gold hover:bg-white/5 flex items-center gap-3">
                                        <Plus size={12} /> Adicionar Tarefa
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-luxury-gold hover:bg-white/5 flex items-center gap-3">
                                        <DollarSign size={12} /> Registar Gasto
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-luxury-gold hover:bg-white/5 flex items-center gap-3">
                                        <Activity size={12} /> Ver Timeline
                                    </button>
                                </div>
                            )}
                        </div>
                        <Badge text={badgeText} tone={tone} />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock size={10} className="text-white/20 shrink-0" />
                    <span className="text-[11px] text-white/40 truncate">
                      {p.nextMilestone}
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-luxury-gold flex items-center gap-1.5">
                    <Activity size={8} /> {p.totalHours}h
                  </div>
                </div>

                {hasRisk && (
                  <div className="mt-3 p-3 bg-rose-500/5 rounded-lg text-[11px] text-rose-300/80 italic border border-rose-500/10">
                    {p.riskFlag}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </SpotlightCard>
  );
};
