
import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Sparkles,
  BarChart3,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

export default function MarketingPage() {
  const [activeView, setActiveView] = useState('CALENDAR');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const result = await geminiService.generateMarketingCaption(prompt);
    setAiResponse(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-serif italic leading-tight">Marketing <span className="text-luxury-gold">Hub</span></h1>
          <p className="text-sm opacity-60 max-w-2xl">Gerencie conteúdo digital e métricas com IA</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('CALENDAR')}
            className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeView === 'CALENDAR' ? 'bg-luxury-gold text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            Calendario
          </button>
          <button
            onClick={() => setActiveView('ANALYTICS')}
            className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeView === 'ANALYTICS' ? 'bg-luxury-gold text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            Metricas
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-8">
          {/* Content Creation Tool */}
          <div className="glass p-6 rounded-2xl border-luxury-gold/20 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={80} className="text-luxury-gold" />
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif">Gerador de Conteúdo IA</h3>
              <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-xs font-bold uppercase tracking-wider rounded-full">Beta</span>
            </div>
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-6 h-40 focus:ring-1 focus:ring-luxury-gold outline-none transition-all text-base"
                placeholder="Descreva o projeto... Ex: 'Fotos da Villa Alentejo focadas na luz natural'"
              ></textarea>

              {aiResponse && (
                <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/10 rounded-xl animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-3">Sugestões IA</h4>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed opacity-80">{aiResponse}</div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="px-6 py-3 bg-luxury-gold text-black rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Gerar Conteúdo
                </button>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-all">
                  <ImageIcon size={16} /> Upload
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif">Feed Planeado</h3>
              <button className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity">Instagram →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-full py-12 text-center glass rounded-xl border-dashed border-white/10 opacity-30">
                <p className="text-xs uppercase font-bold tracking-wider">Nenhum post agendado</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6 border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50">Alcance Digital</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">Seguidores</p>
                  <p className="text-2xl font-serif">18.4K</p>
                </div>
                <span className="text-emerald-500 text-xs font-bold">+2.4%</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">Impressões</p>
                  <p className="text-2xl font-serif">145K</p>
                </div>
                <span className="text-emerald-500 text-xs font-bold">+12.8%</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">Interação</p>
                  <p className="text-2xl font-serif">4.2%</p>
                </div>
                <span className="text-red-500 text-xs font-bold">-0.4%</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl space-y-4 border-luxury-gold/10 bg-luxury-gold/[0.01]">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50">Datas Críticas</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-luxury-gold/5 rounded-xl border-l-4 border-luxury-gold">
                <CalendarIcon size={16} className="text-luxury-gold shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium">Dia Mundial da Arquitetura</p>
                  <p className="text-xs opacity-60 mt-1">Faltam 8 dias</p>
                  <button className="text-xs font-bold text-luxury-gold mt-3 flex items-center gap-1 hover:gap-2 transition-all">Gerar Campanha <ChevronRight size={12} /></button>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                <BarChart3 size={16} className="opacity-50 shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium">Relatório Trimestral Q3</p>
                  <p className="text-xs opacity-60 mt-1">Faltam 12 dias</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

