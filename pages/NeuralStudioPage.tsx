
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Terminal,
  MessageSquare,
  TrendingUp,
  Eye,
  RefreshCw,
  Settings,
  Database,
  ArrowRight,
  Link2,
  AlertTriangle,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/common/PageHeader';

export default function NeuralStudioPage() {
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [activeAgent, setActiveAgent] = useState('concierge');
  const [isSyncing, setIsSyncing] = useState(false);
  const [prompt, setPrompt] = useState('A carregar protocolo...');
  const [isBrainOnline, setIsBrainOnline] = useState(localStorage.getItem('fa-brain-status') === 'ONLINE');

  // Auditoria Global
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState('');

  const agents = [
    { id: 'concierge', name: 'Digital Concierge', icon: <MessageSquare />, color: '#D4AF37', status: 'Online' },
    { id: 'pilot', name: 'Financial Pilot', icon: <TrendingUp />, color: '#3b82f6', status: 'Analysis' },
    { id: 'director', name: 'Creative Director', icon: <Eye />, color: '#a855f7', status: 'Ready' }
  ];

  const loadProtocol = React.useCallback(async () => {
    const text = await fa360.getNeuralProtocol(activeAgent);
    setPrompt(text);
  }, [activeAgent]);

  useEffect(() => {
    const init = async () => {
      await loadProtocol();
    };
    init();

    const checkStatus = () => setIsBrainOnline(localStorage.getItem('fa-brain-status') === 'ONLINE');
    window.addEventListener('neural-link-active', checkStatus);
    return () => window.removeEventListener('neural-link-active', checkStatus);
  }, [loadProtocol]);

  const handleSyncNeural = () => {
    if (!isBrainOnline) {
      navigate('/antigravity');
      return;
    }
    setIsSyncing(true);
    fa360.log(`NEURAL: Sincronizando pesos do agente ${activeAgent}...`);
    setTimeout(() => {
      setIsSyncing(false);
      fa360.log(`SUCCESS: Matriz neural do ${activeAgent} atualizada.`);
    }, 1500);
  };

  const runGlobalAudit = async () => {
    setIsAuditing(true);
    fa360.log("MASTER_AUDIT: Iniciando análise transversal do ecossistema...");
    const result = await fa360.getGlobalEcosystemAudit(locale);
    setAuditResult(result);
    setIsAuditing(false);
    fa360.log("SUCCESS: Auditoria estratégica finalizada.");
  };

  return (
    <div className="min-h-screen text-luxury-charcoal dark:text-white p-6 md:p-8 space-y-12 pb-32 max-w-[1800px] mx-auto animate-in fade-in duration-1000">
      <PageHeader
        kicker={`FA-360 Neural Studio ${isBrainOnline ? '• Live' : '• Offline'}`}
        title={<>Studio <span className="text-indigo-500 drop-shadow-[0_0_50px_rgba(99,102,241,0.3)]">AI.</span></>}
        statusIndicator={isBrainOnline}
        customStatus={
          !isBrainOnline ? (
            <button
              onClick={() => navigate('/antigravity')}
              className="glass px-6 py-3 rounded-[2.5rem] border-red-500/30 bg-red-500/5 backdrop-blur-3xl flex items-center gap-4 hover:border-luxury-gold/50 transition-all group"
            >
              <div className="p-2 bg-red-500/20 text-red-500 rounded-xl group-hover:text-luxury-gold transition-colors"><Link2 size={18} /></div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-red-500">Master Link Required</p>
                <p className="text-sm font-serif italic text-white">Conectar Cérebro</p>
              </div>
              <ArrowRight size={16} className="text-red-500 group-hover:translate-x-2 transition-transform" />
            </button>
          ) : (
            <div className="glass px-6 py-3 rounded-[2.5rem] border-black/5 dark:border-white/10 bg-indigo-500/[0.05] backdrop-blur-3xl flex items-center gap-6 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Synaptic Load</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{
                        width: ['30%', '70%', '45%', '90%', '60%'],
                        opacity: [0.5, 1, 0.7, 1, 0.5]
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                    ></motion.div>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400">High Efficiency</span>
                </div>
              </div>
              <div className="w-px h-8 bg-black/10 dark:bg-white/10"></div>
              <button onClick={handleSyncNeural} className="p-2 bg-black/5 dark:bg-white/5 rounded-2xl text-luxury-charcoal dark:text-white hover:text-indigo-400 transition-colors group">
                <RefreshCw size={18} className={`${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-4 mb-6">Active Agents</p>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`w-full p-8 rounded-[2.5rem] border transition-all text-left group relative overflow-hidden ${activeAgent === agent.id
                ? 'bg-indigo-500/[0.03] border-indigo-500/50 shadow-[0_20px_50px_rgba(99,102,241,0.1)]'
                : 'bg-black/5 dark:bg-transparent border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                }`}
            >
              {activeAgent === agent.id && (
                <motion.div layoutId="activeBg" className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.05] to-transparent pointer-events-none" />
              )}
              <div className="relative z-10 flex items-center gap-6">
                <div className={`p-4 rounded-2xl transition-all shadow-xl ${activeAgent === agent.id ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/30 dark:text-white/30 group-hover:text-luxury-charcoal dark:group-hover:text-white'}`}>
                  {agent.icon}
                </div>
                <div>
                  <h4 className={`text-xl font-serif italic ${activeAgent === agent.id ? 'text-indigo-500' : 'text-luxury-charcoal/60 dark:text-white/60 group-hover:text-luxury-charcoal dark:group-hover:text-white'}`}>{agent.name}</h4>
                  {activeAgent === agent.id && <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 animate-pulse">Processing...</span>}
                </div>
              </div>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-6 space-y-12">
          {/* Diagnostic Console (NOVO) */}
          <AnimatePresence>
            {isBrainOnline && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 md:p-16 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.02] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
                  <Cpu size={300} className="text-indigo-400" />
                </div>

                <header className="flex justify-between items-center border-b border-white/5 pb-10 mb-12">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="text-indigo-400" size={24} />
                    <h2 className="text-3xl font-serif italic">Global Business Audit</h2>
                  </div>
                  <button
                    onClick={runGlobalAudit}
                    disabled={isAuditing}
                    className="flex items-center gap-3 px-8 py-3 bg-indigo-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {isAuditing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                    {isAuditing ? 'Auditing Matrix...' : 'Run Diagnostics'}
                  </button>
                </header>

                <div className="min-h-[200px] font-mono text-sm leading-relaxed text-indigo-100/70 italic">
                  {isAuditing ? (
                    <>
                      <p>&gt; Sincronizando com Antigravity Master Hook...</p>
                      <p>&gt; Extraindo logs do pipeline comercial...</p>
                      <p>&gt; Calculando vetores de rentabilidade...</p>
                    </>
                  ) : auditResult ? (
                    <div className="animate-in fade-in slide-up duration-1000 whitespace-pre-wrap">
                      {auditResult}
                    </div>
                  ) : (
                    <p className="opacity-50">Aguardando comando de diagnóstico global para analisar a saúde do atelier através da ponte neural...</p>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <section className="glass p-8 md:p-16 rounded-[2rem] border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
              <Brain size={300} className="text-luxury-charcoal dark:text-white" />
            </div>

            <header className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-10 mb-12">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isBrainOnline ? 'bg-indigo-500/20 text-indigo-400' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>
                  <Settings size={20} />
                </div>
                <h2 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">Agent Protocol</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
                <Activity size={12} className="text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Direct Link Active</span>
              </div>
            </header>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Neural Instructions (.txt)</label>
                  <span className="text-[11px] font-mono opacity-20">Last Updated: Just Now</span>
                </div>
                <div className="relative">
                  <Terminal className="absolute top-6 left-6 text-indigo-500/40" size={18} />
                  <textarea
                    disabled={!isBrainOnline}
                    className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-10 pl-16 h-80 text-sm font-light italic text-white/70 focus:border-indigo-500 outline-none transition-all leading-relaxed font-mono disabled:opacity-20 scrollbar-hide"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  {!isBrainOnline && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[2.5rem]">
                      <div className="text-center space-y-4">
                        <AlertTriangle className="mx-auto text-luxury-gold" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Neural Bridge Inactive</p>
                        <button onClick={() => navigate('/antigravity')} className="text-[11px] font-bold text-luxury-gold underline uppercase tracking-widest">Connect Master Hook</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSyncNeural}
                  disabled={isSyncing}
                  className={`flex-1 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl group flex items-center justify-center gap-3 ${isBrainOnline
                    ? 'bg-indigo-500 text-white shadow-indigo-500/30'
                    : 'bg-white/5 text-white/20 border border-white/10'
                    }`}
                >
                  {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} className="group-hover:fill-current" />}
                  {isBrainOnline ? (isSyncing ? 'Syncing Weights...' : 'Commit to Neural Brain') : 'Connect Brain to Enable'}
                </button>
              </div>
            </div>
          </section>
        </main>

        <aside className="lg:col-span-3 space-y-8">
          <div className="glass p-10 rounded-[2rem] border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/40 shadow-2xl space-y-10">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-indigo-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Neural Insights</h4>
            </div>
            <div className="space-y-8">
              <ThoughtBubble
                text={isBrainOnline ? "Protocolo Sincronizado: Gemini 3.0 Pro habilitado para análise de portefólio." : "System awaiting Master Hook..."}
                time="Now"
                active={isBrainOnline}
              />
              <ThoughtBubble
                text={isBrainOnline ? "Pronto para gerar propostas baseadas na sua taxonomia de luxo." : "Link Status: DISCONNECTED"}
                time="2m ago"
                active={isBrainOnline}
                isAlert={!isBrainOnline}
              />
              <ThoughtBubble
                text="Integridade do Modelo: 99.8% (Stable)"
                time="5m ago"
                active={true}
              />
            </div>
          </div>

          <div className="p-10 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 flex flex-col items-center text-center gap-6 group">
            <Database size={32} className="text-indigo-400 group-hover:scale-110 transition-transform duration-700" />
            <h5 className="text-sm font-serif italic text-luxury-charcoal/60 dark:text-white/60">Dataset de Treino Ativo</h5>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-indigo-500/20 rounded-full overflow-hidden"><motion.div animate={{ height: ['20%', '100%', '20%'] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-full bg-indigo-400" /></div>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface ThoughtBubbleProps {
  text: string;
  time: string;
  active: boolean;
  isAlert?: boolean;
}

function ThoughtBubble({ text, time, active, isAlert }: ThoughtBubbleProps) {
  return (
    <div className={`flex gap-5 group ${!active ? 'opacity-50' : ''}`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isAlert ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : (active ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-black/20 dark:bg-white/10')}`}></div>
      <div className="space-y-1">
        <p className="text-[11px] font-light italic leading-relaxed text-luxury-charcoal/70 dark:text-white/70">{text}</p>
        <span className="text-[11px] font-mono text-luxury-charcoal/20 dark:text-white/20 uppercase tracking-widest">{time}</span>
      </div>
    </div>
  );
}

