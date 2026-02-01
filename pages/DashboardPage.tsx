import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import fa360 from '../services/fa360';
import { dashboardDataService } from '../services/dashboardData.service'; // NEW Service
import { useLanguage } from '../context/LanguageContext';
import TodayOpsWidget from '../components/dashboard/TodayOpsWidget';
import DayPanel from '../components/dashboard/DayPanel';
import CriticalAlertsWidget from '../components/dashboard/CriticalAlertsWidget';
import HealthIndexWidget from '../components/dashboard/HealthIndexWidget';
import CashflowWidget from '../components/dashboard/CashflowWidget';
import PageHeader from '../components/common/PageHeader';
import SkeletonCard from '../components/common/SkeletonCard';
import { DashboardMetrics } from '../types';

export default function Dashboard() {
  console.log("MOUNT: DashboardPage");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  // New View Model State
  const [vm, setVm] = useState<any>(null);

  const loadData = async () => {
    try {
      // 1. Fetch Raw Data
      const [tasks, payments, projects, proposals, timeLogs, dailyBriefing, meetings] = await Promise.all([
         fa360.listTasks(),
         fa360.listPayments ? fa360.listPayments() : Promise.resolve([]), 
         fa360.listProjects(),
         fa360.listProposals(),
         fa360.listTimeLogs ? fa360.listTimeLogs() : Promise.resolve([]),
         fa360.getDailyBriefing(),
         fa360.listEvents ? fa360.listEvents() : Promise.resolve([])
      ]);

      // 2. Build View Model via Service
      const built = await dashboardDataService.build({ 
          tasks: tasks || [], 
          payments: payments || [], 
          projects: projects || [],
          proposals: proposals || [],
          timeEntries: timeLogs.map((l: any) => ({
            date: l.date,
            owner: l.userId === 'user-ceo' ? 'CEO' : l.userId === 'user-jessica' ? 'JESSICA' : l.userId === 'user-sofia' ? 'SOFIA' : l.owner || 'OUTRO',
            hours: (l.duration || 0) / 60,
            projectId: l.projectId
          })),
          syncLog: dailyBriefing?.metrics?.neuralStatus,
          meetings: meetings || []
      });
      
      setVm(built);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('fa-sync-complete', loadData);
    return () => window.removeEventListener('fa-sync-complete', loadData);
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting_morning');
    if (hour < 18) return t('greeting_afternoon');
    return t('greeting_evening');
  };

  if (loading || !vm) return (
    <div className="p-8 space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} variant="metric" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      <PageHeader 
        kicker={t('op_command')}
        title={<>{getTimeGreeting()}, <span className="text-luxury-gold">Ferreira.</span></>}
        statusIndicator={true}
        actionLabel={t('newProposal')}
        onAction={() => navigate('/calculator?templateId=MORADIA_LICENSE')}
      />

      {/* 2. Painel do Dia (Full Width / Top Priority) */}
      <div className="w-full">
         <DayPanel data={vm.dailyHighlights} />
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
         <TodayOpsWidget data={vm.todayOps} />
         <CashflowWidget data={vm.cash30d} />
         <HealthIndexWidget score={vm.health.score} breakdown={vm.health.breakdown} reason={vm.projects.length > 0 ? (vm.health.score === 100 ? t('op_stable') : t('op_threat')) : t('op_neutral')} />
         <div className="lg:col-span-1">
            <CriticalAlertsWidget alerts={vm.criticalAlerts} />
         </div>
      </div>
    
      {/* 4. Active Projects List from VM */}
      <div className="space-y-6 pt-6">

          <div className="flex justify-between items-end">
              <h2 className="text-2xl font-serif italic text-luxury-charcoal dark:text-white relative pl-6">
                 <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-luxury-gold"></span>
                 {t('projects')} <span className="text-luxury-gold">{t('active_suffix')}</span>
              </h2>
              <button onClick={() => navigate('/projects')} className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white transition-colors">
                  {t('view_all')}
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vm.projects.length > 0 ? (
                  vm.projects.map((project: any) => (
                      <motion.div 
                          key={project.id}
                          whileHover={{ y: -5 }}
                          className="glass p-6 rounded-xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all cursor-pointer relative overflow-hidden"
                          onClick={() => navigate(`/projects/${project.id}`)}
                      >
                          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight size={16} className="-rotate-45 text-luxury-gold" />
                          </div>

                          <div className="space-y-4">
                              <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-luxury-gold mb-2">{project.client}</p>
                                  <h4 className="text-xl font-serif italic text-luxury-charcoal dark:text-white line-clamp-2">{project.name}</h4>
                              </div>
                              
                              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                      project.status === 'Em Curso' ? 'bg-emerald-500/10 text-emerald-500' : 
                                      'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40'
                                  }`}>
                                      {project.status || 'Active'}
                                  </span>
                              </div>
                          </div>
                      </motion.div>
                  ))
              ) : (
                  <div className="col-span-full py-20 text-center opacity-30">
                      <p className="text-[10px] uppercase font-black tracking-widest">{t('no_active_projects')}</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

