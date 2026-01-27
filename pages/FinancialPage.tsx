
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  Briefcase,
  Loader2,
  X,
  CreditCard,
  PieChart
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/common/PageHeader';

interface Project {
  id: string;
  name: string;
  client: string;
  fee_adjudicated: number;
  costs_recorded: number;
}

interface FinanceStats {
  liquidity: number;
  pendingFees: number;
  burnRate: number | string;
  margin: number;
}

interface ProjectionData {
  name: string;
  projected: number;
  expenses: number;
}

interface FinanceStatProps {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  icon: React.ReactNode;
  isGold?: boolean;
}

interface ProjectProfitCardProps {
  project: Project;
}

export default function FinancialPage() {
  const { t } = useLanguage();
  // Unused activeTab removed
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
  const [projections, setProjections] = useState<ProjectionData[]>([]);
  const [aiMessage, setAiMessage] = useState('');

  // Form de Despesa
  const [expenseForm, setExpenseForm] = useState({
    projectId: '',
    category: 'Sub-contratado',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadFinanceData = async () => {
    setLoading(true);
    const [p, stats, proj, ai] = await Promise.all([
      fa360.listProjects(),
      fa360.getFinancialStats(),
      fa360.getFinancialProjections(),
      fa360.getAIRecommendations('FINANCIAL')
    ]);
    setProjects(p);
    setFinanceStats(stats);
    setProjections(proj);
    setAiMessage(ai);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadFinanceData();
    };
    init();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await fa360.saveExpense(expenseForm);
    if (result.success) {
      setIsExpenseModalOpen(false);
      setExpenseForm({ projectId: '', category: 'Sub-contratado', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      loadFinanceData();
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center opacity-50">Sincronizando Neural Ledger...</div>;

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker={t('fin_title')}
        title={<>Capital <span className="text-luxury-gold">Management.</span></>}
        actionLabel={t('fin_add_expense')}
        onAction={() => setIsExpenseModalOpen(true)}
      />

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FinanceStat label="Liquidez Total" value={`€${(financeStats?.liquidity / 1000).toFixed(1)}k`} trend={financeStats?.liquidity > 0 ? "+0%" : "Zeroed"} up={financeStats?.liquidity > 0} icon={<DollarSign size={20} />} />
        <FinanceStat label="Honorarios Pendentes" value={`€${financeStats?.pendingFees}k`} trend="Ciclo 30d" up={true} icon={<Target size={20} />} />
        <FinanceStat label="Burn Rate Medio" value={`€${financeStats?.burnRate}k`} trend="Estavel" up={false} icon={<Zap size={20} />} />
        <FinanceStat label="Margem Estudio" value={`${financeStats?.margin}%`} trend={financeStats?.margin > 0 ? "Synced" : "TBD"} up={financeStats?.margin > 0} isGold={true} icon={<PieChart size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 space-y-12">
          <section className="glass p-8 rounded-[2rem] border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">Cashflow <span className="text-luxury-charcoal/20 dark:text-white/20">Real vs Projecao</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 italic">Baseado em adjudicacoes via Antigravity</p>
              </div>
            </div>

            <div className="h-[400px] w-full flex items-center justify-center">
              {projections.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projections}>
                    <defs>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '1.5rem' }}
                      itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="projected" stroke="#D4AF37" fillOpacity={1} fill="url(#colorProjected)" strokeWidth={4} />
                    <Area type="monotone" dataKey="expenses" stroke="#ffffff10" fill="transparent" strokeWidth={2} strokeDasharray="8 8" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center opacity-20 space-y-4">
                  <BarChart3 size={48} className="mx-auto" />
                  <p className="text-[10px] uppercase font-black tracking-widest">Sem dados de projecao neural disponiveis.</p>
                </div>
              )}
            </div>
          </section>

          {/* PROJECT PROFITABILITY LIST */}
          <section className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white tracking-tighter">Rentabilidade <span className="text-luxury-gold">por Projeto.</span></h3>
              <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 italic">Real-time Margin Analysis</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {projects.length > 0 ? projects.map((proj) => (
                <ProjectProfitCard key={proj.id} project={proj} />
              )) : (
                <div className="glass p-20 rounded-[3rem] text-center opacity-20 border-black/5 dark:border-white/5">
                  <p className="text-[10px] uppercase font-black tracking-widest text-luxury-charcoal dark:text-white">Zero projetos ativos para analise de margem.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* AI Financial Strategy Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="glass p-10 rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold uppercase">AI Financial Pilot</h4>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 space-y-4">
                <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                  "{aiMessage}"
                </p>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2rem] border-white/5 space-y-10 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">Ledger de Despesas (30d)</h4>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center space-y-4">
                <CreditCard size={32} />
                <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">Nenhum custo registado recentemente.</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">Ver Livro Completo</button>
          </div>
        </aside>
      </div>

      {/* Expense Entry Modal */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-2xl glass rounded-[2rem] border-white/10 p-8 md:p-16 shadow-2xl space-y-10"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">Registar <span className="text-red-500">Despesa.</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 italic">Neural Financial Entry</p>
                </div>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-4 glass rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-luxury-charcoal dark:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">Projeto Associado</label>
                    <select
                      required
                      value={expenseForm.projectId}
                      onChange={e => setExpenseForm({ ...expenseForm, projectId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-luxury-gold outline-none"
                    >
                      <option value="" className="bg-black">Selecionar Projeto...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id} className="bg-black">{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">Valor (EUR)</label>
                    <input
                      required
                      type="number"
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-luxury-gold outline-none font-mono"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Descricao / Fornecedor</label>
                  <input
                    required
                    value={expenseForm.description}
                    onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none"
                    placeholder="Ex: Factura #123 - Eng. Estruturas"
                  />
                </div>
                <button
                  disabled={saving}
                  className="w-full py-7 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-red-500/20 disabled:opacity-20"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Briefcase size={18} />}
                  {saving ? 'A Sincronizar...' : 'Finalizar Registo de Custo'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectProfitCard({ project }: ProjectProfitCardProps) {
  const margin = Math.round(((project.fee_adjudicated - project.costs_recorded) / project.fee_adjudicated) * 100);
  return (
    <div className="glass p-10 rounded-[3rem] border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-luxury-gold/30 transition-all shadow-xl">
      <div className="flex-1 space-y-6 w-full">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Cliente: {project.client}</span>
            <h4 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">{project.name}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Fees Adjudicados</p>
            <p className="text-2xl font-serif text-luxury-gold italic">€{project.fee_adjudicated.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-widest">
            <span className="text-luxury-charcoal/50 dark:text-white/50">Consumo de Margem (Custos Registados)</span>
            <span className="text-red-400">€{project.costs_recorded.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(project.costs_recorded / project.fee_adjudicated) * 100}%` }}
              className="h-full bg-red-500"
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 text-center space-y-3">
        <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${margin > 50 ? 'border-emerald-500 shadow-[0_0_20px_#10b98130]' : 'border-luxury-gold'}`}>
          <span className="text-2xl font-serif italic text-luxury-charcoal dark:text-white">{margin}%</span>
          <span className="text-[11px] font-black uppercase text-luxury-charcoal/60 dark:text-white/60">Margem</span>
        </div>
        <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-white transition-colors">Detalhes de Custos</button>
      </div>
    </div>
  );
}



function FinanceStat({ label, value, trend, up, icon, isGold }: FinanceStatProps) {
  return (
    <div className={`glass p-10 rounded-[3rem] border-black/5 dark:border-white/5 space-y-6 group transition-all duration-700 hover:border-luxury-gold/20 shadow-xl ${isGold ? 'bg-luxury-gold/[0.02]' : ''}`}>
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl ${isGold ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/30' : 'bg-black/5 dark:bg-white/5 text-luxury-gold'}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${up ? 'text-emerald-500' : 'text-red-500'}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 mb-2">{label}</p>
        <p className="text-4xl font-serif italic tracking-tight text-luxury-charcoal dark:text-white">{value}</p>
      </div>
    </div>
  );
}

