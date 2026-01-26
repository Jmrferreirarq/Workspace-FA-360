
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import SiteLayout from '../components/landing/SiteLayout';
import { useLanguage } from '../context/LanguageContext';

export default function PublicContactPage() {
  const { t, locale } = useLanguage();
  const Motion = motion as any;
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: use locale directly for conditional text
    alert(locale === 'pt' ? "Mensagem enviada com sucesso." : "Message sent successfully.");
  };

  return (
    <SiteLayout>
      <section className="pt-40 px-6 max-w-7xl mx-auto space-y-24 pb-40">
        <header className="max-w-4xl space-y-10">
          <Motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold"
          >
            {t('contact').toUpperCase()}
          </Motion.p>
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none"
          >
            {/* Fix: use locale directly for conditional text */}
            {t('cont_title').split('Arqui')[0]} <span className="text-luxury-gold">{t('cont_title').includes('Arqui') ? (locale === 'pt' ? 'Arquitectos.' : 'Architects.') : ''}</span>
          </Motion.h1>
          <p className="text-2xl font-light opacity-50 max-w-2xl leading-relaxed">{t('cont_subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass p-8 rounded-[2rem] border-white/5 space-y-10 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('cont_form_name')}</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-serif outline-none focus:border-luxury-gold transition-all"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('cont_form_email')}</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-serif outline-none focus:border-luxury-gold transition-all"
                    placeholder="email@domain.com"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('cont_form_brief')}</label>
                <textarea 
                  rows={6}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg font-serif italic outline-none focus:border-luxury-gold transition-all"
                  placeholder={t('cont_form_placeholder')}
                ></textarea>
              </div>
              <button className="px-12 py-6 bg-luxury-gold text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-4 shadow-xl shadow-luxury-gold/10">
                {t('cont_send')} <Send size={16} />
              </button>
            </form>
          </div>

          <aside className="lg:col-span-5 space-y-12">
            <div className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold">{t('cont_office')}</h4>
              <div className="space-y-6">
                <ContactInfo icon={<MapPin size={18}/>} label="Address" value="Av. da Liberdade, 110, 1250-146 Lisboa" />
                <ContactInfo icon={<Phone size={18}/>} label="Phone" value="+351 210 000 000" />
                <ContactInfo icon={<Mail size={18}/>} label="Email" value="geral@ferreiraarq.pt" />
              </div>
            </div>

            <div className="h-64 rounded-[3rem] overflow-hidden grayscale relative border border-white/5 group">
              <img src="https://images.unsplash.com/photo-1524813685485-3de3967b9c62?auto=format&fit=crop&w=800" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-luxury-gold/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="glass p-4 rounded-2xl border-luxury-gold/50 text-luxury-gold font-black uppercase tracking-widest text-[11px]">{t('cont_map')}</div>
              </div>
            </div>

            <div className="flex gap-6">
               <SocialBtn icon={<Instagram size={20}/>} />
               <SocialBtn icon={<Linkedin size={20}/>} />
               <SocialBtn icon={<MessageCircle size={20}/>} />
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactInfo({ icon, label, value }: any) {
  return (
    <div className="flex gap-5 items-start">
      <div className="text-luxury-gold mt-1">{icon}</div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</p>
        <p className="text-lg font-serif italic">{value}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon }: any) {
  return (
    <button className="w-14 h-14 glass rounded-2xl border-white/5 flex items-center justify-center text-white/50 hover:text-luxury-gold hover:border-luxury-gold/30 transition-all">
      {icon}
    </button>
  );
}

