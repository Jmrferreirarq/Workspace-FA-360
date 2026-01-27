
import React from 'react';
// Heartbeat 2.0 - Final Build Fix
import BrandLogo from './common/BrandLogo';
import { exclusionsPT, extrasPT, disciplines } from '../services/feeData';
import { ShieldCheck, MapPin } from 'lucide-react';

interface ProposalDocumentProps {
   data: {
      templateName: string;
      clientName: string;
      projectName: string;
      location: string;
      internalRef: string;
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
      phases: any[];
      effortMap: any[];
      units: any;
   };
   includeAnnex: boolean;
}

export default function ProposalDocument({ data, includeAnnex }: ProposalDocumentProps) {
   const today = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });

   return (
      <>
         <style>{`
        @media print {
          body * { visibility: hidden; }
          .proposal-to-print, .proposal-to-print * { visibility: visible; }
          .proposal-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break { page-break-before: always; }
          @page { margin: 0; }
        }
      `}</style>
         <div className="proposal-to-print bg-white text-luxury-black p-8 md:p-24 shadow-2xl min-h-[1100px] w-full max-w-[900px] mx-auto flex flex-col font-sans border border-luxury-black/5">
            {/* Estacionario Premium */}
            <header className="flex justify-between items-start border-b-2 border-luxury-black pb-12 mb-20">
               <BrandLogo animated={false} size={35} withIcon={true} />
               <div className="text-right">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">Honorarios Profissionais</p>
                  <p className="text-xs font-mono mt-2 tracking-tighter">REF: {data.internalRef}</p>
                  <p className="text-xs font-mono opacity-50">{today}</p>
               </div>
            </header>

            {/* Identificacao do Projeto */}
            {/* PAGINA 1: PROPOSTA EXECUTIVA */}
            <div className="flex-1 space-y-16">
               {/* 2. Enquadramento */}
               <section className="space-y-4">
                  <p className="text-xs font-light italic leading-relaxed opacity-60 text-luxury-black">
                     A presente proposta refere-se A  prestacao de servicos de arquitetura para o desenvolvimento do projeto identificado,
                     incluindo as fases e disciplinas necessarias para garantir um processo tecnicamente consistente e conforme o RJUE.
                  </p>
               </section>

               {/* 3. Modo de Decisao & A‚mbito */}
               <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 text-luxury-purple">
                        <span className="w-8 h-[1px] bg-luxury-purple opacity-30"></span>
                        <p className="text-[11px] font-black uppercase tracking-widest">NA­vel de Decisao</p>
                     </div>
                     <div className="bg-luxury-black/5 p-8 rounded-[2rem] border border-luxury-black/5">
                        <h4 className="text-sm font-black uppercase tracking-widest mb-2 text-luxury-black">
                           {data.scenario === 'essential' ? 'ðŸ¥ˆ Modo Essencial' : data.scenario === 'standard' ? 'ðŸ¥‡ Modo Profissional' : 'ðŸ’Ž Modo Executivo'}
                        </h4>
                        <p className="text-[11px] font-light italic opacity-60">
                           {data.scenario === 'essential' ? 'Cumprir a lei e avancar com seguranca.' :
                              data.scenario === 'standard' ? 'Projeto solido, decisoes claras, menos surpresas.' :
                                 'Controlo total. Zero improviso.'}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-4 text-luxury-gold">
                        <span className="w-8 h-[1px] bg-luxury-gold opacity-30"></span>
                        <p className="text-[11px] font-black uppercase tracking-widest">A‚mbito do Servico</p>
                     </div>
                     <ul className="space-y-3 px-2">
                        {(data.phases || []).map((p, i) => (
                           <li key={i} className="flex items-center gap-3 text-xs font-medium italic opacity-70">
                              <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                              {p?.label || 'Fase'}
                           </li>
                        ))}
                     </ul>
                  </div>
               </section>

               {/* 5. Valor Global */}
               <section className="py-12 border-y-2 border-luxury-black flex flex-col items-center justify-center space-y-4 bg-luxury-black/[0.02]">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Investimento Global Refletido</p>
                  <h3 className="text-7xl font-serif italic tracking-tighter text-luxury-black">
                     a‚¬{data.feeTotal.toLocaleString()}<span className="text-2xl font-sans not-italic text-luxury-gold ml-2">+ IVA</span>
                  </h3>
                  <p className="text-[10px] font-mono opacity-40 italic">Calculo baseado na complexidade e ambito tecnico definidos.</p>
               </section>

               {/* 6. Prazo e Exclusoes */}
               <section className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[11px]">
                  <div className="space-y-4">
                     <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Prazo de Execucao</h4>
                     <p className="italic opacity-60 font-light leading-relaxed">
                        Prazos estimados de execucao tecnica: {data.scenario === 'premium' ? '18 a 24' : '10 a 14'} semanas
                        (sujeito a alteracoes por parte de entidades externas e aprovacoes camararias).
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Exclusoes de Suporte</h4>
                     <ul className="space-y-2 opacity-50 italic font-light">
                        <li>a€¢ Taxas camararias e licenciamento de entidades externas.</li>
                        <li>a€¢ Estudos geotecnicos, topograficos e levantamentos previos.</li>
                        <li>a€¢ Alteracoes substanciais ao programa aprovado nesta fase.</li>
                     </ul>
                  </div>
               </section>

               {/* 8. Call to Action */}
               <section className="pt-12 border-t border-luxury-black/5">
                  <div className="flex flex-col items-center py-10 bg-luxury-black text-white rounded-[3rem] space-y-6 shadow-xl">
                     <p className="text-[11px] font-black uppercase tracking-[0.3em]">Instrucoes de Adjudicacao</p>
                     <p className="text-xs font-light italic max-w-md text-center opacity-60">Para avancar, confirme por escrito a adjudicacao e proceda ao pagamento do sinal de processamento indicado nas condicoes financeiras.</p>
                     <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest border border-white/20 px-8 py-3 rounded-full">
                        <ShieldCheck size={14} className="text-luxury-gold" />
                        Pronto para Adjudicar
                     </div>
                  </div>
                  <p className="text-[10px] text-center mt-6 italic opacity-40">
                     a€œA presente proposta reflete uma abordagem tecnica responsavel, orientada para a reducao de risco, controlo de custos e fluidez do processo ate A  aprovacao.a€
                  </p>
               </section>
            </div>

            {/* QUEBRA DE PAGINA PARA ANEXO TA‰CNICO */}
            {includeAnnex && (
               <div className="page-break" style={{ pageBreakBefore: 'always', marginTop: '4rem' }}>
                  <header className="flex justify-between items-start border-b border-luxury-black pb-8 mb-16">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em]">Anexo Tecnico de Validacao</h3>
                     <p className="text-[11px] font-mono opacity-50">REF: {data.internalRef} / ANEXO</p>
                  </header>

                  <div className="space-y-16">
                     {/* Memoria Descritiva das Fases */}
                     <section className="space-y-8">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8">1. Detalhe do A‚mbito por Fase</h3>
                        <div className="grid grid-cols-1 gap-8">
                           {(data.phases || []).map((p, i) => (
                              <div key={i} className="flex gap-10">
                                 <div className="w-12 h-12 rounded-full border border-luxury-black/10 flex items-center justify-center shrink-0">
                                    <span className="font-serif italic text-lg text-luxury-gold">{i + 1}</span>
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest">{p?.label || 'Fase'}</h4>
                                    <p className="text-xs font-light italic opacity-60 leading-relaxed">{p?.description || ''}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Especialidades Integradas */}
                     <section className="space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-luxury-black/5 pb-3">2. Disciplinas Tecnicas Coordenadas</h3>
                        <div className="grid grid-cols-3 gap-4 text-[11px] font-light italic opacity-60">
                           {(data.activeSpecs || []).map((s, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                 <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                                 <span>{s}</span>
                              </div>
                           ))}
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
                                       <td className="px-6 py-3 font-mono">a‰ˆ{eff?.hours || 0} h</td>
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
                           <ul className="space-y-2 opacity-60 italic font-light list-disc px-4">
                              <li>Adjudicacao: 20% do valor global de honorarios.</li>
                              <li>Entrega de fase: Pagamento integral do valor da respetiva fase.</li>
                              <li>IVA nao incluA­do nos valores base (taxa legal em vigor).</li>
                           </ul>
                        </div>
                        <div className="space-y-4">
                           <h4 className="font-black uppercase tracking-widest border-b border-luxury-black/5 pb-2">Suporte Camarario (RJUE)</h4>
                           <p className="italic opacity-60 font-light leading-relaxed">
                              A presente proposta garante conformidade com o <b>Decreto-Lei 10/2024 (Simplex)</b>. A responsabilidade tecnica inclui submissao e acompanhamento processual ate decisao final.
                           </p>
                        </div>
                     </section>
                  </div>
               </div>
            )}

            {/* Anexo Tecnico (Passo 9) */}
            {includeAnnex && (
               <div className="mt-20 pt-10 border-t border-black/10 page-break pb-10">
                  <h3 className="text-xl font-serif italic mb-6">III. A‚mbito Tecnico por Especialidade</h3>
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
                                          {ph.phaseId} a€” {ph.labelPT}
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

                  <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                     <p className="text-[10px] font-light italic opacity-60 leading-relaxed">
                        Nota: Todas as especialidades sao coordenadas pela Ferreira Arquitetos (Gestao BIM/Design Management),
                        garantindo a compatibilizacao tridimensional e a reducao de erros em fase de obra.
                     </p>
                  </div>
               </div>
            )}

            {/* Rodape Documento */}
            <footer className="mt-24 pt-12 border-t border-luxury-black/10 flex justify-between items-end">
               <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Miguel Ferreira, Lead Architect</p>
                  <div className="w-48 h-[1px] bg-luxury-black/10 mb-4"></div>
                  <p className="text-[11px] font-serif italic opacity-60">Validado pela Antigravity Engine</p>
               </div>
               <div className="text-right text-xs opacity-50 font-black uppercase tracking-[0.3em] max-w-[300px] leading-loose italic">
                  Atelier Lisboa a€¢ Estoril a€¢ Dubai<br />www.ferreiraarq.pt
               </div>
            </footer>
         </div>
      </>
   );
}

interface DocInfoBoxProps {
   label: string;
   value: string;
}

function DocInfoBox({ label, value }: DocInfoBoxProps) {
   return (
      <div className="space-y-2">
         <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50">{label}</p>
         <p className="text-xl font-serif italic text-luxury-black tracking-tight">{value}</p>
      </div>
   );
}
