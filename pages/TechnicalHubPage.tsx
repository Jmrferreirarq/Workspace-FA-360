
import React, { useState, useEffect } from 'react';
import {
  Search,
  FileCode,
  FileText,
  Download,
  History,
  Share2,
  Filter,
  AlertCircle,
  FolderOpen,
  Maximize2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';

import PageHeader from '../components/common/PageHeader';


interface TechnicalFile {
  id: string;
  name: string;
  category: string;
  type: string;
  rev: string;
  size: string;
  status: string;
}

interface TransmittalLog {
  timestamp: string;
  recipient: string;
  content: string;
  via: string;
}

export default function TechnicalHubPage() {
  const { t, locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('tech_cat_all');
  const [files, setFiles] = useState<TechnicalFile[]>([]);
  const [aiMessage, setAiMessage] = useState('Analisando integridade documental...');
  const [isScanning, setIsScanning] = useState(false);


  const CATEGORIES = [
    { id: 'tech_cat_all', label: t('tech_cat_all') },
    { id: 'Arquitetura', label: t('tech_cat_arch') },
    { id: 'Especialidades', label: t('tech_cat_spec') },
    { id: 'Interiores', label: t('tech_cat_int') },
    { id: 'Legal', label: t('tech_cat_legal') },
    { id: 'BIM', label: t('tech_cat_bim') }
  ];

  const [transmittals, setTransmittals] = useState<TransmittalLog[]>([]);

  const loadFiles = async () => {
    const data = await fa360.listTechnicalFiles();
    setFiles(data);
  };

  const loadTransmittals = async () => {
    const data = await fa360.listTransmittals();
    setTransmittals(data);
  };

  const runScan = async () => {
    setIsScanning(true);
    const msg = await fa360.runAIIntegrityCheck();
    setAiMessage(msg);
    setIsScanning(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadFiles();
      await loadTransmittals();
      await runScan();
    };
    init();
  }, []);

  const handleDeleteFile = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Deseja eliminar este ficheiro permanentemente?')) {
      await fa360.deleteTechnicalFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFiles = files.filter(f => selectedCategory === 'tech_cat_all' || f.category === selectedCategory);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker={t('tech_kicker')}
        title={<>{t('tech_title_prefix')} <span className="text-luxury-gold">{t('tech_title_suffix')}</span></>}
        actionLabel={t('tech_new_upload')}
        onAction={() => { }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/50 dark:text-white/50 px-4">{t('tech_categories')}</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'glass border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white'
                    }`}
                >
                  {cat.label}
                  <span className="opacity-60">{cat.id === 'tech_cat_all' ? files.length : files.filter(f => f.category === cat.id).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-luxury-gold/5 rounded-xl border border-luxury-gold/10 space-y-4">
            <div className="flex items-center gap-2 text-luxury-gold">
              <AlertCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">AI Integrity Check</span>
            </div>
            <p className="text-xs italic leading-relaxed text-luxury-charcoal/60 dark:text-white/60">
              {isScanning ? "O cerebro esta a analisar os vetores tecnicos..." : (files.length > 0 ? aiMessage : "Aguardando upload de ficheiros para analise de integridade.")}
            </p>
          </div>
        </aside>

        {/* File Explorer Grid */}
        <main className="lg:col-span-9 space-y-10">
          <div className="flex justify-between items-center px-4">
            <div className="relative group w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-charcoal/20 dark:text-white/20 group-hover:text-luxury-gold" />
              <input type="text" placeholder={t('tech_search_placeholder')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all text-luxury-charcoal dark:text-white placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30" />
            </div>
            <div className="flex gap-4">
              <button className="p-3 glass rounded-xl border-black/10 dark:border-white/10 text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-all"><Filter size={18} /></button>
              <button className="p-3 glass rounded-xl border-black/10 dark:border-white/10 text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-all"><Maximize2 size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, i) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-2xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/20 transition-all shadow-strong relative overflow-hidden text-luxury-charcoal dark:text-white"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold"><History size={20} /></button>
                      <button
                        onClick={(e) => handleDeleteFile(e, file.id)}
                        className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform duration-500">
                        {file.type === 'CAD' || file.type === 'BIM' ? <FileCode size={32} /> : <FileText size={32} />}
                      </div>
                      <div>
                        <h4 className="text-xl font-serif italic truncate max-w-[200px] text-luxury-charcoal dark:text-white" title={file.name}>{file.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{file.rev}</span>
                          <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{file.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${file.status === 'Aprovado' ? 'bg-emerald-500' : 'bg-luxury-gold'}`}></div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">{file.status}</span>
                      </div>
                      <div className="flex gap-4">
                        <button className="text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold transition-colors"><Download size={18} /></button>
                        <button className="text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold transition-colors"><Share2 size={18} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-40 glass rounded-2xl border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 text-center bg-black/5 dark:bg-white/[0.02]">
                  <div className="p-10 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 text-luxury-charcoal dark:text-white">
                    <FolderOpen size={48} className="opacity-20" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('tech_empty_title')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal/50 dark:text-white/50">{t('tech_empty_desc')}</p>
                  </div>
                  <button className="px-10 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">{t('tech_btn_upload')}</button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Activity / Transmittals */}
          <section className="pt-12 space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">{t('tech_log_title')}</h3>
              {transmittals.length > 0 && <button className="text-[10px] font-black uppercase tracking-widest border-b border-luxury-gold pb-1 text-luxury-gold">{t('tech_log_export')}</button>}
            </div>
            <div className="glass rounded-2xl overflow-hidden border-black/5 dark:border-white/5">
              <table className="w-full text-left">
                <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
                  <tr>
                    <th className="px-10 py-6">{t('tech_table_date')}</th>
                    <th className="px-10 py-6">{t('tech_table_recipient')}</th>
                    <th className="px-10 py-6">{t('tech_table_content')}</th>
                    <th className="px-10 py-6">{t('tech_table_via')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs text-luxury-charcoal/60 dark:text-white/60">
                  {transmittals.length > 0 ? (
                    transmittals.map((log, idx) => (
                      <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6 font-mono">{new Date(log.timestamp).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="px-10 py-6 font-serif">{log.recipient}</td>
                        <td className="px-10 py-6">{log.content}</td>
                        <td className="px-10 py-6"><span className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full">{log.via}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center italic text-luxury-charcoal/30 dark:text-white/30">{t('tech_table_empty')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

