
import React, { useState } from 'react';
import {
  Instagram,
  Send,
  Image as ImageIcon,
  Layout,
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
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-luxury-charcoal/5 dark:border-white/5 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-luxury-gold"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Estúdio Criativo • Marketing Hub</p>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-none tracking-tighter italic">Comunicação <span className="text-luxury-gold">Visual.</span></h1>
          <p className="text-xl font-light opacity-50 max-w-2xl leading-relaxed">Gerencie a identidade digital do estúdio, planeie publicações e utilize IA para gerar legendas e conteúdos de prestígio.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setActiveView('CALENDAR')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'CALENDAR' ? 'bg-luxury-gold text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            Calendário
          </button>
          <button
            onClick={() => setActiveView('ANALYTICS')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'ANALYTICS' ? 'bg-luxury-gold text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            Métricas
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* Content Creation Tool */}
          <div className="glass p-10 rounded-[3rem] border-luxury-gold/20 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} className="text-luxury-gold" />
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-serif">Gerador de Conteúdo IA</h3>
              <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[11px] font-black uppercase tracking-widest rounded-full">Beta v2.4</span>
            </div>
            <div className="space-y-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 h-48 focus:ring-1 focus:ring-luxury-gold outline-none transition-all font-light text-lg italic"
                placeholder="Descreva o projeto ou o tom da publicação... Ex: 'Fotos da Villa Alentejo focadas na luz natural e minimalismo mediterrânico.'"
              ></textarea>

              {aiResponse && (
                <div className="p-8 bg-luxury-gold/5 border border-luxury-gold/10 rounded-[2rem] animate-in fade-in">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-4">Sugestões de Legenda (IA)</h4>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed opacity-80">{aiResponse}</div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="px-10 py-5 bg-luxury-gold text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Gerar Legendas de Luxo
                </button>
                <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all">
                  <ImageIcon size={16} /> Carregar Media
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-serif italic">Feed Planeado</h3>
              <button className="text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-1 opacity-60 hover:opacity-100 transition-opacity">Abrir Instagram Hub</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-full py-20 text-center glass rounded-[2rem] border-dashed border-white/10 opacity-30">
                <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed italic">Nenhum post agendado.</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="glass p-10 rounded-[3rem] space-y-10 border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Alcance Digital</h4>
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Seguidores</p>
                  <p className="text-3xl font-serif italic">18.4K</p>
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+2.4%</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Impressões</p>
                  <p className="text-3xl font-serif italic">145K</p>
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+12.8%</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Interação</p>
                  <p className="text-3xl font-serif italic">4.2%</p>
                </div>
                <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">-0.4%</span>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-8 border-luxury-gold/10 bg-luxury-gold/[0.01]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Datas Críticas</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-luxury-gold/5 rounded-2xl border-l-4 border-luxury-gold">
                <CalendarIcon size={18} className="text-luxury-gold shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-serif">Dia Mundial da Arquitetura</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Faltam 8 dias</p>
                  <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold mt-4 flex items-center gap-2">Gerar Campanha <ChevronRight size={10} /></button>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl">
                <BarChart3 size={18} className="opacity-50 shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-serif">Relatório Trimestral Q3</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Faltam 12 dias</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostCard({ img, date, status }: any) {
  return (
    <div className="glass rounded-[2.5rem] overflow-hidden group cursor-pointer border-white/5 hover:border-luxury-gold/30 transition-all shadow-xl">
      <div className="h-56 relative overflow-hidden">
        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-6 right-6">
          <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${status === 'Agendado' ? 'bg-emerald-500 text-white' : 'bg-luxury-gold text-black'}`}>{status}</span>
        </div>
      </div>
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-center opacity-50">
          <span className="text-[10px] font-mono tracking-widest uppercase">{date}</span>
          <Instagram size={14} />
        </div>
        <p className="text-sm font-serif italic line-clamp-2">"A luz como elemento esculpidor da forma. O silêncio que materializa a visão."</p>
      </div>
    </div>
  );
}

