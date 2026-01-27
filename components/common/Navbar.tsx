
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

