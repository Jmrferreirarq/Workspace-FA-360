
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
        kicker="Timeline do Estúdio"
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
              <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
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

