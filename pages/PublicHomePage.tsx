
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Play, Sparkles, MessageCircle, X, Send, Activity, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import fa360 from '../services/fa360';
import { geminiService } from '../services/geminiService';
import SiteLayout from '../components/landing/SiteLayout';
import { useLanguage } from '../context/LanguageContext';

export default function PublicHomePage() {
  const { t, locale } = useLanguage();
  const Motion = motion as any;
  const [projects, setProjects] = useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  
  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fa360.listProjects().then(all => setProjects(all.slice(0, 3)));
  }, []);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    const userMsg = { role: 'user', text: chatQuery };
    setChatHistory(prev => [...prev, userMsg]);
    setChatQuery('');
    setIsTyping(true);
    const aiResponse = await geminiService.getPublicConciergeResponse(chatQuery, locale);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <SiteLayout>
      <section className="relative h-[110vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-luxury-black">
        <Motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1600607687940-477a284395e5?auto=format&fit=crop&w=1920" 
            alt="Main Architecture" 
            className="w-full h-full object-cover grayscale brightness-[0.2] transition-all duration-[10s] ease-out scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-black/40 to-luxury-black"></div>
        </Motion.div>
        
        <div className="relative z-10 text-center max-w-7xl space-y-20">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center gap-10"
          >
            <span className="w-20 h-[1px] bg-luxury-gold/30"></span>
            <p className="text-[10px] font-black uppercase tracking-[1em] text-luxury-gold">Lisboa • Estoril • Dubai</p>
            <span className="w-20 h-[1px] bg-luxury-gold/30"></span>
          </Motion.div>

          <div className="space-y-2">
            <Motion.h1 
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-[10vw] md:text-[12vw] font-sans font-black leading-[0.8] tracking-tighter uppercase"
            >
              {t('heroVision')} TO <br/><span className="text-luxury-gold">{t('heroMatter')}.</span>
            </Motion.h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-16 pt-10">
            <Motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1 }}
              className="text-sm md:text-xl font-light max-w-sm text-center md:text-left leading-relaxed italic"
            >
              {t('heroSubtitle')}
            </Motion.p>
            <Motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex gap-8"
            >
              <Link to="/calculator" className="px-14 py-6 bg-luxury-gold text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-110 transition-all shadow-[0_20px_60px_rgba(212,175,55,0.3)]">
                {t('startProject')}
              </Link>
              <button className="px-14 py-6 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border-white/10 text-white group flex items-center gap-3">
                {t('heroShowreel')} <Play size={12} fill="currentColor" className="group-hover:scale-125 transition-transform" />
              </button>
            </Motion.div>
          </div>
        </div>

        <Motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20"
        >
          <ChevronDown size={32} />
        </Motion.div>
      </section>

      <section className="py-60 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-16">
            <Motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-7xl md:text-[8rem] font-sans font-black leading-none text-luxury-black tracking-tighter uppercase">{t('aboutTitle')}</h2>
              <p className="text-3xl font-light text-luxury-black/60 leading-relaxed italic max-w-xl">
                {t('aboutSubtitle')}
              </p>
            </Motion.div>
            <Link to="/public/studio" className="inline-flex items-center gap-6 text-luxury-gold font-black text-[10px] uppercase tracking-[0.3em] border-b border-luxury-gold/30 pb-4 hover:border-luxury-gold transition-all group">
              {t('philosophy')} <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <Motion.div 
              whileInView={{ y: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="aspect-[4/6] rounded-[6rem] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.1)] grayscale hover:grayscale-0 transition-all duration-[2s]"
            >
              <img src="https://images.unsplash.com/photo-1600607687940-477a284395e5?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" />
            </Motion.div>
            <div className="absolute -bottom-16 -left-16 glass p-16 rounded-[2rem] border-luxury-gold/20 shadow-2xl max-w-sm bg-white">
              <p className="text-6xl font-serif italic text-luxury-gold mb-4">01.</p>
              <p className="text-lg font-light text-luxury-black/60 italic leading-relaxed">"{t('aboutQuote')}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating AI Concierge Button */}
      <div className="fixed bottom-10 right-10 z-[200]">
        <AnimatePresence>
          {isAiOpen && (
            <Motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-28 right-0 w-[400px] md:w-[500px] glass rounded-[2rem] border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col bg-luxury-black/90"
            >
              <div className="p-10 border-b border-white/5 bg-luxury-gold text-black flex justify-between items-center">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">{t('aiConciergeTitle')}</h4>
                  <p className="text-[14px] font-serif italic opacity-60 font-bold">{t('aiRole')}</p>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
              </div>
              
              <div className="h-[450px] overflow-y-auto p-10 space-y-8 scrollbar-hide">
                <div className="bg-white/5 p-8 rounded-[3rem] rounded-tl-none border border-white/5">
                   <p className="text-base font-light italic opacity-90 leading-relaxed text-white">
                     {t('aiGreeting')}
                   </p>
                </div>
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-8 rounded-[3rem] max-w-[90%] border shadow-2xl ${
                      msg.role === 'user' 
                        ? 'bg-luxury-gold text-black rounded-tr-none' 
                        : 'bg-white/5 border-white/5 rounded-tl-none text-white/90'
                    }`}>
                      <p className="text-base font-light italic leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-5 rounded-full flex gap-2 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChat} className="p-8 bg-black/60 border-t border-white/5 flex gap-4">
                <input 
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder={t('aiPlaceholder')}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm outline-none focus:border-luxury-gold transition-all text-white placeholder:opacity-50 italic"
                />
                <button className="p-4 bg-luxury-gold text-black rounded-full hover:scale-110 transition-transform shadow-lg shadow-luxury-gold/20">
                  <Send size={18} />
                </button>
              </form>
            </Motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="w-24 h-24 bg-luxury-gold text-black rounded-full shadow-[0_30px_70px_rgba(212,175,55,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-luxury-black"
        >
          <Sparkles size={36} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-luxury-black shadow-lg">
             <MessageCircle size={12} className="text-luxury-gold" />
          </div>
        </button>
      </div>

      <section id="portfolio" className="py-60 px-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-40 gap-16 px-10">
          <div className="space-y-8">
            <h2 className="text-8xl md:text-[10rem] font-sans font-black italic tracking-tighter leading-[0.8] text-luxury-black uppercase">{t('prestigeWorks')}</h2>
            <p className="text-2xl font-light opacity-50 max-w-lg italic">{t('portfolioSubtitle')}</p>
          </div>
          <button className="text-luxury-gold font-black text-[12px] uppercase tracking-[0.6em] border-b border-luxury-gold/30 pb-4 hover:border-luxury-gold transition-all">{t('fullArchive')}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {projects.map((p, i) => (
            <Motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 1.5 }}
              className="group cursor-pointer"
            >
              <Link to={`/public/project/${p.id}`}>
                <div className="relative aspect-[4/5.5] rounded-[3rem] overflow-hidden mb-12 shadow-[0_50px_120px_rgba(0,0,0,0.15)] border border-white/5">
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 transition-all duration-[3s] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute bottom-16 left-16 opacity-0 group-hover:opacity-100 transition-all translate-y-8 group-hover:translate-y-0 duration-700">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-4">{p.type}</p>
                    <h3 className="text-5xl font-sans font-black italic text-white leading-none uppercase">{p.name}</h3>
                  </div>
                </div>
              </Link>
            </Motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

