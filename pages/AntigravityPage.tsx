
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Brain, 
  Link2, 
  ArrowRight,
  Trash2,
  CheckCircle2,
  Unplug,
  Lock,
  CloudSync
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function AntigravityPage() {
  const navigate = useNavigate();
  const [isLinkingBrain, setIsLinkingBrain] = useState(false);
  const [brainHook, setBrainHook] = useState(fa360.getNeuralHook());
  const [isBrainOnline, setIsBrainOnline] = useState(fa360.getNeuralStatus());
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Antigravity Core v4.5.0 Persistent Mode.',
    `[AUTH] Node Status: ${fa360.getNeuralStatus() ? 'CONNECTED' : 'STANDBY'}`
  ]);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem('fa-last-sync-time'));

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = fa360.subscribeToLogs((newLog) => {
      setLogs(prev => [...prev.slice(-25), newLog]);
    });

    const handleUpdate = () => {
      setIsBrainOnline(fa360.getNeuralStatus());
      setBrainHook(fa360.getNeuralHook());
      setLastSync(localStorage.getItem('fa-last-sync-time'));
    };
    
    window.addEventListener('fa-sync-complete', handleUpdate);
    window.addEventListener('neural-link-active', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('fa-sync-complete', handleUpdate);
      window.removeEventListener('neural-link-active', handleUpdate);
    };
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleBrainLink = async () => {
    if (!brainHook) return;
    setIsLinkingBrain(true);
    try {
      const res = await fa360.connectNeuralMaster(brainHook);
      if (res.success) {
        fa360.log("SUCCESS: Ponte Neural gravada permanentemente.");
      }
    } catch (e) {
      fa360.log("ERROR: Falha na gravacao do link.");
    }
    setIsLinkingBrain(false);
  };

  const disconnectBrain = () => {
    if (confirm("Isto ira desligar a ponte neural. As configuracoes de link serao apagadas. Continuar?")) {
      localStorage.removeItem('fa-brain-status');
      localStorage.removeItem('fa-brain-hook');
      setIsBrainOnline(false);
      setBrainHook('');
      fa360.log("SYSTEM: Link Neural removido do hardware.");
      window.dispatchEvent(new CustomEvent('neural-link-active'));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black text-luxury-charcoal dark:text-white p-6 md:p-8 space-y-12 pb-32 max-w-[1800px] mx-auto animate-in fade-in duration-1000">
      <PageHeader 
        kicker="Persistent Core Engine"
        title={<>Anti<span className="text-luxury-gold drop-shadow-[0_0_50px_rgba(212,175,55,0.2)]">gravity.</span></>}
        statusIndicator={true}
        customStatus={
          <div className="flex items-center gap-8 glass px-6 py-3 rounded-[2.5rem] border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/[0.02]">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Neural Memory</span>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${isBrainOnline ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500'} animate-pulse`}></div>
                   <span className={`text-[9px] font-black uppercase ${isBrainOnline ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {isBrainOnline ? 'Permanent Link Active' : 'Standby Mode'}
                   </span>
                </div>
             </div>
             <div className="w-px h-6 bg-black/10 dark:bg-white/10"></div>
             <button onClick={() => fa360.purgeSystemCache()} title="Hard Reset" className="p-2 bg-black/5 dark:bg-white/5 rounded-xl text-luxury-charcoal dark:text-white hover:text-red-500 transition-colors">
                <Trash2 size={16} />
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          
          <section className={`glass p-8 md:p-16 rounded-[2rem] border-luxury-gold/30 space-y-12 shadow-2xl relative overflow-hidden transition-all duration-1000 ${isBrainOnline ? 'bg-emerald-500/[0.03] border-emerald-500/40' : 'bg-luxury-gold/[0.02]'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Brain size={300} className={isBrainOnline ? 'text-emerald-500' : 'text-luxury-gold'} />
             </div>

             <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl shadow-xl ${isBrainOnline ? 'bg-emerald-500 text-black' : 'bg-luxury-gold text-black shadow-luxury-gold/20'}`}>
                         {isBrainOnline ? <Lock size={24} /> : <Link2 size={24} />}
                      </div>
                      <h2 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{isBrainOnline ? 'Encrypted Connection' : 'Establish Master Hook'}</h2>
                   </div>
                   <p className="text-lg font-light italic text-luxury-charcoal/60 dark:text-white/60 max-w-xl leading-relaxed">
                      {isBrainOnline 
                        ? 'O link neural esta selado. Todos os seus dados e simulacoes estao agora a ser persistidos na sua infraestrutura privada do Google.'
                        : 'A plataforma esta a correr em modo local. Ligue o seu Master Hook para ativar a inteligencia global e persistencia de dados.'}
                   </p>
                </div>
                {isBrainOnline && (
                   <button onClick={disconnectBrain} className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                      <Unplug size={14}/> Disconnect Bridge
                   </button>
                )}
             </div>

             <div className="space-y-6 relative z-10">
                <div className={`flex gap-4 p-2 bg-black/5 dark:bg-black/40 rounded-[2.5rem] border transition-all ${isBrainOnline ? 'border-emerald-500/20' : 'border-luxury-gold/20'}`}>
                   <input 
                    value={brainHook}
                    disabled={isBrainOnline}
                    onChange={e => setBrainHook(e.target.value)}
                    placeholder="https://script.google.com/..."
                    className="flex-1 bg-transparent border-none rounded-2xl px-8 py-5 text-xs text-luxury-charcoal dark:text-white font-mono focus:outline-none placeholder:text-luxury-charcoal/20 dark:placeholder:text-white/20 disabled:opacity-60"
                   />
                   {!isBrainOnline ? (
                     <button 
                      onClick={handleBrainLink}
                      disabled={isLinkingBrain || !brainHook}
                      className="px-12 py-5 bg-luxury-gold text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-luxury-gold/30 flex items-center gap-3"
                     >
                       {isLinkingBrain ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} 
                       Initialize Link
                     </button>
                   ) : (
                     <div className="px-12 py-5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                        <CheckCircle2 size={14}/> Node Verified
                     </div>
                   )}
                </div>
             </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] space-y-8">
                <div className="flex items-center gap-4">
                   <ShieldCheck className="text-luxury-gold" size={20} />
                   <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Security Status</h3>
                </div>
                <div className="p-6 bg-black/5 dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-widest">Persistence</span>
                      <span className={isBrainOnline ? 'text-emerald-500 font-black' : 'text-luxury-charcoal/20 dark:text-white/20'}>{isBrainOnline ? 'ENABLED' : 'LOCAL ONLY'}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-widest">Encryption</span>
                      <span className="text-emerald-500 font-black">ACTIVE</span>
                   </div>
                </div>
                <button onClick={() => navigate('/neural')} className="w-full py-5 border border-black/10 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all text-luxury-charcoal dark:text-white">
                   Neural Studio <ArrowRight size={14} className="inline ml-2"/>
                </button>
             </div>

             <div className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] space-y-8 flex flex-col justify-center items-center text-center">
                <Database className="text-luxury-gold mb-4" size={40} />
                <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Memory Core</h3>
                <p className="text-[10px] font-light text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-widest leading-loose">
                   A base de dados local sincroniza automaticamente com o cerebro central a cada alteracao.
                </p>
                <div className="pt-6 w-full">
                  <button onClick={() => fa360.syncAllLocalData()} className="w-full py-5 bg-luxury-charcoal dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-luxury-gold transition-all">
                    Force Cloud Sync
                  </button>
                </div>
             </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
           <div className="glass rounded-[2rem] border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/90 shadow-2xl h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between bg-black/5 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 text-luxury-gold">
                   <Terminal size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">System Console</span>
                </div>
              </div>
              <div className="flex-1 p-8 font-mono text-[11px] space-y-3 overflow-y-auto no-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                     <span className="text-luxury-charcoal/20 dark:text-white/20">{i+1}</span>
                     <p className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-red-400' : 'text-luxury-gold'}>{log}</p>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

