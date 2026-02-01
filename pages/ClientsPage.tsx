
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
                className="glass p-10 rounded-2xl border-black/5 dark:border-white/5 group hover:border-luxury-gold/30 transition-all relative overflow-hidden cursor-pointer shadow-xl text-luxury-charcoal dark:text-white"
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
        <div className="py-40 glass rounded-2xl border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-8 text-center bg-black/5 dark:bg-white/[0.02]">
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
              className="relative w-full max-w-2xl glass rounded-xl border-white/10 p-8 md:p-8 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-12"
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
                  className="w-full py-7 bg-luxury-gold text-black rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-strong shadow-luxury-gold/30 disabled:opacity-50"
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

