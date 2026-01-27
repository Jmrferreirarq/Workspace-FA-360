
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Send, Sparkles, Filter, MoreVertical, Star, User, Paperclip, ChevronRight, CheckCircle2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import PageHeader from '../components/common/PageHeader';

const MOCK_MESSAGES: any[] = [];

export default function StudioInboxPage() {
  const [selectedMsg, setSelectedMsg] = useState<any>(MOCK_MESSAGES[0]);
  const [reply, setReply] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const Motion = motion as any;

  const handleAiDraft = async () => {
    setIsDrafting(true);
    // Simulacao de IA para draft de resposta de luxo
    setTimeout(() => {
      setReply("Estimado Joao, agradeco o seu contacto. Relativamente a questao da caixilharia, a nossa visao tecnica privilegia a continuidade visual com perfis minimalistas. Podemos agendar uma breve chamada para detalhar os beneficios termicos desta solucao? Cordialmente, Miguel.");
      setIsDrafting(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-1000">
      <PageHeader 
        kicker="Comunicacoes & Pulse"
        title={<>Studio <span className="text-luxury-gold">Inbox.</span></>}
      />

      <div className="flex items-center gap-4 relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-charcoal/20 dark:text-white/20" size={14} />
        <input type="text" placeholder="Pesquisar mensagens..." className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-10 pr-6 py-3 text-[10px] outline-none focus:border-luxury-gold/50 transition-all w-full text-luxury-charcoal dark:text-white placeholder:text-luxury-charcoal/40" />
      </div>

      <div className="flex-1 flex gap-10 overflow-hidden">
        {/* Master: Message List */}
        <aside className="w-full md:w-[400px] flex flex-col gap-4 overflow-y-auto pr-4 scrollbar-hide">
          {MOCK_MESSAGES.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMsg(msg)}
              className={`p-6 rounded-[2.5rem] border transition-all text-left relative group ${selectedMsg?.id === msg.id ? 'bg-luxury-gold border-luxury-gold shadow-xl shadow-luxury-gold/20' : 'glass border-white/5 hover:border-white/20'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[11px] font-black uppercase tracking-widest ${selectedMsg?.id === msg.id ? 'text-black/40' : 'text-luxury-gold'}`}>{msg.category}</span>
                <span className={`text-[11px] font-mono ${selectedMsg?.id === msg.id ? 'text-black/40' : 'opacity-20'}`}>{msg.time}</span>
              </div>
              <h4 className={`text-lg font-serif italic mb-1 ${selectedMsg?.id === msg.id ? 'text-black' : 'text-luxury-charcoal dark:text-white'}`}>{msg.sender}</h4>
              <p className={`text-xs font-medium mb-3 ${selectedMsg?.id === msg.id ? 'text-black/60' : 'text-luxury-charcoal/60 dark:text-white/60'}`}>{msg.subject}</p>
              <p className={`text-[10px] line-clamp-1 italic ${selectedMsg?.id === msg.id ? 'text-black/40' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>{msg.preview}</p>
              {msg.unread && (
                <div className={`absolute top-6 left-2 w-1.5 h-1.5 rounded-full ${selectedMsg?.id === msg.id ? 'bg-black' : 'bg-luxury-gold shadow-[0_0_8px_#D4AF37]'}`}></div>
              )}
            </button>
          ))}
        </aside>

        {/* Detail: Message Content */}
        <main className="flex-1 glass rounded-[2rem] border-white/5 overflow-hidden flex flex-col shadow-2xl relative">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <Motion
                key={selectedMsg.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col h-full"
              >
                {/* Content Header */}
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold border border-luxury-gold/10">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif italic text-luxury-charcoal dark:text-white">{selectedMsg.sender}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 italic">{selectedMsg.project}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-3 glass rounded-xl border-white/10 opacity-50 hover:opacity-100 hover:text-luxury-gold transition-all"><Star size={18} /></button>
                    <button className="p-3 glass rounded-xl border-white/10 opacity-50 hover:opacity-100 hover:text-luxury-gold transition-all"><MoreVertical size={18} /></button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-10 space-y-8 overflow-y-auto">
                  <div className="space-y-4 max-w-3xl">
                    <h4 className="text-xl font-serif text-luxury-gold italic">"{selectedMsg.subject}"</h4>
                    <p className="text-lg font-light opacity-60 leading-relaxed italic">
                      Estimado Miguel, <br /><br />
                      Espero que estejas bem. Estive a analisar os ultimos renders da Villa Alentejo e fiquei com uma duvida tecnica sobre a caixilharia sugerida. <br /><br />
                      Seria possivel garantir a mesma performance termica mantendo o perfil minimalista que discutimos na ultima reuniao? <br /><br />
                      Fico a aguardar o vosso feedback especializado.
                    </p>
                  </div>
                </div>

                {/* Reply Editor */}
                <div className="p-8 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 space-y-6">
                  <div className="relative">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Escrever resposta de prestigio..."
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 h-40 focus:border-luxury-gold/50 outline-none transition-all text-sm font-light italic text-luxury-charcoal dark:text-white"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={handleAiDraft}
                        disabled={isDrafting}
                        className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-full border border-luxury-gold/20 hover:bg-luxury-gold hover:text-black transition-all group"
                        title="Draft with Gemini AI"
                      >
                        {isDrafting ? <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full border-current"></div> : <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <div className="flex gap-6 opacity-50 text-[11px] font-black uppercase tracking-widest">
                      <button className="hover:text-luxury-gold flex items-center gap-2"><Paperclip size={12} /> Anexar Ficheiro</button>
                      <button className="hover:text-luxury-gold flex items-center gap-2"><CheckCircle2 size={12} /> Marcar Concluido</button>
                    </div>
                    <button className="px-12 py-4 bg-luxury-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-luxury-gold/20">
                      Enviar Mensagem <Send size={14} />
                    </button>
                  </div>
                </div>
              </Motion>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                <Mail size={48} />
                <p className="font-serif italic text-xl">Seleccione uma mensagem para revelar a conversa.</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

