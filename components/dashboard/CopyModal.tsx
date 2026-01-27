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
