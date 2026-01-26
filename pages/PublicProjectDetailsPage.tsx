
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, MapPin, Maximize2, Calendar, Layout, ArrowRight, Share2 } from 'lucide-react';
import SiteLayout from '../components/landing/SiteLayout';
import fa360 from '../services/fa360';

export default function PublicProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const Motion = motion as any;

  // Parallax effects for the hero
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fa360.listProjects().then(all => {
      const p = all.find(x => x.id === id);
      setProject(p);
      setLoading(false);
    });
  }, [id]);

  if (loading || !project) return (
    <div className="h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin"></div>
    </div>
  );

  return (
    <SiteLayout>
      {/* Immersive Hero Section */}
      <section className="relative h-[90vh] overflow-hidden flex items-end pb-24 px-6 md:px-20">
        <Motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={project.image} 
            alt={project.name} 
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </Motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent z-1"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8">
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link to="/public#portfolio" className="text-luxury-gold hover:opacity-70 transition-opacity flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Voltar ao Portefólio
            </Link>
          </Motion.div>
          
          <Motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none"
          >
            {project.name}
          </Motion.h1>
          
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <span className="flex items-center gap-2"><MapPin size={12} className="text-luxury-gold"/> Lisboa, Portugal</span>
            <span className="flex items-center gap-2"><Layout size={12} className="text-luxury-gold"/> {project.type}</span>
            <span className="flex items-center gap-2"><Calendar size={12} className="text-luxury-gold"/> Conclusão: 2025</span>
          </Motion.div>
        </div>
      </section>

      {/* Concept Narrative */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-4 space-y-10 sticky top-32">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">O Conceito</p>
            <h2 className="text-5xl font-serif italic leading-tight">Uma ode ao <br/> <span className="text-luxury-gold">Minimalismo</span> Mediterrânico.</h2>
            <div className="flex gap-4">
              <button className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/30 hover:text-luxury-gold transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-12 text-2xl font-light opacity-60 leading-relaxed italic">
            <p>
              A {project.name} surge de uma premissa fundamental: a desmaterialização da fronteira entre o interior e o exterior. Através de grandes planos de vidro e uma paleta cromática reduzida ao essencial, o espaço convida a luz a tornar-se o principal elemento construtivo.
            </p>
            <p>
              Nesta obra, o luxo não reside no ornamento, mas na precisão do detalhe e na nobreza dos materiais naturais. O mármore de Estremoz e a madeira de carvalho escovado dialogam em harmonia, criando uma atmosfera de silêncio e introspeção.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-20 border-t border-white/5 not-italic">
               <ProjectSpec label="Área de Construção" value="450 m²" />
               <ProjectSpec label="Nº de Pisos" value="2 + Cave" />
               <ProjectSpec label="Certificação" value="Classe A+" />
               <ProjectSpec label="Equipa" value="Ferreira, Castelo, Mendes" />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Gallery */}
      <section className="px-6 max-w-7xl mx-auto space-y-12 pb-40">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600607687940-477a284395e5?auto=format&fit=crop&w=1200" 
            className="col-span-12 md:col-span-8 aspect-[16/9]"
            label="A Sala de Estar: Diálogo com o Horizonte"
          />
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800" 
            className="col-span-12 md:col-span-4 aspect-[3/4] mt-12"
            label="Detalhe em Pedra e Luz"
          />
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800" 
            className="col-span-12 md:col-span-4 aspect-square"
            label="O Pátio Interior"
          />
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200" 
            className="col-span-12 md:col-span-8 aspect-video -mt-24"
            label="Vista Exterior: A Geometria do Silêncio"
          />
        </div>
      </section>

      {/* Next Project / CTA */}
      <section className="py-40 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Continuar Exploração</p>
          <h2 className="text-4xl md:text-7xl font-serif italic">Pronto para materializar a sua <br/> <span className="text-luxury-gold underline underline-offset-8 decoration-1">própria visão?</span></h2>
          <div className="flex gap-8 pt-6">
            <Link to="/public/contact" className="px-12 py-6 bg-luxury-gold text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              Agendar Consultoria
            </Link>
            <Link to="/public#portfolio" className="px-12 py-6 glass border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              Outras Obras
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ProjectSpec({ label, value }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-black uppercase tracking-widest opacity-50">{label}</p>
      <p className="text-xl font-serif">{value}</p>
    </div>
  );
}

function GalleryItem({ src, className, label }: any) {
  return (
    <div className={`relative group overflow-hidden rounded-[3rem] shadow-2xl ${className}`}>
      <img 
        src={src} 
        alt={label} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold mb-2">Perspectiva</p>
        <p className="text-2xl font-serif italic">{label}</p>
      </div>
    </div>
  );
}

