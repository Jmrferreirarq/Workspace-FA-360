
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Layers } from 'lucide-react';
import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from '../components/common/ProjectCard';
import SkeletonCard from '../components/common/SkeletonCard';
import PageHeader from '../components/common/PageHeader';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const PHASES = [
    { id: 'PB', label_key: 'status_base_proposal' as const },
    { id: 'EP', label_key: 'status_planning' as const },
    { id: 'LIC', label_key: 'status_licensing' as const },
    { id: 'PE', label_key: 'status_construction' as const }
  ];

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await fa360.listProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleDeleteProject = async (id: string) => {
    await fa360.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProjectStatus = (project: any): 'active' | 'warning' | 'critical' | 'completed' => {
    if (project.progress >= 100) return 'completed';
    // Simplified status logic for demo
    if (project.daysWithoutUpdate > 14) return 'warning';
    if (project.daysToDeadline && project.daysToDeadline <= 3) return 'critical';
    return 'active';
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <PageHeader 
        kicker={t('proj_kicker')}
        title={<>{t('proj_title_prefix')} <span className="text-luxury-gold">{t('proj_title_suffix')}</span></>}
        actionLabel={t('calculator')}
        onAction={() => navigate('/calculator')}
      />

      {projects.length === 0 && !loading ? (
        <div className="py-40 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 opacity-40 text-center bg-luxury-white/30 dark:bg-white/[0.02]">
          <div className="p-10 bg-luxury-gold/5 dark:bg-white/5 rounded-full border border-luxury-gold/10 dark:border-white/5 text-luxury-gold dark:text-white">
            <Layers size={48} className="opacity-20" />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('proj_standby_title')}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal dark:text-white">{t('proj_standby_desc')}</p>
          </div>
          <button onClick={() => navigate('/calculator')} className="px-10 py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">{t('newProposal')}</button>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {PHASES.map((phase) => (
            <div key={phase.id} className="min-w-[320px] space-y-6">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">{t(phase.label_key)}</h3>
                <span className="text-[10px] font-mono text-luxury-charcoal/20 dark:text-white/20">
                  {projects.filter(p => p.status_key === phase.label_key).length}
                </span>
              </div>
              <div className="space-y-4">
                {loading ? (
                  [1, 2].map(i => <SkeletonCard key={i} variant="project" />)
                ) : (
                  projects.filter(p => p.status_key === phase.label_key).map(project => (
                    <ProjectCard
                      key={project.id}
                      project={{
                        ...project,
                        status: getProjectStatus(project),
                        lastUpdate: '2h',
                        deadline: project.daysToDeadline ? `${project.daysToDeadline} dias` : undefined,
                      }}
                      onDelete={handleDeleteProject}
                    />
                  ))
                )}
                <button className="w-full py-4 rounded-[2rem] border border-dashed border-black/5 dark:border-white/5 text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold text-xs font-bold uppercase tracking-widest transition-all">
                  + {t('calc_add')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

