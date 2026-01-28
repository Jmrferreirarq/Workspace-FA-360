
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Zap,
  Layers,
  ChevronDown,
  X,
  Eye,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Scale,
  ShieldCheck,
  Calculator,
  Box,
  Layout,
  MapPin,
  User,
  Brain,
  Loader2,
  Search,
  Clock,
  Lock,
  StretchHorizontal,
  Star,
  Check,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates, disciplines, templateSpecialties, exclusionsPT } from '../services/feeData';
import { calculateFees } from '../services/feeCalculator';
import { Complexity, Scenario } from '../types';
import ProposalDocument from './ProposalDocument';
import fa360 from '../services/fa360';
import { geminiService } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { automationBridgeService } from '../services/automationBridge.service';
import { exportEngineService } from '../services/exportEngine.service';
import { DISCOUNT_POLICY, UserRole, DiscountType } from '../services/discountPolicy';

import { SCENARIO_OVERRIDES } from '../services/scenarioTemplates'; // NEW IMPORT
import { SCENARIO_CATALOG } from '../services/scenarioCatalog'; // Ensuring this is imported

const useQuery = () => new URLSearchParams(useLocation().search);

interface UIPhase {
  phaseId: string;
  label: string;
  labelEN?: string;
  description: string;
  descriptionEN?: string;
  weeks?: number;
  duration?: string;
  percentage?: number;
  value?: number;
}

