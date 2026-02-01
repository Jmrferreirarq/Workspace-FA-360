
import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Search,
  Plus,
  Filter,
  Download,
  Share2,
  Maximize2,
  Sparkles,
  MoreVertical,
  Camera,
  Layers,
  Play,
  Grid,
  List,
  ChevronRight,
  Eye,
  BoxSelect,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function MediaHubPage() {
  const [filter, setFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const Motion = motion as any;

  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creativeAdvice, setCreativeAdvice] = useState<string>("A analisar tendencias de luxo e narrativa visual...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      const data = await fa360.listMediaAssets();
      setAssets(data);
      setLoading(false);

      setIsAnalyzing(true);
      const advice = await fa360.runCreativeMediaAudit();
      setCreativeAdvice(advice);
      setIsAnalyzing(false);
    };
    loadAssets();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === 'Todos' || asset.type === filter;
    const matchesSearch = asset.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader 
        kicker="Digital Asset Management"
        title={<>Media <span className="text-luxury-gold">Hub.</span></>}
        actionLabel="Importar Media"
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Interface */}
        <main className="lg:col-span-9 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              {['Todos', 'Render', 'Photo', 'Video', '360º'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Pesquisar ativos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2 text-[10px] outline-none focus:border-luxury-gold/50 transition-all"
                />
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'opacity-50 hover:opacity-100'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'opacity-50 hover:opacity-100'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset, i) => (
                <Motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-2xl overflow-hidden group border-white/5 hover:border-luxury-gold/30 transition-all shadow-strong relative ${viewMode === 'list' ? 'flex items-center gap-8' : ''}`}
                >
                  {/* Image Container */}
                  <div className={`${viewMode === 'list' ? 'w-64 h-40' : 'aspect-[4/5]'} relative overflow-hidden`}>
                    <img
                      src={asset.url}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out"
                      alt={asset.title}
                    />

                    {/* Hover Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button className={`p-2 rounded-lg backdrop-blur-md transition-colors ${asset.starred ? 'text-luxury-gold' : 'text-white/20 hover:text-white'}`}>
                          <Star size={16} fill={asset.starred ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-luxury-gold hover:text-black transition-all shadow-xl"><Download size={16} /></button>
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-luxury-gold hover:text-black transition-all shadow-xl"><Share2 size={16} /></button>
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-luxury-gold hover:text-black transition-all shadow-xl"><Maximize2 size={16} /></button>
                      </div>
                    </div>

                    {asset.type === 'Video' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                        <div className="w-16 h-16 bg-luxury-gold/80 backdrop-blur-xl rounded-full flex items-center justify-center text-black shadow-strong">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-white">{asset.resolution}</span>
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className={`p-8 ${viewMode === 'list' ? 'flex-1 flex justify-between items-center' : 'space-y-4'}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-gold">{asset.type}</span>
                        {asset.starred && <Zap size={10} className="text-luxury-gold" />}
                      </div>
                      <h4 className="text-xl font-serif italic truncate leading-tight">{asset.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">{asset.project}</p>
                    </div>

                    {viewMode === 'list' ? (
                      <div className="flex items-center gap-10">
                        <div className="hidden xl:block text-right">
                          <p className="text-[11px] font-black uppercase tracking-widest opacity-20 mb-1">Criado em</p>
                          <p className="text-[10px] font-mono opacity-50 italic">14 Out 2024</p>
                        </div>
                        <button className="p-3 opacity-20 hover:opacity-100 hover:text-luxury-gold transition-all"><MoreVertical size={20} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-20">v1.2</span>
                        <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-white transition-colors">Detalhes Tecnicos</button>
                      </div>
                    )}
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredAssets.length === 0 && (
              <div className="col-span-full py-40 text-center glass rounded-xl border-dashed border-white/10">
                <ImageIcon size={48} className="mx-auto opacity-10 mb-6" />
                <h3 className="text-2xl font-serif italic opacity-50">Nenhum ativo visual encontrado.</h3>
                <p className="text-sm font-light opacity-20 mt-2">Tente ajustar os filtros ou a sua pesquisa.</p>
              </div>
            )}
          </div>
        </main>

        {/* AI Creative Director Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="glass p-10 rounded-xl border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-strong relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">Creative AI Assistant</h4>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 hover:border-luxury-gold/30 transition-all group">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-luxury-gold/60">
                  <BoxSelect size={12} />
                  Auto-Curadoria
                </div>
                <p className="text-xs font-light italic opacity-60 leading-relaxed">
                  "{creativeAdvice}"
                </p>
                <button className="w-full py-4 bg-luxury-gold text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/10">
                  Criar Press Kit de Luxo
                </button>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 hover:border-luxury-gold/30 transition-all group">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-luxury-gold/60">
                  <Layers size={12} />
                  Social Reel
                </div>
                <p className="text-xs font-light italic opacity-60 leading-relaxed">
                  "Tens 4 videos de drone do projeto Douro. Queres que gere um Reel de 15s com transicoes cinematograficas?"
                </p>
                <button className="w-full py-4 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Gerar Reel com IA
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-2xl border-white/5 space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Status do Armazenamento</h4>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="opacity-60">Cloud Storage</span>
                  <span className="text-luxury-gold">1.4 TB / 2.0 TB</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-gold w-[70%]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] opacity-50 uppercase font-black mb-1">Imagens</p>
                  <p className="text-2xl font-serif">0</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] opacity-50 uppercase font-black mb-1">Videos</p>
                  <p className="text-2xl font-serif text-luxury-gold">0</p>
                </div>
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-2 group">
                <Eye size={12} className="group-hover:scale-110 transition-transform" />
                Otimizar Biblioteca
              </button>
            </div>
          </div>

          <div className="p-10 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Camera size={40} className="text-indigo-400 group-hover:scale-110 transition-transform duration-700" />
            <div>
              <h4 className="text-xl font-serif italic text-indigo-100 mb-2">Visitas 360º Ativas</h4>
              <p className="text-[11px] font-black uppercase tracking-widest text-indigo-400/60">3 Clientes online agora</p>
            </div>
            <button className="relative z-10 text-[11px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all flex items-center gap-2 group">
              Gerir Nodes 3D <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

