import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Building2, Briefcase, DollarSign } from 'lucide-react';

interface AdjudicateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  proposal: any;
}

export const AdjudicateModal: React.FC<AdjudicateModalProps> = ({ open, onClose, onConfirm, proposal }) => {
  if (!open || !proposal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass p-8 rounded-[2rem] border-white/10 shadow-2xl bg-[#1a1a1a]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold mb-4">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-serif italic text-white">Confirmar Adjudicação</h2>
              <p className="text-xs uppercase tracking-widest text-white/50">Transformar Proposta em Projeto</p>
            </div>

            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <Briefcase size={18} className="text-luxury-gold shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Projeto</p>
                  <p className="text-sm font-medium text-white">{proposal.project}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Building2 size={18} className="text-luxury-gold shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Cliente</p>
                  <p className="text-sm font-medium text-white">{proposal.client}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <DollarSign size={18} className="text-luxury-gold shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Valor Total</p>
                  <p className="text-sm font-medium text-white">€{parseFloat(proposal.total).toLocaleString('pt-PT')}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-4 rounded-xl bg-luxury-gold text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/20"
              >
                Adjudicar e Criar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
