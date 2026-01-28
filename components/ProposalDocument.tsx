import React from 'react';
// Heartbeat 2.0 - Final Build Fix

import { disciplines } from '../services/feeData';
import { getPaymentModelForTemplate, calculatePaymentValues } from '../services/paymentModels';
import { ShieldCheck, MapPin } from 'lucide-react';

interface ProposalPhase {
   label: string;
   description: string;
   weeks?: number;
   duration?: string;
   value?: number; // Added to support value aggregation
}

interface ProposalEffort {
   label: string;
   hours: number;
   profile: string;
}


interface ComparisonItem {
   scenario: string;
   pack: {
      labelPT?: string;
      deliverablesPT?: string[];
      revisionsIncluded?: number;
   };
   result: {
      feeTotal: number;
      feeArch?: number;
      feeSpec?: number;
      phasesBreakdown?: { phaseId: string; value: number }[];
      effortMap?: { hours: number }[];
   };
}

interface ProposalDocumentProps {
   data: {
      templateName: string;
      clientName: string;
      projectName: string;
      location: string;
      internalRef: string;
      address?: string; // NEW
      mapsLink?: string; // NEW
      area: number;
      complexity: string;
      scenario: string;
      feeArch: number;
      feeSpec: number;
      feeTotal: number;
      vat: number;
      totalWithVat: number;
      activeSpecs: string[];
      selectedSpecs?: string[];
      phases: ProposalPhase[];
      effortMap: ProposalEffort[];
      units: unknown;
      comparisonData?: ComparisonItem[]; // FIXED: Typed Array
   };
   includeAnnex: boolean;
}

// Helper function to format weeks with month conversion
const formatWeeks = (weeks: number): string => {
   const months = Math.floor(weeks / 4);
   if (months >= 1) {
      return `${weeks} sem (${months} ${months === 1 ? 'mes' : 'meses'})`;
   }
   return `${weeks} sem`;
};

// Helper: Separar fases por etapa (Licenciamento vs Execucao)
const getStageBreakdown = (phases: ProposalPhase[]) => {
   // Licenciamento: A0 + A1 + A2
   const licensing = phases.filter(p => ['A0', 'A1', 'A2'].some(id => p.label.startsWith(id)));
   const licensingValue = licensing.reduce((acc, p) => acc + (p.value || 0), 0);
   const licensingWeeks = licensing.reduce((acc, p) => acc + (p.weeks || 0), 0);

   // Execucao: A3 + A4
   const execution = phases.filter(p => ['A3', 'A4'].some(id => p.label.startsWith(id)));
   const executionValue = execution.reduce((acc, p) => acc + (p.value || 0), 0);
   const executionWeeks = execution.reduce((acc, p) => acc + (p.weeks || 0), 0);

   return {
      licensing: { value: licensingValue, weeks: licensingWeeks, hasPhases: licensing.length > 0 },
      execution: { value: executionValue, weeks: executionWeeks, hasPhases: execution.length > 0 }
   };
};

