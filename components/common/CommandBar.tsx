
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, Briefcase, User, Box, FileText, Zap, Sparkles, Globe, Layout, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-bar', handleOpenEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-bar', handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = [
    { id: '1', title: 'Villa Alentejo', category: 'Projectos', icon: <Briefcase size={14} />, path: '/projects/1' },
    { id: '2', title: 'Joao Silva', category: 'Clientes', icon: <User size={14} />, path: '/clients/1' },
    { id: '3', title: 'Marmore de Estremoz', category: 'Material DNA', icon: <Box size={14} />, path: '/dna' },
    { id: 'site1', title: 'Home Portfolio', category: 'Site Publico', icon: <Globe size={14} className="text-luxury-gold" />, path: '/public' },
    { id: 'site2', title: 'Pagina do Estudio', category: 'Site Publico', icon: <Layout size={14} className="text-luxury-gold" />, path: '/public/studio' },
    { id: 'cmd1', title: 'Nova Proposta', category: 'Accoes', icon: <Zap size={14} className="text-luxury-gold" />, path: '/calculator' },
    { id: 'cmd2', title: 'Gerar Caption IA', category: 'Accoes', icon: <Sparkles size={14} className="text-luxury-gold" />, path: '/marketing' },
  ].filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4 md:px-6 print:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative w-full max-w-2xl glass rounded-[2rem] md:rounded-[2.5rem] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
              <Search size={20} className="text-luxury-gold opacity-50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar ou Site Publico..."
                className="flex-1 bg-transparent border-none outline-none text-lg md:text-xl font-serif italic placeholder:opacity-20 text-white"
              />
              <button onClick={() => setIsOpen(false)} className="md:hidden p-2 opacity-60">
                <ArrowRight className="rotate-90" size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedIndex === idx ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'hover:bg-white/5 text-white/70'
                        }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-2 rounded-lg ${selectedIndex === idx ? 'bg-black/20 text-black' : 'bg-white/5 text-luxury-gold'}`}>
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-medium ${selectedIndex === idx ? 'text-black' : 'text-white'}`}>{item.title}</p>
                          <p className={`text-xs font-black uppercase tracking-widest ${selectedIndex === idx ? 'text-black/40' : 'opacity-50 text-white'}`}>{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedIndex === idx && <ArrowRight size={14} />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 opacity-20 text-white">
                  <Search size={40} className="mx-auto" />
                  <p className="font-serif italic text-lg">Sem resultados.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center px-8">
              <div className="hidden md:flex gap-6">
                <Kbd label="a†‘a†“" desc="Navegar" />
                <Kbd label="a†µ" desc="Seleccionar" />
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] opacity-50 text-white">
                <Sparkles size={10} className="text-luxury-gold" />
                IA Search Hub
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Kbd({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono opacity-60 text-white">{label}</span>
      <span className="text-xs font-black uppercase tracking-widest opacity-20 text-white">{desc}</span>
    </div>
  );
}

