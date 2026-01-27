
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useLanguage } from '../../context/LanguageContext';

/* Updated children prop to be optional to resolve TypeScript binding issues in some environments where JSX children are not correctly mapped to required props */
export default function SiteLayout({ children }: { children?: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { locale, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const Motion = motion as any;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('studio'), path: '/public/studio' },
    { name: t('services'), path: '/public/services' },
    { name: t('portfolio'), path: '/public#portfolio' },
    { name: t('contact'), path: '/public/contact' },
  ];

  return (
    <div className="bg-luxury-black text-luxury-white font-sans selection:bg-luxury-gold selection:text-black min-h-screen flex flex-col overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-1000 px-8 md:px-16 py-8 ${isScrolled ? 'bg-luxury-black/90 backdrop-blur-3xl border-b border-white/5 py-6 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/public" className="group">
            <BrandLogo size={40} animated={true} light={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-14 text-xs font-black uppercase tracking-[0.3em]">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`hover:text-luxury-gold transition-all duration-500 relative group ${location.pathname === link.path ? 'text-luxury-gold' : 'opacity-60 hover:opacity-100'}`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-700 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
            
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div>

            <button 
              onClick={toggleLanguage}
              className="px-4 py-2 glass rounded-full text-xs font-black uppercase tracking-widest hover:text-luxury-gold transition-colors opacity-60 hover:opacity-100"
            >
              {locale.toUpperCase()}
            </button>

            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-luxury-gold bg-luxury-gold/5 border border-luxury-gold/20 px-8 py-3 rounded-full hover:bg-luxury-gold hover:text-black transition-all shadow-2xl shadow-luxury-gold/5 group"
            >
              <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" /> 
              <span className="text-xs">{t('accessManagement')}</span>
            </button>
          </nav>

          <button className="md:hidden text-white p-3 glass rounded-full" onClick={() => setMobileMenu(true)}>
            <Menu size={20} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenu && (
          <Motion
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed inset-0 z-[200] bg-luxury-black/98 backdrop-blur-3xl flex flex-col p-8 justify-center items-center"
          >
            <button onClick={() => setMobileMenu(false)} className="absolute top-8 right-12 p-4 glass rounded-full"><X size={32} /></button>
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenu(false)} className="text-5xl font-serif italic text-white/40 hover:text-luxury-gold transition-all">{link.name}</Link>
              ))}
              <div className="h-[1px] w-20 bg-luxury-gold/20 mx-auto mt-10"></div>
              <button 
                onClick={() => { toggleLanguage(); setMobileMenu(false); }}
                className="text-luxury-gold text-2xl font-black uppercase tracking-[0.3em]"
              >
                {locale === 'pt' ? 'Language: EN' : 'Idioma: PT'}
              </button>
              <Link to="/" className="text-luxury-gold text-lg font-black uppercase tracking-[0.3em] mt-4">{t('accessManagement')}</Link>
            </div>
          </Motion>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {children}
      </main>

      <footer className="pt-60 pb-20 px-10 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-32">
          <div className="md:col-span-2 space-y-12">
            <BrandLogo size={60} animated={false} light={true} />
            <h3 className="text-5xl md:text-7xl font-serif italic leading-tight text-white/90">
              {t('footerMotto')}
            </h3>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-luxury-gold">{t('footerAddress')}</h4>
            <p className="opacity-60 font-light text-base leading-relaxed italic text-white/80">
              Av. da Liberdade, 110, 4u Esq.<br/>
              1250-146 Lisboa, Portugal<br/>
              lisboa@ferreiraarq.pt
            </p>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-luxury-gold">{t('footerNewsletter')}</h4>
            <div className="flex border-b border-white/10 pb-4 group">
              <input type="email" placeholder="Email" className="bg-transparent outline-none flex-1 text-sm font-light italic text-white placeholder:opacity-20" />
              <button className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><ArrowUpRight size={20} className="text-luxury-gold"/></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 text-xs font-black uppercase tracking-[0.3em]">
           <p>e 2024 Ferreira Arquitetos a€¢ FA-360 Ecosystem</p>
           <div className="flex gap-8">
              <a href="#">{t('footerPrivacy')}</a>
              <a href="#">{t('footerCookies')}</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

