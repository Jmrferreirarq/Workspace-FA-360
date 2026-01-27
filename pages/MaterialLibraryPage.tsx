
import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Box,
  Leaf,
  DollarSign,
  Info,
  ArrowRight,
  Maximize2,
  Sparkles,
  Palette,
  Droplets,
  Zap,
  Tag,
  MapPin,
  Truck,
  ExternalLink,
  MessageCircle,
  X,
  FileText,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function MaterialLibraryPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('Todos');
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string>("Selecione um material para analise tecnica avancada.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const Motion = motion as any;

  useEffect(() => {
    fa360.listMaterials().then(data => {
      setMaterials(data);
      setLoading(false);
    });
  }, []);

  const filteredMaterials = materials.filter(m => {
    const matchesFilter = filter === 'Todos' || m.category === filter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAIAdvice = async (material: any) => {
    setIsAnalyzing(true);
    const advice = await fa360.runMaterialAIAnalysis(material);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader 
        kicker={t('material_dna_eco')}
        title={<>Material <span className="text-luxury-gold">DNA.</span></>}
        actionLabel={t('material_dna_catalog')}
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-9 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 w-full md:w-auto">
              {['Todos', 'Stone', 'Wood', 'Cladding', 'Metal', 'Textile'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${filter === f ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative group w-full md:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2 text-[10px] outline-none focus:border-luxury-gold/50 transition-all text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-luxury-gold" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredMaterials.map((material, i) => (
                  <Motion.div
                    key={material.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedMaterial(material)}
                    className="glass rounded-[3rem] overflow-hidden group border-white/5 hover:border-luxury-gold/30 transition-all shadow-2xl cursor-pointer relative"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <img src={material.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s]" />
                      <div className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={16} className="text-white" />
                      </div>
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-luxury-gold">{material.price}</span>
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1"><Leaf size={10} /> {material.eco}%</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{material.category} • {material.finish}</p>
                          <h4 className="text-2xl font-serif italic leading-none text-white">{material.name}</h4>
                        </div>
                        <div className={`p-2 rounded-lg bg-white/5 ${material.location === 'mat_in_studio' ? 'text-emerald-500' : 'text-luxury-gold'}`}>
                          {material.location === 'mat_in_studio' ? <Box size={14} /> : <Truck size={14} />}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-50">{t(material.location as any)}</span>
                        <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-white transition-colors flex items-center gap-2 group/btn">
                          {t('material_dna_tech_sheet')} <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        <aside className="lg:col-span-3 space-y-10">
          {/* AI Advisor */}
          <div className="glass p-10 rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl group-hover:bg-luxury-gold/10 transition-all"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold uppercase">Material AI</h4>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-light italic opacity-60 leading-relaxed text-white">
                {isAnalyzing ? "A processar conceitos fisicos..." : `"${aiAdvice}"`}
              </p>
              {selectedMaterial && (
                <button
                  onClick={() => handleAIAdvice(selectedMaterial)}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-luxury-gold text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                >
                  {isAnalyzing ? "Analisando..." : "Analise de Performance"}
                </button>
              )}
            </div>
          </div>

          {/* Inventario Tracker */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">Rastreio de Amostras</h4>
            <div className="space-y-4">
              <div className="py-10 text-center glass rounded-2xl border-dashed border-white/5 opacity-20">
                <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed italic">Nenhuma amostra em rastreio.</p>
              </div>
            </div>
            <button className="w-full py-4 text-[11px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity text-white">Ver Livro de Amostras</button>
          </div>

          {/* Pegada de Carbono Global */}
          <div className="p-8 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10 flex flex-col items-center text-center gap-4">
            <Droplets size={32} className="text-emerald-400" />
            <h4 className="text-sm font-serif italic text-emerald-100">{t('material_dna_carbon')}</h4>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-3/4"></div>
            </div>
            <span className="text-lg font-serif text-white">Classe A+ Global</span>
          </div>
        </aside>
      </div>

      {/* Detail Modal: Ficha Tecnica Expandida */}
      <AnimatePresence>
        {selectedMaterial && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <Motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMaterial(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <Motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl glass rounded-[2rem] border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            >
              <div className="h-[40vh] md:h-auto relative">
                <img src={selectedMaterial.image} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedMaterial(null)} className="absolute top-8 left-8 p-4 glass rounded-full text-white hover:rotate-90 transition-all"><X size={24} /></button>
              </div>

              <div className="p-8 md:p-20 space-y-12 overflow-y-auto no-scrollbar max-h-[80vh]">
                <header className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[11px] font-black uppercase tracking-widest rounded-full">{selectedMaterial.category}</span>
                    <span className="text-[10px] font-mono opacity-20 text-white">REF: DNA-{selectedMaterial.id}</span>
                  </div>
                  <h2 className="text-5xl font-serif italic text-white">{selectedMaterial.name}</h2>
                  <p className="text-xl font-light opacity-50 italic text-white">{selectedMaterial.finish}</p>
                </header>

                <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">{t('mat_location')}</p>
                    <div className="flex items-center gap-3 text-luxury-gold font-serif italic text-xl">
                      <MapPin size={18} /> {t(selectedMaterial.location as any)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">{t('mat_supplier')}</p>
                    <p className="font-serif italic text-xl text-white">{selectedMaterial.supplier}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">{t('mat_tech_specs')}</h3>
                  <p className="text-sm font-light italic opacity-70 leading-relaxed text-white">
                    {selectedMaterial.technical || "Ficha tecnica completa em processamento pela equipa de curadoria."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-5 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-luxury-gold transition-all">
                    <MessageCircle size={16} /> {t('mat_request_quote')}
                  </button>
                  <button className="flex items-center justify-center gap-3 py-5 glass border-white/10 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all text-white">
                    <ExternalLink size={16} /> PDF Fornecedor
                  </button>
                </div>

                <div className="p-8 bg-luxury-gold/[0.03] rounded-3xl border border-luxury-gold/10 space-y-4">
                  <div className="flex items-center gap-3 text-luxury-gold">
                    <Zap size={16} />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Aplicacoes Recomendadas</h4>
                  </div>
                  <p className="text-xs italic opacity-50 text-white">Ideal para areas de alto trafego, cozinhas e areas sociais devido a sua baixa porosidade e alta resistencia mecanica.</p>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

