
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Circle,
  Clock,
  Paperclip,
  Plus,
  MoreVertical,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  FileText,
  CheckSquare,
  Sparkles,
  Sun,
  Download,
  ArrowLeft,
  AlertTriangle,
  Play
} from 'lucide-react';
import fa360 from '../services/fa360';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { useTimer } from '../context/TimeContext';
import { buildPaymentReminderPT, buildPaymentReminderEN } from '../utils/paymentReminder';
import { ProjectTimeline } from '../components/project/ProjectTimeline';
import { CopyModal } from '../components/dashboard/CopyModal';
import { Tooltip } from '../components/ui/Tooltip';


interface ProjectPayment {
  id: string;
  phase_key: string;
  value: number;
  status: string;
}

interface ProjectDiaryItem {
  id: string;
  date: string;
  title: string;
  author: string;
}

interface ProjectData {
  id: string;
  name: string;
  client: string;
  status: string;
  status_key: string;
  type_key: string;
  lastUpdate?: number;
  nextAction?: string;
  nextActionDate?: string;
  progress: number;
  payments: ProjectPayment[];
  diary: ProjectDiaryItem[];
}

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState('TASKS');
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const { start, activeProject, isActive } = useTimer();
  // eslint-disable-next-line
  const now = Date.now(); // Fix impurity warning

  const tabs = [
    { id: 'TASKS', label: t('proj_tasks'), icon: <CheckSquare size={16} /> },
    { id: 'DIARY', label: t('proj_diary'), icon: <FileText size={16} /> },
    { id: 'PAYMENTS', label: t('proj_payments'), icon: <DollarSign size={16} /> },
    { id: 'FILES', label: t('proj_files'), icon: <Paperclip size={16} /> },
    { id: 'MARKETING', label: t('proj_marketing'), icon: <ImageIcon size={16} /> },
    { id: 'TIMELOGS', label: 'Horas', icon: <Clock size={16} /> },
    { id: 'TIMELINE', label: t('proj_timeline'), icon: <Calendar size={16} /> },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const all = await fa360.listProjects();
      const p = all.find(x => x.id === projectId);
      if (p) {
        setProject(p);
        const analysis = await geminiService.analyzeProjectHealth(p, locale);
        setAiAnalysis(analysis);
      }
      setLoading(false);
    };
    loadData();
  }, [projectId, locale]);

  if (loading) return (
    <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin"></div>
      <p className="font-serif text-2xl opacity-50 text-white">{t('proj_syncing')}</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 dark:border-white/10 pb-10">
        <div className="space-y-4">
          <button onClick={() => navigate('/projects')} className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white flex items-center gap-2">
            <ArrowLeft size={12} /> {t('projects')}
          </button>

          {/* Quick Win #7: Stalled Indicator */}
          {project?.lastUpdate && (now - project.lastUpdate > 14 * 86400000) && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg animate-pulse">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Projeto Parado ({Math.floor((now - project.lastUpdate) / (1000 * 60 * 60 * 24))} dias)</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[10px] font-black uppercase tracking-widest rounded-full">
              {/* @ts-expect-error - i18n keys are dynamically loaded */}
              {t(project?.status_key)}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-luxury-charcoal/50 dark:text-white/50">ID: #FA-2024-{projectId}</span>

            {/* Quick Win #2: Days Since Update */}
            {project?.lastUpdate && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-[10px] text-luxury-charcoal/60 dark:text-white/60">
                <Clock size={10} />
                <span>Atualizado ha {Math.floor((now - project.lastUpdate) / (1000 * 60 * 60 * 24))} dias</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-none text-luxury-charcoal dark:text-white">{project?.name}</h1>
          <p className="text-xl font-light text-luxury-charcoal/50 dark:text-white/50 tracking-tight">
            {/* @ts-expect-error - i18n keys are dynamically loaded */}
            {t(project?.type_key)} • {project?.client}
          </p>

          {/* Quick Win #1: Next Action */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-luxury-gold">
              <Play size={14} className="fill-luxury-gold" />
              <span className="text-[10px] font-black uppercase tracking-widest">Proxima Acao:</span>
            </div>
            <p className="text-sm italic font-serif text-luxury-charcoal dark:text-white">{project?.nextAction || "Sem acao definida"}</p>
            <span className="text-[10px] text-luxury-charcoal/40 dark:text-white/40 font-mono">({new Date(project?.nextActionDate).toLocaleDateString()})</span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-6">
          <div className="flex flex-col items-end h-[60px] justify-center">
            {isActive && activeProject?.id === projectId ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-luxury-gold text-black rounded-full animate-in fade-in zoom-in duration-300">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">A gravar esforco...</span>
              </div>
            ) : (
              <button
                onClick={() => start({ id: projectId!, name: project?.name })}
                className="flex items-center gap-3 px-6 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold hover:border-luxury-gold/50 transition-all group"
              >
                <Play size={12} className="fill-current group-hover:scale-110 transition-transform" />
                Registar Tempo
              </button>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 mb-2">{t('proj_progress')}</p>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-serif text-luxury-charcoal dark:text-white">{project?.progress}%</span>
              <div className="w-32 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{ width: `${project?.progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 1.5 Timeline de Projeto (Step 29) */}
      <div className="glass p-6 rounded-xl border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <ProjectTimeline
          currentPhaseId={
            project?.status === 'planning' ? 'LIC' :
              project?.status === 'construction' ? 'OBRA' :
                project?.status === 'finished' ? 'DONE' : 'EP'
          }
        />
      </div>

      {aiAnalysis && (
        <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/10 rounded-xl flex items-center gap-4 animate-in slide-up">
          <div className="p-3 bg-luxury-gold text-black rounded-2xl">
            <Sparkles size={18} />
          </div>
          <p className="text-sm italic font-light text-luxury-charcoal/80 dark:text-white/80">{aiAnalysis}</p>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-black/5 dark:border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-luxury-gold' : 'text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white'
              }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-luxury-gold"></div>}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'TASKS' && <TasksView project={project} t={t} />}
        {activeTab === 'PAYMENTS' && <PaymentsView payments={project.payments} client={project.client} projectName={project.name} t={t} />}
        {activeTab === 'DIARY' && <DiaryView diary={project.diary} t={t} />}
        {activeTab === 'TIMELOGS' && <TimeLogsView projectId={projectId!} />}
      </div>
    </div>
  );
}

function TasksView({ t }: { project: ProjectData | null, t: (key: string) => string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-8 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('proj_pending_ops')}</h3>
            <Tooltip content={t('add_task') || "Adicionar Tarefa"} position="top">
              <button className="p-2 bg-luxury-gold text-black rounded-full"><Plus size={18} /></button>
            </Tooltip>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-6 p-6 glass rounded-3xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all">
                <Circle className="text-luxury-gold opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
                <div className="flex-1">
                  <h4 className="text-lg font-serif text-luxury-charcoal dark:text-white italic">Tarefa Exemplo #{i}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Amanha • {t('proj_high_priority')}</p>
                </div>
                <Tooltip content={t('more_options') || "Mais Opcoes"} position="left">
                  <MoreVertical size={20} className="text-luxury-charcoal/20 dark:text-white/20 cursor-pointer" />
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass p-8 rounded-xl border-luxury-gold/10 space-y-6 h-fit">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-luxury-gold">{t('proj_exec_panel')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {['3D View', 'Portal', 'Chat', 'Docs'].map(l => (
            <button key={l} className="p-6 glass border-black/5 dark:border-white/5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 hover:bg-luxury-gold hover:text-black transition-all">
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentsView({ payments, client, projectName, t }: { payments: ProjectPayment[], client: string, projectName: string, t: (key: string) => string }) {
  const [modal, setModal] = useState({ open: false, title: '', text: '' });

  const openReminder = (p: ProjectPayment) => {
    const textPT = buildPaymentReminderPT({
      client: client || 'Cliente',
      project: projectName || 'Projeto',
      milestone: t(p.phase_key),
      amountNet: p.value || 0,
      vatRate: 0.23,
      dueDate: new Date().toISOString()
    });

    const textEN = buildPaymentReminderEN({
      client: client || 'Client',
      project: projectName || 'Project',
      milestone: t(p.phase_key),
      amountNet: p.value || 0,
      vatRate: 0.23,
      dueDate: new Date().toISOString()
    });

    setModal({
      open: true,
      title: `Lembrete de Pagamento (PT/EN)`,
      text: `${textPT}\n\n---\n\n${textEN}`,
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border-black/5 dark:border-white/5 shadow-strong">
      <table className="w-full text-left">
        <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
          <tr>
            <th className="px-10 py-6">Fase</th>
            <th className="px-10 py-6 text-right">Valor</th>
            <th className="px-10 py-6 text-right">Status</th>
            <th className="px-10 py-6 text-right">Acao</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/5 text-luxury-charcoal dark:text-white">
          {payments?.map((p) => (
            <tr key={p.id}>
              <td className="px-10 py-6 font-serif italic">{t(p.phase_key)}</td>
              <td className="px-10 py-6 text-right font-mono text-luxury-gold">€{p.value.toLocaleString()}</td>
              <td className="px-10 py-6 text-right">
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${p.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/50 dark:text-white/50'}`}>{p.status}</span>
              </td>
              <td className="px-10 py-6 text-right">
                {p.status !== 'Pago' && (
                  <button
                    onClick={() => openReminder(p)}
                    className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-all"
                  >
                    {t('remind')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CopyModal
        open={modal.open}
        title={modal.title}
        text={modal.text}
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
}

function DiaryView({ diary, t }: { diary: ProjectDiaryItem[], t: (key: string) => string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {diary?.map((item) => (
        <div key={item.id} className="glass p-8 rounded-2xl border-black/5 dark:border-white/5 space-y-6 group hover:border-luxury-gold/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-1">{item.date}</p>
              <h4 className="text-2xl font-serif text-luxury-charcoal dark:text-white italic">{item.title}</h4>
            </div>
            <Tooltip content={t('weather_sunny') || "Ceu Limpo"} position="left">
              <Sun className="text-luxury-gold" size={24} />
            </Tooltip>
          </div>
          <p className="text-sm font-light italic text-luxury-charcoal/50 dark:text-white/50 leading-relaxed">
            Registo visual e tecnico dos trabalhos realizados no local.
          </p>
          <div className="flex justify-between items-center pt-6 border-t border-black/5 dark:border-white/5 text-luxury-charcoal/50 dark:text-white/50 text-[11px] font-black uppercase tracking-widest">
            <span>{item.author}</span>
            <Tooltip content={t('download') || "Descarregar"} position="left">
              <div className="cursor-pointer hover:text-luxury-gold transition-colors">
                <Download size={14} />
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}


interface TimeLog {
  id: string;
  date: string;
  description: string;
  phase: string;
  duration: number;
}

function TimeLogsView({ projectId }: { projectId: string }) {
  const [logs, setLogs] = React.useState<TimeLog[]>([]);

  React.useEffect(() => {
    fa360.getProjectTimeLogs(projectId).then((data) => setLogs(data as TimeLog[]));
  }, [projectId]);

  return (
    <div className="glass rounded-2xl overflow-hidden border-black/5 dark:border-white/5 shadow-strong">
      {logs.length === 0 ? (
        <div className="p-8 text-center text-luxury-charcoal/60 dark:text-white/60 italic">Sem registos de horas neste projeto.</div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
            <tr>
              <th className="px-10 py-6">Data</th>
              <th className="px-10 py-6">Descricao</th>
              <th className="px-10 py-6">Fase</th>
              <th className="px-10 py-6 text-right">Duracao</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-luxury-charcoal dark:text-white">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-10 py-6 font-mono opacity-60 text-xs">{new Date(log.date).toLocaleDateString()}</td>
                <td className="px-10 py-6 font-serif italic text-lg">{log.description || '-'}</td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[11px] font-black uppercase tracking-widest opacity-50">{log.phase}</span>
                </td>
                <td className="px-10 py-6 text-right font-mono text-luxury-gold">{log.duration}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

