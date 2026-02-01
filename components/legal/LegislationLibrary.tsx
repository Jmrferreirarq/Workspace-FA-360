
import React, { useState } from 'react';
import { Search, ExternalLink, BookOpen, Filter, ArrowRight, Activity } from 'lucide-react';
import { legislationDatabase, Legislation } from '../../data/legislation_database';
import { InteractiveLawReader } from './InteractiveLawReader';
import municipalSources from '../../data/legal/catalog/sources.json';
import topicsData from '../../data/legal/catalog/topics.json';
import articlesIndexData from '../../data/legal/catalog/articles_index.json';

export const LegislationLibrary: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedLawId, setSelectedLawId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'NATIONAL' | 'MUNICIPAL'>('NATIONAL');
    const [selectedMunId, setSelectedMunId] = useState<string | null>(null);

    const openLaw = (id: string) => {
        setSelectedLawId(id);
        setViewerOpen(true);
    };

    const allLegislation = Object.values(legislationDatabase);

    // Get unique categories for filtering
    const allCategories = Array.from(new Set(allLegislation.flatMap(l => l.applicability))).sort();

    const filteredLegislation = allLegislation.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter ? l.applicability.includes(activeFilter) : true;
        return matchesSearch && matchesFilter;
    });

    const filteredArticles = articlesIndexData.entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
            entry.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMun = !selectedMunId || entry.municipality === selectedMunId;
        return matchesSearch && matchesMun;
    });

    const supportedLawIds = ['rjue', 'rgeu', 'reru', 'acessibilidades'];

    if (viewerOpen && selectedLawId && supportedLawIds.includes(selectedLawId)) {
        return <InteractiveLawReader onClose={() => setViewerOpen(false)} lawId={selectedLawId} />;
    }

    const filteredMunicipalSources = municipalSources.municipalities.filter(m => 
        !selectedMunId || m.id === selectedMunId
    );

    return (
        <div className="space-y-6">
            <div className="bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-strong">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 tracking-tight">
                                <div className="p-3 bg-luxury-gold rounded-2xl shadow-lg shadow-luxury-gold/20">
                                    <BookOpen className="w-6 h-6 text-black" />
                                </div>
                                BIBLIOTECA LEGISLATIVA
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
                                Base de dados centralizada de decretos-lei para arquitetura e urbanismo.
                            </p>
                        </div>

                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl pl-12 h-12 text-sm focus:ring-2 focus:ring-gold/50 transition-all focus:bg-white dark:focus:bg-slate-900 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl w-fit">
                            <button 
                                onClick={() => setViewMode('NATIONAL')}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'NATIONAL' ? 'bg-luxury-gold text-black shadow-lg' : 'text-luxury-charcoal/40 dark:text-white/40'}`}
                            >
                                Nacional
                            </button>
                            <button 
                                onClick={() => setViewMode('MUNICIPAL')}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'MUNICIPAL' ? 'bg-luxury-gold text-black shadow-lg' : 'text-luxury-charcoal/40 dark:text-white/40'}`}
                            >
                                Municipal (MVP)
                            </button>
                        </div>

                        {viewMode === 'NATIONAL' ? (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-r pr-8">
                                <button
                                    onClick={() => setActiveFilter(null)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${!activeFilter ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                >
                                    Ver Tudo
                                </button>
                                {allCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveFilter(cat)}
                                        className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${activeFilter === cat ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-r pr-8">
                                <button
                                    onClick={() => setSelectedMunId(null)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${!selectedMunId ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                >
                                    Todos Concelhos
                                </button>
                                {municipalSources.municipalities.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMunId(m.id)}
                                        className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${selectedMunId === m.id ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                    >
                                        {m.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {viewMode === 'NATIONAL' ? (
                        filteredLegislation.length > 0 ? (
                            filteredLegislation.map((leg) => (
                                <NationalLawCard key={leg.id} leg={leg} supportedLawIds={supportedLawIds} onRead={() => openLaw(leg.id)} />
                            ))
                        ) : (
                            <EmptyState />
                        )
                    ) : (
                        <div className="p-8 space-y-12">
                            {/* Search Results from Index if searching */}
                            {searchTerm && filteredArticles.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-gold">Resultados no Açndice Municipal ({filteredArticles.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredArticles.map(entry => (
                                            <div key={entry.entryId} className="glass p-6 rounded-2xl border-black/5 dark:border-white/5 border-l-2 border-l-luxury-gold">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-luxury-gold/10 text-luxury-gold rounded-md">{entry.municipality}</span>
                                                    <a href={entry.officialUrl} target="_blank" rel="noreferrer" className="text-luxury-gold hover:underline"><ExternalLink size={12} /></a>
                                                </div>
                                                <h4 className="text-sm font-bold text-white mb-1">{entry.title}</h4>
                                                <p className="text-[11px] text-white/50 italic mb-3">Ref: {entry.articleRef}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.topics.map(t => <span key={t} className="text-[9px] opacity-40">#{t}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Municipal Instruments */}
                            {filteredMunicipalSources.map((mun) => (
                                <div key={mun.id} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-black text-sm">
                                            {mun.id.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white leading-tight">{mun.name}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{mun.region}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {mun.instruments.map((inst: any) => (
                                            <div key={inst.instrumentId} className="space-y-4">
                                                <h4 className="text-[11px] font-black uppercase tracking-widest text-luxury-gold/60 flex items-center gap-2">
                                                    <BookOpen size={10} /> {inst.title}
                                                </h4>
                                                <div className="space-y-3">
                                                    {inst.sources.map((src: any) => (
                                                        <div key={src.sourceId} className="glass p-5 rounded-2xl border-black/5 dark:border-white/5 hover:border-luxury-gold/30 transition-all group relative overflow-hidden">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-[9px] font-black uppercase bg-white/5 px-1.5 py-0.5 rounded text-white/40">{src.docType}</span>
                                                                        <h5 className="text-xs font-bold text-white group-hover:text-luxury-gold transition-colors">{src.sourceId.replace(`${mun.id}_`, '').replace(/_/g, ' ')}</h5>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {src.topics.map((t: string) => (
                                                                            <span key={t} className="text-[9px] font-black uppercase text-white/20">#{t}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {src.drUrl && (
                                                                        <a href={src.drUrl} target="_blank" rel="noreferrer" title="Ver Diario da Republica" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                                                                            <Activity size={12} />
                                                                        </a>
                                                                    )}
                                                                    <a href={src.officialUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-luxury-gold hover:text-black transition-all">
                                                                        <ExternalLink size={12} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            {src.notes && <p className="text-[11px] italic text-white/30 mt-3">{src.notes}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

const NationalLawCard = ({ leg, supportedLawIds, onRead }: { leg: any, supportedLawIds: string[], onRead: () => void }) => (
    <div key={leg.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all group border-b border-black/5 dark:border-white/5 last:border-b-0">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-gold transition-colors">{leg.title}</h3>
                        <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {leg.year}
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium italic">
                        {leg.summary}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {leg.applicability.map((tag: string) => (
                        <span key={tag} className="text-[11px] font-black bg-gold/5 text-gold-700 dark:text-gold/80 px-3 py-1 rounded-full border border-gold/10 uppercase tracking-tighter">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {leg.official_link && (
                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                    {supportedLawIds.includes(leg.id) && (
                        <button
                            onClick={onRead}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white dark:bg-luxury-gold dark:text-black rounded-xl text-xs font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <BookOpen className="w-4 h-4" />
                            LEITURA INTERNA
                        </button>
                    )}
                    <a
                        href={leg.official_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all border border-slate-200 dark:border-white/10"
                    >
                        <ExternalLink className="w-4 h-4" />
                        OFICIAL
                    </a>
                </div>
            )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-white/[0.03] p-6 rounded-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group/points shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/points:opacity-20 transition-opacity">
                    <Activity className="w-12 h-12" />
                </div>
                <h4 className="text-[11px] font-black text-luxury-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                    Pontos-Chave
                </h4>
                <ul className="space-y-3">
                    {leg.key_points.map((pt: string, i: number) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 font-medium">
                            <ArrowRight className="w-3 h-3 text-luxury-gold mt-0.5 shrink-0" />
                            {pt}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="hidden md:block opacity-10">
                <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                </div>
            </div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="p-8 text-center text-slate-400">
        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center opacity-50">
            <Filter className="w-10 h-10" />
        </div>
        <h4 className="text-lg font-bold text-slate-600 dark:text-slate-300">Sem resultados</h4>
        <p className="text-sm mt-1">Nenhum decreto encontrado para esta pesquisa.</p>
    </div>
);

