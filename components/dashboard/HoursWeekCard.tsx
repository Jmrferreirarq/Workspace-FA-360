import React from 'react';
import SpotlightCard from '../ui/SpotlightCard';

const Row = ({ label, data }: { label: string; data: any }) => {
  const pct = Math.max(0, Math.min(140, data.pct || 0));
  const tone =
    data.status === 'ok'
      ? 'text-emerald-400'
      : data.status === 'over'
      ? 'text-rose-400'
      : 'text-luxury-gold';

  return (
    <div className="p-4 bg-black/30 border border-white/5 rounded-sm">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-[0.35em] text-white/30">
          {label}
        </div>
        <div className={`text-[11px] font-mono ${tone}`}>{pct}%</div>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-serif font-bold italic text-white/90">
          {data.hours}h
        </div>
        <div className="text-xs font-mono text-white/40">
          / {data.target}h
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <div
          className="h-full bg-luxury-gold/60"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      <div className="mt-3 text-xs text-white/35 italic">
        {data.status === 'over'
          ? 'Acima do alvo a€” risco de sobrecarga.'
          : data.status === 'low'
          ? 'Abaixo do alvo a€” pode haver capacidade livre.'
          : 'Dentro do alvo semanal.'}
      </div>
    </div>
  );
};

export const HoursWeekCard: React.FC<{ data: any; onOpen?: () => void }> = ({ data, onOpen }) => {
  return (
    <SpotlightCard className="p-8 rounded-[0.5rem] bg-white/[0.02] border-white/5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-white/20">
          PRODUA‡AƒO a€¢ HORAS (SEMANA)
        </div>
        <button
          onClick={onOpen}
          className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
        >
          Detalhe a†’
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Row label="CEO" data={data?.CEO || { hours: 0, target: 40, pct: 0, status: 'low' }} />
        <Row label="JA‰SSICA" data={data?.JESSICA || { hours: 0, target: 40, pct: 0, status: 'low' }} />
        <Row label="SOFIA" data={data?.SOFIA || { hours: 0, target: 40, pct: 0, status: 'low' }} />
      </div>

      <div className="mt-6 text-[11px] text-white/25 italic">
        Baseado em registos de horas (NET operacional). Ajusta o alvo por pessoa se necessario.
      </div>
    </SpotlightCard>
  );
};
