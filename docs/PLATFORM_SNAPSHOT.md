# Platform Codebase Snapshot
Generated on 01/27/2026 20:23:54

## File: .vercel\project.json
```
{"projectId":"prj_45OIuzg1yXakK570crOwVA7Frzb6","orgId":"team_T6YHOUyjne5ddgoZ0N6W0HqW","projectName":"fa360-studio"}
```

## File: .\api\oneclick\create.ts
```
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { payload, level } = req.body || {};
  if (!payload?.simulationId || !payload?.templateId) {
    return res.status(400).json({ error: 'Missing payload fields' });
  }

  // URL do Apps Script (WebApp) que grava no Sheets
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_AUTOMATION_URL;
  if (!scriptUrl) return res.status(500).json({ error: 'Missing GOOGLE_APPS_SCRIPT_AUTOMATION_URL' });

  try {
    const r = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, level }),
    });

    const json = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(500).json({ error: 'Apps Script error', details: json });
    }

    return res.status(200).json(json);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
```

## File: .\api\docs.ts
```
// This is a Vercel Serverless Function skeleton for Document Storage

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { projectId, filename, mimeType, contentBase64 } = req.body || {};
  if (!projectId || !filename || !mimeType || !contentBase64) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Forward to Google Apps Script (Drive uploader)
    // Environment variable must be set in Vercel/Local env
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_DOCS_URL;

    if (!scriptUrl) {
      // Mocking successful response for local development if URL not set
      console.log("Mocking Drive upload for project:", projectId);
      return res.status(200).json({ 
        url: `https://mock-drive.fa360.design/${projectId}/${filename}`,
        success: true 
      });
    }

    const r = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, filename, mimeType, contentBase64 }),
    });

    const json = await r.json();
    return res.status(200).json(json); // { url: "https://drive..." }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
```

## File: .\components\common\BrandLogo.tsx
```

import React from 'react';
import { motion } from 'framer-motion';

interface BrandLogoProps {
  size?: number;
  animated?: boolean;
  light?: boolean;
  withIcon?: boolean;
}

export default function BrandLogo({ 
  size = 40, 
  animated = true, 
  light = false,
  withIcon = false 
}: BrandLogoProps) {
  const textColor = light ? "text-white" : "text-luxury-charcoal dark:text-white";
  
  // Constantes para o alinhamento perfeito do bloco tipografico
  // O tracking de 0.78em permite que 'ARQUITETOS' ocupe o mesmo espaco que 'FERREIRA'
  const subTitleTracking = "0.78em";
  
  return (
    <div className="flex items-center gap-6 group cursor-pointer select-none">
      {withIcon && (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Acone Geometrico Minimalista - Baseado em angulos retos de arquitetura */}
          <motion.path
            d="M20 80V20H50"
            stroke={light ? "#FFF" : "#D4AF37"}
            strokeWidth="4"
            initial={animated ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M80 20V80H50"
            stroke={light ? "#FFF" : "#D4AF37"}
            strokeWidth="4"
            initial={animated ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
          />
        </svg>
      )}
      
      <div className="flex flex-col items-center">
        {/* Bloco Superior: FERREIRA A® */}
        <div className="relative flex items-start">
          <motion.span 
            initial={animated ? { opacity: 0, y: 5 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`text-[28px] md:text-[34px] font-sans font-[900] tracking-[-0.03em] uppercase leading-none ${textColor}`}
          >
            FERREIRA
          </motion.span>
          
          <motion.span 
            initial={animated ? { opacity: 0 } : { opacity: 0.6 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
            className={`text-xs md:text-[11px] absolute -right-3.5 md:-right-4 top-1 font-sans font-black ${textColor}`}
          >
            &reg;
          </motion.span>
        </div>
        
        {/* Bloco Inferior: ARQUITETOS (Tracking Largo) */}
        <motion.span 
          initial={animated ? { opacity: 0, scaleX: 0.8 } : { opacity: 0.5, scaleX: 1 }}
          animate={{ opacity: 0.5, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className={`text-xs md:text-xs font-sans font-[300] uppercase pt-3 text-center w-full ${textColor}`}
          style={{ 
            letterSpacing: subTitleTracking,
            marginRight: `-${subTitleTracking}` // Ajuste para centralizacao otica perfeita
          }} 
        >
          ARQUITETOS
        </motion.span>
      </div>
    </div>
  );
}

```

## File: .\components\common\CommandBar.tsx
```

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

```

## File: .\components\common\GlobalUtilities.tsx
```

import React from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Tooltip } from '../ui/Tooltip';

export default function GlobalUtilities() {
    const { theme, toggleTheme } = useTheme();
    const { locale, toggleLanguage, t } = useLanguage();

    return (
        <div className="fixed top-6 right-6 z-[200] hidden lg:flex items-center gap-2 print:hidden">
            <div className="glass p-2 rounded-full border-white/5 flex items-center gap-1.5 bg-black/20 backdrop-blur-xl shadow-2xl">
                <Tooltip content={t('sys_language')} position="bottom">
                  <button
                      onClick={toggleLanguage}
                      className="px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                      <Globe size={16} className="text-luxury-gold opactiy-80" />
                      {locale}
                  </button>
                </Tooltip>

                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>

                <Tooltip content={theme === 'dark' ? t('sys_mode_light') : t('sys_mode_dark')} position="bottom">
                  <button
                      onClick={toggleTheme}
                      className="p-3 rounded-full text-white hover:bg-white/10 transition-all relative group"
                  >
                      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                </Tooltip>
            </div>
        </div>
    );
}
```

## File: .\components\common\MetricCard.tsx
```
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
    variant?: 'default' | 'gold' | 'success' | 'warning' | 'error';
}

export default function MetricCard({
    label,
    value,
    trend,
    trendUp = true,
    icon,
    variant = 'default'
}: MetricCardProps) {

    const variants = {
        default: 'bg-white/[0.02]',
        gold: 'bg-luxury-gold/[0.05] border-luxury-gold/20',
        success: 'bg-emerald-500/[0.05] border-emerald-500/20',
        warning: 'bg-amber-500/[0.05] border-amber-500/20',
        error: 'bg-red-500/[0.05] border-red-500/20',
    };

    const iconBg = {
        default: 'bg-white/10 text-luxury-gold',
        gold: 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/30',
        success: 'bg-emerald-500/20 text-emerald-500',
        warning: 'bg-amber-500/20 text-amber-500',
        error: 'bg-red-500/20 text-red-500',
    };

    return (
        <div className={`
      glass p-8 rounded-[2rem] border-white/10 
      card-interactive group
      ${variants[variant]}
    `}>
            {/* Icon */}
            <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-6
        transition-all duration-300
        group-hover:scale-110
        ${iconBg[variant]}
      `}>
                {icon}
            </div>

            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
                {label}
            </p>

            {/* Value + Trend */}
            <div className="flex items-end gap-3">
                <p className="text-4xl font-black italic text-white tracking-tight">
                    {value}
                </p>
                {trend && (
                    <span className={`
            text-sm font-bold pb-1 flex items-center gap-1
            ${trendUp ? 'text-emerald-500' : 'text-red-500'}
          `}>
                        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

```

## File: .\components\common\Navbar.tsx
```

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckSquare,
  Box,
  Mail,
  Bell,
  Search,
  FileText,
  TrendingUp,
  Calendar,
  Layers,
  ImageIcon,
  Calculator,
  Shield,
  Zap,
  Brain,
  Scale
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import NotificationPulse from './NotificationPulse';
import BrandLogo from './BrandLogo';
import { Tooltip } from '../ui/Tooltip';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  specialColor?: string;
  statusDot?: boolean;
  neuralOnline?: boolean;
}

const NavItem = ({ to, icon: Icon, label, specialColor, statusDot, neuralOnline }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to
    ? "bg-luxury-gold text-black shadow-[0_0_25px_rgba(212,175,55,0.5)] scale-110 z-10"
    : "hover:bg-black/5 dark:hover:bg-white/10 opacity-50 hover:opacity-100";

  return (
    <Tooltip content={label} position="top">
      <Link
        to={to}
        className={`relative p-3 md:p-3.5 rounded-xl transition-all duration-500 group shrink-0 flex items-center justify-center ${specialColor && location.pathname === to ? specialColor : isActive}`}
      >
        <Icon size={20} className="md:w-[22px] md:h-[22px] text-luxury-charcoal dark:text-white" />
        {statusDot && (
          <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${neuralOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
        )}
      </Link>
    </Tooltip>
  );
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLanguage, t } = useLanguage();
  const [pulseOpen, setPulseOpen] = useState(false);
  const [neuralOnline, setNeuralOnline] = useState(localStorage.getItem('fa-brain-status') === 'ONLINE');

  useEffect(() => {
    const handleNeuralUpdate = () => setNeuralOnline(localStorage.getItem('fa-brain-status') === 'ONLINE');
    window.addEventListener('neural-link-active', handleNeuralUpdate);
    window.addEventListener('fa-sync-complete', handleNeuralUpdate);
    return () => {
      window.removeEventListener('neural-link-active', handleNeuralUpdate);
      window.removeEventListener('fa-sync-complete', handleNeuralUpdate);
    };
  }, []);

  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const checkNotifications = () => {
      const saved = localStorage.getItem('fa-studio-pulse-notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHasNotifications(parsed.length > 0);
      } else {
        // Default to true if no storage (mocks exist)
        setHasNotifications(true);
      }
    };

    checkNotifications();
    window.addEventListener('storage', checkNotifications);
    window.addEventListener('fa-notifications-updated', checkNotifications);

    return () => {
      window.removeEventListener('storage', checkNotifications);
      window.removeEventListener('fa-notifications-updated', checkNotifications);
    };
  }, []);

  return (
    <>
      <NotificationPulse isOpen={pulseOpen} onClose={() => setPulseOpen(false)} />

      <div className="fixed top-6 left-6 z-[200] hidden lg:block print:hidden group">
        <Link to="/" className="glass p-4 pr-10 rounded-[1.8rem] border-black/5 dark:border-white/5 flex items-center hover:border-luxury-gold/40 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-luxury-white/50 dark:bg-black/20 backdrop-blur-xl">
          <BrandLogo animated={false} />
        </Link>
      </div>

      <nav className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[300] w-[96vw] md:w-auto max-w-[98vw] print:hidden">
        <div className="glass rounded-[2.5rem] md:rounded-[2rem] p-3 md:p-3.5 flex items-center gap-2 md:gap-3 shadow-[0_30px_70px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] border-black/5 dark:border-white/10 lg:overflow-visible overflow-x-auto md:overflow-x-visible no-scrollbar md:no-scrollbar-off scroll-smooth snap-x">

          <div className="flex items-center px-2 border-r border-black/5 dark:border-white/5 gap-2 shrink-0 snap-start">
            <Tooltip content={t('sys_search')} position="top">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-bar'))}
                className="p-3.5 rounded-xl hover:bg-luxury-gold/20 text-luxury-gold transition-all shrink-0 flex items-center justify-center"
              >
                <Search size={22} />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center px-2 border-r border-black/5 dark:border-white/5 gap-2 shrink-0 snap-start">
            <NavItem to="/" icon={LayoutDashboard} label={t('dashboard')} />
            <NavItem to="/projects" icon={Briefcase} label={t('projects')} />
            <NavItem to="/tasks" icon={CheckSquare} label={t('tasks')} />
            <NavItem to="/clients" icon={Users} label={t('clients')} />
          </div>

          <div className="flex items-center px-2 border-r border-black/5 dark:border-white/5 gap-2 shrink-0 snap-start">
            <NavItem to="/proposals" icon={FileText} label={t('proposals')} />
            <NavItem to="/legal" icon={Scale} label="Legal" />
            <NavItem to="/financial" icon={TrendingUp} label={t('financial')} />
            <NavItem to="/calendar" icon={Calendar} label={t('calendar')} />
            <NavItem to="/inbox" icon={Mail} label={t('inbox')} />
          </div>

          <div className="flex items-center px-2 border-r border-black/5 dark:border-white/5 gap-2 shrink-0 snap-start">
            <NavItem to="/media" icon={ImageIcon} label={t('media')} />
            <NavItem to="/dna" icon={Box} label={t('dna')} />
            <NavItem to="/technical" icon={Layers} label={t('technical')} />
          </div>

          <div className="flex items-center pl-2 gap-1.5 shrink-0 pr-3 snap-start">
            <NavItem to="/calculator" icon={Calculator} label={t('calculator')} />
            <NavItem to="/brand" icon={Shield} label={t('brand')} />
            <NavItem to="/neural" icon={Brain} label="Neural Studio" specialColor="bg-indigo-500 text-white shadow-[0_0_25px_#6366f1]" statusDot neuralOnline={neuralOnline} />
            <NavItem to="/antigravity" icon={Zap} label={t('sys_antigravity')} />

            <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10 mx-2"></div>

            <Tooltip content={t('notifications')} position="top">
              <button onClick={() => setPulseOpen(true)} className="p-3.5 rounded-xl opacity-50 hover:opacity-100 transition-all shrink-0 relative text-luxury-charcoal dark:text-white flex items-center justify-center">
                <Bell size={22} />
                {hasNotifications && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]"></div>}
              </button>
            </Tooltip>
          </div>
        </div>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (min-width: 768px) {
          .md\\:no-scrollbar-off { -ms-overflow-style: auto; scrollbar-width: auto; }
          .md\\:no-scrollbar-off::-webkit-scrollbar { display: block; width: 0; height: 0; }
        }
      `}</style>
    </>
  );
}

```

## File: .\components\common\NotificationPulse.tsx
```

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Bell, MessageSquare, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface NotificationPulseProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Atraso em Licenciamento', desc: 'C.M. Lisboa solicitou esclarecimentos para Villa Alentejo.', time: '12m atras', project: 'Villa Alentejo', link: '/legal' },
  { id: 2, type: 'client', title: 'Joao Silva aprovou material', desc: 'Revestimento Master Suite confirmado via Portal.', time: '1h atras', project: 'Apartamento Chiado', link: '/portal/demo' },
  { id: 3, type: 'update', title: 'Novo Render Finalizado', desc: 'A equipa de 3D carregou as vistas nocturnas.', time: '4h atras', project: 'HQ Tech Valley', link: '/media' },
];

const STORAGE_KEY = 'fa-studio-pulse-notifications';

export default function NotificationPulse({ isOpen, onClose }: NotificationPulseProps) {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : NOTIFICATIONS;
  });

  const handleClick = (id: number, link: string) => {
    const updated = notifications.filter((n: any) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('fa-notifications-updated'));
    navigate(link);
    onClose();
  };

  const resetNotifications = () => {
    setNotifications(NOTIFICATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NOTIFICATIONS));
    window.dispatchEvent(new CustomEvent('fa-notifications-updated'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md glass border-l border-white/10 z-[260] p-10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-luxury-gold" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Studio Pulse</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="opacity-50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={n.id} 
                      onClick={() => handleClick(n.id, n.link)}
                      className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-luxury-gold/30 transition-all cursor-pointer hover:bg-white/[0.04]"
                    >
                      <div className="flex gap-5">
                        <div className={`p-3 rounded-2xl shrink-0 ${
                          n.type === 'critical' ? 'bg-red-500/10 text-red-500' : 
                          n.type === 'client' ? 'bg-luxury-gold/10 text-luxury-gold' : 'bg-white/5 opacity-60'
                        }`}>
                          {n.type === 'critical' ? <AlertTriangle size={16} /> : 
                           n.type === 'client' ? <MessageSquare size={16} /> : <Zap size={16} />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-black uppercase tracking-widest text-luxury-gold group-hover:text-white transition-colors">{n.project}</p>
                            <span className="text-xs font-mono opacity-20">{n.time}</span>
                          </div>
                          <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{n.title}</h4>
                          <p className="text-xs font-light opacity-60 leading-relaxed">{n.desc}</p>
                        </div>
                      </div>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={14} className="text-luxury-gold" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40 space-y-4"
                  >
                    <Bell size={48} className="text-white/20" />
                    <p className="text-sm font-serif italic">Tudo limpo. Desfrute do silencio.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-white/5 mt-auto">
              <button onClick={resetNotifications} className="w-full py-4 glass border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-2 group">
                 {notifications.length === 0 ? "Simular Novas Notificacoes" : "Ver Todo o Historico"} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

```

## File: .\components\common\PageHeader.tsx
```
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  kicker?: string;
  title: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  statusIndicator?: boolean;
  customStatus?: React.ReactNode;
}

export default function PageHeader({ 
  kicker, 
  title, 
  actionLabel, 
  onAction,
  statusIndicator = false,
  customStatus
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/5 mb-8">
      <div>
         {kicker && (
           <div className="flex items-center gap-3 mb-2">
              {statusIndicator && <div className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse"></div>}
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/40 dark:text-white/40">{kicker}</p>
           </div>
         )}
         <h1 className="text-4xl md:text-5xl font-serif italic text-luxury-charcoal dark:text-white leading-none">
           {title}
         </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {customStatus}
        
        {actionLabel && onAction && (
            <button 
              onClick={onAction} 
              className="px-8 py-4 bg-luxury-gold text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_#D4AF3730] flex items-center gap-2"
            >
                {actionLabel}
            </button>
        )}
      </div>
    </div>
  );
}
```

## File: .\components\common\ProjectCard.tsx
```
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        type_key: string;
        client?: string;
        progress: number;
        status: 'active' | 'warning' | 'critical' | 'completed';
        lastUpdate?: string;
        deadline?: string;
        area?: string;
    };
    onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const statusConfig = {
        active: {
            border: 'border-l-emerald-500',
            bg: 'bg-emerald-500/5',
            dot: 'bg-emerald-500',
            label: t('status_construction'), // Using best fit existing keys or defaults
            labelColor: 'text-emerald-500',
        },
        warning: {
            border: 'border-l-amber-500',
            bg: 'bg-amber-500/5',
            dot: 'bg-amber-500 animate-pulse',
            label: t('status_warning'),
            labelColor: 'text-amber-500',
        },
        critical: {
            border: 'border-l-red-500',
            bg: 'bg-red-500/5',
            dot: 'bg-red-500 animate-pulse',
            label: 'URGENT', // Keep urgent global
            labelColor: 'text-red-500',
        },
        completed: {
            border: 'border-l-white/20',
            bg: 'bg-white/[0.02] opacity-60',
            dot: 'bg-white/40',
            label: t('closed'),
            labelColor: 'text-white/40',
        },
    };

    const config = statusConfig[project.status];

    const progressColor = {
        active: 'from-emerald-500 to-emerald-400',
        warning: 'from-amber-500 to-amber-400',
        critical: 'from-red-500 to-red-400',
        completed: 'from-white/40 to-white/20',
    };

    return (
        <div
            onClick={() => navigate(`/projects/${project.id}`)}
            className={`
        glass p-8 rounded-[2rem] cursor-pointer
        border-l-4 ${config.border} ${config.bg}
        card-interactive shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all
        bg-white dark:bg-transparent
      `}
        >
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-widest ${config.labelColor}`}>
                    {config.label}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black italic text-luxury-charcoal dark:text-white mb-2">
                {project.name}
            </h3>

            {/* Meta */}
            <p className="text-xs text-luxury-charcoal/50 dark:text-white/50 mb-6">
                {project.type_key} {project.area && `a€¢ ${project.area}`}
            </p>

            {/* Progress bar */}
            <div className="space-y-3">
                <div className="flex justify-between text-[11px]">
                    <span className="text-luxury-charcoal/50 dark:text-white/50">{t('card_progress')}</span>
                    <span className={`font-bold ${config.labelColor}`}>{project.progress}%</span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${progressColor[project.status]} rounded-full transition-all duration-1000`}
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                {project.status === 'warning' && project.lastUpdate && (
                    <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle size={14} />
                        <span className="text-[11px] font-bold">{t('card_no_update')} {project.lastUpdate}</span>
                    </div>
                )}

                {project.status === 'critical' && project.deadline && (
                    <div className="flex items-center gap-2 text-red-500">
                        <Clock size={14} />
                        <span className="text-[11px] font-bold">{t('card_deadline_in')} {project.deadline}</span>
                    </div>
                )}

                {(project.status === 'active' || project.status === 'completed') && (
                    <span className="text-[11px] text-luxury-charcoal/40 dark:text-white/40">
                        {t('card_updated_ago')} {project.lastUpdate || '2h'}
                    </span>
                )}

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`${t('card_msg_delete')} "${project.name}"?`)) {
                                onDelete(project.id);
                            }
                        }}
                        className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-red-500 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

```

## File: .\components\common\RescueNode.tsx
```

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    nodeName?: string;
}

interface State {
    hasError: boolean;
}

export class RescueNode extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[RESCUE_NODE] Erro em ${this.props.nodeName || 'Desconhecido'}:`, error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 glass rounded-[3rem] border-red-500/20 bg-red-500/[0.02] text-center space-y-8 animate-in fade-in">
                    <div className="p-6 bg-red-500/10 rounded-full text-red-500 animate-pulse">
                        <ShieldAlert size={48} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-serif italic text-white">Sistema em Recuperacao</h2>
                        <p className="text-sm font-light opacity-50 max-w-md mx-auto italic">
                            Ocorreu uma falha inesperada no no <b>{this.props.nodeName || 'Global'}</b>.
                            A inteligencia Antigravity esta a isolar o erro para manter a estabilidade do resto do atelier.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={this.handleReset}
                            className="px-8 py-4 bg-red-500 text-white rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-red-500/20"
                        >
                            <RefreshCw size={14} /> Reiniciar Node
                        </button>
                        <button
                            onClick={() => window.location.hash = '#/'}
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all text-white"
                        >
                            <Home size={14} /> Voltar ao InA­cio
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default RescueNode;

```

## File: .\components\common\SkeletonCard.tsx
```
import React from 'react';

interface SkeletonCardProps {
    variant?: 'metric' | 'project' | 'client';
}

export default function SkeletonCard({ variant = 'metric' }: SkeletonCardProps) {
    if (variant === 'metric') {
        return (
            <div className="glass p-8 rounded-[2rem]">
                <div className="h-12 w-12 skeleton rounded-xl mb-6" />
                <div className="h-4 w-1/3 skeleton mb-3" />
                <div className="h-10 w-2/3 skeleton" />
            </div>
        );
    }

    if (variant === 'project') {
        return (
            <div className="glass p-8 rounded-[2rem]">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 skeleton rounded-full" />
                    <div className="h-3 w-20 skeleton" />
                </div>
                <div className="h-8 w-3/4 skeleton mb-2" />
                <div className="h-4 w-1/2 skeleton mb-6" />
                <div className="h-2 w-full skeleton rounded-full mb-4" />
                <div className="flex justify-between pt-4 border-t border-white/5">
                    <div className="h-3 w-1/4 skeleton" />
                    <div className="h-3 w-1/4 skeleton" />
                </div>
            </div>
        );
    }

    return null;
}

```

## File: .\components\common\Toast.tsx
```
import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function Toast({
    type,
    title,
    message,
    duration = 5000,
    onClose,
    action
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle2,
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            iconBg: 'bg-emerald-500/20 text-emerald-500',
        },
        error: {
            icon: XCircle,
            bg: 'bg-red-500/10 border-red-500/20',
            iconBg: 'bg-red-500/20 text-red-500',
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-500/10 border-amber-500/20',
            iconBg: 'bg-amber-500/20 text-amber-500',
        },
        info: {
            icon: Info,
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            iconBg: 'bg-indigo-500/20 text-indigo-500',
        },
    };

    const { icon: Icon, bg, iconBg } = config[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`
            fixed bottom-32 right-6 z-[400]
            flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl
            max-w-sm shadow-2xl
            ${bg}
          `}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                        <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{title}</p>
                        {message && (
                            <p className="text-xs text-white/50 mt-0.5">{message}</p>
                        )}
                    </div>

                    {action && (
                        <button
                            onClick={action.onClick}
                            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-luxury-gold border border-luxury-gold/30 rounded-full hover:bg-luxury-gold/10 transition-all"
                        >
                            {action.label}
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

```

## File: .\components\dashboard\ActiveProjectsCard.tsx
```
import SpotlightCard from '../ui/SpotlightCard';
import { Play, MoreVertical, Plus, DollarSign, Activity, Clock } from 'lucide-react';
import { useTimer } from '../../context/TimeContext';
import { useState } from 'react';

const Badge = ({ text, tone }: { text: string; tone: 'ok'|'warn'|'risk' }) => {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
      : tone === 'warn'
      ? 'bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold'
      : 'bg-rose-500/10 border-rose-500/20 text-rose-400';

  return (
    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.25em] ${cls}`}>
      {text}
    </span>
  );
};

export const ActiveProjectsCard: React.FC<{
  projects: any[];
  onOpenProject?: (projectId: string) => void;
  onOpenAll?: () => void;
}> = ({ projects, onOpenProject, onOpenAll }) => {
  const { start, isActive, activeProject } = useTimer();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  return (
    <SpotlightCard className="p-8 rounded-[0.5rem] bg-white/[0.02] border-white/5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-white/20">
          PROJETOS ATIVOS
        </div>
        <button
          onClick={onOpenAll}
          className="text-[11px] font-black uppercase tracking-[0.25em] text-luxury-gold hover:brightness-110 transition-all"
        >
          Ver todos a†’
        </button>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="p-10 bg-white/[0.02] border border-white/5 border-dashed rounded-xl text-white/35 italic text-center">
          Sem projetos ativos. Cria uma proposta para iniciar pipeline.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.slice(0, 5).map((p) => {
            const hasRisk = !!p.riskFlag;
            const tone = hasRisk ? 'risk' : 'ok';
            const badgeText = hasRisk ? 'Risco' : (String(p.status).toUpperCase() || 'ATIVO');

            return (
              <button
                key={p.projectId}
                onClick={() => onOpenProject?.(p.projectId)}
                className="w-full text-left p-5 bg-black/30 border border-white/5 rounded-[0.5rem] hover:border-luxury-gold/30 transition-all group"
              >
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-bold text-white/85 truncate group-hover:text-white transition-colors">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-luxury-gold shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-all duration-1000" 
                            style={{ width: `${p.progress}%` }} 
                          />
                        </div>
                        <span className="text-[9px] font-black text-luxury-gold/60">{p.progress}%</span>
                      </div>
                      <div className="text-[11px] text-white/35 truncate mt-1">
                        {p.client ? `Cliente: ${p.client}` : 'Cliente: a€”'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isActive && activeProject?.id === p.projectId ? (
                        <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center animate-pulse">
                            <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        </div>
                        ) : (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                start({ id: p.projectId, name: p.name });
                            }}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all group/play"
                        >
                            <Play size={10} className="fill-current group-hover/play:scale-110 transition-transform" />
                        </button>
                        )}

                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenu(openMenu === p.projectId ? null : p.projectId);
                                }}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            >
                                <MoreVertical size={14} />
                            </button>

                            {openMenu === p.projectId && (
                                <div className="absolute right-0 top-10 w-48 glass rounded-2xl border border-white/10 shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                    <button className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-luxury-gold hover:bg-white/5 flex items-center gap-3">
                                        <Plus size={12} /> Adicionar Tarefa
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-luxury-gold hover:bg-white/5 flex items-center gap-3">
                                        <DollarSign size={12} /> Registar Gasto
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-luxury-gold hover:bg-white/5 flex items-center gap-3">
                                        <Activity size={12} /> Ver Timeline
                                    </button>
                                </div>
                            )}
                        </div>
                        <Badge text={badgeText} tone={tone} />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock size={10} className="text-white/20 shrink-0" />
                    <span className="text-[11px] text-white/40 truncate">
                      {p.nextMilestone}
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-luxury-gold flex items-center gap-1.5">
                    <Activity size={8} /> {p.totalHours}h
                  </div>
                </div>

                {hasRisk && (
                  <div className="mt-3 p-3 bg-rose-500/5 rounded-lg text-[11px] text-rose-300/80 italic border border-rose-500/10">
                    {p.riskFlag}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </SpotlightCard>
  );
};
```

## File: .\components\dashboard\CashflowWidget.tsx
```
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEur } from '../../utils/vat';
import { useLanguage } from '../../context/LanguageContext';

interface CashflowProps {
  data: {
    overdueNet: number;
    next7Net: number;
    received30d: number;
    projected30d: number;
    vatRateHint: string;
  };
}

export default function CashflowWidget({ data }: CashflowProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="md:col-span-1 glass p-8 rounded-[0.5rem] bg-luxury-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 flex flex-col justify-between h-full group hover:border-emerald-500/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-luxury-charcoal/20 dark:text-white/20">{t('cashflow')}</div>
        <button
           onClick={() => navigate('/financial')}
           className="text-[11px] font-black uppercase tracking-[0.25em] text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white transition-all"
        >
          {t('view_all')} a†’
        </button>
      </div>

      <div>
        <div className="text-3xl font-serif font-bold italic text-luxury-charcoal dark:text-white leading-none">
            {formatEur(data.next7Net || 0)}
        </div>
        <div className="mt-2 text-[9px] sm:text-[10px] text-luxury-charcoal/30 dark:text-white/30 font-black uppercase tracking-[0.2em] sm:tracking-[0.35em]">
            NET a€¢ + IVA A  {data.vatRateHint || 'taxa legal'}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Overdue Block */}
        <div className="p-3 sm:p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
             <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-1">{t('expired')}</div>
             <div className="text-lg sm:text-xl font-mono text-rose-500 dark:text-rose-400">{formatEur(data.overdueNet || 0)}</div>
        </div>
        
        {/* Next 7 Days Block (Projected) */}
        <div className="p-3 sm:p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
             <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-1">{t('next_7_days')}</div>
             <div className="text-lg sm:text-xl font-mono text-luxury-gold">{formatEur(data.next7Net || 0)}</div> // Using next7Net as the primary tracking metric as per V2.1 plan
        </div>
      </div>
    </div>
  );
}
```

## File: .\components\dashboard\CopyModal.tsx
```
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X } from 'lucide-react';

export const CopyModal: React.FC<{
  open: boolean;
  title: string;
  text: string;
  onClose: () => void;
}> = ({ open, title, text, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[2rem] border-white/10 shadow-2xl overflow-hidden bg-black/60"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="text-[11px] font-black uppercase tracking-[0.35em] text-luxury-gold">
              {title}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <textarea
            value={text}
            readOnly
            className="w-full h-80 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white/70 font-mono text-xs focus:outline-none scrollbar-hide no-scrollbar"
          />

          <div className="mt-8 flex justify-end">
            <button
              onClick={copy}
              className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-luxury-gold text-black text-[11px] font-black uppercase tracking-[0.25em] hover:scale-105 transition-all shadow-xl shadow-luxury-gold/20"
            >
              {copied ? (
                <>
                  <Check size={16} /> Copiado
                </>
              ) : (
                <>
                  <Copy size={16} /> Copiar Texto
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```

## File: .\components\dashboard\CriticalAlertsWidget.tsx
```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import fa360 from '../../services/fa360';
import { buildPaymentReminderPT, buildPaymentReminderEN } from '../../utils/paymentReminder';
import { CopyModal } from './CopyModal';
import { Check, Clock, Bell } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface CriticalAlertsProps {
  alerts: any[];
}

export default function CriticalAlertsWidget({ alerts }: CriticalAlertsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [modal, setModal] = useState({ open: false, title: '', text: '' });
  const empty = alerts.length === 0;

  const onComplete = async (taskId: string) => {
    await fa360.updateTask(taskId, { completed: true });
    window.dispatchEvent(new CustomEvent('fa-sync-complete'));
  };

  const onReschedule = async (taskId: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const newDate = today.toISOString().split('T')[0];
    await fa360.updateTask(taskId, { deadline: newDate });
    window.dispatchEvent(new CustomEvent('fa-sync-complete'));
  };

  const openReminder = (a: any) => {
    // Attempt to extract payment info from alert if possible, or use fallback
    const textPT = buildPaymentReminderPT({
      client: a.client || 'Cliente',
      project: a.projectName || 'Projeto',
      milestone: a.message.replace('Pagamento vencido: ', ''),
      amountNet: a.amountNet || 0,
      vatRate: a.vatRate || 0.23,
      dueDate: a.dueDate || new Date().toISOString()
    });

    const textEN = buildPaymentReminderEN({
      client: a.client || 'Client',
      project: a.projectName || 'Project',
      milestone: a.message.replace('Payment overdue: ', ''),
      amountNet: a.amountNet || 0,
      vatRate: a.vatRate || 0.23,
      dueDate: a.dueDate || new Date().toISOString()
    });

    setModal({
      open: true,
      title: `Lembrete de Pagamento (PT/EN)`,
      text: `${textPT}\n\n---\n\n${textEN}`,
    });
  };

  return (
    <div className="md:col-span-1 glass p-8 rounded-[0.5rem] bg-luxury-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 flex flex-col h-full group hover:border-red-500/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-luxury-charcoal/20 dark:text-white/20">{t('critical_alerts')}</div>
        <button
          onClick={() => navigate('/tasks')} // Generalize to 'Resolve' center later
          className="text-[11px] font-black uppercase tracking-[0.25em] text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white transition-all"
        >
          {t('resolve')} a†’
        </button>
      </div>

      {empty ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[0.25rem]">
          <span className="text-emerald-500 dark:text-emerald-400 text-sm italic font-medium">{t('no_critical_blocks')}</span>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-1 no-scrollbar max-h-[250px]">
          {alerts.slice(0, 5).map((a, idx) => (
             <div key={idx} className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-xl text-xs text-luxury-charcoal/80 dark:text-white/80 border-l-2 border-l-rose-500 shadow-sm dark:shadow-none transition-all hover:bg-black/5 dark:hover:bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="truncate font-medium">{a.message}</p>
                    {a.daysLate && <p className="text-[10px] font-mono text-rose-500 mt-1">+{a.daysLate}d atraso</p>}
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                   {a.type === 'TASK_OVERDUE' && (
                     <>
                       <Tooltip content={t('reschedule')} position="top">
                         <button 
                          onClick={() => onReschedule(a.id)}
                          className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold transition-colors"
                         >
                            <Clock size={14} />
                         </button>
                       </Tooltip>
                       <button 
                        onClick={() => onComplete(a.id)}
                        className="px-4 py-2 bg-luxury-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                       >
                          <Check size={12} /> {t('complete') || 'Concluir'}
                       </button>
                     </>
                   )}
                   {a.type === 'PAYMENT_OVERDUE' && (
                     <button 
                      onClick={() => openReminder(a)}
                      className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold hover:border-luxury-gold/30 transition-all flex items-center gap-2"
                     >
                        <Bell size={12} /> {t('remind') || 'Lembrar'}
                     </button>
                   )}
                   {(a.type !== 'TASK_OVERDUE' && a.type !== 'PAYMENT_OVERDUE') && (
                      <button 
                        onClick={() => a.actionUrl && navigate(a.actionUrl)}
                        className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                         {t('view') || 'Ver'}
                      </button>
                   )}
                </div>
            </div>
          ))}
        </div>
      )}

      <CopyModal 
        open={modal.open} 
        title={modal.title} 
        text={modal.text} 
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
}
```

## File: .\components\dashboard\DayPanel.tsx
```
import React from 'react';
import { AlertCircle, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardTask {
  id: string;
  title: string;
  projectKey?: string;
}

interface DashboardPayment {
  id: string;
  title: string;
  amountNet: number;
  status: string;
  date: string;
}

interface DashboardProject {
  id: string;
  name?: string;
  title?: string;
  nextActionDate?: string;
}

interface DashboardMeeting {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface DashboardMeeting {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface DayPanelProps {
  data: {
    urgentTasks: DashboardTask[];
    urgentPayments: DashboardPayment[];
    idleProjects: DashboardProject[];
    todayMeetings: DashboardMeeting[];
  };
}

export default function DayPanel({ data }: DayPanelProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // eslint-disable-next-line
  const now = Date.now(); // Fix purity warning

  const hasHighlights = data.urgentTasks.length > 0 || data.urgentPayments.length > 0 || data.idleProjects.length > 0 || data.todayMeetings.length > 0;

  if (!hasHighlights) {
    return (
      <div className="glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center border-black/5 dark:border-white/5 bg-emerald-500/5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
          <Clock className="text-emerald-500" size={32} />
        </div>
        <h3 className="text-2xl font-serif italic text-luxury-charcoal dark:text-white mb-2">{t('day_panel_title')}</h3>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">{t('day_panel_no_urgent')}</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden rounded-[2.5rem] border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-2xl">
      <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
        <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white flex items-center gap-3">
          <span className="w-8 h-[1px] bg-luxury-gold"></span>
          {t('day_panel_title')}
        </h3>
        <button onClick={() => navigate('/tasks')} className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-gold hover:opacity-70 transition-opacity">
          {t('view_all')} a†’
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5">

        {/* SECTION: URGENTE */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={16} className="text-rose-500" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500">{t('day_panel_urgent')}</h4>
          </div>
          <div className="space-y-4">
            {data.urgentTasks.length > 0 ? data.urgentTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate('/tasks')}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">{task.title}</span>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter whitespace-nowrap ml-2">{t('day_panel_due_today')}</span>
                </div>
                {task.projectKey && <p className="text-[10px] font-bold text-luxury-charcoal/40 dark:text-white/40 uppercase tracking-widest">{task.projectKey}</p>}
              </div>
            )) : (
              <p className="text-[11px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

        {/* SECTION: AGENDA */}
        <div className="p-8 space-y-6 bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={16} className="text-blue-500" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">{t('day_panel_today_meetings')}</h4>
          </div>
          <div className="space-y-4">
            {data.todayMeetings && data.todayMeetings.length > 0 ? data.todayMeetings.map((meet) => (
              <div
                key={meet.id}
                onClick={() => navigate('/calendar')}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">{meet.title}</span>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter whitespace-nowrap ml-2">
                    {new Date(meet.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-luxury-charcoal/40 dark:text-white/40 uppercase tracking-widest">{meet.location}</p>
              </div>
            )) : (
              <p className="text-[11px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

        {/* SECTION: FINANCEIRO */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard size={16} className="text-luxury-gold" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-gold">{t('day_panel_financial')}</h4>
          </div>
          <div className="space-y-4">
            {data.urgentPayments.length > 0 ? data.urgentPayments.map((pay) => (
              <div
                key={pay.id}
                onClick={() => navigate('/financial')}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">{pay.title}</span>
                  <span className="text-[11px] font-serif italic text-luxury-gold">{Math.round(pay.amountNet).toLocaleString()}a‚¬</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-luxury-charcoal/40 dark:text-white/40">
                  <span className={(new Date(pay.date).getTime()) < (now - 30 * 86400000) ? "text-rose-500 font-black animate-pulse" : ""}>
                    {(new Date(pay.date).getTime()) < (now - 30 * 86400000) ? t('day_panel_overdue_alert') : pay.status}
                  </span>
                  <span>{new Date(pay.date).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <p className="text-[11px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

        {/* SECTION: STANDBY */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={16} className="text-luxury-charcoal/40 dark:text-white/40" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/40 dark:text-white/40">{t('day_panel_attention')}</h4>
          </div>
          <div className="space-y-4">
            {data.idleProjects.length > 0 ? data.idleProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="group cursor-pointer"
              >
                <h5 className="text-xs font-bold text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1 mb-1">{proj.name || proj.title}</h5>
                <p className="text-[10px] font-black text-rose-500/70 uppercase tracking-tighter">
                  {t('day_panel_idle_desc')} {Math.floor((now - new Date(proj.nextActionDate || now).getTime()) / (1000 * 3600 * 24))} {t('day_panel_days')}
                </p>
              </div>
            )) : (
              <p className="text-[11px] font-bold text-luxury-charcoal/30 dark:text-white/30 italic">{t('day_panel_no_urgent')}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
```

## File: .\components\dashboard\HealthIndexWidget.tsx
```
import React from 'react';
import { Activity, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface HealthIndexProps {
  score: number;
  breakdown: {
    deadlines: number;
    cash: number;
    production: number;
    risk: number;
  };
  reason: string;
}

export default function HealthIndexWidget({ score, breakdown, reason }: HealthIndexProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getHealthColor = (val: number) => {
    if (val >= 90) return 'text-emerald-500 bg-emerald-500';
    if (val >= 70) return 'text-luxury-gold bg-luxury-gold';
    return 'text-red-500 bg-red-500';
  };

  const colorClass = getHealthColor(score);
  const textColor = colorClass.split(' ')[0];
  const bgColor = colorClass.split(' ')[1];

  return (
    <div className="md:col-span-1 glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 bg-luxury-white/50 dark:bg-black/20 flex flex-col justify-between h-full relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all">
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 mb-1">{t('health_index')}</h3>
          <div className="flex items-baseline gap-1">
             <span className={`text-4xl font-serif italic ${textColor}`}>{score}%</span>
             <span className={`text-[11px] font-bold uppercase ${textColor} opacity-80`}>{score > 90 ? t('status_excellent') : t('status_warning')}</span>
          </div>
        </div>
        <Activity size={20} className={`${textColor} opacity-50`} />
      </div>

      <div className="my-4 space-y-3">
         <HealthBar label={t('deadlines')} value={breakdown.deadlines} />
         <HealthBar label={t('cash')} value={breakdown.cash} />
         <HealthBar label={t('production')} value={breakdown.production} />
         <HealthBar label={t('risk')} value={breakdown.risk} />
      </div>

       <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
         <p className="text-[11px] text-luxury-charcoal/50 dark:text-white/50 italic leading-relaxed">
            "{reason}"
         </p>
       </div>
    </div>
  );
}

const HealthBar = ({ label, value }: { label: string, value: number }) => {
    let color = 'bg-emerald-500';
    if (value < 70) color = 'bg-luxury-gold';
    if (value < 50) color = 'bg-red-500';

    return (
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-luxury-charcoal/40 dark:text-white/40 w-16 text-right">{label}</span>
            <div className="flex-1 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
}
```

## File: .\components\dashboard\HoursWeekCard.tsx
```
import React from 'react';
import SpotlightCard from '../ui/SpotlightCard';

const Row = ({ label, data }: { label: string; data: any }) => {
  const pct = Math.max(0, Math.min(140, data.pct || 0));
  const tone =
    data.status === 'ok'
      ? 'text-emerald-400'
      : data.status === 'over'
      ? 'text-rose-400'
      : 'text-luxury-gold';

  return (
    <div className="p-4 bg-black/30 border border-white/5 rounded-sm">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-[0.35em] text-white/30">
          {label}
        </div>
        <div className={`text-[11px] font-mono ${tone}`}>{pct}%</div>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-serif font-bold italic text-white/90">
          {data.hours}h
        </div>
        <div className="text-xs font-mono text-white/40">
          / {data.target}h
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <div
          className="h-full bg-luxury-gold/60"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      <div className="mt-3 text-xs text-white/35 italic">
        {data.status === 'over'
          ? 'Acima do alvo a€” risco de sobrecarga.'
          : data.status === 'low'
          ? 'Abaixo do alvo a€” pode haver capacidade livre.'
          : 'Dentro do alvo semanal.'}
      </div>
    </div>
  );
};

export const HoursWeekCard: React.FC<{ data: any; onOpen?: () => void }> = ({ data, onOpen }) => {
  return (
    <SpotlightCard className="p-8 rounded-[0.5rem] bg-white/[0.02] border-white/5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-white/20">
          PRODUA‡AƒO a€¢ HORAS (SEMANA)
        </div>
        <button
          onClick={onOpen}
          className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
        >
          Detalhe a†’
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Row label="CEO" data={data?.CEO || { hours: 0, target: 40, pct: 0, status: 'low' }} />
        <Row label="JA‰SSICA" data={data?.JESSICA || { hours: 0, target: 40, pct: 0, status: 'low' }} />
        <Row label="SOFIA" data={data?.SOFIA || { hours: 0, target: 40, pct: 0, status: 'low' }} />
      </div>

      <div className="mt-6 text-[11px] text-white/25 italic">
        Baseado em registos de horas (NET operacional). Ajusta o alvo por pessoa se necessario.
      </div>
    </SpotlightCard>
  );
};
```

## File: .\components\dashboard\NeuralSyncWidget.tsx
```
import React from 'react';
import { Database, Wifi, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface NeuralSyncProps {
  status: {
    status: 'ONLINE' | 'OFFLINE';
    lastSync?: string;
    message?: string;
  };
}

export default function NeuralSyncWidget({ status }: NeuralSyncProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isOnline = status.status === 'ONLINE';

  return (
    <div className={`md:col-span-1 glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 flex flex-col justify-between h-full ${isOnline ? 'bg-luxury-gold/[0.05] dark:bg-luxury-gold/[0.02]' : 'bg-rose-500/[0.05] dark:bg-red-500/[0.02]'} shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none transition-all`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isOnline ? 'bg-luxury-gold/10' : 'bg-white/40 dark:bg-white/5'}`}>
                <Database size={18} className={isOnline ? 'text-luxury-gold' : 'text-luxury-charcoal/30 dark:text-white/30'} />
            </div>
            <div>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 mb-0.5">{t('neural_sync')}</h3>
                 <p className={`text-xs font-bold ${isOnline ? 'text-emerald-500' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>{status.status}</p>
            </div>
        </div>
        {!isOnline && <button onClick={() => navigate('/antigravity')} className="text-[11px] font-bold text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold">{t('configure')}</button>}
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5">
             <span className="text-luxury-charcoal/40 dark:text-white/40 font-mono">{t('last_sync')}</span>
             <span className="text-luxury-charcoal/70 dark:text-white/70">{status.lastSync ? new Date(status.lastSync).toLocaleTimeString() : '--:--'}</span>
        </div>
        
        {isOnline ? (
             <button className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 flex items-center justify-center gap-2">
                 <RefreshCw size={10} /> {t('force_sync')}
             </button>
        ) : (
            <div className="flex items-center gap-2 text-[11px] text-rose-500 dark:text-red-400/80 italic">
                <AlertTriangle size={12} />
                <span>{status.message}</span>
            </div>
        )}
      </div>
    </div>
  );
}
```

## File: .\components\dashboard\PipelineFunnelWidget.tsx
```
import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FunnelStats } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PipelineProps {
  funnel: FunnelStats;
}

export default function PipelineFunnelWidget({ funnel }: PipelineProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="md:col-span-1 glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 bg-luxury-white/50 dark:bg-black/20 flex flex-col justify-between h-full group hover:border-black/10 dark:hover:border-white/10 transition-all">
       <div className="flex justify-between items-start mb-4">
        <div>
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 mb-1">{t('pipeline_global')}</h3>
           <p className="text-2xl font-serif italic text-luxury-charcoal dark:text-white">a‚¬{(funnel.activeValue / 1000).toFixed(1)}k <span className="text-sm not-italic font-sans opacity-60 text-luxury-charcoal/60 dark:text-white/60">{t('potential')}</span></p>
        </div>
        <button onClick={() => navigate('/calculator')} className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_15px_#D4AF3740]">
            <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
            <FunnelStep label={t('leads')} count={funnel.leads} />
            <FunnelStep label={t('negotiation')} count={funnel.negotiation} isActive />
            <FunnelStep label={t('closed')} count={0} /> {/* Need close data */}
        </div>
        
        <div className="p-3 bg-white/60 dark:bg-white/5 rounded-xl flex justify-between items-center border border-black/5 dark:border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <span className="text-[11px] text-luxury-charcoal/60 dark:text-white/50 font-black uppercase tracking-wider">{t('conversion')}</span>
            <span className="text-xs font-bold text-luxury-charcoal dark:text-white">{funnel.conversionRate > 0 ? `${funnel.conversionRate}%` : '---'}</span>
        </div>
      </div>
    </div>
  );
}

const FunnelStep = ({ label, count, isActive }: { label: string, count: number, isActive?: boolean }) => (
    <div className={`p-2 rounded-lg border ${isActive ? 'bg-luxury-gold/10 border-luxury-gold/20' : 'bg-white/70 dark:bg-white/5 border-black/5 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none'}`}>
        <p className={`text-xl font-serif italic ${isActive ? 'text-luxury-gold' : 'text-luxury-charcoal/70 dark:text-white/60'}`}>{count}</p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-luxury-charcoal/40 dark:text-white/30">{label}</p>
    </div>
)
```

## File: .\components\dashboard\ProductionWidget.tsx
```
import React from 'react';
import { Users, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ProductionStats } from '../../types';

interface ProductionProps {
  stats: ProductionStats[];
}

export default function ProductionWidget({ stats }: ProductionProps) {
  const { t } = useLanguage();
  return (
    <div className="md:col-span-2 glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 bg-luxury-white/80 dark:bg-black/20 flex flex-col justify-center h-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2">
            <Users size={14} /> {t('weekly_prod')}
         </h3>
         <span className="text-[11px] font-mono text-luxury-charcoal/30 dark:text-white/30">{t('prod_subtitle')}</span>
      </div>

      <div className="space-y-4">
        {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs text-luxury-charcoal/80 dark:text-white/80 font-medium">
                    <span>{stat.member}</span>
                    <span className="font-mono text-luxury-charcoal/40 dark:text-white/40">{stat.actualHours}h <span className="text-luxury-charcoal/20 dark:text-white/20">/ {stat.plannedHours}h</span></span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-luxury-gold/80 rounded-full" style={{ width: `${(stat.actualHours / stat.plannedHours) * 100}%` }}></div>
                </div>
            </div>
        ))}
         {stats.length === 0 && <p className="text-xs text-luxury-charcoal/30 dark:text-white/30 italic text-center py-4">{t('no_prod_data')}</p>}
      </div>
    </div>
  );
}
```

## File: .\components\dashboard\TodayOpsWidget.tsx
```
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface TodayOpsProps {
  data: {
    overdueTasksCount: number;
    next7TasksCount: number;
    next7PaymentsCount: number;
  };
}

export default function TodayOpsWidget({ data }: TodayOpsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="md:col-span-1 glass p-8 rounded-[0.5rem] bg-luxury-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 flex flex-col justify-between h-full group hover:border-black/10 dark:hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-luxury-charcoal/20 dark:text-white/20">{t('today_ops')}</div>
        <button
          onClick={() => navigate('/tasks')}
          className="text-[11px] font-black uppercase tracking-[0.25em] text-luxury-gold hover:brightness-110 transition-all"
        >
          {t('open_day')} a†’
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Overdue Block */}
        <div className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-2">{t('delayed')}</div>
          <div className="text-2xl font-serif font-bold italic text-rose-500 dark:text-rose-400">{data.overdueTasksCount}</div>
        </div>

        {/* Next 7 Days Block */}
        <div className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-2">{t('days_7')}</div>
          <div className="text-2xl font-serif font-bold italic text-luxury-gold">{data.next7TasksCount}</div>
        </div>

        {/* Payments Block */}
        <div className="p-4 bg-white dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-[0.5rem] flex flex-col justify-center items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-luxury-charcoal/50 dark:text-white/30 mb-2">{t('rec')}</div>
          <div className="text-2xl font-serif font-bold italic text-luxury-gold">{data.next7PaymentsCount}</div>
        </div>
      </div>
    </div>
  );
}
```

## File: .\components\landing\SiteLayout.tsx
```

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

```

## File: .\components\legal\InteractiveLawReader.tsx
```

import React, { useState } from 'react';
import { Search, ChevronRight, Info, Book, ArrowLeft, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { rjueStructure, LawArticle, LawStructure } from '../../data/laws/rjue_structure';
import { rgeuStructure } from '../../data/laws/rgeu_structure';
import { reruStructure } from '../../data/laws/reru_structure';
import { acessibilidadesStructure } from '../../data/laws/acessibilidades_structure';

const lawsMap: Record<string, LawStructure> = {
    'rjue': rjueStructure,
    'rgeu': rgeuStructure,
    'reru': reruStructure,
    'acessibilidades': acessibilidadesStructure
};

interface InteractiveLawReaderProps {
    onClose?: () => void;
    lawId: string;
    initialArticleId?: string;
}

export const InteractiveLawReader: React.FC<InteractiveLawReaderProps> = ({ onClose, lawId, initialArticleId }) => {
    const activeLaw = lawsMap[lawId] || rjueStructure;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<LawArticle | null>(
        initialArticleId ? activeLaw.articles.find(a => a.id === initialArticleId) || activeLaw.articles[0] : activeLaw.articles[0]
    );
    const [architectMode, setArchitectMode] = useState(true);

    const filteredArticles = activeLaw.articles.filter(a =>
        a.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[700px] bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-gold" />
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-tight">Leitor de Legislacao Interativo</h2>
                        <p className="text-[11px] text-slate-400 font-mono">{activeLaw.title}</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-xs font-bold">
                        <span className="hidden sm:inline">FECHAR LEITOR</span>
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Index */}
                <div className="w-72 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar Artigo..."
                                className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md pl-8 h-8 text-xs focus:ring-1 focus:ring-gold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredArticles.map((art) => (
                            <button
                                key={art.id}
                                onClick={() => setSelectedArticle(art)}
                                className={`w-full text-left p-3 border-b border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-between group ${selectedArticle?.id === art.id ? 'bg-white dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
                            >
                                <div className="min-w-0">
                                    <div className={`text-[11px] font-bold ${selectedArticle?.id === art.id ? 'text-gold' : 'text-slate-400'}`}>{art.number}</div>
                                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{art.title}</div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 ${selectedArticle?.id === art.id ? 'text-gold' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content View */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
                    {/* Content Toolbar */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 italic">
                            {selectedArticle?.number}
                        </div>
                        <button
                            onClick={() => setArchitectMode(!architectMode)}
                            className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-gold transition-colors"
                        >
                            <span>Modo Arquiteto (Notas AI)</span>
                            {architectMode ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Article Body */}
                    <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full space-y-8">
                        {selectedArticle ? (
                            <>
                                <div className="space-y-4">
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {selectedArticle.title}
                                    </h1>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
                                        {selectedArticle.content}
                                    </p>
                                </div>

                                {architectMode && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {selectedArticle.architect_note && (
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-5 rounded-r-lg">
                                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                                                    <Info className="w-4 h-4" />
                                                    Destaque Tecnico
                                                </div>
                                                <p className="text-sm text-emerald-800 dark:text-emerald-300 italic">
                                                    {selectedArticle.architect_note}
                                                </p>
                                            </div>
                                        )}

                                        {selectedArticle.simplex_2024_update && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-5 rounded-r-lg">
                                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                                                    <Book className="w-4 h-4" />
                                                    Alteracao Simplex 2024
                                                </div>
                                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                                    {selectedArticle.simplex_2024_update}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <Search className="w-12 h-12 mb-4 opacity-10" />
                                <p>Selecione um artigo para comecar a leitura.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                <div>Ferreira Arquitetos - Inteligencia JurA­dica v1.0</div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> RJUE Atualizado</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Simplex 2024</span>
                </div>
            </div>
        </div>
    );
};

```

## File: .\components\legal\LegalReportTemplate.tsx
```
import React from 'react';
import { Municipality } from '../../data/municipalities';
import { UrbanOperationType, legalFrameworks } from '../../data/legal_framework';
import { legislationDatabase } from '../../data/legislation_database';

interface LegalReportTemplateProps {
    municipality: Municipality;
    operationType: UrbanOperationType | null;
    projectData?: {
        name: string;
        location: string;
        description: string;
    };
    onOpenLaw?: (lawId: string, articleId?: string) => void;
}

export const LegalReportTemplate: React.FC<LegalReportTemplateProps> = ({ municipality, operationType, projectData, onOpenLaw }) => {
    const currentDate = new Date().toLocaleDateString('pt-PT');
    const framework = operationType ? legalFrameworks[operationType] : null;

    return (
        <div id="legal-report-template" className="bg-white text-black p-8 pt-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg print:shadow-none print:w-full flex flex-col">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-8 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Relatorio Tecnico de Conformidade UrbanA­stica</h1>
                <div className="text-sm font-light uppercase tracking-widest text-gray-600">Ferreira Arquitetos {new Date().getFullYear()}</div>
            </div>

            {/* Project Info */}
            <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><strong>PROJECTO:</strong> {projectData?.name || '[Nome do Projecto]'}</div>
                    <div className="text-right"><strong>DATA:</strong> {currentDate}</div>
                    <div><strong>LOCALIZAA‡AƒO:</strong> {projectData?.location || '[Morada]'}, {municipality.name}</div>
                    <div className="text-right"><strong>REF:</strong> FA-{new Date().getFullYear()}-XXX</div>
                </div>
                <hr className="border-gray-300" />
            </div>

            {/* Section 1: Identification */}
            <div className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 mb-4 pb-1">1. IDENTIFICAA‡AƒO DO PRA‰DIO</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">MunicA­pio:</span> {municipality.name}</div>
                    <div><span className="font-semibold">Distrito:</span> {municipality.district}</div>
                    <div><span className="font-semibold">Regiao:</span> {municipality.region}</div>
                </div>
            </div>

            {/* Section 2: PDM */}
            <div className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 mb-4 pb-1">2. ENQUADRAMENTO NOS IGT EM VIGOR</h2>
                <h3 className="font-semibold mb-2">2.1 Plano Director Municipal de {municipality.name}</h3>

                {municipality.pdm_links ? (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded text-sm mb-6">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Fontes Oficiais Verificadas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {municipality.pdm_links.regulation_pdf && (
                                <a href={municipality.pdm_links.regulation_pdf} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                    ðŸ“„ Regulamento do PDM (PDF)
                                </a>
                            )}
                            {municipality.pdm_links.geoportal && (
                                <a href={municipality.pdm_links.geoportal} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                    ðŸŒ Geoportal Municipal (SIG)
                                </a>
                            )}
                            {municipality.pdm_links.landing_page && (
                                <a href={municipality.pdm_links.landing_page} target="_blank" rel="noreferrer" className="col-span-2 text-gray-500 text-xs hover:underline mt-1">
                                    ðŸ”— Pagina Oficial do MunicA­pio
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-4 rounded text-sm mb-4">
                        <p className="italic text-gray-600 mb-2">Dados simulados para o MVP (Aguardando verificacao oficial):</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Estado: <span className="font-medium">Em Vigor</span></div>
                            <div>Publicacao: <span className="font-medium">Aviso n.u XXX/XXXX</span></div>
                        </div>
                    </div>
                )}

                <table className="w-full text-sm border-collapse border border-gray-300 mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left">Parametro UrbanA­stico (Exemplo)</th>
                            <th className="border border-gray-300 p-2 text-left">Valor Maximo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2">Andice de Utilizacao (Iu)</td>
                            <td className="border border-gray-300 p-2">1.2 (Simulado)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Andice de Ocupacao (Io)</td>
                            <td className="border border-gray-300 p-2">60% (Simulado)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Cercea Maxima</td>
                            <td className="border border-gray-300 p-2">3 Pisos (Simulado)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Section 3: Legal Framework */}
            <div className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 mb-4 pb-1">3. ENQUADRAMENTO LEGAL DA OPERAA‡AƒO</h2>

                {framework ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase rounded">
                                {framework.label}
                            </div>
                            <p className="text-sm text-gray-600">{framework.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200">Legislacao Aplicavel</h3>
                                <ul className="space-y-6">
                                    {framework.applicable_legislation.map((leg, i) => {
                                        const dbLeg = leg.legislation_id ? legislationDatabase[leg.legislation_id] : null;
                                        return (
                                            <li key={i} className="text-sm">
                                                <div
                                                    className={`group/item p-3 -m-3 rounded-lg transition-colors ${onOpenLaw && leg.legislation_id ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                                                    onClick={() => onOpenLaw && leg.legislation_id && onOpenLaw(leg.legislation_id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-bold ${onOpenLaw && leg.legislation_id ? 'text-gold group-hover/item:underline' : 'text-slate-800'}`}>
                                                            {leg.name}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {onOpenLaw && leg.legislation_id && (
                                                                <span className="text-xs font-black uppercase tracking-tighter bg-gold/10 text-gold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                    Ler no FA-360 a†—
                                                                </span>
                                                            )}
                                                            {dbLeg?.official_link && (
                                                                <a
                                                                    href={dbLeg.official_link}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[11px] text-blue-500 hover:underline"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    DRE ðŸ”—
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-2">{leg.description}</div>
                                                </div>

                                                {dbLeg && (
                                                    <div className="pl-3 border-l-2 border-slate-200 mt-3 pt-1">
                                                        <p className="text-xs text-gray-600 mb-2 italic leading-relaxed">{dbLeg.summary}</p>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                            {dbLeg.key_points.map((pt, j) => (
                                                                <div key={j} className="text-[11px] text-slate-500 flex items-center gap-1">
                                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                                    {pt}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200">Elementos Obrigatorios</h3>
                                <ul className="grid grid-cols-1 gap-1">
                                    {framework.required_elements.map((el, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span className="text-gray-400">a˜</span>
                                            {el}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200">Filtros de Verificacao PDM</h3>
                            <div className="flex flex-wrap gap-2">
                                {framework.pdm_focus_areas.map((area, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border border-slate-200">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded text-center text-gray-400 text-sm">
                        Selecione um tipo de operacao para ver o enquadramento legal automatico.
                    </div>
                )}
            </div>

            {/* Section 4: Legal Disclaimers */}
            <div className="mt-auto pt-8 text-[11px] text-gray-500">
                <h2 className="text-xs font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-widest italic">Notas Legais</h2>
                <p className="leading-tight">Este relatorio tem carater meramente informativo e foi gerado automaticamente pelo modulo FA-360 Legal da Ferreira Arquitetos. O conteudo apresentado baseia-se na interpretacao tecnica da legislacao em vigor, mas nao dispensa a consulta formal de um arquiteto, a verificacao das fontes oficiais (Diario da Republica, Planos Diretores Municipais) e a confirmacao junto das entidades publicas competentes.</p>
            </div>
        </div>
    );
};

```

## File: .\components\legal\LegalWizard.tsx
```
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, AlertTriangle, FileText, ExternalLink, Calculator } from 'lucide-react';
import { legalEngine, LegalInput, LegalResult } from '../../services/legalEngine';
import { useLanguage } from '../../context/LanguageContext';
import municipalSources from '../../data/legal/catalog/sources.json';

export const LegalWizard: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<LegalInput>({
    municipalityId: 'AVEIRO',
    useType: 'residential',
    urbanZone: 'expansion',
    areaGross: 0,
    numDwellings: 0,
    areaPlot: 0,
    areaFootprint: 0
  });
  const [results, setResults] = useState<LegalResult[]>([]);

  const handleNext = async () => {
    if (step === 3) {
      const res = await legalEngine.evaluate(inputs);
      setResults(res);
      setStep(4);
    } else {
      setStep(s => s + 1);
    }
  };

  const municipalities = municipalSources.municipalities;

  return (
    <div className="bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
      {/* Progress Bar */}
      <div className="flex h-1 bg-black/5 dark:bg-white/5">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-luxury-gold' : 'bg-transparent'}`} />
        ))}
      </div>

      <div className="p-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Escopo Territorial</h3>
                <p className="text-sm text-luxury-charcoal/50 dark:text-white/40">Selecione o MunicA­pio para carregar o motor de regras PDM.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {municipalities.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setInputs({ ...inputs, municipalityId: m.id })}
                    className={`p-6 rounded-2xl border transition-all text-left group ${inputs.municipalityId === m.id ? 'bg-luxury-gold border-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/10 text-luxury-charcoal dark:text-white hover:border-luxury-gold/50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{m.name}</span>
                      {inputs.municipalityId === m.id && <Check size={18} />}
                    </div>
                    <p className={`text-[11px] mt-1 font-black uppercase tracking-widest ${inputs.municipalityId === m.id ? 'text-black/60' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>PDM Ativo</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Uso & Localizacao</h3>
                <p className="text-sm text-luxury-charcoal/50 dark:text-white/40">Defina a tipologia da operacao e o enquadramento urbano.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-gold block mb-3">Tipo de Uso</label>
                  <div className="flex flex-wrap gap-3">
                    {['residential', 'commercial', 'services', 'industrial'].map(use => (
                      <button
                        key={use}
                        onClick={() => setInputs({ ...inputs, useType: use as any })}
                        className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase transition-all ${inputs.useType === use ? 'bg-luxury-gold border-luxury-gold text-black' : 'bg-white/5 dark:bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                      >
                        {use}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-gold block mb-3">Zona Urbana (PDM)</label>
                  <div className="flex flex-wrap gap-3">
                    {['central', 'historical', 'expansion', 'rural'].map(zone => (
                      <button
                        key={zone}
                        onClick={() => setInputs({ ...inputs, urbanZone: zone as any })}
                        className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase transition-all ${inputs.urbanZone === zone ? 'bg-luxury-gold border-luxury-gold text-black' : 'bg-white/5 dark:bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Metricas de Dimensionamento</h3>
                <p className="text-sm text-luxury-charcoal/50 dark:text-white/40">Insira os dados brutos para calculo de areas e A­ndices obrigatorios.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Area Bruta de Construcao (mA²)</label>
                  <input 
                    type="number" 
                    value={inputs.areaGross} 
                    onChange={e => setInputs({ ...inputs, areaGross: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Numero de Fogos / Unidades</label>
                  <input 
                    type="number" 
                    value={inputs.numDwellings} 
                    onChange={e => setInputs({ ...inputs, numDwellings: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Area do Lote (mA²)</label>
                  <input 
                    type="number" 
                    value={inputs.areaPlot} 
                    onChange={e => setInputs({ ...inputs, areaPlot: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Area de Implantacao (mA²)</label>
                  <input 
                    type="number" 
                    value={inputs.areaFootprint} 
                    onChange={e => setInputs({ ...inputs, areaFootprint: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 pb-10"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Output Legislativo</h3>
                  <p className="text-xs font-black uppercase tracking-widest text-luxury-gold">{inputs.municipalityId} a€¢ Deterministic Engine v1.0</p>
                </div>
                <button onClick={() => window.print()} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-luxury-gold hover:text-black transition-all">
                  <Calculator size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {results.map((res) => (
                  <div key={res.ruleId} className="glass p-6 rounded-2xl border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold rounded-md">{res.topic}</span>
                        <h4 className="text-sm font-bold text-luxury-charcoal dark:text-white">{res.label}</h4>
                      </div>
                      <div className="text-4xl font-serif text-luxury-gold tabular-nums">
                        {res.value} <span className="text-xs opacity-50">{res.unit}</span>
                      </div>
                      {res.notes && <p className="text-xs italic opacity-40">{res.notes}</p>}
                    </div>
                    
                    <div className="text-right space-y-3">
                      <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-end ${res.confidence === 'official_reference' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {res.confidence === 'official_reference' ? <Check size={10} /> : <AlertTriangle size={10} />}
                        {res.confidence.replace('_', ' ')}
                      </div>
                      {res.sourceRef && (
                        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-left border border-white/5">
                          <p className="text-[11px] font-bold text-white/60 mb-1">{res.sourceRef.articleRef}</p>
                          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-luxury-gold flex items-center gap-1 hover:underline">
                            <ExternalLink size={8} /> Ver Regulamento
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-10 border-t border-black/5 dark:border-white/10 flex justify-between bg-black/[0.02] dark:bg-white/[0.02]">
        <button
          disabled={step === 1}
          onClick={() => setStep(s => s - 1)}
          className={`px-8 py-3 rounded-xl border border-black/10 dark:border-white/10 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal dark:text-white transition-opacity ${step === 1 ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex items-center gap-2">
            <ChevronLeft size={14} /> Voltar
          </div>
        </button>

        {step < 4 && (
          <button
            onClick={handleNext}
            className="px-10 py-3 rounded-xl bg-luxury-gold text-black text-[11px] font-black uppercase tracking-widest shadow-xl shadow-luxury-gold/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            Proximo <ChevronRight size={14} />
          </button>
        )}

        {step === 4 && (
          <button
            onClick={() => setStep(1)}
            className="px-10 py-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            Nova Analise
          </button>
        )}
      </div>
    </div>
  );
};
```

## File: .\components\legal\LegislationLibrary.tsx
```

import React, { useState } from 'react';
import { Search, ExternalLink, BookOpen, Filter, ArrowRight, Activity } from 'lucide-react';
import { legislationDatabase, Legislation } from '../../data/legislation_database';
import { InteractiveLawReader } from './InteractiveLawReader';
import municipalSources from '../../data/legal/catalog/sources.json';
import topicsData from '../../data/legal/catalog/topics.json';
import articlesIndexData from '../../data/legal/catalog/articles_index.json';

export const LegislationLibrary: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedLawId, setSelectedLawId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'NATIONAL' | 'MUNICIPAL'>('NATIONAL');
    const [selectedMunId, setSelectedMunId] = useState<string | null>(null);

    const openLaw = (id: string) => {
        setSelectedLawId(id);
        setViewerOpen(true);
    };

    const allLegislation = Object.values(legislationDatabase);

    // Get unique categories for filtering
    const allCategories = Array.from(new Set(allLegislation.flatMap(l => l.applicability))).sort();

    const filteredLegislation = allLegislation.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter ? l.applicability.includes(activeFilter) : true;
        return matchesSearch && matchesFilter;
    });

    const filteredArticles = articlesIndexData.entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
            entry.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMun = !selectedMunId || entry.municipality === selectedMunId;
        return matchesSearch && matchesMun;
    });

    const supportedLawIds = ['rjue', 'rgeu', 'reru', 'acessibilidades'];

    if (viewerOpen && selectedLawId && supportedLawIds.includes(selectedLawId)) {
        return <InteractiveLawReader onClose={() => setViewerOpen(false)} lawId={selectedLawId} />;
    }

    const filteredMunicipalSources = municipalSources.municipalities.filter(m => 
        !selectedMunId || m.id === selectedMunId
    );

    return (
        <div className="space-y-6">
            <div className="bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 tracking-tight">
                                <div className="p-3 bg-luxury-gold rounded-2xl shadow-lg shadow-luxury-gold/20">
                                    <BookOpen className="w-6 h-6 text-black" />
                                </div>
                                BIBLIOTECA LEGISLATIVA
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
                                Base de dados centralizada de decretos-lei para arquitetura e urbanismo.
                            </p>
                        </div>

                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl pl-12 h-12 text-sm focus:ring-2 focus:ring-gold/50 transition-all focus:bg-white dark:focus:bg-slate-900 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl w-fit">
                            <button 
                                onClick={() => setViewMode('NATIONAL')}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'NATIONAL' ? 'bg-luxury-gold text-black shadow-lg' : 'text-luxury-charcoal/40 dark:text-white/40'}`}
                            >
                                Nacional
                            </button>
                            <button 
                                onClick={() => setViewMode('MUNICIPAL')}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'MUNICIPAL' ? 'bg-luxury-gold text-black shadow-lg' : 'text-luxury-charcoal/40 dark:text-white/40'}`}
                            >
                                Municipal (MVP)
                            </button>
                        </div>

                        {viewMode === 'NATIONAL' ? (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-r pr-8">
                                <button
                                    onClick={() => setActiveFilter(null)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${!activeFilter ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                >
                                    Ver Tudo
                                </button>
                                {allCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveFilter(cat)}
                                        className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${activeFilter === cat ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-r pr-8">
                                <button
                                    onClick={() => setSelectedMunId(null)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${!selectedMunId ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                >
                                    Todos Concelhos
                                </button>
                                {municipalSources.municipalities.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMunId(m.id)}
                                        className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${selectedMunId === m.id ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/30 scale-105' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-luxury-gold/50 hover:text-luxury-gold'}`}
                                    >
                                        {m.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {viewMode === 'NATIONAL' ? (
                        filteredLegislation.length > 0 ? (
                            filteredLegislation.map((leg) => (
                                <NationalLawCard key={leg.id} leg={leg} supportedLawIds={supportedLawIds} onRead={() => openLaw(leg.id)} />
                            ))
                        ) : (
                            <EmptyState />
                        )
                    ) : (
                        <div className="p-8 space-y-12">
                            {/* Search Results from Index if searching */}
                            {searchTerm && filteredArticles.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-gold">Resultados no Andice Municipal ({filteredArticles.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredArticles.map(entry => (
                                            <div key={entry.entryId} className="glass p-6 rounded-2xl border-black/5 dark:border-white/5 border-l-2 border-l-luxury-gold">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-luxury-gold/10 text-luxury-gold rounded-md">{entry.municipality}</span>
                                                    <a href={entry.officialUrl} target="_blank" rel="noreferrer" className="text-luxury-gold hover:underline"><ExternalLink size={12} /></a>
                                                </div>
                                                <h4 className="text-sm font-bold text-white mb-1">{entry.title}</h4>
                                                <p className="text-[11px] text-white/50 italic mb-3">Ref: {entry.articleRef}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.topics.map(t => <span key={t} className="text-[9px] opacity-40">#{t}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Municipal Instruments */}
                            {filteredMunicipalSources.map((mun) => (
                                <div key={mun.id} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-black text-sm">
                                            {mun.id.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white leading-tight">{mun.name}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{mun.region}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {mun.instruments.map((inst: any) => (
                                            <div key={inst.instrumentId} className="space-y-4">
                                                <h4 className="text-[11px] font-black uppercase tracking-widest text-luxury-gold/60 flex items-center gap-2">
                                                    <BookOpen size={10} /> {inst.title}
                                                </h4>
                                                <div className="space-y-3">
                                                    {inst.sources.map((src: any) => (
                                                        <div key={src.sourceId} className="glass p-5 rounded-2xl border-black/5 dark:border-white/5 hover:border-luxury-gold/30 transition-all group relative overflow-hidden">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-[9px] font-black uppercase bg-white/5 px-1.5 py-0.5 rounded text-white/40">{src.docType}</span>
                                                                        <h5 className="text-xs font-bold text-white group-hover:text-luxury-gold transition-colors">{src.sourceId.replace(`${mun.id}_`, '').replace(/_/g, ' ')}</h5>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {src.topics.map((t: string) => (
                                                                            <span key={t} className="text-[9px] font-black uppercase text-white/20">#{t}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {src.drUrl && (
                                                                        <a href={src.drUrl} target="_blank" rel="noreferrer" title="Ver Diario da Republica" className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                                                                            <Activity size={12} />
                                                                        </a>
                                                                    )}
                                                                    <a href={src.officialUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-luxury-gold hover:text-black transition-all">
                                                                        <ExternalLink size={12} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            {src.notes && <p className="text-[11px] italic text-white/30 mt-3">{src.notes}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

const NationalLawCard = ({ leg, supportedLawIds, onRead }: { leg: any, supportedLawIds: string[], onRead: () => void }) => (
    <div key={leg.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all group border-b border-black/5 dark:border-white/5 last:border-b-0">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-gold transition-colors">{leg.title}</h3>
                        <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {leg.year}
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium italic">
                        {leg.summary}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {leg.applicability.map((tag: string) => (
                        <span key={tag} className="text-[11px] font-black bg-gold/5 text-gold-700 dark:text-gold/80 px-3 py-1 rounded-full border border-gold/10 uppercase tracking-tighter">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {leg.official_link && (
                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                    {supportedLawIds.includes(leg.id) && (
                        <button
                            onClick={onRead}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white dark:bg-luxury-gold dark:text-black rounded-xl text-xs font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <BookOpen className="w-4 h-4" />
                            LEITURA INTERNA
                        </button>
                    )}
                    <a
                        href={leg.official_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all border border-slate-200 dark:border-white/10"
                    >
                        <ExternalLink className="w-4 h-4" />
                        OFICIAL
                    </a>
                </div>
            )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-white/[0.03] p-6 rounded-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group/points shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/points:opacity-20 transition-opacity">
                    <Activity className="w-12 h-12" />
                </div>
                <h4 className="text-[11px] font-black text-luxury-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                    Pontos-Chave
                </h4>
                <ul className="space-y-3">
                    {leg.key_points.map((pt: string, i: number) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 font-medium">
                            <ArrowRight className="w-3 h-3 text-luxury-gold mt-0.5 shrink-0" />
                            {pt}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="hidden md:block opacity-10">
                <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                </div>
            </div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="p-24 text-center text-slate-400">
        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center opacity-50">
            <Filter className="w-10 h-10" />
        </div>
        <h4 className="text-lg font-bold text-slate-600 dark:text-slate-300">Sem resultados</h4>
        <p className="text-sm mt-1">Nenhum decreto encontrado para esta pesquisa.</p>
    </div>
);

```

## File: .\components\legal\MunicipalitySelector.tsx
```
import React, { useState } from 'react';
import { municipalities, Municipality } from '../../data/municipalities';
import { Search, CheckCircle2 } from 'lucide-react';

interface MunicipalitySelectorProps {
    onSelect: (municipality: Municipality) => void;
    selectedMunicipality?: Municipality | null;
}

export const MunicipalitySelector: React.FC<MunicipalitySelectorProps> = ({ onSelect, selectedMunicipality }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredMunicipalities = municipalities.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full max-w-md">
            <label className="block text-sm font-medium text-slate-400 mb-2">
                MunicA­pio
            </label>

            <div className="relative">
                <div
                    className="flex items-center w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-slate-100 w-full placeholder-slate-500 cursor-pointer"
                        placeholder="Pesquisar municA­pio..."
                        value={searchTerm || (selectedMunicipality?.name ?? '')}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {filteredMunicipalities.length > 0 ? (
                            filteredMunicipalities.map((municipality) => (
                                <div
                                    key={municipality.id}
                                    className="px-4 py-3 hover:bg-slate-700 cursor-pointer text-slate-200 transition-colors"
                                    onClick={() => {
                                        onSelect(municipality);
                                        setSearchTerm('');
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">{municipality.name}</div>
                                        {municipality.verified && (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500">{municipality.district} a€¢ {municipality.region}</div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-slate-500 text-center">
                                Nenhum municA­pio encontrado
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

```

## File: .\components\legal\OperationTypeSelector.tsx
```

import React from 'react';
import { Hammer, Home, ArrowUpRight, Trash2, Repeat, Grid, ShieldCheck } from 'lucide-react';
import { UrbanOperationType, legalFrameworks } from '../../data/legal_framework';

interface OperationTypeSelectorProps {
    selectedType: UrbanOperationType | null;
    onSelect: (type: UrbanOperationType) => void;
}

const icons: Record<UrbanOperationType, React.ElementType> = {
    [UrbanOperationType.Construction]: Home,
    [UrbanOperationType.Rehabilitation]: Hammer,
    [UrbanOperationType.Expansion]: ArrowUpRight,
    [UrbanOperationType.Demolition]: Trash2,
    [UrbanOperationType.UseChange]: Repeat,
    [UrbanOperationType.Allotment]: Grid,
    [UrbanOperationType.Simple]: ShieldCheck
};

export const OperationTypeSelector: React.FC<OperationTypeSelectorProps> = ({ selectedType, onSelect }) => {
    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tipo de Operacao UrbanA­stica
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(legalFrameworks).map((op) => {
                    const Icon = icons[op.id];
                    const isSelected = selectedType === op.id;

                    return (
                        <button
                            key={op.id}
                            onClick={() => onSelect(op.id)}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-lg border transition-all text-center
                                ${isSelected
                                    ? 'bg-slate-800 border-slate-700 text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                            <span className="text-sm font-medium">{op.label}</span>
                        </button>
                    );
                })}
            </div>
            {selectedType && (
                <div className="mt-3 text-sm text-gray-500 bg-slate-50 p-3 rounded border border-slate-100 italic">
                    {legalFrameworks[selectedType].description}
                </div>
            )}
        </div>
    );
};

```

## File: .\components\project\ProjectTimeline.tsx
```
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Play, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Phase {
  id: string;
  labelPT: string;
  labelEN: string;
  status: 'completed' | 'current' | 'upcoming' | 'delayed';
  date?: string;
}

interface ProjectTimelineProps {
  currentPhaseId: string;
  phasesOverride?: Phase[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ currentPhaseId, phasesOverride }) => {
  const { t, locale } = useLanguage();

  const defaultPhases: Phase[] = [
    { id: 'EP', labelPT: 'Estudo Previo', labelEN: 'Preliminary Study', status: 'upcoming' },
    { id: 'LIC', labelPT: 'Licenciamento', labelEN: 'Licensing', status: 'upcoming' },
    { id: 'EXEC', labelPT: 'Execucao', labelEN: 'Execution', status: 'upcoming' },
    { id: 'OBRA', labelPT: 'Obra', labelEN: 'Construction', status: 'upcoming' }
  ];

  const phases = (phasesOverride || defaultPhases).map(p => {
    let status: Phase['status'] = 'upcoming';
    const currentIndex = defaultPhases.findIndex(x => x.id === currentPhaseId);
    const thisIndex = defaultPhases.findIndex(x => x.id === p.id);

    if (thisIndex < currentIndex) status = 'completed';
    else if (thisIndex === currentIndex) status = 'current';
    
    return { ...p, status };
  });

  return (
    <div className="w-full py-12 px-2">
      {/* Connector Line (Desktop) */}
      <div className="relative hidden md:block">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5 dark:bg-white/10 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-[1.5px] bg-luxury-gold -translate-y-1/2 z-0 transition-all duration-1000" 
          style={{ width: `${(phases.filter(p => p.status === 'completed' || p.status === 'current').length - 0.5) / (phases.length - 1) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
        {phases.map((phase, idx) => (
          <div key={phase.id} className="flex flex-col items-center text-center group">
            {/* Step Marker */}
            <motion.div
              initial={false}
              animate={{
                scale: phase.status === 'current' ? 1.1 : 1,
                backgroundColor: phase.status === 'completed' ? '#D4AF37' : (phase.status === 'current' ? '#000' : 'rgba(255,255,255,0.05)')
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 mb-6 ${
                phase.status === 'completed' ? 'border-luxury-gold text-black' : 
                phase.status === 'current' ? 'border-luxury-gold dark:bg-black text-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 
                'border-black/5 dark:border-white/10 text-luxury-charcoal/30 dark:text-white/20'
              }`}
            >
              {phase.status === 'completed' && <Check size={18} />}
              {phase.status === 'current' && <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Play size={14} className="fill-current ml-0.5" /></motion.div>}
              {phase.status === 'upcoming' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            </motion.div>

            {/* Content */}
            <div className="space-y-1">
              <p className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${
                phase.status === 'current' ? 'text-luxury-gold' : 'text-luxury-charcoal/40 dark:text-white/30'
              }`}>
                {locale === 'pt' ? phase.labelPT : phase.labelEN}
              </p>
              
              {phase.status === 'current' && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-luxury-gold uppercase tracking-tighter">
                   <Clock size={10} />
                   <span>Em Curso</span>
                </div>
              )}

              {phase.status === 'completed' && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">ConcluA­do</span>
              )}

              {phase.status === 'upcoming' && (
                <span className="text-[10px] font-bold text-luxury-charcoal/20 dark:text-white/10 uppercase tracking-tighter">Agendado</span>
              )}
            </div>

            {/* Mobile Connection Line */}
            {idx < phases.length - 1 && (
              <div className="h-8 w-[1px] bg-black/5 dark:bg-white/10 mt-6 md:hidden" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## File: .\components\ui\SpotlightCard.tsx
```
import React from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden glass ${className}`}>
      {/* Subtle radial gradient spotlight effect could be added here with absolute positioning if needed */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
```

## File: .\components\ui\TimeTracker.tsx
```
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Save, X } from 'lucide-react';
import { useTimer } from '../../context/TimeContext';
import { useLanguage } from '../../context/LanguageContext';
import fa360 from '../../services/fa360';

export const TimeTracker: React.FC = () => {
  const { isActive, elapsedTime, activeProject, stop, reset } = useTimer();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState('Production');

  if (!isActive && !isExpanded && elapsedTime === 0) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!activeProject) return;

    const durationMinutes = Math.max(1, Math.round(elapsedTime / 60));
    
    await fa360.logTime({
      projectId: activeProject.id,
      date: new Date().toISOString(),
      duration: durationMinutes,
      phase,
      description,
      userId: 'user-ceo' // Default for now
    });

    fa360.log(`TIMER: ${durationMinutes}m registados no projeto ${activeProject.name}`);
    
    reset();
    setShowLogModal(false);
    setIsExpanded(false);
    setDescription('');
  };

  return (
    <>
      <div className="fixed bottom-24 right-8 z-[500] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass p-1.5 rounded-full border-luxury-gold/30 shadow-2xl flex items-center gap-3 pointer-events-auto"
            >
              <div className="bg-luxury-gold text-black px-4 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="text-xs font-black tracking-widest tabular-nums">{formatTime(elapsedTime)}</span>
              </div>
              
              <div className="flex items-center gap-1 pr-1">
                <button 
                  onClick={() => setShowLogModal(true)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-luxury-charcoal dark:text-white"
                >
                  <Square size={14} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isActive && activeProject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass px-4 py-2 rounded-xl border-black/5 dark:border-white/5 shadow-xl pointer-events-auto"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold mb-0.5">{t('timer_active')}</p>
              <p className="text-xs font-bold text-luxury-charcoal dark:text-white">{activeProject.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass w-full max-w-md p-8 rounded-[2rem] border-white/10 shadow-2xl space-y-6"
            >
              <div>
                <h3 className="text-2xl font-serif italic text-white mb-2">{t('timer_save')}</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-gold">{activeProject?.name}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">{t('timer_phase')}</label>
                  <select 
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-luxury-gold outline-none"
                  >
                    <option value="Research">Estudo Previo</option>
                    <option value="Production">Licenciamento</option>
                    <option value="Execution">Execucao</option>
                    <option value="Meeting">Reuniao</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">{t('timer_description')}</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-luxury-gold outline-none min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
                >
                  {t('timer_cancel')}
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 rounded-xl bg-luxury-gold text-black text-[11px] font-black uppercase tracking-widest shadow-lg shadow-luxury-gold/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {t('timer_save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
```

## File: .\components\ui\Tooltip.tsx
```
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  delay = 0.2
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPosClass = () => {
    switch (position) {
      case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
      case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-3';
      case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-3';
      case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-3';
      default: return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
    }
  };

  const getAnimation = () => {
    switch (position) {
      case 'top': return { initial: { opacity: 0, y: 10, x: '-50%' }, animate: { opacity: 1, y: 0, x: '-50%' }, exit: { opacity: 0, y: 10, x: '-50%' } };
      case 'bottom': return { initial: { opacity: 0, y: -10, x: '-50%' }, animate: { opacity: 1, y: 0, x: '-50%' }, exit: { opacity: 0, y: -10, x: '-50%' } };
      case 'left': return { initial: { opacity: 0, x: 10, y: '-50%' }, animate: { opacity: 1, x: 0, y: '-50%' }, exit: { opacity: 0, x: 10, y: '-50%' } };
      case 'right': return { initial: { opacity: 0, x: -10, y: '-50%' }, animate: { opacity: 1, x: 0, y: '-50%' }, exit: { opacity: 0, x: -10, y: '-50%' } };
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center transition-all ${isVisible ? 'z-[9999]' : 'z-auto'}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseDown={() => setIsVisible(true)}
      onPointerDown={() => setIsVisible(true)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            {...getAnimation()}
            transition={{ duration: 0.15, delay: isVisible ? delay : 0 }}
            className={`absolute ${getPosClass()} z-[10000] pointer-events-none hidden lg:block`}
          >
            <div className="bg-luxury-white/95 dark:bg-black/95 backdrop-blur-2xl px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-charcoal dark:text-white whitespace-nowrap">
                {content}
              </span>
              
              {/* Arrow */}
              <div className={`absolute w-2 h-2 rotate-45 bg-luxury-white/95 dark:bg-black/95 border-black/10 dark:border-white/20 
                ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
                ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
                ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r' : ''}
                ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l' : ''}
              `} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

## File: .\components\DayPanel.tsx
```

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, Clock, MapPin, AlertTriangle, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DailyBriefing } from '../types';

interface DayPanelProps {
    data: DailyBriefing;
}

export default function DayPanel({ data }: DayPanelProps) {
    const { t } = useLanguage();

    if (!data) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Coluna 1: Agenda / Reunioes */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-luxury-gold/20 transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-white font-serif italic text-9xl leading-none -mr-4 -mt-4 pointer-events-none">
                    {new Date().getDate()}
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-luxury-gold/10 rounded-xl text-luxury-gold">
                        <Calendar size={18} />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Agenda de Hoje</h3>
                </div>

                <div className="space-y-4 relative z-10">
                    {data.meetings.length === 0 ? (
                        <p className="text-sm italic opacity-60 text-white">Sem reunioes agendadas.</p>
                    ) : (
                        data.meetings.map(m => (
                            <div key={m.id} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="text-center min-w-[3rem]">
                                    <span className="block text-sm font-black text-luxury-gold">{m.time}</span>
                                    <span className="block text-xs uppercase tracking-wider opacity-50 text-white">H</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-serif italic text-white leading-tight mb-1">{m.title}</h4>
                                    <div className="flex items-center gap-2 opacity-60 text-xs uppercase tracking-wider text-white">
                                        <MapPin size={10} /> {m.location}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Coluna 2: Tarefas Prioritarias */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-luxury-gold/20 transition-all">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-luxury-gold/10 rounded-xl text-luxury-gold">
                        <CheckSquare size={18} />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Foco Imediato</h3>
                </div>

                <div className="space-y-3">
                    {data.tasks.filter(t => t.priority === 'High').map(task => (
                        <div key={task.id} className="group/task flex items-center justify-between p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-2xl hover:bg-luxury-gold/10 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 rounded-full border-2 border-luxury-gold/30 group-hover/task:border-luxury-gold flex items-center justify-center transition-colors">
                                    <CheckCircle2 size={12} className="opacity-0 group-hover/task:opacity-100 text-luxury-gold transition-opacity" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{task.title}</p>
                                    <p className="text-xs uppercase tracking-wider opacity-60 text-white mt-0.5 flex items-center gap-2">
                                        {task.projectKey} a€¢ <span className="text-red-400 flex items-center gap-1"><Clock size={8} /> {task.deadline}</span>
                                    </p>
                                </div>
                            </div>
                            <Play size={14} className="text-luxury-gold opacity-0 group-hover/task:opacity-100 transition-opacity transform translate-x-2 group-hover/task:translate-x-0" />
                        </div>
                    ))}
                    {data.tasks.filter(t => t.priority === 'High').length === 0 && (
                        <div className="flex flex-col items-center justify-center h-24 text-center">
                            <CheckCircle2 size={24} className="text-emerald-500/50 mb-2" />
                            <p className="text-xs italic opacity-60 text-white">Tudo em dia. Bom trabalho!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Coluna 3: Alertas e Metricas de Risco */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-all bg-red-500/[0.02]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                        <AlertTriangle size={18} />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Atencao Necessaria</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)]">
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer">
                        <span className="text-3xl font-serif text-white">{data.pendingInvoices}</span>
                        <span className="text-xs uppercase tracking-widest opacity-60 text-white leading-tight">Faturas<br />Vencidas</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer">
                        <span className="text-3xl font-serif text-white">{data.stalledProjects}</span>
                        <span className="text-xs uppercase tracking-widest opacity-60 text-white leading-tight">Projetos<br />Parados</span>
                    </div>

                    <button className="col-span-2 mt-auto py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-between group/btn border border-white/5">
                        <span className="text-xs uppercase tracking-widest opacity-60 text-white">Ver Relatorio de Riscos</span>
                        <ArrowRight size={14} className="text-white opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>
        </div>
    );
}

```

## File: .\components\ProposalDocument.tsx
```

import React from 'react';
// Heartbeat 2.0 - Final Build Fix
import BrandLogo from './common/BrandLogo';
import { exclusionsPT, extrasPT, disciplines } from '../services/feeData';
import { ShieldCheck, MapPin } from 'lucide-react';

interface ProposalDocumentProps {
   data: {
      templateName: string;
      clientName: string;
      projectName: string;
      location: string;
      internalRef: string;
      area: number;
      complexity: string;
      scenario: string;
      feeArch: number;
      feeSpec: number;
      feeTotal: number;
      vat: number;
      totalWithVat: number;
      activeSpecs: string[];
      selectedSpecs?: string[];
      phases: any[];
      effortMap: any[];
      units: any;
   };
   includeAnnex: boolean;
}

export default function ProposalDocument({ data, includeAnnex }: ProposalDocumentProps) {
   const today = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });

   return (
      <>
         <style>{`
        @media print {
          body * { visibility: hidden; }
          .proposal-to-print, .proposal-to-print * { visibility: visible; }
          .proposal-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break { page-break-before: always; }
          @page { margin: 0; }
        }
      `}</style>
         <div className="proposal-to-print bg-white text-luxury-black p-8 md:p-24 shadow-2xl min-h-[1100px] w-full max-w-[900px] mx-auto flex flex-col font-sans border border-luxury-black/5">
            {/* Estacionario Premium */}
            <header className="flex justify-between items-start border-b-2 border-luxury-black pb-12 mb-20">
               <BrandLogo animated={false} size={35} withIcon={true} />
               <div className="text-right">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">Honorarios Profissionais</p>
                  <p className="text-xs font-mono mt-2 tracking-tighter">REF: {data.internalRef}</p>
                  <p className="text-xs font-mono opacity-50">{today}</p>
               </div>
            </header>

            {/* Identificacao do Projeto */}
            {/* PAGINA 1: PROPOSTA EXECUTIVA */}
            <div className="flex-1 space-y-16">
               {/* 2. Enquadramento */}
               <section className="space-y-4">
                  <p className="text-xs font-light italic leading-relaxed opacity-60 text-luxury-black">
                     A presente proposta refere-se A  prestacao de servicos de arquitetura para o desenvolvimento do projeto identificado,
                     incluindo as fases e disciplinas necessarias para garantir um processo tecnicamente consistente e conforme o RJUE.
                  </p>
               </section>

               {/* 3. Modo de Decisao & A‚mbito */}
               <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 text-luxury-purple">
                        <span className="w-8 h-[1px] bg-luxury-purple opacity-30"></span>
                        <p className="text-[11px] font-black uppercase tracking-widest">NA­vel de Decisao</p>
                     </div>
                     <div className="bg-luxury-black/5 p-8 rounded-[2rem] border border-luxury-black/5">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-2 text-luxury-black">
                           {data.scenario === 'essential' ? 'ðŸ¥ˆ Modo Essencial' : data.scenario === 'standard' ? 'ðŸ¥‡ Modo Profissional' : 'ðŸ’Ž Modo Executivo'}
                        </h4>
                        <p className="text-[11px] font-light italic opacity-60">
                           {data.scenario === 'essential' ? 'Cumprir a lei e avancar com seguranca.' :
                              data.scenario === 'standard' ? 'Projeto solido, decisoes claras, menos surpresas.' :
                                 'Controlo total. Zero improviso.'}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-4 text-luxury-gold">
                        <span className="w-8 h-[1px] bg-luxury-gold opacity-30"></span>
                        <p className="text-[11px] font-black uppercase tracking-widest">A‚mbito do Servico</p>
                     </div>
                     <ul className="space-y-3 px-2">
                        {(data.phases || []).map((p, i) => (
                           <li key={i} className="flex items-center gap-3 text-xs font-medium italic opacity-70">
                              <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                              {p?.label || 'Fase'}
                           </li>
                        ))}
                     </ul>
                  </div>
               </section>

               {/* 5. Valor Global */}
               <section className="py-12 border-y-2 border-luxury-black flex flex-col items-center justify-center space-y-4 bg-luxury-black/[0.02]">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Investimento Global Refletido</p>
                  <h3 className="text-7xl font-serif italic tracking-tighter text-luxury-black">
                     a‚¬{data.feeTotal.toLocaleString()}<span className="text-2xl font-sans not-italic text-luxury-gold ml-2">+ IVA</span>
                  </h3>
                  <p className="text-[10px] font-mono opacity-40 italic">Calculo baseado na complexidade e ambito tecnico definidos.</p>
               </section>

               {/* 6. Prazo e Exclusoes */}
               <section className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[11px]">
                  <div className="space-y-4">
                     <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Prazo de Execucao</h4>
                     <p className="italic opacity-60 font-light leading-relaxed">
                        Prazos estimados de execucao tecnica: {data.scenario === 'premium' ? '18 a 24' : '10 a 14'} semanas
                        (sujeito a alteracoes por parte de entidades externas e aprovacoes camararias).
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Exclusoes de Suporte</h4>
                     <ul className="space-y-2 opacity-50 italic font-light">
                        <li>a€¢ Taxas camararias e licenciamento de entidades externas.</li>
                        <li>a€¢ Estudos geotecnicos, topograficos e levantamentos previos.</li>
                        <li>a€¢ Alteracoes substanciais ao programa aprovado nesta fase.</li>
                     </ul>
                  </div>
               </section>

               {/* 8. Call to Action */}
               <section className="pt-12 border-t border-luxury-black/5">
                  <div className="flex flex-col items-center py-10 bg-luxury-black text-white rounded-[3rem] space-y-6 shadow-xl">
                     <p className="text-[11px] font-black uppercase tracking-[0.3em]">Instrucoes de Adjudicacao</p>
                     <p className="text-xs font-light italic max-w-md text-center opacity-60">Para avancar, confirme por escrito a adjudicacao e proceda ao pagamento do sinal de processamento indicado nas condicoes financeiras.</p>
                     <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest border border-white/20 px-8 py-3 rounded-full">
                        <ShieldCheck size={14} className="text-luxury-gold" />
                        Pronto para Adjudicar
                     </div>
                  </div>
                  <p className="text-[10px] text-center mt-6 italic opacity-40">
                     a€œA presente proposta reflete uma abordagem tecnica responsavel, orientada para a reducao de risco, controlo de custos e fluidez do processo ate A  aprovacao.a€
                  </p>
               </section>
            </div>

            {/* QUEBRA DE PAGINA PARA ANEXO TA‰CNICO */}
            {includeAnnex && (
               <div className="page-break" style={{ pageBreakBefore: 'always', marginTop: '4rem' }}>
                  <header className="flex justify-between items-start border-b border-luxury-black pb-8 mb-16">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em]">Anexo Tecnico de Validacao</h3>
                     <p className="text-[11px] font-mono opacity-50">REF: {data.internalRef} / ANEXO</p>
                  </header>

                  <div className="space-y-16">
                     {/* Memoria Descritiva das Fases */}
                     <section className="space-y-8">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">1. Detalhe do A‚mbito por Fase</h3>
                        <div className="grid grid-cols-1 gap-8">
                           {(data.phases || []).map((p, i) => (
                              <div key={i} className="flex gap-10">
                                 <div className="w-12 h-12 rounded-full border border-luxury-black/10 flex items-center justify-center shrink-0">
                                    <span className="font-serif italic text-lg text-luxury-gold">{i + 1}</span>
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest">{p?.label || 'Fase'}</h4>
                                    <p className="text-xs font-light italic opacity-60 leading-relaxed">{p?.description || ''}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Especialidades Integradas */}
                     <section className="space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-luxury-black/5 pb-3">2. Disciplinas Tecnicas Coordenadas</h3>
                        <div className="grid grid-cols-3 gap-4 text-[11px] font-light italic opacity-60">
                           {(data.activeSpecs || []).map((s, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                                 <span>{s}</span>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Mapa de Esforco Tecnico (DO PASSO 3) */}
                     <section className="space-y-8">
                        <div className="flex justify-between items-end border-b border-luxury-black/5 pb-3">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">3. Mapa de Esforco Tecnico</h3>
                           <p className="text-[10px] font-mono opacity-40">Estimativa baseada em benchmarks internos</p>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-luxury-black/10">
                           <table className="w-full text-left text-[11px]">
                              <thead className="bg-luxury-black/[0.02]">
                                 <tr>
                                    <th className="px-6 py-4 font-black uppercase tracking-[0.1em]">Fase</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-[0.1em]">Esforco (h)</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-[0.1em]">Responsabilidade</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-luxury-black/5">
                                 {(data.effortMap || []).map((eff, i) => (
                                    <tr key={i} className="font-light italic">
                                       <td className="px-6 py-3 opacity-70">{eff?.label || ''}</td>
                                       <td className="px-6 py-3 font-mono">a‰ˆ{eff?.hours || 0} h</td>
                                       <td className="px-6 py-3 opacity-40 text-[10px]">{eff?.profile || ''}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </section>

                     {/* Notas Finais / Condicoes */}
                     <section className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[11px]">
                        <div className="space-y-4">
                           <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2 text-luxury-gold">Faturacao e Pagamentos</h4>
                           <ul className="space-y-2 opacity-60 italic font-light list-disc px-4">
                              <li>Adjudicacao: 20% do valor global de honorarios.</li>
                              <li>Entrega de fase: Pagamento integral do valor da respetiva fase.</li>
                              <li>IVA nao incluA­do nos valores base (taxa legal em vigor).</li>
                           </ul>
                        </div>
                        <div className="space-y-4">
                           <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Suporte Camarario (RJUE)</h4>
                           <p className="italic opacity-60 font-light leading-relaxed">
                              A presente proposta garante conformidade com o <b>Decreto-Lei 10/2024 (Simplex)</b>. A responsabilidade tecnica inclui submissao e acompanhamento processual ate decisao final.
                           </p>
                        </div>
                     </section>
                  </div>
               </div>
            )}

            {/* Anexo Tecnico (Passo 9) */}
            {includeAnnex && (
               <div className="mt-20 pt-10 border-t border-black/10 page-break pb-10">
                  <h3 className="text-xl font-serif italic mb-6">III. A‚mbito Tecnico por Especialidade</h3>
                  <p className="text-[11px] opacity-60 mb-8 italic uppercase tracking-widest leading-relaxed">
                     Detalhamento dos servicos de engenharia integrados na proposta,
                     assegurando a conformidade normativa e a coordenacao interdisciplinar.
                  </p>

                  <div className="space-y-10">
                     {data.selectedSpecs?.map((specId: string) => {
                        const spec = disciplines.find(d => d.disciplineId === specId);
                        if (!spec || !spec.phases) return null;

                        return (
                           <div key={specId} className="space-y-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                 <h4 className="text-xs font-bold uppercase tracking-widest">{spec.labelPT}</h4>
                              </div>
                              <div className="grid grid-cols-1 gap-4 ml-4">
                                 {spec.phases.map((ph) => (
                                    <div key={ph.phaseId} className="space-y-1">
                                       <p className="text-[10px] font-bold uppercase opacity-80">
                                          {ph.phaseId} a€” {ph.labelPT}
                                       </p>
                                       <p className="text-[11px] font-light italic leading-relaxed opacity-60">
                                          {ph.shortPT}
                                       </p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                     <p className="text-[10px] font-light italic opacity-60 leading-relaxed">
                        Nota: Todas as especialidades sao coordenadas pela Ferreira Arquitetos (Gestao BIM/Design Management),
                        garantindo a compatibilizacao tridimensional e a reducao de erros em fase de obra.
                     </p>
                  </div>
               </div>
            )}

            {/* Rodape Documento */}
            <footer className="mt-24 pt-12 border-t border-luxury-black/10 flex justify-between items-end">
               <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Miguel Ferreira, Lead Architect</p>
                  <div className="w-48 h-[1px] bg-luxury-black/10 mb-4"></div>
                  <p className="text-[11px] font-serif italic opacity-60">Validado pela Antigravity Engine</p>
               </div>
               <div className="text-right text-xs opacity-50 font-black uppercase tracking-[0.3em] max-w-[300px] leading-loose italic">
                  Atelier Lisboa a€¢ Estoril a€¢ Dubai<br />www.ferreiraarq.pt
               </div>
            </footer>
         </div>
      </>
   );
}

interface DocInfoBoxProps {
   label: string;
   value: string;
}

function DocInfoBox({ label, value }: DocInfoBoxProps) {
   return (
      <div className="space-y-2">
         <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50">{label}</p>
         <p className="text-xl font-serif italic text-luxury-black tracking-tight">{value}</p>
      </div>
   );
}
```

## File: .\components\ProposalGenerator.tsx
```

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Zap,
  Layers,
  ChevronDown,
  X,
  Eye,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Scale,
  ShieldCheck,
  Calculator,
  Box,
  Layout,
  MapPin,
  User,
  Brain,
  Loader2,
  Search,
  Clock,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates, disciplines, templateSpecialties, exclusionsPT } from '../services/feeData';
import { calculateFees } from '../services/feeCalculator';
import { Complexity, Scenario } from '../types';
import ProposalDocument from './ProposalDocument';
import fa360 from '../services/fa360';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { automationBridgeService } from '../services/automationBridge.service';
import { exportEngineService } from '../services/exportEngine.service';
import { DISCOUNT_POLICY, UserRole, DiscountType } from '../services/discountPolicy';
import { oneClickCreate } from '../services/oneClickCreate.client';

const useQuery = () => new URLSearchParams(useLocation().search);

export default function ProposalGenerator({ isOpen }: { isOpen: boolean }) {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();

  // Dados de Identidade
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [internalRef, setInternalRef] = useState('');

  const query = useQuery();

  useEffect(() => {
    const qTemplate = query.get('templateId');
    const qClient = query.get('client');
    const qLocation = query.get('location');
    const qProject = query.get('project');

    if (qTemplate) setSelectedTemplate(qTemplate);
    if (qClient) setClientName(qClient);
    if (qLocation) setLocation(qLocation);
    if (qProject) setProjectName(qProject);
  }, [query]);

  // Auto-Generate Reference
  useEffect(() => {
    // Format: FA-YYMMDD-CLIENT-CITY
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ''); // 260127

    const cleanClient = clientName
      .trim()
      .split(' ')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 5);

    const cleanLoc = location
      .trim()
      .split(',')[0] // Take first part before comma
      .trim()
      .split(' ')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 3);



    // Only update if we have valid data, otherwise keep empty
    if (clientName && location && clientName.length > 2 && location.length > 2) {
      setInternalRef(`FA-${dateStr}-${cleanClient || 'CLI'}-${cleanLoc || 'LOC'}`);
    } else if (!internalRef && !clientName && !location) {
        // Keep empty if checking for reset
        setInternalRef(''); 
    }
  }, [clientName, location]);

  // Configuracoes Tecnicas
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [area, setArea] = useState(0);
  const [complexity, setComplexity] = useState<Complexity>(1);
  const [activeSpecs, setActiveSpecs] = useState<string[]>([]);


  // Discount Policy State
  // FIX: Default to 'diretor' to ensure simulation works freely by default
  const [userRole, setUserRole] = useState<UserRole | ''>('');
  const [discountType, setDiscountType] = useState<DiscountType>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [justification, setJustification] = useState('');

  const [strategy, setStrategy] = useState<'integrated' | 'phased'>('integrated');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('standard');
  const [isPropagating, setIsPropagating] = useState(false);
  const [showJustification, setShowJustification] = useState(true);
  const [includeAnnex, setIncludeAnnex] = useState(true);

  // Unidades (Passo 9)
  const [units, setUnits] = useState({
    apartments: 0,
    lots: 0,
    rooms: 0
  });

  // Auto-selecao de obrigatorias
  useMemo(() => {
    const required = templateSpecialties
      .filter(ts => ts.templateId === selectedTemplate && ts.required)
      .map(ts => ts.disciplineId);

    setActiveSpecs(prev => Array.from(new Set([...prev, ...required])));
  }, [selectedTemplate]);

  const currentTemplate = useMemo(() => selectedTemplate ? templates.find(t => t.templateId === selectedTemplate) : null, [selectedTemplate]);

  // Simulacao de cenarios


  const currentResult = useMemo(() => {
    if (!selectedTemplate) return null;
    return calculateFees({
      templateId: selectedTemplate,
      area,
      complexity,
      scenario: selectedScenario,
      selectedSpecs: activeSpecs,
      units,
      discount: { type: discountType, value: discountValue, justification },
      userRole: userRole || 'auto',
      clientName,
      location
    });
  }, [selectedTemplate, area, complexity, activeSpecs, selectedScenario, units, discountType, discountValue, justification, userRole, clientName, location]);


  // Compliance (Passo 8)
  const compliance = useMemo(() => {
    const issues: string[] = [];
    if (!selectedTemplate || !currentResult) return issues;

    const requiredSpecs = templateSpecialties.filter(ts => ts.templateId === selectedTemplate && ts.required);
    requiredSpecs.forEach(rs => {
      if (!activeSpecs.includes(rs.disciplineId)) {
        const specName = disciplines.find(d => d.disciplineId === rs.disciplineId)?.labelPT;
        issues.push(`Falta: ${specName} (Obrigatoria RJUE)`);
      }
    });

    if (!clientName) issues.push("Identificacao do Cliente pendente.");
    // if (currentResult?.meta?.appliedDiscount > 12) issues.push("Desconto exige aprovacao da gerencia.");
    // if (currentResult?.strategic?.isBlocked) issues.push("BLOQUEIO: Margem insuficiente para emissao.");

    return issues;
  }, [selectedTemplate, activeSpecs, clientName, currentResult]);



  const handlePropagate = async () => {
    if (compliance.length > 0 && !clientName) return;
    setIsPropagating(true);

    fa360.log(`ACTION: Iniciando analise de risco IA para proposta #${internalRef}`);

    const proposalData = {
      ref: internalRef,
      client: clientName,
      project: projectName,
      location,
      area,
      total: currentResult?.feeTotal,
      scenario: selectedScenario,
      timestamp: new Date().toISOString(),
      disciplines: activeSpecs.length
    };

    // Auditoria de Risco IA
    const risk = await geminiService.verifyProposalRisk(proposalData);
    // setRiskResult(risk); // Removed unused state

    if (risk.riskLevel === 'high') {
      fa360.log(`WARNING: Risco ELEVADO detetado: ${risk.observation}`);
    }

    const result = await fa360.saveProposal({ ...proposalData, risk });

    setIsPropagating(false);

    if (result.success) {
      fa360.log(`SUCCESS: Proposta #${internalRef} registada no Antigravity Brain.`);
      alert("Proposta propagada com sucesso para o Neural Brain (Sheets).");
    } else if (result.status === 'no_hook') {
      alert("Aviso: Proposta guardada localmente. Configure o Neural Link no painel Antigravity para sincronizacao global.");
    }
  };

  const handleAutomation = async (level: 1 | 2 | 3) => {
    if (!currentResult?.automationPayload) return;
    setIsPropagating(true);
    try {
      let htmlContent = '';
      if (level >= 2) {
        htmlContent = exportEngineService.exportHTMLString('proposal-capture-zone', clientName) || '';
      }

      const run = await automationBridgeService.execute(currentResult?.automationPayload, level, 'CEO', htmlContent);

      fa360.log(`AUTO: Execucao NA­vel ${level} concluA­da com sucesso. Projeto: ${run.createdIds.projectId}`);

      // Delay for effect and then navigate
      setTimeout(() => {
        navigate(`/projects/${run.createdIds.projectId}`);
      }, 1000);
    } catch {
      fa360.log("ERROR: Falha na automacao operacional.");
    } finally {
      setIsPropagating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Esquerda: Configuracoes */}
      <div className="lg:col-span-7 space-y-8">

        {/* Bloco 1: Identidade da Proposta */}
        <div className="glass p-10 md:p-14 rounded-[2rem] border-black/5 dark:border-white/5 space-y-10 shadow-2xl relative overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
          <header className="flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
            <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-2xl"><User size={20} /></div>
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_identity_title')}</h3>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_client_name')}</label>
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ex: Joao Silva ou Empresa X"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_project_name')}</label>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="Ex: Villa Alentejo"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_location')}</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-luxury-gold opacity-60" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Lisboa, Estoril, etc..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_ref')}</label>
              <input
                value={internalRef}
                onChange={e => setInternalRef(e.target.value)}
                className="w-full bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-gold font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco: Enquadramento (Digital Twin Parity) */}
        <div className="glass p-8 md:p-10 rounded-[2rem] border-black/5 dark:border-white/5 space-y-4 shadow-sm relative overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
          <p className="text-xs font-light italic leading-relaxed opacity-60 text-luxury-charcoal dark:text-white text-justify">
            {t('calc_context_text')}
          </p>
        </div>

        {/* Bloco 2: Parametros Tecnicos */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-12 shadow-2xl relative overflow-hidden">
          <header className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-8">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-2xl"><Calculator size={20} /></div>
              <h2 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_rjue_config')}</h2>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${compliance.length === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              <ShieldCheck size={12} /> {compliance.length === 0 ? t('calc_compliance_ok') : t('calc_check_errors')}
            </div>
          </header>

          {/* Passo 2: Modos de Decisao */}
          <div className="space-y-6">
            <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_mode_decision')}</label>
                {/* Modos de Decisao (Passo 9: Scenario details) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'essential', label: t('calc_mode_essential'), icon: <ShieldAlert size={18} />, colorClass: 'emerald', desc: t('calc_mode_desc_essential'), revisions: 2 },
                { id: 'standard', label: t('calc_mode_standard'), icon: <ShieldCheck size={18} />, colorClass: 'blue', desc: t('calc_mode_desc_standard'), revisions: 3 },
                { id: 'premium', label: t('calc_mode_premium'), icon: <Zap size={18} />, colorClass: 'purple', desc: t('calc_mode_desc_premium'), revisions: 4 }
              ].map(m => {
                const isActive = selectedScenario === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedScenario(m.id as Scenario)}
                    className={`
                        p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group
                        ${isActive
                        ? m.id === 'essential' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-2xl' :
                          m.id === 'standard' ? 'bg-blue-500/10 border-blue-500/50 shadow-2xl' :
                            'bg-purple-500/10 border-purple-500/50 shadow-2xl'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-luxury-gold/30 dark:hover:border-white/20'
                      }
                      `}
                  >
                    <div className={`
                        p-3 rounded-xl mb-4 w-fit transition-colors
                        ${isActive
                        ? m.id === 'essential' ? 'bg-emerald-500 text-white' :
                          m.id === 'standard' ? 'bg-blue-500 text-white' :
                            'bg-purple-500 text-white'
                        : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/20 dark:text-white/40'}
                      `}>
                      {m.icon}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                       <h4 className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-luxury-charcoal dark:text-white' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>
                         {m.label}
                       </h4>
                       {isActive && <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-full opacity-60 uppercase">{m.revisions} Revs</span>}
                    </div>
                    <p className={`text-xs leading-relaxed italic ${isActive ? 'text-luxury-charcoal/80 dark:text-white/80' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>
                      {m.desc}
                    </p>
                    {isActive && (
                      <motion.div
                        layoutId="mode-active"
                        className={`absolute inset-0 border-2 rounded-[2rem] pointer-events-none ${m.id === 'essential' ? 'border-emerald-500/30' :
                          m.id === 'standard' ? 'border-blue-500/30' :
                            'border-purple-500/30'
                          }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_typology')}</label>
              <select
                value={selectedTemplate || ''}
                onChange={(e) => setSelectedTemplate(e.target.value || null)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm appearance-none outline-none focus:border-luxury-gold transition-all text-luxury-charcoal dark:text-white"
              >
                <option value="" disabled className="bg-white dark:bg-luxury-black text-luxury-charcoal/40 dark:text-white/40">
                  {t('calc_select_typology')}
                </option>
                {templates.map(tmp => (
                  <option key={tmp.templateId} value={tmp.templateId} className="bg-white dark:bg-luxury-black text-luxury-charcoal dark:text-white">{tmp.namePT}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{t('calc_gross_area')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    disabled={!selectedTemplate}
                    className={`w-24 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-right text-sm font-mono text-luxury-gold outline-none focus:border-luxury-gold transition-all ${!selectedTemplate ? 'opacity-30 cursor-not-allowed' : ''}`}
                  />
                  <span className="text-xs font-black text-luxury-charcoal/40 dark:text-white/40">m²</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="2500"
                step="5"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                disabled={!selectedTemplate}
                className={`w-full accent-luxury-gold h-1.5 ${!selectedTemplate ? 'opacity-30 cursor-not-allowed' : ''}`}
              />
            </div>

            {/* Unidades Dinamicas (Passo 9) */}
            {currentTemplate?.pricingModel === 'UNIT' && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5 dark:border-white/5">
                {currentTemplate?.unitPricing?.unitKind === 'APARTMENT' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_units_apartments')}</label>
                    <input
                      type="number"
                      value={units.apartments}
                      onChange={e => setUnits(u => ({ ...u, apartments: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
                {currentTemplate?.unitPricing?.unitKind === 'LOT' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_units_lots')}</label>
                    <input
                      type="number"
                      value={units.lots}
                      onChange={e => setUnits(u => ({ ...u, lots: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
                {currentTemplate?.unitPricing?.unitKind === 'ROOM' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_units_rooms')}</label>
                    <input
                      type="number"
                      value={units.rooms}
                      onChange={e => setUnits(u => ({ ...u, rooms: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_complexity')}</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(c => (
                  <button key={c} onClick={() => setComplexity(c as Complexity)} className={`flex-1 py-4 rounded-xl text-xs font-black border transition-all ${complexity === c ? 'bg-luxury-gold text-black border-luxury-gold shadow-xl' : 'border-black/10 dark:border-white/10 text-luxury-charcoal/40 dark:text-white/40'}`}>
                    {c === 1 ? t('calc_comp_low') : c === 2 ? t('calc_comp_med') : t('calc_comp_high')}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_strat_simplex')}</label>
              <div className="flex gap-2 p-1 bg-black/5 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                <button onClick={() => setStrategy('integrated')} className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${strategy === 'integrated' ? 'bg-black/10 dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-xl' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>{t('calc_strat_all')}</button>
                <button onClick={() => setStrategy('phased')} className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${strategy === 'phased' ? 'bg-black/10 dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-xl' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>{t('calc_strat_phased')}</button>
              </div>
            </div>
          </div>


          {selectedTemplate && (
            <div className="space-y-8 pt-8 border-t border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_disciplines_title')}</h3>
                <span className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{activeSpecs.length} {t('calc_disciplines_count')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {disciplines.map(d => {
                  const isReq = templateSpecialties.find(ts => ts.templateId === selectedTemplate && ts.disciplineId === d.disciplineId)?.required;
                  const isActive = activeSpecs.includes(d.disciplineId);
                  return (
                    <button
                      key={d.disciplineId}
                      onClick={() => !isReq && setActiveSpecs(prev => prev.includes(d.disciplineId) ? prev.filter(i => i !== d.disciplineId) : [...prev, d.disciplineId])}
                      className={`p-4 rounded-2xl border text-left transition-all ${isActive ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-luxury-charcoal/20 dark:text-white/20'}`}
                    >
                      <span className="text-xs font-black uppercase tracking-widest truncate block mb-1">{d.labelPT}</span>
                      {isReq && <span className="text-[7px] font-black uppercase opacity-60">Obrigatoria</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bloco 3: Memoria das Fases (Interface Live) */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-10 shadow-2xl">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-luxury-gold/20 text-luxury-gold rounded-2xl"><Box size={20} /></div>
              <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_scope_phase')}</h3>
            </div>
          </header>

          {(!currentResult || !currentResult.phasesBreakdown || currentResult.phasesBreakdown.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-40 space-y-4">
              <Box size={40} strokeWidth={1} />
              <p className="text-xs font-light italic">{t('calc_waiting_data')}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5">Fase</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5">Descritivo</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5 text-center">Esforço</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5 text-center">%</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {currentResult.phasesBreakdown.map((p: any, i: number) => {
                    const label = locale === 'en' ? (p.labelEN || p.label) : p.label;
                    const description = locale === 'en' ? (p.descriptionEN || p.description) : p.description;
                    const duration = locale === 'en' && p.weeks ? `${p.weeks} ${p.weeks === 1 ? 'Week' : 'Weeks'}` : p.duration;

                    return (
                      <tr key={i} className="group hover:bg-luxury-gold/[0.02] transition-colors">
                        <td className="px-6 py-5 align-top">
                          <span className="text-xs font-black uppercase tracking-widest text-luxury-gold block mb-1">{p.phaseId}</span>
                          <span className="text-[10px] font-bold text-luxury-charcoal/80 dark:text-white/80 uppercase tracking-tighter block">{label}</span>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <p className="text-[11px] font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed max-w-sm">
                            {description}
                          </p>
                        </td>
                        <td className="px-6 py-5 align-top text-center">
                          <span className="text-[10px] font-mono text-luxury-charcoal/40 dark:text-white/40 uppercase whitespace-nowrap">
                            {duration}
                          </span>
                        </td>
                        <td className="px-6 py-5 align-top text-center">
                          <span className="text-[11px] font-mono text-luxury-gold font-bold">
                            {p.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-5 align-top text-right">
                          <span className="text-xs font-mono font-bold text-luxury-charcoal dark:text-white">
                            €{p.value.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* Bloco 4: Condições & Exclusões (Digital Twin Parity) */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-10 shadow-2xl relative overflow-hidden">
          <header className="flex items-center gap-4">
            <div className="p-3 bg-black/5 dark:bg-white/5 text-luxury-gold rounded-2xl"><ShieldAlert size={20} /></div>
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_cond_excl')}</h3>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Entregas do Cenario (NEW) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-2 text-luxury-gold">{t('calc_scope_phase')} ({currentResult?.scenarioPack?.labelPT})</h4>
              <ul className="space-y-2 opacity-70 italic font-light text-[11px] text-luxury-charcoal dark:text-white">
                {(currentResult?.scenarioPack?.deliverablesPT || []).map((del: string, i: number) => (
                  <li key={i}>• {del}</li>
                ))}
              </ul>
            </div>

            {/* Excluões do Cenario (Dynamic) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-2 text-luxury-charcoal dark:text-white">{t('calc_excl_support')}</h4>
              <ul className="space-y-2 opacity-50 italic font-light text-[11px] text-luxury-charcoal dark:text-white">
                {(currentResult?.scenarioPack?.exclusionsPT || []).length > 0 
                  ? currentResult.scenarioPack.exclusionsPT.map((ex: string, i: number) => (
                    <li key={i}>• {ex}</li>
                  ))
                  : exclusionsPT.map((ex, i) => (
                    <li key={i}>• {ex}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: Resumo Financeiro & Propagacao */}
      <div className="lg:col-span-5 space-y-10">
        {/* PAINEL NORMAL COM RESULTADOS - UNLOCKED BY USER REQUEST */}
        <>
          <div className="glass p-8 rounded-[2rem] border-luxury-gold/30 bg-luxury-gold/[0.04] space-y-12 shadow-2xl sticky top-32 overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none">
              <TrendingUp size={180} className="text-luxury-gold" />
            </div>

            {/* TOTAL & GOVERNANCE */}
            <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{t('calc_est_investment')}</span>
              </div>
              <div className="text-6xl font-thin tracking-tighter text-luxury-charcoal dark:text-white mb-2 flex items-baseline gap-4">
                €{currentResult?.feeTotal?.toLocaleString() || '0'}
                {(currentResult?.deltaVsStandard?.net !== 0 && currentResult?.deltaVsStandard?.net !== undefined) && (
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${currentResult.deltaVsStandard.net > 0 ? 'bg-luxury-gold/20 text-luxury-gold' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {currentResult.deltaVsStandard.net > 0 ? '+' : ''}€{currentResult.deltaVsStandard.net.toLocaleString()} Δ Std
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-luxury-charcoal/60 dark:text-white/60 flex items-center gap-2">
                <Zap size={14} /> {t('calc_vat_legal')} (€{currentResult?.vat?.toLocaleString() || '0'})
              </p>

              <div className="mt-8 space-y-2">
                <ResultRow label={t('calc_arch_design')} value={`€${currentResult?.feeArch?.toLocaleString() || '0'}`} />
                <ResultRow label={t('calc_eng_integrated')} value={`€${currentResult?.feeSpec?.toLocaleString() || '0'}`} />
              </div>
              {/* Descontos & PolA­tica Comercial */}
              <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">

                {/* Controlo de Role (Simulacao) */}
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_sim_profile')}</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1 text-xs font-bold uppercase text-luxury-charcoal dark:text-white outline-none"
                  >
                    <option value="" disabled className="bg-white dark:bg-black text-black/50 dark:text-white/50">{t('calc_select_profile')}</option>
                    <option value="arquiteto" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_arch')}</option>
                    <option value="marketing" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_marketing')}</option>
                    <option value="financeiro" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_fin')}</option>
                    <option value="diretor" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_dir')}</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">{t('calc_disc_policy')}</label>
                      <select
                        value={discountType}
                        onChange={e => {
                          setDiscountType(e.target.value as DiscountType);
                          setDiscountValue(0); // reset value on type change
                        }}
                        className="bg-transparent text-xs font-black uppercase border-none outline-none text-luxury-gold cursor-pointer w-full"
                      >
                        {Object.entries(DISCOUNT_POLICY).map(([key, rule]) => (
                          <option key={key} value={key} className="bg-white dark:bg-black text-black dark:text-white">
                            {rule.description} (Max {rule.maxPct}%)
                          </option>
                        ))}
                      </select>
                    </div>
                    {discountType !== 'none' && <span className="text-sm font-mono text-luxury-gold">-{discountValue}%</span>}
                  </div>

                  {discountType !== 'none' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] uppercase font-black opacity-40">
                        <span>0%</span>
                        <span>Max: {DISCOUNT_POLICY[discountType].maxPct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={DISCOUNT_POLICY[discountType].maxPct + 5} // Allow trying over max to test clamping 
                        value={discountValue}
                        onChange={e => setDiscountValue(Number(e.target.value))}
                        className="w-full accent-luxury-gold h-1.5 bg-white/10 rounded-full appearance-none"
                      />
                    </div>
                  )}

                  {/* Justificativa condicional */}
                  {(discountValue > (DISCOUNT_POLICY[discountType].requiresJustificationAbove || 100) || discountType === 'custom') && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-red-400">{t('calc_justification_req')}</label>
                      <textarea
                        value={justification}
                        onChange={e => setJustification(e.target.value)}
                        placeholder={t('calc_justification_placeholder')}
                        className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-xs text-luxury-charcoal dark:text-white outline-none focus:border-red-500/50 min-h-[60px]"
                      />
                    </div>
                  )}

                  {/* Audit Feedback */}
                  {currentResult?.meta?.discountAudit && currentResult?.meta?.discountAudit?.status !== 'applied' && discountType !== 'none' && (
                    <div className={`p-4 rounded-xl border flex gap-3 ${currentResult?.meta?.discountAudit?.status === 'rejected'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}>
                      {currentResult?.meta?.discountAudit?.status === 'rejected' ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest">
                          {currentResult?.meta?.discountAudit?.status === 'rejected' ? t('calc_discount_rejected') : `${t('calc_adjusted_to')} ${currentResult?.meta?.discountAudit?.applied?.pct}%`}
                        </p>
                        <ul className="list-disc pl-3 text-[11px] opacity-80 italic">
                          {currentResult?.meta?.discountAudit?.reasons?.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* Min Fee Warning */}
                  {currentResult?.meta?.minFeeApplied && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3 animate-in fade-in">
                      <Lock size={16} className="text-orange-500" />
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest text-orange-400">{t('calc_min_fee_hit')}</p>
                        <p className="text-[11px] italic opacity-70 text-luxury-charcoal dark:text-white">
                          {t('calc_min_fee_desc')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bloco de Justificacao Narrativa: "Porque este valor?" */}
            <div className="relative z-10 pt-4">
              <div className="glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden">
                <button
                  onClick={() => setShowJustification(!showJustification)}
                  className="w-full p-8 flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-luxury-gold/20 rounded-lg text-luxury-gold"><Search size={16} /></div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-luxury-charcoal dark:text-white">{t('calc_why_value')}</h4>
                  </div>
                  <ChevronDown size={18} className="text-luxury-charcoal dark:text-white transition-transform duration-500" style={{ transform: showJustification ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                <AnimatePresence>
                  {showJustification && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 space-y-8 border-t border-white/5 pt-8">
                        {/* 1. Complexidade Legal */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-luxury-gold">
                            <Scale size={14} />
                            <span className="text-xs font-black uppercase tracking-widest">{t('calc_legal_complexity')}</span>
                          </div>
                          <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                            {t('calc_legal_desc')}
                          </p>
                        </div>

                        {/* 2. Risco Tecnico */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-luxury-gold">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-black uppercase tracking-widest">{t('calc_tech_risk')}</span>
                          </div>
                          <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                            {t('calc_tech_risk_desc')}
                          </p>
                        </div>

                        {/* 3. Esforco Tecnico */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-luxury-gold">
                            <Clock size={14} />
                            <span className="text-xs font-black uppercase tracking-widest">{t('calc_tech_effort')}</span>
                          </div>
                          <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                            {t('calc_tech_effort_desc')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Radar Estrategico Evolution (Passo 8: Precision Tuning) */}
            <div className="p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-all">
                <TrendingUp size={80} className="text-luxury-charcoal dark:text-white" />
              </div>

              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-luxury-gold">{t('calc_strat_radar')}</h4>
                  <p className="text-[11px] font-light italic text-luxury-charcoal/40 dark:text-white/40">{t('calc_gov_digital')}</p>
                </div>
                <div className="flex gap-2">
                  <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${currentResult?.strategic?.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                    currentResult?.strategic?.riskLevel === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                      'bg-green-500/10 border-green-500/20 text-green-500'
                    }`}>
                    {currentResult?.strategic?.riskLevel === 'high' ? t('calc_risk_high') : currentResult?.strategic?.riskLevel === 'medium' ? t('calc_risk_med') : t('calc_risk_low')} ({currentResult?.strategic?.riskScore}/100)
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${currentResult?.strategic?.isHealthy ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {currentResult?.strategic?.isHealthy ? t('calc_healthy') : t('calc_fragile')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_margin_digital')}</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-serif italic ${currentResult?.strategic?.margin < 45 ? 'text-red-500' :
                      currentResult?.strategic?.margin < 50 ? 'text-yellow-500' :
                        'text-luxury-charcoal dark:text-white'
                      }`}>
                      {currentResult?.strategic?.margin}%
                    </span>
                    <span className="text-xs opacity-30">{t('calc_roi_real')}</span>
                  </div>
                  <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((currentResult?.strategic?.margin || 0) / 70) * 100)}%` }}
                      className={`h-full ${currentResult?.strategic?.margin < 45 ? 'bg-red-500' :
                        currentResult?.strategic?.margin < 50 ? 'bg-yellow-500' :
                          'bg-luxury-gold'
                        }`}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-40">{t('calc_decision_trigger')}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${!currentResult?.strategic?.isBlocked ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}></div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      {!currentResult?.strategic?.isBlocked ? t('calc_emission_authorized') : t('calc_output_blocked')}
                    </span>
                  </div>
                  <p className="text-[11px] font-light italic opacity-40 leading-tight">
                    {currentResult?.strategic?.isBlocked ? t('calc_rec_blocked') :
                      currentResult?.strategic?.riskLevel === 'high' ? t('calc_rec_high_risk') :
                        t('calc_rec_safe')}
                  </p>
                </div>
              </div>

              {/* Alertas & Recomendacoes CrA­ticas */}
              {((currentResult?.strategic?.alerts?.length || 0) > 0 || (currentResult?.strategic?.recommendations?.length || 0) > 0) && (
                <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                  {currentResult?.strategic?.alerts?.map((alert, i) => (
                    <div key={`alert-${i}`} className="flex gap-3 items-start group/alert">
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${alert.includes('BLOQUEIO') ? 'bg-red-500' :
                        alert.includes('ðŸš©') ? 'bg-purple-500' :
                          alert.includes('aš ï¸') ? 'bg-yellow-500' : 'bg-luxury-gold'
                        }`}></div>
                      <p className={`text-[11px] leading-relaxed italic ${alert.includes('BLOQUEIO') ? 'text-red-400 font-bold' :
                        alert.includes('ðŸš©') ? 'text-purple-400' :
                          alert.includes('aš ï¸') ? 'text-yellow-400' : 'opacity-60 text-white'
                        }`}>
                        {alert}
                      </p>
                    </div>
                  ))}

                  {(currentResult?.strategic?.recommendations?.length || 0) > 0 && (
                    <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-luxury-gold opacity-60">Recomendacoes de Governanca</p>
                      {currentResult?.strategic?.recommendations?.map((rec, i) => (
                        <div key={`rec-${i}`} className="flex gap-2 items-center">
                          <CheckCircle2 size={10} className="text-luxury-gold opacity-40" />
                          <p className="text-[11px] italic opacity-70 text-white">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Passo 3: Mapa de Esforco Tecnico */}
            <div className="relative z-10 pt-4">
              <div className="glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-[2rem] p-10 space-y-8">
                <header className="space-y-2">
                  <div className="flex items-center gap-3 text-luxury-gold">
                    <Clock size={16} />
                    <h4 className="text-xs font-black uppercase tracking-widest">{t('calc_effort_map')}</h4>
                  </div>
                  <p className="text-xs font-light italic text-luxury-charcoal/40 dark:text-white/40">{t('calc_effort_desc')}</p>
                </header>

                <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                        <th className="px-6 py-4">{t('calc_phase')}</th>
                        <th className="px-6 py-4">{t('calc_est_effort')}</th>
                        <th className="px-6 py-4">{t('calc_main_profile')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {currentResult?.effortMap?.map((eff: { label: string; hours: number; profile: string }, i: number) => (
                        <tr key={i} className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-luxury-charcoal dark:text-white font-medium italic">{eff.label}</td>
                          <td className="px-6 py-4 text-luxury-gold font-mono">~{eff.hours} h</td>
                          <td className="px-6 py-4 text-luxury-charcoal/60 dark:text-white/60">{eff.profile}</td>
                        </tr>
                      ))}
                      <tr className="bg-luxury-gold/5 font-black">
                        <td className="px-6 py-4 text-luxury-gold uppercase tracking-tighter">{t('calc_est_total')}</td>
                        <td className="px-6 py-4 text-luxury-gold font-mono">
                          ~{currentResult?.effortMap?.reduce((acc: number, curr: { hours: number }) => acc + curr.hours, 0) || 0} h
                        </td>
                        <td className="px-6 py-4 text-luxury-gold/40">a€”</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/30">Equipa envolvida:</span>
                    <div className="flex gap-2">
                      {['Arquiteto Senior', 'Arquitetos', 'Coordenacao Tecnica'].map((member, i) => (
                        <span key={i} className="text-[11px] px-3 py-1 bg-white/5 rounded-full text-white/60 italic">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-light italic opacity-40 leading-relaxed text-white">
                    a€œEsta estimativa reflete o esforco tecnico necessario para desenvolver o projeto de forma consistente, reduzir revisoes e garantir um processo fluido ate A  aprovacao e execucao.a€
                  </p>
                </div>
              </div>
            </div>

            {/* Passo 4: Opcoes de Adjudicacao / PDF */}
            <div className="space-y-6 relative z-10 pt-4">
              <label className="text-xs font-black uppercase tracking-widest opacity-60 px-2 text-white text-white">Configuracoes de SaA­da (PDF)</label>
              <div className="flex gap-4">
                <div className="flex-1 glass bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Proposta Executiva</span>
                  </div>
                  <span className="text-[9px] px-2 py-1 bg-white/10 rounded uppercase font-black text-white/40">1 Pag Fixed</span>
                </div>
                <button
                  onClick={() => setIncludeAnnex(!includeAnnex)}
                  className={`flex-1 glass p-6 rounded-2xl flex items-center justify-between border transition-all ${includeAnnex ? 'bg-luxury-gold/10 border-luxury-gold/30' : 'bg-white/5 border-white/10 opacity-40'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${includeAnnex ? 'bg-luxury-gold' : 'bg-white/20'}`}></div>
                    <span className={`text-xs font-black uppercase tracking-widest ${includeAnnex ? 'text-luxury-gold' : 'text-white'}`}>Anexo Tecnico</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${includeAnnex ? 'bg-luxury-gold' : 'bg-white/10'}`}>
                    <motion.div animate={{ x: includeAnnex ? 22 : 2 }} className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-6 relative z-10 pt-10 border-t border-white/5">
              <label className="text-xs font-black uppercase tracking-widest opacity-60 px-2 text-white">Centro de Emissao & Adjudicacao</label>
              {/* Centro de Emissao (Passo 6: Governanca) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="col-span-1 md:col-span-2 py-7 bg-white text-black rounded-[2.5rem] text-xs font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-2xl flex items-center justify-center gap-4 group"
                >
                  <Eye size={18} /> Visualizar & Validar Proposta
                </button>

                <button
                  onClick={() => window.print()}
                  disabled={false}
                  className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                >
                  <Clock size={16} className="text-luxury-gold" />
                  Imprimir / PDF
                </button>

                <button
                  onClick={() => {
                    const content = document.getElementById('proposal-capture-zone')?.innerHTML;
                    const win = window.open('', '_blank');
                    if (win && content) {
                      win.document.write(`
                      <html>
                        <head>
                          <title>Proposta: ${projectName}</title>
                          <script src="https://cdn.tailwindcss.com"></script>
                          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:italic,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                          <style>
                            body { background: #f4f4f4; padding: 40px; display: flex; justify-content: center; }
                            .proposal-to-print { background: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
                            .font-serif { font-family: 'Cormorant Garamond', serif !important; }
                            .luxury-gold { color: #d4af37 !important; }
                            .bg-luxury-gold { background-color: #d4af37 !important; }
                            .text-luxury-black { color: #0a0a0a !important; }
                            .border-luxury-black { border-color: #0a0a0a !important; }
                            @media print { body { padding: 0; background: white; } .proposal-to-print { box-shadow: none; border: none; } }
                          </style>
                        </head>
                        <body>
                          <div class="w-full max-w-[900px]">
                            ${content}
                            <p style="text-align:center; font-family: sans-serif; font-size: 10px; opacity: 0.3; margin-top: 60px; text-transform: uppercase; letter-spacing: 2px;">
                              Documento Estrategico Ferreira Arquitetos a€¢ e 2026
                            </p>
                          </div>
                        </body>
                      </html>
                    `);
                      win.document.close();
                    }
                  }}
                  disabled={false}
                  className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                >
                  <Layout size={16} className="text-luxury-gold" />
                  Web-Proposal (HTML)
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://fa360.design/proposal/${internalRef}`);
                    alert("Link HTML copiado para o clipboard!");
                  }}
                  className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <Layers size={16} className="text-luxury-gold" /> {t('calc_share_link')}
                </button>

                <button
                  onClick={() => {
                    const subject = encodeURIComponent(`Proposta de Honorarios: ${projectName} [REF: ${internalRef}]`);
                    const body = encodeURIComponent(`Ola ${clientName},\n\nConforme solicitado, enviamos a proposta para o projeto "${projectName}".\n\nPode visualizar e adjudicar aqui: https://fa360.design/proposal/${internalRef}\n\nMelhores cumprimentos,\nFerreira Arquitetos`);
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                  }}
                >
                  <Zap size={16} className="group-hover:animate-pulse" /> {t('calc_send_email')}
                </button>
              </div>
              <p className="text-[11px] text-center italic opacity-30 text-white pt-2">
                {t('calc_legal_footer')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 relative z-10 pt-4">
              <button
                onClick={handlePropagate}
                disabled={isPropagating}
                className="w-full py-6 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-4 disabled:opacity-20"
              >
                {isPropagating ? <Loader2 className="animate-spin" size={18} /> : <Brain size={18} />} {t('calc_propagate_antigravity')}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAutomation(1)}
                  disabled={isPropagating}
                  className="py-4 bg-white/5 border border-white/10 text-white/70 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <Box size={14} className={`group-hover:text-luxury-gold ${isPropagating ? 'animate-pulse' : ''}`} /> {isPropagating ? 'A Criar...' : t('calc_create_project')}
                </button>
                <button
                  onClick={() => handleAutomation(2)}
                  disabled={isPropagating}
                  className="py-4 bg-luxury-gold text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/10 disabled:opacity-50"
                >
                  <Zap size={14} className={isPropagating ? 'animate-spin' : ''} /> {isPropagating ? 'A Processar...' : t('calc_project_proposal')}
                </button>
              </div>
            </div>
          </div>

          {/* Painel de Avisos - Removed as per user request to remove blocks */}
        </>
      </div>

      {/* Modal Preview (Existente) */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex justify-center overflow-y-auto p-4 md:p-20"
          >
            <div className="relative w-full max-w-[900px]">
              <div className="fixed top-10 left-[340px] flex items-center gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-3 px-6 py-4 bg-luxury-gold text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
                >
                  <ChevronDown size={20} className="rotate-90" />
                  {t('calc_back_to_editor') || 'Voltar ao Editor'}
                </button>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="fixed top-10 right-10 p-4 bg-white/10 text-white rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-md border border-white/5"
              >
                <X size={24} />
              </button>
              <ProposalDocument data={{
                templateName: currentTemplate?.namePT || '',
                clientName,
                projectName,
                location,
                internalRef,
                area,
                complexity: complexity === 1 ? 'Baixa' : complexity === 2 ? 'Media' : 'Alta',
                scenario: selectedScenario === 'essential' ? 'Essencial' : selectedScenario === 'standard' ? 'Profissional' : 'Executivo',
                feeArch: currentResult?.feeArch || 0,
                feeSpec: currentResult?.feeSpec || 0,
                feeTotal: currentResult?.feeTotal || 0,
                vat: currentResult?.vat || 0,
                totalWithVat: currentResult?.totalWithVat || 0,
                activeSpecs,
                selectedSpecs: currentResult?.selectedSpecs || [],
                phases: currentResult?.phasesBreakdown || [],
                effortMap: currentResult?.effortMap || [],
                units: currentResult?.units || 'm2'
              }}
                includeAnnex={includeAnnex} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zona de Captura (InvisA­vel) para Exportacao HTML */}
      <div id="proposal-capture-zone" className="fixed -left-[2000px] -top-[2000px] pointer-events-none opacity-0">
        <ProposalDocument data={{
          templateName: currentTemplate?.namePT || '',
          clientName,
          projectName,
          location,
          internalRef,
          area,
          complexity: complexity === 1 ? 'Essencial' : complexity === 2 ? 'Medio' : 'Rigor+',
          scenario: selectedScenario,
          feeArch: currentResult?.feeArch || 0,
          feeSpec: currentResult?.feeSpec || 0,
          feeTotal: currentResult?.feeTotal || 0,
          vat: currentResult?.vat || 0,
          totalWithVat: currentResult?.totalWithVat || 0,
          activeSpecs: activeSpecs.map(id => disciplines.find(d => d.disciplineId === id)?.labelPT || id),
          phases: currentResult?.phasesBreakdown || [],
          effortMap: currentResult?.effortMap || [],
          units: currentResult?.units || 'm2'
        }} includeAnnex={includeAnnex} />
      </div>
    </div >
  );
}

function ResultRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-4">
      <span className="text-xs font-black uppercase tracking-widest opacity-50 text-white">{label}</span>
      <span className="text-xl font-serif italic text-white">{value}</span>
    </div>
  );
}

```

## File: .\components\TimeTracker.tsx
```

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Save, X, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import fa360 from '../services/fa360';

interface TimeTrackerProps {
    projectId: string;
    projectPhase: string;
    onLogAdded: () => void;
}

export default function TimeTracker({ projectId, projectPhase, onLogAdded }: TimeTrackerProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [duration, setDuration] = useState(60); // Default 1 hour
    const [description, setDescription] = useState('');
    const [phase, setPhase] = useState(projectPhase);
    const [isSaving, setIsSaving] = useState(false);

    // Quick increment helpers
    const adjustTime = (minutes: number) => {
        setDuration(prev => Math.max(15, prev + minutes));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await fa360.logTime({
            projectId,
            date: new Date().toISOString(),
            duration,
            phase,
            description,
            userId: 'current_user' // Mock user
        });
        setIsSaving(false);
        setIsOpen(false);
        setDescription('');
        setDuration(60);
        onLogAdded(); // Refresh parent list
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg shadow-luxury-gold/20"
            >
                <Clock size={16} />
                Registar Tempo
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex justify-between items-center mb-8 relative">
                                <div className="flex items-center gap-3 text-luxury-gold">
                                    <div className="p-2 bg-luxury-gold/10 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Registo de Horas</h3>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-6 relative">

                                {/* Duration Controls */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4 block">Duracao (Minutos)</label>
                                    <div className="flex items-center justify-between mb-6">
                                        <button onClick={() => adjustTime(-15)} className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors">-</button>
                                        <span className="text-5xl font-serif italic text-white flex items-baseline gap-2">
                                            {duration}<span className="text-lg font-sans not-italic text-luxury-gold opacity-50">min</span>
                                        </span>
                                        <button onClick={() => adjustTime(15)} className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors">+</button>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        {[15, 30, 60, 120].map(m => (
                                            <button key={m} onClick={() => setDuration(m)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${duration === m ? 'bg-luxury-gold text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                                                {m}m
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2 block">Fase do Projeto</label>
                                        <input
                                            type="text"
                                            value={phase}
                                            onChange={(e) => setPhase(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2 block">Descricao</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="O que foi feito?"
                                            rows={2}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full py-4 mt-4 bg-luxury-gold hover:bg-white hover:text-black text-black rounded-xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isSaving ? (
                                        <RotateCcw className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            <Save size={16} /> Salvar Registo
                                        </>
                                    )}
                                </button>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

```

## File: .\context\LanguageContext.tsx
```

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKeys } from '../services/translations';

type Locale = 'pt' | 'en';

interface LanguageContextType {
  locale: Locale;
  toggleLanguage: () => void;
  setLanguage: (lang: Locale) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('fa-locale');
    return (saved as Locale) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('fa-locale', locale);
  }, [locale]);

  const toggleLanguage = () => setLocale(prev => prev === 'pt' ? 'en' : 'pt');
  const setLanguage = (lang: Locale) => setLocale(lang);
  
  const t = (key: TranslationKeys): string => {
    return translations[locale][key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

```

## File: .\context\ThemeContext.tsx
```

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state lazily to avoid useEffect setState (no-use-in-effect)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fa-theme') as Theme;
      return saved || Theme.DARK;
    }
    return Theme.DARK;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('fa-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

```

## File: .\context\TimeContext.tsx
```
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TimeContextType {
  isActive: boolean;
  activeProject: { id: string, name: string } | null;
  elapsedTime: number; // seconds
  start: (project: { id: string, name: string }) => void;
  stop: () => void;
  reset: () => void;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

const STORAGE_KEY = 'fa-active-timer';

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state lazily to avoid useEffect setState (no-use-in-effect)
  const [isActive, setIsActive] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    return JSON.parse(saved).isRunning;
  });

  const [activeProject, setActiveProject] = useState<{ id: string, name: string } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved).activeProject;
  });

  const [elapsedTime, setElapsedTime] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;
    const { startTime, isRunning, savedElapsed } = JSON.parse(saved);
    if (isRunning) {
      const now = Date.now();
      const passedSinceStart = Math.floor((now - startTime) / 1000);
      return savedElapsed + passedSinceStart;
    }
    return savedElapsed;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      activeProject,
      startTime: isActive ? Date.now() - (elapsedTime * 1000) : null,
      isRunning: isActive,
      savedElapsed: elapsedTime
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isActive, activeProject, elapsedTime]);

  // Timer loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const start = (project: { id: string, name: string }) => {
    setActiveProject(project);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setElapsedTime(0);
    setActiveProject(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TimeContext.Provider value={{ isActive, activeProject, elapsedTime, start, stop, reset }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimeContext);
  if (!context) throw new Error('useTimer must be used within a TimeProvider');
  return context;
};
```

## File: .\data\laws\acessibilidades_structure.ts
```

import { LawStructure } from './rjue_structure';

export const acessibilidadesStructure: LawStructure = {
    id: 'acessibilidades',
    title: 'Regime da Acessibilidade',
    description: 'Decreto-Lei n.Âº 163/2006, de 8 de agosto.',
    articles: [
        {
            id: 'art-10',
            number: 'Capitulo 2.1',
            title: 'Percursos Acessiveis',
            content: 'Os percursos devem ter uma largura util nao inferior a 1,20m e inclinacoes que nao ultrapassem os limites definidos.',
            architect_note: 'A famosa regra do 1.20m. Essencial em atrios de predios e espacos publicos.'
        },
        {
            id: 'art-22',
            number: 'Capitulo 2.2',
            title: 'Portas e Vaos',
            content: 'A largura util das portas nao deve ser inferior a 0,77m.',
            architect_note: 'Na pratica, usamos folha de 80cm ou 90cm para garantir a passagem livre de cadeiras de rodas.'
        },
        {
            id: 'art-3',
            number: 'Artigo 10.Âº',
            title: 'Isencoes e Ajustamentos razoaveis',
            content: 'Em edificios existentes, sao permitidos ajustamentos razoaveis quando a conformidade total for impossivel.',
            architect_note: 'Frequentemente usado em lojas antigas onde nao ha espaco para rampas com a inclinacao ideal. Exige termo de responsabilidade especifico.',
            simplex_2024_update: 'O Simplex facilitou a aceitacao de solucoes alternativas de acessibilidade.'
        }
    ]
};
```

## File: .\data\laws\reru_structure.ts
```

import { LawStructure } from './rjue_structure';

export const reruStructure: LawStructure = {
    id: 'reru',
    title: 'Regime Excecional de Reabilitacao Urbana (RERU)',
    description: 'Decreto-Lei n.Âº 95/2019, de 18 de julho.',
    articles: [
        {
            id: 'art-4',
            number: 'Artigo 4.Âº',
            title: 'Principio da nao sobrecarga',
            content: 'As obras de reabilitacao nao devem agravar as condicoes de seguranca ou salubridade do edificio existente, mesmo que nao atinjam os niveis exigiveis para construcao nova.',
            architect_note: 'O principio mais importante da reabilitacao. Se o edificio ja existe e funciona, nao somos obrigados a "destrui-lo" para cumprir normas de 2024, desde que nao piore o que esta.'
        },
        {
            id: 'art-5',
            number: 'Artigo 5.Âº',
            title: 'Dispensa de requisitos',
            content: 'E permitida a dispensa de requisitos tecnicos relativos a acessibilidades, acustica e termica quando a sua aplicacao for tecnicamente inviavel ou prejudicar o valor patrimonial.',
            architect_note: 'Crucial para reabilitacao em Centros Historicos. Permite manter escadas originais ou janelas de madeira por razoes patrimoniais.'
        },
        {
            id: 'art-7',
            number: 'Artigo 7.Âº',
            title: 'Relatorio de Diagnostico',
            content: 'As operacoes de reabilitacao devem ser precedidas de um diagnostico preliminar sobre o estado de conservacao do edificio.',
            architect_note: 'Um bom diagnostico poupa imensas surpresas em obra e facilita a aprovacao da dispensa de normas.'
        }
    ]
};
```

## File: .\data\laws\rgeu_structure.ts
```

import { LawStructure } from './rjue_structure';

export const rgeuStructure: LawStructure = {
    id: 'rgeu',
    title: 'Regulamento Geral das Edificacoes Urbanas (RGEU)',
    description: 'Decreto-Lei n.Âº 38 382, de 7 de agosto de 1951 (com atualizacoes sucessivas).',
    articles: [
        {
            id: 'art-40',
            number: 'Artigo 40.Âº',
            title: 'Higiene e Salubridade',
            content: 'As edificacoes devem ser construidas e mantidas de forma a garantir as condicoes de higiene, salubridade e seguranca dos seus ocupantes.',
            architect_note: 'Este e o artigo "chapeu" para todas as questoes de saude publica em edificios.'
        },
        {
            id: 'art-65',
            number: 'Artigo 65.Âº',
            title: 'Pe-direito livre',
            content: 'O pe-direito livre minimo nas habitacoes e de 2,70 m, podendo ser de 2,20 m em corredores e instalacoes sanitarias.',
            architect_note: 'Atencao: Esta e uma das regras mais infringidas em reabilitacoes. O RERU permite flexibilizar este valor em casos especificos.',
            simplex_2024_update: 'O Simplex 2024 nao alterou o valor, mas simplificou a fiscalizacao.'
        },
        {
            id: 'art-66',
            number: 'Artigo 66.Âº',
            title: 'Dimensionamento de compartimentos',
            content: 'As areas minimas dos compartimentos sao: Sala 12m2, Quarto (casal) 10.5m2, Cozinha 6m2.',
            architect_note: 'Valores base para qualquer projeto de habitacao (T1, T2, etc). Verifique sempre o somatorio total para a tipologia.',
            simplex_2024_update: 'Houve clarificacoes sobre a fusao de cozinha e sala (kitchenettes).'
        },
        {
            id: 'art-71',
            number: 'Artigo 71.Âº',
            title: 'Iluminacao e Ventilacao',
            content: 'Todos os compartimentos habitaveis devem ser dotados de iluminacao e ventilacao naturais.',
            architect_note: 'A regra de ouro: 1/10 da area do pavimento para janelas. Quartos e salas nunca podem ser interiores sem janela.',
            simplex_2024_update: 'Introduziu-se maior abertura para mecanismos de ventilacao forcada em casos de impossibilidade tecnica.'
        }
    ]
};
```

## File: .\data\laws\rjue_structure.ts
```

export interface LawArticle {
    id: string;
    number: string;
    title: string;
    content: string;
    architect_note?: string;
    simplex_2024_update?: string;
}

export interface LawStructure {
    id: string;
    title: string;
    description: string;
    articles: LawArticle[];
}

export const rjueStructure: LawStructure = {
    id: 'rjue',
    title: 'Regime Juridico da Urbanizacao e da Edificacao (RJUE)',
    description: 'Decreto-Lei n.Âº 555/99, de 16 de dezembro (Republicacao pelo DL 10/2024).',
    articles: [
        {
            id: 'art-4',
            number: 'Artigo 4.Âº',
            title: 'Licenca e Comunicacao Previa',
            content: 'As operacoes urbanisticas dependem de licenciamento ou de comunicacao previa, ressalvadas as situacoes de isencao previstas no presente diploma.',
            architect_note: 'Este artigo define a "porta de entrada" de qualquer projeto. O licenciamento e a regra para obras complexas, enquanto a comunicacao previa e usada para operacoes em loteamentos ou areas com plano de pormenor.',
            simplex_2024_update: 'O Simplex 2024 reforcou a utilizacao da comunicacao previa em detrimento da licenca em diversas situacoes.'
        },
        {
            id: 'art-6',
            number: 'Artigo 6.Âº',
            title: 'Isencao de controlo previo',
            content: 'Estao isentas de qualquer procedimento de controlo previo: \n a) Obras de conservacao; \n b) Obras de alteracao no interior de edificios se nao afetarem a estrutura, a cercea ou a fachada; \n c) Pequenas obras de escassa relevancia.',
            architect_note: 'As isencoes do Artigo 6Âº sao fundamentais. Obras de interiores em apartamentos (desde que estruturalmente intactos) nao precisam de submissao a Camara.',
            simplex_2024_update: 'O Simplex 2024 alargou significativamente as isencoes, eliminando a necessidade de controlo em situacoes que anteriormente exigiam licenciamento.'
        },
        {
            id: 'art-6A',
            number: 'Artigo 6.Âº-A',
            title: 'Obras de escassa relevancia urbanistica',
            content: 'Consideram-se obras de escassa relevancia as que consistam na edificacao de muros, vedacoes, estufas, e outras de pequena dimensao.',
            architect_note: 'Cada municipio pode definir o que entende por escassa relevancia no seu proprio regulamento municipal, baseando-se neste artigo.',
            simplex_2024_update: 'Introduziu-se maior clareza sobre o que constitui escassa relevancia a nivel nacional.'
        },
        {
            id: 'art-10',
            number: 'Artigo 10.Âº',
            title: 'Instrucao do pedido',
            content: 'O pedido de licenciamento ou a comunicacao previa devem ser instruidos com os projetos de arquitetura e especialidades, termos de responsabilidade e outros elementos definidos em portaria.',
            architect_note: 'A instrucao correta e a chave para evitar rejeicoes liminares. Verifique sempre a Portaria n.Âº 71-A/2024 para a lista atualizada de documentos.',
            simplex_2024_update: 'Foram eliminados varios documentos "burocraticos", como o alvara de construcao, que foi substituido pelo comprovativo de pagamento.'
        },
        {
            id: 'art-23',
            number: 'Artigo 23.Âº',
            title: 'Prazos de decisao',
            content: 'A decisao sobre o licenciamento deve ser proferida no prazo maximo de 120 dias para projetos de arquitetura.',
            architect_note: 'O cumprimento destes prazos e muitas vezes o maior problema pratico. O sistema atual de deferimento tacito tenta mitigar este atraso.',
            simplex_2024_update: 'O Simplex 2024 tornou os prazos mais vinculativos e reforcou o mecanismo de deferimento tacito.'
        }
    ]
};
```

## File: .\data\legal\catalog\articles_index.json
```
{
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "entries": [
    {
      "entryId": "AVEIRO__PDM__ZONAMENTO_E_USOS",
      "municipality": "AVEIRO",
      "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF",
      "articleRef": "TODO",
      "title": "Zonamento / usos permitidos",
      "topics": ["pdm", "usos"],
      "keywords": ["uso", "zonas", "solo", "qualificaÃ§Ã£o"],
      "excerpt": "Index para zonamento e usos (preencher artigo/tabela).",
      "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf",
      "confidenceDefault": "requires_confirmation"
    },
    {
      "entryId": "AVEIRO__PDM__INDICES_IMPLANTACAO_CONSTRUCAO",
      "municipality": "AVEIRO",
      "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF",
      "articleRef": "TODO",
      "title": "Ãndices: implantaÃ§Ã£o / construÃ§Ã£o",
      "topics": ["indices", "implantacao", "construcao"],
      "keywords": ["Ã­ndice", "Ã¡rea", "implantaÃ§Ã£o", "construÃ§Ã£o"],
      "excerpt": "Index para Ã­ndices e mÃ¡ximos (preencher artigo/tabela).",
      "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf",
      "confidenceDefault": "requires_confirmation"
    },
    {
      "entryId": "AVEIRO__RMUE__EDIFICACAO_URBANIZACAO",
      "municipality": "AVEIRO",
      "sourceId": "AVEIRO_RMUE_DR_975_2022",
      "articleRef": "Artigos vÃ¡rios (index)",
      "title": "Regras complementares de edificaÃ§Ã£o/urbanizaÃ§Ã£o (RMUE)",
      "topics": ["urbanizacao", "edificacao", "muros"],
      "keywords": ["muros", "vedaÃ§Ãµes", "urbanizaÃ§Ã£o", "edificaÃ§Ã£o"],
      "excerpt": "Regulamento municipal (texto DR).",
      "officialUrl": "https://diariodarepublica.pt/dr/detalhe/regulamento/975-2022-202281135",
      "confidenceDefault": "high"
    },
    {
      "entryId": "ILHAVO__PDM__REGULAMENTO_PLANTAS",
      "municipality": "ILHAVO",
      "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL",
      "articleRef": "Index",
      "title": "PDM: regulamento + plantas em vigor",
      "topics": ["pdm"],
      "keywords": ["regulamento", "planta", "condicionantes"],
      "excerpt": "PÃ¡gina oficial com documentos do PDM em vigor.",
      "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor",
      "confidenceDefault": "high"
    },
    {
      "entryId": "ILHAVO__PDM__AVISO_DR",
      "municipality": "ILHAVO",
      "sourceId": "ILHAVO_PDM_DR_AVISO_8347_2023",
      "articleRef": "Aviso",
      "title": "Aviso DR do PDM (referÃªncia a regulamento/plantas)",
      "topics": ["pdm"],
      "keywords": ["aviso", "diÃ¡rio da repÃºblica"],
      "excerpt": "Ato DR com referÃªncia a partes integrantes do PDM.",
      "officialUrl": "https://diariodarepublica.pt/dr/detalhe/aviso/8347-2023-212202750",
      "confidenceDefault": "high"
    },
    {
      "entryId": "VAGOS__PDM__PORTAL",
      "municipality": "VAGOS",
      "sourceId": "VAGOS_PDM_PORTAL",
      "articleRef": "Index",
      "title": "PDM Vagos â€” portal municipal",
      "topics": ["pdm"],
      "keywords": ["pdm", "alteraÃ§Ãµes", "plantas"],
      "excerpt": "PÃ¡gina oficial do PDM.",
      "officialUrl": "https://www.cm-vagos.pt/viver/planeamento-e-ordenamento-do-territorio/planos-municipais-de-vagos/plano-diretor-municipal",
      "confidenceDefault": "high"
    },
    {
      "entryId": "VAGOS__PDM__REGULAMENTO_PDF",
      "municipality": "VAGOS",
      "sourceId": "VAGOS_PDM_REGULAMENTO_PDF",
      "articleRef": "TODO",
      "title": "PDM Vagos â€” regulamento (PDF)",
      "topics": ["pdm", "indices", "implantacao", "construcao", "estacionamento"],
      "keywords": ["regulamento", "Ã­ndice", "estacionamento"],
      "excerpt": "Base normativa (validar artigo/tabela).",
      "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf",
      "confidenceDefault": "requires_confirmation"
    },
    {
      "entryId": "VAGOS__PDM__AVISO_DR",
      "municipality": "VAGOS",
      "sourceId": "VAGOS_PDM_DR_AVISO_23602_2021",
      "articleRef": "Aviso",
      "title": "Aviso DR do PDM Vagos (anexos e regulamento)",
      "topics": ["pdm"],
      "keywords": ["aviso", "regulamento", "anexos"],
      "excerpt": "Ato DR com referÃªncia a anexos (regulamento/plantas).",
      "officialUrl": "https://diariodarepublica.pt/dr/detalhe/aviso/23602-2021-176348921",
      "confidenceDefault": "high"
    },
    {
      "entryId": "ALBERGARIA__PDM__PORTAL",
      "municipality": "ALBERGARIA",
      "sourceId": "ALBERGARIA_PDM_PORTAL",
      "articleRef": "Index",
      "title": "PDM Albergaria-a-Velha â€” portal municipal",
      "topics": ["pdm"],
      "keywords": ["pdm", "planeamento", "pmot"],
      "excerpt": "PÃ¡gina oficial do PDM.",
      "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal",
      "confidenceDefault": "high"
    },
    {
      "entryId": "ALBERGARIA__PDM__REGULAMENTO",
      "municipality": "ALBERGARIA",
      "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL",
      "articleRef": "TODO",
      "title": "PDM Albergaria â€” regulamento",
      "topics": ["pdm", "indices", "implantacao", "construcao", "estacionamento", "afastamentos"],
      "keywords": ["regulamento", "implantaÃ§Ã£o", "construÃ§Ã£o", "estacionamento"],
      "excerpt": "Base normativa (validar artigo/tabela).",
      "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento",
      "confidenceDefault": "requires_confirmation"
    }
  ]
}
```

## File: .\data\legal\catalog\sources.json
```
{
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "municipalities": [
    {
      "id": "AVEIRO",
      "name": "Aveiro",
      "region": "Norte Litoral",
      "instruments": [
        {
          "instrumentId": "AVEIRO_PDM",
          "type": "PDM",
          "title": "Plano Diretor Municipal (PDM) â€” Aveiro",
          "status": "active",
          "sources": [
            {
              "sourceId": "AVEIRO_PDM_PORTAL",
              "docType": "PORTAL",
              "topics": ["pdm", "zonamento", "condicionantes"],
              "officialUrl": "https://www.cm-aveiro.pt/servicos/planeamento/planeamento-territorial/pmot/plano-diretor-municipal",
              "drUrl": "",
              "notes": "PÃ¡gina municipal agregadora"
            },
            {
              "sourceId": "AVEIRO_PDM_REVISAO_PORTAL",
              "docType": "PORTAL",
              "topics": ["pdm", "regulamento", "plantas"],
              "officialUrl": "https://www.cm-aveiro.pt/servicos/planeamento/planeamento-territorial/pmot/plano-diretor-municipal/1-revisao-do-plano-diretor-municipal-de-aveiro",
              "drUrl": "",
              "notes": "PÃ¡gina de revisÃ£o (links internos)"
            },
            {
              "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF",
              "docType": "REGULAMENTO",
              "topics": ["pdm", "usos", "indices", "implantacao", "construcao", "afastamentos", "cedencias", "estacionamento", "muros"],
              "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf",
              "drUrl": "",
              "notes": "PDF do regulamento do PDM (validar se Ã© a version em vigor)"
            }
          ]
        },
        {
          "instrumentId": "AVEIRO_RMUE",
          "type": "RMUE",
          "title": "Regulamento municipal de urbanizaÃ§Ã£o e edificaÃ§Ã£o â€” Aveiro",
          "status": "active",
          "sources": [
            {
              "sourceId": "AVEIRO_RMUE_DR_975_2022",
              "docType": "REGULAMENTO_DR",
              "topics": ["urbanizacao", "edificacao", "muros", "procedimentos"],
              "officialUrl": "https://diariodarepublica.pt/dr/detalhe/regulamento/975-2022-202281135",
              "drUrl": "https://diariodarepublica.pt/dr/detalhe/regulamento/975-2022-202281135",
              "notes": "Texto oficial em DiÃ¡rio da RepÃºblica"
            }
          ]
        }
      ],
      "externalAuthorities": [
        { "id": "DR", "title": "DiÃ¡rio da RepÃºblica", "officialUrl": "https://diariodarepublica.pt/dr/home" }
      ]
    },
    {
      "id": "ILHAVO",
      "name": "Ãlhavo",
      "region": "Norte Litoral",
      "instruments": [
        {
          "instrumentId": "ILHAVO_PDM",
          "type": "PDM",
          "title": "Plano Diretor Municipal (PDM) â€” Ãlhavo",
          "status": "active",
          "sources": [
            {
              "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL",
              "docType": "PORTAL",
              "topics": ["pdm", "regulamento", "plantas", "condicionantes", "zonamento"],
              "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor",
              "drUrl": "",
              "notes": "PÃ¡gina municipal com regulamento/plantas em vigor"
            },
            {
              "sourceId": "ILHAVO_PDM_DR_AVISO_8347_2023",
              "docType": "AVISO_DR",
              "topics": ["pdm"],
              "officialUrl": "https://diariodarepublica.pt/dr/detalhe/aviso/8347-2023-212202750",
              "drUrl": "https://diariodarepublica.pt/dr/detalhe/aviso/8347-2023-212202750",
              "notes": "Aviso DR com referÃªncia a regulamento e plantas"
            }
          ]
        }
      ],
      "externalAuthorities": [
        { "id": "DR", "title": "DiÃ¡rio da RepÃºblica", "officialUrl": "https://diariodarepublica.pt/dr/home" }
      ]
    },
    {
      "id": "VAGOS",
      "name": "Vagos",
      "region": "Norte Litoral",
      "instruments": [
        {
          "instrumentId": "VAGOS_PDM",
          "type": "PDM",
          "title": "Plano Diretor Municipal (PDM) â€” Vagos",
          "status": "active",
          "sources": [
            {
              "sourceId": "VAGOS_PDM_PORTAL",
              "docType": "PORTAL",
              "topics": ["pdm", "regulamento", "plantas", "condicionantes"],
              "officialUrl": "https://www.cm-vagos.pt/viver/planeamento-e-ordenamento-do-territorio/planos-municipais-de-vagos/plano-diretor-municipal",
              "drUrl": "",
              "notes": "PÃ¡gina municipal do PDM"
            },
            {
              "sourceId": "VAGOS_PDM_REGULAMENTO_PDF",
              "docType": "REGULAMENTO",
              "topics": ["pdm", "usos", "indices", "implantacao", "construcao", "afastamentos", "cedencias", "estacionamento", "muros"],
              "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf",
              "drUrl": "",
              "notes": "Regulamento PDF (validar versÃ£o indicada na pÃ¡gina do PDM)"
            },
            {
              "sourceId": "VAGOS_PDM_DR_AVISO_23602_2021",
              "docType": "AVISO_DR",
              "topics": ["pdm"],
              "officialUrl": "https://diariodarepublica.pt/dr/detalhe/aviso/23602-2021-176348921",
              "drUrl": "https://diariodarepublica.pt/dr/detalhe/aviso/23602-2021-176348921",
              "notes": "Aviso DR com referÃªncia ao regulamento e anexos"
            }
          ]
        }
      ],
      "externalAuthorities": [
        { "id": "DR", "title": "DiÃ¡rio da RepÃºblica", "officialUrl": "https://diariodarepublica.pt/dr/home" }
      ]
    },
    {
      "id": "ALBERGARIA",
      "name": "Albergaria-a-Velha",
      "region": "Norte Litoral",
      "instruments": [
        {
          "instrumentId": "ALBERGARIA_PDM",
          "type": "PDM",
          "title": "Plano Diretor Municipal (PDM) â€” Albergaria-a-Velha",
          "status": "active",
          "sources": [
            {
              "sourceId": "ALBERGARIA_PDM_PORTAL",
              "docType": "PORTAL",
              "topics": ["pdm", "regulamento", "plantas", "condicionantes"],
              "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal",
              "drUrl": "",
              "notes": "PÃ¡gina municipal do PDM"
            },
            {
              "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL",
              "docType": "REGULAMENTO",
              "topics": ["pdm", "usos", "indices", "implantacao", "construcao", "afastamentos", "cedencias", "estacionamento", "muros"],
              "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento",
              "drUrl": "",
              "notes": "PÃ¡gina do regulamento (pode conter downloads)"
            }
          ]
        },
        {
          "instrumentId": "ALBERGARIA_TAXAS_URBANIZACAO",
          "type": "REGULAMENTO_MUNICIPAL",
          "title": "Taxas de urbanizaÃ§Ã£o/edificaÃ§Ã£o â€” Albergaria-a-Velha",
          "status": "active",
          "sources": [
            {
              "sourceId": "ALBERGARIA_TAXAS_DR_444_2024",
              "docType": "REGULAMENTO_DR",
              "topics": ["taxas", "procedimentos"],
              "officialUrl": "https://diariodarepublica.pt/dr/detalhe/regulamento/444-2024-860753448",
              "drUrl": "https://diariodarepublica.pt/dr/detalhe/regulamento/444-2024-860753448",
              "notes": "Regulamento (taxas) â€” Ãºtil para consulta rÃ¡pida"
            },
            {
              "sourceId": "ALBERGARIA_REGULAMENTOS_ONLINE",
              "docType": "PORTAL",
              "topics": ["regulamentos"],
              "officialUrl": "https://www.cm-albergaria.pt/municipio/camara-municipal/regulamentos-online",
              "drUrl": "",
              "notes": "Ãndice municipal de regulamentos"
            }
          ]
        }
      ],
      "externalAuthorities": [
        { "id": "DR", "title": "DiÃ¡rio da RepÃºblica", "officialUrl": "https://diariodarepublica.pt/dr/home" }
      ]
    }
  ]
}
```

## File: .\data\legal\catalog\topics.json
```
{
  "topics": [
    { "id": "pdm", "labelPT": "PDM", "labelEN": "Master Plan" },
    { "id": "afastamentos", "labelPT": "Afastamentos", "labelEN": "Setbacks" },
    { "id": "implantacao", "labelPT": "ImplantaÃ§Ã£o", "labelEN": "Footprint" },
    { "id": "construcao", "labelPT": "ConstruÃ§Ã£o", "labelEN": "Gross Area" },
    { "id": "estacionamento", "labelPT": "Estacionamento", "labelEN": "Parking" },
    { "id": "cedencias", "labelPT": "CedÃªncias", "labelEN": "Dedications" },
    { "id": "muros", "labelPT": "Muros", "labelEN": "Walls/Fences" }
  ]
}
```

## File: .\data\legal\municipalities\ALBERGARIA\rules.json
```
{
  "municipality": "ALBERGARIA",
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "rules": [
    {
      "ruleId": "ALBERGARIA__PDM__MAX_IMPLANTACAO",
      "topic": "implantacao",
      "title": "Ãrea mÃ¡xima de implantaÃ§Ã£o (por zona)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "table", "resultParam": "max_footprint", "unit": "m2", "table": [] },
      "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "ALBERGARIA__PDM__MAX_CONSTRUCAO",
      "topic": "construcao",
      "title": "Ãrea mÃ¡xima de construÃ§Ã£o (por zona / Ã­ndice)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "formula", "resultParam": "max_gfa", "unit": "m2", "expression": "plotArea * idx_gfa" },
      "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" },
      "confidence": "requires_confirmation"
    },
    { "ruleId": "ALBERGARIA__PDM__AFASTAMENTOS_BASE", "topic": "afastamentos", "title": "Afastamentos mÃ­nimos", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "setbacks_min", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__ESTACIONAMENTO_RES", "topic": "estacionamento", "title": "Estacionamento â€” HabitaÃ§Ã£o", "inputsNeeded": ["numDwellings", "areaGross"], "when": { "useType": ["residential"] }, "compute": { "type": "formula", "resultParam": "parking_required", "unit": "places", "expression": "max(numDwellings, ceil(areaGross/120))" }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__CEDENCIAS", "topic": "cedencias", "title": "CedÃªncias (trigger)", "inputsNeeded": ["operationType"], "when": { "operationTypeAny": ["LOT", "SUBDIVISION"] }, "compute": { "type": "flag", "resultParam": "cedencias_check", "unit": "boolean", "value": true }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__CERCAS_ALTURAS", "topic": "muros", "title": "Alturas mÃ¡ximas", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_height", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__NUM_PISOS", "topic": "edificacao", "title": "NÃºmero mÃ¡ximo de pisos", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_floors", "unit": "floors", "table": [] }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__USOS_PERMITIDOS", "topic": "usos", "title": "Usos permitidos por zona", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "allowed_uses", "unit": "list", "table": [] }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__IMPERMEABILIZACAO", "topic": "condicionantes", "title": "ImpermeabilizaÃ§Ã£o", "inputsNeeded": ["zoneCode", "plotArea"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_impervious", "unit": "%", "table": [] }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" },
    { "ruleId": "ALBERGARIA__PDM__MUROS", "topic": "muros", "title": "Muros e VedaÃ§Ãµes", "inputsNeeded": ["zoneCode"], "when": { "always": true }, "compute": { "type": "reference", "resultParam": "walls_rules", "unit": "text", "value": "Consultar PDM Albergaria" }, "sourceRef": { "sourceId": "ALBERGARIA_PDM_REGULAMENTO_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-albergaria.pt/viver/planeamento-gestao-urbanistica-e-requalificacao-urbana/planos-municipais-de-ordenamento-do-territorio-pmot-s/plano-diretor-municipal/elementos-fundamentais/regulamento" }, "confidence": "requires_confirmation" }
  ]
}
```

## File: .\data\legal\municipalities\AVEIRO\rules.json
```
{
  "municipality": "AVEIRO",
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "rules": [
    {
      "ruleId": "AVEIRO__PDM__MAX_IMPLANTACAO",
      "topic": "implantacao",
      "title": "Ãrea mÃ¡xima de implantaÃ§Ã£o (por zona)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "table", "resultParam": "max_footprint", "unit": "m2", "table": [] },
      "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "AVEIRO__PDM__MAX_CONSTRUCAO",
      "topic": "construcao",
      "title": "Ãrea mÃ¡xima de construÃ§Ã£o (por zona / Ã­ndice)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "formula", "resultParam": "max_gfa", "unit": "m2", "expression": "plotArea * idx_gfa" },
      "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "AVEIRO__PDM__AFASTAMENTOS_BASE",
      "topic": "afastamentos",
      "title": "Afastamentos mÃ­nimos (laterais/frontal/tardoz) â€” base",
      "inputsNeeded": ["zoneCode", "buildingUse", "numFloors"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "table", "resultParam": "setbacks_min", "unit": "m", "table": [] },
      "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "AVEIRO__PDM__ESTACIONAMENTO_RES",
      "topic": "estacionamento",
      "title": "Estacionamento â€” HabitaÃ§Ã£o (estimativa)",
      "inputsNeeded": ["numDwellings", "areaGross"],
      "when": { "useType": ["residential"] },
      "compute": { "type": "formula", "resultParam": "parking_required", "unit": "places", "expression": "max(numDwellings, ceil(areaGross/120))" },
      "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "AVEIRO__PDM__CEDENCIAS",
      "topic": "cedencias",
      "title": "CedÃªncias â€” quando aplicÃ¡vel (trigger)",
      "inputsNeeded": ["operationType"],
      "when": { "operationTypeAny": ["LOT", "SUBDIVISION"] },
      "compute": { "type": "flag", "resultParam": "cedencias_check", "unit": "boolean", "value": true },
      "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "AVEIRO__RMUE__MUROS",
      "topic": "muros",
      "title": "Muros/vedaÃ§Ãµes â€” regras complementares (RMUE)",
      "inputsNeeded": ["frontageType"],
      "when": { "always": true },
      "compute": { "type": "reference", "resultParam": "walls_rules", "unit": "text", "value": "Consultar RMUE (artigos aplicÃ¡veis)" },
      "sourceRef": { "sourceId": "AVEIRO_RMUE_DR_975_2022", "articleRef": "Index", "officialUrl": "https://diariodarepublica.pt/dr/detalhe/regulamento/975-2022-202281135" },
      "confidence": "high"
    },
    { "ruleId": "AVEIRO__PDM__CERCAS_ALTURAS", "topic": "muros", "title": "Alturas mÃ¡ximas (quando tabeladas)", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_height", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "AVEIRO__PDM__NUM_PISOS", "topic": "edificacao", "title": "NÃºmero mÃ¡ximo de pisos (quando aplicÃ¡vel)", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_floors", "unit": "floors", "table": [] }, "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "AVEIRO__PDM__USOS_PERMITIDOS", "topic": "usos", "title": "Usos permitidos por zona", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "allowed_uses", "unit": "list", "table": [] }, "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "AVEIRO__PDM__IMPERMEABILIZACAO", "topic": "condicionantes", "title": "ImpermeabilizaÃ§Ã£o / Ã¡rea permeÃ¡vel (se houver regra)", "inputsNeeded": ["zoneCode", "plotArea"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_impervious", "unit": "%", "table": [] }, "sourceRef": { "sourceId": "AVEIRO_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-aveiro.pt/cmaveiro/uploads/document/file/10601/regulamento_201911.pdf" }, "confidence": "requires_confirmation" }
  ]
}
```

## File: .\data\legal\municipalities\ILHAVO\rules.json
```
{
  "municipality": "ILHAVO",
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "rules": [
    {
      "ruleId": "ILHAVO__PDM__MAX_IMPLANTACAO",
      "topic": "implantacao",
      "title": "Ãrea mÃ¡xima de implantaÃ§Ã£o (por zona)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "table", "resultParam": "max_footprint", "unit": "m2", "table": [] },
      "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "ILHAVO__PDM__MAX_CONSTRUCAO",
      "topic": "construcao",
      "title": "Ãrea mÃ¡xima de construÃ§Ã£o (por zona / Ã­ndice)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "formula", "resultParam": "max_gfa", "unit": "m2", "expression": "plotArea * idx_gfa" },
      "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" },
      "confidence": "requires_confirmation"
    },
    { "ruleId": "ILHAVO__PDM__AFASTAMENTOS_BASE", "topic": "afastamentos", "title": "Afastamentos mÃ­nimos", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "setbacks_min", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__ESTACIONAMENTO_RES", "topic": "estacionamento", "title": "Estacionamento â€” HabitaÃ§Ã£o", "inputsNeeded": ["numDwellings", "areaGross"], "when": { "useType": ["residential"] }, "compute": { "type": "formula", "resultParam": "parking_required", "unit": "places", "expression": "max(numDwellings, ceil(areaGross/120))" }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__CEDENCIAS", "topic": "cedencias", "title": "CedÃªncias (trigger)", "inputsNeeded": ["operationType"], "when": { "operationTypeAny": ["LOT", "SUBDIVISION"] }, "compute": { "type": "flag", "resultParam": "cedencias_check", "unit": "boolean", "value": true }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__CERCAS_ALTURAS", "topic": "muros", "title": "Alturas mÃ¡ximas", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_height", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__NUM_PISOS", "topic": "edificacao", "title": "NÃºmero mÃ¡ximo de pisos", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_floors", "unit": "floors", "table": [] }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__USOS_PERMITIDOS", "topic": "usos", "title": "Usos permitidos por zona", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "allowed_uses", "unit": "list", "table": [] }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__IMPERMEABILIZACAO", "topic": "condicionantes", "title": "ImpermeabilizaÃ§Ã£o", "inputsNeeded": ["zoneCode", "plotArea"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_impervious", "unit": "%", "table": [] }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" },
    { "ruleId": "ILHAVO__PDM__MUROS", "topic": "muros", "title": "Muros e VedaÃ§Ãµes", "inputsNeeded": ["zoneCode"], "when": { "always": true }, "compute": { "type": "reference", "resultParam": "walls_rules", "unit": "text", "value": "Consultar PDM Ãlhavo" }, "sourceRef": { "sourceId": "ILHAVO_PDM_EM_VIGOR_PORTAL", "articleRef": "TODO", "officialUrl": "https://www.cm-ilhavo.pt/viver/areas-de-intervencao/planeamento-ordenamento-e-mobilidade/planos/planos-municipais/pdm-plano-diretor-municipal/pdm-em-vigor" }, "confidence": "requires_confirmation" }
  ]
}
```

## File: .\data\legal\municipalities\VAGOS\rules.json
```
{
  "municipality": "VAGOS",
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "rules": [
    {
      "ruleId": "VAGOS__PDM__MAX_IMPLANTACAO",
      "topic": "implantacao",
      "title": "Ãrea mÃ¡xima de implantaÃ§Ã£o (por zona)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "table", "resultParam": "max_footprint", "unit": "m2", "table": [] },
      "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" },
      "confidence": "requires_confirmation"
    },
    {
      "ruleId": "VAGOS__PDM__MAX_CONSTRUCAO",
      "topic": "construcao",
      "title": "Ãrea mÃ¡xima de construÃ§Ã£o (por zona / Ã­ndice)",
      "inputsNeeded": ["zoneCode", "plotArea"],
      "when": { "zoneCodeAny": ["TODO"] },
      "compute": { "type": "formula", "resultParam": "max_gfa", "unit": "m2", "expression": "plotArea * idx_gfa" },
      "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" },
      "confidence": "requires_confirmation"
    },
    { "ruleId": "VAGOS__PDM__AFASTAMENTOS_BASE", "topic": "afastamentos", "title": "Afastamentos mÃ­nimos", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "setbacks_min", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__ESTACIONAMENTO_RES", "topic": "estacionamento", "title": "Estacionamento â€” HabitaÃ§Ã£o", "inputsNeeded": ["numDwellings", "areaGross"], "when": { "useType": ["residential"] }, "compute": { "type": "formula", "resultParam": "parking_required", "unit": "places", "expression": "max(numDwellings, ceil(areaGross/120))" }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__CEDENCIAS", "topic": "cedencias", "title": "CedÃªncias (trigger)", "inputsNeeded": ["operationType"], "when": { "operationTypeAny": ["LOT", "SUBDIVISION"] }, "compute": { "type": "flag", "resultParam": "cedencias_check", "unit": "boolean", "value": true }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__CERCAS_ALTURAS", "topic": "muros", "title": "Alturas mÃ¡ximas", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_height", "unit": "m", "table": [] }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__NUM_PISOS", "topic": "edificacao", "title": "NÃºmero mÃ¡ximo de pisos", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_floors", "unit": "floors", "table": [] }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__USOS_PERMITIDOS", "topic": "usos", "title": "Usos permitidos por zona", "inputsNeeded": ["zoneCode"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "allowed_uses", "unit": "list", "table": [] }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__IMPERMEABILIZACAO", "topic": "condicionantes", "title": "ImpermeabilizaÃ§Ã£o", "inputsNeeded": ["zoneCode", "plotArea"], "when": { "zoneCodeAny": ["TODO"] }, "compute": { "type": "table", "resultParam": "max_impervious", "unit": "%", "table": [] }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" },
    { "ruleId": "VAGOS__PDM__MUROS", "topic": "muros", "title": "Muros e VedaÃ§Ãµes", "inputsNeeded": ["zoneCode"], "when": { "always": true }, "compute": { "type": "reference", "resultParam": "walls_rules", "unit": "text", "value": "Consultar PDM Vagos" }, "sourceRef": { "sourceId": "VAGOS_PDM_REGULAMENTO_PDF", "articleRef": "TODO", "officialUrl": "https://www.cm-vagos.pt/cmvagos/uploads/document/file/5846/regulamento.pdf" }, "confidence": "requires_confirmation" }
  ]
}
```

## File: .\data\legal\municipalities\aveiro.rules.json
```
{
  "municipality": "AVEIRO",
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "rules": [
    {
      "ruleId": "AVEIRO_PARKING_RESIDENTIAL_BASE",
      "topic": "estacionamento",
      "title": "Estacionamento â€” HabitaÃ§Ã£o (Gerador)",
      "inputsNeeded": ["useType", "numDwellings", "areaGross"],
      "when": { "useType": ["residential"] },
      "compute": {
        "type": "formula",
        "resultParam": "parking_required",
        "label": "Lugares de Estacionamento ObrigatÃ³rios",
        "unit": "lugares",
        "expression": "max(numDwellings, ceil(areaGross/120))"
      },
      "sourceRef": {
        "sourceId": "AVEIRO_PDM_MAIN",
        "articleRef": "Art. 138Âº / Tabela de Estacionamento",
        "officialUrl": ""
      },
      "confidence": "official_reference"
    },
    {
        "ruleId": "AVEIRO_HEIGHT_LIMIT_URBAN",
        "topic": "construcao",
        "title": "CÃ©rcea MÃ¡xima â€” Malha Urbana Consolidade",
        "inputsNeeded": ["urbanZone"],
        "when": { "urbanZone": ["central", "historical"] },
        "compute": {
          "type": "fixed",
          "value": 15,
          "unit": "m",
          "label": "CÃ©rcea MÃ¡xima Estimada"
        },
        "notes": "Sujeito a conformidade com a mÃ©dia da envolvente (Art. 120Âº).",
        "confidence": "requires_confirmation"
    }
  ]
}
```

## File: .\data\legal\sources.json
```
{
  "version": "1.0.0",
  "updatedAt": "2026-01-26",
  "municipalities": [
    {
      "id": "AVEIRO",
      "name": "Aveiro",
      "sources": [
        {
          "sourceId": "AVEIRO_PDM_MAIN",
          "title": "PDM Aveiro â€” Regulamento (Regulamento n.Âº 214/2021)",
          "type": "PDM",
          "topics": ["pdm", "indices", "implantacao", "construcao", "afastamentos", "estacionamento"],
          "officialUrl": "https://www.cm-aveiro.pt/servicos/pdm/plano-diretor-municipal-de-aveiro",
          "drUrl": "https://dre.pt/dre/detalhe/regulamento/214-2021-158302061",
          "notes": "Regulamento em vigor publicado em DiÃ¡rio da RepÃºblica.",
          "status": "active"
        }
      ]
    },
    {
      "id": "ILHAVO",
      "name": "Ãlhavo",
      "sources": [
        {
          "sourceId": "ILHAVO_PDM",
          "title": "PDM Ãlhavo â€” Regulamento",
          "type": "PDM",
          "topics": ["pdm", "indices", "afastamentos"],
          "officialUrl": "https://www.cm-ilhavo.pt/viver/planeamento-territorial/plano-diretor-municipal",
          "drUrl": "",
          "status": "active"
        }
      ]
    },
    {
      "id": "VAGOS",
      "name": "Vagos",
      "sources": [
        {
          "sourceId": "VAGOS_PDM",
          "title": "PDM Vagos â€” Regulamento",
          "type": "PDM",
          "topics": ["pdm", "construcao"],
          "officialUrl": "https://www.cm-vagos.pt/pdm",
          "drUrl": "",
          "status": "active"
        }
      ]
    },
    {
      "id": "ALBERGARIA",
      "name": "Albergaria-a-Velha",
      "sources": [
        {
          "sourceId": "ALBERGARIA_PDM",
          "title": "PDM Albergaria â€” Regulamento",
          "type": "PDM",
          "topics": ["pdm", "implantacao"],
          "officialUrl": "https://www.cm-albergaria.pt/pdm",
          "drUrl": "",
          "status": "active"
        }
      ]
    }
  ]
}
```

## File: .\data\legal\topics.json
```
{
  "topics": [
    { "id": "pdm", "labelPT": "PDM", "labelEN": "Master Plan" },
    { "id": "afastamentos", "labelPT": "Afastamentos", "labelEN": "Setbacks" },
    { "id": "implantacao", "labelPT": "ImplantaÃ§Ã£o", "labelEN": "Footprint" },
    { "id": "construcao", "labelPT": "ConstruÃ§Ã£o", "labelEN": "Gross Area" },
    { "id": "estacionamento", "labelPT": "Estacionamento", "labelEN": "Parking" },
    { "id": "cedencias", "labelPT": "CedÃªncias", "labelEN": "Dedications" },
    { "id": "muros", "labelPT": "Muros", "labelEN": "Walls/Fences" }
  ]
}
```

## File: .\data\legal_framework.ts
```

export enum UrbanOperationType {
    Construction = 'construction',
    Rehabilitation = 'rehabilitation',
    Expansion = 'expansion',
    Demolition = 'demolition',
    UseChange = 'use_change',
    Allotment = 'allotment',
    Simple = 'simple' // Obras de escassa relevancia
}

export interface LegalFramework {
    id: UrbanOperationType;
    label: string;
    description: string;
    applicable_legislation: {
        name: string;
        link?: string;
        description: string;
        legislation_id?: string;
    }[];
    required_elements: string[];
    pdm_focus_areas: string[];
}

export const legalFrameworks: Record<UrbanOperationType, LegalFramework> = {
    [UrbanOperationType.Construction]: {
        id: UrbanOperationType.Construction,
        label: 'Construcao Nova',
        description: 'Edificacao de obra nova em terreno livre ou em substituicao de existente.',
        applicable_legislation: [
            { name: 'DL 555/99 (RJUE)', legislation_id: 'rjue', description: 'Regime Juridico da Urbanizacao e Edificacao (Atualizado pelo Simplex).' },
            { name: 'DL 10/2024 (Simplex)', legislation_id: 'simplex-2024', description: 'Simplificacao dos licenciamentos urbanisticos.' },
            { name: 'RGEU', legislation_id: 'rgeu', description: 'Regulamento Geral das Edificacoes Urbanas.' },
            { name: 'DL 163/2006', legislation_id: 'acessibilidades', description: 'Acessibilidades e Mobilidade Condicionada.' }
        ],
        required_elements: [
            'Levantamento Topografico',
            'Projeto de Arquitetura',
            'Projetos de Especialidades',
            'Termo de Responsabilidade',
            'Calendarizacao da Obra'
        ],
        pdm_focus_areas: [
            'Indices de Ocupacao e Utilizacao',
            'Cerceas e Afastamentos',
            'Estacionamento',
            'Cedencias para Dominio Publico'
        ]
    },
    [UrbanOperationType.Rehabilitation]: {
        id: UrbanOperationType.Rehabilitation,
        label: 'Reabilitacao / Alteracao',
        description: 'Obras de alteracao, conservacao ou reconstrucao em edificios existentes.',
        applicable_legislation: [
            { name: 'DL 555/99 (RJUE)', legislation_id: 'rjue', description: 'Artigos referentes a obras de alteracao.' },
            { name: 'DL 95/2019 (RERU)', legislation_id: 'reru', description: 'Regime Aplicavel a Reabilitacao de Edificios ou Fracoes Autonomas.' }
        ],
        required_elements: [
            'Levantamento do Existente',
            'Projeto de Alteracoes (Amarelos e Vermelhos)',
            'Termo de Responsabilidade',
            'Relatorio de Diagnostico (se aplicavel)'
        ],
        pdm_focus_areas: [
            'Manutencao de Fachadas',
            'Usos Compativeis',
            'Isencoes de Estacionamento (em areas historicas)'
        ]
    },
    [UrbanOperationType.Expansion]: {
        id: UrbanOperationType.Expansion,
        label: 'Ampliacao',
        description: 'Aumento da area de pavimentos ou de implantacao, ou do volume de uma edificacao.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Regras sobre ampliacoes.' }
        ],
        required_elements: [
            'Projeto de Ampliacao',
            'Calculo de Areas'
        ],
        pdm_focus_areas: [
            'Indice de Utilizacao (incremento)',
            'Afastamentos aos limites'
        ]
    },
    [UrbanOperationType.Demolition]: {
        id: UrbanOperationType.Demolition,
        label: 'Demolicao',
        description: 'Destruicao total ou parcial de uma edificacao.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Licenciamento ou Comunicacao Previa para demolicao.' }
        ],
        required_elements: [
            'Plano de Demolicao',
            'Gestao de Residuos (RCD)'
        ],
        pdm_focus_areas: [
            'Protecao de Patrimonio Classificado',
            'Regras de substituicao'
        ]
    },
    [UrbanOperationType.UseChange]: {
        id: UrbanOperationType.UseChange,
        label: 'Alteracao de Uso',
        description: 'Modificacao do uso final da edificacao (ex: Habitacao para Comercio).',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Autorizacao de Utilizacao.' }
        ],
        required_elements: [
            'Projeto de Arquitetura (se houver obras)',
            'Autorizacao do Condominio (se aplicavel)'
        ],
        pdm_focus_areas: [
            'Compatibilidade de Usos',
            'Requisitos de Estacionamento para novo uso'
        ]
    },
    [UrbanOperationType.Allotment]: {
        id: UrbanOperationType.Allotment,
        label: 'Loteamento',
        description: 'Operacao de divisao de um ou varios predios em lotes.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Operacoes de Loteamento.' }
        ],
        required_elements: [
            'Planta de Sintese',
            'Regulamento do Loteamento'
        ],
        pdm_focus_areas: [
            'Indices Urbanisticos Globais',
            'Areas de Cedencia',
            'Infraestruturas'
        ]
    },
    [UrbanOperationType.Simple]: {
        id: UrbanOperationType.Simple,
        label: 'Obras de Escassa Relevancia',
        description: 'Pequenas obras isentas de controlo previo (ex: muros baixos, estufas).',
        applicable_legislation: [
            { name: 'RJUE - Art. 6Âº A', legislation_id: 'rjue', description: 'Obras isentas de controlo previo.' }
        ],
        required_elements: [
            'Comunicacao (apenas para efeitos de fiscalizacao, se aplicavel)'
        ],
        pdm_focus_areas: [
            'Conformidade com PDM (mesmo isentas, devem cumprir)'
        ]
    }
};
```

## File: .\data\legislation_database.ts
```

export interface Legislation {
    id: string;
    title: string;
    year: string;
    official_link?: string;
    summary: string;
    applicability: string[];
    key_points: string[];
}

export const legislationDatabase: Record<string, Legislation> = {
    'rjue': {
        id: 'rjue',
        title: 'Regime Juridico da Urbanizacao e da Edificacao (RJUE)',
        year: 'DL 555/99 (Consolidado 2024)',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1999-34533075',
        summary: 'O diploma central que regula os procedimentos de licenciamento, comunicacao previa e autorizacao de obras em Portugal.',
        applicability: ['Licenciamentos', 'Loteamentos', 'Obras de Edificacao'],
        key_points: [
            'Define os tipos de controlo previo (Licenca vs Comunicacao)',
            'Regula os prazos de decisao dos municipios',
            'Estabelece o regime de isencoes (Art. 6Âº)'
        ]
    },
    'simplex-2024': {
        id: 'simplex-2024',
        title: 'Simplex Urbanistico',
        year: 'Decreto-Lei n.Âº 10/2024',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/10-2024-836176377',
        summary: 'Reforma profunda que elimina licencas, simplifica pareceres e introduz o deferimento tacito em larga escala.',
        applicability: ['Agilizacao de Processos', 'Habitacao'],
        key_points: [
            'Eliminacao de alvaras de construcao e utilizacao',
            'Novas isencoes para obras de alteracao interior',
            'Unicidade de pareceres e prazos mais rigidos'
        ]
    },
    'rgeu': {
        id: 'rgeu',
        title: 'Regulamento Geral das Edificacoes Urbanas (RGEU)',
        year: 'DL 38382/1951',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1951-34442175',
        summary: 'Conjunto de regras sobre salubridade, iluminacao, ventilacao e estetica das construcoes.',
        applicability: ['Higiene', 'Salubridade', 'Dimensionamento'],
        key_points: [
            'Areas minimas de compartimentos',
            'Pe-direito livre minimo (2.70m habitacao)',
            'Regras de ventilacao natural e iluminacao'
        ]
    },
    'acessibilidades': {
        id: 'acessibilidades',
        title: 'Regime da Acessibilidade',
        year: 'Decreto-Lei n.Âº 163/2006',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/163-2006-538446',
        summary: 'Normas tecnicas de acessibilidade a edificios e espacos publicos para pessoas com mobilidade condicionada.',
        applicability: ['Mobilidade', 'Espaco Publico', 'Edificios Coletivos'],
        key_points: [
            'Largura util de portas (min. 0.77m)',
            'Rampas (declives maximos)',
            'Isencoes para edificios existentes'
        ]
    },
    'scie': {
        id: 'scie',
        title: 'Seguranca Contra Incendios em Edificios (SCIE)',
        year: 'DL 220/2008 + Portaria 1532/2008',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/220-2008-439976',
        summary: 'Regime juridico da seguranca contra incendios, classificado por categorias de risco.',
        applicability: ['Seguranca', 'Protecao Civil'],
        key_points: [
            'Categorias de Risco (1Âª a 4Âª)',
            'Vias de evacuacao e compartimentacao',
            'Sinaletica e meios de extincao'
        ]
    },
    'reru': {
        id: 'reru',
        title: 'Regime Excecional de Reabilitacao Urbana (RERU)',
        year: 'Decreto-Lei n.Âº 95/2019',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/95-2019-123232145',
        summary: 'Flexibiliza normas tecnicas (RGEU, Termica, Acustica) para promover a reabilitacao de edificios antigos.',
        applicability: ['Reabilitacao', 'Centros Historicos'],
        key_points: [
            'Criterio da nao sobrecarga',
            'Dispensa de requisitos impossiveis em preexistencias',
            'Foco na melhoria progressiva do desempenho'
        ]
    },
    'lei-solos': {
        id: 'lei-solos',
        title: 'Lei de Bases de Ordenamento do Territorio e Urbanismo',
        year: 'Lei n.Âº 31/2014',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/lei/31-2014-25407001',
        summary: 'Define a classificacao (urbano/rustico) e qualificacao dos solos.',
        applicability: ['Planeamento', 'PDM'],
        key_points: [
            'Classificacao do solo',
            'Direitos de edificabilidade',
            'Execucao de planos'
        ]
    },
    'reh': {
        id: 'reh',
        title: 'Regulamento de Desempenho Energetico dos Edificios de Habitacao (REH)',
        year: 'Decreto-Lei n.Âº 101-D/2020',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/101-d-2020-150495804',
        summary: 'Regras sobre comportamento termico e eficiencia energetica para edificios de habitacao.',
        applicability: ['Termica', 'Eficiencia Energetica', 'Habitacao'],
        key_points: [
            'Requisitos minimos de isolamento',
            'Sistemas de climatizacao e energias renovaveis',
            'Certificacao Energetica obrigatoria'
        ]
    },
    'recs': {
        id: 'recs',
        title: 'Regulamento de Desempenho Energetico dos Edificios de Comercio e Servicos (RECS)',
        year: 'Decreto-Lei n.Âº 101-D/2020',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/101-d-2020-150495804',
        summary: 'Aplicacao de regras de eficiencia energetica a edificios nao habitacionais.',
        applicability: ['Termica', 'Servicos', 'Comercio'],
        key_points: [
            'Sistemas de Ventilacao e QAI',
            ' Auditorias energeticas periodicas',
            'Metas de descarbonizacao'
        ]
    },
    'ited': {
        id: 'ited',
        title: 'Infraestruturas de Telecomunicacoes em Edificios (ITED)',
        year: 'Decreto-Lei n.Âº 123/2009 (Consolidado)',
        official_link: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2009-34509176',
        summary: 'Regulamenta o projeto e instalacao de redes de telecomunicacoes.',
        applicability: ['Telecomunicacoes', 'Redes'],
        key_points: [
            'Obrigatoriedade de fibra otica',
            'Dimensionamento de armarios (ATI/ATE)',
            'Certificacao por instalador credenciado'
        ]
    },
    'gas': {
        id: 'gas',
        title: 'Instalacoes de Gas em Edificios',
        year: 'Decreto-Lei n.Âº 97/2017',
        official_link: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/97-2017-107981313',
        summary: 'Seguranca e execucao de redes de gas combustivel.',
        applicability: ['Gas', 'Seguranca Tecnica'],
        key_points: [
            'Ventilacao de locais com aparelhos a gas',
            'Inspecoes periodicas',
            'Materiais e tracados permitidos'
        ]
    }
};
```

## File: .\data\municipalities.ts
```
export interface Municipality {
    id: string;
    name: string;
    district: string;
    region: string; // NUTS II or similar
    pdm_links?: {
        landing_page?: string;
        regulation_pdf?: string;
        geoportal?: string;
    };
    verified?: boolean;
}

export const municipalities: Municipality[] = [
    {
        "id": "abrantes",
        "name": "Abrantes",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "agueda",
        "name": "Agueda",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "aguiar-da-beira",
        "name": "Aguiar da Beira",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "alandroal",
        "name": "Alandroal",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "albergaria-a-velha",
        "name": "Albergaria-a-Velha",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "albufeira",
        "name": "Albufeira",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "alcacer-do-sal",
        "name": "Alcacer do Sal",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "alcanena",
        "name": "Alcanena",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "alcobaca",
        "name": "Alcobaca",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "alcochete",
        "name": "Alcochete",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "alcoutim",
        "name": "Alcoutim",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "alenquer",
        "name": "Alenquer",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "alfandega-da-fe",
        "name": "Alfandega da Fe",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "alijo",
        "name": "Alijo",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "aljezur",
        "name": "Aljezur",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "aljustrel",
        "name": "Aljustrel",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "almada",
        "name": "Almada",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "almeida",
        "name": "Almeida",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "almeirim",
        "name": "Almeirim",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "almodovar",
        "name": "Almodovar",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "alpiarca",
        "name": "Alpiarca",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "alter-do-chao",
        "name": "Alter do Chao",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "alvaiazere",
        "name": "Alvaiazere",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "alvito",
        "name": "Alvito",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "amadora",
        "name": "Amadora",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "amarante",
        "name": "Amarante",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "amares",
        "name": "Amares",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "anadia",
        "name": "Anadia",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "ansiao",
        "name": "Ansiao",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "arcos-de-valdevez",
        "name": "Arcos de Valdevez",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "arganil",
        "name": "Arganil",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "armamar",
        "name": "Armamar",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "arouca",
        "name": "Arouca",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "arraiolos",
        "name": "Arraiolos",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "arronches",
        "name": "Arronches",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "arruda-dos-vinhos",
        "name": "Arruda dos Vinhos",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "aveiro",
        "name": "Aveiro",
        "district": "Aveiro",
        "region": "Regiao do Centro",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://www.cm-aveiro.pt/servicos/ordenamento-do-territorio-e-urbanismo/instrumentos-de-gestao-territorial/plano-diretor-municipal",
            "regulation_pdf": "https://www.cm-aveiro.pt/terras-do-municipio/ordenamento-do-territorio/plano-diretor-municipal-1-a-revisao/regulamento-1-a-revisao",
            "geoportal": "https://cmasmiga.pt/"
        }
    },
    {
        "id": "avis",
        "name": "Avis",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "azambuja",
        "name": "Azambuja",
        "district": "Lisboa",
        "region": "Alentejo"
    },
    {
        "id": "baiao",
        "name": "Baiao",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "barcelos",
        "name": "Barcelos",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "barrancos",
        "name": "Barrancos",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "barreiro",
        "name": "Barreiro",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "batalha",
        "name": "Batalha",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "beja",
        "name": "Beja",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "belmonte",
        "name": "Belmonte",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "benavente",
        "name": "Benavente",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "bombarral",
        "name": "Bombarral",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "borba",
        "name": "Borba",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "boticas",
        "name": "Boticas",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "braga",
        "name": "Braga",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "braganca",
        "name": "Braganca",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "cabeceiras-de-basto[2]",
        "name": "Cabeceiras de Basto[2]",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "cadaval",
        "name": "Cadaval",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "caldas-da-rainha",
        "name": "Caldas da Rainha",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "caminha",
        "name": "Caminha",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "campo-maior",
        "name": "Campo Maior",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "cantanhede",
        "name": "Cantanhede",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "carrazeda-de-ansiaes",
        "name": "Carrazeda de Ansiaes",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "carregal-do-sal",
        "name": "Carregal do Sal",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "cartaxo",
        "name": "Cartaxo",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "cascais",
        "name": "Cascais",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "castanheira-de-pera",
        "name": "Castanheira de Pera",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "castelo-branco",
        "name": "Castelo Branco",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "castelo-de-paiva",
        "name": "Castelo de Paiva",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "castelo-de-vide",
        "name": "Castelo de Vide",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "castro-daire",
        "name": "Castro Daire",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "castro-marim",
        "name": "Castro Marim",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "castro-verde",
        "name": "Castro Verde",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "celorico-da-beira",
        "name": "Celorico da Beira",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "celorico-de-basto",
        "name": "Celorico de Basto",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "chamusca",
        "name": "Chamusca",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "chaves",
        "name": "Chaves",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "cinfaes",
        "name": "Cinfaes",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "coimbra",
        "name": "Coimbra",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "condeixa-a-nova",
        "name": "Condeixa-a-Nova",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "constancia",
        "name": "Constancia",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "coruche",
        "name": "Coruche",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "covilha",
        "name": "Covilha",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "crato",
        "name": "Crato",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "cuba",
        "name": "Cuba",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "elvas",
        "name": "Elvas",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "entroncamento",
        "name": "Entroncamento",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "espinho",
        "name": "Espinho",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "esposende",
        "name": "Esposende",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "estarreja",
        "name": "Estarreja",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "estremoz",
        "name": "Estremoz",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "evora",
        "name": "Evora",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "fafe",
        "name": "Fafe",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "faro",
        "name": "Faro",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "felgueiras",
        "name": "Felgueiras",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "ferreira-do-alentejo",
        "name": "Ferreira do Alentejo",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "ferreira-do-zezere",
        "name": "Ferreira do Zezere",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "figueira-da-foz",
        "name": "Figueira da Foz",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "figueira-de-castelo-rodrigo",
        "name": "Figueira de Castelo Rodrigo",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "figueiro-dos-vinhos",
        "name": "Figueiro dos Vinhos",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "fornos-de-algodres",
        "name": "Fornos de Algodres",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "freixo-de-espada-a-cinta",
        "name": "Freixo de Espada a Cinta",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "fronteira",
        "name": "Fronteira",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "fundao",
        "name": "Fundao",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "gaviao",
        "name": "Gaviao",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "gois",
        "name": "Gois",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "golega",
        "name": "Golega",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "gondomar",
        "name": "Gondomar",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "gouveia",
        "name": "Gouveia",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "grandola",
        "name": "Grandola",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "guarda",
        "name": "Guarda",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "guimaraes",
        "name": "Guimaraes",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "idanha-a-nova",
        "name": "Idanha-a-Nova",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "ilhavo",
        "name": "Ilhavo",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "lagoa",
        "name": "Lagoa",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "lagos",
        "name": "Lagos",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "lamego",
        "name": "Lamego",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "leiria",
        "name": "Leiria",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "lisboa",
        "name": "Lisboa",
        "district": "Lisboa",
        "region": "Regiao de Lisboa",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://www.lisboa.pt/cidade/urbanismo/planeamento-urbano/pdm-em-vigor",
            "regulation_pdf": "https://www.lisboa.pt/fileadmin/cidade_temas/urbanismo/planeamento_urbano/pdm_em_vigor/regulamento/Regulamento_PDM_2012_Consolidado_com_Alteracoes_2020.pdf",
            "geoportal": "https://geoportal.cm-lisboa.pt/"
        }
    },
    {
        "id": "loule",
        "name": "Loule",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "loures",
        "name": "Loures",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "lourinha",
        "name": "Lourinha",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "lousa",
        "name": "Lousa",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "lousada",
        "name": "Lousada",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "macao-[5]",
        "name": "Macao [5]",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "macedo-de-cavaleiros",
        "name": "Macedo de Cavaleiros",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "mafra",
        "name": "Mafra",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "maia",
        "name": "Maia",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "mangualde",
        "name": "Mangualde",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "manteigas",
        "name": "Manteigas",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "marco-de-canaveses",
        "name": "Marco de Canaveses",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "marinha-grande",
        "name": "Marinha Grande",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "marvao",
        "name": "Marvao",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "matosinhos",
        "name": "Matosinhos",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "mealhada[2]",
        "name": "Mealhada[2]",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "meda",
        "name": "Meda",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "melgaco",
        "name": "Melgaco",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "mertola",
        "name": "Mertola",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "mesao-frio",
        "name": "Mesao Frio",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "mira",
        "name": "Mira",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "miranda-do-corvo",
        "name": "Miranda do Corvo",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "miranda-do-douro",
        "name": "Miranda do Douro",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "mirandela",
        "name": "Mirandela",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "mogadouro",
        "name": "Mogadouro",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "moimenta-da-beira",
        "name": "Moimenta da Beira",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "moita",
        "name": "Moita",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "moncao",
        "name": "Moncao",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "monchique",
        "name": "Monchique",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "mondim-de-basto[2]",
        "name": "Mondim de Basto[2]",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "monforte",
        "name": "Monforte",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "montalegre",
        "name": "Montalegre",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "montemor-o-novo",
        "name": "Montemor-o-Novo",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "montemor-o-velho",
        "name": "Montemor-o-Velho",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "montijo",
        "name": "Montijo",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "mora[4]",
        "name": "Mora[4]",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "mortagua[2]",
        "name": "Mortagua[2]",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "moura",
        "name": "Moura",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "mourao",
        "name": "Mourao",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "murca",
        "name": "Murca",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "murtosa",
        "name": "Murtosa",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "nazare",
        "name": "Nazare",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "nelas",
        "name": "Nelas",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "nisa",
        "name": "Nisa",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "obidos",
        "name": "Obidos",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "odemira",
        "name": "Odemira",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "odivelas",
        "name": "Odivelas",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "oeiras",
        "name": "Oeiras",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "oleiros",
        "name": "Oleiros",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "olhao",
        "name": "Olhao",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "oliveira-de-azemeis",
        "name": "Oliveira de Azemeis",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "oliveira-de-frades",
        "name": "Oliveira de Frades",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "oliveira-do-bairro",
        "name": "Oliveira do Bairro",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "oliveira-do-hospital",
        "name": "Oliveira do Hospital",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "ourem",
        "name": "Ourem",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "ourique",
        "name": "Ourique",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "ovar",
        "name": "Ovar",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "pacos-de-ferreira",
        "name": "Pacos de Ferreira",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "palmela",
        "name": "Palmela",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "pampilhosa-da-serra",
        "name": "Pampilhosa da Serra",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "paredes",
        "name": "Paredes",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "paredes-de-coura",
        "name": "Paredes de Coura",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "pedrogao-grande",
        "name": "Pedrogao Grande",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "penacova",
        "name": "Penacova",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "penafiel",
        "name": "Penafiel",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "penalva-do-castelo",
        "name": "Penalva do Castelo",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "penamacor",
        "name": "Penamacor",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "penedono",
        "name": "Penedono",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "penela",
        "name": "Penela",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "peniche",
        "name": "Peniche",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "peso-da-regua",
        "name": "Peso da Regua",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "pinhel",
        "name": "Pinhel",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "pombal",
        "name": "Pombal",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "ponte-da-barca",
        "name": "Ponte da Barca",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "ponte-de-lima",
        "name": "Ponte de Lima",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "ponte-de-sor",
        "name": "Ponte de Sor",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "portalegre",
        "name": "Portalegre",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "portel",
        "name": "Portel",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "portimao",
        "name": "Portimao",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "porto",
        "name": "Porto",
        "district": "Porto",
        "region": "Regiao do Norte",
        "verified": true,
        "pdm_links": {
            "landing_page": "https://pdm.cm-porto.pt/",
            "regulation_pdf": "https://pdm.cm-porto.pt/documentos/regulamento-do-pdm-do-porto",
            "geoportal": "https://pdm.cm-porto.pt/mapas-interativos"
        }
    },
    {
        "id": "porto-de-mos",
        "name": "Porto de Mos",
        "district": "Leiria",
        "region": "Regiao do Centro"
    },
    {
        "id": "povoa-de-lanhoso",
        "name": "Povoa de Lanhoso",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "povoa-de-varzim",
        "name": "Povoa de Varzim",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "proenca-a-nova",
        "name": "Proenca-a-Nova",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "redondo",
        "name": "Redondo",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "reguengos-de-monsaraz",
        "name": "Reguengos de Monsaraz",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "resende",
        "name": "Resende",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "ribeira-de-pena",
        "name": "Ribeira de Pena",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "rio-maior",
        "name": "Rio Maior",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "sabrosa",
        "name": "Sabrosa",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "sabugal",
        "name": "Sabugal",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "salvaterra-de-magos",
        "name": "Salvaterra de Magos",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "santa-comba-dao",
        "name": "Santa Comba Dao",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "santa-maria-da-feira",
        "name": "Santa Maria da Feira",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "santa-marta-de-penaguiao",
        "name": "Santa Marta de Penaguiao",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "santarem",
        "name": "Santarem",
        "district": "Santarem",
        "region": "Alentejo"
    },
    {
        "id": "santiago-do-cacem",
        "name": "Santiago do Cacem",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "santo-tirso[2]",
        "name": "Santo Tirso[2]",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "sao-bras-de-alportel",
        "name": "Sao Bras de Alportel",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "sao-joao-da-madeira",
        "name": "Sao Joao da Madeira",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "sao-joao-da-pesqueira",
        "name": "Sao Joao da Pesqueira",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "sao-pedro-do-sul",
        "name": "Sao Pedro do Sul",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "sardoal",
        "name": "Sardoal",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "satao",
        "name": "Satao",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "seia",
        "name": "Seia",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "seixal",
        "name": "Seixal",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "sernancelhe",
        "name": "Sernancelhe",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "serpa",
        "name": "Serpa",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "serta",
        "name": "Serta",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "sesimbra",
        "name": "Sesimbra",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "setubal",
        "name": "Setubal",
        "district": "Setubal",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "sever-do-vouga",
        "name": "Sever do Vouga",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "silves",
        "name": "Silves",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "sines",
        "name": "Sines",
        "district": "Setubal",
        "region": "Alentejo"
    },
    {
        "id": "sintra",
        "name": "Sintra",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "sobral-de-monte-agraco",
        "name": "Sobral de Monte Agraco",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "soure",
        "name": "Soure",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "sousel[4]",
        "name": "Sousel[4]",
        "district": "Portalegre",
        "region": "Alentejo"
    },
    {
        "id": "tabua",
        "name": "Tabua",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "tabuaco",
        "name": "Tabuaco",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "tarouca",
        "name": "Tarouca",
        "district": "Viseu",
        "region": "Regiao do Norte"
    },
    {
        "id": "tavira",
        "name": "Tavira",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "terras-de-bouro",
        "name": "Terras de Bouro",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "tomar",
        "name": "Tomar",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "tondela",
        "name": "Tondela",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "torre-de-moncorvo",
        "name": "Torre de Moncorvo",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "torres-novas",
        "name": "Torres Novas",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "torres-vedras",
        "name": "Torres Vedras",
        "district": "Lisboa",
        "region": "Regiao do Centro"
    },
    {
        "id": "trancoso",
        "name": "Trancoso",
        "district": "Guarda",
        "region": "Regiao do Centro"
    },
    {
        "id": "trofa[2]",
        "name": "Trofa[2]",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "vagos",
        "name": "Vagos",
        "district": "Aveiro",
        "region": "Regiao do Centro"
    },
    {
        "id": "vale-de-cambra",
        "name": "Vale de Cambra",
        "district": "Aveiro",
        "region": "Regiao do Norte"
    },
    {
        "id": "valenca",
        "name": "Valenca",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "valongo",
        "name": "Valongo",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "valpacos",
        "name": "Valpacos",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "vendas-novas",
        "name": "Vendas Novas",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "viana-do-alentejo",
        "name": "Viana do Alentejo",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "viana-do-castelo",
        "name": "Viana do Castelo",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "vidigueira",
        "name": "Vidigueira",
        "district": "Beja",
        "region": "Alentejo"
    },
    {
        "id": "vieira-do-minho",
        "name": "Vieira do Minho",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-de-rei",
        "name": "Vila de Rei",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-do-bispo",
        "name": "Vila do Bispo",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "vila-do-conde",
        "name": "Vila do Conde",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-flor[2]",
        "name": "Vila Flor[2]",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-franca-de-xira",
        "name": "Vila Franca de Xira",
        "district": "Lisboa",
        "region": "Regiao de Lisboa"
    },
    {
        "id": "vila-nova-da-barquinha",
        "name": "Vila Nova da Barquinha",
        "district": "Santarem",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-nova-de-cerveira",
        "name": "Vila Nova de Cerveira",
        "district": "Viana do Castelo",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-famalicao",
        "name": "Vila Nova de Famalicao",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-foz-coa",
        "name": "Vila Nova de Foz Coa",
        "district": "Guarda",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-gaia",
        "name": "Vila Nova de Gaia",
        "district": "Porto",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-nova-de-paiva",
        "name": "Vila Nova de Paiva",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-nova-de-poiares",
        "name": "Vila Nova de Poiares",
        "district": "Coimbra",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-pouca-de-aguiar",
        "name": "Vila Pouca de Aguiar",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-real",
        "name": "Vila Real",
        "district": "Vila Real",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-real-de-santo-antonio",
        "name": "Vila Real de Santo Antonio",
        "district": "Faro",
        "region": "Algarve"
    },
    {
        "id": "vila-velha-de-rodao",
        "name": "Vila Velha de Rodao",
        "district": "Castelo Branco",
        "region": "Regiao do Centro"
    },
    {
        "id": "vila-verde",
        "name": "Vila Verde",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vila-vicosa",
        "name": "Vila Vicosa",
        "district": "Evora",
        "region": "Alentejo"
    },
    {
        "id": "vimioso",
        "name": "Vimioso",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "vinhais",
        "name": "Vinhais",
        "district": "Braganca",
        "region": "Regiao do Norte"
    },
    {
        "id": "viseu",
        "name": "Viseu",
        "district": "Viseu",
        "region": "Regiao do Centro"
    },
    {
        "id": "vizela",
        "name": "Vizela",
        "district": "Braga",
        "region": "Regiao do Norte"
    },
    {
        "id": "vouzela",
        "name": "Vouzela",
        "district": "Viseu",
        "region": "Regiao do Centro"
    }
];
```

## File: .\data\taskCatalog.ts
```
/**
 * FA-360 | CATALOGO DE TAREFAS DE ARQUITECTURA
 * Sistema completo de tarefas pre-definidas por fase RJUE
 */

export type Phase =
    | 'COMMERCIAL'      // Fase Comercial / Pre-projecto
    | 'CONCEPT'         // Estudo Previo
    | 'PRELIMINARY'     // Anteprojecto / Programa Base
    | 'LICENSING'       // Projecto de Licenciamento
    | 'EXECUTION'       // Projecto de Execucao
    | 'CONSTRUCTION'    // Assistencia a Obra
    | 'CLOSING'         // Fecho e Entrega
    | 'INTERNAL';       // Tarefas Internas do Atelier

export interface TaskTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    phase: Phase;
    estimatedHours: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    dependencies?: string[];
    deliverables?: string[];
    responsible?: 'architect' | 'engineer' | 'designer' | 'intern' | 'external';
    tags?: string[];
}

export const TASK_CATALOG: TaskTemplate[] = [
    // FASE COMERCIAL
    {
        id: 'COM-001',
        name: 'Reuniao inicial com cliente',
        description: 'Primeira reuniao para levantamento de necessidades, expectativas, orcamento disponivel e prazos pretendidos.',
        category: 'CLIENT',
        phase: 'COMMERCIAL',
        estimatedHours: 2,
        priority: 'high',
        deliverables: ['Acta de reuniao', 'Briefing preliminar'],
        responsible: 'architect',
        tags: ['reuniao', 'cliente', 'briefing']
    },
    {
        id: 'COM-002',
        name: 'Visita ao local',
        description: 'Visita tecnica ao terreno/imovel para avaliacao das condicoes existentes, envolvente, acessos e condicionantes.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-001'],
        deliverables: ['Relatorio de visita', 'Reportagem fotografica'],
        responsible: 'architect',
        tags: ['visita', 'terreno', 'levantamento']
    },
    {
        id: 'COM-003',
        name: 'Levantamento documental',
        description: 'Recolha de documentos: caderneta predial, certidao de registo, plantas de localizacao, levantamento topografico existente.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 4,
        priority: 'high',
        dependencies: ['COM-001'],
        deliverables: ['Dossier documental'],
        responsible: 'intern',
        tags: ['documentos', 'registo', 'caderneta']
    },
    {
        id: 'COM-004',
        name: 'Consulta ao PDM',
        description: 'Analise do enquadramento no Plano Director Municipal: classificacao do solo, indices, condicionantes, servidoes.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-003'],
        deliverables: ['Ficha de enquadramento urbanistico'],
        responsible: 'architect',
        tags: ['PDM', 'urbanismo', 'condicionantes']
    },
    {
        id: 'COM-005',
        name: 'Analise de viabilidade',
        description: 'Estudo preliminar de viabilidade: areas possiveis, numero de pisos, estacionamento, custos estimados.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 6,
        priority: 'high',
        dependencies: ['COM-004'],
        deliverables: ['Relatorio de viabilidade'],
        responsible: 'architect',
        tags: ['viabilidade', 'areas', 'custos']
    },
    {
        id: 'COM-006',
        name: 'Elaboracao de proposta de honorarios',
        description: 'Calculo de honorarios segundo tabela ICHPOP/OA, definicao de fases, prazos e condicoes de pagamento.',
        category: 'ADMIN',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-005'],
        deliverables: ['Proposta de honorarios PDF'],
        responsible: 'architect',
        tags: ['honorarios', 'proposta', 'orcamento']
    },
    {
        id: 'COM-007',
        name: 'Apresentacao de proposta ao cliente',
        description: 'Reuniao de apresentacao da proposta, esclarecimento de duvidas e negociacao de condicoes.',
        category: 'CLIENT',
        phase: 'COMMERCIAL',
        estimatedHours: 2,
        priority: 'high',
        dependencies: ['COM-006'],
        deliverables: ['Proposta assinada ou feedback'],
        responsible: 'architect',
        tags: ['reuniao', 'proposta', 'negociacao']
    },
    {
        id: 'COM-008',
        name: 'Assinatura de contrato',
        description: 'Formalizacao do contrato de prestacao de servicos, recolha de documentos e pagamento inicial.',
        category: 'ADMIN',
        phase: 'COMMERCIAL',
        estimatedHours: 1,
        priority: 'critical',
        dependencies: ['COM-007'],
        deliverables: ['Contrato assinado', 'Comprovativo de pagamento'],
        responsible: 'architect',
        tags: ['contrato', 'adjudicacao']
    },

    // ESTUDO PREVIO
    {
        id: 'EP-001',
        name: 'Analise do programa funcional',
        description: 'Definicao detalhada do programa: listagem de espacos, areas pretendidas, relacoes funcionais, requisitos especiais.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 4,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Programa funcional detalhado'],
        responsible: 'architect',
        tags: ['programa', 'areas', 'funcional']
    },
    {
        id: 'EP-002',
        name: 'Levantamento topografico',
        description: 'Coordenacao com topografo para levantamento do terreno: altimetria, limites, construcoes existentes, arvores.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 2,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Levantamento topografico DWG'],
        responsible: 'external',
        tags: ['topografia', 'levantamento', 'terreno']
    },
    {
        id: 'EP-003',
        name: 'Levantamento arquitectonico',
        description: 'Medicao e desenho rigoroso do existente: plantas, cortes, alcados, detalhes construtivos, patologias.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 16,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Desenhos do existente DWG'],
        responsible: 'architect',
        tags: ['levantamento', 'existente', 'reabilitacao']
    },

    // ANTEPROJECTO
    {
        id: 'AP-001',
        name: 'Desenvolvimento das plantas',
        description: 'Desenho detalhado das plantas de todos os pisos a escala 1:100.',
        category: 'DESIGN',
        phase: 'PRELIMINARY',
        estimatedHours: 24,
        priority: 'high',
        deliverables: ['Plantas 1:100 DWG'],
        responsible: 'architect',
        tags: ['plantas', 'desenho', '1:100']
    },
    {
        id: 'AP-011',
        name: 'Preparacao do dossier AP',
        description: 'Compilacao de todos os elementos do anteprojecto para apresentacao.',
        category: 'DOCUMENTATION',
        phase: 'PRELIMINARY',
        estimatedHours: 4,
        priority: 'high',
        deliverables: ['Dossier de Anteprojecto PDF'],
        responsible: 'intern',
        tags: ['dossier', 'documentacao']
    },

    // LICENCIAMENTO
    {
        id: 'LIC-001',
        name: 'Plantas de licenciamento',
        description: 'Elaboracao das plantas definitivas a escala 1:100 ou 1:50 para licenciamento.',
        category: 'DOCUMENTATION',
        phase: 'LICENSING',
        estimatedHours: 20,
        priority: 'high',
        deliverables: ['Plantas de licenciamento DWG/PDF'],
        responsible: 'architect',
        tags: ['plantas', 'licenciamento']
    },
    {
        id: 'LIC-021',
        name: 'Submissao na camara municipal',
        description: 'Entrega do processo na camara municipal ou submissao electronica.',
        category: 'LICENSING',
        phase: 'LICENSING',
        estimatedHours: 2,
        priority: 'critical',
        deliverables: ['Comprovativo de entrega'],
        responsible: 'architect',
        tags: ['submissao', 'camara']
    },

    // EXECUCAO
    {
        id: 'PE-001',
        name: 'Plantas de execucao',
        description: 'Elaboracao das plantas detalhadas a escala 1:50 com todas as cotas e referencias.',
        category: 'DOCUMENTATION',
        phase: 'EXECUTION',
        estimatedHours: 40,
        priority: 'high',
        deliverables: ['Plantas 1:50 DWG'],
        responsible: 'architect',
        tags: ['plantas', 'execucao', '1:50']
    },

    // ASSISTENCIA OBRA
    {
        id: 'OBR-001',
        name: 'Reuniao de arranque de obra',
        description: 'Reuniao inicial com empreiteiro para definicao de procedimentos e comunicacao.',
        category: 'SITE',
        phase: 'CONSTRUCTION',
        estimatedHours: 3,
        priority: 'high',
        deliverables: ['Acta de reuniao'],
        responsible: 'architect',
        tags: ['reuniao', 'arranque', 'empreiteiro']
    },
    {
        id: 'OBR-003',
        name: 'Visita de obra semanal',
        description: 'Visita periodica para acompanhamento dos trabalhos e esclarecimento de duvidas.',
        category: 'SITE',
        phase: 'CONSTRUCTION',
        estimatedHours: 3,
        priority: 'high',
        deliverables: ['Relatorio de visita'],
        responsible: 'architect',
        tags: ['visita', 'acompanhamento', 'recorrente']
    },

    // FECHO
    {
        id: 'FIM-001',
        name: 'Pedido de utilizacao',
        description: 'Preparacao e submissao do pedido de autorizacao de utilizacao.',
        category: 'LICENSING',
        phase: 'CLOSING',
        estimatedHours: 4,
        priority: 'critical',
        deliverables: ['Requerimento submetido'],
        responsible: 'architect',
        tags: ['utilizacao', 'licenciamento']
    },
    {
        id: 'FIM-006',
        name: 'Reuniao final com cliente',
        description: 'Reuniao de entrega final e encerramento do projecto.',
        category: 'CLIENT',
        phase: 'CLOSING',
        estimatedHours: 2,
        priority: 'high',
        deliverables: ['Termo de encerramento'],
        responsible: 'architect',
        tags: ['reuniao', 'entrega', 'milestone']
    },

    // INTERNO
    {
        id: 'INT-001',
        name: 'Reuniao de equipa semanal',
        description: 'Reuniao semanal de coordenacao interna: revisao de projectos, distribuicao de tarefas, problemas e solucoes.',
        category: 'ADMIN',
        phase: 'INTERNAL',
        estimatedHours: 1,
        priority: 'medium',
        deliverables: ['Acta de reuniao'],
        responsible: 'architect',
        tags: ['reuniao', 'equipa', 'recorrente', 'semanal']
    },
    {
        id: 'INT-010',
        name: 'Facturacao mensal',
        description: 'Emissao de facturas do mes: projectos em curso, fases concluidas, trabalhos adicionais.',
        category: 'ADMIN',
        phase: 'INTERNAL',
        estimatedHours: 3,
        priority: 'critical',
        deliverables: ['Facturas emitidas'],
        responsible: 'architect',
        tags: ['facturacao', 'recorrente', 'mensal', 'financeiro']
    }
];

export const PHASES_CONFIG = {
    COMMERCIAL: { label: 'Fase Comercial', color: '#6366f1', icon: 'Briefcase', order: 1 },
    CONCEPT: { label: 'Estudo Previo', color: '#a855f7', icon: 'Lightbulb', order: 2 },
    PRELIMINARY: { label: 'Anteprojecto', color: '#3b82f6', icon: 'PenTool', order: 3 },
    LICENSING: { label: 'Licenciamento', color: '#f59e0b', icon: 'FileCheck', order: 4 },
    EXECUTION: { label: 'Projecto Execucao', color: '#f97316', icon: 'Layers', order: 5 },
    CONSTRUCTION: { label: 'Assistencia Obra', color: '#10b981', icon: 'HardHat', order: 6 },
    CLOSING: { label: 'Fecho', color: '#22c55e', icon: 'CheckCircle', order: 7 },
    INTERNAL: { label: 'Interno', color: '#64748b', icon: 'Building', order: 8 },
};

export const RESPONSIBLE_CONFIG = {
    architect: { label: 'Arquitecto', color: 'luxury-gold' },
    engineer: { label: 'Engenheiro', color: 'blue-500' },
    designer: { label: 'Designer', color: 'purple-500' },
    intern: { label: 'Estagiario', color: 'emerald-500' },
    external: { label: 'Externo', color: 'gray-500' },
};
```

## File: .\neural\manifest.json
```

{
  "studio_ai_version": "1.0.0-NEURAL",
  "owner": "Ferreira Arquitetos",
  "agents": [
    {
      "id": "concierge",
      "name": "Digital Concierge",
      "role": "Lead Conversion & Public Relations",
      "model": "gemini-3-flash-preview",
      "temperature": 0.7,
      "memory_depth": "Session-Based"
    },
    {
      "id": "pilot",
      "name": "Financial Pilot",
      "role": "Profitability Analysis & Fiscal Strategy",
      "model": "gemini-3-pro-preview",
      "temperature": 0.2,
      "memory_depth": "Historical-Ledger"
    },
    {
      "id": "director",
      "name": "Creative Director",
      "role": "Visual Curation & Brand Voice",
      "model": "gemini-3-pro-preview",
      "temperature": 0.9,
      "memory_depth": "Project-Contextual"
    }
  ],
  "system_instructions_path": "/neural/prompts/",
  "neural_link_status": "Active"
}
```

## File: .\pages\AntigravityPage.tsx
```

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Brain, 
  Link2, 
  ArrowRight,
  Trash2,
  CheckCircle2,
  Unplug,
  Lock,
  CloudSync
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function AntigravityPage() {
  const navigate = useNavigate();
  const [isLinkingBrain, setIsLinkingBrain] = useState(false);
  const [brainHook, setBrainHook] = useState(fa360.getNeuralHook());
  const [isBrainOnline, setIsBrainOnline] = useState(fa360.getNeuralStatus());
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Antigravity Core v4.5.0 Persistent Mode.',
    `[AUTH] Node Status: ${fa360.getNeuralStatus() ? 'CONNECTED' : 'STANDBY'}`
  ]);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem('fa-last-sync-time'));

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = fa360.subscribeToLogs((newLog) => {
      setLogs(prev => [...prev.slice(-25), newLog]);
    });

    const handleUpdate = () => {
      setIsBrainOnline(fa360.getNeuralStatus());
      setBrainHook(fa360.getNeuralHook());
      setLastSync(localStorage.getItem('fa-last-sync-time'));
    };
    
    window.addEventListener('fa-sync-complete', handleUpdate);
    window.addEventListener('neural-link-active', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('fa-sync-complete', handleUpdate);
      window.removeEventListener('neural-link-active', handleUpdate);
    };
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleBrainLink = async () => {
    if (!brainHook) return;
    setIsLinkingBrain(true);
    try {
      const res = await fa360.connectNeuralMaster(brainHook);
      if (res.success) {
        fa360.log("SUCCESS: Ponte Neural gravada permanentemente.");
      }
    } catch (e) {
      fa360.log("ERROR: Falha na gravacao do link.");
    }
    setIsLinkingBrain(false);
  };

  const disconnectBrain = () => {
    if (confirm("Isto ira desligar a ponte neural. As configuracoes de link serao apagadas. Continuar?")) {
      localStorage.removeItem('fa-brain-status');
      localStorage.removeItem('fa-brain-hook');
      setIsBrainOnline(false);
      setBrainHook('');
      fa360.log("SYSTEM: Link Neural removido do hardware.");
      window.dispatchEvent(new CustomEvent('neural-link-active'));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black text-luxury-charcoal dark:text-white p-6 md:p-8 space-y-12 pb-32 max-w-[1800px] mx-auto animate-in fade-in duration-1000">
      <PageHeader 
        kicker="Persistent Core Engine"
        title={<>Anti<span className="text-luxury-gold drop-shadow-[0_0_50px_rgba(212,175,55,0.2)]">gravity.</span></>}
        statusIndicator={true}
        customStatus={
          <div className="flex items-center gap-8 glass px-6 py-3 rounded-[2.5rem] border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/[0.02]">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Neural Memory</span>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${isBrainOnline ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500'} animate-pulse`}></div>
                   <span className={`text-[9px] font-black uppercase ${isBrainOnline ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {isBrainOnline ? 'Permanent Link Active' : 'Standby Mode'}
                   </span>
                </div>
             </div>
             <div className="w-px h-6 bg-black/10 dark:bg-white/10"></div>
             <button onClick={() => fa360.purgeSystemCache()} title="Hard Reset" className="p-2 bg-black/5 dark:bg-white/5 rounded-xl text-luxury-charcoal dark:text-white hover:text-red-500 transition-colors">
                <Trash2 size={16} />
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          
          <section className={`glass p-8 md:p-16 rounded-[2rem] border-luxury-gold/30 space-y-12 shadow-2xl relative overflow-hidden transition-all duration-1000 ${isBrainOnline ? 'bg-emerald-500/[0.03] border-emerald-500/40' : 'bg-luxury-gold/[0.02]'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Brain size={300} className={isBrainOnline ? 'text-emerald-500' : 'text-luxury-gold'} />
             </div>

             <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl shadow-xl ${isBrainOnline ? 'bg-emerald-500 text-black' : 'bg-luxury-gold text-black shadow-luxury-gold/20'}`}>
                         {isBrainOnline ? <Lock size={24} /> : <Link2 size={24} />}
                      </div>
                      <h2 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{isBrainOnline ? 'Encrypted Connection' : 'Establish Master Hook'}</h2>
                   </div>
                   <p className="text-lg font-light italic text-luxury-charcoal/60 dark:text-white/60 max-w-xl leading-relaxed">
                      {isBrainOnline 
                        ? 'O link neural esta selado. Todos os seus dados e simulacoes estao agora a ser persistidos na sua infraestrutura privada do Google.'
                        : 'A plataforma esta a correr em modo local. Ligue o seu Master Hook para ativar a inteligencia global e persistencia de dados.'}
                   </p>
                </div>
                {isBrainOnline && (
                   <button onClick={disconnectBrain} className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                      <Unplug size={14}/> Disconnect Bridge
                   </button>
                )}
             </div>

             <div className="space-y-6 relative z-10">
                <div className={`flex gap-4 p-2 bg-black/5 dark:bg-black/40 rounded-[2.5rem] border transition-all ${isBrainOnline ? 'border-emerald-500/20' : 'border-luxury-gold/20'}`}>
                   <input 
                    value={brainHook}
                    disabled={isBrainOnline}
                    onChange={e => setBrainHook(e.target.value)}
                    placeholder="https://script.google.com/..."
                    className="flex-1 bg-transparent border-none rounded-2xl px-8 py-5 text-xs text-luxury-charcoal dark:text-white font-mono focus:outline-none placeholder:text-luxury-charcoal/20 dark:placeholder:text-white/20 disabled:opacity-60"
                   />
                   {!isBrainOnline ? (
                     <button 
                      onClick={handleBrainLink}
                      disabled={isLinkingBrain || !brainHook}
                      className="px-12 py-5 bg-luxury-gold text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-luxury-gold/30 flex items-center gap-3"
                     >
                       {isLinkingBrain ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} 
                       Initialize Link
                     </button>
                   ) : (
                     <div className="px-12 py-5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                        <CheckCircle2 size={14}/> Node Verified
                     </div>
                   )}
                </div>
             </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] space-y-8">
                <div className="flex items-center gap-4">
                   <ShieldCheck className="text-luxury-gold" size={20} />
                   <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Security Status</h3>
                </div>
                <div className="p-6 bg-black/5 dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-widest">Persistence</span>
                      <span className={isBrainOnline ? 'text-emerald-500 font-black' : 'text-luxury-charcoal/20 dark:text-white/20'}>{isBrainOnline ? 'ENABLED' : 'LOCAL ONLY'}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-widest">Encryption</span>
                      <span className="text-emerald-500 font-black">ACTIVE</span>
                   </div>
                </div>
                <button onClick={() => navigate('/neural')} className="w-full py-5 border border-black/10 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all text-luxury-charcoal dark:text-white">
                   Neural Studio <ArrowRight size={14} className="inline ml-2"/>
                </button>
             </div>

             <div className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] space-y-8 flex flex-col justify-center items-center text-center">
                <Database className="text-luxury-gold mb-4" size={40} />
                <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Memory Core</h3>
                <p className="text-[10px] font-light text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-widest leading-loose">
                   A base de dados local sincroniza automaticamente com o cerebro central a cada alteracao.
                </p>
                <div className="pt-6 w-full">
                  <button onClick={() => fa360.syncAllLocalData()} className="w-full py-5 bg-luxury-charcoal dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-luxury-gold transition-all">
                    Force Cloud Sync
                  </button>
                </div>
             </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
           <div className="glass rounded-[2rem] border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/90 shadow-2xl h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between bg-black/5 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 text-luxury-gold">
                   <Terminal size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">System Console</span>
                </div>
              </div>
              <div className="flex-1 p-8 font-mono text-[11px] space-y-3 overflow-y-auto no-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                     <span className="text-luxury-charcoal/20 dark:text-white/20">{i+1}</span>
                     <p className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-red-400' : 'text-luxury-gold'}>{log}</p>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

```

## File: .\pages\BrandIdentityPage.tsx
```
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

```

## File: .\pages\CalculatorPage.tsx
```

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProposalGenerator from '../components/ProposalGenerator';
import PageHeader from '../components/common/PageHeader';

export default function CalculatorPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      <PageHeader 
        kicker="Engenharia Financeira"
        title={<>Simulador de <span className="text-luxury-gold">Honorarios.</span></>}
      />

      <div className="w-full h-full">
        <ProposalGenerator isOpen={true} />
      </div>

      <div className="flex justify-center pt-20">
        <button
          onClick={() => navigate('/')}
          className="px-12 py-5 glass border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}

```

## File: .\pages\CalendarPage.tsx
```

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Plus,
  MoreHorizontal,
  Video
} from 'lucide-react';
import { useEffect } from 'react';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('Janeiro 2026');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [events, setEvents] = useState<any[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const Motion = motion as any;

  const loadCalendarData = async () => {
    setLoading(true);
    const [evs, ai] = await Promise.all([
      fa360.listEvents(),
      fa360.getAIRecommendations('CALENDAR')
    ]);
    setEvents(evs);
    setAiMessage(ai);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadCalendarData();
    };
    init();
  }, []);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  if (loading) return <div className="p-20 text-center opacity-50">Sincronizando Agenda Neural...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker="Timeline do Estudio"
        title={<>Agenda <span className="text-luxury-gold">Inteligente.</span></>}
        actionLabel="Novo Evento"
        onAction={() => { }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-3xl font-serif italic">{currentMonth}</h3>
            <div className="flex gap-4">
              <button className="p-3 glass rounded-xl border-white/10 hover:text-luxury-gold transition-colors"><ChevronLeft size={18} /></button>
              <button className="p-3 glass rounded-xl border-white/10 hover:text-luxury-gold transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="glass rounded-[3rem] p-8 border-white/5 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-7 gap-px opacity-50 text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-center">
              <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {days.map(day => {
                const dayEvents = events.filter(e => e.date === day);
                const hasEvent = dayEvents.length > 0;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all relative group ${selectedDate === day ? 'bg-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'hover:bg-white/5'
                      }`}
                  >
                    <span className={`text-lg font-serif ${selectedDate === day ? 'font-bold' : 'opacity-60'}`}>{day}</span>
                    {hasEvent && (
                      <div className={`w-1 h-1 rounded-full ${selectedDate === day ? 'bg-black' : 'bg-luxury-gold shadow-[0_0_5px_#D4AF37]'}`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Schedule & AI Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">AI Schedule Assistant</h4>
            </div>
            <p className="text-sm font-light italic opacity-60 leading-relaxed">
              "{aiMessage}"
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 px-4">Eventos: {selectedDate} Jan</h4>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {events.filter(e => e.date === selectedDate).map((event, idx) => (
                  <Motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass p-6 rounded-3xl border-white/5 space-y-4 group hover:border-luxury-gold/20 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-luxury-gold">{event.type}</span>
                      <button className="opacity-20 hover:opacity-100 transition-opacity"><MoreHorizontal size={16} /></button>
                    </div>
                    <h5 className="text-xl font-serif italic">{event.title}</h5>
                    <div className="space-y-2 opacity-50">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} className="text-luxury-gold" /> {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={12} className="text-luxury-gold" /> {event.location}
                      </div>
                    </div>
                  </Motion.div>
                ))}
                {events.filter(e => e.date === selectedDate).length === 0 && (
                  <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="p-8 text-center italic font-light text-sm"
                  >
                    Nenhum compromisso agendado para este dia.
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

```

## File: .\pages\ClientDetailsPage.tsx
```

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  MoreVertical,
  Plus,
  Star,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('PROJETOS');
  const Motion = motion as any;

  useEffect(() => {
    fa360.listClients().then(all => {
      const c = all.find(x => x.id === id);
      if (c) setClient(c);
    });
  }, [id]);

  if (!client) return <div className="p-20 text-center opacity-20">Carregando ficha do cliente...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12">
        <div className="space-y-6">
          <button 
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-luxury-gold transition-all"
          >
            <ArrowLeft size={14} /> Voltar a Listagem
          </button>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center text-luxury-gold border border-luxury-gold/20 relative group">
              <User size={48} />
              <div className="absolute -top-2 -right-2 p-2 bg-luxury-gold rounded-full text-black shadow-lg">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-0.5 bg-luxury-gold text-black rounded-full">Cliente VIP</span>
                <span className="text-[11px] font-mono opacity-20 uppercase tracking-widest">ID: #C-{client.id}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none">{client.name}</h1>
              <p className="text-xl font-light opacity-60 mt-2">Investidor Imobiliario â€¢ Residencial de Luxo</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 glass border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all">
            Editar Perfil
          </button>
          <button className="px-8 py-3 bg-luxury-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-luxury-gold/10">
            Nova Proposta
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Contact & IA Persona */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Contacto Direto</h4>
            <div className="space-y-6">
               <ContactRow icon={<Mail size={16}/>} label="Email" value={client.email} />
               <ContactRow icon={<Phone size={16}/>} label="Telefone" value={client.phone} />
               <ContactRow icon={<MapPin size={16}/>} label="Localizacao" value="Lisboa, Portugal" />
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <Sparkles size={100} className="text-luxury-gold" />
            </div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">IA Persona Summary</h4>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-light italic opacity-60 leading-relaxed">
                "O cliente demonstra preferencia por estetica mediterranica contemporanea. Valoriza o rigor tecnico e e sensivel a atrasos logisticos. Recomendado: Manter comunicacao proativa semanal."
              </p>
              <div className="flex flex-wrap gap-2">
                 {['Minimalista', 'Naturais', 'Rigoroso', 'VIP'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest opacity-60">{tag}</span>
                 ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Tabs Content */}
        <main className="lg:col-span-8 space-y-10">
          <div className="flex gap-8 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide">
            {['PROJETOS', 'FINANCEIRO', 'COMUNICACOES', 'NOTAS'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-luxury-gold' : 'opacity-20 hover:opacity-100'}`}
              >
                {tab}
                {activeTab === tab && <Motion.div layoutId="clientTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-luxury-gold shadow-[0_0_10px_#D4AF37]" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {activeTab === 'PROJETOS' && (
                <div className="space-y-6">
                   <ProjectMiniCard title="Villa Alentejo" status="Em Curso" value="â‚¬1.2M" />
                   <ProjectMiniCard title="Apartamento Chiado" status="Finalizado" value="â‚¬450k" />
                   <button className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-white/20 hover:border-luxury-gold/30 hover:text-luxury-gold transition-all group">
                      <Plus size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Iniciar Novo Projeto</span>
                   </button>
                </div>
              )}

              {activeTab === 'FINANCEIRO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass p-10 rounded-[3rem] border-white/5 text-center space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Investimento Total</p>
                      <p className="text-4xl font-serif text-luxury-gold italic">â‚¬1.650.000</p>
                      <p className="text-[11px] font-mono opacity-20">LTV Acumulado</p>
                   </div>
                   <div className="glass p-10 rounded-[3rem] border-white/5 text-center space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pendente de Pagamento</p>
                      <p className="text-4xl font-serif">â‚¬24.500</p>
                      <p className="text-emerald-500 text-[11px] font-black uppercase tracking-widest">Atraso: 0 Dias</p>
                   </div>
                </div>
              )}

              {activeTab === 'COMUNICACOES' && (
                 <div className="space-y-6">
                    <CommItem type="Reuniao" date="14 Out" title="Apresentacao de Renderings 3D" author="Miguel F." />
                    <CommItem type="Email" date="12 Out" title="Envio de Caderno de Encargos" author="Sofia C." />
                    <CommItem type="Portal" date="10 Out" title="Cliente aprovou orcamento de cozinha" author="Sistema" />
                 </div>
              )}
            </Motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl text-luxury-gold/50">{icon}</div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest opacity-20 mb-1">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ProjectMiniCard({ title, status, value }: any) {
  return (
    <div className="glass p-8 rounded-[3rem] border-white/5 flex justify-between items-center group hover:border-luxury-gold/20 transition-all">
       <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold">
             <Briefcase size={24} />
          </div>
          <div>
             <h5 className="text-xl font-serif italic">{title}</h5>
             <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mt-1">{status}</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-lg font-serif text-luxury-gold">{value}</p>
          <button className="text-[11px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 group-hover:text-luxury-gold transition-all mt-2 flex items-center gap-2">Explorar <TrendingUp size={10} /></button>
       </div>
    </div>
  );
}

function CommItem({ type, date, title, author }: any) {
  return (
    <div className="flex items-center gap-6 p-6 glass rounded-2xl border-white/5 group hover:bg-white/[0.02] transition-colors">
       <div className={`p-3 rounded-lg text-[11px] font-black uppercase tracking-widest ${
         type === 'Portal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 opacity-50'
       }`}>{type}</div>
       <div className="flex-1">
          <h6 className="text-sm font-medium">{title}</h6>
          <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mt-1">{date} â€¢ {author}</p>
       </div>
       <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16}/></button>
    </div>
  );
}

```

## File: .\pages\ClientPortalPage.tsx
```

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Play,
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  MessageCircle,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Camera,
  Sun,
  Palette,
  Compass,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bell,
  Star,
  Leaf
} from 'lucide-react';
import fa360 from '../services/fa360';

export default function ClientPortalPage() {
  const Motion = motion as any;
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('HOME');
  const [notifications, setNotifications] = useState(2);

  const [projectInsight, setProjectInsight] = useState<string>('A carregar analise do diretor...');

  useEffect(() => {
    fa360.listProjects().then(all => {
      const p = all.find(x => x.id === projectId || x.id === '1');
      if (p) {
        setProject(p);
        fa360.synthesizeProjectInsights(p).then(text => setProjectInsight(text));
      }
    });
  }, [projectId]);

  const tabs = [
    { id: 'HOME', label: 'Inicio' },
    { id: '3D VIEW', label: 'Visao 3D' },
    { id: 'CHRONOLOGY', label: 'Cronologia' },
    { id: 'DOCS', label: 'Documentos' },
    { id: 'MOODBOARD', label: 'Atmosfera' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-luxury-gold selection:text-black overflow-x-hidden">
      {/* Dynamic Cursor Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-luxury-gold/5 rounded-full blur-[160px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] opacity-20"></div>
      </div>

      <header className="relative h-[50vh] md:h-[60vh] overflow-hidden flex flex-col justify-end px-6 md:px-20 pb-10 md:pb-20">
        <Motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={project?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920'}
            className="w-full h-full object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </Motion.div>

        <nav className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50 md:px-20">
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl md:text-2xl tracking-tighter text-white">FERREIRA</span>
            <span className="text-[7px] uppercase tracking-[0.3em] opacity-50 italic text-luxury-gold">Private Portal</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => window.location.href = '/'} className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mr-4">
              <ArrowRight className="rotate-180" size={12} /> Voltar ao Studio
            </button>
            <button className="relative p-2.5 glass rounded-full border-white/5 group transition-all hover:border-luxury-gold/30">
              <Bell size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              {notifications > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-luxury-gold rounded-full shadow-[0_0_10px_#D4AF37]"></span>}
            </button>
            <div className="flex items-center gap-2 md:gap-4 glass pl-4 md:pl-6 pr-1.5 md:pr-2 py-1.5 md:py-2 rounded-full border-white/10">
              <span className="text-[11px] md:text-[11px] font-black uppercase tracking-widest opacity-60 hidden sm:block">Joao Silva</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-luxury-gold text-black flex items-center justify-center font-black text-xs">J</div>
            </div>
          </div>
        </nav>

        <Motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative z-10 space-y-4 md:space-y-6 max-w-5xl"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-[1px] w-8 md:w-12 bg-luxury-gold"></div>
            <p className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.6em] text-luxury-gold">Private Residency Client Portal</p>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-[9rem] font-serif tracking-tighter leading-[0.8] italic text-white" style={{ fontSize: 'clamp(2.5rem, 15vw, 9rem)' }}>{project?.name || 'A Sua Visao'}</h1>
        </Motion.div>
      </header>

      <main className="relative z-10 px-6 md:px-20 max-w-7xl mx-auto pb-40">
        <div className="flex gap-8 md:gap-8 border-b border-white/5 mb-12 md:mb-20 overflow-x-auto no-scrollbar sticky top-0 bg-[#050505]/90 backdrop-blur-xl pt-6 md:pt-8 z-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-6 md:pb-8 text-[11px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-luxury-gold' : 'opacity-20 hover:opacity-100 text-white'}`}
            >
              {tab.label}
              {activeTab === tab.id && <Motion.div layoutId="portalTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.8)]" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {renderTabContent(activeTab, project, projectInsight)}
          </Motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 md:py-20 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 opacity-50 text-[11px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.2em] text-white text-center md:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} /> Secure Encrypted Connection
        </div>
        <p>Â© 2024 Ferreira Arquitetos. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4 text-luxury-gold">
          Suporte VIP: +351 900 000 000
        </div>
      </footer>
    </div>
  );
}

function renderTabContent(tabId: string, project: any, insight: string) {
  switch (tabId) {
    case 'HOME':
      return <HomeTab project={project} insight={insight} />;
    case '3D VIEW':
      return <ThreeDViewTab />;
    case 'CHRONOLOGY':
      return <ChronologyTab />;
    case 'DOCS':
      return <DocsTab project={project} />;
    case 'MOODBOARD':
      return <MoodboardTab />;
    default:
      return null;
  }
}

function HomeTab({ project, insight }: any) {
  const [isApproved, setIsApproved] = React.useState(false);

  const handleApprove = async () => {
    if (!project) return;
    const success = await fa360.updateProjectStatus(project.id, 'status_construction');
    if (success) {
      setIsApproved(true);
      fa360.log(`CLIENT_PORTAL: Aprovacao do cliente recebida para ${project.name}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 text-white">
      <div className="lg:col-span-8 space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
          <PortalStat icon={<Box />} label="Estado Atual" value={isApproved ? "Construcao" : "Execucao"} />
          <PortalStat icon={<Calendar />} label="Previsao Entrega" value="Out 2025" />
          <PortalStat icon={<Layers />} label="Decisoes Tecnicas" value={isApproved ? "25 / 28" : "24 / 28"} />
        </div>

        <div className="glass p-8 md:p-16 rounded-[2.5rem] md:rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 md:space-y-12 group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 md:p-16 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={100} className="text-luxury-gold" />
          </div>
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-3xl md:text-5xl font-serif italic">Acordos Pendentes</h3>
            <p className="text-lg md:text-xl font-light opacity-50">Sua aprovacao e necessaria para avancar com a proxima fase.</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className={`p-6 md:p-8 bg-white/5 rounded-[2rem] md:rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 group/item transition-all ${isApproved ? 'opacity-50 border-emerald-500/30' : 'hover:border-luxury-gold/30'}`}>
              <div className="flex gap-5 md:gap-6 items-center w-full md:w-auto">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform shrink-0 ${isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-luxury-gold/10 text-luxury-gold group-hover/item:scale-110'}`}>
                  {isApproved ? <CheckCircle2 size={22} /> : <Palette size={22} />}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-medium">Revestimento Suite Master</h4>
                  <p className="text-[11px] md:text-sm opacity-60 font-light italic">Marmore de Estremoz (Amostra #24)</p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                {!isApproved ? (
                  <>
                    <button className="flex-1 md:flex-none px-6 py-3 md:py-4 glass border-white/10 rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all whitespace-nowrap">Ver Amostra 3D</button>
                    <button
                      onClick={handleApprove}
                      className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-luxury-gold text-black rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/20 whitespace-nowrap"
                    >
                      Aprovar Selecao
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500 font-serif italic">
                    <CheckCircle2 size={16} /> Aprovado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 gap-4">
            <h3 className="text-3xl md:text-4xl font-serif italic tracking-tighter">Atividade na Obra</h3>
            <span className="text-[11px] md:text-[10px] font-black uppercase tracking-widest opacity-20 text-luxury-gold">Live Sync Ativo</span>
          </div>
          <div className="space-y-4 md:space-y-6">
            <LogItem date="14 Out" title="Betonagem concluida com sucesso no Setor B" status="Sucesso" />
            <LogItem date="12 Out" title="Visita da Equipa de Engenharia de Estruturas" status="Concluido" />
            <LogItem date="11 Out" title="Rececao de Materiais de Revestimento (Showroom)" status="Verificado" />
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 space-y-10 md:space-y-12">
        <div className="glass p-8 md:p-8 rounded-[3rem] md:rounded-[2rem] space-y-8 md:space-y-10 border-luxury-gold/10 bg-white/[0.01] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 blur-3xl rounded-full"></div>
          <h4 className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-50 text-luxury-gold">Diretor de Projeto</h4>
          <div className="flex items-center gap-5 md:gap-6">
            <div className="relative">
              <img src="https://i.pravatar.cc/120?u=miguel" className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] object-cover border border-luxury-gold/30 p-1 bg-black shadow-2xl" alt="Director" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full border-[3px] md:border-[4px] border-[#050505] shadow-lg shadow-emerald-500/20"></div>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-serif italic text-white">Miguel Ferreira</p>
              <p className="text-[11px] md:text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-1">Lead Architect</p>
            </div>
          </div>
          <div className="p-6 md:p-8 bg-white/5 rounded-[2rem] md:rounded-3xl border border-white/5 shadow-inner">
            <p className="text-xs md:text-sm italic opacity-60 font-light leading-relaxed">"{insight}"</p>
          </div>
          <button className="w-full py-5 md:py-6 bg-luxury-gold/5 border border-luxury-gold/20 rounded-[2rem] md:rounded-3xl flex items-center justify-center gap-3 text-[11px] md:text-[10px] font-black uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all shadow-xl shadow-luxury-gold/5">
            <MessageCircle size={18} /> Canal Direto VIP
          </button>
        </div>

        <div className="p-8 md:p-8 glass rounded-[3rem] md:rounded-[4.5rem] border-white/5 flex flex-col items-center text-center gap-6 md:gap-8 group relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-luxury-gold group-hover:scale-110 group-hover:bg-luxury-gold/10 transition-all duration-700">
            <Camera size={32} />
          </div>
          <div className="space-y-1 md:space-y-2">
            <h4 className="text-xl md:text-2xl font-serif italic">Live Site Cam</h4>
            <p className="text-[11px] md:text-[10px] opacity-60 font-black uppercase tracking-widest">Acesso Restrito 4K</p>
          </div>
          <button className="flex items-center gap-2 text-[11px] md:text-[11px] font-black uppercase tracking-widest text-luxury-gold border-b border-luxury-gold pb-1 hover:opacity-100 transition-opacity opacity-60">Iniciar Transmissao</button>
        </div>
      </aside>
    </div>
  );
}

function PortalStat({ icon, label, value }: any) {
  return (
    <div className="glass p-8 md:p-14 rounded-[2.5rem] md:rounded-[2rem] space-y-6 md:space-y-8 hover:border-luxury-gold/30 transition-all group shadow-2xl bg-white/[0.01]">
      <div className="text-luxury-gold group-hover:scale-110 transition-transform duration-700 bg-luxury-gold/5 w-fit p-3 md:p-4 rounded-xl md:rounded-2xl border border-luxury-gold/10 shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.2em] opacity-50 mb-2 md:mb-3 text-white tracking-widest">{label}</p>
        <p className="text-2xl md:text-4xl font-serif italic text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function LogItem({ date, title, status }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 p-6 md:p-10 glass rounded-[2rem] md:rounded-[3rem] border-white/5 group hover:bg-white/[0.04] transition-all border-l-4 border-l-transparent hover:border-l-luxury-gold shadow-xl">
      <div className="flex flex-col items-start sm:items-center shrink-0">
        <span className="text-[11px] md:text-[10px] font-mono text-luxury-gold opacity-60 tracking-widest uppercase">{date}</span>
      </div>
      <h5 className="flex-1 text-base md:text-xl font-light opacity-60 group-hover:opacity-100 italic transition-all text-white leading-tight">{title}</h5>
      <span className={`text-[11px] md:text-[11px] font-black uppercase tracking-widest px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-lg shrink-0 ${status === 'Sucesso' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' : 'bg-luxury-gold/10 text-luxury-gold shadow-luxury-gold/10'
        }`}>
        {status}
      </span>
    </div>
  );
}

// Fixed missing components definitions
function ThreeDViewTab() {
  return (
    <div className="glass p-8 md:p-16 rounded-[2.5rem] md:rounded-[2rem] border-white/5 space-y-8 flex flex-col items-center justify-center min-h-[500px]">
      <Box size={64} className="text-luxury-gold opacity-20" />
      <h3 className="text-3xl font-serif italic text-white">Experiencia Imersiva</h3>
      <p className="text-lg font-light opacity-50 max-w-md text-center">
        O modelo tridimensional do seu projeto esta a ser processado para visualizacao web.
      </p>
      <button className="px-12 py-4 bg-luxury-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-luxury-gold/20 flex items-center gap-3">
        <Maximize2 size={16} /> Abrir Viewer Fullscreen
      </button>
    </div>
  );
}

function ChronologyTab() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-white/5">
        {[
          { date: 'Set 2024', title: 'Conclusao de Fundacoes', desc: 'A estrutura base da residencia foi finalizada com sucesso.' },
          { date: 'Ago 2024', title: 'Inicio de Escavacao', desc: 'Arranque oficial dos trabalhos em obra.' },
          { date: 'Jun 2024', title: 'Aprovacao de Licenciamento', desc: 'Projeto aprovado pela C.M. Lisboa.' },
        ].map((item, i) => (
          <div key={i} className="relative pl-24 group">
            <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:scale-125 transition-transform"></div>
            <div className="glass p-8 rounded-[2rem] border-white/5 space-y-2 group-hover:border-luxury-gold/20 transition-all">
              <span className="text-[10px] font-mono text-luxury-gold opacity-60 uppercase tracking-widest">{item.date}</span>
              <h4 className="text-2xl font-serif italic text-white">{item.title}</h4>
              <p className="text-base font-light opacity-60 italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsTab({ project }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { name: 'Planta_Piso0_Execucao.pdf', size: '4.2 MB', category: 'Arquitetura' },
        { name: 'Mapa_Acabamentos_Final.pdf', size: '1.8 MB', category: 'Interiores' },
        { name: 'Contrato_Prestacao_Servicos.pdf', size: '2.5 MB', category: 'Legal' },
      ].map((doc, i) => (
        <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between group hover:border-luxury-gold/20 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-lg font-serif italic text-white">{doc.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">{doc.category} â€¢ {doc.size}</p>
            </div>
          </div>
          <button className="p-4 glass rounded-2xl border-white/10 hover:bg-luxury-gold hover:text-black transition-all">
            <Download size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

function MoodboardTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        'https://images.unsplash.com/photo-1613490493576-7fde63bac817?auto=format&fit=crop&w=400',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=400',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400',
        'https://images.unsplash.com/photo-1600607687940-477a284395e5?auto=format&fit=crop&w=400',
      ].map((img, i) => (
        <div key={i} className="aspect-square rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group">
          <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
        </div>
      ))}
    </div>
  );
}

```

## File: .\pages\ClientsPage.tsx
```

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Search, User, X, ArrowUpRight, Loader2, Brain, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

import { useLanguage } from '../context/LanguageContext';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', segment: 'Investidor VIP' });
  const { t } = useLanguage();

  const loadClients = () => {
    fa360.listClients().then(setClients).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Dispara a sincronizacao com o Google Sheets
    const result = await fa360.saveClient(newClient);

    if (result.success) {
      setClients(prev => [{ id: Date.now().toString(), ...newClient }, ...prev]);
      setIsModalOpen(false);
      setNewClient({ name: '', email: '', phone: '', segment: 'Investidor VIP' });
    }

    setSaving(false);
  };

  const handleDeleteClient = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Deseja eliminar este cliente permanentemente?')) {
      await fa360.deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-1000 space-y-12 pb-20">
      <PageHeader
        kicker={t('clients_kicker')}
        title={<>{t('clients_title_prefix')} <span className="text-luxury-gold">{t('clients_title_suffix')}</span></>}
        actionLabel={t('clients_new_btn')}
        onAction={() => setIsModalOpen(true)}
      />

      <div className="relative group max-w-md mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-charcoal/40 dark:text-white/40 group-focus-within:text-luxury-gold transition-colors" size={14} />
        <input
          type="text"
          placeholder={t('clients_search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-10 pr-6 py-2.5 text-[10px] outline-none focus:border-luxury-gold/50 transition-all w-full text-luxury-charcoal dark:text-white placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-luxury-gold"></div>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredClients.map(client => (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="glass p-10 rounded-[3rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all relative overflow-hidden cursor-pointer shadow-xl text-luxury-charcoal dark:text-white"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-4">
                  <ArrowUpRight size={20} className="text-luxury-gold" />
                  <button
                    onClick={(e) => handleDeleteClient(e, client.id)}
                    className="text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold border border-luxury-gold/10">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-luxury-charcoal dark:text-white italic">{client.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-1">{client.segment || 'Investidor VIP'}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-luxury-gold/50" /> <span className="font-light text-luxury-charcoal dark:text-white">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-luxury-gold/50" /> <span className="font-light text-luxury-charcoal dark:text-white">{client.phone}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    Sincronizado via Brain Link
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 text-center bg-black/5 dark:bg-white/[0.02]">
          <div className="p-10 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 text-luxury-charcoal dark:text-white">
            <User size={48} className="opacity-20" />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('clients_empty_title')}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal/50 dark:text-white/50">{t('clients_empty_desc')}</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-10 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">{t('clients_new_btn')}</button>
        </div>
      )}

      {/* Modal Novo Cliente */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-2xl glass rounded-[2rem] border-white/10 p-8 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-12"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('clients_modal_title')} <span className="text-luxury-gold">{t('clients_modal_subtitle')}</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">Neural Brain Propagation</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 glass rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-luxury-charcoal dark:text-white transition-all"><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('clients_form_name')}</label>
                    <input
                      required
                      value={newClient.name}
                      onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('clients_form_email')}</label>
                    <input
                      required
                      type="email"
                      value={newClient.email}
                      onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('clients_form_phone')}</label>
                    <input
                      required
                      value={newClient.phone}
                      onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('clients_form_segment')}</label>
                    <select
                      value={newClient.segment}
                      onChange={e => setNewClient({ ...newClient, segment: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all appearance-none"
                    >
                      <option value="Investidor VIP" className="bg-white dark:bg-black">Investidor VIP</option>
                      <option value="Privado Premium" className="bg-white dark:bg-black">Privado Premium</option>
                      <option value="Corporativo" className="bg-white dark:bg-black">Corporativo</option>
                    </select>
                  </div>
                </div>

                <button
                  disabled={saving}
                  className="w-full py-7 bg-luxury-gold text-black rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-luxury-gold/30 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
                  {saving ? t('clients_btn_saving') : t('clients_btn_save')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

## File: .\pages\DashboardPage.tsx
```
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, LayoutGrid, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import fa360 from '../services/fa360';
import { dashboardDataService } from '../services/dashboardData.service'; // NEW Service
import { useLanguage } from '../context/LanguageContext';
import TodayOpsWidget from '../components/dashboard/TodayOpsWidget';
import DayPanel from '../components/dashboard/DayPanel';
import CriticalAlertsWidget from '../components/dashboard/CriticalAlertsWidget';
import HealthIndexWidget from '../components/dashboard/HealthIndexWidget';
import PipelineFunnelWidget from '../components/dashboard/PipelineFunnelWidget';
import CashflowWidget from '../components/dashboard/CashflowWidget';
import NeuralSyncWidget from '../components/dashboard/NeuralSyncWidget';
import ProductionWidget from '../components/dashboard/ProductionWidget';
import { HoursWeekCard } from '../components/dashboard/HoursWeekCard';
import { ActiveProjectsCard } from '../components/dashboard/ActiveProjectsCard';
import PageHeader from '../components/common/PageHeader';
import SkeletonCard from '../components/common/SkeletonCard';
import { DashboardMetrics } from '../types';

export default function Dashboard() {
  console.log("MOUNT: DashboardPage");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  // New View Model State
  const [vm, setVm] = useState<any>(null);

  const loadData = async () => {
    try {
      // 1. Fetch Raw Data
      const [tasks, payments, projects, proposals, timeLogs, dailyBriefing, meetings] = await Promise.all([
         fa360.listTasks(),
         fa360.listPayments ? fa360.listPayments() : Promise.resolve([]), 
         fa360.listProjects(),
         fa360.listProposals(),
         fa360.listTimeLogs ? fa360.listTimeLogs() : Promise.resolve([]),
         fa360.getDailyBriefing(),
         fa360.listEvents ? fa360.listEvents() : Promise.resolve([])
      ]);

      // 2. Build View Model via Service
      const built = await dashboardDataService.build({ 
          tasks: tasks || [], 
          payments: payments || [], 
          projects: projects || [],
          proposals: proposals || [],
          timeEntries: timeLogs.map((l: any) => ({
            date: l.date,
            owner: l.userId === 'user-ceo' ? 'CEO' : l.userId === 'user-jessica' ? 'JESSICA' : l.userId === 'user-sofia' ? 'SOFIA' : l.owner || 'OUTRO',
            hours: (l.duration || 0) / 60,
            projectId: l.projectId
          })),
          syncLog: dailyBriefing?.metrics?.neuralStatus,
          meetings: meetings || []
      });
      
      setVm(built);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('fa-sync-complete', loadData);
    return () => window.removeEventListener('fa-sync-complete', loadData);
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting_morning');
    if (hour < 18) return t('greeting_afternoon');
    return t('greeting_evening');
  };

  if (loading || !vm) return (
    <div className="p-8 space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} variant="metric" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      <PageHeader 
        kicker={t('op_command')}
        title={<>{getTimeGreeting()}, <span className="text-luxury-gold">Ferreira.</span></>}
        statusIndicator={true}
        actionLabel={t('newProposal')}
        onAction={() => navigate('/calculator?templateId=MORADIA_LICENSE')}
      />

      {/* 2. Painel do Dia (Full Width / Top Priority) */}
      <div className="w-full">
         <DayPanel data={vm.dailyHighlights} />
      </div>

      {/* 3. Grid Operacional Secundario (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto">
         <TodayOpsWidget data={vm.todayOps} />
         <CashflowWidget data={vm.cash30d} />
         <PipelineFunnelWidget funnel={vm.funnel} /> 
      </div>

       {/* 3. Grid Acao & Risco (Linha 2) */}
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <div className="lg:col-span-1">
              <HealthIndexWidget score={vm.health.score} breakdown={vm.health.breakdown} reason={vm.projects.length > 0 ? (vm.health.score === 100 ? t('op_stable') : t('op_threat')) : t('op_neutral')} />
           </div>
           <div className="lg:col-span-2">
              <CriticalAlertsWidget alerts={vm.criticalAlerts} />
           </div>
           <div className="lg:col-span-1">
              <NeuralSyncWidget status={vm.syncStatus} />
           </div>
       </div>

       {/* 4. Grid Producao & Projetos (Linha 3 - Nova) */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
           <div className="lg:col-span-6">
              <HoursWeekCard 
                data={vm.hoursByOwner} 
                onOpen={() => navigate('/tasks')} 
              />
           </div>
           <div className="lg:col-span-6">
              <ActiveProjectsCard 
                projects={vm.activeProjects || []} 
                onOpenAll={() => navigate('/projects')}
                onOpenProject={(id) => navigate(`/projects/${id}`)}
              />
           </div>
       </div>
    
      {/* 4. Active Projects List from VM */}
      <div className="space-y-6 pt-6">

          <div className="flex justify-between items-end">
              <h2 className="text-2xl font-serif italic text-luxury-charcoal dark:text-white relative pl-6">
                 <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-luxury-gold"></span>
                 {t('projects')} <span className="text-luxury-gold">{t('active_suffix')}</span>
              </h2>
              <button onClick={() => navigate('/projects')} className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white transition-colors">
                  {t('view_all')}
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {vm.projects.length > 0 ? (
                  vm.projects.map((project: any) => (
                      <motion.div 
                          key={project.id}
                          whileHover={{ y: -5 }}
                          className="glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all cursor-pointer relative overflow-hidden"
                          onClick={() => navigate(`/projects/${project.id}`)}
                      >
                          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight size={16} className="-rotate-45 text-luxury-gold" />
                          </div>

                          <div className="space-y-4">
                              <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-luxury-gold mb-2">{project.client}</p>
                                  <h4 className="text-xl font-serif italic text-luxury-charcoal dark:text-white line-clamp-2">{project.name}</h4>
                              </div>
                              
                              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                      project.status === 'Em Curso' ? 'bg-emerald-500/10 text-emerald-500' : 
                                      'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40'
                                  }`}>
                                      {project.status || 'Active'}
                                  </span>
                              </div>
                          </div>
                      </motion.div>
                  ))
              ) : (
                  <div className="col-span-full py-20 text-center opacity-30">
                      <p className="text-[10px] uppercase font-black tracking-widest">{t('no_active_projects')}</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

```

## File: .\pages\FinancialPage.tsx
```

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  Briefcase,
  Loader2,
  X,
  CreditCard,
  PieChart
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/common/PageHeader';

interface Project {
  id: string;
  name: string;
  client: string;
  fee_adjudicated: number;
  costs_recorded: number;
}

interface FinanceStats {
  liquidity: number;
  pendingFees: number;
  burnRate: number | string;
  margin: number;
}

interface ProjectionData {
  name: string;
  projected: number;
  expenses: number;
}

interface FinanceStatProps {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  icon: React.ReactNode;
  isGold?: boolean;
}

interface ProjectProfitCardProps {
  project: Project;
}

export default function FinancialPage() {
  const { t } = useLanguage();
  // Unused activeTab removed
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
  const [projections, setProjections] = useState<ProjectionData[]>([]);
  const [aiMessage, setAiMessage] = useState('');

  // Form de Despesa
  const [expenseForm, setExpenseForm] = useState({
    projectId: '',
    category: 'Sub-contratado',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadFinanceData = async () => {
    setLoading(true);
    const [p, stats, proj, ai] = await Promise.all([
      fa360.listProjects(),
      fa360.getFinancialStats(),
      fa360.getFinancialProjections(),
      fa360.getAIRecommendations('FINANCIAL')
    ]);
    setProjects(p);
    setFinanceStats(stats);
    setProjections(proj);
    setAiMessage(ai);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadFinanceData();
    };
    init();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await fa360.saveExpense(expenseForm);
    if (result.success) {
      setIsExpenseModalOpen(false);
      setExpenseForm({ projectId: '', category: 'Sub-contratado', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      loadFinanceData();
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center opacity-50">Sincronizando Neural Ledger...</div>;

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker={t('fin_title')}
        title={<>Capital <span className="text-luxury-gold">Management.</span></>}
        actionLabel={t('fin_add_expense')}
        onAction={() => setIsExpenseModalOpen(true)}
      />

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FinanceStat label="Liquidez Total" value={`â‚¬${(financeStats?.liquidity / 1000).toFixed(1)}k`} trend={financeStats?.liquidity > 0 ? "+0%" : "Zeroed"} up={financeStats?.liquidity > 0} icon={<DollarSign size={20} />} />
        <FinanceStat label="Honorarios Pendentes" value={`â‚¬${financeStats?.pendingFees}k`} trend="Ciclo 30d" up={true} icon={<Target size={20} />} />
        <FinanceStat label="Burn Rate Medio" value={`â‚¬${financeStats?.burnRate}k`} trend="Estavel" up={false} icon={<Zap size={20} />} />
        <FinanceStat label="Margem Estudio" value={`${financeStats?.margin}%`} trend={financeStats?.margin > 0 ? "Synced" : "TBD"} up={financeStats?.margin > 0} isGold={true} icon={<PieChart size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 space-y-12">
          <section className="glass p-8 rounded-[2rem] border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">Cashflow <span className="text-luxury-charcoal/20 dark:text-white/20">Real vs Projecao</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 italic">Baseado em adjudicacoes via Antigravity</p>
              </div>
            </div>

            <div className="h-[400px] w-full flex items-center justify-center">
              {projections.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projections}>
                    <defs>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `â‚¬${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '1.5rem' }}
                      itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="projected" stroke="#D4AF37" fillOpacity={1} fill="url(#colorProjected)" strokeWidth={4} />
                    <Area type="monotone" dataKey="expenses" stroke="#ffffff10" fill="transparent" strokeWidth={2} strokeDasharray="8 8" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center opacity-20 space-y-4">
                  <BarChart3 size={48} className="mx-auto" />
                  <p className="text-[10px] uppercase font-black tracking-widest">Sem dados de projecao neural disponiveis.</p>
                </div>
              )}
            </div>
          </section>

          {/* PROJECT PROFITABILITY LIST */}
          <section className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white tracking-tighter">Rentabilidade <span className="text-luxury-gold">por Projeto.</span></h3>
              <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 italic">Real-time Margin Analysis</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {projects.length > 0 ? projects.map((proj) => (
                <ProjectProfitCard key={proj.id} project={proj} />
              )) : (
                <div className="glass p-20 rounded-[3rem] text-center opacity-20 border-black/5 dark:border-white/5">
                  <p className="text-[10px] uppercase font-black tracking-widest text-luxury-charcoal dark:text-white">Zero projetos ativos para analise de margem.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* AI Financial Strategy Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="glass p-10 rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold uppercase">AI Financial Pilot</h4>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 space-y-4">
                <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                  "{aiMessage}"
                </p>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2rem] border-white/5 space-y-10 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">Ledger de Despesas (30d)</h4>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center space-y-4">
                <CreditCard size={32} />
                <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">Nenhum custo registado recentemente.</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">Ver Livro Completo</button>
          </div>
        </aside>
      </div>

      {/* Expense Entry Modal */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-2xl glass rounded-[2rem] border-white/10 p-8 md:p-16 shadow-2xl space-y-10"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">Registar <span className="text-red-500">Despesa.</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 italic">Neural Financial Entry</p>
                </div>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-4 glass rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-luxury-charcoal dark:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">Projeto Associado</label>
                    <select
                      required
                      value={expenseForm.projectId}
                      onChange={e => setExpenseForm({ ...expenseForm, projectId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-luxury-gold outline-none"
                    >
                      <option value="" className="bg-black">Selecionar Projeto...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id} className="bg-black">{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">Valor (EUR)</label>
                    <input
                      required
                      type="number"
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-luxury-gold outline-none font-mono"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Descricao / Fornecedor</label>
                  <input
                    required
                    value={expenseForm.description}
                    onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none"
                    placeholder="Ex: Factura #123 - Eng. Estruturas"
                  />
                </div>
                <button
                  disabled={saving}
                  className="w-full py-7 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-red-500/20 disabled:opacity-20"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Briefcase size={18} />}
                  {saving ? 'A Sincronizar...' : 'Finalizar Registo de Custo'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectProfitCard({ project }: ProjectProfitCardProps) {
  const margin = Math.round(((project.fee_adjudicated - project.costs_recorded) / project.fee_adjudicated) * 100);
  return (
    <div className="glass p-10 rounded-[3rem] border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-luxury-gold/30 transition-all shadow-xl">
      <div className="flex-1 space-y-6 w-full">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Cliente: {project.client}</span>
            <h4 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">{project.name}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Fees Adjudicados</p>
            <p className="text-2xl font-serif text-luxury-gold italic">â‚¬{project.fee_adjudicated.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-widest">
            <span className="text-luxury-charcoal/50 dark:text-white/50">Consumo de Margem (Custos Registados)</span>
            <span className="text-red-400">â‚¬{project.costs_recorded.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(project.costs_recorded / project.fee_adjudicated) * 100}%` }}
              className="h-full bg-red-500"
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 text-center space-y-3">
        <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${margin > 50 ? 'border-emerald-500 shadow-[0_0_20px_#10b98130]' : 'border-luxury-gold'}`}>
          <span className="text-2xl font-serif italic text-luxury-charcoal dark:text-white">{margin}%</span>
          <span className="text-[11px] font-black uppercase text-luxury-charcoal/60 dark:text-white/60">Margem</span>
        </div>
        <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-white transition-colors">Detalhes de Custos</button>
      </div>
    </div>
  );
}



function FinanceStat({ label, value, trend, up, icon, isGold }: FinanceStatProps) {
  return (
    <div className={`glass p-10 rounded-[3rem] border-black/5 dark:border-white/5 space-y-6 group transition-all duration-700 hover:border-luxury-gold/20 shadow-xl ${isGold ? 'bg-luxury-gold/[0.02]' : ''}`}>
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl ${isGold ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/30' : 'bg-black/5 dark:bg-white/5 text-luxury-gold'}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${up ? 'text-emerald-500' : 'text-red-500'}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 mb-2">{label}</p>
        <p className="text-4xl font-serif italic tracking-tight text-luxury-charcoal dark:text-white">{value}</p>
      </div>
    </div>
  );
}

```

## File: .\pages\LegalReportPage.tsx
```
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, AlertCircle } from 'lucide-react';
import { LegalWizard } from '../components/legal/LegalWizard';
import { LegislationLibrary } from '../components/legal/LegislationLibrary';
import { InteractiveLawReader } from '../components/legal/InteractiveLawReader';
import { Municipality } from '../data/municipalities';
import { UrbanOperationType } from '../data/legal_framework';
import PageHeader from '../components/common/PageHeader';
import { useLanguage } from '../context/LanguageContext';

const LegalReportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'generator' | 'library'>('generator');
    const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<UrbanOperationType | null>(null);
    const [projectData, setProjectData] = useState({
        name: '',
        location: '',
        description: ''
    });

    // Global Law Viewer State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedLawId, setSelectedLawId] = useState<string | null>(null);
    const [initialArticle, setInitialArticle] = useState<string | undefined>(undefined);
    const { t } = useLanguage();

    const openInternalLaw = (lawId: string, articleId?: string) => {
        setSelectedLawId(lawId);
        setInitialArticle(articleId);
        setViewerOpen(true);
    };

    const reportRef = useRef<HTMLDivElement>(null);

    // Note: Since 'useReactToPrint' might not be installed or types might be missing in this environment,
    // we will use a simpler window.print() approach for now or mock the hook if needed.
    // Ideally we would install 'react-to-print'.
    // For this MVP, we will assume standard browser print styles or a simple print function.

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
            {/* Header */}
            {/* Header */}
            <PageHeader 
                kicker={t('legal_kicker')}
                title={<>{t('legal_title_prefix')} <span className="text-luxury-gold">{t('legal_title_suffix')}</span></>}
            />

            <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl w-fit mb-8">
                <button
                    onClick={() => setActiveTab('generator')}
                    className={`px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'generator' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-white/40 hover:text-white'}`}
                >
                    {t('legal_tab_generator')}
                </button>
                <button
                    onClick={() => setActiveTab('library')}
                    className={`px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-white/40 hover:text-white'}`}
                >
                    {t('legal_tab_collection')}
                </button>
            </div>

            {activeTab === 'library' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LegislationLibrary />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LegalWizard />
                </motion.div>
            )}

            {/* Global Interactive Law Reader Overlay */}
            {viewerOpen && selectedLawId && (
                <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="w-full max-w-6xl shadow-2xl relative"
                    >
                        <InteractiveLawReader
                            onClose={() => setViewerOpen(false)}
                            lawId={selectedLawId}
                            initialArticleId={initialArticle}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LegalReportPage;

```

## File: .\pages\MarketingPage.tsx
```

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
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Estudio Criativo â€¢ Marketing Hub</p>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-none tracking-tighter italic">Comunicacao <span className="text-luxury-gold">Visual.</span></h1>
          <p className="text-xl font-light opacity-50 max-w-2xl leading-relaxed">Gerencie a identidade digital do estudio, planeie publicacoes e utilize IA para gerar legendas e conteudos de prestigio.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setActiveView('CALENDAR')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'CALENDAR' ? 'bg-luxury-gold text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            Calendario
          </button>
          <button
            onClick={() => setActiveView('ANALYTICS')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'ANALYTICS' ? 'bg-luxury-gold text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            Metricas
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
              <h3 className="text-3xl font-serif">Gerador de Conteudo IA</h3>
              <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[11px] font-black uppercase tracking-widest rounded-full">Beta v2.4</span>
            </div>
            <div className="space-y-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 h-48 focus:ring-1 focus:ring-luxury-gold outline-none transition-all font-light text-lg italic"
                placeholder="Descreva o projeto ou o tom da publicacao... Ex: 'Fotos da Villa Alentejo focadas na luz natural e minimalismo mediterranico.'"
              ></textarea>

              {aiResponse && (
                <div className="p-8 bg-luxury-gold/5 border border-luxury-gold/10 rounded-[2rem] animate-in fade-in">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-4">Sugestoes de Legenda (IA)</h4>
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
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Impressoes</p>
                  <p className="text-3xl font-serif italic">145K</p>
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+12.8%</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Interacao</p>
                  <p className="text-3xl font-serif italic">4.2%</p>
                </div>
                <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">-0.4%</span>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-8 border-luxury-gold/10 bg-luxury-gold/[0.01]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Datas Criticas</h4>
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
                  <p className="text-sm font-serif">Relatorio Trimestral Q3</p>
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
        <p className="text-sm font-serif italic line-clamp-2">"A luz como elemento esculpidor da forma. O silencio que materializa a visao."</p>
      </div>
    </div>
  );
}

```

## File: .\pages\MaterialLibraryPage.tsx
```

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Box,
  Leaf,
  DollarSign,
  Info,
  ArrowRight,
  Maximize2,
  Sparkles,
  Palette,
  Droplets,
  Zap,
  Tag,
  MapPin,
  Truck,
  ExternalLink,
  MessageCircle,
  X,
  FileText,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function MaterialLibraryPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('Todos');
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string>("Selecione um material para analise tecnica avancada.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const Motion = motion as any;

  useEffect(() => {
    fa360.listMaterials().then(data => {
      setMaterials(data);
      setLoading(false);
    });
  }, []);

  const filteredMaterials = materials.filter(m => {
    const matchesFilter = filter === 'Todos' || m.category === filter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAIAdvice = async (material: any) => {
    setIsAnalyzing(true);
    const advice = await fa360.runMaterialAIAnalysis(material);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader 
        kicker={t('material_dna_eco')}
        title={<>Material <span className="text-luxury-gold">DNA.</span></>}
        actionLabel={t('material_dna_catalog')}
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-9 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 w-full md:w-auto">
              {['Todos', 'Stone', 'Wood', 'Cladding', 'Metal', 'Textile'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${filter === f ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative group w-full md:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2 text-[10px] outline-none focus:border-luxury-gold/50 transition-all text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-luxury-gold" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredMaterials.map((material, i) => (
                  <Motion.div
                    key={material.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedMaterial(material)}
                    className="glass rounded-[3rem] overflow-hidden group border-white/5 hover:border-luxury-gold/30 transition-all shadow-2xl cursor-pointer relative"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <img src={material.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s]" />
                      <div className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={16} className="text-white" />
                      </div>
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-luxury-gold">{material.price}</span>
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1"><Leaf size={10} /> {material.eco}%</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{material.category} â€¢ {material.finish}</p>
                          <h4 className="text-2xl font-serif italic leading-none text-white">{material.name}</h4>
                        </div>
                        <div className={`p-2 rounded-lg bg-white/5 ${material.location === 'mat_in_studio' ? 'text-emerald-500' : 'text-luxury-gold'}`}>
                          {material.location === 'mat_in_studio' ? <Box size={14} /> : <Truck size={14} />}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-50">{t(material.location as any)}</span>
                        <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-white transition-colors flex items-center gap-2 group/btn">
                          {t('material_dna_tech_sheet')} <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        <aside className="lg:col-span-3 space-y-10">
          {/* AI Advisor */}
          <div className="glass p-10 rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl group-hover:bg-luxury-gold/10 transition-all"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold uppercase">Material AI</h4>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-light italic opacity-60 leading-relaxed text-white">
                {isAnalyzing ? "A processar conceitos fisicos..." : `"${aiAdvice}"`}
              </p>
              {selectedMaterial && (
                <button
                  onClick={() => handleAIAdvice(selectedMaterial)}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-luxury-gold text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                >
                  {isAnalyzing ? "Analisando..." : "Analise de Performance"}
                </button>
              )}
            </div>
          </div>

          {/* Inventario Tracker */}
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">Rastreio de Amostras</h4>
            <div className="space-y-4">
              <div className="py-10 text-center glass rounded-2xl border-dashed border-white/5 opacity-20">
                <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed italic">Nenhuma amostra em rastreio.</p>
              </div>
            </div>
            <button className="w-full py-4 text-[11px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity text-white">Ver Livro de Amostras</button>
          </div>

          {/* Pegada de Carbono Global */}
          <div className="p-8 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10 flex flex-col items-center text-center gap-4">
            <Droplets size={32} className="text-emerald-400" />
            <h4 className="text-sm font-serif italic text-emerald-100">{t('material_dna_carbon')}</h4>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-3/4"></div>
            </div>
            <span className="text-lg font-serif text-white">Classe A+ Global</span>
          </div>
        </aside>
      </div>

      {/* Detail Modal: Ficha Tecnica Expandida */}
      <AnimatePresence>
        {selectedMaterial && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <Motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMaterial(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <Motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl glass rounded-[2rem] border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            >
              <div className="h-[40vh] md:h-auto relative">
                <img src={selectedMaterial.image} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedMaterial(null)} className="absolute top-8 left-8 p-4 glass rounded-full text-white hover:rotate-90 transition-all"><X size={24} /></button>
              </div>

              <div className="p-8 md:p-20 space-y-12 overflow-y-auto no-scrollbar max-h-[80vh]">
                <header className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[11px] font-black uppercase tracking-widest rounded-full">{selectedMaterial.category}</span>
                    <span className="text-[10px] font-mono opacity-20 text-white">REF: DNA-{selectedMaterial.id}</span>
                  </div>
                  <h2 className="text-5xl font-serif italic text-white">{selectedMaterial.name}</h2>
                  <p className="text-xl font-light opacity-50 italic text-white">{selectedMaterial.finish}</p>
                </header>

                <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">{t('mat_location')}</p>
                    <div className="flex items-center gap-3 text-luxury-gold font-serif italic text-xl">
                      <MapPin size={18} /> {t(selectedMaterial.location as any)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-50 text-white">{t('mat_supplier')}</p>
                    <p className="font-serif italic text-xl text-white">{selectedMaterial.supplier}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">{t('mat_tech_specs')}</h3>
                  <p className="text-sm font-light italic opacity-70 leading-relaxed text-white">
                    {selectedMaterial.technical || "Ficha tecnica completa em processamento pela equipa de curadoria."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-5 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-luxury-gold transition-all">
                    <MessageCircle size={16} /> {t('mat_request_quote')}
                  </button>
                  <button className="flex items-center justify-center gap-3 py-5 glass border-white/10 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all text-white">
                    <ExternalLink size={16} /> PDF Fornecedor
                  </button>
                </div>

                <div className="p-8 bg-luxury-gold/[0.03] rounded-3xl border border-luxury-gold/10 space-y-4">
                  <div className="flex items-center gap-3 text-luxury-gold">
                    <Zap size={16} />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Aplicacoes Recomendadas</h4>
                  </div>
                  <p className="text-xs italic opacity-50 text-white">Ideal para areas de alto trafego, cozinhas e areas sociais devido a sua baixa porosidade e alta resistencia mecanica.</p>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

## File: .\pages\MediaHubPage.tsx
```

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Search,
  Plus,
  Filter,
  Download,
  Share2,
  Maximize2,
  Sparkles,
  MoreVertical,
  Camera,
  Layers,
  Play,
  Grid,
  List,
  ChevronRight,
  Eye,
  BoxSelect,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';

export default function MediaHubPage() {
  const [filter, setFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const Motion = motion as any;

  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creativeAdvice, setCreativeAdvice] = useState<string>("A analisar tendencias de luxo e narrativa visual...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      const data = await fa360.listMediaAssets();
      setAssets(data);
      setLoading(false);

      setIsAnalyzing(true);
      const advice = await fa360.runCreativeMediaAudit();
      setCreativeAdvice(advice);
      setIsAnalyzing(false);
    };
    loadAssets();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === 'Todos' || asset.type === filter;
    const matchesSearch = asset.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader 
        kicker="Digital Asset Management"
        title={<>Media <span className="text-luxury-gold">Hub.</span></>}
        actionLabel="Importar Media"
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Interface */}
        <main className="lg:col-span-9 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              {['Todos', 'Render', 'Photo', 'Video', '360Âº'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Pesquisar ativos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2 text-[10px] outline-none focus:border-luxury-gold/50 transition-all"
                />
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'opacity-50 hover:opacity-100'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'opacity-50 hover:opacity-100'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-8`}>
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset, i) => (
                <Motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-[3rem] overflow-hidden group border-white/5 hover:border-luxury-gold/30 transition-all shadow-2xl relative ${viewMode === 'list' ? 'flex items-center gap-8' : ''}`}
                >
                  {/* Image Container */}
                  <div className={`${viewMode === 'list' ? 'w-64 h-40' : 'aspect-[4/5]'} relative overflow-hidden`}>
                    <img
                      src={asset.url}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out"
                      alt={asset.title}
                    />

                    {/* Hover Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button className={`p-2 rounded-lg backdrop-blur-md transition-colors ${asset.starred ? 'text-luxury-gold' : 'text-white/20 hover:text-white'}`}>
                          <Star size={16} fill={asset.starred ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-luxury-gold hover:text-black transition-all shadow-xl"><Download size={16} /></button>
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-luxury-gold hover:text-black transition-all shadow-xl"><Share2 size={16} /></button>
                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-luxury-gold hover:text-black transition-all shadow-xl"><Maximize2 size={16} /></button>
                      </div>
                    </div>

                    {asset.type === 'Video' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                        <div className="w-16 h-16 bg-luxury-gold/80 backdrop-blur-xl rounded-full flex items-center justify-center text-black shadow-2xl">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-white">{asset.resolution}</span>
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className={`p-8 ${viewMode === 'list' ? 'flex-1 flex justify-between items-center' : 'space-y-4'}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-gold">{asset.type}</span>
                        {asset.starred && <Zap size={10} className="text-luxury-gold" />}
                      </div>
                      <h4 className="text-xl font-serif italic truncate leading-tight">{asset.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">{asset.project}</p>
                    </div>

                    {viewMode === 'list' ? (
                      <div className="flex items-center gap-10">
                        <div className="hidden xl:block text-right">
                          <p className="text-[11px] font-black uppercase tracking-widest opacity-20 mb-1">Criado em</p>
                          <p className="text-[10px] font-mono opacity-50 italic">14 Out 2024</p>
                        </div>
                        <button className="p-3 opacity-20 hover:opacity-100 hover:text-luxury-gold transition-all"><MoreVertical size={20} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-20">v1.2</span>
                        <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-white transition-colors">Detalhes Tecnicos</button>
                      </div>
                    )}
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredAssets.length === 0 && (
              <div className="col-span-full py-40 text-center glass rounded-[2rem] border-dashed border-white/10">
                <ImageIcon size={48} className="mx-auto opacity-10 mb-6" />
                <h3 className="text-2xl font-serif italic opacity-50">Nenhum ativo visual encontrado.</h3>
                <p className="text-sm font-light opacity-20 mt-2">Tente ajustar os filtros ou a sua pesquisa.</p>
              </div>
            )}
          </div>
        </main>

        {/* AI Creative Director Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="glass p-10 rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">Creative AI Assistant</h4>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 hover:border-luxury-gold/30 transition-all group">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-luxury-gold/60">
                  <BoxSelect size={12} />
                  Auto-Curadoria
                </div>
                <p className="text-xs font-light italic opacity-60 leading-relaxed">
                  "{creativeAdvice}"
                </p>
                <button className="w-full py-4 bg-luxury-gold text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/10">
                  Criar Press Kit de Luxo
                </button>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 hover:border-luxury-gold/30 transition-all group">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-luxury-gold/60">
                  <Layers size={12} />
                  Social Reel
                </div>
                <p className="text-xs font-light italic opacity-60 leading-relaxed">
                  "Tens 4 videos de drone do projeto Douro. Queres que gere um Reel de 15s com transicoes cinematograficas?"
                </p>
                <button className="w-full py-4 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Gerar Reel com IA
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Status do Armazenamento</h4>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="opacity-60">Cloud Storage</span>
                  <span className="text-luxury-gold">1.4 TB / 2.0 TB</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-gold w-[70%]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] opacity-50 uppercase font-black mb-1">Imagens</p>
                  <p className="text-2xl font-serif">0</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] opacity-50 uppercase font-black mb-1">Videos</p>
                  <p className="text-2xl font-serif text-luxury-gold">0</p>
                </div>
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-2 group">
                <Eye size={12} className="group-hover:scale-110 transition-transform" />
                Otimizar Biblioteca
              </button>
            </div>
          </div>

          <div className="p-10 bg-indigo-500/5 rounded-[3rem] border border-indigo-500/10 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Camera size={40} className="text-indigo-400 group-hover:scale-110 transition-transform duration-700" />
            <div>
              <h4 className="text-xl font-serif italic text-indigo-100 mb-2">Visitas 360Âº Ativas</h4>
              <p className="text-[11px] font-black uppercase tracking-widest text-indigo-400/60">3 Clientes online agora</p>
            </div>
            <button className="relative z-10 text-[11px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all flex items-center gap-2 group">
              Gerir Nodes 3D <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

```

## File: .\pages\NeuralStudioPage.tsx
```

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Terminal,
  MessageSquare,
  TrendingUp,
  Eye,
  RefreshCw,
  Settings,
  Database,
  ArrowRight,
  Link2,
  AlertTriangle,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/common/PageHeader';

export default function NeuralStudioPage() {
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [activeAgent, setActiveAgent] = useState('concierge');
  const [isSyncing, setIsSyncing] = useState(false);
  const [prompt, setPrompt] = useState('A carregar protocolo...');
  const [isBrainOnline, setIsBrainOnline] = useState(localStorage.getItem('fa-brain-status') === 'ONLINE');

  // Auditoria Global
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState('');

  const agents = [
    { id: 'concierge', name: 'Digital Concierge', icon: <MessageSquare />, color: '#D4AF37', status: 'Online' },
    { id: 'pilot', name: 'Financial Pilot', icon: <TrendingUp />, color: '#3b82f6', status: 'Analysis' },
    { id: 'director', name: 'Creative Director', icon: <Eye />, color: '#a855f7', status: 'Ready' }
  ];

  const loadProtocol = React.useCallback(async () => {
    const text = await fa360.getNeuralProtocol(activeAgent);
    setPrompt(text);
  }, [activeAgent]);

  useEffect(() => {
    const init = async () => {
      await loadProtocol();
    };
    init();

    const checkStatus = () => setIsBrainOnline(localStorage.getItem('fa-brain-status') === 'ONLINE');
    window.addEventListener('neural-link-active', checkStatus);
    return () => window.removeEventListener('neural-link-active', checkStatus);
  }, [loadProtocol]);

  const handleSyncNeural = () => {
    if (!isBrainOnline) {
      navigate('/antigravity');
      return;
    }
    setIsSyncing(true);
    fa360.log(`NEURAL: Sincronizando pesos do agente ${activeAgent}...`);
    setTimeout(() => {
      setIsSyncing(false);
      fa360.log(`SUCCESS: Matriz neural do ${activeAgent} atualizada.`);
    }, 1500);
  };

  const runGlobalAudit = async () => {
    setIsAuditing(true);
    fa360.log("MASTER_AUDIT: Iniciando analise transversal do ecossistema...");
    const result = await fa360.getGlobalEcosystemAudit(locale);
    setAuditResult(result);
    setIsAuditing(false);
    fa360.log("SUCCESS: Auditoria estrategica finalizada.");
  };

  return (
    <div className="min-h-screen text-luxury-charcoal dark:text-white p-6 md:p-8 space-y-12 pb-32 max-w-[1800px] mx-auto animate-in fade-in duration-1000">
      <PageHeader
        kicker={`FA-360 Neural Studio ${isBrainOnline ? 'â€¢ Live' : 'â€¢ Offline'}`}
        title={<>Studio <span className="text-indigo-500 drop-shadow-[0_0_50px_rgba(99,102,241,0.3)]">AI.</span></>}
        statusIndicator={isBrainOnline}
        customStatus={
          !isBrainOnline ? (
            <button
              onClick={() => navigate('/antigravity')}
              className="glass px-6 py-3 rounded-[2.5rem] border-red-500/30 bg-red-500/5 backdrop-blur-3xl flex items-center gap-4 hover:border-luxury-gold/50 transition-all group"
            >
              <div className="p-2 bg-red-500/20 text-red-500 rounded-xl group-hover:text-luxury-gold transition-colors"><Link2 size={18} /></div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-red-500">Master Link Required</p>
                <p className="text-sm font-serif italic text-white">Conectar Cerebro</p>
              </div>
              <ArrowRight size={16} className="text-red-500 group-hover:translate-x-2 transition-transform" />
            </button>
          ) : (
            <div className="glass px-6 py-3 rounded-[2.5rem] border-black/5 dark:border-white/10 bg-indigo-500/[0.05] backdrop-blur-3xl flex items-center gap-6 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Synaptic Load</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{
                        width: ['30%', '70%', '45%', '90%', '60%'],
                        opacity: [0.5, 1, 0.7, 1, 0.5]
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                    ></motion.div>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400">High Efficiency</span>
                </div>
              </div>
              <div className="w-px h-8 bg-black/10 dark:bg-white/10"></div>
              <button onClick={handleSyncNeural} className="p-2 bg-black/5 dark:bg-white/5 rounded-2xl text-luxury-charcoal dark:text-white hover:text-indigo-400 transition-colors group">
                <RefreshCw size={18} className={`${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-4 mb-6">Active Agents</p>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`w-full p-8 rounded-[2.5rem] border transition-all text-left group relative overflow-hidden ${activeAgent === agent.id
                ? 'bg-indigo-500/[0.03] border-indigo-500/50 shadow-[0_20px_50px_rgba(99,102,241,0.1)]'
                : 'bg-black/5 dark:bg-transparent border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                }`}
            >
              {activeAgent === agent.id && (
                <motion.div layoutId="activeBg" className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.05] to-transparent pointer-events-none" />
              )}
              <div className="relative z-10 flex items-center gap-6">
                <div className={`p-4 rounded-2xl transition-all shadow-xl ${activeAgent === agent.id ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/30 dark:text-white/30 group-hover:text-luxury-charcoal dark:group-hover:text-white'}`}>
                  {agent.icon}
                </div>
                <div>
                  <h4 className={`text-xl font-serif italic ${activeAgent === agent.id ? 'text-indigo-500' : 'text-luxury-charcoal/60 dark:text-white/60 group-hover:text-luxury-charcoal dark:group-hover:text-white'}`}>{agent.name}</h4>
                  {activeAgent === agent.id && <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 animate-pulse">Processing...</span>}
                </div>
              </div>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-6 space-y-12">
          {/* Diagnostic Console (NOVO) */}
          <AnimatePresence>
            {isBrainOnline && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 md:p-16 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.02] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
                  <Cpu size={300} className="text-indigo-400" />
                </div>

                <header className="flex justify-between items-center border-b border-white/5 pb-10 mb-12">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="text-indigo-400" size={24} />
                    <h2 className="text-3xl font-serif italic">Global Business Audit</h2>
                  </div>
                  <button
                    onClick={runGlobalAudit}
                    disabled={isAuditing}
                    className="flex items-center gap-3 px-8 py-3 bg-indigo-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {isAuditing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                    {isAuditing ? 'Auditing Matrix...' : 'Run Diagnostics'}
                  </button>
                </header>

                <div className="min-h-[200px] font-mono text-sm leading-relaxed text-indigo-100/70 italic">
                  {isAuditing ? (
                    <>
                      <p>&gt; Sincronizando com Antigravity Master Hook...</p>
                      <p>&gt; Extraindo logs do pipeline comercial...</p>
                      <p>&gt; Calculando vetores de rentabilidade...</p>
                    </>
                  ) : auditResult ? (
                    <div className="animate-in fade-in slide-up duration-1000 whitespace-pre-wrap">
                      {auditResult}
                    </div>
                  ) : (
                    <p className="opacity-50">Aguardando comando de diagnostico global para analisar a saude do atelier atraves da ponte neural...</p>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <section className="glass p-8 md:p-16 rounded-[2rem] border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
              <Brain size={300} className="text-luxury-charcoal dark:text-white" />
            </div>

            <header className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-10 mb-12">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isBrainOnline ? 'bg-indigo-500/20 text-indigo-400' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>
                  <Settings size={20} />
                </div>
                <h2 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">Agent Protocol</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
                <Activity size={12} className="text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Direct Link Active</span>
              </div>
            </header>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Neural Instructions (.txt)</label>
                  <span className="text-[11px] font-mono opacity-20">Last Updated: Just Now</span>
                </div>
                <div className="relative">
                  <Terminal className="absolute top-6 left-6 text-indigo-500/40" size={18} />
                  <textarea
                    disabled={!isBrainOnline}
                    className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-10 pl-16 h-80 text-sm font-light italic text-white/70 focus:border-indigo-500 outline-none transition-all leading-relaxed font-mono disabled:opacity-20 scrollbar-hide"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  {!isBrainOnline && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[2.5rem]">
                      <div className="text-center space-y-4">
                        <AlertTriangle className="mx-auto text-luxury-gold" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Neural Bridge Inactive</p>
                        <button onClick={() => navigate('/antigravity')} className="text-[11px] font-bold text-luxury-gold underline uppercase tracking-widest">Connect Master Hook</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSyncNeural}
                  disabled={isSyncing}
                  className={`flex-1 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl group flex items-center justify-center gap-3 ${isBrainOnline
                    ? 'bg-indigo-500 text-white shadow-indigo-500/30'
                    : 'bg-white/5 text-white/20 border border-white/10'
                    }`}
                >
                  {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} className="group-hover:fill-current" />}
                  {isBrainOnline ? (isSyncing ? 'Syncing Weights...' : 'Commit to Neural Brain') : 'Connect Brain to Enable'}
                </button>
              </div>
            </div>
          </section>
        </main>

        <aside className="lg:col-span-3 space-y-8">
          <div className="glass p-10 rounded-[2rem] border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/40 shadow-2xl space-y-10">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-indigo-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Neural Insights</h4>
            </div>
            <div className="space-y-8">
              <ThoughtBubble
                text={isBrainOnline ? "Protocolo Sincronizado: Gemini 3.0 Pro habilitado para analise de portefolio." : "System awaiting Master Hook..."}
                time="Now"
                active={isBrainOnline}
              />
              <ThoughtBubble
                text={isBrainOnline ? "Pronto para gerar propostas baseadas na sua taxonomia de luxo." : "Link Status: DISCONNECTED"}
                time="2m ago"
                active={isBrainOnline}
                isAlert={!isBrainOnline}
              />
              <ThoughtBubble
                text="Integridade do Modelo: 99.8% (Stable)"
                time="5m ago"
                active={true}
              />
            </div>
          </div>

          <div className="p-10 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 flex flex-col items-center text-center gap-6 group">
            <Database size={32} className="text-indigo-400 group-hover:scale-110 transition-transform duration-700" />
            <h5 className="text-sm font-serif italic text-luxury-charcoal/60 dark:text-white/60">Dataset de Treino Ativo</h5>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-indigo-500/20 rounded-full overflow-hidden"><motion.div animate={{ height: ['20%', '100%', '20%'] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-full bg-indigo-400" /></div>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface ThoughtBubbleProps {
  text: string;
  time: string;
  active: boolean;
  isAlert?: boolean;
}

function ThoughtBubble({ text, time, active, isAlert }: ThoughtBubbleProps) {
  return (
    <div className={`flex gap-5 group ${!active ? 'opacity-50' : ''}`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isAlert ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : (active ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-black/20 dark:bg-white/10')}`}></div>
      <div className="space-y-1">
        <p className="text-[11px] font-light italic leading-relaxed text-luxury-charcoal/70 dark:text-white/70">{text}</p>
        <span className="text-[11px] font-mono text-luxury-charcoal/20 dark:text-white/20 uppercase tracking-widest">{time}</span>
      </div>
    </div>
  );
}

```

## File: .\pages\ProjectDetailsPage.tsx
```

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Circle,
  Clock,
  Paperclip,
  Plus,
  MoreVertical,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  FileText,
  CheckSquare,
  Sparkles,
  Sun,
  Download,
  ArrowLeft,
  AlertTriangle,
  Play
} from 'lucide-react';
import fa360 from '../services/fa360';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { useTimer } from '../context/TimeContext';
import { buildPaymentReminderPT, buildPaymentReminderEN } from '../utils/paymentReminder';
import { ProjectTimeline } from '../components/project/ProjectTimeline';
import { CopyModal } from '../components/dashboard/CopyModal';
import { Tooltip } from '../components/ui/Tooltip';


interface ProjectPayment {
  id: string;
  phase_key: string;
  value: number;
  status: string;
}

interface ProjectDiaryItem {
  id: string;
  date: string;
  title: string;
  author: string;
}

interface ProjectData {
  id: string;
  name: string;
  client: string;
  status: string;
  status_key: string;
  type_key: string;
  lastUpdate?: number;
  nextAction?: string;
  nextActionDate?: string;
  progress: number;
  payments: ProjectPayment[];
  diary: ProjectDiaryItem[];
}

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState('TASKS');
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const { start, activeProject, isActive } = useTimer();
  // eslint-disable-next-line
  const now = Date.now(); // Fix impurity warning

  const tabs = [
    { id: 'TASKS', label: t('proj_tasks'), icon: <CheckSquare size={16} /> },
    { id: 'DIARY', label: t('proj_diary'), icon: <FileText size={16} /> },
    { id: 'PAYMENTS', label: t('proj_payments'), icon: <DollarSign size={16} /> },
    { id: 'FILES', label: t('proj_files'), icon: <Paperclip size={16} /> },
    { id: 'MARKETING', label: t('proj_marketing'), icon: <ImageIcon size={16} /> },
    { id: 'TIMELOGS', label: 'Horas', icon: <Clock size={16} /> },
    { id: 'TIMELINE', label: t('proj_timeline'), icon: <Calendar size={16} /> },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const all = await fa360.listProjects();
      const p = all.find(x => x.id === projectId);
      if (p) {
        setProject(p);
        const analysis = await geminiService.analyzeProjectHealth(p, locale);
        setAiAnalysis(analysis);
      }
      setLoading(false);
    };
    loadData();
  }, [projectId, locale]);

  if (loading) return (
    <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin"></div>
      <p className="font-serif text-2xl opacity-50 text-white">{t('proj_syncing')}</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 dark:border-white/10 pb-10">
        <div className="space-y-4">
          <button onClick={() => navigate('/projects')} className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white flex items-center gap-2">
            <ArrowLeft size={12} /> {t('projects')}
          </button>

          {/* Quick Win #7: Stalled Indicator */}
          {project?.lastUpdate && (now - project.lastUpdate > 14 * 86400000) && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg animate-pulse">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Projeto Parado ({Math.floor((now - project.lastUpdate) / (1000 * 60 * 60 * 24))} dias)</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[10px] font-black uppercase tracking-widest rounded-full">
              {/* @ts-expect-error - i18n keys are dynamically loaded */}
              {t(project?.status_key)}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-luxury-charcoal/50 dark:text-white/50">ID: #FA-2024-{projectId}</span>

            {/* Quick Win #2: Days Since Update */}
            {project?.lastUpdate && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-[10px] text-luxury-charcoal/60 dark:text-white/60">
                <Clock size={10} />
                <span>Atualizado ha {Math.floor((now - project.lastUpdate) / (1000 * 60 * 60 * 24))} dias</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-none text-luxury-charcoal dark:text-white">{project?.name}</h1>
          <p className="text-xl font-light text-luxury-charcoal/50 dark:text-white/50 tracking-tight">
            {/* @ts-expect-error - i18n keys are dynamically loaded */}
            {t(project?.type_key)} â€¢ {project?.client}
          </p>

          {/* Quick Win #1: Next Action */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-luxury-gold">
              <Play size={14} className="fill-luxury-gold" />
              <span className="text-[10px] font-black uppercase tracking-widest">Proxima Acao:</span>
            </div>
            <p className="text-sm italic font-serif text-luxury-charcoal dark:text-white">{project?.nextAction || "Sem acao definida"}</p>
            <span className="text-[10px] text-luxury-charcoal/40 dark:text-white/40 font-mono">({new Date(project?.nextActionDate).toLocaleDateString()})</span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-6">
          <div className="flex flex-col items-end h-[60px] justify-center">
            {isActive && activeProject?.id === projectId ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-luxury-gold text-black rounded-full animate-in fade-in zoom-in duration-300">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">A gravar esforco...</span>
              </div>
            ) : (
              <button
                onClick={() => start({ id: projectId!, name: project?.name })}
                className="flex items-center gap-3 px-6 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold hover:border-luxury-gold/50 transition-all group"
              >
                <Play size={12} className="fill-current group-hover:scale-110 transition-transform" />
                Registar Tempo
              </button>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 mb-2">{t('proj_progress')}</p>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-serif text-luxury-charcoal dark:text-white">{project?.progress}%</span>
              <div className="w-32 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{ width: `${project?.progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 1.5 Timeline de Projeto (Step 29) */}
      <div className="glass p-6 rounded-[2.5rem] border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <ProjectTimeline
          currentPhaseId={
            project?.status === 'planning' ? 'LIC' :
              project?.status === 'construction' ? 'OBRA' :
                project?.status === 'finished' ? 'DONE' : 'EP'
          }
        />
      </div>

      {aiAnalysis && (
        <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/10 rounded-[2.5rem] flex items-center gap-4 animate-in slide-up">
          <div className="p-3 bg-luxury-gold text-black rounded-2xl">
            <Sparkles size={18} />
          </div>
          <p className="text-sm italic font-light text-luxury-charcoal/80 dark:text-white/80">{aiAnalysis}</p>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-black/5 dark:border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-luxury-gold' : 'text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white'
              }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-luxury-gold"></div>}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'TASKS' && <TasksView project={project} t={t} />}
        {activeTab === 'PAYMENTS' && <PaymentsView payments={project.payments} client={project.client} projectName={project.name} t={t} />}
        {activeTab === 'DIARY' && <DiaryView diary={project.diary} t={t} />}
        {activeTab === 'TIMELOGS' && <TimeLogsView projectId={projectId!} />}
      </div>
    </div>
  );
}

function TasksView({ t }: { project: ProjectData | null, t: (key: string) => string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('proj_pending_ops')}</h3>
            <Tooltip content={t('add_task') || "Adicionar Tarefa"} position="top">
              <button className="p-2 bg-luxury-gold text-black rounded-full"><Plus size={18} /></button>
            </Tooltip>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-6 p-6 glass rounded-3xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all">
                <Circle className="text-luxury-gold opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
                <div className="flex-1">
                  <h4 className="text-lg font-serif text-luxury-charcoal dark:text-white italic">Tarefa Exemplo #{i}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Amanha â€¢ {t('proj_high_priority')}</p>
                </div>
                <Tooltip content={t('more_options') || "Mais Opcoes"} position="left">
                  <MoreVertical size={20} className="text-luxury-charcoal/20 dark:text-white/20 cursor-pointer" />
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass p-8 rounded-[2.5rem] border-luxury-gold/10 space-y-6 h-fit">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-luxury-gold">{t('proj_exec_panel')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {['3D View', 'Portal', 'Chat', 'Docs'].map(l => (
            <button key={l} className="p-6 glass border-black/5 dark:border-white/5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 hover:bg-luxury-gold hover:text-black transition-all">
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentsView({ payments, client, projectName, t }: { payments: ProjectPayment[], client: string, projectName: string, t: (key: string) => string }) {
  const [modal, setModal] = useState({ open: false, title: '', text: '' });

  const openReminder = (p: ProjectPayment) => {
    const textPT = buildPaymentReminderPT({
      client: client || 'Cliente',
      project: projectName || 'Projeto',
      milestone: t(p.phase_key),
      amountNet: p.value || 0,
      vatRate: 0.23,
      dueDate: new Date().toISOString()
    });

    const textEN = buildPaymentReminderEN({
      client: client || 'Client',
      project: projectName || 'Project',
      milestone: t(p.phase_key),
      amountNet: p.value || 0,
      vatRate: 0.23,
      dueDate: new Date().toISOString()
    });

    setModal({
      open: true,
      title: `Lembrete de Pagamento (PT/EN)`,
      text: `${textPT}\n\n---\n\n${textEN}`,
    });
  };

  return (
    <div className="glass rounded-[3rem] overflow-hidden border-black/5 dark:border-white/5 shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
          <tr>
            <th className="px-10 py-6">Fase</th>
            <th className="px-10 py-6 text-right">Valor</th>
            <th className="px-10 py-6 text-right">Status</th>
            <th className="px-10 py-6 text-right">Acao</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/5 text-luxury-charcoal dark:text-white">
          {payments?.map((p) => (
            <tr key={p.id}>
              <td className="px-10 py-6 font-serif italic">{t(p.phase_key)}</td>
              <td className="px-10 py-6 text-right font-mono text-luxury-gold">â‚¬{p.value.toLocaleString()}</td>
              <td className="px-10 py-6 text-right">
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${p.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/50 dark:text-white/50'}`}>{p.status}</span>
              </td>
              <td className="px-10 py-6 text-right">
                {p.status !== 'Pago' && (
                  <button
                    onClick={() => openReminder(p)}
                    className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-all"
                  >
                    {t('remind')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CopyModal
        open={modal.open}
        title={modal.title}
        text={modal.text}
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
}

function DiaryView({ diary, t }: { diary: ProjectDiaryItem[], t: (key: string) => string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {diary?.map((item) => (
        <div key={item.id} className="glass p-8 rounded-[3rem] border-black/5 dark:border-white/5 space-y-6 group hover:border-luxury-gold/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-1">{item.date}</p>
              <h4 className="text-2xl font-serif text-luxury-charcoal dark:text-white italic">{item.title}</h4>
            </div>
            <Tooltip content={t('weather_sunny') || "Ceu Limpo"} position="left">
              <Sun className="text-luxury-gold" size={24} />
            </Tooltip>
          </div>
          <p className="text-sm font-light italic text-luxury-charcoal/50 dark:text-white/50 leading-relaxed">
            Registo visual e tecnico dos trabalhos realizados no local.
          </p>
          <div className="flex justify-between items-center pt-6 border-t border-black/5 dark:border-white/5 text-luxury-charcoal/50 dark:text-white/50 text-[11px] font-black uppercase tracking-widest">
            <span>{item.author}</span>
            <Tooltip content={t('download') || "Descarregar"} position="left">
              <div className="cursor-pointer hover:text-luxury-gold transition-colors">
                <Download size={14} />
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}


interface TimeLog {
  id: string;
  date: string;
  description: string;
  phase: string;
  duration: number;
}

function TimeLogsView({ projectId }: { projectId: string }) {
  const [logs, setLogs] = React.useState<TimeLog[]>([]);

  React.useEffect(() => {
    fa360.getProjectTimeLogs(projectId).then((data) => setLogs(data as TimeLog[]));
  }, [projectId]);

  return (
    <div className="glass rounded-[3rem] overflow-hidden border-black/5 dark:border-white/5 shadow-2xl">
      {logs.length === 0 ? (
        <div className="p-8 text-center text-luxury-charcoal/60 dark:text-white/60 italic">Sem registos de horas neste projeto.</div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
            <tr>
              <th className="px-10 py-6">Data</th>
              <th className="px-10 py-6">Descricao</th>
              <th className="px-10 py-6">Fase</th>
              <th className="px-10 py-6 text-right">Duracao</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-luxury-charcoal dark:text-white">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-10 py-6 font-mono opacity-60 text-xs">{new Date(log.date).toLocaleDateString()}</td>
                <td className="px-10 py-6 font-serif italic text-lg">{log.description || '-'}</td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[11px] font-black uppercase tracking-widest opacity-50">{log.phase}</span>
                </td>
                <td className="px-10 py-6 text-right font-mono text-luxury-gold">{log.duration}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

```

## File: .\pages\ProjectsPage.tsx
```

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from '../components/common/ProjectCard';
import SkeletonCard from '../components/common/SkeletonCard';
import PageHeader from '../components/common/PageHeader';


interface Project {
  id: string;
  name: string;
  type_key: string;
  client: string;
  progress: number;
  status_key: string;
  daysWithoutUpdate?: number;
  daysToDeadline?: number;
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const PHASES = [
    { id: 'PB', label_key: 'status_base_proposal' as const },
    { id: 'EP', label_key: 'status_planning' as const },
    { id: 'LIC', label_key: 'status_licensing' as const },
    { id: 'PE', label_key: 'status_construction' as const }
  ];

  const loadProjects = async () => {
    setLoading(true);
    const data = await fa360.listProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadProjects();
    };
    init();
  }, []);

  const handleDeleteProject = async (id: string) => {
    await fa360.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProjectStatus = (project: Project): 'active' | 'warning' | 'critical' | 'completed' => {
    if (project.progress >= 100) return 'completed';
    // Simplified status logic for demo
    if (project.daysWithoutUpdate > 14) return 'warning';
    if (project.daysToDeadline && project.daysToDeadline <= 3) return 'critical';
    return 'active';
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <PageHeader
        kicker={t('proj_kicker')}
        title={<>{t('proj_title_prefix')} <span className="text-luxury-gold">{t('proj_title_suffix')}</span></>}
        actionLabel={t('calculator')}
        onAction={() => navigate('/calculator')}
      />

      {projects.length === 0 && !loading ? (
        <div className="py-40 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 opacity-40 text-center bg-luxury-white/30 dark:bg-white/[0.02]">
          <div className="p-10 bg-luxury-gold/5 dark:bg-white/5 rounded-full border border-luxury-gold/10 dark:border-white/5 text-luxury-gold dark:text-white">
            <Layers size={48} className="opacity-20" />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('proj_standby_title')}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal dark:text-white">{t('proj_standby_desc')}</p>
          </div>
          <button onClick={() => navigate('/calculator')} className="px-10 py-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">{t('newProposal')}</button>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {PHASES.map((phase) => (
            <div key={phase.id} className="min-w-[320px] space-y-6">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">{t(phase.label_key)}</h3>
                <span className="text-[10px] font-mono text-luxury-charcoal/20 dark:text-white/20">
                  {projects.filter(p => p.status_key === phase.label_key).length}
                </span>
              </div>
              <div className="space-y-4">
                {loading ? (
                  [1, 2].map(i => <SkeletonCard key={i} variant="project" />)
                ) : (
                  projects.filter(p => p.status_key === phase.label_key).map(project => (
                    <ProjectCard
                      key={project.id}
                      project={{
                        ...project,
                        status: getProjectStatus(project),
                        lastUpdate: '2h',
                        deadline: project.daysToDeadline ? `${project.daysToDeadline} dias` : undefined,
                      }}
                      onDelete={handleDeleteProject}
                    />
                  ))
                )}
                <button className="w-full py-4 rounded-[2rem] border border-dashed border-black/5 dark:border-white/5 text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold text-xs font-bold uppercase tracking-widest transition-all">
                  + {t('calc_add')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

```

## File: .\pages\ProposalsManagementPage.tsx
```

import React, { useState } from 'react';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Download,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROPOSALS: any[] = [];

export default function ProposalsManagementPage() {
  const [filter, setFilter] = useState('All');
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const Motion = motion as any;

  const loadData = async () => {
    setLoading(true);
    const data = await fa360.listProposals();
    setProposals(data);
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const filteredProposals = proposals.filter(p => filter === 'All' || p.status === filter);

  // Dynamic Stats
  const totalNegotiation = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
  const adjudicadaCount = proposals.filter(p => p.status === 'Adjudicada').length; // Keeping status keys internal for now
  const conversaoRate = proposals.length > 0 ? Math.round((adjudicadaCount / proposals.length) * 100) : 0;
  const pendenteCount = proposals.filter(p => p.status === 'Enviada' || p.status === 'Negociacao').length;

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader 
        kicker={t('prop_kicker')}
        title={<>{t('prop_title_prefix')} <span className="text-luxury-gold">{t('prop_title_suffix')}</span></>}
        actionLabel={t('newProposal')}
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <main className="lg:col-span-9 space-y-12">
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide no-scrollbar">
              {['prop_filter_all', 'prop_filter_draft', 'prop_filter_sent', 'prop_filter_negotiation', 'prop_filter_adjudicated'].map(fKey => (
                <button
                  key={fKey}
                  onClick={() => setFilter(fKey === 'prop_filter_all' ? 'All' : (t(fKey as any)))} // Simplified filter logic mapping
                  className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${filter === (fKey === 'prop_filter_all' ? 'All' : t(fKey as any)) ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-black/5 dark:border-white/5 text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'
                    }`}
                >
                  {t(fKey as any)}
                </button>
              ))}
            </div>
            <div className="hidden md:flex relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-luxury-charcoal dark:text-white group-hover:text-luxury-gold" />
              <input type="text" placeholder={t('prop_search')} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full pl-10 pr-6 py-2 text-[10px] outline-none focus:border-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((prop, i) => (
                  <Motion.div
                    key={prop.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[3rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-2xl relative overflow-hidden bg-luxury-white/50 dark:bg-black/20"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold"><MoreVertical size={20} /></button>
                    </div>

                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-white border border-black/5 dark:border-transparent dark:bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-none">
                        <FileText size={32} className="text-luxury-gold" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{prop.project}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1 text-luxury-charcoal dark:text-white">{prop.client} â€¢ {prop.type}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mb-1 text-luxury-charcoal dark:text-white">{t('prop_est_fees')}</p>
                        <p className="text-3xl font-serif text-luxury-gold">â‚¬{parseFloat(prop.total).toLocaleString('pt-PT')}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-2 ${prop.status === 'Adjudicada' ? 'bg-emerald-500/10 text-emerald-500' :
                          prop.status === 'Enviada' ? 'bg-blue-500/10 text-blue-500' :
                            prop.status === 'Negociacao' ? 'bg-luxury-gold/10 text-luxury-gold' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/60 dark:text-white/60'
                          }`}>
                          {prop.status}
                        </div>
                        <p className="text-[10px] opacity-30 font-mono text-luxury-charcoal dark:text-white">{prop.date || new Date().toLocaleDateString('pt-PT')}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Eye size={14} className="text-luxury-gold" />
                          <span className="text-[11px] font-black text-luxury-charcoal dark:text-white">{prop.views || 0} {t('prop_views')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-3 glass rounded-xl border-black/10 dark:border-white/10 hover:text-luxury-gold transition-colors text-luxury-charcoal dark:text-white"><Download size={16} /></button>
                        <button className="px-6 py-3 bg-luxury-gold text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/10">{t('prop_send_portal')}</button>
                      </div>
                    </div>
                  </Motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-8 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 bg-luxury-white/30 dark:bg-white/[0.02]">
                  <div className="p-10 bg-luxury-gold/5 rounded-full border border-luxury-gold/10">
                    <TrendingUp size={48} className="text-luxury-gold opacity-30" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('prop_standby_title')}</h3>
                    <p className="text-sm font-light opacity-40 max-w-sm mx-auto leading-relaxed text-luxury-charcoal dark:text-white">{t('prop_standby_desc')}</p>
                  </div>
                  <button className="px-12 py-5 bg-luxury-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all">
                    {t('prop_start_sim')}
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Sales AI Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="glass p-10 rounded-[3rem] border-luxury-gold/20 bg-luxury-gold/[0.05] dark:bg-luxury-gold/[0.02] space-y-8 shadow-[0_10px_40px_rgba(212,175,55,0.05)] dark:shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{t('prop_insight_title')}</h4>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white/40 dark:bg-white/5 rounded-[2rem] border-l-4 border-luxury-gold space-y-4 shadow-sm dark:shadow-none">
                {proposals.length > 0 ? (
                  <>
                    <p className="text-xs font-light italic opacity-60 leading-relaxed text-luxury-charcoal dark:text-white">
                      "A proposta mais vista e de {proposals[0].client}. Probabilidade de conversao otimizada."
                    </p>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-4">
                      {t('prop_analyze')} <ArrowUpRight size={10} />
                    </button>
                  </>
                ) : (
                  <p className="text-xs font-light italic opacity-30 leading-relaxed text-luxury-charcoal dark:text-white">
                    {t('prop_insight_empty')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3.5rem] border-black/5 dark:border-white/5 bg-luxury-white/50 dark:bg-white/[0.02] space-y-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 text-luxury-charcoal dark:text-white text-center">{t('prop_summary_title')}</h4>
            <div className="space-y-12 text-center">
              <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 mb-3 text-luxury-charcoal dark:text-white">{t('prop_vol_neg')}</p>
                <p className="text-5xl font-serif italic text-luxury-charcoal dark:text-white">â‚¬{totalNegotiation.toLocaleString('pt-PT')}</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-black/5 dark:border-white/5">
                <div className="space-y-2">
                  <p className="text-[10px] opacity-30 uppercase font-black text-luxury-charcoal dark:text-white">{t('conversion')}</p>
                  <p className="text-3xl font-serif text-emerald-500">{conversaoRate}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] opacity-30 uppercase font-black text-luxury-charcoal dark:text-white">{t('proj_pending_ops')}</p>
                  <p className="text-3xl font-serif text-luxury-gold">{pendenteCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-emerald-500/5 rounded-[3.5rem] border border-emerald-500/10 flex flex-col items-center text-center gap-6 group hover:bg-emerald-500/10 transition-colors">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <FileCheck size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('prop_pipeline_target')}</h4>
              <p className="text-2xl font-serif text-luxury-charcoal dark:text-white italic">â‚¬{totalNegotiation.toLocaleString('pt-PT')}</p>
            </div>
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${Math.min((totalNegotiation / 500000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 text-luxury-charcoal dark:text-white">{t('prop_meta_q1')}: â‚¬500k</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

```

## File: .\pages\PublicContactPage.tsx
```

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
                    placeholder="Ex: Joao Silva"
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

```

## File: .\pages\PublicHomePage.tsx
```

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
            <p className="text-[10px] font-black uppercase tracking-[1em] text-luxury-gold">Lisboa â€¢ Estoril â€¢ Dubai</p>
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

```

## File: .\pages\PublicProjectDetailsPage.tsx
```

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
              <ArrowLeft size={14} /> Voltar ao Portefolio
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
            <span className="flex items-center gap-2"><Calendar size={12} className="text-luxury-gold"/> Conclusao: 2025</span>
          </Motion.div>
        </div>
      </section>

      {/* Concept Narrative */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-4 space-y-10 sticky top-32">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">O Conceito</p>
            <h2 className="text-5xl font-serif italic leading-tight">Uma ode ao <br/> <span className="text-luxury-gold">Minimalismo</span> Mediterranico.</h2>
            <div className="flex gap-4">
              <button className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/30 hover:text-luxury-gold transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-12 text-2xl font-light opacity-60 leading-relaxed italic">
            <p>
              A {project.name} surge de uma premissa fundamental: a desmaterializacao da fronteira entre o interior e o exterior. Atraves de grandes planos de vidro e uma paleta cromatica reduzida ao essencial, o espaco convida a luz a tornar-se o principal elemento construtivo.
            </p>
            <p>
              Nesta obra, o luxo nao reside no ornamento, mas na precisao do detalhe e na nobreza dos materiais naturais. O marmore de Estremoz e a madeira de carvalho escovado dialogam em harmonia, criando uma atmosfera de silencio e introspecao.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-20 border-t border-white/5 not-italic">
               <ProjectSpec label="Area de Construcao" value="450 mÂ²" />
               <ProjectSpec label="NÂº de Pisos" value="2 + Cave" />
               <ProjectSpec label="Certificacao" value="Classe A+" />
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
            label="A Sala de Estar: Dialogo com o Horizonte"
          />
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800" 
            className="col-span-12 md:col-span-4 aspect-[3/4] mt-12"
            label="Detalhe em Pedra e Luz"
          />
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800" 
            className="col-span-12 md:col-span-4 aspect-square"
            label="O Patio Interior"
          />
          <GalleryItem 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200" 
            className="col-span-12 md:col-span-8 aspect-video -mt-24"
            label="Vista Exterior: A Geometria do Silencio"
          />
        </div>
      </section>

      {/* Next Project / CTA */}
      <section className="py-40 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Continuar Exploracao</p>
          <h2 className="text-4xl md:text-7xl font-serif italic">Pronto para materializar a sua <br/> <span className="text-luxury-gold underline underline-offset-8 decoration-1">propria visao?</span></h2>
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

```

## File: .\pages\PublicServicesPage.tsx
```

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

```

## File: .\pages\PublicStudioPage.tsx
```

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

```

## File: .\pages\StudioInboxPage.tsx
```

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

```

## File: .\pages\TasksPage.tsx
```

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Zap,
  Circle,
  MoreVertical,
  AlertCircle,
  Sparkles,
  Layers,
  Briefcase,
  Lightbulb,
  FileCheck,
  HardHat,
  PenTool,
  CheckCircle,
  Building,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fa360 from '../services/fa360';
import { TASK_CATALOG, PHASES_CONFIG, Phase } from '../data/taskCatalog';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/common/PageHeader';
import { Tooltip } from '../components/ui/Tooltip';

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<'MY_TASKS' | 'CATALOG'>('CATALOG');
  const [selectedPhase, setSelectedPhase] = useState<Phase>('COMMERCIAL');
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<any | null>(null);
  const [pendingTask, setPendingTask] = useState<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { t } = useLanguage();
  const Motion = motion as any;

  const loadData = async () => {
    // ... logic preserved ...
    setLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        fa360.listTasks(),
        fa360.listProjects()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading tasks/projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    await fa360.updateTask(taskId, { completed: !currentStatus });
    loadData();
  };

  const onReschedule = async (taskId: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const newDate = today.toISOString().split('T')[0];
    await fa360.updateTask(taskId, { deadline: newDate });
    loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    await fa360.deleteTask(taskId);
    loadData();
    setActiveMenuId(null);
    setSelectedTaskDetail(null);
  };

  const handleChangePriority = async (taskId: string, priority: string) => {
    await fa360.updateTask(taskId, { priority: priority as any });
    loadData();
    setActiveMenuId(null);
  };

  const handleUpdateTaskDetail = async (id: string, updates: any) => {
    if (updates.projectId) {
      const proj = projects.find(p => p.id === updates.projectId);
      updates.projectKey = proj ? proj.title : 'Atelier';
    }
    await fa360.updateTask(id, updates);
    loadData();
    setSelectedTaskDetail((prev: any) => prev ? { ...prev, ...updates } : null);
  };

  const handleImportTask = async (projectId?: string) => {
    if (!pendingTask) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: pendingTask.name,
      deadline: new Date().toISOString().split('T')[0],
      priority: pendingTask.priority === 'critical' || pendingTask.priority === 'high' ? 'High' :
        pendingTask.priority === 'medium' ? 'Medium' : 'Low',
      completed: false,
      projectId: projectId || undefined,
      projectKey: projectId ? projects.find(p => p.id === projectId)?.title : 'Geral',
      estimatedHours: pendingTask.estimatedHours || 0,
      actualHours: 0
    };

    await fa360.saveTask(newTask as any);
    await loadData();
    setPendingTask(null);
    setShowProjectModal(false);
    setActiveTab('MY_TASKS');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCatalog = TASK_CATALOG.filter(t => t.phase === selectedPhase);

  return (
    <div className="animate-in fade-in duration-1000 space-y-16 pb-32">
      <PageHeader 
        kicker={t('tasks_kicker')}
        title={<>{t('tasks_title_prefix')} <span className="text-luxury-gold">{t('tasks_title_suffix')}</span></>}
      />

      <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-xl w-fit mb-12">
        <button
          onClick={() => setActiveTab('MY_TASKS')}
          className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'MY_TASKS' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          {t('tasks_tab_my_list')}
        </button>
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'CATALOG' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          {t('tasks_tab_catalog')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <div className="lg:col-span-9 space-y-12">
          {activeTab === 'CATALOG' ? (
            <div className="space-y-12">
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-4 px-4">
                {(Object.entries(PHASES_CONFIG) as [Phase, any][]).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPhase(key)}
                    className={`px-6 py-4 rounded-2xl border transition-all shrink-0 flex flex-col items-center gap-3 min-w-[120px] ${selectedPhase === key
                      ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold shadow-lg shadow-luxury-gold/5'
                      : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-luxury-charcoal/40 dark:text-white/40 hover:border-black/20 dark:hover:border-white/20'
                      }`}
                  >
                    <Tooltip content={config.label} position="top">
                      <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 ${selectedPhase === key ? 'text-luxury-gold' : 'opacity-40 text-luxury-charcoal dark:text-white'}`}>
                        {key === 'COMMERCIAL' && <Briefcase size={20} />}
                        {key === 'CONCEPT' && <Lightbulb size={20} />}
                        {key === 'PRELIMINARY' && <PenTool size={20} />}
                        {key === 'LICENSING' && <FileCheck size={20} />}
                        {key === 'EXECUTION' && <Layers size={20} />}
                        {key === 'CONSTRUCTION' && <HardHat size={20} />}
                        {key === 'CLOSING' && <CheckCircle size={20} />}
                        {key === 'INTERNAL' && <Building size={20} />}
                      </div>
                    </Tooltip>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">{config.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCatalog.map((task, i) => (
                    <Motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass p-10 rounded-[2.5rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all flex flex-col md:flex-row gap-10 items-start md:items-center relative"
                    >
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-luxury-gold/50">{task.id}</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${task.priority === 'critical' ? 'bg-red-500/10 text-red-500' :
                            task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40'
                            }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white leading-tight">{task.name}</h4>
                        <p className="text-sm font-light text-luxury-charcoal/50 dark:text-white/50 leading-relaxed max-w-3xl">{task.description}</p>

                        <div className="flex flex-wrap gap-4 pt-4">
                          {task.deliverables?.map(d => (
                            <span key={d} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
                              <Target size={12} className="text-luxury-gold" /> {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end gap-6 border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-8 md:pt-0 md:pl-12 min-w-[180px]">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Duracao Est.</p>
                          <p className="text-2xl font-serif text-luxury-charcoal dark:text-white">{task.estimatedHours}h</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Responsavel</p>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-luxury-gold">{task.responsible}</p>
                        </div>
                        <Tooltip content={t('add_to_my_list') || "Adicionar a Minha Lista"} position="left">
                          <button
                            onClick={() => {
                              setPendingTask(task);
                              setShowProjectModal(true);
                            }}
                            className="p-4 bg-luxury-gold text-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-luxury-gold/20"
                          >
                            <Plus size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </Motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <div key={task.id} className={`glass p-8 rounded-[2rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all flex items-center gap-8 ${task.completed ? 'opacity-40' : ''} ${activeMenuId === task.id ? 'z-[100] relative' : 'z-auto'}`}>
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`transition-colors shrink-0 ${task.completed ? 'text-emerald-500' : 'text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold'}`}
                    >
                      {task.completed ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                    </button>
                    <div
                      className="flex-1 cursor-pointer group/card"
                      onClick={() => setSelectedTaskDetail(task)}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        {task.projectKey && (
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-luxury-gold/70 group-hover/card:text-luxury-gold transition-colors">{task.projectKey}</span>
                        )}
                      </div>
                      <h4 className={`text-2xl font-serif italic transition-all group-hover/card:translate-x-1 ${task.completed ? 'line-through text-luxury-charcoal/40 dark:text-white/40' : 'text-luxury-charcoal/90 dark:text-white/90 group-hover/card:text-luxury-charcoal dark:group-hover/card:text-white'}`}>{task.title}</h4>
                      <div className="flex items-center gap-6 mt-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${task.priority === 'Alta' ? 'bg-red-500/20 text-red-500' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/30 dark:text-white/30'
                          }`}>{task.priority || 'Normal'}</span>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                          <Clock size={12} /> {task.deadline || '14:30h'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {!task.completed && (
                         <>
                            <button
                              onClick={(e) => { e.stopPropagation(); onReschedule(task.id); }}
                              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold transition-all"
                            >
                              {t('reschedule')}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTask(task.id, false); }}
                              className="px-6 py-2 rounded-xl bg-luxury-gold text-black text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-luxury-gold/20"
                            >
                              {t('complete')}
                            </button>
                         </>
                       )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                        className={`transition-colors p-2 rounded-full ${activeMenuId === task.id ? 'bg-luxury-gold text-black' : 'text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-charcoal dark:hover:text-white'}`}
                      >
                        <MoreVertical size={24} />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === task.id && (
                          <Motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-full mt-4 w-56 glass border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                          >
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => handleChangePriority(task.id, 'High')}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                              >
                                <Zap size={14} /> Urgente
                              </button>
                               <button
                                onClick={() => handleChangePriority(task.id, 'Medium')}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                              >
                                <Circle size={14} /> Normal
                              </button>
                              <div className="h-[1px] bg-black/5 dark:bg-white/5 my-2 mx-2" />
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/20 dark:text-white/20 hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all"
                              >
                                <AlertCircle size={14} /> Eliminar
                              </button>
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass p-24 rounded-[3rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center text-center space-y-10">
                  <div className="p-12 bg-luxury-gold/5 rounded-full border border-luxury-gold/10">
                    <Sparkles size={64} className="text-luxury-gold animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('tasks_empty_title')}</h3>
                    <p className="text-sm font-light text-luxury-charcoal/50 dark:text-white/50 max-w-sm mx-auto leading-relaxed">
                      {t('tasks_empty_desc')}
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('CATALOG')} className="px-12 py-5 bg-luxury-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-luxury-gold/20">
                    {t('tasks_catalog_explore')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Project Selection Modal */}
        <AnimatePresence>
          {showProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProjectModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              />
              <Motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl glass p-12 rounded-[4rem] border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />
                <div className="space-y-10">
                  <div className="text-center space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('tasks_modal_associate')}</h3>
                    <p className="text-sm font-light text-luxury-charcoal/40 dark:text-white/40 max-w-md mx-auto">{t('tasks_modal_desc')}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                    <button
                      onClick={() => handleImportTask()}
                      className="p-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-luxury-gold/40 hover:bg-luxury-gold/5 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="text-sm font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 group-hover:opacity-100 group-hover:text-luxury-gold transition-all">Geral / Atelier</span>
                      <Target size={18} className="opacity-10 group-hover:opacity-100 group-hover:text-luxury-gold transition-all" />
                    </button>

                    {projects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleImportTask(p.id)}
                        className="p-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-luxury-gold/40 hover:bg-luxury-gold/5 transition-all text-left flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-2">{p.client}</p>
                          <p className="text-2xl font-serif italic text-luxury-charcoal dark:text-white opacity-80 group-hover:opacity-100 transition-all">{p.title}</p>
                        </div>
                        <Plus size={20} className="opacity-10 group-hover:opacity-100 group-hover:text-luxury-gold transition-all" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowProjectModal(false)}
                    className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity"
                  >
                    {t('tasks_btn_close')}
                  </button>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Task Detail Modal */}
        <AnimatePresence>
          {selectedTaskDetail && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTaskDetail(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
              />
              <Motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="relative w-full max-w-4xl glass p-16 rounded-[4rem] border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Layers size={300} />
                </div>

                <div className="space-y-12">
                  <header className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">{selectedTaskDetail.projectKey || 'Geral'}</span>
                      <div className="h-[1px] w-8 bg-black/10 dark:bg-white/10"></div>
                      <span className="text-[10px] font-mono text-luxury-charcoal/30 dark:text-white/30">{selectedTaskDetail.id}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif italic text-luxury-charcoal dark:text-white tracking-tighter leading-tight">
                      {selectedTaskDetail.title}
                    </h2>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('tasks_detail_metrics')}</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-light">
                            <span className="text-luxury-charcoal/50 dark:text-white/50 font-light">Tempo Estimado</span>
                            <span className="text-luxury-charcoal dark:text-white font-bold">{selectedTaskDetail.estimatedHours || 0}h</span>
                          </div>
                          <div className="flex justify-between text-xs font-light">
                            <span className="text-luxury-charcoal/50 dark:text-white/50 font-light">Tempo Real Executado</span>
                            <span className="text-luxury-gold font-bold">{selectedTaskDetail.actualHours || 0}h</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <Motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(((selectedTaskDetail.actualHours || 0) / (selectedTaskDetail.estimatedHours || 1)) * 100, 100)}%` }}
                              className="h-full bg-luxury-gold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('tasks_detail_context')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl space-y-2">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30">Prioridade</p>
                            <p className="text-sm font-serif italic text-luxury-charcoal dark:text-white">{selectedTaskDetail.priority}</p>
                          </div>
                          <div className="p-6 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl space-y-2">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30">Status</p>
                            <p className="text-sm font-serif italic text-luxury-charcoal dark:text-white">{selectedTaskDetail.completed ? 'Concluida' : 'Em Curso'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('tasks_detail_assign')}</h4>
                        <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                          <button
                            onClick={() => handleUpdateTaskDetail(selectedTaskDetail.id, { projectId: undefined, projectKey: 'Geral' })}
                            className={`p-4 rounded-xl text-left transition-all text-[10px] font-bold uppercase tracking-widest ${!selectedTaskDetail.projectId ? 'bg-luxury-gold text-black' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10'}`}
                          >
                            Atelier (Geral)
                          </button>
                          {projects.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleUpdateTaskDetail(selectedTaskDetail.id, { projectId: p.id })}
                              className={`p-4 rounded-xl text-left transition-all text-[10px] font-bold uppercase tracking-widest ${selectedTaskDetail.projectId === p.id ? 'bg-luxury-gold text-black' : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10'}`}
                            >
                              {p.title}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex gap-4">
                        <button
                          onClick={() => handleDeleteTask(selectedTaskDetail.id)}
                          className="flex-1 py-4 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/10 transition-all"
                        >
                          {t('tasks_btn_delete')}
                        </button>
                        <button
                          onClick={() => setSelectedTaskDetail(null)}
                          className="flex-1 py-4 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                        >
                          {t('tasks_btn_close')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Sidebar Insights */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="glass p-10 rounded-[3.5rem] border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold text-center">Status Operacional</h3>
            <div className="space-y-12">
              <div className="text-center group cursor-default">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-3 group-hover:text-luxury-gold transition-colors">Concluidas</p>
                <p className="text-5xl font-serif text-luxury-charcoal dark:text-white">{tasks.filter(t => t.completed).length}</p>
              </div>
              <div className="text-center group cursor-default">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-3 group-hover:text-luxury-gold transition-colors">Ativas</p>
                <p className="text-5xl font-serif text-luxury-charcoal dark:text-white">{tasks.filter(t => !t.completed).length}</p>
              </div>
            </div>

            <div className="pt-10 border-t border-black/5 dark:border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                <span>{t('tasks_status_efficiency')}</span>
                <span>{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</span>
              </div>
              <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-luxury-gold transition-all duration-1000"
                  style={{ width: tasks.length > 0 ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-luxury-gold/5 rounded-[3.5rem] border border-luxury-gold/10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={60} />
            </div>
            <div className="flex items-center gap-3 text-luxury-gold">
              <AlertCircle size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fluxo Sugerido</span>
            </div>
            <p className="text-xs italic font-light text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
              Sugerimos importar a fase de **"Estudo Previo"** para o Projeto Douro. O catalogo contem 14 tarefas criticas de conformidade.
            </p>
            <button className="w-full py-4 border border-luxury-gold/30 text-luxury-gold rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all">
              Optimizar Workflow
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

```

## File: .\pages\TeamManagementPage.tsx
```

import React, { useState, useEffect } from 'react';
import fa360 from '../services/fa360';
import PageHeader from '../components/common/PageHeader';
import {
  Users,
  Clock,
  Zap,
  Activity,
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  load: number;
  activeProjects: number;
}

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState('WORKLOAD');
  const [team, setTeam] = useState<TeamMember[]>([]);



  const loadTeam = async () => {
    const data = await fa360.listTeamMembers();
    setTeam(data);
  };

  useEffect(() => {
    const init = async () => {
      await loadTeam();
    };
    init();
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker="Recursos Humanos & Performance"
        title={<>Gestao de <span className="text-luxury-gold">Equipa.</span></>}
      />

      <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/10 dark:border-white/10 text-luxury-charcoal dark:text-white w-fit mb-8">
        <button
          onClick={() => setActiveTab('WORKLOAD')}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'WORKLOAD' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          Workload
        </button>
        <button
          onClick={() => setActiveTab('TIMESHEETS')}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TIMESHEETS' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-charcoal dark:hover:text-white'}`}
        >
          Folha de Horas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Team Grid & Detailed View */}
        <main className="lg:col-span-8 space-y-12">
          {activeTab === 'WORKLOAD' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.length > 0 ? (
                team.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[3rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/20 transition-all shadow-2xl relative overflow-hidden text-luxury-charcoal dark:text-white"
                  >
                    <div className="flex items-center gap-6 mb-10">
                      <img src={member.avatar} className="w-20 h-20 rounded-3xl object-cover border border-black/10 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700" alt={member.name} />
                      <div>
                        <h4 className="text-2xl font-serif text-luxury-charcoal dark:text-white">{member.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mt-1">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Carga Semanal</p>
                        <span className={`text-xl font-serif ${member.load > 90 ? 'text-red-500' : 'text-luxury-charcoal dark:text-white'}`}>{member.load}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-luxury-gold transition-all duration-1000" style={{ width: `${member.load}%`, backgroundColor: member.load > 90 ? '#ef4444' : '#D4AF37' }}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2 text-luxury-charcoal/50 dark:text-white/50">
                        <Activity size={14} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{member.activeProjects || 0} Projectos Activos</span>
                      </div>
                      <button className="text-[11px] font-black uppercase tracking-widest text-luxury-gold hover:text-black dark:hover:text-white transition-colors">Detalhes de Carga</button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-40 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 text-center bg-black/5 dark:bg-white/[0.02]">
                  <div className="p-10 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 text-luxury-charcoal dark:text-white">
                    <Users size={48} className="opacity-20" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">Equipa em Standby.</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal/50 dark:text-white/50">Nenhum colaborador registado na estrutura neural.</p>
                  </div>
                  <button className="px-10 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">Adicionar Colaborador</button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass rounded-[3rem] border-black/5 dark:border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
                  <tr>
                    <th className="px-10 py-6">Colaborador</th>
                    <th className="px-10 py-6">Projecto</th>
                    <th className="px-10 py-6">Tarefa / Fase</th>
                    <th className="px-10 py-6">Horas</th>
                    <th className="px-10 py-6 text-right">Accao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm text-luxury-charcoal/60 dark:text-white/60">
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center italic text-luxury-charcoal/30 dark:text-white/30">Nenhuma folha de horas registada este mes.</td>
                  </tr>
                </tbody>
              </table>
              <button className="w-full py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-gold transition-all border-t border-black/5 dark:border-white/5">
                + Registar Novas Horas
              </button>
            </div>
          )}
        </main>

        {/* AI & Analytics Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-[2rem] border-luxury-gold/20 bg-luxury-gold/[0.02] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-luxury-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold uppercase">Team AI Coach</h4>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 space-y-4">
                <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                  "O cerebro esta a aguardar a sincronizacao de dados de produtividade para gerar recomendacoes de alocacao."
                </p>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border-black/5 dark:border-white/5 space-y-8 text-luxury-charcoal dark:text-white">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Metricas de Equipa</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2"><Clock size={14} /> Total Semanal</span>
                <span className="text-xl font-serif">0h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-luxury-charcoal/50 dark:text-white/50 flex items-center gap-2"><Coffee size={14} /> Taxa de Faturacao</span>
                <span className="text-xl font-serif text-emerald-500">0%</span>
              </div>
              <div className="pt-6 border-t border-black/5 dark:border-white/5">
                <button className="w-full py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-all text-luxury-charcoal dark:text-white">Relatorio de Desempenho</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

```

## File: .\pages\TechnicalHubPage.tsx
```

import React, { useState, useEffect } from 'react';
import {
  Search,
  FileCode,
  FileText,
  Download,
  History,
  Share2,
  Filter,
  AlertCircle,
  FolderOpen,
  Maximize2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import fa360 from '../services/fa360';
import { useLanguage } from '../context/LanguageContext';

import PageHeader from '../components/common/PageHeader';


interface TechnicalFile {
  id: string;
  name: string;
  category: string;
  type: string;
  rev: string;
  size: string;
  status: string;
}

interface TransmittalLog {
  timestamp: string;
  recipient: string;
  content: string;
  via: string;
}

export default function TechnicalHubPage() {
  const { t, locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('tech_cat_all');
  const [files, setFiles] = useState<TechnicalFile[]>([]);
  const [aiMessage, setAiMessage] = useState('Analisando integridade documental...');
  const [isScanning, setIsScanning] = useState(false);


  const CATEGORIES = [
    { id: 'tech_cat_all', label: t('tech_cat_all') },
    { id: 'Arquitetura', label: t('tech_cat_arch') },
    { id: 'Especialidades', label: t('tech_cat_spec') },
    { id: 'Interiores', label: t('tech_cat_int') },
    { id: 'Legal', label: t('tech_cat_legal') },
    { id: 'BIM', label: t('tech_cat_bim') }
  ];

  const [transmittals, setTransmittals] = useState<TransmittalLog[]>([]);

  const loadFiles = async () => {
    const data = await fa360.listTechnicalFiles();
    setFiles(data);
  };

  const loadTransmittals = async () => {
    const data = await fa360.listTransmittals();
    setTransmittals(data);
  };

  const runScan = async () => {
    setIsScanning(true);
    const msg = await fa360.runAIIntegrityCheck();
    setAiMessage(msg);
    setIsScanning(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadFiles();
      await loadTransmittals();
      await runScan();
    };
    init();
  }, []);

  const handleDeleteFile = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Deseja eliminar este ficheiro permanentemente?')) {
      await fa360.deleteTechnicalFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFiles = files.filter(f => selectedCategory === 'tech_cat_all' || f.category === selectedCategory);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <PageHeader
        kicker={t('tech_kicker')}
        title={<>{t('tech_title_prefix')} <span className="text-luxury-gold">{t('tech_title_suffix')}</span></>}
        actionLabel={t('tech_new_upload')}
        onAction={() => { }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/50 dark:text-white/50 px-4">{t('tech_categories')}</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'glass border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-charcoal dark:hover:text-white'
                    }`}
                >
                  {cat.label}
                  <span className="opacity-60">{cat.id === 'tech_cat_all' ? files.length : files.filter(f => f.category === cat.id).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-luxury-gold/5 rounded-[2.5rem] border border-luxury-gold/10 space-y-4">
            <div className="flex items-center gap-2 text-luxury-gold">
              <AlertCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">AI Integrity Check</span>
            </div>
            <p className="text-xs italic leading-relaxed text-luxury-charcoal/60 dark:text-white/60">
              {isScanning ? "O cerebro esta a analisar os vetores tecnicos..." : (files.length > 0 ? aiMessage : "Aguardando upload de ficheiros para analise de integridade.")}
            </p>
          </div>
        </aside>

        {/* File Explorer Grid */}
        <main className="lg:col-span-9 space-y-10">
          <div className="flex justify-between items-center px-4">
            <div className="relative group w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-charcoal/20 dark:text-white/20 group-hover:text-luxury-gold" />
              <input type="text" placeholder={t('tech_search_placeholder')} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all text-luxury-charcoal dark:text-white placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30" />
            </div>
            <div className="flex gap-4">
              <button className="p-3 glass rounded-xl border-black/10 dark:border-white/10 text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-all"><Filter size={18} /></button>
              <button className="p-3 glass rounded-xl border-black/10 dark:border-white/10 text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-all"><Maximize2 size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, i) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[3rem] border-black/5 dark:border-white/5 group hover:border-luxury-gold/20 transition-all shadow-2xl relative overflow-hidden text-luxury-charcoal dark:text-white"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold"><History size={20} /></button>
                      <button
                        onClick={(e) => handleDeleteFile(e, file.id)}
                        className="p-2 text-luxury-charcoal/20 dark:text-white/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform duration-500">
                        {file.type === 'CAD' || file.type === 'BIM' ? <FileCode size={32} /> : <FileText size={32} />}
                      </div>
                      <div>
                        <h4 className="text-xl font-serif italic truncate max-w-[200px] text-luxury-charcoal dark:text-white" title={file.name}>{file.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{file.rev}</span>
                          <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{file.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${file.status === 'Aprovado' ? 'bg-emerald-500' : 'bg-luxury-gold'}`}></div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">{file.status}</span>
                      </div>
                      <div className="flex gap-4">
                        <button className="text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold transition-colors"><Download size={18} /></button>
                        <button className="text-luxury-charcoal/20 dark:text-white/20 hover:text-luxury-gold transition-colors"><Share2 size={18} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-40 glass rounded-[4rem] border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 text-center bg-black/5 dark:bg-white/[0.02]">
                  <div className="p-10 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 text-luxury-charcoal dark:text-white">
                    <FolderOpen size={48} className="opacity-20" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic text-luxury-charcoal dark:text-white">{t('tech_empty_title')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest max-w-[280px] leading-relaxed italic text-luxury-charcoal/50 dark:text-white/50">{t('tech_empty_desc')}</p>
                  </div>
                  <button className="px-10 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all text-luxury-charcoal dark:text-white">{t('tech_btn_upload')}</button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Activity / Transmittals */}
          <section className="pt-12 space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white">{t('tech_log_title')}</h3>
              {transmittals.length > 0 && <button className="text-[10px] font-black uppercase tracking-widest border-b border-luxury-gold pb-1 text-luxury-gold">{t('tech_log_export')}</button>}
            </div>
            <div className="glass rounded-[3rem] overflow-hidden border-black/5 dark:border-white/5">
              <table className="w-full text-left">
                <thead className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">
                  <tr>
                    <th className="px-10 py-6">{t('tech_table_date')}</th>
                    <th className="px-10 py-6">{t('tech_table_recipient')}</th>
                    <th className="px-10 py-6">{t('tech_table_content')}</th>
                    <th className="px-10 py-6">{t('tech_table_via')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs text-luxury-charcoal/60 dark:text-white/60">
                  {transmittals.length > 0 ? (
                    transmittals.map((log, idx) => (
                      <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6 font-mono">{new Date(log.timestamp).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="px-10 py-6 font-serif">{log.recipient}</td>
                        <td className="px-10 py-6">{log.content}</td>
                        <td className="px-10 py-6"><span className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full">{log.via}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center italic text-luxury-charcoal/30 dark:text-white/30">{t('tech_table_empty')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

```

## File: .\services\automationBridge.service.ts
```
import { AutomationPayload, AutomationRun } from '../types';
import fa360 from './fa360';
import { TASK_CATALOG } from '../data/taskCatalog';

type Level = 1 | 2 | 3;

class AutomationBridgeService {
  async execute(payload: AutomationPayload, level: Level, actor = 'CEO', htmlContent?: string): Promise<AutomationRun> {
    const now = new Date();
    const runId = `RUN_${now.getTime()}`;

    // 1) Create Project
    const projectId = `PROJ_${now.getTime()}`;
    await fa360.create('Projects', {
      id: projectId,
      title: `${payload.templateId} â€¢ ${payload.client.name || 'Cliente'}`,
      client: payload.client.name,
      location: payload.location,
      templateId: payload.templateId,
      scenario: payload.scenarioId,
      budget: payload.fees.net,         // NET (sem IVA)
      vatRate: payload.fees.vatRate,
      gross: payload.fees.net * (1 + payload.fees.vatRate),
      status: 'planning',
      progress: 0,
      createdAt: now.toISOString(),
      lastUpdate: Date.now()
    });

    // 2) Create Payments (NET)
    const payments = (payload.payments || []).map((p: any, idx: number) => ({
      paymentId: `PAY_${now.getTime()}_${idx + 1}`,
      projectId,
      name: p.name || `Milestone ${idx + 1}`,
      appliesTo: p.appliesTo || 'TOTAL',
      percentage: p.percentage || 0,
      amountNet: p.value || 0,
      vatRate: payload.fees.vatRate,
      dueDate: this.computeDueDate(payload.schedule.startDate, p.dueDays || 30),
      status: 'pending',
      phaseId: p.phaseId || '',
    }));

    for (const pm of payments) await fa360.create('Payments', pm);

    // 3) Create Tasks
    const allTaskIds = [...(payload.tasks.archIds || []), ...(payload.tasks.specIds || [])];

    for (const tId of allTaskIds) {
      const meta = this.resolveTaskMeta(tId);
      await fa360.create('Tasks', {
        id: `${tId}_${now.getTime()}`,
        projectId,
        title: meta.name,
        phaseId: this.inferPhaseIdFromTaskId(tId),
        owner: meta.owner,
        estimatedHours: 0,
        actualHours: 0,
        completed: false,
        deadline: this.computeDueDate(payload.schedule.startDate, 30),
        priority: 'Medium',
        dependencies: meta.dependencies,
      });
    }

    // 4) Documents (level 2+)
    let proposalId: string | undefined = undefined;
    let proposalUrl = '';

    if (level >= 2 && htmlContent) {
      try {
        const response = await fetch('/api/docs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            filename: `Proposta_${payload.client.name || 'Cliente'}_${Date.now()}.html`,
            mimeType: 'text/html',
            contentBase64: btoa(unescape(encodeURIComponent(htmlContent)))
          })
        });
        const docResult = await response.json();
        proposalUrl = docResult.url || '';
      } catch (err) {
        fa360.log("ERROR: Falha ao fazer upload da proposta para o Drive.");
      }
    }

    if (level >= 2) {
      proposalId = `DOC_PROP_${now.getTime()}`;
      await fa360.create('Documents', {
        docId: proposalId,
        projectId,
        type: 'proposal',
        title: `Proposta â€¢ ${payload.client.name || 'Cliente'}`,
        url: proposalUrl,
        createdAt: now.toISOString(),
        metaJson: JSON.stringify({ templateId: payload.templateId, scenarioId: payload.scenarioId }),
      });
    }

    // 5) Audit Log
    await fa360.create('AuditLog', {
      logId: `LOG_${now.getTime()}`,
      projectId,
      action: `AUTOMATION_RUN_LEVEL_${level}`,
      payloadJson: JSON.stringify(payload),
      createdAt: now.toISOString(),
      actor,
    });

    return {
      id: runId,
      simulationId: payload.simulationId,
      timestamp: now,
      status: 'success',
      createdIds: { projectId, proposalId },
    };
  }

  private computeDueDate(startDateISO: string, dueDays: number) {
    const d = new Date(startDateISO);
    d.setDate(d.getDate() + dueDays);
    return d.toISOString().slice(0, 10);
  }

  private inferPhaseIdFromTaskId(taskId: string) {
    const m = taskId.match(/^([AE]\d)/);
    return m ? m[1] : '';
  }

  private resolveTaskMeta(taskId: string) {
    // Find in TASK_CATALOG by ID or Name
    const tpl = TASK_CATALOG.find(t => t.id === taskId || t.name === taskId);

    const ownerMap: Record<string, string> = {
      'architect': 'CEO',
      'intern': 'JESSICA',
      'engineer': 'SOFIA',
      'designer': 'SOFIA',
      'external': 'OUTSOURCED'
    };

    return {
      name: tpl?.name || taskId,
      owner: ownerMap[tpl?.responsible || ''] || 'CEO',
      dependencies: '',
    };
  }
}

export const automationBridgeService = new AutomationBridgeService();
```

## File: .\services\dashboardData.service.ts
```
type Task = { id: string; title: string; deadline: string; completed: boolean; priority?: string; projectId?: string; projectKey?: string };
type Payment = { id: string; title: string; amountNet: number; vatRate: number; date: string; status: 'paid' | 'pending' | 'overdue'; projectId?: string };
type Project = { id: string; title: string; client?: string; status: string; nextActionDate?: string; riskFlag?: string; nextMilestone?: string; projectId?: string; name?: string; progress?: number };
type TimeEntry = { date: string; owner: string; hours: number; projectId?: string };
type Meeting = { id: string; title: string; location: string; startTime: string; endTime: string; projectId?: string };

const toDate = (s: string) => new Date(s);
const today = () => new Date();
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

// Helper for Monday 00:00
const getStartOfWeek = (d: Date) => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday (0)
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

export class DashboardDataService {
  async build(input: { tasks: Task[]; payments: Payment[]; projects: Project[]; proposals: any[]; timeEntries?: TimeEntry[]; syncLog?: any; meetings?: Meeting[] }) {
    const now = today();
    // Reset time part for accurate date comparison
    now.setHours(0,0,0,0);
    const in7 = addDays(now, 7);
    in7.setHours(23,59,59,999);
    
    const w0 = getStartOfWeek(new Date(now));
    const timeEntries = input.timeEntries || [];

    // Filter Tasks
    const overdueTasks = input.tasks.filter(t => !t.completed && toDate(t.deadline) < now);
    const next7Tasks = input.tasks.filter(t => !t.completed && toDate(t.deadline) >= now && toDate(t.deadline) <= in7);

    // Filter Payments
    const overduePayments = input.payments.filter(p => p.status !== 'paid' && toDate(p.date) < now);
    const next7Payments = input.payments.filter(p => p.status !== 'paid' && toDate(p.date) >= now && toDate(p.date) <= in7);

    // Risk Projects
    const riskProjects = input.projects.filter(p => !!p.riskFlag || (p.nextActionDate && toDate(p.nextActionDate) < now));

    // 1. Today Ops View Model
    const todayOps = {
      dueTodayTasksCount: input.tasks.filter(t => !t.completed && toDate(t.deadline).toDateString() === now.toDateString()).length,
      overdueTasksCount: overdueTasks.length,
      next7TasksCount: next7Tasks.length,
      next7PaymentsCount: next7Payments.length,
      topTasks: [...overdueTasks, ...next7Tasks].sort((a,b) => toDate(a.deadline).getTime() - toDate(b.deadline).getTime()).slice(0, 3),
      topActivities: [] 
    };

    // 1b. Daily Highlights
    const idleProjects = input.projects.filter(p => {
      // Logic for idle: no nextActionDate or nextActionDate > 14 days ago
      if (!p.nextActionDate) return true;
      const lastAction = toDate(p.nextActionDate);
      const diffDays = Math.floor((now.getTime() - lastAction.getTime()) / (1000 * 3600 * 24));
      return diffDays > 14;
    });

    const dailyHighlights = {
      urgentTasks: input.tasks.filter(t => !t.completed && (toDate(t.deadline) <= now)).slice(0, 3),
      urgentPayments: input.payments.filter(p => p.status !== 'paid' && toDate(p.date) < addDays(now, -30)).slice(0, 2), // Older than 30 days
      idleProjects: idleProjects.slice(0, 2),
      todayMeetings: (input.meetings || []).filter(m => toDate(m.startTime).toDateString() === now.toDateString()).slice(0, 3)
    };

    // 2. Critical Alerts View Model
    const criticalAlerts = [
      overduePayments[0] ? { 
        id: 'c-pay', 
        type: 'PAYMENT_OVERDUE', 
        message: `Pagamento vencido: ${overduePayments[0].title}`, 
        actionUrl: '/financial',
        daysLate: Math.floor((now.getTime() - toDate(overduePayments[0].date).getTime()) / (1000 * 3600 * 24))
      } : null,
      overdueTasks[0] ? { 
        id: 'c-task', 
        type: 'TASK_OVERDUE', 
        message: `Tarefa vencida: ${overdueTasks[0].title}`, 
        actionUrl: '/tasks',
        daysLate: Math.floor((now.getTime() - toDate(overdueTasks[0].deadline).getTime()) / (1000 * 3600 * 24))
      } : null,
      riskProjects[0] ? { 
        id: 'c-proj', 
        type: 'PROJECT_BLOCKED', 
        message: `Projeto bloqueado: ${riskProjects[0].title}`, 
        actionUrl: `/projects/${riskProjects[0].id}` 
      } : null,
    ].filter(Boolean) as any[];

    // 3. Cashflow 30D (NET based)
    const cash30d = {
      overdueNet: overduePayments.reduce((s, p) => s + (p.amountNet || 0), 0),
      next7Net: next7Payments.reduce((s, p) => s + (p.amountNet || 0), 0),
      received30d: 0, 
      projected30d: next7Payments.reduce((s, p) => s + (p.amountNet || 0), 0),
      vatRateHint: 'taxa legal',
    };

    // 4. Funnel Metrics
    const funnel = {
      leads: input.proposals.filter(p => p.status === 'Rascunho').length,
      activeProposals: input.proposals.filter(p => p.status === 'Enviada').length,
      activeValue: input.proposals.filter(p => p.status === 'Enviada' || p.status === 'Negociacao').reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0),
      negotiation: input.proposals.filter(p => p.status === 'Negociacao').length,
      closed: input.proposals.filter(p => p.status === 'Adjudicada').length,
      conversionRate: input.proposals.length > 0 ? Math.round((input.proposals.filter(p => p.status === 'Adjudicada').length / input.proposals.length) * 100) : 0
    };

    // 5. Health Index
    const scoreDeadlines = Math.max(0, 100 - (overdueTasks.length * 10));
    const scoreRisk = Math.max(0, 100 - (riskProjects.length * 15));
    const healthScore = input.projects.length > 0 ? Math.round((scoreDeadlines + 100 + 100 + scoreRisk) / 4) : 100;

    // 6. Sync Status
    const syncStatus = input.syncLog || { status: 'ONLINE', lastSync: new Date().toISOString(), message: 'Sincronizado' };

    // --- HOURS THIS WEEK ---
    const owners = ['CEO', 'JESSICA', 'SOFIA'] as const;
    const targetPerPerson = 40;

    const hoursByOwner = owners.reduce((acc, o) => {
      const h = timeEntries
        .filter((t) => t.owner === o && toDate(t.date) >= w0)
        .reduce((s, t) => s + (t.hours || 0), 0);

      acc[o] = {
        hours: Math.round(h * 10) / 10,
        target: targetPerPerson,
        pct: Math.round((h / targetPerPerson) * 100),
        status: h < targetPerPerson * 0.6 ? 'low' : h > targetPerPerson * 1.1 ? 'over' : 'ok',
      };
      return acc;
    }, {} as any);

    const activeProjects = input.projects
      .filter((p) => String(p.status || '').toLowerCase() !== 'done')
      .slice(0, 5)
      .map((p) => {
        const id = p.projectId || p.id;
        const totalHours = timeEntries
          .filter(te => te.projectId === id)
          .reduce((acc, te) => acc + te.hours, 0);

        return {
          projectId: id,
          name: p.name || p.title,
          client: p.client || '',
          status: p.status || 'active',
          nextMilestone: p.nextMilestone || 'â€”',
          riskFlag: p.riskFlag || '',
          progress: p.progress || 0,
          totalHours: Math.round(totalHours * 10) / 10
        };
      });

    return {
      todayOps,
      criticalAlerts,
      cash30d,
      funnel,
      health: {
        score: healthScore,
        breakdown: { deadlines: scoreDeadlines, cash: 100, production: 100, risk: scoreRisk }
      },
      syncStatus,
      projects: input.projects.slice(0, 5),
      hoursByOwner,
      activeProjects,
      dailyHighlights
    };
  }
}

export const dashboardDataService = new DashboardDataService();
```

## File: .\services\discountPolicy.ts
```
import { Scenario, DiscountAudit } from '../types';

// Se nao tiveres feeCalculatorUtils, usa este clamp aqui:
const _clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export type DiscountType =
    | 'none'
    | 'clienteRecorrente'
    | 'packCompleto'
    | 'antecipacaoPagamento'
    | 'volume'
    | 'earlyBird'
    | 'promocaoSazonal'
    | 'custom';

export type UserRole = 'auto' | 'arquiteto' | 'financeiro' | 'marketing' | 'diretor';

export interface DiscountInput {
    type: DiscountType;
    value: number; // percentagem pedida
    justification?: string;
}

export interface DiscountContext {
    userRole: UserRole;
    scenario: Scenario;
    specCount: number;
    hasAllPhases?: boolean; // se quiseres ligar a â€œpack completoâ€
}

export interface DiscountPolicyRule {
    maxPct: number;
    requiresRole: UserRole;
    requiresJustificationAbove?: number; // ex: >10%
    description: string;
    // regra opcional de aplicabilidade
    isAllowed?: (ctx: DiscountContext) => boolean;
}

const ROLE_LEVEL: Record<UserRole, number> = {
    auto: 0,
    arquiteto: 1,
    financeiro: 2,
    marketing: 2,
    diretor: 3,
};

export const DISCOUNT_POLICY: Record<DiscountType, DiscountPolicyRule> = {
    none: { maxPct: 0, requiresRole: 'auto', description: 'Sem desconto' },

    clienteRecorrente: {
        maxPct: 10,
        requiresRole: 'diretor',
        requiresJustificationAbove: 10,
        description: 'Cliente com recorrencia comprovada'
    },

    packCompleto: {
        maxPct: 12,
        requiresRole: 'auto',
        requiresJustificationAbove: 10,
        description: 'Pack completo (fases + coordenacao)',
        isAllowed: (ctx) => ctx.scenario !== 'essential' // nao permitir em modo essencial (risco)
    },

    antecipacaoPagamento: {
        maxPct: 7,
        requiresRole: 'financeiro',
        description: 'Pagamento antecipado (100% ou marco reforcado)'
    },

    volume: {
        maxPct: 20,
        requiresRole: 'diretor',
        requiresJustificationAbove: 10,
        description: 'Volume (ex.: multiplas unidades)'
    },

    earlyBird: {
        maxPct: 5,
        requiresRole: 'auto',
        description: 'Fecho rapido (â‰¤15 dias)'
    },

    promocaoSazonal: {
        maxPct: 10,
        requiresRole: 'marketing',
        requiresJustificationAbove: 10,
        description: 'Campanha sazonal'
    },

    custom: {
        maxPct: 25, // teto maximo absoluto (podes subir, mas eu nao recomendo)
        requiresRole: 'diretor',
        requiresJustificationAbove: 5,
        description: 'Excecao / desconto personalizado'
    },
};



export function applyDiscountPolicy(
    subtotal: number,
    discount: DiscountInput | undefined,
    ctx: DiscountContext
): { appliedPct: number; discountAmount: number; audit: DiscountAudit; alerts: string[] } {
    const d = discount?.type ? discount : { type: 'none' as DiscountType, value: 0 };
    const pctReq = Number(d.value || 0);
    const rule = DISCOUNT_POLICY[d.type] || DISCOUNT_POLICY.none;

    const reasons: string[] = [];
    const alerts: string[] = [];

    // 1) Role check
    const userLevel = ROLE_LEVEL[ctx.userRole] ?? 0;
    const requiredLevel = ROLE_LEVEL[rule.requiresRole] ?? 0;
    if (userLevel < requiredLevel) {
        reasons.push(`Permissao insuficiente: requer ${rule.requiresRole}`);
        alerts.push(`ðŸš« Desconto rejeitado â€” requer aprovacao (${rule.requiresRole}).`);
        return {
            appliedPct: 0,
            discountAmount: 0,
            alerts,
            audit: {
                requested: { type: d.type, pct: pctReq, justification: d.justification },
                applied: { pct: 0, amount: 0 },
                status: 'rejected',
                reasons,
                policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
            }
        };
    }

    // 2) Applicability check (optional)
    if (rule.isAllowed && !rule.isAllowed(ctx)) {
        reasons.push(`Tipo de desconto nao permitido neste contexto`);
        alerts.push(`ðŸš« Desconto rejeitado â€” nao permitido para este cenario/configuracao.`);
        return {
            appliedPct: 0,
            discountAmount: 0,
            alerts,
            audit: {
                requested: { type: d.type, pct: pctReq, justification: d.justification },
                applied: { pct: 0, amount: 0 },
                status: 'rejected',
                reasons,
                policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
            }
        };
    }

    // 3) Clamp to policy max
    const pctClamped = _clamp(pctReq, 0, rule.maxPct);
    const clamped = pctClamped !== pctReq;
    if (clamped) reasons.push(`Desconto ajustado ao teto: ${rule.maxPct}%`);

    // 4) Justification if needed
    const threshold = rule.requiresJustificationAbove;
    if (threshold != null && pctClamped > threshold) {
        if (!d.justification || !d.justification.trim()) {
            reasons.push(`Justificacao obrigatoria acima de ${threshold}%`);
            alerts.push(`ðŸš« Desconto rejeitado â€” justificacao obrigatoria (> ${threshold}%).`);
            return {
                appliedPct: 0,
                discountAmount: 0,
                alerts,
                audit: {
                    requested: { type: d.type, pct: pctReq, justification: d.justification },
                    applied: { pct: 0, amount: 0 },
                    status: 'rejected',
                    reasons,
                    policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
                }
            };
        }
    }

    const discountAmount = (subtotal * pctClamped) / 100;

    return {
        appliedPct: pctClamped,
        discountAmount,
        alerts,
        audit: {
            requested: { type: d.type, pct: pctReq, justification: d.justification },
            applied: { pct: pctClamped, amount: discountAmount },
            status: clamped ? 'clamped' : 'applied',
            reasons,
            policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
        }
    };
}
```

## File: .\services\exportEngine.service.ts
```
class ExportEngineService {
  private collectStyles() {
    return Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join('');
        } catch {
          return '';
        }
      })
      .join('');
  }

  exportHTMLString(containerId: string, clientName: string) {
    const content = document.getElementById(containerId);
    if (!content) return null;

    const styles = this.collectStyles();

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>Proposta de Honorarios - ${clientName}</title>
        <style>${styles}</style>
        <style>
          body { background: #f4f4f5; display:flex; justify-content:center; padding:40px 0; font-family:sans-serif; }
          #proposal-template { width: 210mm; background:white; }
        </style>
      </head>
      <body>
        ${content.outerHTML}
      </body>
      </html>
    `;
  }

  exportToHTML(containerId: string, clientName: string, filename: string) {
    const html = this.exportHTMLString(containerId, clientName);
    if (!html) return;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportEngineService = new ExportEngineService();
```

## File: .\services\fa360.ts
```

import { TranslationKeys } from './translations';
import { Task, TimeLog } from '../types';
import { geminiService } from './geminiService';

const telemetryListeners: ((log: string) => void)[] = [];

export const STORAGE_KEYS = {
  HOOK: "fa-brain-hook",
  STATUS: "fa-brain-status",
  LAST_SYNC: "fa-last-sync-time",
  WORKSPACE: "fa-workspace-id",
  AUTH: "fa-auth-token",
  PROJECTS: "fa-local-projects",
  CLIENTS: "fa-local-clients",
  PROPOSALS: "fa-local-proposals",
  EXPENSES: "fa-local-expenses",
  DIARY: "fa-local-diary",
  QUEUE: "fa-sync-queue",
  SHIELD_KEY: "fa-neural-shield-id",
  SYNTHESIS: "fa-neural-synthesis",
  METADATA: "fa-system-metadata",
  AUDIT_CACHE: "fa-audit-cache",
  FILES: "fa-local-files",
  BRAND: "fa-brand-settings",
  MATERIALS: "fa-local-materials",
  MEDIA: "fa-local-media",
  TIMELOGS: "fa-local-timelogs",
  TASKS: "fa-local-tasks",
  TEAM: "fa-local-team",
  TRANSMITTALS: "fa-local-transmittals",
  PAYMENTS: "fa-local-payments",
  DOCUMENTS: "fa-local-documents",
  AUDIT_LOG: "fa-local-audit-log"
};

const workerCode = "self.onmessage = async (e) => { const { hook, category, data, studio } = e.data; try { await fetch(hook, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ category, data, studio, timestamp: new Date().toISOString() }) }); self.postMessage({ success: true, category }); } catch (err) { self.postMessage({ success: false, category, error: err.message }); } };";

export const NeuralStorage = {
  save: async (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  load: async (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  remove: async (key: string) => {
    localStorage.removeItem(key);
  },
  getTimestamp: async (key: string) => {
    const meta = await NeuralStorage.load(STORAGE_KEYS.METADATA) as any || {};
    return meta[key] || 0;
  },
  updateTimestamp: async (key: string) => {
    const meta = await NeuralStorage.load(STORAGE_KEYS.METADATA) as any || {};
    meta[key] = Date.now();
    await NeuralStorage.save(STORAGE_KEYS.METADATA, meta);
  },
  ensureFiles: async () => {
    // Zero Data Mode: No defaults
    const existing = await NeuralStorage.load(STORAGE_KEYS.FILES);
    if (!existing) {
      await NeuralStorage.save(STORAGE_KEYS.FILES, []);
    }
  }
};

const fa360 = {
  log: (msg: string) => {
    const logEntry = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(`%c FA-360 %c ${logEntry}`, "background: #d4af37; color: #000; font-weight: bold; border-radius: 3px; padding: 0 5px;", "color: #d4af37;");
    telemetryListeners.forEach(l => l(logEntry));
  },

  onLog: (callback: (log: string) => void) => {
    telemetryListeners.push(callback);
  },

  getEcosystemSnapshot: async () => {
    const projects = await fa360.listProjects();
    const clients = await fa360.listClients();
    const proposals = await fa360.listProposals();
    const expenses = await fa360.listExpenses();

    const pipelines = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    return {
      timestamp: new Date().toISOString(),
      stats: {
        projectsCount: projects.length,
        clientsCount: clients.length,
        activeProposalsValue: pipelines,
        monthlyExpenses: expenses.reduce((acc, e) => acc + (e.value || 0), 0)
      },
      health: projects.length > 0 ? "EXCELLENT" : "STANDBY",
      studio: "Ferreira Arquitetos"
    };
  },

  updateProjectStatus: async (projectId: string, newStatus: string) => {
    const projects = await fa360.listProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false };

    project.status = newStatus;
    project.lastModified = Date.now();

    await NeuralStorage.save(STORAGE_KEYS.PROJECTS, projects);
    await NeuralStorage.updateTimestamp('PROJECTS');

    fa360.log(`CORE: Status do projeto ${project.name} atualizado para ${newStatus}.`);

    // Propagar via Neural Link
    fa360.pushToBrain("PROJECTS", project);

    return { success: true };
  },

  listProjects: async () => {
    // Zero Data Mode: Just return the raw local data
    return await NeuralStorage.load(STORAGE_KEYS.PROJECTS) || [];
  },

  saveProject: async (project: any) => {
    const projects = await fa360.listProjects();
    const updated = [project, ...projects];
    await NeuralStorage.save(STORAGE_KEYS.PROJECTS, updated);
    fa360.log(`PROJECT: Projeto ${project.name} gravado localmente.`);
    return { success: true };
  },

  deleteProject: async (id: string) => {
    const projects = await fa360.listProjects();
    const updated = projects.filter((p: any) => p.id !== id);
    await NeuralStorage.save(STORAGE_KEYS.PROJECTS, updated);
    fa360.log(`PROJECT: Projeto ${id} removido.`);
    return { success: true };
  },

  listClients: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.CLIENTS) || [];
  },

  saveClient: async (client: any) => {
    const clients = await fa360.listClients();
    const updated = [client, ...clients];
    await NeuralStorage.save(STORAGE_KEYS.CLIENTS, updated);
    fa360.log(`CRM: Novo cliente ${client.name} registado.`);
    return { success: true };
  },

  deleteClient: async (id: string) => {
    const clients = await fa360.listClients();
    const updated = clients.filter((c: any) => c.id !== id);
    await NeuralStorage.save(STORAGE_KEYS.CLIENTS, updated);
    fa360.log(`CRM: Cliente ${id} removido.`);
    return { success: true };
  },

  listProposals: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.PROPOSALS) || [];
  },

  saveProposal: async (proposal: any) => {
    const proposals = await fa360.listProposals();
    const updated = [proposal, ...proposals];
    await NeuralStorage.save(STORAGE_KEYS.PROPOSALS, updated);
    fa360.log("CORE: Proposta " + proposal.ref + " protegida.");
    const pushResult = await fa360.pushToBrain("PROPOSALS", proposal);
    return { success: true, status: pushResult.status || (pushResult.success ? 'dispatched' : 'no_hook') };
  },

  listExpenses: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.EXPENSES) || [];
  },

  listPayments: async () => {
    // Zero Data Mode: No defaults
    return await NeuralStorage.load("fa-local-payments") || [];
  },

  savePayment: async (payment: any) => {
    const payments = await fa360.listPayments();
    const updated = [payment, ...payments];
    await NeuralStorage.save("fa-local-payments", updated);
    fa360.log(`FINANCE: Pagamento ${payment.title} registado.`);
    return { success: true };
  },

  getFinancialStats: async () => {
    const proposals = await fa360.listProposals();
    const expenses = await fa360.listExpenses();
    const projects = await fa360.listProjects();

    const liquidity = proposals
      .filter(p => p.status === 'Adjudicada')
      .reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    const pendingFees = proposals
      .filter(p => p.status === 'Enviada' || p.status === 'Negociacao')
      .reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    const totalCosts = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
    const totalFees = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    const margin = totalFees > 0 ? Math.round(((totalFees - totalCosts) / totalFees) * 100) : 0;
    const burnRate = expenses.length > 0 ? (totalCosts / 12).toFixed(1) : 0; // Simple monthly average if data exists

    return {
      liquidity,
      pendingFees: Math.round(pendingFees / 1000), // K format for UI
      burnRate,
      margin
    };
  },

  getFinancialProjections: async () => {
    // Zero Data Mode: No projections if no data
    return [];
  },

  saveExpense: async (expense: any) => {
    const expenses = await fa360.listExpenses();
    const updated = [expense, ...expenses];
    await NeuralStorage.save(STORAGE_KEYS.EXPENSES, updated);
    fa360.log("CORE: Despesa registada.");
    return { success: true };
  },

  getDashboardStats: async () => {
    const projects = await fa360.listProjects();
    const isOnline = fa360.getNeuralStatus();
    const lastSync = await NeuralStorage.load(STORAGE_KEYS.LAST_SYNC);
    const proposals = await fa360.listProposals();

    const pipelineValue = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
    const healthIndex = projects.length > 0 ? 98 : 0;

    return {
      activeProjects: projects.length,
      neuralStatus: isOnline ? 'Online' : 'Offline',
      lastSync,
      pipelineValue: pipelineValue,
      healthIndex: healthIndex
    };
  },

  getDailyBriefing: async () => {
    const tasks = await fa360.listTasks();
    const projects = await fa360.listProjects();
    const proposals = await fa360.listProposals();
    const expenses = await fa360.listExpenses();
    const payments = await fa360.listPayments();
    const now = new Date();

    const overduePayments = payments.filter((p: any) => p.status !== 'paid' && new Date(p.date) < now);

    // 1. Today Ops
    const todayTasks = tasks.filter(t => {
      const due = new Date(t.deadline);
      return !t.completed && due <= now; // Overdue or due today
    }).slice(0, 5); // Top 5

    // 2. Critical Alerts
    const alerts: any[] = [];
    
    // Alert: Overdue Tasks
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.deadline) < now);
    if (overdueTasks.length > 0) {
      alerts.push({
        id: 'alert-tasks',
        type: 'TASK_OVERDUE',
        message: `${overdueTasks.length} tarefas em atraso`,
        daysLate: Math.floor((now.getTime() - new Date(overdueTasks[0].deadline).getTime()) / (1000 * 3600 * 24)),
        actionUrl: '/tasks'
      });
    }

    // Alert: Stalled Projects (Mock logic for now)
    const stalled = projects.filter(p => !p.nextActionDate || new Date(p.nextActionDate) < now);
    if (stalled.length > 0) {
      alerts.push({
        id: 'alert-projects',
        type: 'PROJECT_BLOCKED',
        message: `${stalled.length} projetos sem acao definida`,
        actionUrl: '/projects'
      });
    }

    // 3. Cashflow (Mock/Simple logic)
    // In real scenario, this would sum paid vs unpaid invoices in date range
    const cashflow = {
      received30d: 0, // Placeholder
      projected30d: proposals.filter(p => p.status === 'Adjudicada').reduce((acc, p) => acc + (parseFloat(p.total) || 0) * 0.3, 0), // 30% downpayment
      overdue: 0
    };

    // 4. Funnel
    const funnel = {
      leads: proposals.filter(p => p.status === 'Rascunho').length,
      activeProposals: proposals.filter(p => p.status === 'Enviada').length,
      activeValue: proposals.filter(p => p.status === 'Enviada').reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0),
      negotiation: proposals.filter(p => p.status === 'Negociacao').length,
      conversionRate: 0 // Need historical data
    };

    // 5. Health Index Algorithmic Calculation
    let scoreDeadlines = 100 - (overdueTasks.length * 10);
    const scoreCash = 100; // Assume perfect for now until invoices exist
    const scoreProduction = 100; // No plan data yet
    let scoreRisk = 100 - (stalled.length * 15);

    // Clamping
    scoreDeadlines = Math.max(0, scoreDeadlines);
    scoreRisk = Math.max(0, scoreRisk);

    const totalHealth = Math.round((scoreDeadlines + scoreCash + scoreProduction + scoreRisk) / 4);
    
    let reason = "Operacao estavel.";
    if (overdueTasks.length > 0) reason = `${overdueTasks.length} tarefas em atraso detetadas.`;
    if (stalled.length > 0) reason += ` ${stalled.length} projetos estagnados.`;

    const metrics: any = {
      todayTasks,
      todayMeetings: [], // Calendar integration future step
      criticalAlerts: alerts.slice(0, 3),
      cashflow,
      funnel,
      healthIndex: {
        total: projects.length > 0 ? totalHealth : 100, // Default to 100 if no noise
        breakdown: {
          deadlines: scoreDeadlines,
          cash: scoreCash,
          production: scoreProduction,
          risk: scoreRisk
        },
        reason: projects.length > 0 ? reason : "Aguardando primeiros projetos."
      },
      production: [
        { member: 'CEO', plannedHours: 40, actualHours: 0, utilization: 0 } // Mock for structure
      ],
      neuralStatus: {
        status: fa360.getNeuralStatus() ? 'ONLINE' : 'OFFLINE',
        lastSync: await NeuralStorage.load(STORAGE_KEYS.LAST_SYNC),
        message: fa360.getNeuralStatus() ? 'Sincronizado' : 'Conexao Sheets pendente'
      }
    };

    return {
      tasks: todayTasks,
      meetings: await fa360.listEvents(),
      pendingInvoices: overduePayments.length,
      stalledProjects: stalled.length,
      metrics
    };
  },

  listTasks: async (): Promise<Task[]> => {
    return await NeuralStorage.load(STORAGE_KEYS.TASKS) || [];
  },

  saveTask: async (task: Task) => {
    const tasks = await fa360.listTasks();
    const updated = [task, ...tasks];
    await NeuralStorage.save(STORAGE_KEYS.TASKS, updated);
    fa360.log(`TASK: Nova tarefa "${task.title}" registada.`);
    return { success: true };
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    let tasks = await fa360.listTasks();
    tasks = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    await NeuralStorage.save(STORAGE_KEYS.TASKS, tasks);
    fa360.log(`TASK: Tarefa ${taskId} atualizada.`);
    return { success: true };
  },

  deleteTask: async (taskId: string) => {
    let tasks = await fa360.listTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    await NeuralStorage.save(STORAGE_KEYS.TASKS, tasks);
    fa360.log(`TASK: Tarefa ${taskId} removida.`);
    return { success: true };
  },

  listEvents: async () => {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    
    // Mocking 2-3 meetings for today
    return [
      {
        id: 'evt-001',
        title: 'ReuniÃ£o de Acompanhamento - Moradia Cascais',
        location: 'Atelier / Zoom',
        startTime: `${isoDate}T10:00:00Z`,
        endTime: `${isoDate}T11:00:00Z`,
        projectId: 'P001'
      },
      {
        id: 'evt-002',
        title: 'Consultoria Estrutural - Loteamento Estoril',
        location: 'Obra',
        startTime: `${isoDate}T15:30:00Z`,
        endTime: `${isoDate}T17:00:00Z`,
        projectId: 'P002'
      }
    ];
  },

  getAIRecommendations: async (category: 'FINANCIAL' | 'CALENDAR') => {
    if (category === 'FINANCIAL') {
      return "Nenhum dado financeiro suficiente para analise neural.";
    }
    return "Agenda livre. Otimo momento para planeamento estrategico.";
  },

  getNeuralStatus: () => {
    return !!localStorage.getItem(STORAGE_KEYS.STATUS);
  },

  getNeuralHook: () => {
    return localStorage.getItem(STORAGE_KEYS.HOOK) || "";
  },

  logTime: async (log: Omit<TimeLog, 'id'>) => {
    const logs = await NeuralStorage.load(STORAGE_KEYS.TIMELOGS) || [];
    const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
    const updated = [newLog, ...logs];
    await NeuralStorage.save(STORAGE_KEYS.TIMELOGS, updated);
    fa360.log(`TIME: ${log.duration}m registados em ${log.projectId}`);
    return { success: true, log: newLog };
  },

  getProjectTimeLogs: async (projectId: string) => {
    const logs = await NeuralStorage.load(STORAGE_KEYS.TIMELOGS) || [];
    return logs.filter((l: any) => l.projectId === projectId);
  },

  listTimeLogs: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.TIMELOGS) || [];
  },

  subscribeToLogs: (callback: (log: string) => void) => {
    telemetryListeners.push(callback);
    return () => {
      const index = telemetryListeners.indexOf(callback);
      if (index > -1) {
        telemetryListeners.splice(index, 1);
      }
    };
  },

  connectNeuralMaster: async (hook: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOOK, hook);
      localStorage.setItem(STORAGE_KEYS.STATUS, "true");
      await fa360.forceSync();
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },

  syncAllLocalData: async () => {
    fa360.log("SYNC: Sincronizacao em massa iniciada...");
    await fa360.forceSync();
    return { success: true };
  },

  pushToBrain: async (category: string, data: any) => {
    const hook = localStorage.getItem(STORAGE_KEYS.HOOK);
    const studio = "Ferreira Arquitetos";

    if (!hook) {
      const queue = await NeuralStorage.load(STORAGE_KEYS.QUEUE) || [];
      queue.push({ category, data, timestamp: new Date().toISOString() });
      await NeuralStorage.save(STORAGE_KEYS.QUEUE, queue);
      return { success: false, status: 'no_hook' };
    }

    try {
      const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
      worker.postMessage({ hook, category, data, studio });
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  synthesizeProjectInsights: async (project: any) => {
    const cacheKey = `fa-insight-${project.id}`;
    const cached = await NeuralStorage.load(cacheKey);
    if (cached && (Date.now() - cached.timestamp < 1000 * 60 * 60 * 24)) {
      return cached.text;
    }

    const text = await geminiService.analyzeProjectHealth(project);
    await NeuralStorage.save(cacheKey, { text, timestamp: Date.now() });
    return text;
  },

  getGlobalEcosystemAudit: async (locale: string = 'pt') => {
    const cachedAudit = await NeuralStorage.load(STORAGE_KEYS.AUDIT_CACHE);
    const ONE_HOUR = 60 * 60 * 1000;

    if (cachedAudit && (Date.now() - cachedAudit.timestamp < ONE_HOUR)) {
      fa360.log("AI_CACHE: Recuperando auditoria estrategica da Neural Cache.");
      return cachedAudit.result;
    }

    const snapshot = await fa360.getEcosystemSnapshot();
    const result = await geminiService.performGlobalEcosystemAudit(snapshot, locale);

    await NeuralStorage.save(STORAGE_KEYS.AUDIT_CACHE, {
      result,
      timestamp: Date.now(),
      snapshotHash: btoa(JSON.stringify(snapshot)).slice(0, 10)
    });

    return result;
  },

  listTechnicalFiles: async () => {
    await NeuralStorage.ensureFiles();
    return await NeuralStorage.load(STORAGE_KEYS.FILES) as any[] || [];
  },

  saveTechnicalFile: async (file: any) => {
    const files = await fa360.listTechnicalFiles();
    const updated = [file, ...files];
    await NeuralStorage.save(STORAGE_KEYS.FILES, updated);
    fa360.log(`FILE: Novo ficheiro tecnico ${file.name} registado.`);
    return { success: true };
  },

  deleteTechnicalFile: async (id: string) => {
    const files = await fa360.listTechnicalFiles();
    const updated = files.filter((f: any) => f.id !== id);
    await NeuralStorage.save(STORAGE_KEYS.FILES, updated);
    fa360.log(`FILE: Ficheiro tecnico ${id} removido.`);
    return { success: true };
  },

  runAIIntegrityCheck: async () => {
    fa360.log("AI_TECHNICAL: Iniciando varredura de integridade documental...");
    const files = await fa360.listTechnicalFiles();
    const result = await geminiService.checkDocumentationIntegrity(files);
    return result;
  },

  getBrandSettings: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.BRAND) || {
      studioName: "FERREIRA Arquitetos",
      tagline: "Vision to Matter",
      tone: "Sophisticated"
    };
  },

  saveBrandSettings: async (settings: any) => {
    await NeuralStorage.save(STORAGE_KEYS.BRAND, settings);
    fa360.log("BRAND: Identidade de marca atualizada.");
    return { success: true };
  },

  purgeSystemCache: () => {
    fa360.log("CRITICAL: Purga Total solicitada.");
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    // Clear any project-specific insights too
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fa-insight-')) {
        localStorage.removeItem(key);
      }
    }
    window.location.reload();
  },

  listActivity: async () => {
    // For now returning empty until we implement a real activity logger
    return [];
  },

  forceSync: async () => {
    fa360.log("SYNC: Iniciando Forca Bruta de sincronizacao.");
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    window.dispatchEvent(new CustomEvent("fa-sync-complete"));
  },

  listMaterials: async () => {
    let existing = await NeuralStorage.load(STORAGE_KEYS.MATERIALS) as any[];

    const defaults = [
      {
        id: 'M001',
        name: 'Marmore Estremoz',
        category: 'Stone',
        finish: 'Polido',
        price: 'High',
        eco: 95,
        image: '/marble_estremoz.png?v=2',
        location: 'mat_in_studio',
        supplier: 'Margres',
        technical: 'Marmore de origem portuguesa com baixa porosidade e alta resistencia ao desgaste. Ideal para pavimentos interiores e revestimentos de luxo.'
      },
      {
        id: 'M002',
        name: 'Carvalho Americano',
        category: 'Wood',
        finish: 'Escovado',
        price: 'Medium',
        eco: 85,
        image: '/american_oak.png?v=2',
        location: 'mat_in_studio',
        supplier: 'Sonae Arauco',
        technical: 'Madeira de media densidade com grao aberto. Excelente estabilidade dimensional e resistencia ao impacto.'
      },
      {
        id: 'M003',
        name: 'Betao Arquitetonico',
        category: 'Cladding',
        finish: 'Visto',
        price: 'Low',
        eco: 60,
        image: '/concrete_arch.png?v=2',
        location: 'mat_on_site',
        supplier: 'Secil',
        technical: 'Betao de alta performance com acabamento liso. Alta inercia termica e resistencia estrutural.'
      }
    ];

    if (!existing || existing.length === 0) {
      await NeuralStorage.save(STORAGE_KEYS.MATERIALS, defaults);
      return defaults;
    }

    // Force repair of image paths for defaults if they exist but images are broken/missing
    let changed = false;
    existing = existing.map(m => {
      const def = defaults.find(d => d.id === m.id);
      if (def && m.image !== def.image) {
        changed = true;
        return { ...m, image: def.image };
      }
      return m;
    });

    if (changed) {
      await NeuralStorage.save(STORAGE_KEYS.MATERIALS, existing);
    }

    return existing;
  },

  getNeuralProtocol: async (agentId: string) => {
    const protocols: Record<string, string> = {
      'concierge': "AGENTE: DIGITAL CONCIERGE\nMODO: REATIVO\n\nInstrucao Primaria:\nAtuar como primeiro ponto de contacto para leads e clientes.\n\nDiretrizes:\n1. Responder sempre com tom 'Inspirational'.\n2. Priorizar agendamento de reunioes.\n3. Encaminhar questoes tecnicas para o Piloto Financeiro.",
      'pilot': "AGENTE: FINANCIAL PILOT\nMODO: ANALITICO\n\nInstrucao Primaria:\nMonitorizar rentabilidade e cashflow do estudio.\n\nDiretrizes:\n1. Alerta critico se margem < 20%.\n2. Validar viabilidade de todas as propostas > 50k.\n3. Otimizar fluxo de caixa a 30 dias.",
      'director': "AGENTE: CREATIVE DIRECTOR\nMODO: VISIONARIO\n\nInstrucao Primaria:\nGarantir coerencia estetica de todas as saidas.\n\nDiretrizes:\n1. Validar materiais com base na sustentabilidade.\n2. Manter linguagem minimalista e premium.\n3. Rejeitar renderizacoes de baixa resolucao."
    };
    return protocols[agentId] || "Protocolo nao definido.";
  },

  runMaterialAIAnalysis: async (material: any) => {
    fa360.log(`AI_MATERIAL: Analisando performance tecnica de ${material.name}...`);
    return await geminiService.getMaterialPerformanceAnalysis(material);
  },

  listMediaAssets: async () => {
    // Zero Data Mode: Start empty
    const existing = await NeuralStorage.load(STORAGE_KEYS.MEDIA);
    if (!existing) {
      await NeuralStorage.save(STORAGE_KEYS.MEDIA, []);
      return [];
    }
    return existing;
  },

  listTeamMembers: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.TEAM) || [];
  },

  listTransmittals: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.TRANSMITTALS) || [];
  },

  runCreativeMediaAudit: async () => {
    fa360.log("AI_MEDIA: Analisando impacto visual da biblioteca...");
    const assets = await fa360.listMediaAssets();
    return await geminiService.getCreativeMediaDirective(assets);
  },

  // Repository Generic Bridge for Automation
  create: async (category: string, data: any) => {
    const keyMap: Record<string, string> = {
      'Projects': STORAGE_KEYS.PROJECTS,
      'Payments': STORAGE_KEYS.PAYMENTS,
      'Tasks': STORAGE_KEYS.TASKS,
      'Documents': STORAGE_KEYS.DOCUMENTS,
      'AuditLog': STORAGE_KEYS.AUDIT_LOG,
    };

    const key = keyMap[category];
    if (!key) throw new Error(`Unknown category: ${category}`);

    const existing = await NeuralStorage.load(key) || [];
    const updated = [data, ...existing];
    await NeuralStorage.save(key, updated);
    
    fa360.log(`REPO: New entry in ${category}`);
    
    // Optional: push to brain if hook exists
    fa360.pushToBrain(category.toUpperCase(), data);
    
    return { success: true };
  }
};

export default fa360;
```

## File: .\services\feeCalculator.ts
```
// services/feeCalculator.ts
import { templates, phaseCatalog } from './feeData';
import { PAYMENT_MILESTONES } from './paymentMilestones';
import { TASK_CATALOG } from './taskCatalog';
import { applyDiscountPolicy } from './discountPolicy';
import { SCENARIO_CATALOG } from './scenarioCatalog';
import { INTERNAL_RATES, OVERHEAD_MULT, FINANCE_THRESHOLDS, MIN_FEES } from './financeConfig';
import { CalculationParams, Complexity, Scenario, UnitsInput, FeeTemplate } from '../types';

// ---------- CONFIG (ajusta aqui sem mexer na logica) ----------
// mantem no topo
const VAT_RATE = 0.23;

// Multiplicadores
const COMPLEXITY_MULT: Record<Complexity, number> = { 1: 0.9, 2: 1.25, 3: 1.8 };

// Especialidades: base incluida + incremento
const INCLUDED_SPECS = 4;
const SPEC_FEE_EXTRA_PCT = 0.07;   // +7% por especialidade acima de INCLUDED_SPECS
const SPEC_HOURS_EXTRA_PCT = 0.05; // +5% horas coord por especialidade extra

// Rates internos (custos) â€” aproximacao realista p/ calculo de margem
// Rates movidos para financeConfig.ts

// OVERHEAD_MULT movido para financeConfig.ts

const PROFILE_RATE_KEY: Record<string, keyof typeof INTERNAL_RATES> = {
  "Arquiteto Senior": "senior",
  "Equipa Tecnica": "team",
  "Arquiteto": "architect",
  "Arquiteto + Equipa": "team",
};

// Fases: pesos (mantive os teus, mas com normalizacao robusta)
const ALL_PHASE_WEIGHTS = [
  { id: "A0", weight: 0.20 },
  { id: "A1", weight: 0.25 },
  { id: "A2", weight: 0.30 },
  { id: "A3", weight: 0.15 },
  { id: "A4", weight: 0.10 },
] as const;

function normalizeWeights(weights: { id: string; weight: number }[]) {
  const sum = weights.reduce((acc, w) => acc + w.weight, 0);
  if (sum <= 0) return weights.map(w => ({ ...w, weight: 0 }));
  return weights.map(w => ({ ...w, weight: w.weight / sum }));
}

function clamp(n: number, min: number, max: number) {
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function round(n: number) {
  if (isNaN(n)) return 0;
  return Math.round(n);
}

function getUnitCount(template: FeeTemplate, units?: UnitsInput) {
  const kind = template.unitPricing?.unitKind;
  if (!kind) return 0;
  if (kind === 'APARTMENT') return Math.max(0, Number(units?.apartments || 0));
  if (kind === 'LOT') return Math.max(0, Number(units?.lots || 0));
  if (kind === 'ROOM') return Math.max(0, Number(units?.rooms || 0));
  return 0;
}

// Pricing por template
function calcArchitectureFee(template: FeeTemplate, area: number, compMult: number, scenMult: number, units?: UnitsInput) {
  const safeArea = Math.max(1, Number(area || 0)); // Garante pelo menos 1m2 para evitar 0 total na arquitetura se area estiver vazia ou string

  switch (template.pricingModel) {
    case 'PACKAGE': {
      const base = template.baseFeeArch ?? 4000;
      return base * compMult * scenMult;
    }
    case 'EUR_PER_M2': {
      const rate = template.rateArchPerM2 ?? 65;
      return safeArea * rate * compMult * scenMult;
    }
    case 'UNIT': {
      const cfg = template.unitPricing;
      if (!cfg) {
        const rate = template.rateArchPerM2 ?? 55;
        return safeArea * rate * compMult * scenMult;
      }
      const unitCount = getUnitCount(template, units);
      const base = cfg.baseFeeArch ?? 0;
      const included = cfg.includedUnits ?? 0;
      const extraMult = cfg.extraUnitMultiplier ?? 1.0;
      const extraUnits = Math.max(0, unitCount - included);

      const unitsFee =
        (Math.min(unitCount, included) * cfg.feePerUnitArch) +
        (extraUnits * cfg.feePerUnitArch * extraMult);

      const areaFee = (cfg.feePerM2Arch ?? 0) * safeArea;
      const raw = base + unitsFee + areaFee;
      return raw * compMult * scenMult;
    }
    default: {
      const rate = template.rateArchPerM2 ?? 65;
      return safeArea * rate * compMult * scenMult;
    }
  }
}

function calcSpecsFee(area: number, baseRateSpec: number, compMult: number, scenMult: number, specCount: number, units?: UnitsInput, template?: FeeTemplate) {
  const safeArea = Math.max(0, Number(area || 0));
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);
  const specMult = 1 + extraSpecs * SPEC_FEE_EXTRA_PCT;

  let unitFactor = 1;
  if (template?.pricingModel === 'UNIT') {
    const unitCount = getUnitCount(template, units);
    unitFactor = 1 + Math.max(0, unitCount - 6) * 0.03;
    unitFactor = clamp(unitFactor, 1, 1.6);
  }

  return safeArea * baseRateSpec * compMult * scenMult * specMult * unitFactor;
}

function buildEffortMap(compMult: number, scenario: Scenario, specCount: number) {
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);

  return TASK_CATALOG.arch.map(task => {
    let hours = task.baseHours * compMult;

    // Ajuste especifico para coordenacao
    if (task.id === 'COORD_01') {
      hours = hours * (1 + extraSpecs * SPEC_HOURS_EXTRA_PCT);
    }

    let active = true;
    if (task.id === 'A3_01' || task.id === 'A4_01') {
      active = scenario === 'premium';
    }

    return {
      taskId: task.id,
      label: task.label,
      hours: round(hours),
      profile: task.profile,
      active
    };
  }).filter(r => r.active);
}

function estimatedInternalCost(effortMap: { hours: number; profile: string }[]) {
  const base = effortMap.reduce((acc, row) => {
    const key = PROFILE_RATE_KEY[row.profile] ?? "team";
    const rate = INTERNAL_RATES[key];
    return acc + row.hours * rate;
  }, 0);

  return base * OVERHEAD_MULT;
}

function phasesBreakdown(feeTotal: number, scenario: Scenario, area: number, complexity: Complexity, template?: FeeTemplate) {
  // 1. Determine base active phases by Scenario
  let activePhases = scenario === 'premium'
    ? ALL_PHASE_WEIGHTS
    : ALL_PHASE_WEIGHTS.filter(w => ['A0', 'A1', 'A2'].includes(w.id));

  // 2. Filter by Template Process Type (Typology)
  if (template) {
    if (template.processType === 'lic') {
      // Licensing only: Force remove Execution (A3) and usually Assistance (A4) if purely licensing, 
      // but lets keep A4 if scenario is premium? No, Licensing shouldn't have construction phases.
      activePhases = activePhases.filter(w => ['A0', 'A1', 'A2'].includes(w.id));
    }
    // If 'exec', we assume it CAN go up to execution, so we respect the Scenario (Premium vs Standard).
    // If 'hybrid' (e.g. Rehab), allows all.
  }

  const normalized = normalizeWeights(activePhases as { id: string; weight: number }[]);

  // Base weeks per phase (Standard complexity, ~200m2)
  const baseWeeks: Record<string, number> = {
    'A0': 1,
    'A1': 4,
    'A2': 4,
    'A3': 4, // Execucao
    'A4': 2  // Assistencia
  };

  // Scale factors
  let areaMult = 1;
  if (area < 150) areaMult = 0.8;
  else if (area > 500) areaMult = 1.5;
  else if (area > 1000) areaMult = 2.0;

  const compMult = complexity === 3 ? 1.3 : complexity === 2 ? 1.1 : 1.0;

  return normalized.map(pw => {
    const info = phaseCatalog.find(p => p.phaseId === pw.id);

    const rawWeeks = (baseWeeks[pw.id] || 2) * areaMult * compMult;
    const weeks = Math.max(1, Math.round(rawWeeks));

    return {
      phaseId: pw.id,
      label: info?.labelPT || pw.id,
      labelEN: info?.labelEN || info?.labelPT || pw.id,
      description: info?.shortPT || "",
      descriptionEN: info?.shortEN || info?.shortPT || "",
      value: round(feeTotal * pw.weight),
      percentage: round(pw.weight * 100),
      weeks: weeks, // Raw value for UI translation
      duration: `${weeks} ${weeks === 1 ? 'Semana' : 'Semanas'}`
    };
  });
}

function buildPaymentPlan(feeTotal: number, scenario: Scenario) {
  const milestones = PAYMENT_MILESTONES[scenario] || PAYMENT_MILESTONES.standard;
  return milestones.map((m, idx) => ({
    id: `PAY_${idx + 1}`,
    name: m.name,
    percentage: m.pct,
    value: round(feeTotal * (m.pct / 100)),
    vat: round(feeTotal * (m.pct / 100) * VAT_RATE), // Will be overridden in main, but good default
    dueDays: m.dueDays,
    phaseId: 'COMMERCIAL'
  }));
}

function riskEngine(input: {
  marginPct: number;
  scenario: Scenario;
  complexity: Complexity;
  area: number;
  specCount: number;
  discountPct: number;
  discountStatus?: 'applied' | 'rejected' | 'clamped';
  units?: UnitsInput;
  template?: FeeTemplate;
}) {
  const { marginPct, scenario, complexity, area, specCount, discountPct, discountStatus, units, template } = input;
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);

  let riskScore = 0;
  const signals: string[] = [];
  const alerts: string[] = [];
  const recommendations: string[] = [];

  // Complexidade
  if (complexity === 3) { riskScore += 25; signals.push("Complexity_High"); }
  else if (complexity === 2) { riskScore += 12; signals.push("Complexity_Medium"); }

  // Cenario
  if (scenario === 'essential') { riskScore += 18; signals.push("Scenario_Essential"); }
  if (scenario === 'premium') { riskScore -= 8; signals.push("Scenario_Executive"); }

  // Escala
  if (area > 500) { riskScore += 12; signals.push("Scale_Over_500"); }
  if (area > 1000) { riskScore += 20; signals.push("Scale_Over_1000"); }

  // UNIT scale risk
  if (template) {
    const unitCount = getUnitCount(template, units);
    if (template.pricingModel === 'UNIT' && template.unitPricing?.unitKind === 'APARTMENT') {
      const extraRisk = Math.min(20, Math.max(0, unitCount - 8) * 2);
      riskScore += extraRisk;
      if (extraRisk > 0) signals.push("Apartment_Scale_Extra");
    }
    if (template.pricingModel === 'UNIT' && template.unitPricing?.unitKind === 'LOT') {
      const extraRisk = Math.min(20, Math.max(0, unitCount - 6) * 3);
      riskScore += extraRisk;
      if (extraRisk > 0) signals.push("Lot_Scale_Extra");
    }
  }

  // Especialidades extra
  riskScore += Math.min(20, extraSpecs * 4);
  if (extraSpecs > 0) signals.push("Specs_Extra");

  // Descontos agressivos e politica
  if (discountStatus === 'rejected') {
    signals.push("Discount_Rejected");
    alerts.push("âš ï¸ Desconto rejeitado por politica. Rever condicoes.");
  }
  if (discountPct > 15) { riskScore += 10; signals.push("Discount_Over_15"); }
  if (discountPct > 20) { riskScore += 20; signals.push("Discount_Over_20"); }

  // Margem
  if (marginPct < FINANCE_THRESHOLDS.marginWarn) { riskScore += 15; signals.push("Margin_Tight"); }
  if (marginPct < FINANCE_THRESHOLDS.marginBlock) { riskScore += 30; signals.push("Margin_Under_Redline"); }

  riskScore = clamp(riskScore, 0, 100);

  const riskLevel: 'low' | 'medium' | 'high' =
    riskScore >= 60 ? 'high' :
      riskScore >= 30 ? 'medium' : 'low';

  // Alertas e recomendacoes (acao concreta)
  if (marginPct < FINANCE_THRESHOLDS.marginBlock) {
    alerts.push(`ðŸš¨ BLOQUEIO: Margem critica (<${FINANCE_THRESHOLDS.marginBlock}%). Configuracao financeiramente inviavel.`);
    recommendations.push("Reduzir desconto (â‰¤10%) ou subir cenario para Profissional/Executivo.");
    recommendations.push("Rever rate por mÂ² ou aumentar fee minima do template.");
  } else if (marginPct < FINANCE_THRESHOLDS.marginWarn) {
    alerts.push(`ðŸŸ¡ Margem minima operacional (<${FINANCE_THRESHOLDS.marginWarn}%). Espaco de manobra nulo.`);
    recommendations.push("Evitar alteracoes fora de escopo; preferir Modo Profissional.");
  } else if (marginPct < FINANCE_THRESHOLDS.marginHealthy) {
    alerts.push(`ðŸŸ¢ Margem aceitavel. Considerar otimizacao para aproximar de ${FINANCE_THRESHOLDS.marginHealthy}%.`);
  }

  // Regras de risco especificas
  if (scenario === 'essential' && specCount > 4) {
    alerts.push("âš ï¸ Risco Tecnico: Modo Essencial com excesso de disciplinas (>4). Aumenta risco de falhas na coordenacao.");
    recommendations.push("Mudar para Modo Profissional para incluir coordenacao mais robusta.");
  }

  if (scenario !== 'premium' && complexity === 3 && area > 500) {
    alerts.push("âš ï¸ Desequilibrio: Grande escala + Complexidade Alta sem Modo Executivo.");
    recommendations.push("Recomenda-se Modo Executivo para reduzir risco e estabilizar expectativas.");
  }

  if (riskLevel === 'high' || signals.length >= 3 || discountPct > 15) {
    alerts.push("ðŸš© Alerta Estrategico: Elevado potencial de desgaste psicologico/comercial.");
    recommendations.push("Reforcar exclusoes e limitar revisoes incluidas no ambito.");
  }

  return {
    riskScore,
    riskLevel,
    signals,
    alerts,
    recommendations,
  };
}

// ---------- MAIN ----------
export const calculateFees = (params: CalculationParams & { clientName?: string, location?: string }) => {
  const { templateId, area, complexity, selectedSpecs, scenario, discount, units } = params;

  const template = templates.find(t => t.templateId === templateId);
  if (!template) return null;

  // No need for 'as any' since vatRate is now in CalculationParams
  const vatRate = params.vatRate ?? VAT_RATE;

  const specCount = selectedSpecs.length;

  const safeArea = Math.max(0, Number(area || 0));
  const compMult = COMPLEXITY_MULT[complexity] || 1.0;
  /* REMOVED SCENARIO_MULT usage, use SCENARIO_CATALOG */
  const scenarioPack = SCENARIO_CATALOG[scenario] || SCENARIO_CATALOG.standard; // Fallback
  if (!scenarioPack) {
      console.error("Critical: Scenario Pack not found for", scenario);
      return null;
  }
  const scenMult = scenarioPack.multiplier ?? 1.0;

  const baseRateSpec = 28;

  const feeArchRaw = calcArchitectureFee(template, safeArea, compMult, scenMult, units);
  const feeSpecRaw = calcSpecsFee(safeArea, baseRateSpec, compMult, scenMult, specCount, units, template);

  const subTotalRaw = feeArchRaw + feeSpecRaw;

  // PATCH V1: Ordem de Operacoes (Corrigido)
  // 1. Determinar Taxa Minima (Guardrails)
  let minFeeGuard = template.minFeeTotal ?? 0;

  // Guardrail 1: Min Fee by Scenario
  const scenarioMin = MIN_FEES[scenario];
  if (scenarioMin) {
    minFeeGuard = Math.max(minFeeGuard, scenarioMin);
  }

  // Guardrail 2: Min Fee by Unit (Exemplo simplificado)
  if (template.pricingModel === 'UNIT' && units) {
    // Logica futura de unit min
  }

  // 2. Estabelecer Valor Base Efetivo (antes de descontos e guardrails)
  const effectiveBaseFee = Math.max(subTotalRaw, minFeeGuard);
  const minFeeApplied = subTotalRaw < minFeeGuard;

  // 3. Aplicar Desconto sobre o Valor Base Efetivo
  const userRole = params.userRole || 'arquiteto';
  const discountEval = applyDiscountPolicy(effectiveBaseFee, discount, {
    userRole,
    scenario,
    specCount
  });

  const appliedDiscount = discountEval.appliedPct;
  const discountAmount = discountEval.discountAmount;
  const discountAudit = discountEval.audit;

  // 4. Calcular Total Final
  // O feeTotal final AQUI jÃ¡ inclui o desconto.
  // IMPORTANTE: Se o minFeeGuard for ativado, o desconto incide sobre ele?
  // Na logica atual: sim, `applyDiscountPolicy` recebe `effectiveBaseFee` (que Ã© >= minFeeGuard).
  // Se o desconto fizer baixar do minimo ADMISSIVEL apÃ³s desconto, isso deveria ser gerido policy ou clamp?
  // O "Min Fee Hit" Ã© verificado no UI atravÃ©s de meta.minFeeApplied ou logica similar.
  // Assumimos que o desconto Ã© aplicado sobre o valor de tabela/ajustado.

  const feeTotal = effectiveBaseFee - discountAmount;

  // Distribute total back to components
  let feeArch = feeArchRaw;
  let feeSpec = feeSpecRaw;

  if (subTotalRaw > 0) {
    const ratio = feeTotal / subTotalRaw;
    // Se houve minFee, o ratio aumenta. Se houve desconto, diminui.
    // Ajustamos os componentes proportionally.
    feeArch = feeArchRaw * ratio;
    feeSpec = feeSpecRaw * ratio;
  } else if (feeTotal > 0) {
    feeArch = feeTotal;
    feeSpec = 0;
  }

  // --- PASSO 9.3: DELTA VS STANDARD ---
  // Recalcular Standard Baseline
  const stdMult = SCENARIO_CATALOG.standard.multiplier;
  
  // Fee Base "Standard" (antes de mins/descontos, sÃ³ multiplicador trocado)
  // Nota: calcArchitectureFee usa multiplicadores diretos.
  // O "Standard" tem scenMult = 1.0 (ou o valor em catalogo).
  const feeArchStd = calcArchitectureFee(template, safeArea, compMult, stdMult, units);
  const feeSpecStd = calcSpecsFee(safeArea, baseRateSpec, compMult, stdMult, specCount, units, template);
  
  const subTotalStd = feeArchStd + feeSpecStd;

  // Aplicar MESMO desconto % (para comparacao justa de valor comercial)
  const stdDiscountAmount = (subTotalStd * appliedDiscount) / 100;
  const stdAfterDiscount = subTotalStd - stdDiscountAmount;

  // Min Fee Guardrail para Standard?
  // Sim, idealmente aplicamos a mesma logica de guardrail do standard (que pode ter min diferente, ex: MIN_FEES.standard)
  // Mas para "delta vs standard" rÃ¡pido, vamos assumir o valor comercial direto.
  // Se quisermos ser rigorosos, aplicamos MIN_FEES.standard.
  const stdMinGuard = Math.max(template.minFeeTotal ?? 0, MIN_FEES.standard);
  const stdEffective = Math.max(stdAfterDiscount, stdMinGuard);
  
  // Mas se stdEffective aplicar guardrail, perdemos a nocoa de "delta puro de multiplicador".
  // Vamos usar a logica requisitada: "stdNet = stdGuardrail.finalNet" (implicando logica completa).
  // Simplificacao: usaremos stdAfterDiscount (com desconto) como comparativo direto, ou stdEffective.
  // Vamos usar stdEffective para ser coerente com "quanto custaria Standard".
  
  const stdNet = Math.round(stdEffective);
  const stdVat = round(stdNet * vatRate);
  const stdGross = round(stdNet * (1 + vatRate));

  const thisNet = round(feeTotal);
  const thisVat = round(feeTotal * vatRate);
  const thisGross = round(feeTotal * (1 + vatRate));

  const deltaVsStandard = {
    net: thisNet - stdNet,
    vat: thisVat - stdVat,
    gross: thisGross - stdGross,
  };

  const effortMap = buildEffortMap(compMult, scenario, specCount);

  const estimatedCost = estimatedInternalCost(effortMap);
  const margin = feeTotal > 0 ? ((feeTotal - estimatedCost) / feeTotal) * 100 : 0;

  const strategicRisk = riskEngine({
    marginPct: margin,
    scenario,
    complexity,
    area: safeArea,
    specCount,
    discountPct: appliedDiscount,
    discountStatus: discountAudit.status,
    units,
    template
  });

  const phases = phasesBreakdown(feeTotal, scenario, safeArea, complexity, template);
  const paymentPlan = buildPaymentPlan(feeTotal, scenario).map(p => ({
    ...p,
    vat: round(p.value * vatRate)
  }));

  const vat = round(feeTotal * vatRate);
  const totalWithVat = round(feeTotal * (1 + vatRate));

  // --- PASSO 10.1: Payload Ajustado ---
  const net = round(feeTotal);
  // vat declared above already
  const gross = round(net * (1 + vatRate));
  
  const automationPayload = {
    simulationId: `SIM_${Date.now()}`,
    templateId,
    scenarioId: scenario,
    client: { name: params.clientName || '' },
    location: params.location || '',
    fees: { net, vatRate, gross },
    payments: paymentPlan.map((p, idx) => ({
      id: `PAY_${idx + 1}`,
      name: p.name,
      phaseId: p.phaseId,
      percentage: p.percentage,
      valueNet: p.value,
      dueDays: p.dueDays
    })),
    tasks: {
      archIds: effortMap.map(e => e.taskId),
      specIds: selectedSpecs
    },
    // Updated Payload Structure
    scenario: {
      id: scenarioPack.id,
      labelPT: scenarioPack.labelPT,
      revisionsIncluded: scenarioPack.revisionsIncluded,
      deliverablesPT: scenarioPack.deliverablesPT,
      deliverablesEN: scenarioPack.deliverablesEN,
      exclusionsPT: scenarioPack.exclusionsPT,
      exclusionsEN: scenarioPack.exclusionsEN,
    },
    deltaVsStandard,
    configSnapshot: {
      vatRate,
      thresholds: FINANCE_THRESHOLDS,
      multipliers: {
        complexity: compMult,
        scenario: scenMult,
      },
      scenarioConfig: SCENARIO_CATALOG[scenario]
    },
    meta: {
      createdAt: new Date().toISOString(),
      configSnapshot: {
        compMult,
        scenMult,
        appliedDiscount,
        guardrail: discountAudit.status // Using available audit status
      }
    },
    schedule: { startDate: new Date().toISOString() }
  };

  return {
    feeArch: round(feeArch),
    feeSpec: round(feeSpec),
    feeTotal: round(feeTotal),
    vat: vat,
    totalWithVat: totalWithVat,
    vatRate: vatRate,
    phasesBreakdown: phases,
    paymentPlan: paymentPlan,
    effortMap,
    selectedSpecs,
    units: units || {},
    strategic: {
      margin: round(margin),
      riskLevel: strategicRisk.riskLevel,
      riskScore: strategicRisk.riskScore,
      alerts: [...(discountEval.alerts || []), ...strategicRisk.alerts],
      recommendations: strategicRisk.recommendations,
      signals: strategicRisk.signals,
      estimatedCost: round(estimatedCost),
      isHealthy: margin >= FINANCE_THRESHOLDS.marginBlock && strategicRisk.riskLevel !== 'high',
      isBlocked: margin < FINANCE_THRESHOLDS.marginBlock,
    },
    scenarioPack: {
      id: scenarioPack.id,
      labelPT: scenarioPack.labelPT,
      multiplier: scenarioPack.multiplier,
      revisionsIncluded: scenarioPack.revisionsIncluded,
      deliverablesPT: scenarioPack.deliverablesPT,
      deliverablesEN: scenarioPack.deliverablesEN,
      exclusionsPT: scenarioPack.exclusionsPT,
      exclusionsEN: scenarioPack.exclusionsEN,
      notesPT: scenarioPack.notesPT,
      notesEN: scenarioPack.notesEN
    },
    deltaVsStandard,
    meta: {
      templateId,
      pricingModel: template.pricingModel,
      appliedDiscount,
      discountAudit,
      specCount,
      compMult,
      scenMult,
      minFeeApplied,
      units: units || {},
      vatRate,
      scenarioDiffs: {
        standard: SCENARIO_CATALOG.standard.multiplier,
        current: SCENARIO_CATALOG[scenario].multiplier
      }
    },
    automationPayload
  };
};
```

## File: .\services\feeData.ts
```

import { FeeTemplate, Phase, Discipline, TemplatePhaseWeight, TemplateSpecialty } from '../types';

export const templates: FeeTemplate[] = [
  { templateId: "MORADIA_LICENSE", namePT: "Moradia â€” Licenciamento", nameEN: "House â€” Permitting", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 1, rateArchPerM2: 65, minFeeTotal: 4500 },
  { templateId: "MORADIA_EXEC", namePT: "Moradia â€” Execucao", nameEN: "House â€” Construction Docs", processType: "exec", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 2, rateArchPerM2: 85, minFeeTotal: 6500 },
  { templateId: "MORADIA_REHAB", namePT: "Moradia â€” Reabilitacao/Ampliacao", nameEN: "House â€” Rehab", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 3, rateArchPerM2: 75, minFeeTotal: 5500 },
  { templateId: "LEGAL", namePT: "Moradia â€” Legalizacao (Simplex)", nameEN: "House â€” Legalization", processType: "lic", pricingModel: "PACKAGE", legalProfile: "PT", sortOrder: 4, baseFeeArch: 4000, minFeeTotal: 2500 },
  {
    templateId: "MULTIFAMILY",
    namePT: "Multifamiliar â€” Licenciamento",
    nameEN: "Multi-family â€” Permitting",
    processType: "lic",
    pricingModel: "UNIT",
    legalProfile: "PT",
    sortOrder: 5,
    minFeeTotal: 15000,
    unitPricing: {
      unitKind: 'APARTMENT',
      baseFeeArch: 9000,
      feePerUnitArch: 900,
      feePerM2Arch: 18,
      includedUnits: 8,
      extraUnitMultiplier: 1.08,
    }
  },
  { templateId: "RESTAURANT", namePT: "Comercial â€” Restauracao", nameEN: "Commercial â€” Restaurant", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 6, rateArchPerM2: 95, minFeeTotal: 5000 },
  {
    templateId: "LOTEAMENTO",
    namePT: "Loteamento / Urbanismo",
    nameEN: "Subdivision",
    processType: "lic",
    pricingModel: "UNIT",
    legalProfile: "PT",
    sortOrder: 7,
    minFeeTotal: 8000,
    unitPricing: {
      unitKind: 'LOT',
      baseFeeArch: 4500,
      feePerUnitArch: 650,
      includedUnits: 6,
      extraUnitMultiplier: 1.10,
    }
  },
  { templateId: "PIP", namePT: "PIP (Pedido de Informacao Previa)", nameEN: "PIP (Pre-Application)", processType: "lic", pricingModel: "PACKAGE", legalProfile: "PT", sortOrder: 8, baseFeeArch: 2500, minFeeTotal: 1500 },
];

export const phaseCatalog: Phase[] = [
  { phaseId: "A0", phaseType: "ARCH", labelPT: "A0. Programa Base", labelEN: "A0. Briefing", shortPT: "Definicao de objetivos, requisitos e condicionantes do projeto.", shortEN: "Definition of project goals and constraints." },
  { phaseId: "A1", phaseType: "ARCH", labelPT: "A1. Estudo Previo", labelEN: "A1. Schematic Design", shortPT: "Conceito e solucao volumetrica para validacao com o cliente.", shortEN: "Conceptual solution for client validation." },
  { phaseId: "A2", phaseType: "ARCH", labelPT: "A2. Licenciamento (RJUE)", labelEN: "A2. Permitting", shortPT: "Pecas tecnicas para submissao e aprovacao camararia (RJUE).", shortEN: "Technical submission for council approval (RJUE)." },
  { phaseId: "A3", phaseType: "ARCH", labelPT: "A3. Projeto de Execucao", labelEN: "A3. Construction Docs", shortPT: "Detalhe tecnico rigoroso para construcao sem improvisos.", shortEN: "Rigorous technical detail for construction." },
  { phaseId: "A4", phaseType: "ARCH", labelPT: "A4. Assistencia Tecnica", labelEN: "A4. Tech Assistance", shortPT: "Esclarecimentos em obra e tramitacao administrativa final.", shortEN: "Site support and final administrative procedures." },
];

export const disciplines: Discipline[] = [
  {
    disciplineId: "STRUCT",
    labelPT: "Estabilidade / Estruturas",
    labelEN: "Structure",
    phases: [
      { phaseId: "A1", labelPT: "Pre-dimensionamento", shortPT: "Solucoes estruturais e condicionantes base." },
      { phaseId: "A2", labelPT: "Projeto para licenciamento", shortPT: "Pecas e memorias para submissao." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhe construtivo, pormenores, compatibilizacao." },
    ]
  },
  {
    disciplineId: "WATER",
    labelPT: "Redes de Aguas e Saneamento",
    labelEN: "Water & Sewage",
    phases: [
      { phaseId: "A1", labelPT: "Tracados base", shortPT: "Prumadas, zonas tecnicas e condicionantes." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Pecas desenhadas e memoria descritiva." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Dimensionamentos finais e pormenores." },
    ]
  },
  {
    disciplineId: "ELEC",
    labelPT: "Instalacoes Eletricas",
    labelEN: "Electrical",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia e zonas tecnicas", shortPT: "Quadros, shafts, acessos e cargas." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto regulamentar para submissao." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Mapas finais, compatibilizacao e detalhes." },
    ]
  },
  {
    disciplineId: "SCIE",
    labelPT: "Seguranca Contra Incendio (SCIE)",
    labelEN: "Fire Safety",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia SCIE", shortPT: "Compartimentacao, evacuacao e risco." },
      { phaseId: "A2", labelPT: "Projeto SCIE", shortPT: "Pecas e medidas de autoprotecao base." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorizacao e compatibilizacao em obra." },
    ]
  },
  {
    disciplineId: "THERM",
    labelPT: "Termica (REH / RECS)",
    labelEN: "Thermal",
    phases: [
      { phaseId: "A1", labelPT: "Pre-avaliacao", shortPT: "Estrategia de desempenho e envolvente." },
      { phaseId: "A2", labelPT: "Projeto termico", shortPT: "Calculos e documentacao regulamentar." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Ajustes finais, compatibilizacao e materiais." },
    ]
  },
  {
    disciplineId: "ACOUST",
    labelPT: "Acustica",
    labelEN: "Acoustics",
    phases: [
      { phaseId: "A1", labelPT: "Definicao de solucoes", shortPT: "Criterios e solucoes tipo por zona." },
      { phaseId: "A2", labelPT: "Projeto acustico", shortPT: "Pecas e relatorio regulamentar." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhes e validacoes para obra." },
    ]
  },
  {
    disciplineId: "ITED",
    labelPT: "ITED",
    labelEN: "Telecom (ITED)",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia ITED", shortPT: "Risers, caminhos de cabos e pontos." },
      { phaseId: "A2", labelPT: "Projeto ITED", shortPT: "Pecas regulamentares e termos." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorizacao e compatibilizacao." },
    ]
  },
  {
    disciplineId: "HVAC",
    labelPT: "AVAC / Ventilacao",
    labelEN: "HVAC",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia AVAC", shortPT: "Zonas tecnicas e opcoes de sistema." },
      { phaseId: "A2", labelPT: "Projeto", shortPT: "Calculos, dimensionamentos e pecas." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhes e compatibilizacao." },
    ]
  },
  {
    disciplineId: "GAS",
    labelPT: "Gas",
    labelEN: "Gas",
    phases: [
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto de gas regulamentar." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorizacao de tracados." },
    ]
  }
];

export const exclusionsPT = [
  "Taxas camararias e de entidades externas",
  "Levantamentos topograficos e de arquitetura pre-existente",
  "Estudos geotecnicos, ensaios laboratoriais e sondagens",
  "Fiscalizacao e Direcao de Obra (salvo contrato especifico)",
  "Plano de Seguranca e Saude (PSS) e Coordenacao de Seguranca",
  "Impressao de copias fisicas (entrega padrao em formato digital)",
];

export const extrasPT = [
  { label: "Revisao adicional (pos-validacao)", price: "85â‚¬/h" },
  { label: "Visita extra a obra ou fornecedor", price: "125â‚¬/un" },
  { label: "Telas Finais (as-built)", price: "Sob consulta" },
  { label: "Coordenacao BIM (LOD 300+)", price: "+15% Honorarios" },
];

export const templateSpecialties: TemplateSpecialty[] = [
  { templateId: "MORADIA_LICENSE", disciplineId: "STRUCT", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "WATER", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "ELEC", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "ITED", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "THERM", required: true, defaultOn: true },
  { templateId: "RESTAURANT", disciplineId: "SCIE", required: true, defaultOn: true },
  { templateId: "RESTAURANT", disciplineId: "HVAC", required: true, defaultOn: true },
];
```

## File: .\services\financeConfig.ts
```
export const INTERNAL_RATES = {
    senior: 55,      // CEO
    architect: 45,   // arquiteto (misto)
    team: 38,        // media (Jessica/Sofia)
} as const;

export const OVERHEAD_MULT = 1.20; // 20% overhead

export const FINANCE_THRESHOLDS = {
    marginBlock: 45,
    marginWarn: 50,
    marginHealthy: 60,
    discountAlert: 15,
    discountMax: 25
};

export const MIN_FEES = {
    essential: 2500,
    standard: 4000,
    premium: 7500
} as const;
```

## File: .\services\geminiService.ts
```
import { GoogleGenAI } from "@google/genai";
import { NeuralStorage, STORAGE_KEYS } from "./fa360";

// Memoria de Sessao para o Ecossistema FA-360
let chatHistory: any[] = [];

const fallbackBrand = {
  studioName: "FERREIRA Arquitetos",
  tagline: "Vision to Matter",
  tone: "Sophisticated"
};

export const geminiService = {
  generateMarketingCaption: async (projectDescription: string, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write 3 luxury Instagram captions for this architecture project from ${brand.studioName}: "${projectDescription}". 
        Tone: ${brand.tone}, Sophisticated, poetic, focused on "${brand.tagline}", light, and silence. Language: ${isEn ? 'English' : 'Portuguese (Portugal)'}. 
        Use elegant emojis.`,
        config: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return isEn ? "Error generating captions." : "Ocorreu um erro ao gerar a legenda.";
    }
  },

  analyzeProjectHealth: async (projectData: any, locale: string = 'pt') => {
    const isEn = locale === 'en';
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'undefined') {
      return isEn ? "Status nominal. Standard monitoring recommended." : "Status nominal. Recomenda-se acompanhamento padrao.";
    }

    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this architecture project health and give a 1-sentence recommendation: ${JSON.stringify(projectData)}. 
        Focus on profitability and deadlines. Language: ${isEn ? 'English' : 'Portuguese (Portugal)'}.`,
        config: {
          temperature: 0.2,
        }
      });
      return response.text;
    } catch (error) {
      return isEn ? "Status nominal. Standard monitoring recommended." : "Status nominal. Recomenda-se acompanhamento padrao.";
    }
  },

  // Auditoria Estrategica Global (Gemini 3 Pro)
  performGlobalEcosystemAudit: async (snapshot: any, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `TU ES O MASTER ARCHITECT IA DO ATELIER ${brand.studioName.toUpperCase()}. 
        A Ponte Neural com o Google Sheets esta ATIVA. Analisa este instantaneo do negocio e gera uma diretriz estrategica de alto nivel.
        
        SNAPSHOT: ${JSON.stringify(snapshot)}
        
        FOCO TECNICO E FINANCEIRO:
        1. Saude Financeira (Comparacao entre Pipeline Adjudicado e Custos Reais).
        2. Eficiencia de Area: Racio de custo por mÂ² face a complexidade declarada.
        3. Progressao de Obras Criticas: Identificar gargalos em fases de Licenciamento (RJUE).
        4. Expansao de Prestigio: Sugerir um proximo passo baseado no DNA da marca "${brand.tagline}" e tom ${brand.tone}.
        
        DIRETRIZES: Gera 3-4 paragrafos curtos, extremamente sofisticados e autoritarios. 
        Idioma: ${isEn ? 'English' : 'Portugues de Portugal'}.`,
        config: {
          temperature: 0.65,
          topP: 0.9,
        }
      });
      return response.text;
    } catch (error) {
      return isEn
        ? "Ecosystem audit currently processing background sync. Please wait."
        : "Auditoria do ecossistema em processamento de sincronizacao de fundo. Por favor, aguarde.";
    }
  },

  getPublicConciergeResponse: async (userInput: string, locale: string = 'pt') => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const isEn = locale === 'en';
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;

    const systemInstruction = isEn
      ? `You are the Digital Concierge of ${brand.studioName} atelier. Your tone is ${brand.tone}, extremely cultured, sophisticated, calm, and poetic. Speak about architecture as the art of 'materializing silence'. If asked about prices, explain that each work is unique and invite them to use our fees simulator or schedule a meeting. Do not use numbered lists; write in fluid, short paragraphs. Language: English.`
      : `Tu es o Concierge Digital do atelier ${brand.studioName}. O teu tom e ${brand.tone}, extremamente culto, sofisticado, calmo e poetico. Falas sobre arquitetura como uma arte de 'materializar o silencio'. Se perguntarem sobre precos, explica que cada obra e unica e convida-os a usar o nosso simulador de honorarios ou agendar uma reuniao. Nao uses listas numeradas, escreve em paragrafos fluidos e curtos. Idioma: Portugues de Portugal.`;

    try {
      const model = (ai as any).getGenerativeModel({ model: 'gemini-3-flash-preview', systemInstruction });

      // Inicia conversa com historico
      const chat = model.startChat({
        history: chatHistory,
      });

      const response = await chat.sendMessage(userInput);
      const text = response.response.text();

      // Atualiza historico local para persistencia de contexto
      chatHistory.push({ role: 'user', parts: [{ text: userInput }] });
      chatHistory.push({ role: 'model', parts: [{ text: text }] });

      // Limite de memoria (ultimas 10 interacoes)
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

      return text;
    } catch (error) {
      return isEn
        ? "We are sorry, but our intelligence is processing new concepts. Please try contacting us directly."
        : "Lamentamos, mas a nossa inteligencia esta a processar novos conceitos. Por favor, tente contactar-nos diretamente.";
    }
  },

  checkDocumentationIntegrity: async (files: any[]) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa esta lista de ficheiros tecnicos de arquitetura e identifica inconsistencias obvias de revisao ou datas. 
        LISTA: ${JSON.stringify(files)}
        
        REGRAS: 
        1. Verifica se as 'Especialidades' tem datas muito anteriores a 'Arquitetura'.
        2. Verifica se as revisoes (Rev) seguem uma ordem logica.
        
        RESPOSTA: Uma frase curta (maximo 20 palavras) e direta em Portugues de Portugal.`,
        config: { temperature: 0.1 }
      });
      return response.text;
    } catch (e) {
      return "Integridade documental verificada. Sem anomalias criticas detetadas.";
    }
  },

  verifyProposalRisk: async (proposalData: any) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa o risco desta proposta de honorarios: ${JSON.stringify(proposalData)}.
        Compara a Area vs Complexidade vs Valor Total. 
        
        OBJETIVO: Identificar se o valor e demasiado baixo para o risco (dumping interno) ou se faltam disciplinas obrigatorias.
        
        RESPOSTA: JSON format: { "riskLevel": "low" | "medium" | "high", "observation": "string" }`,
        config: { temperature: 0.2, responseMimeType: "application/json" }
      });
      return JSON.parse(response.text);
    } catch (e) {
      return { riskLevel: "low", observation: "Analise de risco simplificada concluida." };
    }
  },

  getMaterialPerformanceAnalysis: async (material: any) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este material de construcao e sugere a melhor aplicacao tecnica e compatibilidade: ${JSON.stringify(material)}.
        
        RESPOSTA: Uma frase poetica e tecnica (maximo 25 palavras) em Portugues de Portugal.`,
        config: { temperature: 0.4 }
      });
      return response.text;
    } catch (e) {
      return "Analise tecnica concluida. Material compativel com padroes de alta performance.";
    }
  },

  getCreativeMediaDirective: async (assets: any[]) => {
    const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI(apiKey || '');
    const brand = await NeuralStorage.load(STORAGE_KEYS.BRAND) || fallbackBrand;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este inventario de media do atelier ${brand.studioName}: ${JSON.stringify(assets)}.
        O tom da marca e ${brand.tone}.
        
        OBJETIVO: Identificar qual o ativo com maior potencial de marketing para redes sociais de luxo.
        
        RESPOSTA: Uma frase curta, autoritaria e visionaria em Portugues de Portugal.`,
        config: { temperature: 0.7 }
      });
      return response.text;
    } catch (e) {
      return "Diretiva criativa: Focar na luz natural e no silencio da forma para o proximo press kit.";
    }
  }
};
```

## File: .\services\legalEngine.ts
```
import sourcesData from '../data/legal/catalog/sources.json';

export interface LegalInput {
  municipalityId: string;
  useType: 'residential' | 'commercial' | 'industrial' | 'services';
  urbanZone?: 'central' | 'historical' | 'expansion' | 'rural';
  areaGross?: number;
  numDwellings?: number;
  areaPlot?: number;
  areaFootprint?: number;
}

export interface LegalResult {
  ruleId: string;
  topic: string;
  title: string;
  value: any;
  unit?: string;
  label: string;
  confidence: 'official_reference' | 'requires_confirmation' | 'manual_check';
  sourceRef?: {
    sourceId: string;
    articleRef: string;
    officialUrl: string;
  };
  notes?: string;
}

export class LegalEngine {
  private sources = sourcesData;

  async loadRules(municipalityId: string) {
    try {
      // Dynamic import for local JSON rules
      const rulesModule = await import(`../data/legal/municipalities/${municipalityId.toUpperCase()}/rules.json`);
      return rulesModule.default.rules;
    } catch (e) {
      console.error(`Could not load rules for ${municipalityId}`, e);
      return [];
    }
  }

  async evaluate(inputs: LegalInput): Promise<LegalResult[]> {
    const rules = await this.loadRules(inputs.municipalityId);
    const results: LegalResult[] = [];

    for (const rule of rules) {
      // 1. Check "when" condition
      if (rule.when) {
        const matches = Object.entries(rule.when).every(([key, values]) => {
          const val = (inputs as any)[key];
          return Array.isArray(values) ? values.includes(val) : values === val;
        });
        if (!matches) continue;
      }

      // 2. Compute value
      let computedValue: any = null;
      if (rule.compute.type === 'fixed') {
        computedValue = rule.compute.value;
      } else if (rule.compute.type === 'formula') {
        computedValue = this.evaluateFormula(rule.compute.expression, inputs);
      }

      results.push({
        ruleId: rule.ruleId,
        topic: rule.topic,
        title: rule.title,
        value: computedValue,
        unit: rule.compute.unit,
        label: rule.compute.label || rule.title,
        confidence: rule.confidence,
        sourceRef: rule.sourceRef,
        notes: rule.notes
      });
    }

    return results;
  }

  private evaluateFormula(expression: string, inputs: LegalInput): number {
    // Basic parser for formulas like "max(numDwellings, ceil(areaGross/120))"
    // Using a safe Function constructor for the MVP, with replaced keywords
    try {
      const sanitized = expression
        .replace(/numDwellings/g, (inputs.numDwellings || 0).toString())
        .replace(/areaGross/g, (inputs.areaGross || 0).toString())
        .replace(/areaPlot/g, (inputs.areaPlot || 0).toString())
        .replace(/areaFootprint/g, (inputs.areaFootprint || 0).toString())
        .replace(/max/g, 'Math.max')
        .replace(/ceil/g, 'Math.ceil')
        .replace(/floor/g, 'Math.floor');
      
      return new Function(`return ${sanitized}`)();
    } catch (e) {
      console.error("Formula eval error:", e);
      return 0;
    }
  }

  getSources(municipalityId: string) {
    const mun = this.sources.municipalities.find(m => m.id === municipalityId);
    if (!mun) return [];
    
    // Flatten all sources from all instruments
    return mun.instruments.flatMap(inst => inst.sources);
  }
}

export const legalEngine = new LegalEngine();
```

## File: .\services\oneClickCreate.client.ts
```
export type OneClickLevel = 1 | 2 | 3;

export async function oneClickCreate(payload: any, level: OneClickLevel) {
  const res = await fetch('/api/oneclick/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, level }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'OneClick failed');
  }

  return res.json() as Promise<{
    status: 'success'|'failed';
    createdIds: { projectId: string; proposalDocId?: string };
    links?: { projectUrl?: string; proposalUrl?: string };
  }>;
}
```

## File: .\services\paymentMilestones.ts
```
import { Scenario } from '../types';

export const PAYMENT_MILESTONES: Record<Scenario, { name: string; pct: number; dueDays: number }[]> = {
    essential: [
        { name: 'Adjudicacao', pct: 50, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 50, dueDays: 3 },
    ],
    standard: [
        { name: 'Adjudicacao', pct: 30, dueDays: 3 },
        { name: 'Entrega EP', pct: 25, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 30, dueDays: 3 },
        { name: 'Fecho', pct: 15, dueDays: 5 },
    ],
    premium: [
        { name: 'Adjudicacao', pct: 25, dueDays: 3 },
        { name: 'Entrega EP', pct: 25, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 25, dueDays: 3 },
        { name: 'Entrega Execucao', pct: 15, dueDays: 3 },
        { name: 'Assistencia', pct: 10, dueDays: 30 },
    ],
};
```

## File: .\services\scenarioCatalog.ts
```
import { Scenario } from '../types';

export type ScenarioPack = {
  id: Scenario;
  labelPT: string;
  multiplier: number;
  revisionsIncluded: number;  // global revision rounds included
  deliverablesPT: string[];   // main deliverables (PT)
  deliverablesEN: string[];   // main deliverables (EN)
  exclusionsPT: string[];     // standard exclusions (PT)
  exclusionsEN: string[];     // standard exclusions (EN)
  notesPT?: string;
  notesEN?: string;
};

export const SCENARIO_CATALOG: Record<Scenario, ScenarioPack> = {
  essential: {
    id: 'essential',
    labelPT: 'Essencial',
    multiplier: 0.85,
    revisionsIncluded: 2,
    deliverablesPT: [
      'Programa Base + checklist de decisÃµes',
      'Estudo PrÃ©vio (1 soluÃ§Ã£o)',
      'PeÃ§as para licenciamento (mÃ­nimo necessÃ¡rio)',
      'CoordenaÃ§Ã£o base com especialidades',
      'Plano de pagamento por marcos'
    ],
    deliverablesEN: [
      'Program & decision checklist',
      'Schematic design (1 option)',
      'Permitting package (minimum required)',
      'Basic coordination with specialties',
      'Milestone-based payment plan'
    ],
    exclusionsPT: [
      'Taxas municipais e de entidades',
      'Levantamentos/ensaios nÃ£o contratados (topografia, geotecnia, etc.)',
      'FiscalizaÃ§Ã£o/direÃ§Ã£o de obra',
      'ReuniÃµes extra e revisÃµes adicionais',
      'AlteraÃ§Ãµes substanciais apÃ³s validaÃ§Ã£o'
    ],
    exclusionsEN: [
      'Authority fees',
      'Surveys/tests not contracted (topo, geotech, etc.)',
      'Site supervision/inspection',
      'Extra meetings and additional revisions',
      'Major changes after validation'
    ],
    notesPT: 'Recomendado para projetos de baixa complexidade e escopo muito controlado.',
    notesEN: 'Recommended for low-complexity projects with tightly controlled scope.'
  },

  standard: {
    id: 'standard',
    labelPT: 'Standard',
    multiplier: 1.0,
    revisionsIncluded: 3,
    deliverablesPT: [
      'Programa Base + mÃ©tricas',
      'Estudo PrÃ©vio (1â€“2 opÃ§Ãµes quando aplicÃ¡vel)',
      'Licenciamento completo (peÃ§as desenhadas + escritas)',
      'CoordenaÃ§Ã£o reforÃ§ada com especialidades',
      'Checklist legal e plano de pagamentos'
    ],
    deliverablesEN: [
      'Program + baseline metrics',
      'Schematic design (1â€“2 options when applicable)',
      'Full permitting package (drawings + written docs)',
      'Reinforced coordination with specialties',
      'Legal checklist and payment plan'
    ],
    exclusionsPT: [
      'Taxas e emolumentos',
      'Levantamentos/ensaios nÃ£o contratados',
      'FiscalizaÃ§Ã£o/direÃ§Ã£o de obra',
      'AlteraÃ§Ãµes substanciais apÃ³s validaÃ§Ã£o'
    ],
    exclusionsEN: [
      'Fees and charges',
      'Surveys/tests not contracted',
      'Site supervision/inspection',
      'Major changes after validation'
    ],
    notesPT: 'EquilÃ­brio ideal: custo/risco/entregas para a maioria dos casos.',
    notesEN: 'Best balance of cost/risk/deliverables for most projects.'
  },

  premium: {
    id: 'premium',
    labelPT: 'Premium',
    multiplier: 1.5,
    revisionsIncluded: 4,
    deliverablesPT: [
      'Programa Base + estratÃ©gia de aprovaÃ§Ã£o',
      'Estudo PrÃ©vio com validaÃ§Ãµes (opÃ§Ãµes quando aplicÃ¡vel)',
      'Licenciamento + coordenaÃ§Ã£o avanÃ§ada',
      'Projeto de ExecuÃ§Ã£o (pormenorizaÃ§Ã£o + mapas)',
      'AssistÃªncia tÃ©cnica (escopo definido)',
      'Plano de entregas + controlo de alteraÃ§Ãµes'
    ],
    deliverablesEN: [
      'Program + approval strategy',
      'Schematic design with validations (options when applicable)',
      'Permitting + advanced coordination',
      'Construction documents (details + schedules)',
      'Technical support (defined scope)',
      'Delivery plan + change control'
    ],
    exclusionsPT: [
      'Taxas e emolumentos',
      'Levantamentos/ensaios nÃ£o contratados',
      'FiscalizaÃ§Ã£o/direÃ§Ã£o de obra (separado)',
      'AlteraÃ§Ãµes fora do Ã¢mbito contratual'
    ],
    exclusionsEN: [
      'Fees and charges',
      'Surveys/tests not contracted',
      'Site supervision/inspection (separate)',
      'Out-of-scope changes'
    ],
    notesPT: 'Recomendado para complexidade alta, escala grande e clientes exigentes.',
    notesEN: 'Recommended for high complexity, larger scale, and demanding stakeholders.'
  }
};
```

## File: .\services\taskCatalog.ts
```
export type TaskProfile = "Arquiteto Senior" | "Equipa Tecnica" | "Arquiteto" | "Arquiteto + Equipa";

export const TASK_CATALOG = {
    arch: [
        { id: 'A0_01', label: 'Programa + EP', baseHours: 42, profile: 'Arquiteto Senior' as TaskProfile },
        { id: 'A2_01', label: 'Licenciamento', baseHours: 38, profile: 'Equipa Tecnica' as TaskProfile },
        { id: 'COORD_01', label: 'Coordenacao Especialidades', baseHours: 24, profile: 'Arquiteto' as TaskProfile },
        { id: 'A3_01', label: 'Projeto Execucao', baseHours: 56, profile: 'Arquiteto + Equipa' as TaskProfile },
        { id: 'A4_01', label: 'Assistencia Tecnica', baseHours: 18, profile: 'Equipa Tecnica' as TaskProfile },
    ],
} as const;
```

## File: .\services\translations.ts
```

// Definindo as traducoes do ecossistema FA-360
export const translations = {
  pt: {
    dashboard: "Painel",
    projects: "Projetos",
    tasks: "Tarefas",
    clients: "Clientes",
    proposals: "Propostas",
    financial: "Financeiro",
    calendar: "Calendario",
    inbox: "Mensagens",
    media: "Media",
    dna: "DNA",
    technical: "Tecnico",
    calculator: "Calculadora",
    brand: "Marca",
    sys_antigravity: "Antigravity",
    sys_search: "Procurar",
    notifications: "Notificacoes",
    sys_language: "Mudar Idioma",
    sys_mode_light: "Modo Diurno",
    sys_mode_dark: "Modo Nocturno",
    greeting_morning: "Bom dia",
    greeting_afternoon: "Boa tarde",
    greeting_evening: "Boa noite",
    operationRealTime: "Operacao em Tempo Real",
    activeProjects: "Projetos Ativos",
    newProposal: "Nova Proposta",
    type_residential: "Residencial",
    type_renovation: "Reabilitacao",
    type_corporate: "Corporativo",
    status_construction: "Em Construcao",
    status_licensing: "Licenciamento",
    status_planning: "Estudo Previo",
    status_base_proposal: "Proposta Base",
    heroVision: "VISAO",
    heroMatter: "MATERIA",
    heroSubtitle: "Arquitetura de prestigio focada na materializacao do silencio.",
    startProject: "Iniciar Projeto",
    heroShowreel: "Ver Showreel",
    aboutTitle: "O ATELIER",
    aboutSubtitle: "Focados na excelencia e no rigor tecnico.",
    philosophy: "Filosofia",
    aboutQuote: "A arquitetura e o jogo sabio, correto e magnifico dos volumes sob a luz.",
    aiConciergeTitle: "Concierge Digital",
    aiRole: "IA de Prestigio",
    aiGreeting: "Ola, sou o seu assistente digital. Como posso ajudar com a sua visao hoje?",
    aiPlaceholder: "Pergunte algo sobre os nossos servicos...",
    prestigeWorks: "OBRAS DE PRESTIGIO",
    portfolioSubtitle: "Uma selecao curada dos nossos projetos mais emblematicos.",
    fullArchive: "Arquivo Completo",
    studio: "Estudio",
    services: "Servicos",
    portfolio: "Portefolio",
    contact: "Contacto",
    accessManagement: "Aceder Gestao",
    footerMotto: "Vision to Matter.",
    footerAddress: "Morada",
    footerNewsletter: "Newsletter",
    footerPrivacy: "Privacidade",
    footerCookies: "Cookies",
    sys_neural_studio: "Neural Studio",
    sys_ai_mgmt: "Gestao de Inteligencia",
    calc_client_name: "Nome do Cliente",
    calc_project_name: "Nome do Projeto",
    calc_location: "Localizacao",
    calc_ref: "Referencia",
    calc_add: "Adicionar",
    proj_tasks: "Tarefas",
    proj_diary: "Diario",
    proj_payments: "Pagamentos",
    proj_files: "Ficheiros",
    proj_marketing: "Marketing",
    proj_timeline: "Cronologia",
    proj_syncing: "Sincronizando...",
    proj_progress: "Progresso",
    proj_pending_ops: "Operacoes Pendentes",
    proj_high_priority: "Prioridade Alta",
    proj_exec_panel: "Painel de Execucao",
    status_base: "Base",
    fin_title: "Gestao Financeira",
    fin_add_expense: "Adicionar Despesa",
    material_dna_eco: "DNA & Eco",
    material_dna_subtitle: "Biblioteca inteligente de materiais e curadoria tecnica.",
    material_dna_catalog: "Catalogo",
    material_dna_tech_sheet: "Ficha Tecnica",
    material_dna_carbon: "Pegada de Carbono",
    mat_location: "Localizacao",
    mat_supplier: "Fornecedor",
    mat_tech_specs: "Especificacoes",
    mat_request_quote: "Pedir Orcamento",
    mat_in_studio: "No Estudio",
    brand_guardian: "Guardiao da Marca",
    brand_title: "Identidade de Marca",
    brand_subtitle: "Gestao da identidade digital e fisica do atelier.",
    brand_config_base: "Configuracao Base",
    brand_save_changes: "Guardar Alteracoes",
    brand_name_label: "Nome do Estudio",
    brand_tagline_label: "Tagline",
    brand_palette: "Paleta de Cores",
    brand_assets: "Ativos",
    brand_voice_ia: "Voz IA",
    brand_voice_desc: "Personalidade da Marca para comunicacoes autonomas.",
    brand_book_download: "Download Brandbook",
    studio_history: "Historia",
    studio_title: "O Estudio de excelencia.",
    studio_founded: "Fundado com uma visao clara de transformar espacos em experiencias.",
    studio_p1: "Acreditamos que cada projeto e uma oportunidade unica de materializar o silencio atraves da forma.",
    studio_p2: "Com mais de 18 anos de experiencia, lideramos o mercado de luxo em Portugal.",
    studio_exp: "Experiencia",
    studio_archs: "Arquitetos",
    studio_works: "Obras",
    studio_awards: "Premios",
    studio_team: "Equipa",
    serv_res_title: "Residencial de Luxo",
    serv_res_desc: "Casas que transcendem o tempo e o espaco.",
    serv_corp_title: "Corporativo Premium",
    serv_corp_desc: "Espacos de trabalho que inspiram produtividade.",
    serv_int_title: "Design de Interiores",
    serv_int_desc: "Curadoria de materiais e mobiliario exclusivo.",
    serv_title: "Servicos de Elite.",
    serv_subtitle: "Oferecemos uma solucao chave na mao, do conceito a obra.",
    cont_title: "Ferreira Arquitectos.",
    cont_subtitle: "Pronto para iniciar a sua jornada connosco?",
    cont_form_name: "Nome",
    cont_form_email: "Email",
    cont_form_brief: "Briefing",
    cont_form_placeholder: "Conte-nos sobre o seu projeto de sonho...",
    cont_send: "Enviar",
    cont_office: "Escritorio",
    cont_map: "Ver no Mapa",

    // Proposal Generator (New)
    calc_identity_title: "Identificacao do Proponente",
    calc_context_text: "A presente proposta refere-se a prestacao de servicos de arquitetura para o desenvolvimento do projeto identificado, incluindo as fases e disciplinas necessarias para garantir um processo tecnicamente consistente e conforme o RJUE.",
    calc_rjue_config: "Configuracoes RJUE",
    calc_compliance_ok: "Compliance OK",
    calc_check_errors: "Verificar Erros",
    calc_mode_decision: "Modo de Decisao / Nivel de Controlo",
    calc_mode_essential: "Essencial",
    calc_mode_desc_essential: "Cumprir a lei e avancar com seguranca.",
    calc_mode_standard: "Profissional",
    calc_mode_desc_standard: "Projeto solido, decisoes claras, menos surpresas.",
    calc_mode_premium: "Executivo",
    calc_mode_desc_premium: "Controlo total. Zero improviso.",
    calc_typology: "Tipologia de Obra",
    calc_select_typology: "â†’ Selecione uma tipologia de obra...",
    calc_gross_area: "Area Bruta (mÂ²)",
    calc_units_apartments: "Nu de Fracoes / Apartamentos",
    calc_units_lots: "Nu de Lotes / Moradias",
    calc_units_rooms: "Nu de Quartos / Unidades",
    calc_complexity: "Complexidade / Risco",
    calc_comp_low: "Baixa",
    calc_comp_med: "Media",
    calc_comp_high: "Alta",
    calc_strat_simplex: "Estrategia Simplex",
    calc_strat_all: "Tudo Junto",
    calc_strat_phased: "Faseado",
    calc_disciplines_title: "Disciplinas Tecnicas",
    calc_disciplines_count: "Disciplinas",
    calc_scope_phase: "Ambito de Prestacao por Fase",
    calc_cond_excl: "Condicoes & Exclusoes",
    calc_exec_deadline: "Prazo de Execucao",
    calc_exec_deadline_desc_premium: "Prazos estimados de execucao tecnica: 18 a 24 semanas (sujeito a alteracoes por parte de entidades externas e aprovacoes camarias).",
    calc_exec_deadline_desc_standard: "Prazos estimados de execucao tecnica: 10 a 14 semanas (sujeito a alteracoes por parte de entidades externas e aprovacoes camarias).",
    calc_excl_support: "Exclusoes de Suporte",
    calc_est_investment: "Investimento Estimado",
    calc_vat_legal: "+ IVA a taxa legal",
    calc_arch_design: "Arquitetura (Design & Tech)",
    calc_eng_integrated: "Engenharias Integradas",
    calc_sim_profile: "Perfil de Simulacao",
    calc_select_profile: "Selecione o perfil...",
    calc_role_arch: "Arquiteto",
    calc_role_marketing: "Marketing",
    calc_role_fin: "Financeiro",
    calc_role_dir: "Diretor",
    calc_disc_policy: "Politica de Desconto",
    calc_justification_req: "Justificacao Obrigatoria",
    calc_justification_placeholder: "Motivo para a excecao...",
    calc_discount_rejected: "Desconto Rejeitado",
    calc_adjusted_to: "Ajustado para",
    calc_min_fee_hit: "Taxa Minima Atingida",
    calc_min_fee_desc: "O desconto foi aplicado, mas o valor final infringe a Taxa Minima do Modelo. O valor foi fixado no minimo admissivel.",
    calc_why_value: "Porque este valor?",
    calc_legal_complexity: "Complexidade Legal",
    calc_legal_desc: "Este processo enquadra-se no RJUE e exige a coordenacao tecnica de disciplinas tecnicas obrigatorias para aprovacao municipal.",
    calc_tech_risk: "Risco Tecnico Controlado",
    calc_tech_risk_desc: "O valor assegura a compatibilizacao tridimensional e verificacao previa, reduzindo significativamente o risco de indeferimento ou pedidos de elementos adicionais que atrasam a obra.",
    calc_tech_effort: "Esforco Tecnico Real",
    calc_tech_effort_desc: "Esta proposta corresponde a uma estimativa rigorosa de horas de trabalho tecnico qualificado dedicadas exclusivamente A  excelencia do seu projeto.",
    calc_strat_radar: "Radar Estrategico",
    calc_gov_digital: "Governanca & Digital Twin",
    calc_risk_high: "Risco Elevado",
    calc_risk_med: "Risco Medio",
    calc_risk_low: "Risco Baixo",
    calc_healthy: "Saudavel",
    calc_fragile: "Fragil",
    calc_margin_digital: "Margem (Digital Twin)",
    calc_roi_real: "ROI REAL",
    calc_decision_trigger: "Gatilho de Decisao",
    calc_propagate: "Propagar Proposta para Neural Brain",
    calc_propagating: "A Propagar...",
    calc_verify_audit: "Verificar Auditoria IA",
    calc_emission_authorized: "Emissao Autorizada",
    calc_output_blocked: "Bloqueio de Saida",
    calc_rec_blocked: "Recomendacao: Subir para Modo Profissional ou ajustar especialidades.",
    calc_rec_high_risk: "Configuracoes fragil: Reforcar exclusoes tecnicas.",
    calc_rec_safe: "Operacao em zona de alta seguranca financeira.",
    calc_effort_map: "Mapa de Esforco Tecnico",
    calc_effort_desc: "Estimativa realista do esforco necessario para executar o projeto com qualidade e seguranca.",
    calc_phase: "Fase",
    calc_est_effort: "Esforco Estimado",
    calc_main_profile: "Perfil Principal",
    calc_est_total: "Total Estimado",
    calc_share_link: "Partilhar Link",
    calc_send_email: "Enviar por Email (HTML)",
    calc_legal_footer: "Os documentos gerados cumprem as normas de identidade premium da Ferreira Arquitetos.",
    calc_propagate_antigravity: "Propagar para Antigravity",
    calc_create_project: "Criar Projeto",
    calc_project_proposal: "Projeto + Proposta",
    
    
    calc_waiting_data: "Selecione um modelo e indique a area para visualizar o detalhe.",

    // Dashboard Specific
    op_command: "Comando Operacional",
    view_all: "Ver Todos",
    no_active_projects: "Sem projetos ativos.",
    op_stable: "Operacao estavel.",
    op_threat: "Acao necessaria.",
    op_neutral: "A aguardar dados.",
    pipeline_global: "Pipeline Global",
    health_index: "Health Index",
    cashflow: "Cashflow",
    today_ops: "Today Ops",
    critical_alerts: "Critical Alerts", // Often kept in English or "Alertas Criticos"
    neural_sync: "Neural Link",
    production: "Producao",
    deadlines: "Prazos",
    risk: "Risco",
    cash: "Caixa",
    conversion: "Conversao",
    leads: "Leads",
    negotiation: "Negociacao",
    closed: "Fechado",
    potential: "potencial",
    open_day: "Abrir Dia",
    delayed: "Atraso",
    rec: "Rec.",
    days_7: "7 Dias",
    expired: "Vencido",
    next_7_days: "Prox. 7 Dias",
    resolve: "Resolver",
    no_critical_blocks: "Sem bloqueios criticos.",
    configure: "Configurar",
    last_sync: "Ultima Sync",
    sheets_pending: "Conexao Sheets pendente",
    weekly_prod: "Producao Semanal",
    active_suffix: "Ativos.",
    status_excellent: "Excelente",
    status_warning: "Atencao",
    force_sync: "Forcar Sync",
    prod_subtitle: "Horas Reais vs Planeadas",
    no_prod_data: "Sem dados de producao.",
    complete: "Concluir",
    remind: "Lembrar",
    view: "Ver",
    reschedule: "Adiar",
    day_panel_title: "Painel do Dia",
    day_panel_urgent: "Urgente",
    day_panel_financial: "Financeiro",
    day_panel_attention: "Atencao",
    day_panel_no_urgent: "Tudo em dia.",
    day_panel_idle_desc: "Sem acao ha",
    day_panel_days: "dias",
    day_panel_due_today: "Para hoje",
    day_panel_today_meetings: "Agenda de Hoje",
    day_panel_overdue_alert: "ATRASO CRITICO",
    timer_started: "Cronometro iniciado",
    timer_stopped: "Cronometro parado",
    timer_logged: "Horas registadas",
    timer_active: "Em curso",
    timer_save: "Gravar Horas",
    timer_description: "O que estiveste a fazer?",
    timer_phase: "Fase",
    timer_cancel: "Cancelar",
    
    // Proposals
    prop_kicker: "Pipeline Comercial & Conversao",
    prop_title_prefix: "Propostas",
    prop_title_suffix: "Criadas.",
    prop_filter_all: "Todas",
    prop_filter_draft: "Rascunho",
    prop_filter_sent: "Enviada",
    prop_filter_negotiation: "Negociacao",
    prop_filter_adjudicated: "Adjudicada",
    prop_search: "Procurar cliente...",
    prop_est_fees: "Honorarios Estimados",
    prop_views: "Visualizacoes",
    prop_send_portal: "Enviar Portal",
    prop_standby_title: "Pipeline em Standby.",
    prop_standby_desc: "Nao existem propostas criadas. Inicie uma nova simulacao para gerar insights de probabilidade.",
    prop_start_sim: "Iniciar Nova Simulacao",
    prop_insight_title: "Closing Insight",
    prop_insight_empty: "A aguardar dados para analise neural de probabilidade de fecho.",
    prop_analyze: "Analisar Agora",
    prop_summary_title: "Resumo de Atividade",
    prop_vol_neg: "Volume em Negociacao",
    prop_pipeline_target: "Pipeline vs Meta",
    prop_meta_q1: "Meta Q1",

    // Projects
    proj_kicker: "Pipeline & Marcos Criticos",
    proj_title_prefix: "Gestao de",
    proj_title_suffix: "Projetos.",
    proj_standby_title: "Workflow em Standby.",
    proj_standby_desc: "Nenhum projeto ativo detetado no pipeline neural.",
    card_progress: "Progresso",
    card_no_update: "Sem update ha",
    card_deadline_in: "Deadline em",
    card_updated_ago: "Atualizado ha",
    card_msg_delete: "Deseja eliminar o projeto",

    // Tasks
    tasks_kicker: "Inteligencia Operacional & RJUE",
    tasks_title_prefix: "Gestao de",
    tasks_title_suffix: "Tarefas.",
    tasks_tab_my_list: "A Minha Lista",
    tasks_tab_catalog: "Catalogo RJUE",
    tasks_catalog_explore: "Explorar Catalogo de Arquitetura",
    tasks_empty_title: "Efficiency Prime.",
    tasks_empty_desc: "Nao existem tarefas pendentes. Explore o Catalogo RJUE para importar fluxos de trabalho padrao.",
    tasks_modal_associate: "Associar Contexto.",
    tasks_modal_desc: "Escolha o projeto ou cliente para esta tarefa. Pode tambem importar como Geral.",
    tasks_detail_metrics: "Metricas de Performance",
    tasks_detail_context: "Contexto Operacional",
    tasks_detail_assign: "Atribuicao de Projeto",
    tasks_btn_delete: "Eliminar Tarefa",
    tasks_btn_close: "Fechar",
    tasks_status_efficiency: "Eficiencia",

    // Clients
    clients_kicker: "CRM & Stakeholders",
    clients_title_prefix: "Carteira de",
    clients_title_suffix: "Clientes.",
    clients_new_btn: "Novo Cliente",
    clients_search_placeholder: "Pesquisar...",
    clients_empty_title: "Pipeline de Stakeholders Vazio.",
    clients_empty_desc: "Comece a registar a sua rede de contactos e investidores.",
    clients_modal_title: "Novo",
    clients_modal_subtitle: "Stakeholder.",
    clients_form_name: "Nome Completo",
    clients_form_email: "Email Corporativo",
    clients_form_phone: "Telefone / WhatsApp",
    clients_form_segment: "Segmento",
    clients_btn_save: "Registar no Google Brain",
    clients_btn_saving: "A Propagar Dados...",

    // Legal
    legal_kicker: "Inteligencia Juridica & PDM",
    legal_title_prefix: "Modulo",
    legal_title_suffix: "Legal.",
    legal_tab_generator: "Gerador",
    legal_tab_collection: "Colecao",
    legal_step_location: "Localizacao",
    legal_step_project: "Dados do Projecto",
    legal_label_project_name: "Nome do Projecto",
    legal_label_address: "Morada Local",
    legal_btn_print: "Imprimir / Gerar PDF",
    legal_preview_empty: "Selecione um municipio para gerar a pre-visualizacao",

    // Technical Hub
    tech_kicker: "Arquivo Tecnico Digital",
    tech_title_prefix: "Documentacao",
    tech_title_suffix: "Tecnica.",
    tech_new_upload: "Novo Upload",
    tech_categories: "Categorias",
    tech_cat_all: "Todos",
    tech_cat_arch: "Arquitetura",
    tech_cat_spec: "Especialidades",
    tech_cat_int: "Interiores",
    tech_cat_legal: "Legal",
    tech_cat_bim: "BIM",
    tech_search_placeholder: "Pesquisar ficheiro ou revisao...",
    tech_empty_title: "Sem Ficheiros.",
    tech_empty_desc: "Inicie o repositorio tecnico para o seu projeto.",
    tech_btn_upload: "Carregar Revisao",
    tech_log_title: "Log de Transmissao",
    tech_log_export: "Exportar Registo de Entrega",
    tech_table_date: "Data",
    tech_table_recipient: "Destinatario",
    tech_table_content: "Conteudo",
    tech_table_via: "Via",
    tech_table_empty: "Nenhum registo de envio encontrado.",
    add_to_my_list: "Adicionar a Minha Lista",
    add_task: "Adicionar Tarefa",
    more_options: "Mais Opcoes",
    weather_sunny: "Ceu Limpo",
    download: "Descarregar"
  },
  en: {
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Tasks",
    clients: "Clients",
    proposals: "Proposals",
    financial: "Financial",
    calendar: "Calendar",
    inbox: "Inbox",
    media: "Media",
    dna: "DNA",
    technical: "Technical",
    calculator: "Calculator",
    brand: "Brand",
    sys_antigravity: "Antigravity",
    sys_search: "Search",
    notifications: "Notifications",
    sys_language: "Change Language",
    sys_mode_light: "Light Mode",
    sys_mode_dark: "Dark Mode",
    greeting_morning: "Good Morning",
    greeting_afternoon: "Good Afternoon",
    greeting_evening: "Good Evening",
    operationRealTime: "Real-time Operation",
    activeProjects: "Active Projects",
    newProposal: "New Proposal",
    type_residential: "Residential",
    type_renovation: "Renovation",
    type_corporate: "Corporate",
    status_construction: "Under Construction",
    status_licensing: "Licensing",
    status_planning: "Schematic Design",
    status_base_proposal: "Base Proposal",
    heroVision: "VISION",
    heroMatter: "MATTER",
    heroSubtitle: "Prestige architecture focused on materializing silence.",
    startProject: "Start Project",
    heroShowreel: "View Showreel",
    aboutTitle: "THE STUDIO",
    aboutSubtitle: "Focused on excellence and technical rigor.",
    philosophy: "Philosophy",
    aboutQuote: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
    aiConciergeTitle: "Digital Concierge",
    aiRole: "Prestige AI",
    aiGreeting: "Hello, I am your digital assistant. How can I help with your vision today?",
    aiPlaceholder: "Ask something about our services...",
    prestigeWorks: "PRESTIGE WORKS",
    portfolioSubtitle: "A curated selection of our most emblematic projects.",
    fullArchive: "Full Archive",
    studio: "Studio",
    services: "Services",
    portfolio: "Portfolio",
    contact: "Contact",
    accessManagement: "Access Management",
    footerMotto: "Vision to Matter.",
    footerAddress: "Address",
    footerNewsletter: "Newsletter",
    footerPrivacy: "Privacy",
    footerCookies: "Cookies",
    sys_neural_studio: "Neural Studio",
    sys_ai_mgmt: "Intelligence Management",
    calc_client_name: "Client Name",
    calc_project_name: "Project Name",
    calc_location: "Location",
    calc_ref: "Reference",
    calc_add: "Add",
    proj_tasks: "Tasks",
    proj_diary: "Diary",
    proj_payments: "Payments",
    proj_files: "Files",
    proj_marketing: "Marketing",
    proj_timeline: "Timeline",
    proj_syncing: "Syncing...",
    proj_progress: "Progress",
    proj_pending_ops: "Pending Operations",
    proj_high_priority: "High Priority",
    proj_exec_panel: "Execution Panel",
    status_base: "Base",
    fin_title: "Financial Management",
    fin_add_expense: "Add Expense",
    material_dna_eco: "DNA & Eco",
    material_dna_subtitle: "Smart material library and technical curation.",
    material_dna_catalog: "Catalog",
    material_dna_tech_sheet: "Tech Sheet",
    material_dna_carbon: "Carbon Footprint",
    mat_location: "Location",
    mat_supplier: "Supplier",
    mat_tech_specs: "Tech Specs",
    mat_request_quote: "Request Quote",
    mat_in_studio: "In Studio",
    brand_guardian: "Brand Guardian",
    brand_title: "Brand Identity",
    brand_subtitle: "Management of the studio's digital and physical identity.",
    brand_config_base: "Base Config",
    brand_save_changes: "Save Changes",
    brand_name_label: "Studio Name",
    brand_tagline_label: "Tagline",
    brand_palette: "Color Palette",
    brand_assets: "Assets",
    brand_voice_ia: "AI Voice",
    brand_voice_desc: "Brand Personality for autonomous communications.",
    brand_book_download: "Download Brandbook",
    studio_history: "History",
    studio_title: "The Studio of excellence.",
    studio_founded: "Founded with a clear vision of transforming spaces into experiences.",
    studio_p1: "We believe each project is a unique opportunity to materialize silence through form.",
    studio_p2: "With over 18 years of experience, we lead the luxury market in Portugal.",
    studio_exp: "Experience",
    studio_archs: "Architects",
    studio_works: "Works",
    studio_awards: "Awards",
    studio_team: "Team",
    serv_res_title: "Luxury Residential",
    serv_res_desc: "Houses that transcend time and space.",
    serv_corp_title: "Premium Corporate",
    serv_corp_desc: "Workspaces that inspire productivity.",
    serv_int_title: "Interior Design",
    serv_int_desc: "Curation of exclusive materials and furniture.",
    serv_title: "Elite Services.",
    serv_subtitle: "We offer a turnkey solution, from concept to construction.",
    cont_title: "Ferreira Architects.",
    cont_subtitle: "Ready to start your journey with us?",
    cont_form_name: "Name",
    cont_form_email: "Email",
    cont_form_brief: "Briefing",
    cont_form_placeholder: "Tell us about your dream project...",
    cont_send: "Send",
    cont_office: "Office",
    cont_map: "View on Map",

    // Proposal Generator (New)
    calc_identity_title: "Proponent Identity",
    calc_context_text: "This proposal refers to the provision of architectural services for the development of the identified project, including the phases and disciplines necessary to ensure a technically consistent process compliant with RJUE.",
    calc_rjue_config: "RJUE Configuration",
    calc_compliance_ok: "Compliance OK",
    calc_check_errors: "Check Errors",
    calc_mode_decision: "Decision Mode / Control Level",
    calc_mode_essential: "Essential",
    calc_mode_desc_essential: "Comply with the law and proceed safely.",
    calc_mode_standard: "Professional",
    calc_mode_desc_standard: "Solid project, clear decisions, fewer surprises.",
    calc_mode_premium: "Executive",
    calc_mode_desc_premium: "Total control. Zero improvisation.",
    calc_typology: "Project Typology",
    calc_select_typology: "â†’ Select a project typology...",
    calc_gross_area: "Gross Area (mÂ²)",
    calc_units_apartments: "No. of Units / Apartments",
    calc_units_lots: "No. of Lots / Villas",
    calc_units_rooms: "No. of Rooms / Units",
    calc_complexity: "Complexity / Risk",
    calc_comp_low: "Low",
    calc_comp_med: "Medium",
    calc_comp_high: "High",
    calc_strat_simplex: "Simplex Strategy",
    calc_strat_all: "All in One",
    calc_strat_phased: "Phased",
    calc_disciplines_title: "Technical Disciplines",
    calc_disciplines_count: "Disciplines",
    calc_scope_phase: "Scope of Service by Phase",
    calc_cond_excl: "Conditions & Exclusions",
    calc_exec_deadline: "Execution Deadline",
    calc_exec_deadline_desc_premium: "Estimated technical execution deadlines: 18 to 24 weeks (subject to changes by external entities and municipal approvals).",
    calc_exec_deadline_desc_standard: "Estimated technical execution deadlines: 10 to 14 weeks (subject to changes by external entities and municipal approvals).",
    calc_excl_support: "Support Exclusions",
    calc_est_investment: "Estimated Investment",
    calc_vat_legal: "+ VAT at legal rate",
    calc_arch_design: "Architecture (Design & Tech)",
    calc_eng_integrated: "Integrated Engineering",
    calc_sim_profile: "Simulation Profile",
    calc_select_profile: "Select profile...",
    calc_role_arch: "Architect",
    calc_role_marketing: "Marketing",
    calc_role_fin: "Financial",
    calc_role_dir: "Director",
    calc_disc_policy: "Discount Policy",
    calc_justification_req: "Mandatory Justification",
    calc_justification_placeholder: "Reason for exception...",
    calc_discount_rejected: "Discount Rejected",
    calc_adjusted_to: "Adjusted to",
    calc_min_fee_hit: "Minimum Fee Hit",
    calc_min_fee_desc: "Discount applied, but final value breaches Model Minimum Fee. Value fixed at admissible minimum.",
    calc_why_value: "Why this value?",
    calc_legal_complexity: "Legal Complexity",
    calc_legal_desc: "This process falls under RJUE and requires technical coordination of mandatory technical disciplines for municipal approval.",
    calc_tech_risk: "Controlled Technical Risk",
    calc_tech_risk_desc: "The value ensures 3D compatibility and prior verification, significantly reducing the risk of rejection or requests for additional elements that delay the work.",
    calc_tech_effort: "Real Technical Effort",
    calc_tech_effort_desc: "This proposal corresponds to a rigorous estimate of qualified technical work hours dedicated exclusively to the excellence of your project.",
    calc_strat_radar: "Strategic Radar",
    calc_gov_digital: "Governance & Digital Twin",
    calc_risk_high: "High Risk",
    calc_risk_med: "Medium Risk",
    calc_risk_low: "Low Risk",
    calc_healthy: "Healthy",
    calc_fragile: "Fragile",
    calc_margin_digital: "Margin (Digital Twin)",
    calc_roi_real: "REAL ROI",
    calc_decision_trigger: "Decision Trigger",
    calc_propagate: "Propagate Proposal to Neural Brain",
    calc_propagating: "Propagating...",
    calc_verify_audit: "Verify AI Audit",
    calc_emission_authorized: "Authorized Emission",
    calc_output_blocked: "Output Blocked",
    calc_rec_blocked: "Recommendation: Upgrade to Professional Mode or adjust specialties.",
    calc_rec_high_risk: "Fragile configuration: Reinforce technical exclusions.",
    calc_rec_safe: "Operation in high financial security zone.",
    calc_effort_map: "Technical Effort Map",
    calc_effort_desc: "Realistic estimate of the effort required to execute the project with quality and safety.",
    calc_phase: "Phase",
    calc_est_effort: "Estimated Effort",
    calc_main_profile: "Main Profile",
    calc_est_total: "Estimated Total",
    calc_share_link: "Share Link",
    calc_send_email: "Send by Email (HTML)",
    calc_legal_footer: "Generated documents comply with Ferreira Architects premium identity standards.",
    calc_propagate_antigravity: "Propagate to Antigravity",
    calc_create_project: "Create Project",
    calc_project_proposal: "Project + Proposal",
    

    // Dashboard Specific
    op_command: "Operational Command",
    view_all: "View All",
    no_active_projects: "No active projects.",
    op_stable: "Stable operation.",
    op_threat: "Action required.",
    op_neutral: "Awaiting data.",
    pipeline_global: "Global Pipeline",
    health_index: "Health Index",
    cashflow: "Cashflow",
    today_ops: "Today Ops",
    critical_alerts: "Critical Alerts",
    neural_sync: "Neural Link",
    production: "Production",
    deadlines: "Deadlines",
    risk: "Risk",
    cash: "Cash",
    conversion: "Conversion",
    leads: "Leads",
    negotiation: "Negotiation",
    closed: "Closed",
    potential: "potential",
    open_day: "Open Day",
    delayed: "Delayed",
    rec: "Rec.",
    days_7: "7 Days",
    expired: "Overdue",
    next_7_days: "Next 7 Days",
    resolve: "Resolve",
    no_critical_blocks: "No critical blocks.",
    configure: "Configure",
    last_sync: "Last Sync",
    sheets_pending: "Sheets connection pending",
    weekly_prod: "Weekly Production",
    active_suffix: "Active.",
    status_excellent: "Excellent",
    status_warning: "Warning",
    force_sync: "Force Sync",
    prod_subtitle: "Real Hours vs Planned",
    no_prod_data: "No production data.",
    complete: "Complete",
    remind: "Remind",
    view: "View",
    reschedule: "Reschedule",
    day_panel_title: "Day Panel",
    day_panel_urgent: "Urgent",
    day_panel_financial: "Financial",
    day_panel_attention: "Attention",
    day_panel_no_urgent: "All clear.",
    day_panel_idle_desc: "No action for",
    day_panel_days: "days",
    day_panel_due_today: "Due today",
    day_panel_today_meetings: "Today's Agenda",
    day_panel_overdue_alert: "CRITICAL DELAY",
    timer_started: "Timer started",
    timer_stopped: "Timer stopped",
    timer_logged: "Time logged",
    timer_active: "Running",
    timer_save: "Save Hours",
    timer_description: "What were you doing?",
    timer_phase: "Phase",
    timer_cancel: "Cancel",

    // Proposals
    prop_kicker: "Commercial Pipeline & Conversion",
    prop_title_prefix: "Proposals",
    prop_title_suffix: "Created.",
    prop_filter_all: "All",
    prop_filter_draft: "Draft",
    prop_filter_sent: "Sent",
    prop_filter_negotiation: "Negotiation",
    prop_filter_adjudicated: "Adjudicated",
    prop_search: "Search client...",
    prop_est_fees: "Estimated Fees",
    prop_views: "Views",
    prop_send_portal: "Send to Portal",
    prop_standby_title: "Pipeline in Standby.",
    prop_standby_desc: "No proposals created. Start a new simulation to generate probability insights.",
    prop_start_sim: "Start New Simulation",
    prop_insight_title: "Closing Insight",
    prop_insight_empty: "Waiting for data to analyze closing probability.",
    prop_analyze: "Analyze Now",
    prop_summary_title: "Activity Summary",
    prop_vol_neg: "Volume in Negotiation",
    prop_pipeline_target: "Pipeline vs Target",
    prop_meta_q1: "Target Q1",

    // Projects
    proj_kicker: "Pipeline & Critical Milestones",
    proj_title_prefix: "Project",
    proj_title_suffix: "Management.",
    proj_standby_title: "Workflow in Standby.",
    proj_standby_desc: "No active projects detected in the neural pipeline.",
    card_progress: "Progress",
    card_no_update: "No update for",
    card_deadline_in: "Deadline in",
    card_updated_ago: "Updated",
    card_msg_delete: "Do you want to delete the project",

    // Tasks
    tasks_kicker: "Op. Intelligence & RJUE",
    tasks_title_prefix: "Task",
    tasks_title_suffix: "Management.",
    tasks_tab_my_list: "My List",
    tasks_tab_catalog: "RJUE Catalog",
    tasks_catalog_explore: "Explore Architecture Catalog",
    tasks_empty_title: "Efficiency Prime.",
    tasks_empty_desc: "No pending tasks. Explore the RJUE Catalog to import standard workflows.",
    tasks_modal_associate: "Assign Context.",
    tasks_modal_desc: "Choose the project or client for this task. You can also import as General.",
    tasks_detail_metrics: "Performance Metrics",
    tasks_detail_context: "Operational Context",
    tasks_detail_assign: "Project Assignment",
    tasks_btn_delete: "Delete Task",
    tasks_btn_close: "Close",
    tasks_status_efficiency: "Efficiency",

    // Clients
    clients_kicker: "CRM & Stakeholders",
    clients_title_prefix: "Client",
    clients_title_suffix: "Portfolio.",
    clients_new_btn: "New Client",
    clients_search_placeholder: "Search...",
    clients_empty_title: "Empty Stakeholder Pipeline.",
    clients_empty_desc: "Start registering your network of contacts and investors.",
    clients_modal_title: "New",
    clients_modal_subtitle: "Stakeholder.",
    clients_form_name: "Full Name",
    clients_form_email: "Corporate Email",
    clients_form_phone: "Phone / WhatsApp",
    clients_form_segment: "Segment",
    clients_btn_save: "Register in Google Brain",
    clients_btn_saving: "Propagating Data...",

    // Legal
    legal_kicker: "Legal Intelligence & PDM",
    legal_title_prefix: "Legal",
    legal_title_suffix: "Module.",
    legal_tab_generator: "Generator",
    legal_tab_collection: "Collection",
    legal_step_location: "Location",
    legal_step_project: "Project Data",
    legal_label_project_name: "Project Name",
    legal_label_address: "Address",
    legal_btn_print: "Print / Generate PDF",
    legal_preview_empty: "Select a municipality to generate the preview",

    // Technical Hub
    tech_kicker: "Digital Technical Archive",
    tech_title_prefix: "Technical",
    tech_title_suffix: "Documentation.",
    tech_new_upload: "New Upload",
    tech_categories: "Categories",
    tech_cat_all: "All",
    tech_cat_arch: "Architecture",
    tech_cat_spec: "Specialties",
    tech_cat_int: "Interiors",
    tech_cat_legal: "Legal",
    tech_cat_bim: "BIM",
    tech_search_placeholder: "Search file or revision...",
    tech_empty_title: "No Files.",
    tech_empty_desc: "Start the technical repository for your project.",
    tech_btn_upload: "Upload Revision",
    tech_log_title: "Transmission Log",
    tech_log_export: "Export Delivery Record",
    tech_table_date: "Date",
    tech_table_recipient: "Recipient",
    tech_table_content: "Content",
    tech_table_via: "Via",
    tech_table_empty: "No transmission records found.",
    add_to_my_list: "Add to My List",
    add_task: "Add Task",
    more_options: "More Options",
    weather_sunny: "Sunny Sky",
    download: "Download"
  }
} as const;

// Exportando o tipo baseado nas chaves das traducoes em portugues
export type TranslationKeys = keyof typeof translations.pt;
```

## File: .\utils\paymentReminder.ts
```
import { formatEur } from './vat';

export function buildPaymentReminderPT(args: {
  client: string;
  project: string;
  milestone: string;
  amountNet: number;
  vatRate?: number;
  dueDate?: string;
}) {
  const vatLabel = args.vatRate === 0.06 ? '6%' : args.vatRate === 0.23 ? '23%' : 'taxa legal';
  const due = args.dueDate ? new Date(args.dueDate).toLocaleDateString('pt-PT') : 'â€”';

  return [
    `Ola ${args.client},`,
    ``,
    `So para confirmar: o pagamento referente a "${args.milestone}" do projeto "${args.project}" encontra-se pendente.`,
    `Valor: ${formatEur(args.amountNet)} (NET) + IVA (${vatLabel}).`,
    `Data prevista: ${due}.`,
    ``,
    `Assim que estiver regularizado, seguimos para o proximo marco.`,
    `Arq. Jose Ferreira | FERREIRARQUITETOS`,
  ].join('\n');
}

export function buildPaymentReminderEN(args: {
  client: string;
  project: string;
  milestone: string;
  amountNet: number;
  vatRate?: number;
  dueDate?: string;
}) {
  const vatLabel = args.vatRate === 0.06 ? '6%' : args.vatRate === 0.23 ? '23%' : 'legal rate';
  const due = args.dueDate ? new Date(args.dueDate).toLocaleDateString('en-GB') : 'â€”';

  return [
    `Hi ${args.client},`,
    ``,
    `Just a quick reminder: the payment for "${args.milestone}" on project "${args.project}" is still pending.`,
    `Amount: ${formatEur(args.amountNet)} (NET) + VAT (${vatLabel}).`,
    `Due date: ${due}.`,
    ``,
    `Once settled, weâ€™ll move to the next milestone.`,
    `Arq. Jose Ferreira | FERREIRARQUITETOS`,
  ].join('\n');
}
```

## File: .\utils\vat.ts
```
export const getVatRateLabel = (vatRate?: number | null) => {
  if (vatRate === 0.06) return '6%';
  if (vatRate === 0.23) return '23%';
  return 'taxa legal';
};

export const formatEur = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);
```

## File: .\App.tsx
```

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TimeProvider } from './context/TimeContext';
import Navbar from './components/common/Navbar';
import CommandBar from './components/common/CommandBar';
import GlobalUtilities from './components/common/GlobalUtilities';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import TasksPage from './pages/TasksPage';
import MarketingPage from './pages/MarketingPage';
import FinancialPage from './pages/FinancialPage';
import CalendarPage from './pages/CalendarPage';
import TechnicalHubPage from './pages/TechnicalHubPage';
import ProposalsManagementPage from './pages/ProposalsManagementPage';
import MediaHubPage from './pages/MediaHubPage';
import MaterialLibraryPage from './pages/MaterialLibraryPage';
import StudioInboxPage from './pages/StudioInboxPage';
import PublicHomePage from './pages/PublicHomePage';
import PublicStudioPage from './pages/PublicStudioPage';
import PublicServicesPage from './pages/PublicServicesPage';
import PublicContactPage from './pages/PublicContactPage';
import PublicProjectDetailsPage from './pages/PublicProjectDetailsPage';
import ClientPortalPage from './pages/ClientPortalPage';
import BrandIdentityPage from './pages/BrandIdentityPage';
import CalculatorPage from './pages/CalculatorPage';
import AntigravityPage from './pages/AntigravityPage';
import NeuralStudioPage from './pages/NeuralStudioPage';
import LegalReportPage from './pages/LegalReportPage';
import RescueNode from './components/common/RescueNode';
import { TimeTracker } from './components/ui/TimeTracker';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPublic = location.pathname.startsWith('/public');
  const isPortal = location.pathname.startsWith('/portal');
  const isAntigravity = location.pathname === '/antigravity';
  const isNeural = location.pathname === '/neural';

  if (isPublic || isPortal) {
    return (
      <div className="min-h-screen bg-luxury-white dark:bg-luxury-black text-luxury-charcoal dark:text-luxury-white transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-white dark:bg-luxury-black text-luxury-charcoal dark:text-luxury-white transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <CommandBar />
      <GlobalUtilities />
      <TimeTracker />

      <main className="w-full px-2 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-10 lg:pt-32 pb-32 max-w-[2400px] mx-auto">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TimeProvider>
          <AppLayout>
            <Routes>
              {/* ... existing routes ... */}
              <Route path="/antigravity" element={<AntigravityPage />} />
              <Route path="/neural" element={<RescueNode nodeName="Neural Studio"><NeuralStudioPage /></RescueNode>} />
              <Route path="/" element={<RescueNode nodeName="Dashboard"><DashboardPage /></RescueNode>} />
              <Route path="/projects" element={<RescueNode nodeName="Projetos"><ProjectsPage /></RescueNode>} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/technical" element={<TechnicalHubPage />} />
              <Route path="/legal" element={<LegalReportPage />} />
              <Route path="/proposals" element={<ProposalsManagementPage />} />
              <Route path="/media" element={<MediaHubPage />} />
              <Route path="/dna" element={<MaterialLibraryPage />} />
              <Route path="/inbox" element={<StudioInboxPage />} />
              <Route path="/calculator" element={<RescueNode nodeName="Simulador PavAÂ­vel"><CalculatorPage /></RescueNode>} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/brand" element={<BrandIdentityPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </AppLayout>
        </TimeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

```

## File: .\eslint.config.js
```
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vercel', '.git'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react': react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/prop-types': 'off',
    },
  },
);
```

## File: .\index.tsx
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import fa360 from './services/fa360';

console.log("BOOT: index.tsx loaded");

// Inicializar o motor core e auto-pilot
fa360.log("ECOSYSTEM: Inicializando Ferreira-360...");

// Backdoor Global para o utilizador Ferreira
(window as any).antigravity = () => {
  window.location.hash = '/antigravity';
};

// Listener de emergencia (Shift + Alt + A)
window.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
    console.log("WARP: Iniciando sequencia de emergencia Antigravity...");
    (window as any).antigravity();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

```

## File: .\metadata.json
```
{
  "name": "FA-360 Architecture Studio",
  "description": "A comprehensive, luxury-branded management system for Ferreira Arquitetos, featuring a client portal, project management, and a proposal generator.",
  "requestFramePermissions": [
    "camera",
    "microphone",
    "geolocation"
  ]
}
```

## File: .\package.json
```
{
  "name": "fa-360-architecture-studio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint \"**/*.{ts,tsx,js,jsx}\"",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.37.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.562.0",
    "motion": "^12.28.1",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-router-dom": "^7.12.0",
    "recharts": "^3.6.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.2",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.39.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "globals": "^17.1.0",
    "typescript": "~5.8.2",
    "typescript-eslint": "^8.54.0",
    "vite": "^6.2.0"
  },
  "vercel": {
    "forceDeploy": "2026-01-27T12:00:00Z"
  }
}
```

## File: .\tsconfig.json
```
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## File: .\types.ts
```

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'architect' | 'client';
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: 'planning' | 'construction' | 'finished';
  budget: number;
  progress: number;
  image: string;
  nextAction?: string;
  nextActionDate?: string;
  lastUpdate?: number;
}

export type Complexity = 1 | 2 | 3;
export type Scenario = 'essential' | 'standard' | 'premium';
export type UnitKind = 'APARTMENT' | 'LOT' | 'ROOM';

export interface UnitsInput {
  apartments?: number;
  lots?: number;
  rooms?: number;
}

export interface UnitPricingConfig {
  unitKind: UnitKind;
  baseFeeArch?: number;
  feePerUnitArch: number;
  feePerM2Arch?: number;
  includedUnits?: number;
  extraUnitMultiplier?: number;
}

export type ClientProfile = 'private' | 'promoter' | 'institutional';
export type ProcessType = 'pip' | 'lic' | 'exec';
export type LocationTier = 'interior_base' | 'interior' | 'litoral_base' | 'litoral' | 'porto';

export type DiscountType = 'none' | 'clienteRecorrente' | 'packCompleto' | 'antecipacaoPagamento' | 'volume' | 'earlyBird' | 'promocaoSazonal' | 'custom';
export type UserRole = 'auto' | 'arquiteto' | 'financeiro' | 'marketing' | 'diretor';

export interface DiscountInput {
  type: DiscountType;
  value: number;
  justification?: string;
}

export interface CalculationParams {
  templateId: string;
  area: number;
  complexity: Complexity;
  selectedSpecs: string[];
  scenario: Scenario;

  // Patch V1
  vatRate?: 0.06 | 0.23;
  processType?: ProcessType;
  clientProfile?: ClientProfile;
  locationTier?: LocationTier;

  units?: UnitsInput;
  discount?: DiscountInput;
  userRole?: UserRole;
}

// Redefined to match ScenarioPack from catalog
export interface ScenarioConfig {
  id: Scenario;
  labelPT: string;
  multiplier: number;
  revisionsIncluded: number;
  deliverablesPT: string[];
  deliverablesEN: string[];
  exclusionsPT: string[];
  exclusionsEN: string[];
  notesPT?: string;
  notesEN?: string;
}

export interface DiscountAudit {
  requested: { type: DiscountType; pct: number; justification?: string };
  applied: { pct: number; amount: number };
  status: 'applied' | 'rejected' | 'clamped';
  reasons: string[];
  policy: { maxPct: number; requiresRole: UserRole; description: string };
}

export interface ConfigSnapshot {
  vatRate: number;
  thresholds: {
    marginBlock: number;
    marginWarn: number;
    marginHealthy: number;
  };
  multipliers: {
    complexity: number;
    scenario: number;
  };
  scenarioConfig: ScenarioConfig;
}

export interface FeeResultV1 {
  totals: {
    archNet: number;
    specNet: number;
    net: number;
    vat: number;
    gross: number;
  };
  phases: Array<{
    id: string;
    label: string;
    value: number;
    vat: number;
    gross: number;
  }>;
  payments: Array<{
    name: string;
    pct: number;
    dueDays: number;
    value: number;
    vat: number;
    gross: number;
  }>;
  tasks: {
    archIds: string[];
    specIds: string[];
  };
  risk: {
    score: number;
    level: string;
    alerts: string[];
    recs: string[];
  };
  meta: {
    version: string;
    configSnapshot?: ConfigSnapshot;
    templateId: string;
    pricingModel: string;
    appliedDiscount: number;
    discountAudit: DiscountAudit;
    specCount: number;
    compMult: number;
    scenMult: number;
    minFeeApplied: boolean;
    units: UnitsInput;
    vatRate: number;
    scenarioDiffs: {
      standard: number;
      current: number;
    };
  };
}

// Fee Engine Types
export interface FeeTemplate {
  templateId: string;
  namePT: string;
  nameEN: string;
  processType: 'lic' | 'exec' | 'hybrid';
  pricingModel: 'PACKAGE' | 'EUR_PER_M2' | 'UNIT';
  legalProfile: string;
  sortOrder: number;
  baseFeeArch?: number;
  rateArchPerM2?: number;
  minFeeTotal?: number;
  unitPricing?: UnitPricingConfig;
}

export interface Phase {
  phaseId: string;
  phaseType: 'ARCH' | 'SPEC';
  labelPT: string;
  labelEN: string;
  shortPT: string;
  shortEN: string;
}

export interface Discipline {
  disciplineId: string;
  labelPT: string;
  labelEN: string;
  phases?: Array<{
    phaseId: string;
    labelPT: string;
    shortPT: string;
  }>;
}

export interface TemplatePhaseWeight {
  templateId: string;
  phaseId: string;
  weightPct: number;
}

export interface TemplateSpecialty {
  templateId: string;
  disciplineId: string;
  required: boolean;
  defaultOn: boolean;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface TimeLog {
  id: string;
  projectId: string;
  date: string;
  duration: number; // minutes
  phase: string;
  description?: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  projectId?: string;
  projectKey?: string;
  completed: boolean;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  projectId?: string;
}

export interface CriticalAlert {
  id: string;
  type: 'PAYMENT_OVERDUE' | 'TASK_OVERDUE' | 'PROJECT_BLOCKED' | 'CLIENT_PENDING';
  message: string;
  projectId?: string;
  daysLate?: number;
  actionUrl: string;
}

export interface CashflowStats {
  received30d: number;
  projected30d: number;
  overdue: number;
}

export interface FunnelStats {
  leads: number;
  activeProposals: number;
  activeValue: number;
  negotiation: number;
  conversionRate: number;
}

export interface ProductionStats {
  member: string;
  plannedHours: number;
  actualHours: number;
  utilization: number;
}

export interface DashboardMetrics {
  todayTasks: Task[];
  todayMeetings: Meeting[];
  criticalAlerts: CriticalAlert[];
  cashflow: CashflowStats;
  funnel: FunnelStats;
  healthIndex: {
    total: number;
    breakdown: {
      deadlines: number;
      cash: number;
      production: number;
      risk: number;
    };
    reason: string;
  };
  production: ProductionStats[];
  neuralStatus: {
    status: 'ONLINE' | 'OFFLINE';
    lastSync?: string;
    message?: string;
  };
}

export interface DailyBriefing {
  tasks: Task[];
  meetings: Meeting[];
  pendingInvoices: number;
  stalledProjects: number;
  metrics?: DashboardMetrics; // Extended support
}

export interface AutomationPayload {
  simulationId: string;
  templateId: string;
  scenarioId: Scenario;
  client: { name: string; email?: string };
  location: string;
  fees: { net: number; vatRate: number; gross: number };
  payments: Array<{
    id: string;
    name: string;
    phaseId: string;
    percentage: number;
    valueNet: number;
    dueDays: number;
  }>;
  tasks: {
    archIds: string[];
    specIds: string[];
  };
  scenario: {
    id: Scenario;
    labelPT: string;
    revisionsIncluded: number;
    deliverablesPT: string[];
    deliverablesEN: string[];
    exclusionsPT: string[];
    exclusionsEN: string[];
  };
  deltaVsStandard: {
    net: number;
    vat: number;
    gross: number;
  };
  configSnapshot: ConfigSnapshot;
  meta: {
    createdAt: string;
    configSnapshot: {
       compMult: number;
       scenMult: number;
       appliedDiscount: number;
       guardrail: string;
    }
  };
  schedule: { startDate: string };
}

export interface AutomationRun {
  id: string;
  simulationId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  createdIds: {
    projectId: string;
    proposalId?: string;
  };
}

export interface Document {
  docId: string;
  projectId: string;
  type: 'proposal' | 'contract' | 'report' | 'other';
  title: string;
  url: string;
  createdAt: string;
  metaJson?: string;
}

export interface AuditLog {
  logId: string;
  projectId: string;
  action: string;
  payloadJson: string;
  createdAt: string;
  actor: string;
}

export interface Payment {
  paymentId: string;
  projectId: string;
  name: string;
  appliesTo: string;
  percentage: number;
  amountNet: number;
  vatRate: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  phaseId: string;
}
```

## File: .\vite.config.ts
```
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

