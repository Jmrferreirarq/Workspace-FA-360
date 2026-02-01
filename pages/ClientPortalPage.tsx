
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Play,
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  MessageCircle,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Camera,
  Sun,
  Palette,
  Compass,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bell,
  Star,
  Leaf
} from 'lucide-react';
import fa360 from '../services/fa360';

export default function ClientPortalPage() {
  const Motion = motion as any;
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('HOME');
  const [notifications, setNotifications] = useState(2);

  const [projectInsight, setProjectInsight] = useState<string>('A carregar analise do diretor...');

  useEffect(() => {
    fa360.listProjects().then(all => {
      const p = all.find(x => x.id === projectId || x.id === '1');
      if (p) {
        setProject(p);
        fa360.synthesizeProjectInsights(p).then(text => setProjectInsight(text));
      }
    });
  }, [projectId]);

  const tabs = [
    { id: 'HOME', label: 'Inicio' },
    { id: '3D VIEW', label: 'Visao 3D' },
    { id: 'CHRONOLOGY', label: 'Cronologia' },
    { id: 'DOCS', label: 'Documentos' },
    { id: 'MOODBOARD', label: 'Atmosfera' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-luxury-gold selection:text-black overflow-x-hidden">
      {/* Dynamic Cursor Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-luxury-gold/5 rounded-full blur-[160px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] opacity-20"></div>
      </div>

      <header className="relative h-[50vh] md:h-[60vh] overflow-hidden flex flex-col justify-end px-6 md:px-20 pb-10 md:pb-20">
        <Motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={project?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920'}
            className="w-full h-full object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </Motion.div>

        <nav className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50 md:px-20">
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl md:text-2xl tracking-tighter text-white">FERREIRA</span>
            <span className="text-[7px] uppercase tracking-[0.3em] opacity-50 italic text-luxury-gold">Private Portal</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => window.location.href = '/'} className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mr-4">
              <ArrowRight className="rotate-180" size={12} /> Voltar ao Studio
            </button>
            <button className="relative p-2.5 glass rounded-full border-white/5 group transition-all hover:border-luxury-gold/30">
              <Bell size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              {notifications > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-luxury-gold rounded-full shadow-[0_0_10px_#D4AF37]"></span>}
            </button>
            <div className="flex items-center gap-2 md:gap-4 glass pl-4 md:pl-6 pr-1.5 md:pr-2 py-1.5 md:py-2 rounded-full border-white/10">
              <span className="text-[11px] md:text-[11px] font-black uppercase tracking-widest opacity-60 hidden sm:block">Joao Silva</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-luxury-gold text-black flex items-center justify-center font-black text-xs">J</div>
            </div>
          </div>
        </nav>

        <Motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative z-10 space-y-4 md:space-y-6 max-w-5xl"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-[1px] w-8 md:w-12 bg-luxury-gold"></div>
            <p className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.6em] text-luxury-gold">Private Residency Client Portal</p>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-[9rem] font-serif tracking-tighter leading-[0.8] italic text-white" style={{ fontSize: 'clamp(2.5rem, 15vw, 9rem)' }}>{project?.name || 'A Sua Visao'}</h1>
        </Motion.div>
      </header>

      <main className="relative z-10 px-6 md:px-20 max-w-7xl mx-auto pb-40">
        <div className="flex gap-8 md:gap-8 border-b border-white/5 mb-12 md:mb-20 overflow-x-auto no-scrollbar sticky top-0 bg-[#050505]/90 backdrop-blur-xl pt-6 md:pt-8 z-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-6 md:pb-8 text-[11px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-luxury-gold' : 'opacity-20 hover:opacity-100 text-white'}`}
            >
              {tab.label}
              {activeTab === tab.id && <Motion.div layoutId="portalTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.8)]" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {renderTabContent(activeTab, project, projectInsight)}
          </Motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 md:py-20 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 opacity-50 text-[11px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.2em] text-white text-center md:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} /> Secure Encrypted Connection
        </div>
        <p>© 2024 Ferreira Arquitetos. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4 text-luxury-gold">
          Suporte VIP: +351 900 000 000
        </div>
      </footer>
    </div>
  );
}

function renderTabContent(tabId: string, project: any, insight: string) {
  switch (tabId) {
    case 'HOME':
      return <HomeTab project={project} insight={insight} />;
    case '3D VIEW':
      return <ThreeDViewTab />;
    case 'CHRONOLOGY':
      return <ChronologyTab />;
    case 'DOCS':
      return <DocsTab project={project} />;
    case 'MOODBOARD':
      return <MoodboardTab />;
    default:
      return null;
  }
}

function HomeTab({ project, insight }: any) {
  const [isApproved, setIsApproved] = React.useState(false);

  const handleApprove = async () => {
    if (!project) return;
    const success = await fa360.updateProjectStatus(project.id, 'status_construction');
    if (success) {
      setIsApproved(true);
      fa360.log(`CLIENT_PORTAL: Aprovacao do cliente recebida para ${project.name}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 text-white">
      <div className="lg:col-span-8 space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
          <PortalStat icon={<Box />} label="Estado Atual" value={isApproved ? "Construcao" : "Execucao"} />
          <PortalStat icon={<Calendar />} label="Previsao Entrega" value="Out 2025" />
          <PortalStat icon={<Layers />} label="Decisoes Tecnicas" value={isApproved ? "25 / 28" : "24 / 28"} />
        </div>

        <div className="glass p-8 md:p-8 rounded-xl md:rounded-xl border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 md:space-y-12 group relative overflow-hidden shadow-strong">
          <div className="absolute top-0 right-0 p-8 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={100} className="text-luxury-gold" />
          </div>
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-3xl md:text-5xl font-serif italic">Acordos Pendentes</h3>
            <p className="text-lg md:text-xl font-light opacity-50">Sua aprovacao e necessaria para avancar com a proxima fase.</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className={`p-6 md:p-8 bg-white/5 rounded-xl md:rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 group/item transition-all ${isApproved ? 'opacity-50 border-emerald-500/30' : 'hover:border-luxury-gold/30'}`}>
              <div className="flex gap-5 md:gap-6 items-center w-full md:w-auto">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform shrink-0 ${isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-luxury-gold/10 text-luxury-gold group-hover/item:scale-110'}`}>
                  {isApproved ? <CheckCircle2 size={22} /> : <Palette size={22} />}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-medium">Revestimento Suite Master</h4>
                  <p className="text-[11px] md:text-sm opacity-60 font-light italic">Marmore de Estremoz (Amostra #24)</p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                {!isApproved ? (
                  <>
                    <button className="flex-1 md:flex-none px-6 py-3 md:py-4 glass border-white/10 rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all whitespace-nowrap">Ver Amostra 3D</button>
                    <button
                      onClick={handleApprove}
                      className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-luxury-gold text-black rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/20 whitespace-nowrap"
                    >
                      Aprovar Selecao
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500 font-serif italic">
                    <CheckCircle2 size={16} /> Aprovado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 gap-4">
            <h3 className="text-3xl md:text-4xl font-serif italic tracking-tighter">Atividade na Obra</h3>
            <span className="text-[11px] md:text-[10px] font-black uppercase tracking-widest opacity-20 text-luxury-gold">Live Sync Ativo</span>
          </div>
          <div className="space-y-4 md:space-y-6">
            <LogItem date="14 Out" title="Betonagem concluida com sucesso no Setor B" status="Sucesso" />
            <LogItem date="12 Out" title="Visita da Equipa de Engenharia de Estruturas" status="Concluido" />
            <LogItem date="11 Out" title="Rececao de Materiais de Revestimento (Showroom)" status="Verificado" />
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 space-y-10 md:space-y-12">
        <div className="glass p-8 md:p-8 rounded-2xl md:rounded-xl space-y-8 md:space-y-10 border-luxury-gold/10 bg-white/[0.01] shadow-strong relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 blur-3xl rounded-full"></div>
          <h4 className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-50 text-luxury-gold">Diretor de Projeto</h4>
          <div className="flex items-center gap-5 md:gap-6">
            <div className="relative">
              <img src="https://i.pravatar.cc/120?u=miguel" className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-xl object-cover border border-luxury-gold/30 p-1 bg-black shadow-strong" alt="Director" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full border-[3px] md:border-[4px] border-[#050505] shadow-lg shadow-emerald-500/20"></div>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-serif italic text-white">Miguel Ferreira</p>
              <p className="text-[11px] md:text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-1">Lead Architect</p>
            </div>
          </div>
          <div className="p-6 md:p-8 bg-white/5 rounded-xl md:rounded-3xl border border-white/5 shadow-inner">
            <p className="text-xs md:text-sm italic opacity-60 font-light leading-relaxed">"{insight}"</p>
          </div>
          <button className="w-full py-5 md:py-6 bg-luxury-gold/5 border border-luxury-gold/20 rounded-xl md:rounded-3xl flex items-center justify-center gap-3 text-[11px] md:text-[10px] font-black uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all shadow-xl shadow-luxury-gold/5">
            <MessageCircle size={18} /> Canal Direto VIP
          </button>
        </div>

        <div className="p-8 md:p-8 glass rounded-2xl md:rounded-[4.5rem] border-white/5 flex flex-col items-center text-center gap-6 md:gap-8 group relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-xl flex items-center justify-center text-luxury-gold group-hover:scale-110 group-hover:bg-luxury-gold/10 transition-all duration-700">
            <Camera size={32} />
          </div>
          <div className="space-y-1 md:space-y-2">
            <h4 className="text-xl md:text-2xl font-serif italic">Live Site Cam</h4>
            <p className="text-[11px] md:text-[10px] opacity-60 font-black uppercase tracking-widest">Acesso Restrito 4K</p>
          </div>
          <button className="flex items-center gap-2 text-[11px] md:text-[11px] font-black uppercase tracking-widest text-luxury-gold border-b border-luxury-gold pb-1 hover:opacity-100 transition-opacity opacity-60">Iniciar Transmissao</button>
        </div>
      </aside>
    </div>
  );
}

function PortalStat({ icon, label, value }: any) {
  return (
    <div className="glass p-8 md:p-14 rounded-xl md:rounded-xl space-y-6 md:space-y-8 hover:border-luxury-gold/30 transition-all group shadow-strong bg-white/[0.01]">
      <div className="text-luxury-gold group-hover:scale-110 transition-transform duration-700 bg-luxury-gold/5 w-fit p-3 md:p-4 rounded-xl md:rounded-2xl border border-luxury-gold/10 shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.2em] opacity-50 mb-2 md:mb-3 text-white tracking-widest">{label}</p>
        <p className="text-2xl md:text-4xl font-serif italic text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function LogItem({ date, title, status }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 p-6 md:p-10 glass rounded-xl md:rounded-2xl border-white/5 group hover:bg-white/[0.04] transition-all border-l-4 border-l-transparent hover:border-l-luxury-gold shadow-xl">
      <div className="flex flex-col items-start sm:items-center shrink-0">
        <span className="text-[11px] md:text-[10px] font-mono text-luxury-gold opacity-60 tracking-widest uppercase">{date}</span>
      </div>
      <h5 className="flex-1 text-base md:text-xl font-light opacity-60 group-hover:opacity-100 italic transition-all text-white leading-tight">{title}</h5>
      <span className={`text-[11px] md:text-[11px] font-black uppercase tracking-widest px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-lg shrink-0 ${status === 'Sucesso' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' : 'bg-luxury-gold/10 text-luxury-gold shadow-luxury-gold/10'
        }`}>
        {status}
      </span>
    </div>
  );
}

// Fixed missing components definitions
function ThreeDViewTab() {
  return (
    <div className="glass p-8 md:p-8 rounded-xl md:rounded-xl border-white/5 space-y-8 flex flex-col items-center justify-center min-h-[500px]">
      <Box size={64} className="text-luxury-gold opacity-20" />
      <h3 className="text-3xl font-serif italic text-white">Experiencia Imersiva</h3>
      <p className="text-lg font-light opacity-50 max-w-md text-center">
        O modelo tridimensional do seu projeto esta a ser processado para visualizacao web.
      </p>
      <button className="px-12 py-4 bg-luxury-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-luxury-gold/20 flex items-center gap-3">
        <Maximize2 size={16} /> Abrir Viewer Fullscreen
      </button>
    </div>
  );
}

function ChronologyTab() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-white/5">
        {[
          { date: 'Set 2024', title: 'Conclusao de Fundacoes', desc: 'A estrutura base da residencia foi finalizada com sucesso.' },
          { date: 'Ago 2024', title: 'Inicio de Escavacao', desc: 'Arranque oficial dos trabalhos em obra.' },
          { date: 'Jun 2024', title: 'Aprovacao de Licenciamento', desc: 'Projeto aprovado pela C.M. Lisboa.' },
        ].map((item, i) => (
          <div key={i} className="relative pl-24 group">
            <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:scale-125 transition-transform"></div>
            <div className="glass p-8 rounded-xl border-white/5 space-y-2 group-hover:border-luxury-gold/20 transition-all">
              <span className="text-[10px] font-mono text-luxury-gold opacity-60 uppercase tracking-widest">{item.date}</span>
              <h4 className="text-2xl font-serif italic text-white">{item.title}</h4>
              <p className="text-base font-light opacity-60 italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsTab({ project }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { name: 'Planta_Piso0_Execucao.pdf', size: '4.2 MB', category: 'Arquitetura' },
        { name: 'Mapa_Acabamentos_Final.pdf', size: '1.8 MB', category: 'Interiores' },
        { name: 'Contrato_Prestacao_Servicos.pdf', size: '2.5 MB', category: 'Legal' },
      ].map((doc, i) => (
        <div key={i} className="glass p-8 rounded-xl border-white/5 flex items-center justify-between group hover:border-luxury-gold/20 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-lg font-serif italic text-white">{doc.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">{doc.category} • {doc.size}</p>
            </div>
          </div>
          <button className="p-4 glass rounded-2xl border-white/10 hover:bg-luxury-gold hover:text-black transition-all">
            <Download size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

function MoodboardTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        'https://images.unsplash.com/photo-1613490493576-7fde63bac817?auto=format&fit=crop&w=400',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=400',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400',
        'https://images.unsplash.com/photo-1600607687940-477a284395e5?auto=format&fit=crop&w=400',
      ].map((img, i) => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group">
          <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
        </div>
      ))}
    </div>
  );
}

