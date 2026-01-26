
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProposalGenerator from '../components/ProposalGenerator';
import PageHeader from '../components/common/PageHeader';

export default function CalculatorPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      <PageHeader 
        kicker="Engenharia Financeira"
        title={<>Simulador de <span className="text-luxury-gold">Honorários.</span></>}
      />

      <div className="w-full h-full">
        <ProposalGenerator isOpen={true} />
      </div>

      <div className="flex justify-center pt-20">
        <button
          onClick={() => navigate('/')}
          className="px-12 py-5 glass border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}

