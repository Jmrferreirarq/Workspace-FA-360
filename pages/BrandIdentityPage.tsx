import React, { useState, useEffect } from 'react';
import { Palette, Type, Shield, Download, Sparkles, Layout, Globe, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function BrandIdentityPage() {
   const { t } = useLanguage();
   const [brand, setBrand] = useState({
      studioName: "FERREIRA Arquitetos",
      tagline: "Vision to Matter",
      tone: "Inspirational"
   });
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      fa360.getBrandSettings().then(setBrand);
   }, []);

   const handleSave = async () => {
      setIsSaving(true);
      await fa360.saveBrandSettings(brand);
      setIsSaving(false);
      alert("Identidade de marca guardada no Neural Cloud.");
   };

   return (
      <div className="max-w-5xl mx-auto space-y-20 animate-in fade-in pb-32">
         <PageHeader 
            kicker={t('brand_guardian')}
            title={<>{t('brand_title').split(' ')[0]} <span className="text-luxury-gold">{t('brand_title').split(' ').slice(1).join(' ')}.</span></>}
         />

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
               <section className="glass p-8 rounded-[2rem] border-white/5 space-y-12 shadow-2xl">
                  <div className="flex justify-between items-center">
                     <h3 className="text-3xl font-serif italic">{t('brand_config_base')}</h3>
                     <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-[10px] font-black uppercase tracking-widest border-b border-luxury-gold pb-1 text-luxury-gold disabled:opacity-50"
                     >
                        {isSaving ? "A Guardar..." : t('brand_save_changes')}
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{t('brand_name_label')}</label>
                        <input
                           className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-xl font-serif outline-none focus:border-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
                           value={brand.studioName}
                           onChange={e => setBrand({ ...brand, studioName: e.target.value })}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{t('brand_tagline_label')}</label>
                        <input
                           className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-xl font-serif italic outline-none focus:border-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
                           value={brand.tagline}
                           onChange={e => setBrand({ ...brand, tagline: e.target.value })}
                        />
                     </div>
                  </div>
               </section>

               <section className="glass p-8 rounded-[2rem] border-white/5 space-y-12 shadow-2xl">
                  <div className="flex justify-between items-center">
                     <h3 className="text-3xl font-serif italic">{t('brand_palette')}</h3>
                     <div className="flex gap-2">
                        <span className="w-6 h-6 rounded-full bg-luxury-black border border-white/10"></span>
                        <span className="w-6 h-6 rounded-full bg-luxury-gold"></span>
                        <span className="w-6 h-6 rounded-full bg-luxury-white"></span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     <ColorBox color="#0A0A0A" name="Luxury Black" label="Primary / BG" />
                     <ColorBox color="#D4AF37" name="Luxury Gold" label="Accent / Prestige" />
                     <ColorBox color="#F5F5F7" name="Luxury White" label="Secondary / Text" />
                     <ColorBox color="#1C1C1E" name="Luxury Charcoal" label="Interfaces / UI" />
                  </div>
               </section>

               <section className="glass p-8 rounded-[2rem] border-white/5 space-y-12">
                  <h3 className="text-3xl font-serif italic">{t('brand_assets')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <AssetBox icon={<ImageIcon />} label="Logo Vector (.SVG)" />
                     <AssetBox icon={<Layout />} label="Email Signature" />
                     <AssetBox icon={<Globe />} label="Favicon (.ICO)" />
                     <AssetBox icon={<Type />} label="Custom Typography" />
                  </div>
               </section>
            </div>

            <aside className="lg:col-span-4 space-y-12">
               <div className="glass p-10 rounded-[3rem] space-y-10 border-luxury-gold/20 bg-luxury-gold/[0.01]">
                  <div className="flex items-center gap-3 text-luxury-gold">
                     <Sparkles size={20} />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">{t('brand_voice_ia')}</h4>
                  </div>
                  <p className="text-sm font-light opacity-50 leading-relaxed italic">
                     {t('brand_voice_desc')}
                  </p>
                  <div className="space-y-4 pt-6 border-t border-luxury-gold/10">
                     {['Inspirational', 'Technical', 'Minimalist', 'Poetic'].map(tone => (
                        <button
                           key={tone}
                           onClick={() => setBrand({ ...brand, tone })}
                           className={`w-full py-4 text-[10px] font-black uppercase tracking-widest border rounded-2xl transition-all ${brand.tone === tone ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg' : 'border-white/5 text-white/40 hover:border-luxury-gold/50'}`}
                        >
                           {tone}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center text-center gap-6">
                  <Download size={32} className="opacity-50" />
                  <h4 className="text-xl font-serif italic">{t('brand_book_download')}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Export guidelines (PDF)</p>
                  <button className="w-full py-5 bg-luxury-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Download .PDF</button>
               </div>
            </aside>
         </div>
      </div>
   );
}

function ColorBox({ color, name, label }: any) {
   return (
      <div className="space-y-4 group text-luxury-charcoal dark:text-white">
         <div className="aspect-square rounded-[2rem] border border-black/10 dark:border-white/10 group-hover:scale-105 transition-all duration-500 shadow-xl overflow-hidden">
            <div className="w-full h-full" style={{ backgroundColor: color }}></div>
         </div>
         <div>
            <p className="text-xs font-bold">{name}</p>
            <p className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 mt-1">{label}</p>
            <p className="text-[11px] font-mono text-luxury-charcoal/20 dark:text-white/20 mt-1">{color}</p>
         </div>
      </div>
   );
}

function AssetBox({ icon, label }: any) {
   return (
      <div className="flex items-center gap-5 p-6 glass rounded-3xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all cursor-pointer">
         <div className="text-luxury-gold group-hover:scale-110 transition-transform">{icon}</div>
         <span className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{label}</span>
      </div>
   );
}

