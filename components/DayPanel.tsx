
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
            <div className="glass p-8 rounded-xl border-white/5 relative overflow-hidden group hover:border-luxury-gold/20 transition-all">
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
            <div className="glass p-8 rounded-xl border-white/5 relative overflow-hidden group hover:border-luxury-gold/20 transition-all">
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
            <div className="glass p-8 rounded-xl border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-all bg-red-500/[0.02]">
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

