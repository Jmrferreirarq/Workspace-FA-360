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