export default function ProposalDocument({ data, includeAnnex }: ProposalDocumentProps) {
   const today = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
   const stages = getStageBreakdown(data.phases);

   return (
      <>
         <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          
          /* RESET GLOBAL VISIBILITY */
          body { visibility: hidden; }
          
          /* TARGET DEDICATED PRINT MOUNT */
          #print-mount-point {
             visibility: visible !important;
             display: block !important;
             position: absolute !important;
             top: 0 !important;
             left: 0 !important;
             width: 210mm !important;
             z-index: 2147483647 !important;
          }

          /* SHOW PROPOSAL INSIDE PRINT MOUNT */
          #print-mount-point .proposal-to-print {
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important; /* Relative to mount point */
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* FORCE CONTENT COLOR & VISIBILITY */
          #print-mount-point .proposal-to-print * {
             visibility: visible !important;
             color: #000000 !important;
             text-shadow: none !important;
             box-shadow: none !important;
          }

          /* IMAGES */
          #print-mount-point .proposal-to-print img {
             opacity: 1 !important;
             display: block !important;
          }

          /* HIDE EVERYTHING ELSE (To be sure) */
          body > *:not(#root) { display: none !important; }
          
          /* RESET ROOTS */
          html, body, #root { 
             overflow: visible !important; 
             height: auto !important; 
             width: auto !important;
          }

          /* PAGE BREAKS */
          .page-break-after-always { 
             page-break-after: always !important; 
             break-after: page !important;
             display: block; 
             height: 1px; 
             content: "";
             margin-bottom: 0 !important;
          }
        }
      `}</style>
         <div className="proposal-to-print bg-white text-luxury-black shadow-none min-h-[1100px] w-full max-w-[900px] mx-auto flex flex-col font-sans">
            {/* CAPA (Com Margem) */}
            <div className="w-full h-[1123px] relative page-break-after-always p-0 bg-white flex flex-col items-center justify-center">
               <div className="w-[90%] h-[90%] relative overflow-hidden">
                  <img src="/assets/cover-front.jpg" alt="Capa" className="w-full h-full object-contain" />
               </div>
            </div>

            {/* Pág. 1: CONTEÚDO (Com Padding) */}
            <div className="p-8 md:p-24 flex-1 flex flex-col page-break-after-always">
               {/* Estacionario Premium */}
               <header className="flex justify-between items-start border-b-2 border-luxury-black pb-12 mb-12">

                  <div className="text-right">
                     <p className="text-[11px] font-black uppercase tracking-[0.3em]">Honorarios Profissionais</p>
                     <p className="text-xs font-mono mt-2 tracking-tighter">REF: {data.internalRef}</p>
                     <p className="text-xs font-mono opacity-50">{today}</p>
                  </div>
               </header>

               {/* DADOS DA OBRA (NEW) */}
               <div className="grid grid-cols-2 md:grid-cols-[1.2fr_2fr_0.8fr_0.6fr_1.4fr] gap-6 mb-16 border-b border-black/5 pb-8 items-start">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Cliente</p>
                     <p className="text-xs font-serif italic leading-tight">{data.clientName || 'Cliente Final'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Projeto</p>
                     <p className="text-xs font-serif italic leading-tight">{data.projectName || 'Nova Construção'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Localização</p>
                     <p className="text-xs font-serif italic leading-tight">{data.location || 'Portugal'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Área</p>
                     <p className="text-xs font-serif italic leading-tight whitespace-nowrap">{data.area} m²</p>
                  </div>
                  {data.address && (
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Morada</p>
                        <p className="text-xs font-serif italic leading-tight" title={data.address}>{data.address}</p>
                        {data.mapsLink && (
                           <a href={data.mapsLink} target="_blank" rel="noreferrer" className="text-[9px] text-blue-500 underline flex items-center gap-1 opacity-60 hover:opacity-100 mt-1">
                              <MapPin size={8} /> Ver Mapa
                           </a>
                        )}
                     </div>
                  )}
               </div>

               {/* Identificacao do Projeto */}
               {/* PAGINA 1: PROPOSTA EXECUTIVA */}
               <div className="flex-1 space-y-16">
                  {/* 2. Enquadramento Institucional & Técnico */}
                  <section className="space-y-4">
                     <h4 className="text-[11px] font-black uppercase tracking-widest text-luxury-black opacity-30">Quem Somos</h4>
                     <p className="text-xs font-light italic leading-relaxed opacity-60 text-luxury-black text-justify">
                        Fundada em 2017 pelo arquiteto José Ferreira, a Ferreirarquitetos é uma referência no setor de arquitetura em Portugal,
                        especialmente na região de Aveiro. Com uma combinação única de precisão e criatividade, a nossa equipa dedica-se a
                        transformar visões em realidade, abordagem reconhecida por diversos prémios, incluindo a Medalha de Prata nos Prémios
                        Lusófonos de Arquitetura.
                     </p>
                     <p className="text-xs font-light italic leading-relaxed opacity-60 text-luxury-black text-justify">
                        Nesse sentido, a presente proposta reflete o nosso compromisso com a excelência, apresentando uma metodologia de trabalho
                        rigorosa para o desenvolvimento do seu projeto, assegurando um processo tecnicamente consistente e em total cumprimento
                        legal com o RJUE.
                     </p>
                  </section>


                  {/* 3. Modo de Decisao & Cronograma Visual */}
                  <section className="space-y-8">
                     <div className="flex items-center gap-4 text-luxury-purple">
                        <span className="w-8 h-[1px] bg-luxury-purple opacity-30"></span>
                        <p className="text-[11px] font-black uppercase tracking-widest">Estrategia & Timeline</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Decision Mode */}
                        <div className="space-y-6">
                           <div className="bg-luxury-black/5 p-8 rounded-[2rem] border border-luxury-black/5 h-full flex flex-col justify-center">
                              <h4 className="text-sm font-black uppercase tracking-widest mb-2 text-luxury-black">
                                 {data.scenario === 'essential' ? '🥉 Modo Essencial' : data.scenario === 'standard' ? '🥈 Modo Profissional' : '💎 Modo Executivo'}
                              </h4>
                              <p className="text-[11px] font-light italic opacity-60 leading-relaxed mb-6">
                                 {data.scenario === 'essential' ? 'Foco no cumprimento legal estrito. Ideal para investimentos contidos.' :
                                    data.scenario === 'standard' ? 'Equilibrio entre rigor tecnico e agilidade. O padrao para obras seguras.' :
                                       'Controlo absoluto de custos e prazos. Para quem nao admite falhas.'}
                              </p>
                              <div className="flex gap-4">
                                 <div className="text-center">
                                    <p className="text-[9px] font-black uppercase opacity-30">Revisoes</p>
                                    <p className="text-xl font-serif">{data.scenario === 'premium' ? 4 : data.scenario === 'standard' ? 3 : 2}</p>
                                 </div>
                                 <div className="w-[1px] bg-luxury-black/10"></div>
                                 <div className="text-center">
                                    <p className="text-[9px] font-black uppercase opacity-30">Equipa</p>
                                    <p className="text-xl font-serif">
                                       {Math.round(data.effortMap.reduce((acc, e) => acc + e.hours, 0))}h
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Visual Gantt Chart */}
                        <div className="space-y-6">
                           <div className="flex justify-between items-end">
                              <h4 className="text-[11px] font-black uppercase tracking-widest opacity-40">Cronograma de Produção</h4>
                              <span className="text-[10px] font-mono opacity-40">
                                 Total Ativo: {formatWeeks(data.phases.reduce((acc, p) => acc + (p.weeks || 4), 0))}
                              </span>
                           </div>

                           <div className="space-y-3">
                              {/* Ruler/Grid Concept: Not strictly needed for V1, just strict bars. */}
                              {data.phases.map((p, i) => {
                                 const currentWeeks = p.weeks || 4;
                                 const labelParts = p.label.split('.');
                                 const mainLabel = labelParts[0];
                                 const subLabel = labelParts.slice(1).join('.');

                                 return (
                                    <React.Fragment key={i}>
                                       <div className="group">
                                          <div className="flex justify-between text-[10px] mb-1">
                                             <span className="font-bold uppercase tracking-wider text-luxury-black">
                                                {mainLabel}
                                                <span className="font-light opacity-60 normal-case tracking-normal">.{subLabel}</span>
                                             </span>
                                             <span className="font-mono opacity-40">{formatWeeks(currentWeeks)}</span>
                                          </div>
                                          <div className="h-2 w-full bg-luxury-black/5 rounded-full overflow-hidden flex items-center">
                                             <div
                                                className="h-full bg-luxury-gold opacity-80"
                                                style={{ width: `${Math.min(100, (currentWeeks / 20) * 100)}%` }}
                                             ></div>
                                          </div>
                                       </div>

                                       {/* SEPARADOR APROVACAO (Apos A2) */}
                                       {p.label.startsWith('A2') && (
                                          <div className="py-4 relative flex items-center justify-center">
                                             <div className="absolute w-full border-t-2 border-dashed border-luxury-black/10"></div>
                                             <span className="text-[9px] font-black uppercase tracking-widest bg-white px-2 z-10 text-luxury-charcoal/40">
                                                ⏸️ Aprovação & Consultas (Tempo Externo)
                                             </span>
                                          </div>
                                       )}
                                    </React.Fragment>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                  </section>


                  {/* 5. Valor Global & Matriz de Investimento */}
                  <section className="py-12 border-y-2 border-luxury-black flex flex-col items-center justify-center space-y-8 bg-luxury-black/[0.02]">
                     <div className="text-center space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Investimento Global Refletido</p>
                        <h3 className="text-7xl font-serif italic tracking-tighter text-luxury-black">
                           €{data.feeTotal.toLocaleString()}<span className="text-2xl font-sans not-italic text-luxury-gold ml-2">+ IVA</span>
                        </h3>
                        <div className="flex items-center justify-center gap-4 text-[10px] uppercase font-black tracking-widest text-luxury-black/60">
                           <span>€{stages.licensing.value.toLocaleString()} Licenciamento</span>
                           <span className="w-1 h-1 rounded-full bg-luxury-gold"></span>
                           <span>€{stages.execution.value.toLocaleString()} Execução (Opcional)</span>
                        </div>
                        <p className="text-[10px] font-mono opacity-40 italic pt-2">Matriz de investimento detalhada por disciplina e etapa.</p>
                     </div>

                     {/* MATRIZ UNIFICADA - The "Holy Grid" of Fees */}
                     {(() => {
                        // Ratios para distribuicao
                        const paymentModel = getPaymentModelForTemplate(data.templateName);
                        // Default to 100/0 if no split defined (legacy fallback)
                        const licRatio = paymentModel.baseSplit ? paymentModel.baseSplit.licensing : 1.0;
                        // execRatio used implicitly by subtraction

                        // Calculo de celulas (Safe rounding)
                        const archLic = Math.round(data.feeArch * licRatio);
                        const archExec = data.feeArch - archLic; // Remainder to ensure exact sum

                        const specLic = Math.round(data.feeSpec * licRatio);
                        const specExec = data.feeSpec - specLic; // Remainder to ensure exact sum

                        return (
                           <div className="w-full max-w-2xl bg-white rounded-2xl border border-luxury-black/10 overflow-hidden shadow-sm">
                              {/* Header */}
                              <div className="grid grid-cols-4 bg-luxury-black text-white text-[10px] uppercase font-black tracking-widest py-3">
                                 <div className="px-6 flex items-center">Disciplina</div>
                                 <div className="px-4 text-center border-l border-white/10 bg-luxury-gold/20 text-luxury-gold">1. Licenciamento</div>
                                 <div className="px-4 text-center border-l border-white/10">2. Execução (Opt.)</div>
                                 <div className="px-4 text-right border-l border-white/10">Total</div>
                              </div>

                              {/* Rows */}
                              <div className="divide-y divide-luxury-black/5 text-xs">
                                 {/* Architecture */}
                                 <div className="grid grid-cols-4 py-4 hover:bg-black/[0.01]">
                                    <div className="px-6 font-bold text-luxury-black flex flex-col justify-center">
                                       Arquitetura
                                       <span className="text-[9px] font-light opacity-50">Design & Coordenação</span>
                                    </div>
                                    <div className="px-4 text-center font-serif italic bg-luxury-gold/[0.05] text-luxury-black/80 flex items-center justify-center">
                                       €{archLic.toLocaleString()}
                                    </div>
                                    <div className="px-4 text-center font-serif italic opacity-60 flex items-center justify-center">
                                       €{archExec.toLocaleString()}
                                    </div>
                                    <div className="px-4 text-right font-black flex items-center justify-end">
                                       €{data.feeArch.toLocaleString()}
                                    </div>
                                 </div>

                                 {/* Specialties */}
                                 <div className="grid grid-cols-4 py-4 hover:bg-black/[0.01]">
                                    <div className="px-6 font-bold text-luxury-black flex flex-col justify-center">
                                       Engenharias
                                       <span className="text-[9px] font-light opacity-50">{data.activeSpecs.length} Disciplinas</span>
                                    </div>
                                    <div className="px-4 text-center font-serif italic bg-luxury-gold/[0.05] text-luxury-black/80 flex items-center justify-center">
                                       €{specLic.toLocaleString()}
                                    </div>
                                    <div className="px-4 text-center font-serif italic opacity-60 flex items-center justify-center">
                                       €{specExec.toLocaleString()}
                                    </div>
                                    <div className="px-4 text-right font-black flex items-center justify-end">
                                       €{data.feeSpec.toLocaleString()}
                                    </div>
                                 </div>

                                 {/* Footer Totals */}
                                 <div className="grid grid-cols-4 py-3 bg-luxury-black/[0.02] border-t-2 border-luxury-black/5">
                                    <div className="px-6 text-[10px] uppercase font-black tracking-widest opacity-40 flex items-center">Total Fase</div>
                                    <div className="px-4 text-center font-black text-luxury-gold flex flex-col justify-center">
                                       €{stages.licensing.value.toLocaleString()}
                                       <span className="text-[8px] text-black/40 font-mono font-normal normal-case">{formatWeeks(stages.licensing.weeks)}</span>
                                    </div>
                                    <div className="px-4 text-center font-bold opacity-60 flex flex-col justify-center">
                                       €{stages.execution.value.toLocaleString()}
                                       <span className="text-[8px] text-black/30 font-mono font-normal normal-case">{formatWeeks(stages.execution.weeks)}</span>
                                    </div>
                                    <div className="px-4 text-right font-black text-base flex items-center justify-end">
                                       €{data.feeTotal.toLocaleString()}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })()}

                     <p className="text-[9px] italic opacity-50 max-w-sm text-center leading-relaxed">
                        Nota: A fase de **Execução** ({(getPaymentModelForTemplate(data.templateName).baseSplit?.execution || 0) * 100}%) é facultativa e só avança por decisão do cliente após a aprovação do licenciamento, garantindo total controlo sobre o investimento.
                     </p>
                  </section>

                  {/* 6. Prazo e Exclusoes: Mantendo */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[11px]">
                     <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Prazo de Execucao</h4>
                        <p className="italic opacity-60 font-light leading-relaxed">
                           Prazos estimados de execucao tecnica: {data.scenario === 'premium' ? '18 a 24 semanas (4,5 a 6 meses)' : '10 a 14 semanas (2,5 a 3,5 meses)'}
                           (sujeito a alteracoes por parte de entidades externas e aprovacoes camararias).
                        </p>
                     </div>
                     <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Exclusoes de Arquitetura</h4>
                        <ul className="space-y-2 opacity-50 italic font-light">
                           <li>• Taxas camararias e licenciamento de entidades externas.</li>
                           <li>• Alteracoes substanciais ao programa aprovado nesta fase.</li>
                           <li>• Acompanhamento de obra e direcao de fiscalizacao.</li>
                           <li>• Design de interiores decorativo (mobiliario e acabamentos).</li>
                        </ul>
                     </div>
                     <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Exclusoes de Engenharias</h4>
                        <ul className="space-y-2 opacity-50 italic font-light">
                           <li>• Estudos geotecnicos, topograficos e levantamentos previos.</li>
                           <li>• Ensaios laboratoriais e testes de materiais em obra.</li>
                           <li>• Fiscalizacao tecnica de especialidades durante a execucao.</li>
                           <li>• Certificacoes energeticas e auditorias pos-construcao.</li>
                        </ul>
                     </div>
                  </section>

                  {/* PLANO DE PAGAMENTOS */}
                  <section className="space-y-6 pt-8">
                     <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Plano de Pagamentos</h4>

                     {(() => {
                        const paymentModel = getPaymentModelForTemplate(data.templateName);
                        const totalFee = (data.feeArch || 0) + (data.feeSpec || 0);
                        const paymentValues = calculatePaymentValues(totalFee, paymentModel);

                        // Agrupar fases por tipo
                        const licensingPhases = paymentValues.filter(p => p.phase.type === 'LICENSING');
                        const executionPhases = paymentValues.filter(p => p.phase.type === 'EXECUTION');

                        // Calcular subtotais absolutos
                        const licensingTotal = licensingPhases.reduce((sum, p) => sum + p.value, 0);
                        const executionTotal = executionPhases.reduce((sum, p) => sum + p.value, 0);

                        return (
                           <div className="space-y-12">
                              {/* SECCAO 1: LICENCIAMENTO */}
                              <div className="space-y-6">
                                 <h5 className="font-bold text-xs uppercase mb-2 text-luxury-gold">1. Fase de Licenciamento</h5>
                                 <table className="w-full text-xs">
                                    <thead>
                                       <tr className="border-b border-luxury-black/10">
                                          <th className="py-2 text-left font-black uppercase text-[10px] tracking-widest pl-2">Marco de Entrega</th>
                                          <th className="py-2 text-right font-black uppercase text-[10px] tracking-widest">Peso</th>
                                          <th className="py-2 text-right font-black uppercase text-[10px] tracking-widest">Valor</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-luxury-black/5">
                                       {licensingPhases.map((p, i) => {
                                          const relativePercentage = Math.round((p.value! / licensingTotal) * 100);
                                          return (
                                             <tr key={i} className="hover:bg-luxury-gold/[0.02] transition-colors">
                                                <td className="py-4 pl-2 italic font-light opacity-80 border-b border-luxury-black/5">{p.phase.triggerPT}</td>
                                                <td className="py-4 text-right font-mono opacity-60 border-b border-luxury-black/5">{relativePercentage}%</td>
                                                <td className="py-4 text-right font-mono font-bold border-b border-luxury-black/5">€{p.value?.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</td>
                                             </tr>
                                          );
                                       })}
                                    </tbody>
                                    <tfoot>
                                       <tr className="border-t-2 border-luxury-black/10 bg-luxury-black/5">
                                          <td className="py-2 px-2 font-bold uppercase text-[10px]">Total de Adjudicação (Fase 1)</td>
                                          <td className="py-2 text-right font-bold text-[10px]">100%</td>
                                          <td className="py-2 text-right font-mono font-bold text-[10px]">€{licensingTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                       </tr>
                                    </tfoot>
                                 </table>

                                 {/* SUMMARY BOX 1 */}
                                 <div className="bg-white p-8 rounded-[40px] border border-luxury-black/10 shadow-sm flex justify-between items-center mt-4">
                                    <div>
                                       <div className="text-xs font-black uppercase tracking-widest mb-1">1. LICENCIAMENTO (IMEDIATO)</div>
                                       <div className="text-[10px] opacity-50 italic">Total devido à adjudicação inicial desta proposta (+ IVA)</div>
                                    </div>
                                    <div className="text-4xl font-mono font-black">
                                       €{licensingTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                 </div>
                              </div>

                              {/* SECCAO 2: EXECUÇÃO (SE EXISTIR) */}
                              {executionPhases.length > 0 && (
                                 <div className="space-y-6 pt-12 border-t-2 border-dashed border-luxury-black/10">
                                    <div className="flex justify-between items-center">
                                       <h5 className="font-bold text-xs uppercase text-luxury-black/60">2. Fase de Execução (Opcional)</h5>
                                       <span className="text-[10px] bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded font-bold uppercase tracking-wider">Opcional</span>
                                    </div>
                                    <table className="w-full text-xs opacity-90">
                                       <thead>
                                          <tr className="border-b border-luxury-black/10">
                                             <th className="py-2 text-left font-black uppercase text-[10px] tracking-widest opacity-40 pl-2">Marco de Entrega</th>
                                             <th className="py-2 text-right font-black uppercase text-[10px] tracking-widest opacity-40">Peso</th>
                                             <th className="py-2 text-right font-black uppercase text-[10px] tracking-widest opacity-40">Valor</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-luxury-black/5">
                                          {executionPhases.map((p, i) => {
                                             const relativePercentage = Math.round((p.value! / executionTotal) * 100);
                                             return (
                                                <tr key={i} className="hover:bg-luxury-gold/[0.01] transition-colors">
                                                   <td className="py-4 pl-2 italic font-light opacity-50 border-b border-luxury-black/5">{p.phase.triggerPT}</td>
                                                   <td className="py-4 text-right font-mono opacity-30 border-b border-luxury-black/5">{relativePercentage}%</td>
                                                   <td className="py-4 text-right font-mono border-b border-luxury-black/5">€{p.value?.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                             );
                                          })}
                                       </tbody>
                                       <tfoot>
                                          <tr className="border-t-2 border-luxury-black/10 bg-luxury-black/5 opacity-60">
                                             <td className="py-2 px-2 font-bold uppercase text-[10px]">Valor Estimado Execução (Fase 2)</td>
                                             <td className="py-2 text-right font-bold text-[10px]">100%</td>
                                             <td className="py-2 text-right font-mono font-bold text-[10px]">€{executionTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                          </tr>
                                       </tfoot>
                                    </table>

                                    {/* SUMMARY BOX 2 */}
                                    <div className="bg-luxury-black/[0.02] p-8 rounded-[40px] border border-luxury-black/5 flex justify-between items-center mt-4">
                                       <div>
                                          <div className="text-xs font-bold uppercase text-luxury-gold tracking-widest mb-1">2. EXECUÇÃO (OPCIONAL)</div>
                                          <div className="text-[10px] opacity-50 italic">Valor condicionado à adjudicação futura pós-licenciamento (+ IVA)</div>
                                       </div>
                                       <div className="text-4xl font-mono font-black text-luxury-gold/60">
                                          €{executionTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        );
                     })()}
                  </section>

                  {/* 8. Call to Action */}
                  <section className="pt-12 border-t border-luxury-black/5">
                     <div className="flex flex-col items-center py-10 bg-white border border-luxury-black text-luxury-black rounded-[3rem] space-y-6 shadow-sm">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em]">Instrucoes de Adjudicacao</p>
                        <p className="text-xs font-light italic max-w-md text-center opacity-60">Para avancar, confirme por escrito a adjudicacao e proceda ao pagamento do sinal de processamento indicado nas condicoes financeiras.</p>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest border border-luxury-black/20 px-8 py-3 rounded-full">
                           <ShieldCheck size={14} className="text-luxury-gold" />
                           Pronto para Adjudicar
                        </div>
                     </div>
                     <p className="text-[10px] text-center mt-6 italic opacity-40">
                        “A presente proposta reflete uma abordagem tecnica responsavel, orientada para a reducao de risco, controlo de custos e fluidez do processo ate a aprovacao.”
                     </p>
                  </section>
               </div>
            </div>

            {/* PAGINA 2: COMPARACAO (NOVO) */}
            {data.comparisonData && data.comparisonData.length > 0 && (
               <div className="page-break" style={{ pageBreakBefore: 'always', minHeight: '1100px', display: 'block' }}>
                  <header className="flex justify-between items-start border-b border-luxury-black pb-8 mb-12">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em]">Opcoes de Investimento</h3>
                     <p className="text-[11px] font-mono opacity-50">REF: {data.internalRef} / COMPARATIVO</p>
                  </header>

                  <div className="grid grid-cols-3 gap-8">
                     {data.comparisonData.map((item: ComparisonItem, idx: number) => {
                        if (!item || !item.result) return null;
                        const isSelected = data.scenario === item.scenario;

                        return (
                           <div key={idx} className={`p-5 rounded-[2rem] border ${isSelected ? 'border-luxury-gold bg-luxury-gold/[0.05]' : 'border-luxury-black/10'}`}>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                 {item.pack?.labelPT || item.scenario}
                                 {isSelected && <span className="text-[10px] bg-luxury-gold text-white px-2 py-0.5 rounded-full">Selecionado</span>}
                              </h4>

                              <div className="mb-6">
                                 <p className="text-2xl font-serif">€{item.result.feeTotal.toLocaleString()}</p>
                                 <p className="text-[10px] font-mono opacity-50">s/IVA (€{Math.round(item.result.feeTotal / (data.area || 1))} /m²)</p>
                              </div>

                              {/* Breakdown Mini-Matrix */}
                              <div className="mb-6 space-y-2">
                                 <div className="flex justify-between items-end gap-2 text-[10px] bg-black/[0.02] px-4 py-2 rounded-lg border border-black/5">
                                    <div className="space-y-0.5">
                                       <span className="block uppercase font-black opacity-40 text-[8px] tracking-tight">ARQ.</span>
                                       <span className="font-bold block">€{(item.result.feeArch || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                       <span className="block uppercase font-black opacity-40 text-[8px] tracking-tight">ENG.</span>
                                       <span className="font-bold block">€{(item.result.feeSpec || 0).toLocaleString()}</span>
                                    </div>
                                 </div>
                                 <div className="flex justify-between items-end gap-2 text-[10px] bg-luxury-gold/[0.05] px-4 py-2 rounded-lg border border-luxury-gold/20">
                                    <div className="space-y-0.5">
                                       <span className="block uppercase font-black opacity-60 text-luxury-gold text-[8px] tracking-tight">LIC.</span>
                                       <span className="font-bold text-luxury-black/80 block">
                                          €{(
                                             (item.result.phasesBreakdown || [])
                                                .filter(p => ['A0', 'A1', 'A2'].some(id => p.phaseId.startsWith(id)))
                                                .reduce((acc, p) => acc + (p.value || 0), 0)
                                          ).toLocaleString()}
                                       </span>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                       <span className="block uppercase font-black opacity-60 text-luxury-gold text-[8px] tracking-tight">EXEC.</span>
                                       <span className="font-bold text-luxury-black/80 block">
                                          €{(
                                             (item.result.phasesBreakdown || [])
                                                .filter(p => ['A3', 'A4'].some(id => p.phaseId.startsWith(id)))
                                                .reduce((acc, p) => acc + (p.value || 0), 0)
                                          ).toLocaleString()}
                                       </span>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-6">
                                 <div>
                                    <p className="text-[9px] uppercase font-black opacity-30 border-b border-luxury-black/10 pb-1 mb-2">Entregaveis</p>
                                    <ul className="space-y-2">
                                       {item.pack?.deliverablesPT?.slice(0, 5).map((d: string, i: number) => (
                                          <li key={i} className="text-[10px] font-light leading-tight opacity-70 flex items-start gap-2">
                                             <span className="text-luxury-gold mt-1">●</span> {d}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-luxury-black/5">
                                    <div>
                                       <p className="text-[9px] uppercase font-black opacity-30">Revisoes</p>
                                       <p className="text-sm font-serif">{item.pack?.revisionsIncluded || 2}</p>
                                    </div>
                                    <div>
                                       <p className="text-[9px] uppercase font-black opacity-30">Esforco</p>
                                       <p className="text-sm font-serif">{Math.round(item.result.effortMap?.reduce((acc: number, c: { hours: number }) => acc + c.hours, 0) || 0)}h</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )
            }

            {/* QUEBRA DE PAGINA PARA ANEXO TECNICO */}
            {
               includeAnnex && (
                  <div className="page-break" style={{ pageBreakBefore: 'always', marginTop: '4rem' }}>
                     <header className="flex justify-between items-start border-b border-luxury-black pb-8 mb-16">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em]">Anexo Tecnico de Validacao</h3>
                        <p className="text-[11px] font-mono opacity-50">REF: {data.internalRef} / ANEXO</p>
                     </header>

                     <div className="space-y-16">
                        {/* Memoria Descritiva das Fases */}
                        <section className="space-y-8">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">1. Detalhe do Ambito por Fase</h3>
                           <div className="grid grid-cols-1 gap-12">
                              {(data.phases || []).map((p, i) => {
                                 // Mapeamento de descrições expandidas por fase
                                 const phaseDetails: Record<string, { deliverables: string[], processes: string[], result: string }> = {
                                    'A0': {
                                       deliverables: [
                                          'Levantamento completo de requisitos funcionais e espaciais',
                                          'Analise de condicionantes legais e urbanisticas (PDM, RJUE)',
                                          'Estudo de viabilidade construtiva e volumetrica',
                                          'Programa preliminar de areas e compartimentacao',
                                          'Analise de referencias e benchmark de mercado'
                                       ],
                                       processes: [
                                          'Reunioes de briefing com o cliente (2-3 sessoes)',
                                          'Visita tecnica ao local e analise contextual',
                                          'Consulta preliminar de certidoes e plantas de localizacao',
                                          'Validacao de objetivos e expectativas do investimento'
                                       ],
                                       result: 'Documento de Programa Base aprovado pelo cliente, servindo como fundacao estrategica para todas as fases subsequentes.'
                                    },
                                    'A1': {
                                       deliverables: [
                                          'Plantas de implantacao e localizacao',
                                          'Plantas de todos os pisos (escala 1:100 ou 1:200)',
                                          'Alcados principais e cortes esquematicos',
                                          'Perspetivas 3D ou maquetes volumetricas',
                                          'Memoria descritiva e justificativa',
                                          'Quadro de areas por tipologia/funcao'
                                       ],
                                       processes: [
                                          'Desenvolvimento de 2-3 alternativas conceptuais',
                                          'Estudos de insolacao e orientacao solar',
                                          'Analise de acessos e circulacoes',
                                          'Apresentacao ao cliente e recolha de feedback',
                                          'Refinamento da solucao escolhida (ate 2 revisoes)'
                                       ],
                                       result: 'Estudo Previo aprovado pelo cliente, definindo a volumetria, organizacao funcional e linguagem arquitetonica do projeto.'
                                    },
                                    'A2': {
                                       deliverables: [
                                          'Pecas desenhadas completas (plantas, alcados, cortes - 1:100)',
                                          'Planta de implantacao georreferenciada',
                                          'Memoria descritiva e justificativa tecnica',
                                          'Fichas tecnicas de habitacao (se aplicavel)',
                                          'Projetos de especialidades coordenados (Estruturas, Aguas, Eletricidade, AVAC)',
                                          'Termos de responsabilidade de todas as disciplinas'
                                       ],
                                       processes: [
                                          'Compatibilizacao 3D entre todas as especialidades',
                                          'Verificacao de conformidade legal (RJUE, RGEU, Simplex)',
                                          'Preparacao de formularios e requerimentos',
                                          'Submissao digital na plataforma municipal',
                                          'Acompanhamento processual e resposta a pedidos de esclarecimento'
                                       ],
                                       result: 'Processo de licenciamento submetido e aprovado pela Camara Municipal, com alvara de licenca de construcao emitido.'
                                    },
                                    'A3': {
                                       deliverables: [
                                          'Pecas desenhadas de execucao (escala 1:50 e 1:20)',
                                          'Plantas de acabamentos e revestimentos',
                                          'Detalhes construtivos (pormenores 1:10, 1:5, 1:2)',
                                          'Plantas de carpintarias (portas, janelas, armarios)',
                                          'Especificacoes tecnicas de materiais e acabamentos',
                                          'Caderno de encargos tecnico completo'
                                       ],
                                       processes: [
                                          'Compatibilizacao 3D final (BIM clash detection)',
                                          'Coordenacao interdisciplinar semanal',
                                          'Validacao de solucoes construtivas com fornecedores',
                                          'Otimizacao de custos e alternativas tecnicas',
                                          'Revisao tecnica por coordenador de projeto'
                                       ],
                                       result: 'Projeto de Execucao completo e coordenado, pronto para consulta de empreiteiros e construcao sem ambiguidades.'
                                    },
                                    'A4': {
                                       deliverables: [
                                          'Esclarecimentos tecnicos por escrito',
                                          'Relatorios de visitas a obra (5 visitas incluidas)',
                                          'Pareceres sobre materiais e solucoes alternativas',
                                          'Desenhos de alteracoes pontuais (se necessario)',
                                          'Validacao de amostras de acabamentos',
                                          'Telas finais (as-built) do projeto executado'
                                       ],
                                       processes: [
                                          'Reunioes de esclarecimento com empreiteiro',
                                          'Visitas tecnicas periodicas a obra',
                                          'Analise de RFIs (Request for Information)',
                                          'Validacao de materiais e fornecedores',
                                          'Suporte tecnico remoto (email/telefone)'
                                       ],
                                       result: 'Obra executada em conformidade com o projeto aprovado, com registo documental de todas as decisoes tecnicas.'
                                    }
                                 };

                                 const phaseId = p?.label?.split('.')[0] || '';
                                 const details = phaseDetails[phaseId];

                                 return (
                                    <div key={i} className="flex gap-6">
                                       <div className="w-12 h-12 rounded-full border border-luxury-black/10 flex items-center justify-center shrink-0">
                                          <span className="font-serif italic text-lg text-luxury-gold">{i + 1}</span>
                                       </div>
                                       <div className="flex-1 space-y-6">
                                          <div>
                                             <h4 className="text-xs font-black uppercase tracking-widest mb-2">{p?.label || 'Fase'}</h4>
                                             <p className="text-xs font-light italic opacity-60 leading-relaxed">{p?.description || ''}</p>
                                          </div>

                                          {details && (
                                             <>
                                                {/* Entregaveis */}
                                                <div className="bg-luxury-black/[0.02] rounded-xl p-6 border border-luxury-black/5">
                                                   <h5 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-3">📦 Entregaveis</h5>
                                                   <ul className="space-y-2">
                                                      {details.deliverables.map((item, idx) => (
                                                         <li key={idx} className="text-[11px] font-light leading-relaxed opacity-70 flex items-start gap-2">
                                                            <span className="text-luxury-gold mt-0.5">•</span>
                                                            <span>{item}</span>
                                                         </li>
                                                      ))}
                                                   </ul>
                                                </div>

                                                {/* Processos */}
                                                <div className="bg-luxury-black/[0.02] rounded-xl p-6 border border-luxury-black/5">
                                                   <h5 className="text-[10px] font-black uppercase tracking-widest text-luxury-black/60 mb-3">⚙️ Processos</h5>
                                                   <ul className="space-y-2">
                                                      {details.processes.map((item, idx) => (
                                                         <li key={idx} className="text-[11px] font-light leading-relaxed opacity-70 flex items-start gap-2">
                                                            <span className="text-luxury-black/40 mt-0.5">▸</span>
                                                            <span>{item}</span>
                                                         </li>
                                                      ))}
                                                   </ul>
                                                </div>

                                                {/* Resultado Final */}
                                                <div className="border-l-2 border-luxury-gold pl-4">
                                                   <h5 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-2">✅ Resultado Final</h5>
                                                   <p className="text-[11px] font-light italic opacity-70 leading-relaxed">{details.result}</p>
                                                </div>
                                             </>
                                          )}
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </section>

                        {/* Especialidades Integradas */}
                        <section className="space-y-6">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-luxury-black/5 pb-3">2. Disciplinas Tecnicas Coordenadas</h3>
                           <div className="grid grid-cols-3 gap-4 text-[11px] font-light italic opacity-60">
                              {(data.activeSpecs || []).map((specId, i) => {
                                 const spec = disciplines.find(d => d.disciplineId === specId);
                                 return (
                                    <div key={i} className="flex gap-2 items-center">
                                       <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                                       <span>{spec?.labelPT || specId}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        </section>

                        {/* Mapa de Esforco Tecnico (DO PASSO 3) */}
                        <section className="space-y-8">
                           <div className="flex justify-between items-end border-b border-luxury-black/5 pb-3">
                              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">3. Mapa de Esforco Tecnico</h3>
                              <p className="text-[10px] font-mono opacity-40">Estimativa baseada em benchmarks internos</p>
                           </div>
                           <div className="overflow-hidden rounded-2xl border border-luxury-black/10">
                              <table className="w-full text-left text-[11px]">
                                 <thead className="bg-luxury-black/[0.02]">
                                    <tr>
                                       <th className="px-6 py-4 font-black uppercase tracking-[0.1em]">Fase</th>
                                       <th className="px-6 py-4 font-black uppercase tracking-[0.1em]">Esforco (h)</th>
                                       <th className="px-6 py-4 font-black uppercase tracking-[0.1em]">Responsabilidade</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-luxury-black/5">
                                    {(data.effortMap || []).map((eff, i) => (
                                       <tr key={i} className="font-light italic">
                                          <td className="px-6 py-3 opacity-70">{eff?.label || ''}</td>
                                          <td className="px-6 py-3 font-mono">{eff?.hours || 0} h</td>
                                          <td className="px-6 py-3 opacity-40 text-[10px]">{eff?.profile || ''}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </section>

                        {/* Notas Finais / Condicoes */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[11px]">
                           <div className="space-y-4">
                              <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2 text-luxury-gold">Faturacao e Pagamentos</h4>
                              <ul className="space-y-2 text-[11px] font-light italic opacity-60">
                                 <li>Adjudicacao: 20% do valor global de honorarios.</li>
                                 <li>Restantes 80%: Faturacao mensal conforme progresso das fases.</li>
                                 <li>IVA nao incluido nos valores base (taxa legal em vigor).</li>
                              </ul>
                           </div>
                           <div className="space-y-4">
                              <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Suporte Camarario (RJUE)</h4>
                              <p className="text-[11px] font-light italic opacity-60 leading-relaxed">
                                 A presente proposta garante conformidade com o <b>Decreto-Lei 10/2024 (Simplex)</b>. A responsabilidade tecnica inclui submissao e acompanhamento processual ate decisao final.
                              </p>
                           </div>
                        </section>
                     </div>
                  </div>
               )
            }

            {/* Anexo Tecnico (Passo 9) */}
            {
               includeAnnex && (
                  <div className="mt-20 pt-10 border-t border-black/10 page-break pb-10">
                     <h3 className="text-xl font-serif italic mb-6">III. Ambito Tecnico por Especialidade</h3>
                     <p className="text-[11px] opacity-60 mb-8 italic uppercase tracking-widest leading-relaxed">
                        Detalhamento dos servicos de engenharia integrados na proposta,
                        assegurando a conformidade normativa e a coordenacao interdisciplinar.
                     </p>

                     <div className="space-y-10">
                        {data.selectedSpecs?.map((specId: string) => {
                           const spec = disciplines.find(d => d.disciplineId === specId);
                           if (!spec || !spec.phases) return null;

                           return (
                              <div key={specId} className="space-y-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest">{spec.labelPT}</h4>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4 ml-4">
                                    {spec.phases.map((ph) => (
                                       <div key={ph.phaseId} className="space-y-1">
                                          <p className="text-[10px] font-bold uppercase opacity-80">
                                             {ph.phaseId} — {ph.labelPT}
                                          </p>
                                          <p className="text-[11px] font-light italic leading-relaxed opacity-60">
                                             {ph.shortPT}
                                          </p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           );
                        })}
                     </div>


                  </div>
               )
            }

            {/* Rodape Documento */}
            <footer className="mt-24 pt-12 border-t border-luxury-black/10 flex justify-between items-end">
               <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Jose Miguel Rebelo Ferreira, Arquitetos</p>
               </div>
               <div className="text-right text-[10px] opacity-50 font-light italic">
                  FERREIRARQUITETOS • Aveiro • https://ferreira-arquitetos.pt/
               </div>
            </footer>

            {/* Pág. Final: CONTRA-CAPA */}
            <div className="w-full h-[1123px] relative page-break-before-always p-0 bg-white flex flex-col items-center justify-center">
               <div className="w-[90%] h-[90%] relative overflow-hidden">
                  <img src="/assets/cover-back.jpg" alt="Contra-Capa" className="w-full h-full object-contain" />
               </div>
            </div>
         </div>
      </>
   );
}
