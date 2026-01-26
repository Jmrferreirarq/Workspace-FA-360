
import React, { useState } from 'react';
import { Search, ChevronRight, Info, Book, ArrowLeft, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { rjueStructure, LawArticle, LawStructure } from '../../data/laws/rjue_structure';
import { rgeuStructure } from '../../data/laws/rgeu_structure';
import { reruStructure } from '../../data/laws/reru_structure';
import { acessibilidadesStructure } from '../../data/laws/acessibilidades_structure';

const lawsMap: Record<string, LawStructure> = {
    'rjue': rjueStructure,
    'rgeu': rgeuStructure,
    'reru': reruStructure,
    'acessibilidades': acessibilidadesStructure
};

interface InteractiveLawReaderProps {
    onClose?: () => void;
    lawId: string;
    initialArticleId?: string;
}

export const InteractiveLawReader: React.FC<InteractiveLawReaderProps> = ({ onClose, lawId, initialArticleId }) => {
    const activeLaw = lawsMap[lawId] || rjueStructure;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<LawArticle | null>(
        initialArticleId ? activeLaw.articles.find(a => a.id === initialArticleId) || activeLaw.articles[0] : activeLaw.articles[0]
    );
    const [architectMode, setArchitectMode] = useState(true);

    const filteredArticles = activeLaw.articles.filter(a =>
        a.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[700px] bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-gold" />
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-tight">Leitor de Legislação Interativo</h2>
                        <p className="text-[10px] text-slate-400 font-mono">{activeLaw.title}</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-xs font-bold">
                        <span className="hidden sm:inline">FECHAR LEITOR</span>
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Index */}
                <div className="w-72 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar Artigo..."
                                className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md pl-8 h-8 text-[11px] focus:ring-1 focus:ring-gold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredArticles.map((art) => (
                            <button
                                key={art.id}
                                onClick={() => setSelectedArticle(art)}
                                className={`w-full text-left p-3 border-b border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-between group ${selectedArticle?.id === art.id ? 'bg-white dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
                            >
                                <div className="min-w-0">
                                    <div className={`text-[10px] font-bold ${selectedArticle?.id === art.id ? 'text-gold' : 'text-slate-400'}`}>{art.number}</div>
                                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">{art.title}</div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 ${selectedArticle?.id === art.id ? 'text-gold' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content View */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
                    {/* Content Toolbar */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 italic">
                            {selectedArticle?.number}
                        </div>
                        <button
                            onClick={() => setArchitectMode(!architectMode)}
                            className="flex items-center gap-2 text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:text-gold transition-colors"
                        >
                            <span>Modo Arquiteto (Notas AI)</span>
                            {architectMode ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Article Body */}
                    <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full space-y-8">
                        {selectedArticle ? (
                            <>
                                <div className="space-y-4">
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {selectedArticle.title}
                                    </h1>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
                                        {selectedArticle.content}
                                    </p>
                                </div>

                                {architectMode && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {selectedArticle.architect_note && (
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-5 rounded-r-lg">
                                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                                                    <Info className="w-4 h-4" />
                                                    Destaque Técnico
                                                </div>
                                                <p className="text-sm text-emerald-800 dark:text-emerald-300 italic">
                                                    {selectedArticle.architect_note}
                                                </p>
                                            </div>
                                        )}

                                        {selectedArticle.simplex_2024_update && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-5 rounded-r-lg">
                                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                                                    <Book className="w-4 h-4" />
                                                    Alteração Simplex 2024
                                                </div>
                                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                                    {selectedArticle.simplex_2024_update}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <Search className="w-12 h-12 mb-4 opacity-10" />
                                <p>Selecione um artigo para começar a leitura.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                <div>Ferreira Arquitetos - Inteligência Jurídica v1.0</div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> RJUE Atualizado</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Simplex 2024</span>
                </div>
            </div>
        </div>
    );
};

