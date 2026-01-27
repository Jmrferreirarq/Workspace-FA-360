
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
