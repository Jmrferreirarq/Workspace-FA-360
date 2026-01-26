
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Paintbrush, ShieldCheck, Compass, Lightbulb } from 'lucide-react';
import SiteLayout from '../components/landing/SiteLayout';
import { useLanguage } from '../context/LanguageContext';

export default function PublicServicesPage() {
  const { t } = useLanguage();
  const Motion = motion as any;

  const services = [
    {
      title: t('serv_res_title'),
      desc: t('serv_res_desc'),
      icon: <Home className="text-luxury-gold" size={40} />,
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800"
    },
    {
      title: t('serv_corp_title'),
      desc: t('serv_corp_desc'),
      icon: <Building2 className="text-luxury-gold" size={40} />,
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800"
    },
    {
      title: t('serv_int_title'),
      desc: t('serv_int_desc'),
      icon: <Paintbrush className="text-luxury-gold" size={40} />,
      img: "https://images.unsplash.com/photo-1613490493576-7fde63bac817?auto=format&fit=crop&w=800"
    }
  ];

  return (
    <SiteLayout>
      <section className="pt-40 px-6 max-w-7xl mx-auto space-y-40 pb-40">
        <header className="max-w-4xl space-y-10">
          <Motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold"
          >
            {t('services').toUpperCase()}
          </Motion.p>
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none"
          >
            {t('serv_title').split('Elite')[0]} <span className="text-luxury-gold">{t('serv_title').includes('Elite') ? 'Elite.' : ''}</span>
          </Motion.h1>
          <p className="text-2xl font-light opacity-50 max-w-2xl leading-relaxed">{t('serv_subtitle')}</p>
        </header>

        <div className="space-y-32">
          {services.map((s, i) => (
            <Motion.div 
              key={s.title} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`flex flex-col md:flex-row gap-20 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 space-y-8">
                <div className="p-6 bg-luxury-gold/5 w-fit rounded-3xl border border-luxury-gold/10">{s.icon}</div>
                <h2 className="text-5xl font-serif">{s.title}</h2>
                <p className="text-xl font-light opacity-50 leading-relaxed">{s.desc}</p>
                <ul className="space-y-4 text-sm font-light opacity-60">
                  <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-luxury-gold" /> {t('material_dna_tech_sheet')}</li>
                  <li className="flex items-center gap-3"><Compass size={16} className="text-luxury-gold" /> {t('status_licensing')}</li>
                  <li className="flex items-center gap-3"><Lightbulb size={16} className="text-luxury-gold" /> 3D Modeling</li>
                </ul>
              </div>
              <div className="flex-1 aspect-video rounded-[2rem] overflow-hidden group">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
              </div>
            </Motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

