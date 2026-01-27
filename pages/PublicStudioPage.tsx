
import React from 'react';
import { motion } from 'framer-motion';
import SiteLayout from '../components/landing/SiteLayout';
import { useLanguage } from '../context/LanguageContext';

export default function PublicStudioPage() {
  const { t, locale } = useLanguage();
  const Motion = motion as any;

  return (
    <SiteLayout>
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto space-y-20">
        <header className="max-w-4xl space-y-10">
          <Motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold"
          >
            {t('studio_history')}
          </Motion.p>
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none"
          >
            {/* Fix: use locale directly for conditional text */}
            {t('studio_title').split('excel')[0]} <span className="text-luxury-gold">{t('studio_title').includes('excel') ? (locale === 'pt' ? 'excelencia.' : 'excellence.') : ''}</span>
          </Motion.h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-[2rem] overflow-hidden"
          >
            <img src="https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=1200" alt="Studio" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </Motion.div>
          <div className="space-y-12">
            <h2 className="text-4xl font-serif">{t('studio_founded')}</h2>
            <div className="space-y-8 text-xl font-light opacity-60 leading-relaxed">
              <p>{t('studio_p1')}</p>
              <p>{t('studio_p2')}</p>
            </div>
          </div>
        </div>

        <section className="py-20 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           <AboutStat num="18+" label={t('studio_exp')} />
           <AboutStat num="45" label={t('studio_archs')} />
           <AboutStat num="250+" label={t('studio_works')} />
           <AboutStat num="12" label={t('studio_awards')} />
        </section>

        <section className="space-y-20">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-center">{t('studio_team')}</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TeamMember name="Miguel Ferreira" role="CEO & Lead Architect" img="https://i.pravatar.cc/400?u=miguel" />
              <TeamMember name="Sofia Castelo" role="Director of Design" img="https://i.pravatar.cc/400?u=sofia" />
              <TeamMember name="Ricardo Mendes" role="Director of Innovation" img="https://i.pravatar.cc/400?u=ricardo" />
           </div>
        </section>
      </section>
    </SiteLayout>
  );
}

function AboutStat({ num, label }: any) {
  return (
    <div className="space-y-2">
      <p className="text-5xl font-serif text-luxury-gold italic">{num}</p>
      <p className="text-[11px] font-black uppercase tracking-widest opacity-60">{label}</p>
    </div>
  );
}

function TeamMember({ name, role, img }: any) {
  return (
    <div className="space-y-6 group cursor-pointer">
      <div className="aspect-square rounded-[3rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="text-center">
        <h4 className="text-2xl font-serif">{name}</h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-2">{role}</p>
      </div>
    </div>
  );
}

