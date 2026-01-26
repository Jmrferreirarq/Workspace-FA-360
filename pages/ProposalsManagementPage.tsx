
import React, { useState } from 'react';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Download,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROPOSALS: any[] = [];

export default function ProposalsManagementPage() {
  const [filter, setFilter] = useState('All');
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const Motion = motion as any;

  const loadData = async () => {
    setLoading(true);
    const data = await fa360.listProposals();
    setProposals(data);
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const filteredProposals = proposals.filter(p => filter === 'All' || p.status === filter);

  // Dynamic Stats
  const totalNegotiation = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
  const adjudicadaCount = proposals.filter(p => p.status === 'Adjudicada').length; // Keeping status keys internal for now
  const conversaoRate = proposals.length > 0 ? Math.round((adjudicadaCount / proposals.length) * 100) : 0;
  const pendenteCount = proposals.filter(p => p.status === 'Enviada' || p.status === 'Negociação').length;

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader 
        kicker={t('prop_kicker')}
        title={<>{t('prop_title_prefix')} <span className="text-luxury-gold">{t('prop_title_suffix')}</span></>}
        actionLabel={t('newProposal')}
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <main className="lg:col-span-9 space-y-12">
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide no-scrollbar">
              {['prop_filter_all', 'prop_filter_draft', 'prop_filter_sent', 'prop_filter_negotiation', 'prop_filter_adjudicated'].map(fKey => (
                <button
                  key={fKey}
                  onClick={() => setFilter(fKey === 'prop_filter_all' ? 'All' : (t(fKey as any)))} // Simplified filter logic mapping
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${filter === (fKey === 'prop_filter_all' ? 'All' : t(fKey as any)) ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-black/5 dark:border-white/5 text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'
                    }`}
                >
                  {t(fKey as any)}
                </button>
              ))}
            </div>
            <div className="hidden md:flex relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-luxury-charcoal dark:text-white group-hover:text-luxury-gold" />
              <input type="text" placeholder={t('prop_search')} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full pl-10 pr-6 py-2 text-[10px] outline-none focus:border-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((prop, i) => (
                  <Motion.div
                    key={prop.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[3rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-2xl relative overflow-hidden bg-luxury-white/50 dark:bg-black/20"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold"><MoreVertical size={20} /></button>
                    </div>

                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-white border border-black/5 dark:border-transparent dark:bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-none">
                        <FileText size={32} className="text-luxury-gold" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{prop.project}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1 text-luxury-charcoal dark:text-white">{prop.client} • {prop.type}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mb-1 text-luxury-charcoal dark:text-white">{t('prop_est_fees')}</p>
                        <p className="text-3xl font-serif text-luxury-gold">€{parseFloat(prop.total).toLocaleString('pt-PT')}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-2 ${prop.status === 'Adjudicada' ? 'bg-emerald-500/10 text-emerald-500' :
                          prop.status === 'Enviada' ? 'bg-blue-500/10 text-blue-500' :
                            prop.status === 'Negociação' ? 'bg-luxury-gold/10 text-luxury-gold' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/60 dark:text-white/60'
                          }`}>
                          {prop.status}
                        </div>
                        <p className="text-[10px] opacity-30 font-mono text-luxury-charcoal dark:text-white">{prop.date || new Date().toLocaleDateString('pt-PT')}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Eye size={14} className="text-luxury-gold" />
                          <span className="text-[11px] font-black text-luxury-charcoal dark:text-white">{prop.views || 0} {t('prop_views')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 glass rounded-xl border-black/10 dark:border-white/10 hover:text-luxury-gold transition-colors text-luxury-charcoal dark:text-white"><Download size={16} /></button>
                        <button className="px-6 py-3 bg-luxury-gold text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/10">{t('prop_send_portal')}</button>
                      </div>
                    </div>
                  </Motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-8 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 bg-luxury-white/30 dark:bg-white/[0.02]">
                  <div className="p-10 bg-luxury-gold/5 rounded-full border border-luxury-gold/10">
                    <TrendingUp size={48} className="text-luxury-gold opacity-30" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('prop_standby_title')}</h3>
                    <p className="text-sm font-light opacity-40 max-w-sm mx-auto leading-relaxed text-luxury-charcoal dark:text-white">{t('prop_standby_desc')}</p>
                  </div>
                  <button className="px-12 py-5 bg-luxury-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all">
                    {t('prop_start_sim')}
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Sales AI Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="glass p-10 rounded-[3rem] border-luxury-gold/20 bg-luxury-gold/[0.05] dark:bg-luxury-gold/[0.02] space-y-8 shadow-[0_10px_40px_rgba(212,175,55,0.05)] dark:shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{t('prop_insight_title')}</h4>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white/40 dark:bg-white/5 rounded-[2rem] border-l-4 border-luxury-gold space-y-4 shadow-sm dark:shadow-none">
                {proposals.length > 0 ? (
                  <>
                    <p className="text-xs font-light italic opacity-60 leading-relaxed text-luxury-charcoal dark:text-white">
                      "A proposta mais vista é de {proposals[0].client}. Probabilidade de conversão otimizada."
                    </p>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-4">
                      {t('prop_analyze')} <ArrowUpRight size={10} />
                    </button>
                  </>
                ) : (
                  <p className="text-xs font-light italic opacity-30 leading-relaxed text-luxury-charcoal dark:text-white">
                    {t('prop_insight_empty')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3.5rem] border-black/5 dark:border-white/5 bg-luxury-white/50 dark:bg-white/[0.02] space-y-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 text-luxury-charcoal dark:text-white text-center">{t('prop_summary_title')}</h4>
            <div className="space-y-12 text-center">
              <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 mb-3 text-luxury-charcoal dark:text-white">{t('prop_vol_neg')}</p>
                <p className="text-5xl font-serif italic text-luxury-charcoal dark:text-white">€{totalNegotiation.toLocaleString('pt-PT')}</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-black/5 dark:border-white/5">
                <div className="space-y-2">
                  <p className="text-[10px] opacity-30 uppercase font-black text-luxury-charcoal dark:text-white">{t('conversion')}</p>
                  <p className="text-3xl font-serif text-emerald-500">{conversaoRate}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] opacity-30 uppercase font-black text-luxury-charcoal dark:text-white">{t('proj_pending_ops')}</p>
                  <p className="text-3xl font-serif text-luxury-gold">{pendenteCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-emerald-500/5 rounded-[3.5rem] border border-emerald-500/10 flex flex-col items-center text-center gap-6 group hover:bg-emerald-500/10 transition-colors">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <FileCheck size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('prop_pipeline_target')}</h4>
              <p className="text-2xl font-serif text-luxury-charcoal dark:text-white italic">€{totalNegotiation.toLocaleString('pt-PT')}</p>
            </div>
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${Math.min((totalNegotiation / 500000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 text-luxury-charcoal dark:text-white">{t('prop_meta_q1')}: €500k</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

