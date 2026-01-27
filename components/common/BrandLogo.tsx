
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

