
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  MoreVertical,
  Plus,
  Star,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('PROJETOS');
  const Motion = motion as any;

  useEffect(() => {
    fa360.listClients().then(all => {
      const c = all.find(x => x.id === id);
      if (c) setClient(c);
    });
  }, [id]);

  if (!client) return <div className="p-20 text-center opacity-20">Carregando ficha do cliente...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12">
        <div className="space-y-6">
          <button 
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-luxury-gold transition-all"
          >
            <ArrowLeft size={14} /> Voltar a Listagem
          </button>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-luxury-gold/10 rounded-xl flex items-center justify-center text-luxury-gold border border-luxury-gold/20 relative group">
              <User size={48} />
              <div className="absolute -top-2 -right-2 p-2 bg-luxury-gold rounded-full text-black shadow-lg">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-0.5 bg-luxury-gold text-black rounded-full">Cliente VIP</span>
                <span className="text-[11px] font-mono opacity-20 uppercase tracking-widest">ID: #C-{client.id}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none">{client.name}</h1>
              <p className="text-xl font-light opacity-60 mt-2">Investidor Imobiliario • Residencial de Luxo</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 glass border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all">
            Editar Perfil
          </button>
          <button className="px-8 py-3 bg-luxury-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-luxury-gold/10">
            Nova Proposta
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Contact & IA Persona */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-2xl border-white/5 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Contacto Direto</h4>
            <div className="space-y-6">
               <ContactRow icon={<Mail size={16}/>} label="Email" value={client.email} />
               <ContactRow icon={<Phone size={16}/>} label="Telefone" value={client.phone} />
               <ContactRow icon={<MapPin size={16}/>} label="Localizacao" value="Lisboa, Portugal" />
            </div>
          </div>

          <div className="glass p-10 rounded-2xl border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-strong relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <Sparkles size={100} className="text-luxury-gold" />
            </div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">IA Persona Summary</h4>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-light italic opacity-60 leading-relaxed">
                "O cliente demonstra preferencia por estetica mediterranica contemporanea. Valoriza o rigor tecnico e e sensivel a atrasos logisticos. Recomendado: Manter comunicacao proativa semanal."
              </p>
              <div className="flex flex-wrap gap-2">
                 {['Minimalista', 'Naturais', 'Rigoroso', 'VIP'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest opacity-60">{tag}</span>
                 ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Tabs Content */}
        <main className="lg:col-span-8 space-y-10">
          <div className="flex gap-8 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide">
            {['PROJETOS', 'FINANCEIRO', 'COMUNICACOES', 'NOTAS'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-luxury-gold' : 'opacity-20 hover:opacity-100'}`}
              >
                {tab}
                {activeTab === tab && <Motion.div layoutId="clientTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-luxury-gold shadow-[0_0_10px_#D4AF37]" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {activeTab === 'PROJETOS' && (
                <div className="space-y-6">
                   <ProjectMiniCard title="Villa Alentejo" status="Em Curso" value="€1.2M" />
                   <ProjectMiniCard title="Apartamento Chiado" status="Finalizado" value="€450k" />
                   <button className="w-full py-8 rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-white/20 hover:border-luxury-gold/30 hover:text-luxury-gold transition-all group">
                      <Plus size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Iniciar Novo Projeto</span>
                   </button>
                </div>
              )}

              {activeTab === 'FINANCEIRO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass p-10 rounded-2xl border-white/5 text-center space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Investimento Total</p>
                      <p className="text-4xl font-serif text-luxury-gold italic">€1.650.000</p>
                      <p className="text-[11px] font-mono opacity-20">LTV Acumulado</p>
                   </div>
                   <div className="glass p-10 rounded-2xl border-white/5 text-center space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pendente de Pagamento</p>
                      <p className="text-4xl font-serif">€24.500</p>
                      <p className="text-emerald-500 text-[11px] font-black uppercase tracking-widest">Atraso: 0 Dias</p>
                   </div>
                </div>
              )}

              {activeTab === 'COMUNICACOES' && (
                 <div className="space-y-6">
                    <CommItem type="Reuniao" date="14 Out" title="Apresentacao de Renderings 3D" author="Miguel F." />
                    <CommItem type="Email" date="12 Out" title="Envio de Caderno de Encargos" author="Sofia C." />
                    <CommItem type="Portal" date="10 Out" title="Cliente aprovou orcamento de cozinha" author="Sistema" />
                 </div>
              )}
            </Motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl text-luxury-gold/50">{icon}</div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest opacity-20 mb-1">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ProjectMiniCard({ title, status, value }: any) {
  return (
    <div className="glass p-8 rounded-2xl border-white/5 flex justify-between items-center group hover:border-luxury-gold/20 transition-all">
       <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold">
             <Briefcase size={24} />
          </div>
          <div>
             <h5 className="text-xl font-serif italic">{title}</h5>
             <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mt-1">{status}</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-lg font-serif text-luxury-gold">{value}</p>
          <button className="text-[11px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 group-hover:text-luxury-gold transition-all mt-2 flex items-center gap-2">Explorar <TrendingUp size={10} /></button>
       </div>
    </div>
  );
}

function CommItem({ type, date, title, author }: any) {
  return (
    <div className="flex items-center gap-6 p-6 glass rounded-2xl border-white/5 group hover:bg-white/[0.02] transition-colors">
       <div className={`p-3 rounded-lg text-[11px] font-black uppercase tracking-widest ${
         type === 'Portal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 opacity-50'
       }`}>{type}</div>
       <div className="flex-1">
          <h6 className="text-sm font-medium">{title}</h6>
          <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mt-1">{date} • {author}</p>
       </div>
       <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16}/></button>
    </div>
  );
}