export default function ProposalGenerator({ isOpen }: { isOpen: boolean }) {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();

  // Dados de Identidade
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState(''); // Maintains 'Municipality/City' for ref generation
  const [address, setAddress] = useState(''); // NEW: Full Address
  const [mapsLink, setMapsLink] = useState(''); // NEW: Google Maps Link
  const [internalRef, setInternalRef] = useState('');

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
  }, [query]);

  // Auto-Generate Reference
  useEffect(() => {
    // Format: FA-YYMMDD-HHMM-CLIENT-CITY (Strict Uniqueness)
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ''); // 260127
    const timeStr = date.toTimeString().slice(0, 5).replace(':', ''); // 1809

    const cleanClient = clientName
      .trim()
      .split(' ')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 5);

    const cleanLoc = location
      .trim()
      .split(',')[0] // Take first part before comma
      .trim()
      .split(' ')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 3);



    // Only update if we have valid data, otherwise keep empty
    if (clientName && location && clientName.length > 2 && location.length > 2) {
      setInternalRef(`FA-${dateStr}-${timeStr}-${cleanClient || 'CLI'}-${cleanLoc || 'LOC'}`);
    } else if (!clientName && !location) {
      // Keep empty if checking for reset
      setInternalRef('');
    }
  }, [clientName, location]);



  // Configuracoes Tecnicas
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [area, setArea] = useState(0);




  // SMART PROJECT NAMING (NEW)
  useEffect(() => {
    if (!selectedTemplate || !clientName) return;

    // Logic: Always suggest a new name when Client or Typology changes, 
    // mimicking the Internal Ref behavior requested by the user.

    // 1. Extract Name (Last word usually works best for "Casa Author", e.g. "Casa Ferreira")
    const nameParts = clientName.trim().split(' ');
    const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
    const cleanName = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();

    // 2. Define Prefix based on Template ID
    let prefix = 'Projeto';
    const tid = selectedTemplate;

    if (tid.includes('MORADIA') || tid === 'LEGAL') prefix = 'Casa';
    else if (tid === 'MULTIFAMILY') prefix = 'Edifício';
    else if (tid === 'LOTEAMENTO') prefix = 'Loteamento';
    else if (tid === 'RESTAURANT') prefix = 'Restaurante';
    else if (tid === 'RETAIL_SHOP') prefix = 'Loja';
    else if (tid === 'OFFICE_HQ') prefix = 'Sede';
    else if (tid === 'TOURISM_RURAL') prefix = 'Turismo';
    else if (tid === 'INDUSTRIAL') prefix = 'Instalação';
    else if (tid === 'INTERIOR_DESIGN') prefix = 'Interiores';

    // 3. Set Name
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('pt-PT', { month: 'short' }); // jan, fev...
    // Capitalize Month
    const monthCap = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

    const newName = `${prefix} ${cleanName} ${monthCap} ${currentYear}`;
    if (cleanName.length > 1 && projectName !== newName) {
      setProjectName(newName);
    }

  }, [selectedTemplate, clientName, projectName]);
  const [complexity, setComplexity] = useState<Complexity>(1);
  const [activeSpecs, setActiveSpecs] = useState<string[]>([]);


  // Discount Policy State
  // FIX: Default to 'diretor' to ensure simulation works freely by default
  const [userRole, setUserRole] = useState<UserRole | ''>('');
  const [discountType, setDiscountType] = useState<DiscountType>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [justification, setJustification] = useState('');

  const [strategy, setStrategy] = useState<'integrated' | 'phased'>('integrated');
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'summary' | 'document'>('summary'); // NEW: View Mode State
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('standard');
  const [isPropagating, setIsPropagating] = useState(false);
  const [showJustification, setShowJustification] = useState(true);
  const [includeAnnex, setIncludeAnnex] = useState(true);
  const [showComparator, setShowComparator] = useState(false); // NEW: Comparator State

  // --- REVERSE CALCULATOR STATE ---
  const [showReverseCalc, setShowReverseCalc] = useState(false);
  const [reverseBudget, setReverseBudget] = useState(250000);
  const [reverseQuality, setReverseQuality] = useState<'economic' | 'standard' | 'luxury'>('standard');

  const reverseResult = useMemo(() => {
    const rates = { economic: 1200, standard: 1600, luxury: 2200 };
    const rate = rates[reverseQuality];
    const area = Math.round(reverseBudget / rate);
    return { area, rate };
  }, [reverseBudget, reverseQuality]);

  // Unidades (Passo 9)
  const [units, setUnits] = useState({
    apartments: 0,
    lots: 0,
    rooms: 0
  });



  // Auto-selecao de obrigatorias
  useEffect(() => {
    if (!selectedTemplate) return;

    const required = templateSpecialties
      .filter(ts => ts.templateId === selectedTemplate && ts.required)
      .map(ts => ts.disciplineId);

    if (required.length > 0) {
      setActiveSpecs(prev => Array.from(new Set([...prev, ...required])));
    }
  }, [selectedTemplate]);

  const currentTemplate = useMemo(() => selectedTemplate ? templates.find(t => t.templateId === selectedTemplate) : null, [selectedTemplate]);


  // --- COMPARISON LOGIC (NEW) ---
  const comparisonData = useMemo(() => {
    if (!selectedTemplate) return [];

    // Safety checks
    if (!SCENARIO_CATALOG) return [];

    return (['essential', 'standard', 'premium'] as Scenario[]).map(scen => {
      const basePack = SCENARIO_CATALOG[scen];
      if (!basePack) return { scenario: scen, pack: null, result: null }; // Safety return

      // --- APPLY TYPOLOGY OVERRIDES ---
      // Map template IDs to keys in SCENARIO_OVERRIDES (e.g. 'store' -> 'retail', 'legal' -> 'legalization')
      // This mapping logic can be refined or moved to a helper.
      let typeKey = '';
      if (selectedTemplate?.toLowerCase().includes('loja') || selectedTemplate === 'retail') typeKey = 'retail';
      else if (selectedTemplate?.toLowerCase().includes('legal') || selectedTemplate === 'legal') typeKey = 'legalization';
      else if (selectedTemplate?.toLowerCase().includes('ind') || selectedTemplate === 'industrial') typeKey = 'industrial';
      else if (selectedTemplate?.toLowerCase().includes('interior') || selectedTemplate === 'interior') typeKey = 'interior';
      else if (selectedTemplate?.toLowerCase().includes('turis') || selectedTemplate === 'tourism') typeKey = 'tourism';

      const tmplOverrides = typeKey ? SCENARIO_OVERRIDES[typeKey] : null;
      const specOverride = tmplOverrides ? tmplOverrides[scen] : null;

      const mergedPack = { ...basePack, ...specOverride };

      try {
        const res = calculateFees({
          templateId: selectedTemplate,
          area: Math.max(0, area), // Ensure positive for calc
          complexity,
          scenario: scen,
          selectedSpecs: activeSpecs,
          units,
          discount: { type: discountType, value: discountValue, justification },
          userRole: (userRole || 'arquiteto') as UserRole,
          clientName,
          location
        });

        return {
          scenario: scen,
          pack: mergedPack,
          result: res
        };
      } catch (e) {
        console.warn("Error in comparison calc:", e);
        return { scenario: scen, pack: mergedPack, result: null };
      }
    });
  }, [selectedTemplate, area, complexity, activeSpecs, units, discountType, discountValue, justification, userRole, clientName, location]);

  // --- SCENARIO MERGE LOGIC ---



  const currentScenarioPack = useMemo(() => {
    const baseScenarioPack = SCENARIO_CATALOG[selectedScenario];
    const templateOverrides = selectedTemplate ? SCENARIO_OVERRIDES[selectedTemplate] : null;
    const specificOverride = templateOverrides ? templateOverrides[selectedScenario] : null;

    return {
      ...baseScenarioPack,
      ...specificOverride,
    };
  }, [selectedScenario, selectedTemplate]);

  const currentResult = useMemo(() => {
    if (!selectedTemplate) return null;

    const res = calculateFees({
      templateId: selectedTemplate,
      area,
      complexity,
      scenario: selectedScenario,
      selectedSpecs: activeSpecs,
      units,
      discount: { type: discountType, value: discountValue, justification },
      userRole: userRole || 'auto',
      clientName,
      location
    });

    if (res) {
      res.scenarioPack = {
        ...res.scenarioPack,
        ...currentScenarioPack
      };
    }
    return res;
  }, [selectedTemplate, area, complexity, activeSpecs, selectedScenario, units, discountType, discountValue, justification, userRole, clientName, location, currentScenarioPack]);


  // Compliance (Passo 8)
  const compliance = useMemo(() => {
    const issues: string[] = [];
    if (!selectedTemplate || !currentResult) return issues;

    const requiredSpecs = templateSpecialties.filter(ts => ts.templateId === selectedTemplate && ts.required);
    requiredSpecs.forEach(rs => {
      if (!activeSpecs.includes(rs.disciplineId)) {
        const specName = disciplines.find(d => d.disciplineId === rs.disciplineId)?.labelPT;
        issues.push(`Falta: ${specName} (Obrigatoria RJUE)`);
      }
    });

    if (!clientName) issues.push("Identificacao do Cliente pendente.");
    // if (currentResult?.meta?.appliedDiscount > 12) issues.push("Desconto exige aprovacao da gerencia.");
    // if (currentResult?.strategic?.isBlocked) issues.push("BLOQUEIO: Margem insuficiente para emissao.");

    return issues;
  }, [selectedTemplate, activeSpecs, clientName, currentResult]);



  const handlePropagate = async () => {
    if (compliance.length > 0 && !clientName) return;
    setIsPropagating(true);

    fa360.log(`ACTION: Iniciando analise de risco IA para proposta #${internalRef}`);

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
    // setRiskResult(risk); // Removed unused state

    if (risk.riskLevel === 'high') {
      fa360.log(`WARNING: Risco ELEVADO detetado: ${risk.observation}`);
    }

    const result = await fa360.saveProposal({ ...proposalData, risk });

    setIsPropagating(false);

    if (result.success) {
      fa360.log(`SUCCESS: Proposta #${internalRef} registada no Antigravity Brain.`);
      alert("Proposta propagada com sucesso para o Neural Brain (Sheets).");
    } else if (result.status === 'no_hook') {
      alert("Aviso: Proposta guardada localmente. Configure o Neural Link no painel Antigravity para sincronizacao global.");
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

      const run = await automationBridgeService.execute(currentResult?.automationPayload, level, 'CEO', htmlContent);

      fa360.log(`AUTO: Execucao NA­vel ${level} concluA­da com sucesso. Projeto: ${run.createdIds.projectId}`);

      // Delay for effect and then navigate
      setTimeout(() => {
        navigate(`/projects/${run.createdIds.projectId}`);
      }, 1000);
    } catch {
      fa360.log("ERROR: Falha na automacao operacional.");
    } finally {
      setIsPropagating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Esquerda: Configuracoes */}
      <div className="lg:col-span-7 space-y-8">

        {/* Bloco 1: Identidade da Proposta */}
        <div className="glass p-10 md:p-14 rounded-[2rem] border-black/5 dark:border-white/5 space-y-10 shadow-2xl relative overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
          <header className="flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
            <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-2xl"><User size={20} /></div>
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_identity_title')}</h3>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_client_name')}</label>
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ex: Joao Silva ou Empresa X"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_project_name')}</label>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="Ex: Villa Alentejo"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Localização (Concelho)</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-luxury-gold opacity-60" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ex: Lisboa, Estoril, etc..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 pl-14 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Referência Interna</label>
              <input
                value={internalRef}
                onChange={e => setInternalRef(e.target.value)}
                className="w-full bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-gold font-mono outline-none"
              />
            </div>

            {/* NEW FIELDS */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Morada do Terreno</label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ex: Rua de Baixo, n 32, 3800-123 Aveiro"
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">Link Google Maps</label>
              <input
                value={mapsLink}
                onChange={e => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm text-luxury-gold font-mono focus:border-luxury-gold outline-none transition-all placeholder:text-luxury-charcoal/30 dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        {/* Bloco: Enquadramento (Digital Twin Parity) */}
        <div className="glass p-8 md:p-10 rounded-[2rem] border-black/5 dark:border-white/5 space-y-4 shadow-sm relative overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
          <p className="text-xs font-light italic leading-relaxed opacity-60 text-luxury-charcoal dark:text-white text-justify">
            {t('calc_context_text')}
          </p>
        </div>

        {/* Bloco 2: Parametros Tecnicos */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-12 shadow-2xl relative overflow-hidden">
          <header className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-8">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-2xl"><Calculator size={20} /></div>
              <h2 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_rjue_config')}</h2>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${compliance.length === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              <ShieldCheck size={12} /> {compliance.length === 0 ? t('calc_compliance_ok') : t('calc_check_errors')}
            </div>
          </header>

          {/* Passo 2: Modos de Decisao */}
          <div className="space-y-6">
            <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_mode_decision')}</label>
            {/* Modos de Decisao (Passo 9: Scenario details) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'essential', label: t('calc_mode_essential'), icon: <ShieldAlert size={18} />, colorClass: 'emerald', desc: t('calc_mode_desc_essential'), revisions: 2 },
                { id: 'standard', label: t('calc_mode_standard'), icon: <ShieldCheck size={18} />, colorClass: 'blue', desc: t('calc_mode_desc_standard'), revisions: 3 },
                { id: 'premium', label: t('calc_mode_premium'), icon: <Zap size={18} />, colorClass: 'purple', desc: t('calc_mode_desc_premium'), revisions: 4 }
              ].map(m => {
                const isActive = selectedScenario === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedScenario(m.id as Scenario)}
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
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-luxury-charcoal dark:text-white' : 'text-luxury-charcoal/40 dark:text-white/40'}`}>
                        {m.label}
                      </h4>
                      {isActive && <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-full opacity-60 uppercase">{m.revisions} Revs</span>}
                    </div>
                    <p className={`text-xs leading-relaxed italic ${isActive ? 'text-luxury-charcoal/80 dark:text-white/80' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>
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
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_typology')}</label>
              <select
                value={selectedTemplate || ''}
                onChange={(e) => setSelectedTemplate(e.target.value || null)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm appearance-none outline-none focus:border-luxury-gold transition-all text-luxury-charcoal dark:text-white"
              >
                <option value="" disabled className="bg-white dark:bg-luxury-black text-luxury-charcoal/40 dark:text-white/40">
                  {t('calc_select_typology')}
                </option>
                {templates.map(tmp => (
                  <option key={tmp.templateId} value={tmp.templateId} className="bg-white dark:bg-luxury-black text-luxury-charcoal dark:text-white">{tmp.namePT}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{t('calc_gross_area')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    disabled={!selectedTemplate}
                    className={`w-24 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-right text-sm font-mono text-luxury-gold outline-none focus:border-luxury-gold transition-all ${!selectedTemplate ? 'opacity-30 cursor-not-allowed' : ''}`}
                  />
                  <span className="text-xs font-black text-luxury-charcoal/40 dark:text-white/40">m²</span>
                  <button
                    onClick={() => setShowReverseCalc(true)}
                    className="p-2 hover:bg-luxury-gold/10 rounded-lg text-luxury-gold transition-colors group tooltip-trigger ml-1"
                    title="Calculadora Inversa"
                  >
                    <Calculator size={16} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="2500"
                step="5"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                disabled={!selectedTemplate}
                className={`w-full accent-luxury-gold h-1.5 ${!selectedTemplate ? 'opacity-30 cursor-not-allowed' : ''}`}
              />
            </div>

            {/* Unidades Dinamicas (Passo 9) */}
            {currentTemplate?.pricingModel === 'UNIT' && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5 dark:border-white/5">
                {currentTemplate?.unitPricing?.unitKind === 'APARTMENT' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_units_apartments')}</label>
                    <input
                      type="number"
                      value={units.apartments}
                      onChange={e => setUnits(u => ({ ...u, apartments: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
                {currentTemplate?.unitPricing?.unitKind === 'LOT' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_units_lots')}</label>
                    <input
                      type="number"
                      value={units.lots}
                      onChange={e => setUnits(u => ({ ...u, lots: Number(e.target.value) }))}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold"
                    />
                  </div>
                )}
                {currentTemplate?.unitPricing?.unitKind === 'ROOM' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_units_rooms')}</label>
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
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_complexity')}</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(c => (
                  <button key={c} onClick={() => setComplexity(c as Complexity)} className={`flex-1 py-4 rounded-xl text-xs font-black border transition-all ${complexity === c ? 'bg-luxury-gold text-black border-luxury-gold shadow-xl' : 'border-black/10 dark:border-white/10 text-luxury-charcoal/40 dark:text-white/40'}`}>
                    {c === 1 ? t('calc_comp_low') : c === 2 ? t('calc_comp_med') : t('calc_comp_high')}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 px-2">{t('calc_strat_simplex')}</label>
              <div className="flex gap-2 p-1 bg-black/5 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                <button onClick={() => setStrategy('integrated')} className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${strategy === 'integrated' ? 'bg-black/10 dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-xl' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>{t('calc_strat_all')}</button>
                <button onClick={() => setStrategy('phased')} className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${strategy === 'phased' ? 'bg-black/10 dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-xl' : 'text-luxury-charcoal/20 dark:text-white/20'}`}>{t('calc_strat_phased')}</button>
              </div>
            </div>

            <div className="md:col-span-2 pt-4 flex justify-center">
              <button
                onClick={() => setShowComparator(true)}
                disabled={!selectedTemplate}
                className="flex items-center gap-2 px-6 py-3 bg-luxury-gold/10 text-luxury-gold rounded-full hover:bg-luxury-gold hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <StretchHorizontal size={16} />
                <span className="text-xs font-black uppercase tracking-widest">Comparar Opções</span>
              </button>
            </div>
          </div>


          {selectedTemplate && (
            <div className="space-y-8 pt-8 border-t border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_disciplines_title')}</h3>
                <span className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50">{activeSpecs.length} {t('calc_disciplines_count')}</span>
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
                      <span className="text-xs font-black uppercase tracking-widest truncate block mb-1">{d.labelPT}</span>
                      {isReq && <span className="text-[7px] font-black uppercase opacity-60">Obrigatoria</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bloco 3: Memoria das Fases (Interface Live) */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-10 shadow-2xl">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-luxury-gold/20 text-luxury-gold rounded-2xl"><Box size={20} /></div>
              <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_scope_phase')}</h3>
            </div>
          </header>

          {(!currentResult || !currentResult.phasesBreakdown || currentResult.phasesBreakdown.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-40 space-y-4">
              <Box size={40} strokeWidth={1} />
              <p className="text-xs font-light italic">{t('calc_waiting_data')}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5">Fase</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5">Descritivo</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5 text-center">Esforço</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5 text-center">%</th>
                    <th className="px-6 py-5 border-b border-black/5 dark:border-white/5 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {/* Category: Licensing */}
                  <tr className="bg-black/[0.02] dark:bg-white/[0.02]">
                    <td colSpan={5} className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold/80 bg-luxury-gold/5">
                      A. Processo de Licenciamento
                    </td>
                  </tr>
                  {currentResult.phasesBreakdown
                    .filter((p: UIPhase) => ['A0', 'A1', 'A2'].some(id => p.phaseId.startsWith(id)))
                    .map((p: UIPhase, i: number) => {
                      const label = locale === 'en' ? (p.labelEN || p.label) : p.label;
                      const description = locale === 'en' ? (p.descriptionEN || p.description) : p.description;
                      const duration = locale === 'en' && p.weeks ? `${p.weeks} ${p.weeks === 1 ? 'Week' : 'Weeks'}` : p.duration;

                      return (
                        <tr key={`lic-${i}`} className="group hover:bg-luxury-gold/[0.02] transition-colors">
                          <td className="px-6 py-5 align-top">
                            <span className="text-xs font-black uppercase tracking-widest text-luxury-gold block mb-1">{p.phaseId}</span>
                            <span className="text-[10px] font-bold text-luxury-charcoal/80 dark:text-white/80 uppercase tracking-tighter block">{label}</span>
                          </td>
                          <td className="px-6 py-5 align-top">
                            <p className="text-[11px] font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed max-w-sm">
                              {description}
                            </p>
                          </td>
                          <td className="px-6 py-5 align-top text-center">
                            <span className="text-[10px] font-mono text-luxury-charcoal/40 dark:text-white/40 uppercase whitespace-nowrap">
                              {duration}
                            </span>
                          </td>
                          <td className="px-6 py-5 align-top text-center">
                            <span className="text-[11px] font-mono text-luxury-gold font-bold">
                              {p.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-5 align-top text-right">
                            <span className="text-xs font-mono font-bold text-luxury-charcoal dark:text-white">
                              €{p.value.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                  {/* Category: Execution */}
                  {currentResult.phasesBreakdown.some((p: UIPhase) => ['A3', 'A4'].some(id => p.phaseId.startsWith(id))) && (
                    <>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-t-2 border-black/5 dark:border-white/5">
                        <td colSpan={5} className="px-6 py-3 bg-luxury-gold/5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold/60">
                              B. Projeto de Execução & Assistência
                            </span>
                            <span className="bg-luxury-gold/10 text-luxury-gold px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Opcional</span>
                          </div>
                        </td>
                      </tr>
                      {currentResult.phasesBreakdown
                        .filter((p: UIPhase) => ['A3', 'A4'].some(id => p.phaseId.startsWith(id)))
                        .map((p: UIPhase, i: number) => {
                          const label = locale === 'en' ? (p.labelEN || p.label) : p.label;
                          const description = locale === 'en' ? (p.descriptionEN || p.description) : p.description;
                          const duration = locale === 'en' && p.weeks ? `${p.weeks} ${p.weeks === 1 ? 'Week' : 'Weeks'}` : p.duration;

                          return (
                            <tr key={`exec-${i}`} className="group hover:bg-luxury-gold/[0.01] transition-colors opacity-80">
                              <td className="px-6 py-5 align-top">
                                <span className="text-xs font-black uppercase tracking-widest text-luxury-gold/60 block mb-1">{p.phaseId}</span>
                                <span className="text-[10px] font-bold text-luxury-charcoal/60 dark:text-white/60 uppercase tracking-tighter block">{label}</span>
                              </td>
                              <td className="px-6 py-5 align-top">
                                <p className="text-[11px] font-light italic text-luxury-charcoal/40 dark:text-white/40 leading-relaxed max-w-sm">
                                  {description}
                                </p>
                              </td>
                              <td className="px-6 py-5 align-top text-center">
                                <span className="text-[10px] font-mono text-luxury-charcoal/30 dark:text-white/30 uppercase whitespace-nowrap">
                                  {duration}
                                </span>
                              </td>
                              <td className="px-6 py-5 align-top text-center">
                                <span className="text-[11px] font-mono text-luxury-gold/60 font-bold">
                                  {p.percentage}%
                                </span>
                              </td>
                              <td className="px-6 py-5 align-top text-right">
                                <span className="text-xs font-mono font-bold text-luxury-charcoal/60 dark:text-white/60">
                                  €{p.value.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* Bloco 4: Condições & Exclusões (Digital Twin Parity) */}
        <div className="glass p-10 md:p-14 rounded-[2rem] space-y-10 shadow-2xl relative overflow-hidden">
          <header className="flex items-center gap-4">
            <div className="p-3 bg-black/5 dark:bg-white/5 text-luxury-gold rounded-2xl"><ShieldAlert size={20} /></div>
            <h3 className="text-xl font-serif italic text-luxury-charcoal dark:text-white">{t('calc_cond_excl')}</h3>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Entregas do Cenario (NEW) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-2 text-luxury-gold">{t('calc_scope_phase')} ({currentResult?.scenarioPack?.labelPT})</h4>
              <ul className="space-y-2 opacity-70 italic font-light text-[11px] text-luxury-charcoal dark:text-white">
                {(currentResult?.scenarioPack?.deliverablesPT || []).map((del: string, i: number) => (
                  <li key={i}>• {del}</li>
                ))}
              </ul>
            </div>

            {/* Excluões do Cenario (Dynamic) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-2 text-luxury-charcoal dark:text-white">{t('calc_excl_support')}</h4>
              <ul className="space-y-2 opacity-50 italic font-light text-[11px] text-luxury-charcoal dark:text-white">
                {(currentResult?.scenarioPack?.exclusionsPT || []).length > 0
                  ? currentResult.scenarioPack.exclusionsPT.map((ex: string, i: number) => (
                    <li key={i}>• {ex}</li>
                  ))
                  : exclusionsPT.map((ex, i) => (
                    <li key={i}>• {ex}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: Resumo Financeiro & Propagacao */}
      <div className="lg:col-span-5 space-y-10">
        {/* Toggle de Vista (Tabs) */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
          <button
            onClick={() => setViewMode('summary')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${viewMode === 'summary' ? 'bg-white dark:bg-white/10 text-luxury-charcoal dark:text-white shadow-lg' : 'text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'}`}
          >
            <TrendingUp size={14} /> Resumo Financeiro
          </button>
          <button
            onClick={() => setViewMode('document')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${viewMode === 'document' ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20' : 'text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white'}`}
          >
            <FileText size={14} /> Proposta Digital
          </button>
        </div>

        {/* PAINEL NORMAL COM RESULTADOS - UNLOCKED BY USER REQUEST */}
        {viewMode === 'summary' ? (
          <>
            <div className="glass p-8 rounded-[2rem] border-luxury-gold/30 bg-luxury-gold/[0.04] space-y-12 shadow-2xl sticky top-32 overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none">
                <TrendingUp size={180} className="text-luxury-gold" />
              </div>

              {/* TOTAL & GOVERNANCE */}
              <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{t('calc_est_investment')}</span>
                </div>
                <div className="text-6xl font-thin tracking-tighter text-luxury-charcoal dark:text-white mb-2 flex items-baseline gap-4">
                  €{currentResult?.feeTotal?.toLocaleString() || '0'}
                  {(currentResult?.deltaVsStandard?.net !== 0 && currentResult?.deltaVsStandard?.net !== undefined) && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${currentResult.deltaVsStandard.net > 0 ? 'bg-luxury-gold/20 text-luxury-gold' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {currentResult.deltaVsStandard.net > 0 ? '+' : ''}€{currentResult.deltaVsStandard.net.toLocaleString()} Δ Std
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-luxury-charcoal/60 dark:text-white/60 flex items-center gap-2">
                  <Zap size={14} /> {t('calc_vat_legal')} (€{currentResult?.vat?.toLocaleString() || '0'})
                </p>



                {/* MATRIZ UNIFICADA - Summary Panel Version */}
                {(() => {
                  if (!currentResult?.phasesBreakdown) return null;

                  // Licenciamento: A0, A1, A2
                  const licPhases = currentResult.phasesBreakdown.filter(p => ['A0', 'A1', 'A2'].some(id => p.phaseId.startsWith(id)));
                  const licValue = licPhases.reduce((acc, p) => acc + (p.value || 0), 0);

                  // Execucao: A3, A4
                  const execPhases = currentResult.phasesBreakdown.filter(p => ['A3', 'A4'].some(id => p.phaseId.startsWith(id)));
                  const execValue = execPhases.reduce((acc, p) => acc + (p.value || 0), 0);

                  const total = currentResult.feeTotal || 1;
                  const licRatio = licValue / total;
                  // const execRatio = execValue / total;

                  const feeArch = currentResult.feeArch || 0;
                  const feeSpec = currentResult.feeSpec || 0;

                  const archLic = Math.round(feeArch * licRatio);
                  const archExec = feeArch - archLic;

                  const specLic = Math.round(feeSpec * licRatio);
                  const specExec = feeSpec - specLic;

                  if (licValue > 0 || execValue > 0) {
                    return (
                      <div className="w-full mt-8 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border border-black/5 dark:border-white/5">
                        {/* Header */}
                        <div className="grid grid-cols-4 bg-luxury-black/10 dark:bg-white/10 text-[9px] uppercase font-black tracking-widest py-2 text-luxury-charcoal dark:text-white">
                          <div className="px-3 flex items-center">Disciplina</div>
                          <div className="px-1 text-center border-l border-black/5 dark:border-white/5 text-luxury-gold">Licenc.</div>
                          <div className="px-1 text-center border-l border-black/5 dark:border-white/5">Exec.</div>
                          <div className="px-2 text-right border-l border-black/5 dark:border-white/5">Total</div>
                        </div>

                        <div className="divide-y divide-black/5 dark:divide-white/5 text-[10px]">
                          {/* Architecture */}
                          <div className="grid grid-cols-4 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                            <div className="px-3 font-bold text-luxury-charcoal dark:text-white flex flex-col justify-center">
                              Arquitetura
                            </div>
                            <div className="px-1 text-center font-mono opacity-80 flex items-center justify-center text-luxury-gold">
                              €{archLic.toLocaleString()}
                            </div>
                            <div className="px-1 text-center font-mono opacity-60 flex items-center justify-center text-luxury-charcoal dark:text-white">
                              €{archExec.toLocaleString()}
                            </div>
                            <div className="px-2 text-right font-bold flex items-center justify-end text-luxury-charcoal dark:text-white">
                              €{feeArch.toLocaleString()}
                            </div>
                          </div>

                          {/* Specialties */}
                          <div className="grid grid-cols-4 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                            <div className="px-3 font-bold text-luxury-charcoal dark:text-white flex flex-col justify-center">
                              Especialidades
                            </div>
                            <div className="px-1 text-center font-mono opacity-80 flex items-center justify-center text-luxury-gold">
                              €{specLic.toLocaleString()}
                            </div>
                            <div className="px-1 text-center font-mono opacity-60 flex items-center justify-center text-luxury-charcoal dark:text-white">
                              €{specExec.toLocaleString()}
                            </div>
                            <div className="px-2 text-right font-bold flex items-center justify-end text-luxury-charcoal dark:text-white">
                              €{feeSpec.toLocaleString()}
                            </div>
                          </div>

                          {/* Totals */}
                          <div className="grid grid-cols-4 py-2 bg-black/5 dark:bg-white/5 font-bold">
                            <div className="px-3 uppercase opacity-50 flex items-center text-luxury-charcoal dark:text-white">Total</div>
                            <div className="px-1 text-center text-luxury-gold flex items-center justify-center">
                              €{licValue.toLocaleString()}
                            </div>
                            <div className="px-1 text-center opacity-60 flex items-center justify-center text-luxury-charcoal dark:text-white">
                              €{execValue.toLocaleString()}
                            </div>
                            <div className="px-2 text-right flex items-center justify-end text-luxury-charcoal dark:text-white">
                              €{total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Descontos & PolA­tica Comercial */}
                <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">

                  {/* Controlo de Role (Simulacao) */}
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_sim_profile')}</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as UserRole)}
                      className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1 text-xs font-bold uppercase text-luxury-charcoal dark:text-white outline-none"
                    >
                      <option value="" disabled className="bg-white dark:bg-black text-black/50 dark:text-white/50">{t('calc_select_profile')}</option>
                      <option value="arquiteto" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_arch')}</option>
                      <option value="marketing" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_marketing')}</option>
                      <option value="financeiro" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_fin')}</option>
                      <option value="diretor" className="bg-white dark:bg-black text-black dark:text-white">{t('calc_role_dir')}</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">{t('calc_disc_policy')}</label>
                        <select
                          value={discountType}
                          onChange={e => {
                            setDiscountType(e.target.value as DiscountType);
                            setDiscountValue(0); // reset value on type change
                          }}
                          className="bg-transparent text-xs font-black uppercase border-none outline-none text-luxury-gold cursor-pointer w-full"
                        >
                          {Object.entries(DISCOUNT_POLICY).map(([key, rule]) => (
                            <option key={key} value={key} className="bg-white dark:bg-black text-black dark:text-white">
                              {rule.description} (Max {rule.maxPct}%)
                            </option>
                          ))}
                        </select>
                      </div>
                      {discountType !== 'none' && <span className="text-sm font-mono text-luxury-gold">-{discountValue}%</span>}
                    </div>

                    {discountType !== 'none' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase font-black opacity-40">
                          <span>0%</span>
                          <span>Max: {DISCOUNT_POLICY[discountType].maxPct}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={DISCOUNT_POLICY[discountType].maxPct + 5} // Allow trying over max to test clamping 
                          value={discountValue}
                          onChange={e => setDiscountValue(Number(e.target.value))}
                          className="w-full accent-luxury-gold h-1.5 bg-white/10 rounded-full appearance-none"
                        />
                      </div>
                    )}

                    {/* Justificativa condicional */}
                    {(discountValue > (DISCOUNT_POLICY[discountType].requiresJustificationAbove || 100) || discountType === 'custom') && (
                      <div className="space-y-2 animate-in slide-in-from-top-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-red-400">{t('calc_justification_req')}</label>
                        <textarea
                          value={justification}
                          onChange={e => setJustification(e.target.value)}
                          placeholder={t('calc_justification_placeholder')}
                          className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-xs text-luxury-charcoal dark:text-white outline-none focus:border-red-500/50 min-h-[60px]"
                        />
                      </div>
                    )}

                    {/* Audit Feedback */}
                    {currentResult?.meta?.discountAudit && currentResult?.meta?.discountAudit?.status !== 'applied' && discountType !== 'none' && (
                      <div className={`p-4 rounded-xl border flex gap-3 ${currentResult?.meta?.discountAudit?.status === 'rejected'
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        }`}>
                        {currentResult?.meta?.discountAudit?.status === 'rejected' ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-widest">
                            {currentResult?.meta?.discountAudit?.status === 'rejected' ? t('calc_discount_rejected') : `${t('calc_adjusted_to')} ${currentResult?.meta?.discountAudit?.applied?.pct}%`}
                          </p>
                          <ul className="list-disc pl-3 text-[11px] opacity-80 italic">
                            {currentResult?.meta?.discountAudit?.reasons?.map((r: string, i: number) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {/* Min Fee Warning */}
                    {currentResult?.meta?.minFeeApplied && (
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3 animate-in fade-in">
                        <Lock size={16} className="text-orange-500" />
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-widest text-orange-400">{t('calc_min_fee_hit')}</p>
                          <p className="text-[11px] italic opacity-70 text-luxury-charcoal dark:text-white">
                            {t('calc_min_fee_desc')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bloco de Justificacao Narrativa: "Porque este valor?" */}
              <div className="relative z-10 pt-4">
                <div className="glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden">
                  <button
                    onClick={() => setShowJustification(!showJustification)}
                    className="w-full p-8 flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-luxury-gold/20 rounded-lg text-luxury-gold"><Search size={16} /></div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-luxury-charcoal dark:text-white">{t('calc_why_value')}</h4>
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
                              <span className="text-xs font-black uppercase tracking-widest">{t('calc_legal_complexity')}</span>
                            </div>
                            <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                              {t('calc_legal_desc')}
                            </p>
                          </div>

                          {/* 2. Risco Tecnico */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-luxury-gold">
                              <ShieldCheck size={14} />
                              <span className="text-xs font-black uppercase tracking-widest">{t('calc_tech_risk')}</span>
                            </div>
                            <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                              {t('calc_tech_risk_desc')}
                            </p>
                          </div>

                          {/* 3. Esforco Tecnico */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-luxury-gold">
                              <Clock size={14} />
                              <span className="text-xs font-black uppercase tracking-widest">{t('calc_tech_effort')}</span>
                            </div>
                            <p className="text-xs font-light italic text-luxury-charcoal/60 dark:text-white/60 leading-relaxed">
                              {t('calc_tech_effort_desc')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Radar Estrategico Evolution (Passo 8: Precision Tuning) */}
              <div className="p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-all">
                  <TrendingUp size={80} className="text-luxury-charcoal dark:text-white" />
                </div>

                <div className="flex justify-between items-center relative z-10">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-luxury-gold">{t('calc_strat_radar')}</h4>
                    <p className="text-[11px] font-light italic text-luxury-charcoal/40 dark:text-white/40">{t('calc_gov_digital')}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${currentResult?.strategic?.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                      currentResult?.strategic?.riskLevel === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                        'bg-green-500/10 border-green-500/20 text-green-500'
                      }`}>
                      {currentResult?.strategic?.riskLevel === 'high' ? t('calc_risk_high') : currentResult?.strategic?.riskLevel === 'medium' ? t('calc_risk_med') : t('calc_risk_low')} ({currentResult?.strategic?.riskScore}/100)
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${currentResult?.strategic?.isHealthy ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                      {currentResult?.strategic?.isHealthy ? t('calc_healthy') : t('calc_fragile')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{t('calc_margin_digital')}</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-serif italic ${currentResult?.strategic?.margin < 45 ? 'text-red-500' :
                        currentResult?.strategic?.margin < 50 ? 'text-yellow-500' :
                          'text-luxury-charcoal dark:text-white'
                        }`}>
                        {currentResult?.strategic?.margin}%
                      </span>
                      <span className="text-xs opacity-30">{t('calc_roi_real')}</span>
                    </div>

                    {/* NEW: Fee per m2 Ratio */}
                    {area > 0 && currentResult?.feeTotal > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-mono tracking-widest text-luxury-gold/60 border border-white/5">
                          €{Math.round(currentResult.feeTotal / area).toLocaleString()} / m²
                        </div>
                      </div>
                    )}

                    <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((currentResult?.strategic?.margin || 0) / 70) * 100)}%` }}
                        className={`h-full ${currentResult?.strategic?.margin < 45 ? 'bg-red-500' :
                          currentResult?.strategic?.margin < 50 ? 'bg-yellow-500' :
                            'bg-luxury-gold'
                          }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-40">{t('calc_decision_trigger')}</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${!currentResult?.strategic?.isBlocked ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}></div>
                      <span className="text-xs font-black uppercase tracking-widest">
                        {!currentResult?.strategic?.isBlocked ? t('calc_emission_authorized') : t('calc_output_blocked')}
                      </span>
                    </div>
                    <p className="text-[11px] font-light italic opacity-40 leading-tight">
                      {currentResult?.strategic?.isBlocked ? t('calc_rec_blocked') :
                        currentResult?.strategic?.riskLevel === 'high' ? t('calc_rec_high_risk') :
                          t('calc_rec_safe')}
                    </p>
                  </div>
                </div>

                {/* Alertas & Recomendacoes CrA­ticas */}
                {((currentResult?.strategic?.alerts?.length || 0) > 0 || (currentResult?.strategic?.recommendations?.length || 0) > 0) && (
                  <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                    {currentResult?.strategic?.alerts?.map((alert, i) => (
                      <div key={`alert-${i}`} className="flex gap-3 items-start group/alert">
                        <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${alert.includes('BLOQUEIO') ? 'bg-red-500' :
                          alert.includes('ðŸš©') ? 'bg-purple-500' :
                            alert.includes('aš ï¸') ? 'bg-yellow-500' : 'bg-luxury-gold'
                          }`}></div>
                        <p className={`text-[11px] leading-relaxed italic ${alert.includes('BLOQUEIO') ? 'text-red-400 font-bold' :
                          alert.includes('ðŸš©') ? 'text-purple-400' :
                            alert.includes('aš ï¸') ? 'text-yellow-400' : 'opacity-60 text-white'
                          }`}>
                          {alert}
                        </p>
                      </div>
                    ))}

                    {(currentResult?.strategic?.recommendations?.length || 0) > 0 && (
                      <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-luxury-gold opacity-60">Recomendacoes de Governanca</p>
                        {currentResult?.strategic?.recommendations?.map((rec, i) => (
                          <div key={`rec-${i}`} className="flex gap-2 items-center">
                            <CheckCircle2 size={10} className="text-luxury-gold opacity-40" />
                            <p className="text-[11px] italic opacity-70 text-white">{rec}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Passo 3: Mapa de Esforco Tecnico */}
              <div className="relative z-10 pt-4">
                <div className="glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-[2rem] p-10 space-y-8">
                  <header className="space-y-2">
                    <div className="flex items-center gap-3 text-luxury-gold">
                      <Clock size={16} />
                      <h4 className="text-xs font-black uppercase tracking-widest">{t('calc_effort_map')}</h4>
                    </div>
                    <p className="text-xs font-light italic text-luxury-charcoal/40 dark:text-white/40">{t('calc_effort_desc')}</p>
                  </header>

                  <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
                          <th className="px-6 py-4">{t('calc_phase')}</th>
                          <th className="px-6 py-4">{t('calc_est_effort')}</th>
                          <th className="px-6 py-4">{t('calc_main_profile')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        {currentResult?.effortMap?.map((eff: { label: string; hours: number; profile: string }, i: number) => (
                          <tr key={i} className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 text-luxury-charcoal dark:text-white font-medium italic">{eff.label}</td>
                            <td className="px-6 py-4 text-luxury-gold font-mono">~{eff.hours} h</td>
                            <td className="px-6 py-4 text-luxury-charcoal/60 dark:text-white/60">{eff.profile}</td>
                          </tr>
                        ))}
                        <tr className="bg-luxury-gold/5 font-black">
                          <td className="px-6 py-4 text-luxury-gold uppercase tracking-tighter">{t('calc_est_total')}</td>
                          <td className="px-6 py-4 text-luxury-gold font-mono">
                            ~{currentResult?.effortMap?.reduce((acc: number, curr: { hours: number }) => acc + curr.hours, 0) || 0} h
                          </td>
                          <td className="px-6 py-4 text-luxury-gold/40">a€”</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/30">Equipa envolvida:</span>
                      <div className="flex gap-2">
                        {['Arquiteto Senior', 'Arquitetos', 'Coordenacao Tecnica'].map((member, i) => (
                          <span key={i} className="text-[11px] px-3 py-1 bg-white/5 rounded-full text-white/60 italic">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-light italic opacity-40 leading-relaxed text-white">
                      a€œEsta estimativa reflete o esforco tecnico necessario para desenvolver o projeto de forma consistente, reduzir revisoes e garantir um processo fluido ate A  aprovacao e execucao.a€
                    </p>
                  </div>
                </div>
              </div>

              {/* Passo 4: Opcoes de Adjudicacao / PDF */}
              <div className="space-y-6 relative z-10 pt-4">
                <label className="text-xs font-black uppercase tracking-widest opacity-60 px-2 text-white text-white">Configuracoes de SaA­da (PDF)</label>
                <div className="flex gap-4">
                  <div className="flex-1 glass bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-xs font-black uppercase tracking-widest text-white">Proposta Executiva</span>
                    </div>
                    <span className="text-[9px] px-2 py-1 bg-white/10 rounded uppercase font-black text-white/40">1 Pag Fixed</span>
                  </div>
                  <button
                    onClick={() => setIncludeAnnex(!includeAnnex)}
                    className={`flex-1 glass p-6 rounded-2xl flex items-center justify-between border transition-all ${includeAnnex ? 'bg-luxury-gold/10 border-luxury-gold/30' : 'bg-white/5 border-white/10 opacity-40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${includeAnnex ? 'bg-luxury-gold' : 'bg-white/20'}`}></div>
                      <span className={`text-xs font-black uppercase tracking-widest ${includeAnnex ? 'text-luxury-gold' : 'text-white'}`}>Anexo Tecnico</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${includeAnnex ? 'bg-luxury-gold' : 'bg-white/10'}`}>
                      <motion.div animate={{ x: includeAnnex ? 22 : 2 }} className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-6 relative z-10 pt-10 border-t border-white/5">
                <label className="text-xs font-black uppercase tracking-widest opacity-60 px-2 text-white">Centro de Emissao & Adjudicacao</label>
                {/* Centro de Emissao (Passo 6: Governanca) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NEW: Direct PDF Export Button */}
                  <button
                    onClick={() => window.print()}
                    className="col-span-1 md:col-span-2 py-7 bg-luxury-gold text-black rounded-[2.5rem] text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                  >
                    <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                    Exportar PDF Completo (com Comparador)
                  </button>

                  <button
                    onClick={() => setViewMode('document')} // Changed to switch tab instead of modal
                    className="col-span-1 md:col-span-2 py-7 bg-white text-black rounded-[2.5rem] text-xs font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-2xl flex items-center justify-center gap-4 group"
                  >
                    <Eye size={18} /> Visualizar & Validar Proposta
                  </button>

                  <button
                    onClick={() => window.print()}
                    disabled={false}
                    className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                  >
                    <Clock size={16} className="text-luxury-gold" />
                    Imprimir / PDF
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
                          <script>
                            tailwind.config = {
                              darkMode: 'class',
                              theme: {
                                extend: {
                                  colors: {
                                    'luxury-black': '#0A0A0A',
                                    'luxury-white': '#F5F5F7',
                                    'luxury-gold': '#D4AF37',
                                    'luxury-charcoal': '#1C1C1E',
                                    'luxury-silver': '#B0B0B0',
                                    'success': '#10B981',
                                    'warning': '#F59E0B',
                                    'error': '#EF4444',
                                    'info': '#6366F1',
                                  },
                                  fontFamily: {
                                    sans: ['"Montserrat"', 'sans-serif'],
                                    serif: ['"Montserrat"', 'sans-serif'],
                                  },
                                }
                              }
                            }
                          </script>
                          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
                          <style>
                            body { background: #f4f4f4; padding: 40px; display: flex; justify-content: center; font-family: 'Montserrat', sans-serif; }
                            .proposal-to-print { background: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
                            
                            /* FORCE BLACK TEXT FOR HTML VIEW MODE */
                            .proposal-to-print * { color: black !important; }
                            .proposal-to-print .bg-luxury-gold { color: black !important; }
                            
                            @media print { 
                                body { padding: 0; background: white; } 
                                .proposal-to-print { box-shadow: none; border: none; } 
                            }
                          </style>
                        </head>
                        <body>
                          <div class="w-full max-w-[900px]">
                            ${content}
                            <p style="text-align:center; font-family: sans-serif; font-size: 10px; opacity: 0.3; margin-top: 60px; text-transform: uppercase; letter-spacing: 2px;">
                              Documento Estrategico Ferreira Arquitetos a€¢ e ? 2026
                            </p>
                          </div>
                        </body>
                      </html>
                    `);
                        win.document.close();
                      }
                    }}
                    disabled={false}
                    className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                  >
                    <Layout size={16} className="text-luxury-gold" />
                    Web-Proposal (HTML)
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://fa360.design/proposal/${internalRef}`);
                      alert("Link HTML copiado para o clipboard!");
                    }}
                    className="py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    <Layers size={16} className="text-luxury-gold" /> {t('calc_share_link')}
                  </button>

                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`Proposta de Honorarios: ${projectName} [REF: ${internalRef}]`);
                      const body = encodeURIComponent(`Ola ${clientName},\n\nConforme solicitado, enviamos a proposta para o projeto "${projectName}".\n\nPode visualizar e adjudicar aqui: https://fa360.design/proposal/${internalRef}\n\nMelhores cumprimentos,\nFerreira Arquitetos`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                  >
                    <Zap size={16} className="group-hover:animate-pulse" /> {t('calc_send_email')}
                  </button>
                </div>
                <p className="text-[11px] text-center italic opacity-30 text-white pt-2">
                  {t('calc_legal_footer')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 relative z-10 pt-4">
                <button
                  onClick={handlePropagate}
                  disabled={isPropagating}
                  className="w-full py-6 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-4 disabled:opacity-20"
                >
                  {isPropagating ? <Loader2 className="animate-spin" size={18} /> : <Brain size={18} />} {t('calc_propagate_antigravity')}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAutomation(1)}
                    disabled={isPropagating}
                    className="py-4 bg-white/5 border border-white/10 text-white/70 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <Box size={14} className={`group-hover:text-luxury-gold ${isPropagating ? 'animate-pulse' : ''}`} /> {isPropagating ? 'A Criar...' : t('calc_create_project')}
                  </button>
                  <button
                    onClick={() => handleAutomation(2)}
                    disabled={isPropagating}
                    className="py-4 bg-luxury-gold text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/10 disabled:opacity-50"
                  >
                    <Zap size={14} className={isPropagating ? 'animate-spin' : ''} /> {isPropagating ? 'A Processar...' : t('calc_project_proposal')}
                  </button>
                </div>
              </div>
            </div>

            {/* Painel de Avisos - Removed as per user request to remove blocks */}
          </>
        ) : (
          /* MODO DOCUMENTO (Live Preview) */
          <div className="glass bg-white rounded-[2rem] shadow-2xl sticky top-32 overflow-hidden border border-black/5 min-h-[800px] flex flex-col">
            <div className="p-4 border-b border-black/5 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/50">Live Preview</span>
              </div>
              <button onClick={() => window.print()} className="p-2 hover:bg-black/5 rounded-full text-black/40 hover:text-black transition-colors">
                <Clock size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-6 bg-gray-100/50">
              <div className="bg-white shadow-xl min-h-[1000px] w-full origin-top transform scale-[var(--scale-factor,1)]">
                <ProposalDocument data={{
                  templateName: currentTemplate?.namePT || '',
                  clientName,
                  projectName,
                  location,
                  internalRef,
                  area,
                  complexity: complexity === 1 ? 'Baixa' : complexity === 2 ? 'Media' : 'Alta',
                  scenario: selectedScenario,
                  feeArch: currentResult?.feeArch || 0,
                  feeSpec: currentResult?.feeSpec || 0,
                  feeTotal: currentResult?.feeTotal || 0,
                  vat: currentResult?.vat || 0,
                  totalWithVat: currentResult?.totalWithVat || 0,
                  activeSpecs,
                  selectedSpecs: currentResult?.selectedSpecs || [],
                  phases: currentResult?.phasesBreakdown || [],
                  effortMap: currentResult?.effortMap || [],
                  units: currentResult?.units || 'm2',
                  comparisonData
                }}
                  includeAnnex={includeAnnex} />
              </div>
            </div>
          </div>
        )}
      </div>



      {/* COMPARATOR MODAL */}
      <AnimatePresence>
        {showComparator && comparisonData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
          >
            <div className="w-full max-w-7xl bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col max-h-full shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
                      <StretchHorizontal size={20} />
                    </div>
                    <h3 className="text-xl font-serif text-white">Comparador de Cenários</h3>
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-widest pl-12">Análise Lado-a-Lado de Investimento e Valor</p>
                </div>
                <button onClick={() => setShowComparator(false)} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {comparisonData.map((item) => {
                    if (!item || !item.result) return null;
                    const isSelected = selectedScenario === item.scenario;
                    const isPremium = item.scenario === 'premium';

                    return (
                      <div
                        key={item.scenario}
                        onClick={() => {
                          setSelectedScenario(item.scenario);
                          setShowComparator(false);
                        }}
                        className={`
                                        relative rounded-3xl border p-8 flex flex-col gap-6 cursor-pointer group transition-all duration-300
                                        ${isSelected
                            ? 'bg-luxury-gold/10 border-luxury-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1'
                          }
                                    `}
                      >
                        {isPremium && (
                          <div className="absolute top-6 right-6 text-luxury-gold">
                            <Star size={16} fill="currentColor" />
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className={`
                                            inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${item.scenario === 'essential' ? 'bg-emerald-500/20 text-emerald-400' :
                              item.scenario === 'standard' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-luxury-gold/20 text-luxury-gold'}
                                        `}>
                            {item.pack?.labelPT || item.scenario}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-serif">€{item.result.feeTotal}</span>
                              <span className="text-xs text-white/40 font-light uppercase tracking-widest">s/IVA</span>
                            </div>
                            <p className="text-xs text-white/20 font-mono">
                              {Math.round(item.result.feeTotal / (area || 1))} €/m²
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">Entregáveis Incluídos</p>
                          <ul className="space-y-3">
                            {item.pack?.deliverablesPT?.slice(0, 6).map((d, idx) => (
                              <li key={idx} className="flex gap-3 items-start text-xs text-white/70">
                                <Check size={14} className={`shrink-0 mt-0.5 ${isPremium ? 'text-luxury-gold' : 'text-luxury-gold/50'}`} />
                                <span className="leading-relaxed">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Revisões</p>
                            <p className="text-lg font-serif">{item.pack?.revisionsIncluded || 2}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Equipa</p>
                            <p className="text-lg font-serif">{Math.round(item.result.effortMap?.reduce((acc: number, c: { hours: number }) => acc + c.hours, 0) || 0)}h</p>
                          </div>
                        </div>

                        <button className={`
                                        w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                        ${isSelected
                            ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/20'
                            : 'bg-white/10 text-white group-hover:bg-white/20'}
                                    `}>
                          {isSelected ? 'Selecionado' : 'Selecionar Opção'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVERSE CALC MODAL */}
      <AnimatePresence>
        {showReverseCalc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setShowReverseCalc(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold mx-auto mb-4">
                    <Calculator size={24} />
                  </div>
                  <h2 className="text-xl font-serif">Calculadora Inversa</h2>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Defina o orçamento, nós calculamos a área.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Orçamento Disponível (€)</label>
                    <input
                      type="number"
                      value={reverseBudget}
                      onChange={(e) => setReverseBudget(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-2xl font-serif focus:outline-none focus:border-luxury-gold transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Nível de Acabamentos</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['economic', 'standard', 'luxury'] as const).map(q => (
                        <button
                          key={q}
                          onClick={() => setReverseQuality(q)}
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${reverseQuality === q ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'}`}
                        >
                          {{ economic: 'Econ.', standard: 'Médio', luxury: 'Luxo' }[q]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-luxury-gold/10 border border-luxury-gold/20 rounded-2xl p-6 text-center space-y-2">
                  <p className="text-[10px] uppercase font-black tracking-widest text-luxury-gold/60">Área Estimada de Construção</p>
                  <p className="text-4xl font-serif text-luxury-gold">{reverseResult.area} <span className="text-lg opacity-50">m²</span></p>
                  <p className="text-[10px] opacity-40">Baseado em custo de €{reverseResult.rate}/m²</p>
                </div>

                <button
                  onClick={() => {
                    setArea(reverseResult.area);
                    setShowReverseCalc(false);
                  }}
                  className="w-full py-4 bg-luxury-gold text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-luxury-gold/20"
                >
                  Aplicar Área ao Simulador
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>




      {/* COMPARATOR MODAL */}
      <AnimatePresence>
        {showComparator && comparisonData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
          >
            <div className="w-full max-w-7xl bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col max-h-full shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-luxury-gold/10 rounded-xl text-luxury-gold"><StretchHorizontal size={24} /></div>
                  <div>
                    <h2 className="text-xl font-serif text-white">Comparador de Cenários</h2>
                    <p className="text-xs font-light text-white/40 uppercase tracking-widest">Análise Lado-a-Lado de Investimento e Valor</p>
                  </div>
                </div>
                <button onClick={() => setShowComparator(false)} className="p-4 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {comparisonData.map((item) => {
                    const isSelected = selectedScenario === item.scenario;

                    return (
                      <div key={item.scenario} className={`relative flex flex-col rounded-[2rem] border transition-all duration-300 group hover:border-luxury-gold/30 ${isSelected ? 'bg-luxury-gold/5 border-luxury-gold ring-1 ring-luxury-gold/50' : 'bg-white/5 border-white/5 hover:bg-white/[0.07]'}`}>
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isSelected ? 'bg-luxury-gold text-black' : 'bg-white/10 text-white/60'}`}>
                              {item.pack?.labelPT || item.scenario}
                            </span>
                            {item.scenario === 'premium' && <Star size={16} className="text-luxury-gold fill-luxury-gold" />}
                          </div>

                          <div className="pt-4">
                            <span className="text-4xl md:text-5xl font-serif text-white">
                              {item.result?.feeTotal ? `€${(item.result.feeTotal).toLocaleString('pt-PT')}` : 'N/A'}
                            </span>
                            <span className="text-sm opacity-40 ml-2 relative -top-4 font-light">s/IVA</span>
                          </div>

                          {area > 0 && <div className="text-[10px] uppercase font-mono tracking-widest text-luxury-gold/60">
                            €{item.result ? Math.round(item.result.feeTotal / area) : 0} / m²
                          </div>}
                        </div>

                        {/* Breakdown Mini-Matrix (Consistency with PDF) */}
                        <div className="px-8 pb-4 space-y-2">
                          <div className="flex justify-between items-end gap-2 text-[10px] bg-white/[0.03] px-4 py-3 rounded-lg border border-white/5">
                            <div className="space-y-1">
                              <span className="block uppercase font-black opacity-40 text-[9px] tracking-tight">ARQ. Total</span>
                              <span className="font-bold block text-sm">€{(item.result?.feeArch || 0).toLocaleString()}</span>
                            </div>
                            <div className="space-y-1 text-right">
                              <span className="block uppercase font-black opacity-40 text-[9px] tracking-tight">ENG. Total</span>
                              <span className="font-bold block text-sm">€{(item.result?.feeSpec || 0).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-end gap-2 text-[10px] bg-luxury-gold/[0.05] px-4 py-3 rounded-lg border border-luxury-gold/20">
                            <div className="space-y-1">
                              <span className="block uppercase font-black opacity-60 text-luxury-gold text-[9px] tracking-tight">LIC. (Fases)</span>
                              <span className="font-bold text-white/90 block text-sm">
                                €{(
                                  (item.result?.phasesBreakdown || [])
                                    .filter((p: { phaseId: string }) => ['A0', 'A1', 'A2'].some((id: string) => p.phaseId.startsWith(id)))
                                    .reduce((acc: number, p: { value: number }) => acc + (p.value || 0), 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="space-y-1 text-right">
                              <span className="block uppercase font-black opacity-60 text-luxury-gold text-[9px] tracking-tight">EXEC. (Fases)</span>
                              <span className="font-bold text-white/90 block text-sm">
                                €{(
                                  (item.result?.phasesBreakdown || [])
                                    .filter((p: { phaseId: string }) => ['A3', 'A4'].some((id: string) => p.phaseId.startsWith(id)))
                                    .reduce((acc: number, p: { value: number }) => acc + (p.value || 0), 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 flex-1">
                          {/* Deliverables */}
                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Entregáveis incluidos</p>
                            <ul className="space-y-3">
                              {(item.pack?.deliverablesPT || []).map((del, i) => {
                                let displayLabel = del;
                                if (del.includes('Assistência Técnica')) {
                                  const visitCount = complexity === 3 ? 15 : complexity === 2 ? 10 : 5;
                                  displayLabel = `${del} (${visitCount} visitas)`;
                                }
                                return (
                                  <li key={i} className="flex gap-3 text-xs font-light text-white/80">
                                    <CheckCircle2 size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{displayLabel}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {/* Efforts */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase font-black opacity-30">Revisões</p>
                              <p className="text-lg font-serif">{item.pack?.revisionsIncluded === 99 ? 'Ilimitadas' : item.pack?.revisionsIncluded}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase font-black opacity-30">Equipa</p>
                              <p className="text-lg font-serif">{Math.round(item.result?.effortMap?.reduce((acc: number, c: { hours: number }) => acc + c.hours, 0) || 0)}h</p>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-[2rem]">
                          <button
                            onClick={() => {
                              setSelectedScenario(item.scenario);
                              setShowComparator(false);
                            }}
                            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSelected ? 'bg-luxury-gold text-black cursor-default' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                          >
                            {isSelected ? <Check size={16} /> : <Zap size={16} />}
                            {isSelected ? 'Selecionado' : 'Selecionar Opção'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="fixed top-10 left-[340px] flex items-center gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-3 px-6 py-4 bg-luxury-gold text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
                >
                  <ChevronDown size={20} className="rotate-90" />
                  Voltar ao Editor
                </button>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="fixed top-10 right-10 p-4 bg-white/10 text-white rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-md border border-white/5"
              >
                <X size={24} />
              </button>
              <ProposalDocument data={{
                templateName: currentTemplate?.namePT || '',
                clientName,
                projectName,
                location,
                internalRef,
                address, // NEW
                mapsLink, // NEW
                area,
                complexity: complexity === 1 ? 'Baixa' : complexity === 2 ? 'Media' : 'Alta',
                scenario: selectedScenario,
                feeArch: currentResult?.feeArch || 0,
                feeSpec: currentResult?.feeSpec || 0,
                feeTotal: currentResult?.feeTotal || 0,
                vat: currentResult?.vat || 0,
                totalWithVat: currentResult?.totalWithVat || 0,
                activeSpecs,
                selectedSpecs: currentResult?.selectedSpecs || [],
                phases: currentResult?.phasesBreakdown || [],
                effortMap: currentResult?.effortMap || [],
                units: currentResult?.units || 'm2',
                comparisonData
              }}
                includeAnnex={includeAnnex} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* DEDICATED PRINT CONTAINER - OUTSIDE OF MODALS/TRANSFORMS */}
      {showPreview && (
        <div id="print-mount-point" className="hidden print:block">
          <ProposalDocument data={{
            templateName: currentTemplate?.namePT || '',
            clientName,
            projectName,
            location,
            internalRef,
            address, // NEW
            mapsLink, // NEW
            area,
            complexity: complexity === 1 ? 'Baixa' : complexity === 2 ? 'Media' : 'Alta',
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
            units: currentResult?.units || 'm2',
            comparisonData
          }} includeAnnex={includeAnnex} />
        </div>
      )}

      {/* Zona de Captura (InvisA­vel) para Exportacao HTML */}
      <div id="proposal-capture-zone" className="fixed -left-[2000px] -top-[2000px] pointer-events-none opacity-0">
        <ProposalDocument data={{
          templateName: currentTemplate?.namePT || '',
          clientName,
          projectName,
          location,
          internalRef,
          address, // NEW
          mapsLink, // NEW
          area,
          complexity: complexity === 1 ? 'Essencial' : complexity === 2 ? 'Medio' : 'Rigor+',
          scenario: selectedScenario,
          feeArch: currentResult?.feeArch || 0,
          feeSpec: currentResult?.feeSpec || 0,
          feeTotal: currentResult?.feeTotal || 0,
          vat: currentResult?.vat || 0,
          totalWithVat: currentResult?.totalWithVat || 0,
          activeSpecs: activeSpecs.map(id => disciplines.find(d => d.disciplineId === id)?.labelPT || id),
          phases: currentResult?.phasesBreakdown || [],
          effortMap: currentResult?.effortMap || [],
          units: currentResult?.units || 'm2',
          comparisonData
        }} includeAnnex={includeAnnex} />
      </div>
    </div >
  );
}



