
import React, { useState, useEffect } from 'react';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';
import {
  Users,
  Clock,
  Zap,
  Activity,
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  load: number;
  activeProjects: number;
}

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState('WORKLOAD');
  const [team, setTeam] = useState<TeamMember[]>([]);



  const loadTeam = async () => {
    const data = await fa360.listTeamMembers();
    setTeam(data);
  };

  useEffect(() => {
    const init = async () => {
      await loadTeam();
    };
    init();
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker="Recursos Humanos & Performance"
        title={<>Gestao de <span className="text-luxury-gold">Equipa.</span></>}
      />

      <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/10 dark:border-white/10 text-luxury-charcoal dark:text-white w-fit mb-8">
        <button
          onClick={() => setActiveTab('WORKLOAD')}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'WORKLOAD' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          Workload
        </button>
        <button
          onClick={() => setActiveTab('TIMESHEETS')}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TIMESHEETS' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          Folha de Horas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Team Grid & Detailed View */}
        <main className="lg:col-span-8 space-y-12">
          {activeTab === 'WORKLOAD' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.length > 0 ? (
                team.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-2xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/20 transition-all shadow-strong relative overflow-hidden text-luxury-charcoal dark:text-white"
                  >
                    <div className="flex items-center gap-6 mb-10">
                      <img src={member.avatar} className="w-20 h-20 rounded-3xl object-cover border border-black/10 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700" alt={member.name} />
                      <div>
                        <h4 className="text-2xl font-serif text-luxury-charcoal dark:text-white">{member.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-1">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Carga Semanal</p>
                        <span className={`text-xl font-serif ${member.load > 90 ? 'text-red-500' : 'text-luxury-charcoal dark:text-white'}`}>{member.load}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-luxury-gold transition-all duration-1000" style={{ width: `${member.load}%`, backgroundColor: member.load > 90 ? '#ef4444' : '#D4AF37' }}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2 text-luxury-charcoal/50 dark:text-white/50">
                        <Activity size={14} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{member.activeProjects || 0} Projectos Activos</span>
                      </div>
                      <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-black dark:hover:text-white transition-colors">Detalhes de Carga</button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-40 glass rounded-2xl border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 text-center bg-black/5 dark:bg-white/[0.02]">
                  <div className="p-10 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 text-luxury-charcoal dark:text-white">
                    <Users size={48} className="opacity-20" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">Equipa em Standby.</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal/50 dark:text-white/50">Nenhum colaborador registado na estrutura neural.</p>
                  </div>
                  <button className="px-10 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">Adicionar Colaborador</button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass rounded-2xl border-black/5 dark:border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
                  <tr>
                    <th className="px-10 py-6">Colaborador</th>
                    <th className="px-10 py-6">Projecto</th>
                    <th className="px-10 py-6">Tarefa / Fase</th>
                    <th className="px-10 py-6">Horas</th>
                    <th className="px-10 py-6 text-right">Accao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm text-luxury-charcoal/60 dark:text-white/60">
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center italic text-luxury-charcoal/30 dark:text-white/30">Nenhuma folha de horas registada este mes.</td>
                  </tr>
                </tbody>
              </table>
              <button className="w-full py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-gold transition-all border-t border-black/5 dark:border-white/5">
                + Registar Novas Horas
              </button>
            </div>
          )}
        </main>

        {/* AI & Analytics Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-xl border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-strong relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold uppercase">Team AI Coach</h4>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 space-y-4">
                <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                  "O cerebro esta a aguardar a sincronizacao de dados de produtividade para gerar recomendacoes de alocacao."
                </p>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-2xl border-black/5 dark:border-white/5 space-y-8 text-luxury-charcoal dark:text-white">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Metricas de Equipa</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2"><Clock size={14} /> Total Semanal</span>
                <span className="text-xl font-serif">0h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2"><Coffee size={14} /> Taxa de Faturacao</span>
                <span className="text-xl font-serif text-emerald-500">0%</span>
              </div>
              <div className="pt-6 border-t border-black/5 dark:border-white/5">
                <button className="w-full py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-all text-luxury-charcoal dark:text-white">Relatorio de Desempenho</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

