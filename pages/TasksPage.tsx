
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Zap,
  Circle,
  MoreVertical,
  AlertCircle,
  Sparkles,
  Layers,
  Briefcase,
  Lightbulb,
  FileCheck,
  HardHat,
  PenTool,
  CheckCircle,
  Building,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import { TASK_CATALOG, PHASES_CONFIG, Phase } from '../data/taskCatalog';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/common/PageHeader';
import { Tooltip } from '../components/ui/Tooltip';

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<'MY_TASKS' | 'CATALOG'>('CATALOG');
  const [selectedPhase, setSelectedPhase] = useState<Phase>('COMMERCIAL');
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<any | null>(null);
  const [pendingTask, setPendingTask] = useState<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { t } = useLanguage();
  const Motion = motion as any;

  const loadData = async () => {
    // ... logic preserved ...
    setLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        fa360.listTasks(),
        fa360.listProjects()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading tasks/projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    await fa360.updateTask(taskId, { completed: !currentStatus });
    loadData();
  };

  const onReschedule = async (taskId: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const newDate = today.toISOString().split('T')[0];
    await fa360.updateTask(taskId, { deadline: newDate });
    loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    await fa360.deleteTask(taskId);
    loadData();
    setActiveMenuId(null);
    setSelectedTaskDetail(null);
  };

  const handleChangePriority = async (taskId: string, priority: string) => {
    await fa360.updateTask(taskId, { priority: priority as any });
    loadData();
    setActiveMenuId(null);
  };

  const handleUpdateTaskDetail = async (id: string, updates: any) => {
    if (updates.projectId) {
      const proj = projects.find(p => p.id === updates.projectId);
      updates.projectKey = proj ? proj.title : 'Atelier';
    }
    await fa360.updateTask(id, updates);
    loadData();
    setSelectedTaskDetail((prev: any) => prev ? { ...prev, ...updates } : null);
  };

  const handleImportTask = async (projectId?: string) => {
    if (!pendingTask) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: pendingTask.name,
      deadline: new Date().toISOString().split('T')[0],
      priority: pendingTask.priority === 'critical' || pendingTask.priority === 'high' ? 'High' :
        pendingTask.priority === 'medium' ? 'Medium' : 'Low',
      completed: false,
      projectId: projectId || undefined,
      projectKey: projectId ? projects.find(p => p.id === projectId)?.title : 'Geral',
      estimatedHours: pendingTask.estimatedHours || 0,
      actualHours: 0
    };

    await fa360.saveTask(newTask as any);
    await loadData();
    setPendingTask(null);
    setShowProjectModal(false);
    setActiveTab('MY_TASKS');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCatalog = TASK_CATALOG.filter(t => t.phase === selectedPhase);

  return (
    <div className="animate-in fade-in duration-1000 space-y-16 pb-32">
      <PageHeader 
        kicker={t('tasks_kicker')}
        title={<>{t('tasks_title_prefix')} <span className="text-luxury-gold">{t('tasks_title_suffix')}</span></>}
      />

      <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-xl w-fit mb-12">
        <button
          onClick={() => setActiveTab('MY_TASKS')}
          className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'MY_TASKS' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          {t('tasks_tab_my_list')}
        </button>
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'CATALOG' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          {t('tasks_tab_catalog')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <div className="lg:col-span-9 space-y-12">
          {activeTab === 'CATALOG' ? (
            <div className="space-y-12">
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-4 px-4">
                {(Object.entries(PHASES_CONFIG) as [Phase, any][]).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPhase(key)}
                    className={`px-6 py-4 rounded-2xl border transition-all shrink-0 flex flex-col items-center gap-3 min-w-[120px] ${selectedPhase === key
                      ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold shadow-lg shadow-luxury-gold/5'
                      : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-luxury-charcoal/40 dark:text-white/40 hover:border-black/20 dark:hover:border-white/20'
                      }`}
                  >
                    <Tooltip content={config.label} position="top">
                      <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 ${selectedPhase === key ? 'text-luxury-gold' : 'opacity-40 text-luxury-charcoal dark:text-white'}`}>
                        {key === 'COMMERCIAL' && <Briefcase size={20} />}
                        {key === 'CONCEPT' && <Lightbulb size={20} />}
                        {key === 'PRELIMINARY' && <PenTool size={20} />}
                        {key === 'LICENSING' && <FileCheck size={20} />}
                        {key === 'EXECUTION' && <Layers size={20} />}
                        {key === 'CONSTRUCTION' && <HardHat size={20} />}
                        {key === 'CLOSING' && <CheckCircle size={20} />}
                        {key === 'INTERNAL' && <Building size={20} />}
                      </div>
                    </Tooltip>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">{config.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCatalog.map((task, i) => (
                    <Motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass p-10 rounded-[2.5rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all flex flex-col md:flex-row gap-10 items-start md:items-center relative"
                    >
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-luxury-gold/50">{task.id}</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${task.priority === 'critical' ? 'bg-red-500/10 text-red-500' :
                            task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40'
                            }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white leading-tight">{task.name}</h4>
                        <p className="text-sm font-light text-luxury-charcoal/50 dark:text-white/50 leading-relaxed max-w-3xl">{task.description}</p>

                        <div className="flex flex-wrap gap-4 pt-4">
                          {task.deliverables?.map(d => (
                            <span key={d} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
                              <Target size={12} className="text-luxury-gold" /> {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end gap-6 border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-8 md:pt-0 md:pl-12 min-w-[180px]">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Duracao Est.</p>
                          <p className="text-2xl font-serif text-luxury-charcoal dark:text-white">{task.estimatedHours}h</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Responsavel</p>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-luxury-gold">{task.responsible}</p>
                        </div>
                        <Tooltip content={t('add_to_my_list') || "Adicionar a Minha Lista"} position="left">
                          <button
                            onClick={() => {
                              setPendingTask(task);
                              setShowProjectModal(true);
                            }}
                            className="p-4 bg-luxury-gold text-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-luxury-gold/20"
                          >
                            <Plus size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </Motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <div key={task.id} className={`glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all flex items-center gap-8 ${task.completed ? 'opacity-40' : ''} ${activeMenuId === task.id ? 'z-[100] relative' : 'z-auto'}`}>
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`transition-colors shrink-0 ${task.completed ? 'text-emerald-500' : 'text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold'}`}
                    >
                      {task.completed ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                    </button>
                    <div
                      className="flex-1 cursor-pointer group/card"
                      onClick={() => setSelectedTaskDetail(task)}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        {task.projectKey && (
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-luxury-gold/70 group-hover/card:text-luxury-gold transition-colors">{task.projectKey}</span>
                        )}
                      </div>
                      <h4 className={`text-2xl font-serif italic transition-all group-hover/card:translate-x-1 ${task.completed ? 'line-through text-luxury-charcoal/40 dark:text-white/40' : 'text-luxury-charcoal/90 dark:text-white/90 group-hover/card:text-luxury-charcoal dark:group-hover/card:text-white'}`}>{task.title}</h4>
                      <div className="flex items-center gap-6 mt-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${task.priority === 'Alta' ? 'bg-red-500/20 text-red-500' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/30 dark:text-white/30'
                          }`}>{task.priority || 'Normal'}</span>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                          <Clock size={12} /> {task.deadline || '14:30h'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {!task.completed && (
                         <>
                            <button
                              onClick={(e) => { e.stopPropagation(); onReschedule(task.id); }}
                              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold transition-all"
                            >
                              {t('reschedule')}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTask(task.id, false); }}
                              className="px-6 py-2 rounded-xl bg-luxury-gold text-black text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-luxury-gold/20"
                            >
                              {t('complete')}
                            </button>
                         </>
                       )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                        className={`transition-colors p-2 rounded-full ${activeMenuId === task.id ? 'bg-luxury-gold text-black' : 'text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-charcoal dark:hover:text-white'}`}
                      >
                        <MoreVertical size={24} />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === task.id && (
                          <Motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-full mt-4 w-56 glass border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                          >
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => handleChangePriority(task.id, 'High')}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                              >
                                <Zap size={14} /> Urgente
                              </button>
                               <button
                                onClick={() => handleChangePriority(task.id, 'Medium')}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                              >
                                <Circle size={14} /> Normal
                              </button>
                              <div className="h-[1px] bg-black/5 dark:bg-white/5 my-2 mx-2" />
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/20 dark:text-white/20 hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all"
                              >
                                <AlertCircle size={14} /> Eliminar
                              </button>
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass p-24 rounded-[3rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center text-center space-y-10">
                  <div className="p-12 bg-luxury-gold/5 rounded-full border border-luxury-gold/10">
                    <Sparkles size={64} className="text-luxury-gold animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('tasks_empty_title')}</h3>
                    <p className="text-sm font-light text-luxury-charcoal/50 dark:text-white/50 max-w-sm mx-auto leading-relaxed">
                      {t('tasks_empty_desc')}
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('CATALOG')} className="px-12 py-5 bg-luxury-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-luxury-gold/20">
                    {t('tasks_catalog_explore')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Project Selection Modal */}
        <AnimatePresence>
          {showProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProjectModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              />
              <Motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl glass p-12 rounded-[4rem] border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />
                <div className="space-y-10">
                  <div className="text-center space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('tasks_modal_associate')}</h3>
                    <p className="text-sm font-light text-luxury-charcoal/40 dark:text-white/40 max-w-md mx-auto">{t('tasks_modal_desc')}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                    <button
                      onClick={() => handleImportTask()}
                      className="p-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-luxury-gold/40 hover:bg-luxury-gold/5 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="text-sm font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 group-hover:opacity-100 group-hover:text-luxury-gold transition-all">Geral / Atelier</span>
                      <Target size={18} className="opacity-10 group-hover:opacity-100 group-hover:text-luxury-gold transition-all" />
                    </button>

                    {projects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleImportTask(p.id)}
                        className="p-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-luxury-gold/40 hover:bg-luxury-gold/5 transition-all text-left flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-2">{p.client}</p>
                          <p className="text-2xl font-serif italic text-luxury-charcoal dark:text-white opacity-80 group-hover:opacity-100 transition-all">{p.title}</p>
                        </div>
                        <Plus size={20} className="opacity-10 group-hover:opacity-100 group-hover:text-luxury-gold transition-all" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowProjectModal(false)}
                    className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity"
                  >
                    {t('tasks_btn_close')}
                  </button>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Task Detail Modal */}
        <AnimatePresence>
          {selectedTaskDetail && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTaskDetail(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
              />
              <Motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="relative w-full max-w-4xl glass p-16 rounded-[4rem] border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Layers size={300} />
                </div>

                <div className="space-y-12">
                  <header className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">{selectedTaskDetail.projectKey || 'Geral'}</span>
                      <div className="h-[1px] w-8 bg-black/10 dark:bg-white/10"></div>
                      <span className="text-[10px] font-mono text-luxury-charcoal/30 dark:text-white/30">{selectedTaskDetail.id}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif italic text-luxury-charcoal dark:text-white tracking-tighter leading-tight">
                      {selectedTaskDetail.title}
                    </h2>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('tasks_detail_metrics')}</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-light">
                            <span className="text-luxury-charcoal/50 dark:text-white/50 font-light">Tempo Estimado</span>
                            <span className="text-luxury-charcoal dark:text-white font-bold">{selectedTaskDetail.estimatedHours || 0}h</span>
                          </div>
                          <div className="flex justify-between text-xs font-light">
                            <span className="text-luxury-charcoal/50 dark:text-white/50 font-light">Tempo Real Executado</span>
                            <span className="text-luxury-gold font-bold">{selectedTaskDetail.actualHours || 0}h</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <Motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(((selectedTaskDetail.actualHours || 0) / (selectedTaskDetail.estimatedHours || 1)) * 100, 100)}%` }}
                              className="h-full bg-luxury-gold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('tasks_detail_context')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl space-y-2">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30">Prioridade</p>
                            <p className="text-sm font-serif italic text-luxury-charcoal dark:text-white">{selectedTaskDetail.priority}</p>
                          </div>
                          <div className="p-6 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl space-y-2">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30">Status</p>
                            <p className="text-sm font-serif italic text-luxury-charcoal dark:text-white">{selectedTaskDetail.completed ? 'Concluida' : 'Em Curso'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('tasks_detail_assign')}</h4>
                        <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                          <button
                            onClick={() => handleUpdateTaskDetail(selectedTaskDetail.id, { projectId: undefined, projectKey: 'Geral' })}
                            className={`p-4 rounded-xl text-left transition-all text-[10px] font-bold uppercase tracking-widest ${!selectedTaskDetail.projectId ? 'bg-luxury-gold text-black' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10'}`}
                          >
                            Atelier (Geral)
                          </button>
                          {projects.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleUpdateTaskDetail(selectedTaskDetail.id, { projectId: p.id })}
                              className={`p-4 rounded-xl text-left transition-all text-[10px] font-bold uppercase tracking-widest ${selectedTaskDetail.projectId === p.id ? 'bg-luxury-gold text-black' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10'}`}
                            >
                              {p.title}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex gap-4">
                        <button
                          onClick={() => handleDeleteTask(selectedTaskDetail.id)}
                          className="flex-1 py-4 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/10 transition-all"
                        >
                          {t('tasks_btn_delete')}
                        </button>
                        <button
                          onClick={() => setSelectedTaskDetail(null)}
                          className="flex-1 py-4 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                        >
                          {t('tasks_btn_close')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Sidebar Insights */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="glass p-10 rounded-[3.5rem] border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold text-center">Status Operacional</h3>
            <div className="space-y-12">
              <div className="text-center group cursor-default">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-3 group-hover:text-luxury-gold transition-colors">Concluidas</p>
                <p className="text-5xl font-serif text-luxury-charcoal dark:text-white">{tasks.filter(t => t.completed).length}</p>
              </div>
              <div className="text-center group cursor-default">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-3 group-hover:text-luxury-gold transition-colors">Ativas</p>
                <p className="text-5xl font-serif text-luxury-charcoal dark:text-white">{tasks.filter(t => !t.completed).length}</p>
              </div>
            </div>

            <div className="pt-10 border-t border-black/5 dark:border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                <span>{t('tasks_status_efficiency')}</span>
                <span>{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</span>
              </div>
              <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-luxury-gold transition-all duration-1000"
                  style={{ width: tasks.length > 0 ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-luxury-gold/5 rounded-[3.5rem] border border-luxury-gold/10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={60} />
            </div>
            <div className="flex items-center gap-3 text-luxury-gold">
              <AlertCircle size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fluxo Sugerido</span>
            </div>
            <p className="text-xs italic font-light text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
              Sugerimos importar a fase de **"Estudo Previo"** para o Projeto Douro. O catalogo contem 14 tarefas criticas de conformidade.
            </p>
            <button className="w-full py-4 border border-luxury-gold/30 text-luxury-gold rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all">
              Optimizar Workflow
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

