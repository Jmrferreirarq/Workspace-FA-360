
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Bell, MessageSquare, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface NotificationPulseProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Atraso em Licenciamento', desc: 'C.M. Lisboa solicitou esclarecimentos para Villa Alentejo.', time: '12m atrás', project: 'Villa Alentejo', link: '/legal' },
  { id: 2, type: 'client', title: 'João Silva aprovou material', desc: 'Revestimento Master Suite confirmado via Portal.', time: '1h atrás', project: 'Apartamento Chiado', link: '/portal/demo' },
  { id: 3, type: 'update', title: 'Novo Render Finalizado', desc: 'A equipa de 3D carregou as vistas nocturnas.', time: '4h atrás', project: 'HQ Tech Valley', link: '/media' },
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
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Studio Pulse</h2>
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
                            <p className="text-[11px] font-black uppercase tracking-widest text-luxury-gold group-hover:text-white transition-colors">{n.project}</p>
                            <span className="text-[11px] font-mono opacity-20">{n.time}</span>
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
                    <p className="text-sm font-serif italic">Tudo limpo. Desfrute do silêncio.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-white/5 mt-auto">
              <button onClick={resetNotifications} className="w-full py-4 glass border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-2 group">
                 {notifications.length === 0 ? "Simular Novas Notificações" : "Ver Todo o Histórico"} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

