import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, AlertTriangle, FileText, ExternalLink, Calculator } from 'lucide-react';
import { legalEngine, LegalInput, LegalResult } from '../../services/legalEngine';
import { useLanguage } from '../../context/LanguageContext';
import municipalSources from '../../data/legal/catalog/sources.json';

export const LegalWizard: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<LegalInput>({
    municipalityId: 'AVEIRO',
    useType: 'residential',
    urbanZone: 'expansion',
    areaGross: 0,
    numDwellings: 0,
    areaPlot: 0,
    areaFootprint: 0
  });
  const [results, setResults] = useState<LegalResult[]>([]);

  const handleNext = async () => {
    if (step === 3) {
      const res = await legalEngine.evaluate(inputs);
      setResults(res);
      setStep(4);
    } else {
      setStep(s => s + 1);
    }
  };

  const municipalities = municipalSources.municipalities;

  return (
    <div className="bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-strong min-h-[600px] flex flex-col">
      {/* Progress Bar */}
      <div className="flex h-1 bg-black/5 dark:bg-white/5">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-luxury-gold' : 'bg-transparent'}`} />
        ))}
      </div>

      <div className="p-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Escopo Territorial</h3>
                <p className="text-sm text-luxury-charcoal/50 dark:text-white/40">Selecione o MunicA≠pio para carregar o motor de regras PDM.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {municipalities.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setInputs({ ...inputs, municipalityId: m.id })}
                    className={`p-6 rounded-2xl border transition-all text-left group ${inputs.municipalityId === m.id ? 'bg-luxury-gold border-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/10 text-luxury-charcoal dark:text-white hover:border-luxury-gold/50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{m.name}</span>
                      {inputs.municipalityId === m.id && <Check size={18} />}
                    </div>
                    <p className={`text-[11px] mt-1 font-black uppercase tracking-widest ${inputs.municipalityId === m.id ? 'text-black/60' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>PDM Ativo</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Uso & Localizacao</h3>
                <p className="text-sm text-luxury-charcoal/50 dark:text-white/40">Defina a tipologia da operacao e o enquadramento urbano.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-gold block mb-3">Tipo de Uso</label>
                  <div className="flex flex-wrap gap-3">
                    {['residential', 'commercial', 'services', 'industrial'].map(use => (
                      <button
                        key={use}
                        onClick={() => setInputs({ ...inputs, useType: use as any })}
                        className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase transition-all ${inputs.useType === use ? 'bg-luxury-gold border-luxury-gold text-black' : 'bg-white/5 dark:bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                      >
                        {use}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-gold block mb-3">Zona Urbana (PDM)</label>
                  <div className="flex flex-wrap gap-3">
                    {['central', 'historical', 'expansion', 'rural'].map(zone => (
                      <button
                        key={zone}
                        onClick={() => setInputs({ ...inputs, urbanZone: zone as any })}
                        className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase transition-all ${inputs.urbanZone === zone ? 'bg-luxury-gold border-luxury-gold text-black' : 'bg-white/5 dark:bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Metricas de Dimensionamento</h3>
                <p className="text-sm text-luxury-charcoal/50 dark:text-white/40">Insira os dados brutos para calculo de areas e A≠ndices obrigatorios.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">AÅrea Bruta de Construcao (mA≤)</label>
                  <input 
                    type="number" 
                    value={inputs.areaGross} 
                    onChange={e => setInputs({ ...inputs, areaGross: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Numero de Fogos / Unidades</label>
                  <input 
                    type="number" 
                    value={inputs.numDwellings} 
                    onChange={e => setInputs({ ...inputs, numDwellings: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">AÅrea do Lote (mA≤)</label>
                  <input 
                    type="number" 
                    value={inputs.areaPlot} 
                    onChange={e => setInputs({ ...inputs, areaPlot: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">AÅrea de Implantacao (mA≤)</label>
                  <input 
                    type="number" 
                    value={inputs.areaFootprint} 
                    onChange={e => setInputs({ ...inputs, areaFootprint: Number(e.target.value) })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-serif text-luxury-gold outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4" 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 pb-10"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-serif italic text-luxury-charcoal dark:text-white mb-2">Output Legislativo</h3>
                  <p className="text-xs font-black uppercase tracking-widest text-luxury-gold">{inputs.municipalityId} aÄ¢ Deterministic Engine v1.0</p>
                </div>
                <button onClick={() => window.print()} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-luxury-gold hover:text-black transition-all">
                  <Calculator size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {results.map((res) => (
                  <div key={res.ruleId} className="glass p-6 rounded-2xl border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold rounded-md">{res.topic}</span>
                        <h4 className="text-sm font-bold text-luxury-charcoal dark:text-white">{res.label}</h4>
                      </div>
                      <div className="text-4xl font-serif text-luxury-gold tabular-nums">
                        {res.value} <span className="text-xs opacity-50">{res.unit}</span>
                      </div>
                      {res.notes && <p className="text-xs italic opacity-40">{res.notes}</p>}
                    </div>
                    
                    <div className="text-right space-y-3">
                      <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-end ${res.confidence === 'official_reference' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {res.confidence === 'official_reference' ? <Check size={10} /> : <AlertTriangle size={10} />}
                        {res.confidence.replace('_', ' ')}
                      </div>
                      {res.sourceRef && (
                        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-left border border-white/5">
                          <p className="text-[11px] font-bold text-white/60 mb-1">{res.sourceRef.articleRef}</p>
                          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-luxury-gold flex items-center gap-1 hover:underline">
                            <ExternalLink size={8} /> Ver Regulamento
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-10 border-t border-black/5 dark:border-white/10 flex justify-between bg-black/[0.02] dark:bg-white/[0.02]">
        <button
          disabled={step === 1}
          onClick={() => setStep(s => s - 1)}
          className={`px-8 py-3 rounded-xl border border-black/10 dark:border-white/10 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal dark:text-white transition-opacity ${step === 1 ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex items-center gap-2">
            <ChevronLeft size={14} /> Voltar
          </div>
        </button>

        {step < 4 && (
          <button
            onClick={handleNext}
            className="px-10 py-3 rounded-xl bg-luxury-gold text-black text-[11px] font-black uppercase tracking-widest shadow-xl shadow-luxury-gold/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            Proximo <ChevronRight size={14} />
          </button>
        )}

        {step === 4 && (
          <button
            onClick={() => setStep(1)}
            className="px-10 py-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            Nova Analise
          </button>
        )}
      </div>
    </div>
  );
};
