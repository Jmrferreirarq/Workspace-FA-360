
import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  ShieldAlert,
  Zap,
  Info,
  Layers,
  ChevronDown,
  X,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Scale,
  ShieldCheck,
  Calculator,
  Box,
  Layout,
  Star,
  MapPin,
  User,
  Brain,
  Loader2,
  Search,
  Clock,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates, disciplines, templateSpecialties, phaseCatalog } from '../services/feeData';
import { calculateFees } from '../services/feeCalculator';
import { Complexity, Scenario, CalculationParams } from '../types';
import ProposalDocument from './ProposalDocument';
import fa360 from '../services/fa360';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { automationBridgeService } from '../services/automationBridge.service';
import { exportEngineService } from '../services/exportEngine.service';

const useQuery = () => new URLSearchParams(useLocation().search);

export default function ProposalGenerator({ isOpen }: { isOpen: boolean }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Dados de Identidade
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [internalRef, setInternalRef] = useState(`FA-2026-${Math.floor(Math.random() * 900) + 100}`);

  const query = useQuery();

  useEffect(() => {
    const qTemplate = query.get('templateId');
    const qClient = query.get('client');
    const qLocation = query.get('location');
    const qProject = query.get('project');

    if (qTemplate) setSelectedTemplate(qTemplate);
    if (qClient) setClientName(qClient);
    if (qLocation) setLocation(qLocation);
    if (qProject) setProjectName(qProject);
  }, []);

  // Configurações Técnicas
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].templateId);
  const [area, setArea] = useState(0);
  const [complexity, setComplexity] = useState<Complexity>(1);
  const [activeSpecs, setActiveSpecs] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<any>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [strategy, setStrategy] = useState<'integrated' | 'phased'>('integrated');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('standard');
  const [isPropagating, setIsPropagating] = useState(false);
  const [showJustification, setShowJustification] = useState(true);
  const [includeAnnex, setIncludeAnnex] = useState(true);

  // Unidades (Passo 9)
  const [units, setUnits] = useState({
    apartments: 0,
    lots: 0,
    rooms: 0
  });

  // Auto-seleção de obrigatórias
  useMemo(() => {
    const required = templateSpecialties
      .filter(ts => ts.templateId === selectedTemplate && ts.required)
      .map(ts => ts.disciplineId);

    setActiveSpecs(prev => Array.from(new Set([...prev, ...required])));
  }, [selectedTemplate]);

  const currentTemplate = useMemo(() => templates.find(t => t.templateId === selectedTemplate), [selectedTemplate]);

  // Simulação de cenários
  const scenariosResults = useMemo(() => {
    return {
      essential: calculateFees({
        templateId: selectedTemplate,
        area,
        complexity,
        scenario: 'essential',
        selectedSpecs: activeSpecs,
        units,
        discount: { type: 'none', value: 0 }
      }),
      standard: calculateFees({
        templateId: selectedTemplate,
        area,
        complexity,
        scenario: 'standard',
        selectedSpecs: activeSpecs,
        units,
        discount: { type: 'none', value: 0 }
      }),
      premium: calculateFees({
        templateId: selectedTemplate,
        area,
        complexity,
        scenario: 'premium',
        selectedSpecs: activeSpecs,
        units,
        discount: { type: 'none', value: 0 }
      }),
    };
  }, [selectedTemplate, area, complexity, activeSpecs, units]);

  const currentResult = useMemo(() => {
    return calculateFees({
      templateId: selectedTemplate,
      area,
      complexity,
      scenario: selectedScenario,
      selectedSpecs: activeSpecs,
      units,
      discount: { type: discountType, value: discountValue },
      clientName,
      location
    });
  }, [selectedTemplate, area, complexity, activeSpecs, selectedScenario, units, discountType, discountValue, clientName, location]);

  // Compliance (Passo 8)
  const compliance = useMemo(() => {
    const issues: string[] = [];
    if (!currentResult) return issues;

    const requiredSpecs = templateSpecialties.filter(ts => ts.templateId === selectedTemplate && ts.required);
    requiredSpecs.forEach(rs => {
      if (!activeSpecs.includes(rs.disciplineId)) {
        const specName = disciplines.find(d => d.disciplineId === rs.disciplineId)?.labelPT;
        issues.push(`Falta: ${specName} (Obrigatória RJUE)`);
      }
    });

    if (!clientName) issues.push("Identificação do Cliente pendente.");
    if (currentResult.meta.appliedDiscount > 12) issues.push("Desconto exige aprovação da gerência.");
    if (currentResult.strategic.isBlocked) issues.push("BLOQUEIO: Margem insuficiente para emissão.");

    return issues;
  }, [selectedTemplate, activeSpecs, clientName, currentResult]);

  const [riskResult, setRiskResult] = useState<any>(null);

  const handlePropagate = async () => {
    if (compliance.length > 0 && !clientName) return;
    setIsPropagating(true);

    fa360.log(`ACTION: Iniciando análise de risco IA para proposta #${internalRef}`);

    const proposalData = {
      ref: internalRef,
      client: clientName,
      project: projectName,
      location,
      area,
      total: currentResult?.feeTotal,
      scenario: selectedScenario,
      timestamp: new Date().toISOString(),
      disciplines: activeSpecs.length
    };

    // Auditoria de Risco IA
    const risk = await geminiService.verifyProposalRisk(proposalData);
    setRiskResult(risk);

    if (risk.riskLevel === 'high') {
      fa360.log(`WARNING: Risco ELEVADO detetado: ${risk.observation}`);
    }

    const result = await fa360.saveProposal({ ...proposalData, risk });

    setIsPropagating(false);

    if (result.success) {
      fa360.log(`SUCCESS: Proposta #${internalRef} registada no Antigravity Brain.`);
      alert("Proposta propagada com sucesso para o Neural Brain (Sheets).");
    } else if (result.status === 'no_hook') {
      alert("Aviso: Proposta guardada localmente. Configure o Neural Link no painel Antigravity para sincronização global.");
    }
  };

  const handleAutomation = async (level: 1 | 2 | 3) => {
    if (!currentResult?.automationPayload) return;
    setIsPropagating(true);
    try {
      let htmlContent = '';
      if (level >= 2) {
        htmlContent = exportEngineService.exportHTMLString('proposal-capture-zone', clientName) || '';
      }

      const run = await automationBridgeService.execute(currentResult.automationPayload, level, 'CEO', htmlContent);
      
      fa360.log(`AUTO: Execução Nível ${level} concluída com sucesso. Projeto: ${run.createdIds.projectId}`);
      
      // Delay for effect and then navigate
      setTimeout(() => {
        navigate(`/projects/${run.createdIds.projectId}`);
      }, 1000);
    } catch (err) {
      fa360.log("ERROR: Falha na automação operacional.");
    } finally {
      setIsPropagating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Esquerda: Configuração */}
      <div className="lg:col-span-7 space-y-8">

        {/* Bloco 1: Identidade da Proposta */}
        <div className="glass p-10 md:p-14 rounded-[2rem] border-black/5 dark:border-white/5 space-y-10 shadow-2xl relative overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
          <header className="flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
            <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-2xl"><User size={20} /></div>
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Identificação do Proponente</h3>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_client_name')}</label>
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ex: João Silva ou Empresa X"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_project_name')}</label>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="Ex: Villa Alentejo"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_location')}</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-luxury-gold opacity-60" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Lisboa, Estoril, etc..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_ref')}</label>
              <input
                value={internalRef}
                onChange={e => setInternalRef(e.target.value)}
                className="w-full bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-gold font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Parâmetros Técnicos */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-12 shadow-2xl relative overflow-hidden">
          <header className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-8">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-2xl"><Calculator size={20} /></div>
              <h2 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Configurador RJUE</h2>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${compliance.length === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              <ShieldCheck size={12} /> {compliance.length === 0 ? 'Compliance OK' : 'Verificar Erros'}
            </div>
          </header>

          {/* Passo 2: Modos de Decisão */}
          <div className="space-y-6">
            <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Modo de Decisão / Nível de Controlo</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'essential', label: 'Essencial', icon: <ShieldAlert size={18} />, colorClass: 'emerald', desc: 'Cumprir a lei e avançar com segurança.' },
                { id: 'standard', label: 'Profissional', icon: <ShieldCheck size={18} />, colorClass: 'blue', desc: 'Projeto sólido, decisões claras, menos surpresas.' },
                { id: 'premium', label: 'Executivo', icon: <Zap size={18} />, colorClass: 'purple', desc: 'Controlo total. Zero improviso.' }
              ].map(m => {
                const isActive = selectedScenario === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedScenario(m.id as any)}
                    className={`
                        p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group
                        ${isActive
                        ? m.id === 'essential' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-2xl' :
                          m.id === 'standard' ? 'bg-blue-500/10 border-blue-500/50 shadow-2xl' :
                            'bg-purple-500/10 border-purple-500/50 shadow-2xl'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-luxury-gold/30 dark:hover:border-white/20'
                      }
                      `}
                  >
                    <div className={`
                        p-3 rounded-xl mb-4 w-fit transition-colors
                        ${isActive
                        ? m.id === 'essential' ? 'bg-emerald-500 text-white' :
                          m.id === 'standard' ? 'bg-blue-500 text-white' :
                            'bg-purple-500 text-white'
                        : 'bg-black/5 dark:bg-white/5 text-luxury-charcoal/20 dark:text-white/40'}
                      `}>
                      {m.icon}
                    </div>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-2 ${isActive ? 'text-luxury-charcoal dark:text-white' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>
                      {m.label}
                    </h4>
                    <p className={`text-[10px] leading-relaxed italic ${isActive ? 'text-luxury-charcoal/80 dark:text-white/80' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>
                      {m.desc}
                    </p>
                    {isActive && (
                      <motion.div
                        layoutId="mode-active"
                        className={`absolute inset-0 border-2 rounded-[2rem] pointer-events-none ${m.id === 'essential' ? 'border-emerald-500/30' :
                          m.id === 'standard' ? 'border-blue-500/30' :
                            'border-purple-500/30'
                          }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Tipologia de Obra</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm appearance-none outline-none focus:border-luxury-gold transition-all text-luxury-charcoal dark:text-white"
              >
                {templates.map(tmp => (
                  <option key={tmp.templateId} value={tmp.templateId} className="bg-white dark:bg-luxury-black text-luxury-charcoal dark:text-white">{tmp.namePT}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">Área Bruta (m²)</label>
                <span className="text-sm font-mono text-luxury-gold">{area} m²</span>
              </div>
              <input type="range" min="10" max="2500" step="5" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full accent-luxury-gold h-1.5" />
            </div>

            {/* Unidades Dinâmicas (Passo 9) */}
            {currentTemplate?.pricingModel === 'UNIT' && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5 dark:border-white/5">
                {currentTemplate.unitPricing?.unitKind === 'APARTMENT' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Nº de Frações / Apartamentos</label>
                    <input
                      type="number"
                      value={units.apartments}
                      onChange={e => setUnits(u => ({ ...u, apartments: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
                {currentTemplate.unitPricing?.unitKind === 'LOT' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Nº de Lotes / Moradias</label>
                    <input
                      type="number"
                      value={units.lots}
                      onChange={e => setUnits(u => ({ ...u, lots: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
                {currentTemplate.unitPricing?.unitKind === 'ROOM' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Nº de Quartos / Unidades</label>
                    <input
                      type="number"
                      value={units.rooms}
                      onChange={e => setUnits(u => ({ ...u, rooms: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Complexidade / Risco</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(c => (
                  <button key={c} onClick={() => setComplexity(c as Complexity)} className={`flex-1 py-4 rounded-xl text-[11px] font-black border transition-all ${complexity === c ? 'bg-luxury-gold text-black border-luxury-gold shadow-xl' : 'border-black/10 dark:border-white/10 text-luxury-charcoal/40 dark:text-white/40'}`}>
                    {c === 1 ? 'Baixa' : c === 2 ? 'Média' : 'Alta'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Estratégia Simplex</label>
              <div className="flex gap-2 p-1 bg-black/5 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                <button onClick={() => setStrategy('integrated')} className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${strategy === 'integrated' ? 'bg-black/10 dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-xl' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>Tudo Junto</button>
                <button onClick={() => setStrategy('phased')} className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${strategy === 'phased' ? 'bg-black/10 dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-xl' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>Faseado</button>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Disciplinas Técnicas</h3>
              <span className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{activeSpecs.length} Disciplinas</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {disciplines.map(d => {
                const isReq = templateSpecialties.find(ts => ts.templateId === selectedTemplate && ts.disciplineId === d.disciplineId)?.required;
                const isActive = activeSpecs.includes(d.disciplineId);
                return (
                  <button
                    key={d.disciplineId}
                    onClick={() => !isReq && setActiveSpecs(prev => prev.includes(d.disciplineId) ? prev.filter(i => i !== d.disciplineId) : [...prev, d.disciplineId])}
                    className={`p-4 rounded-2xl border text-left transition-all ${isActive ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-luxury-charcoal/20 dark:text-white/20'}`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest truncate block mb-1">{d.labelPT}</span>
                    {isReq && <span className="text-[7px] font-black uppercase opacity-60">Obrigatória</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bloco 3: Memória das Fases (Interface Live) */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-10 shadow-2xl">
          <header className="flex items-center gap-4">
            <div className="p-3 bg-black/5 dark:bg-white/5 text-luxury-gold rounded-2xl"><Box size={20} /></div>
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">Âmbito de Prestação por Fase</h3>
          </header>
          <div className="space-y-6">
            {currentResult?.phasesBreakdown.map((p: any, i: number) => (
              <div key={i} className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-3xl group hover:border-luxury-gold/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{p.label}</h4>
                  <span className="text-xs font-mono text-luxury-charcoal/60 dark:text-white/60">€{p.value.toLocaleString()}</span>
                </div>
                <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direita: Resumo Financeiro & Propagação */}
      <div className="lg:col-span-5 space-y-10">
        <div className="glass p-8 rounded-[2rem] border-luxury-gold/30 bg-luxury-gold/[0.04] space-y-12 shadow-2xl sticky top-32 overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none">
            <TrendingUp size={180} className="text-luxury-gold" />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-charcoal/60 dark:text-white/60">Investimento Estimado</p>
            <h3 className="text-7xl md:text-8xl font-serif italic tracking-tighter text-luxury-charcoal dark:text-white mt-4">
              €{currentResult?.feeTotal.toLocaleString()}
            </h3>
            <div className="flex items-center gap-3 mt-4 text-[11px] font-mono text-luxury-charcoal/60 dark:text-white/60 italic">
              <Zap size={14} /> + IVA à taxa legal (€{currentResult?.vat.toLocaleString()})
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <ResultRow label="Arquitetura (Design & Tech)" value={`€${currentResult?.feeArch.toLocaleString()}`} />
            <ResultRow label="Engenharias Integradas" value={`€${currentResult?.feeSpec.toLocaleString()}`} />

            {/* Descontos */}
            <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">Ajuste de Margem</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    className="bg-transparent text-[11px] font-black uppercase border-none outline-none text-luxury-gold cursor-pointer"
                  >
                    <option value="none" className="bg-white dark:bg-black">Preço Padrão</option>
                    <option value="replication" className="bg-white dark:bg-black">Replicação</option>
                    <option value="partnership" className="bg-white dark:bg-black">Parceria Comercial</option>
                  </select>
                </div>
                {discountType !== 'none' && <span className="text-sm font-mono text-luxury-gold">-{discountValue}%</span>}
              </div>
              {discountType !== 'none' && (
                <input type="range" min="0" max="25" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className="w-full accent-luxury-gold h-1.5" />
              )}
            </div>
          </div>

          {/* Bloco de Justificação Narrativa: "Porque este valor?" */}
          <div className="relative z-10 pt-4">
            <div className="glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden">
              <button
                onClick={() => setShowJustification(!showJustification)}
                className="w-full p-8 flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-luxury-gold/20 rounded-lg text-luxury-gold"><Search size={16} /></div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal dark:text-white">Porque este valor?</h4>
                </div>
                <ChevronDown size={18} className="text-luxury-charcoal dark:text-white transition-transform duration-500" style={{ transform: showJustification ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              <AnimatePresence>
                {showJustification && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 space-y-8 border-t border-white/5 pt-8">
                      {/* 1. Complexidade Legal */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-luxury-gold">
                          <Scale size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Complexidade Legal</span>
                        </div>
                        <p className="text-[11px] font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                          Este processo enquadra-se no <span className="text-luxury-gold opacity-100">RJUE</span> e exige a coordenação técnica de <span className="text-luxury-gold opacity-100">{activeSpecs.length} disciplinas</span> técnicas obrigatórias para aprovação municipal.
                        </p>
                      </div>

                      {/* 2. Risco Técnico */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-luxury-gold">
                          <ShieldCheck size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Risco Técnico Controlado</span>
                        </div>
                        <p className="text-[11px] font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                          O valor assegura a compatibilização tridimensional e verificação prévia, reduzindo significativamente o risco de indeferimento ou pedidos de elementos adicionais que atrasam a obra.
                        </p>
                      </div>

                      {/* 3. Esforço Técnico */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-luxury-gold">
                          <Clock size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Esforço Técnico Real</span>
                        </div>
                        <p className="text-[11px] font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                          Esta proposta corresponde a uma estimativa rigorosa de ≈<span className="text-luxury-gold opacity-100">{Math.round(currentResult?.feeTotal / 85)} horas</span> de trabalho técnico qualificado dedicadas exclusivamente à excelência do seu projeto.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Radar Estratégico Evolution (Passo 8: Precision Tuning) */}
          <div className="p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-all">
              <TrendingUp size={80} className="text-luxury-charcoal dark:text-white" />
            </div>

            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Radar Estratégico</h4>
                <p className="text-[9px] font-light italic text-luxury-charcoal/40 dark:text-white/40">Governança & Digital Twin</p>
              </div>
              <div className="flex gap-2">
                <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${currentResult.strategic.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                  currentResult.strategic.riskLevel === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                    'bg-green-500/10 border-green-500/20 text-green-500'
                  }`}>
                  {currentResult.strategic.riskLevel === 'high' ? 'Risco Elevado' : currentResult.strategic.riskLevel === 'medium' ? 'Risco Médio' : 'Risco Baixo'} ({currentResult.strategic.riskScore}/100)
                </div>
                <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${currentResult.strategic.isHealthy ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                  {currentResult.strategic.isHealthy ? 'Saudável' : 'Frágil'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Margem (Digital Twin)</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-serif italic ${currentResult.strategic.margin < 45 ? 'text-red-500' :
                    currentResult.strategic.margin < 50 ? 'text-yellow-500' :
                      'text-luxury-charcoal dark:text-white'
                    }`}>
                    {currentResult.strategic.margin}%
                  </span>
                  <span className="text-[10px] opacity-30">ROI REAL</span>
                </div>
                <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (currentResult.strategic.margin / 70) * 100)}%` }}
                    className={`h-full ${currentResult.strategic.margin < 45 ? 'bg-red-500' :
                      currentResult.strategic.margin < 50 ? 'bg-yellow-500' :
                        'bg-luxury-gold'
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Gatilho de Decisão</p>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${!currentResult.strategic.isBlocked ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {!currentResult.strategic.isBlocked ? 'Emissão Autorizada' : 'Bloqueio de Saída'}
                  </span>
                </div>
                <p className="text-[9px] font-light italic opacity-40 leading-tight">
                  {currentResult.strategic.isBlocked ? 'Recomendação: Subir para Modo Profissional ou ajustar especialidades.' :
                    currentResult.strategic.riskLevel === 'high' ? 'Configuração frágil: Reforçar exclusões técnicas.' :
                      'Operação em zona de alta segurança financeira.'}
                </p>
              </div>
            </div>

            {/* Alertas & Recomendações Críticas */}
            {(currentResult.strategic.alerts.length > 0 || currentResult.strategic.recommendations.length > 0) && (
              <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                {currentResult.strategic.alerts.map((alert, i) => (
                  <div key={`alert-${i}`} className="flex gap-3 items-start group/alert">
                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${alert.includes('BLOQUEIO') ? 'bg-red-500' :
                      alert.includes('🚩') ? 'bg-purple-500' :
                        alert.includes('⚠️') ? 'bg-yellow-500' : 'bg-luxury-gold'
                      }`}></div>
                    <p className={`text-[9px] leading-relaxed italic ${alert.includes('BLOQUEIO') ? 'text-red-400 font-bold' :
                      alert.includes('🚩') ? 'text-purple-400' :
                        alert.includes('⚠️') ? 'text-yellow-400' : 'opacity-60 text-white'
                      }`}>
                      {alert}
                    </p>
                  </div>
                ))}

                {currentResult.strategic.recommendations.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-luxury-gold opacity-60">Recomendações de Governança</p>
                    {currentResult.strategic.recommendations.map((rec, i) => (
                      <div key={`rec-${i}`} className="flex gap-2 items-center">
                        <CheckCircle2 size={10} className="text-luxury-gold opacity-40" />
                        <p className="text-[9px] italic opacity-70 text-white">{rec}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Passo 3: Mapa de Esforço Técnico */}
          <div className="relative z-10 pt-4">
            <div className="glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-[2rem] p-10 space-y-8">
              <header className="space-y-2">
                <div className="flex items-center gap-3 text-luxury-gold">
                  <Clock size={16} />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Mapa de Esforço Técnico</h4>
                </div>
                <p className="text-[10px] font-light italic text-luxury-charcoal/40 dark:text-white/40">Estimativa realista do esforço necessário para executar o projeto com qualidade e segurança.</p>
              </header>

              <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-black/5 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                      <th className="px-6 py-4">Fase</th>
                      <th className="px-6 py-4">Esforço Estimado</th>
                      <th className="px-6 py-4">Perfil Principal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {currentResult?.effortMap.map((eff: any, i: number) => (
                      <tr key={i} className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-luxury-charcoal dark:text-white font-medium italic">{eff.label}</td>
                        <td className="px-6 py-4 text-luxury-gold font-mono">~{eff.hours} h</td>
                        <td className="px-6 py-4 text-luxury-charcoal/60 dark:text-white/60">{eff.profile}</td>
                      </tr>
                    ))}
                    <tr className="bg-luxury-gold/5 font-black">
                      <td className="px-6 py-4 text-luxury-gold uppercase tracking-tighter">Total Estimado</td>
                      <td className="px-6 py-4 text-luxury-gold font-mono">
                        ~{currentResult?.effortMap.reduce((acc: number, curr: any) => acc + curr.hours, 0)} h
                      </td>
                      <td className="px-6 py-4 text-luxury-gold/40">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Equipa envolvida:</span>
                  <div className="flex gap-2">
                    {['Arquiteto Sénior', 'Arquitetos', 'Coordenação Técnica'].map((member, i) => (
                      <span key={i} className="text-[9px] px-3 py-1 bg-white/5 rounded-full text-white/60 italic">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] font-light italic opacity-40 leading-relaxed text-white">
                  “Esta estimativa reflete o esforço técnico necessário para desenvolver o projeto de forma consistente, reduzir revisões e garantir um processo fluido até à aprovação e execução.”
                </p>
              </div>
            </div>
          </div>

          {/* Passo 4: Opções de Adjudicação / PDF */}
          <div className="space-y-6 relative z-10 pt-4">
            <label className="text-[11px] font-black uppercase tracking-widest opacity-60 px-2 text-white text-white">Configuração de Saída (PDF)</label>
            <div className="flex gap-4">
              <div className="flex-1 glass bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Proposta Executiva</span>
                </div>
                <span className="text-[8px] px-2 py-1 bg-white/10 rounded uppercase font-black text-white/40">1 Pág Fixed</span>
              </div>
              <button
                onClick={() => setIncludeAnnex(!includeAnnex)}
                className={`flex-1 glass p-6 rounded-2xl flex items-center justify-between border transition-all ${includeAnnex ? 'bg-luxury-gold/10 border-luxury-gold/30' : 'bg-white/5 border-white/10 opacity-40'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${includeAnnex ? 'bg-luxury-gold' : 'bg-white/20'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${includeAnnex ? 'text-luxury-gold' : 'text-white'}`}>Anexo Técnico</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${includeAnnex ? 'bg-luxury-gold' : 'bg-white/10'}`}>
                  <motion.div animate={{ x: includeAnnex ? 22 : 2 }} className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm" />
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-6 relative z-10 pt-10 border-t border-white/5">
            <label className="text-[11px] font-black uppercase tracking-widest opacity-60 px-2 text-white">Centro de Emissão & Adjudicação</label>
            {/* Centro de Emissão (Passo 6: Governança) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowPreview(true)}
                className="col-span-1 md:col-span-2 py-7 bg-white text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-2xl flex items-center justify-center gap-4 group"
              >
                <Eye size={18} /> Visualizar & Validar Proposta
              </button>

              <button
                onClick={() => window.print()}
                disabled={currentResult.strategic.margin < 45}
                className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group relative"
              >
                {currentResult.strategic.margin < 45 ? <Lock size={16} className="text-red-500" /> : <Clock size={16} className="text-luxury-gold" />}
                Imprimir / PDF
                {currentResult.strategic.margin < 45 && (
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Margem insuficiente para emissão</span>
                )}
              </button>

              <button
                onClick={() => {
                  const content = document.getElementById('proposal-capture-zone')?.innerHTML;
                  const win = window.open('', '_blank');
                  if (win && content) {
                    win.document.write(`
                      <html>
                        <head>
                          <title>Proposta: ${projectName}</title>
                          <script src="https://cdn.tailwindcss.com"></script>
                          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:italic,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                          <style>
                            body { background: #f4f4f4; padding: 40px; display: flex; justify-content: center; }
                            .proposal-to-print { background: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
                            .font-serif { font-family: 'Cormorant Garamond', serif !important; }
                            .luxury-gold { color: #d4af37 !important; }
                            .bg-luxury-gold { background-color: #d4af37 !important; }
                            .text-luxury-black { color: #0a0a0a !important; }
                            .border-luxury-black { border-color: #0a0a0a !important; }
                            @media print { body { padding: 0; background: white; } .proposal-to-print { box-shadow: none; border: none; } }
                          </style>
                        </head>
                        <body>
                          <div class="w-full max-w-[900px]">
                            ${content}
                            <p style="text-align:center; font-family: sans-serif; font-size: 10px; opacity: 0.3; margin-top: 60px; text-transform: uppercase; letter-spacing: 2px;">
                              Documento Estratégico Ferreira Arquitetos • © 2026
                            </p>
                          </div>
                        </body>
                      </html>
                    `);
                    win.document.close();
                  }
                }}
                disabled={currentResult.strategic.margin < 45}
                className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group relative"
              >
                {currentResult.strategic.margin < 45 ? <Lock size={16} className="text-red-500" /> : <Layout size={16} className="text-luxury-gold" />}
                Web-Proposal (HTML)
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://fa360.design/proposal/${internalRef}`);
                  alert("Link HTML copiado para o clipboard!");
                }}
                className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <Layers size={16} className="text-luxury-gold" /> Partilhar Link
              </button>

              <button
                onClick={() => {
                  const subject = encodeURIComponent(`Proposta de Honorários: ${projectName} [REF: ${internalRef}]`);
                  const body = encodeURIComponent(`Olá ${clientName},\n\nConforme solicitado, enviamos a proposta para o projeto "${projectName}".\n\nPode visualizar e adjudicar aqui: https://fa360.design/proposal/${internalRef}\n\nMelhores cumprimentos,\nFerreira Arquitetos`);
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
              >
                <Zap size={16} className="group-hover:animate-pulse" /> Enviar por Email (HTML)
              </button>
            </div>
            <p className="text-[9px] text-center italic opacity-30 text-white pt-2">
              Os documentos gerados cumprem as normas de identidade premium da Ferreira Arquitetos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 relative z-10 pt-4">
            <button
              onClick={handlePropagate}
              disabled={isPropagating || !clientName}
              className="w-full py-6 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-4 disabled:opacity-20"
            >
              {isPropagating ? <Loader2 className="animate-spin" size={18} /> : <Brain size={18} />} Propagar para Antigravity
            </button>
            
            {currentResult && !currentResult.strategic.isBlocked && clientName && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAutomation(1)}
                  disabled={isPropagating}
                  className="py-4 bg-white/5 border border-white/10 text-white/70 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <Box size={14} className="group-hover:text-luxury-gold" /> Criar Projeto
                </button>
                <button
                  onClick={() => handleAutomation(2)}
                  disabled={isPropagating}
                  className="py-4 bg-luxury-gold text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/10"
                >
                  <Zap size={14} /> Projeto + Proposta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Painel de Avisos */}
        <AnimatePresence>
          {compliance.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 bg-red-500/10 border border-red-500/20 rounded-[2rem] space-y-6 shadow-xl">
              <div className="flex items-center gap-4 text-red-500">
                <AlertTriangle size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Avisos de Bloqueio</h4>
              </div>
              <ul className="space-y-3">
                {compliance.map((issue, i) => (
                  <li key={i} className="text-[10px] font-light italic opacity-70 text-white border-b border-white/5 pb-2">
                    • {issue}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Preview (Existente) */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex justify-center overflow-y-auto p-4 md:p-20"
          >
            <div className="relative w-full max-w-[900px]">
              <button
                onClick={() => setShowPreview(false)}
                className="fixed top-10 right-10 p-4 bg-white/10 text-white rounded-full hover:bg-luxury-gold hover:text-black transition-all"
              >
                <X size={24} />
              </button>
              <ProposalDocument data={{
                templateName: currentTemplate?.namePT || '',
                clientName,
                projectName,
                location,
                internalRef,
                area,
                complexity: complexity === 1 ? 'Baixa' : complexity === 2 ? 'Média' : 'Alta',
                scenario: selectedScenario === 'essential' ? 'Essencial' : selectedScenario === 'standard' ? 'Profissional' : 'Executivo',
                feeArch: currentResult?.feeArch || 0,
                feeSpec: currentResult?.feeSpec || 0,
                feeTotal: currentResult?.feeTotal || 0,
                vat: currentResult?.vat || 0,
                totalWithVat: currentResult?.totalWithVat || 0,
                activeSpecs,
                selectedSpecs: currentResult?.selectedSpecs || [],
                phases: currentResult?.phasesBreakdown || [],
                effortMap: currentResult?.effortMap || [],
                units: currentResult?.units || 'm2'
              }}
                includeAnnex={includeAnnex} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zona de Captura (Invisível) para Exportação HTML */}
      <div id="proposal-capture-zone" className="fixed -left-[2000px] -top-[2000px] pointer-events-none opacity-0">
        <ProposalDocument data={{
          templateName: currentTemplate?.namePT || '',
          clientName,
          projectName,
          location,
          internalRef,
          area,
          complexity: complexity === 1 ? 'Essencial' : complexity === 2 ? 'Médio' : 'Rigor+',
          scenario: selectedScenario,
          ...currentResult,
          activeSpecs: activeSpecs.map(id => disciplines.find(d => d.disciplineId === id)?.labelPT || id),
          phases: currentResult.phasesBreakdown,
          effortMap: currentResult.effortMap
        }} includeAnnex={includeAnnex} />
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-4">
      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 text-white">{label}</span>
      <span className="text-xl font-serif italic text-white">{value}</span>
    </div>
  );
}

