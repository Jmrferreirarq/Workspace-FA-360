// services/feeCalculator.ts
import { templates, phaseCatalog } from './feeData';
import { PAYMENT_MILESTONES } from './paymentMilestones';
import { TASK_CATALOG } from './taskCatalog';
import { applyDiscountPolicy } from './discountPolicy';
import { SCENARIO_CATALOG } from './scenarioCatalog';
import { INTERNAL_RATES, OVERHEAD_MULT, FINANCE_THRESHOLDS, MIN_FEES } from './financeConfig';
import { CalculationParams, Complexity, Scenario, UnitsInput, FeeTemplate } from '../types';

// ---------- CONFIG (ajusta aqui sem mexer na logica) ----------
// mantem no topo
const VAT_RATE = 0.23;

// Multiplicadores
const COMPLEXITY_MULT: Record<Complexity, number> = { 1: 0.9, 2: 1.25, 3: 1.8 };

// Especialidades: base incluida + incremento
const INCLUDED_SPECS = 4;
const SPEC_FEE_EXTRA_PCT = 0.07;   // +7% por especialidade acima de INCLUDED_SPECS
const SPEC_HOURS_EXTRA_PCT = 0.05; // +5% horas coord por especialidade extra

// Rates internos (custos) — aproximacao realista p/ calculo de margem
// Rates movidos para financeConfig.ts

// OVERHEAD_MULT movido para financeConfig.ts

const PROFILE_RATE_KEY: Record<string, keyof typeof INTERNAL_RATES> = {
  "Arquiteto Senior": "senior",
  "Equipa Tecnica": "team",
  "Arquiteto": "architect",
  "Arquiteto + Equipa": "team",
};

// Fases: pesos (mantive os teus, mas com normalizacao robusta)
const ALL_PHASE_WEIGHTS = [
  { id: "A0", weight: 0.05 }, // 5% - Entrada facilitada
  { id: "A1", weight: 0.20 }, // 20% - Estudo Previo
  { id: "A2", weight: 0.35 }, // 35% - Licenciamento (Responsabilidade)
  { id: "A3", weight: 0.30 }, // 30% - Execucao (Trabalho Tecnico)
  { id: "A4", weight: 0.10 }, // 10% - Assistencia
] as const;

function normalizeWeights(weights: { id: string; weight: number }[]) {
  const sum = weights.reduce((acc, w) => acc + w.weight, 0);
  if (sum <= 0) return weights.map(w => ({ ...w, weight: 0 }));
  return weights.map(w => ({ ...w, weight: w.weight / sum }));
}

function clamp(n: number, min: number, max: number) {
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function round(n: number) {
  if (isNaN(n)) return 0;
  return Math.round(n);
}

function getUnitCount(template: FeeTemplate, units?: UnitsInput) {
  const kind = template.unitPricing?.unitKind;
  if (!kind) return 0;
  if (kind === 'APARTMENT') return Math.max(0, Number(units?.apartments || 0));
  if (kind === 'FRACTION') return Math.max(0, Number(units?.apartments || 0)); // Reusing apartments slot
  if (kind === 'LOT') return Math.max(0, Number(units?.lots || 0));
  if (kind === 'ROOM') return Math.max(0, Number(units?.rooms || 0));
  return 0;
}

// Pricing por template
function calcArchitectureFee(template: FeeTemplate, area: number, compMult: number, scenMult: number, units?: UnitsInput) {
  const safeArea = Math.max(1, Number(area || 0)); // Garante pelo menos 1m2 para evitar 0 total na arquitetura se area estiver vazia ou string

  switch (template.pricingModel) {
    case 'PACKAGE': {
      const base = template.baseFeeArch ?? 4000;
      return base * compMult * scenMult;
    }
    case 'EUR_PER_M2': {
       // ... existing code

      const rate = template.rateArchPerM2 ?? 65;
      return safeArea * rate * compMult * scenMult;
    }
    case 'UNIT': {
      const cfg = template.unitPricing;
      if (!cfg) {
        const rate = template.rateArchPerM2 ?? 55;
        return safeArea * rate * compMult * scenMult;
      }
      const unitCount = getUnitCount(template, units);
      const base = cfg.baseFeeArch ?? 0;
      const included = cfg.includedUnits ?? 0;
      const extraMult = cfg.extraUnitMultiplier ?? 1.0;
      const extraUnits = Math.max(0, unitCount - included);

      const unitsFee =
        (Math.min(unitCount, included) * cfg.feePerUnitArch) +
        (extraUnits * cfg.feePerUnitArch * extraMult);

      const areaFee = (cfg.feePerM2Arch ?? 0) * safeArea;
      const raw = base + unitsFee + areaFee;
      return raw * compMult * scenMult;
    }
    default: {
      const rate = template.rateArchPerM2 ?? 65;
      return safeArea * rate * compMult * scenMult;
    }
  }
}

function calcSpecsFee(area: number, baseRateSpec: number, compMult: number, scenMult: number, specCount: number, units?: UnitsInput, template?: FeeTemplate) {
  const safeArea = Math.max(0, Number(area || 0));
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);
  const specMult = 1 + extraSpecs * SPEC_FEE_EXTRA_PCT;

  let unitFactor = 1;
  if (template?.pricingModel === 'UNIT') {
    const unitCount = getUnitCount(template, units);
    unitFactor = 1 + Math.max(0, unitCount - 6) * 0.03;
    unitFactor = clamp(unitFactor, 1, 1.6);
  }

  return safeArea * baseRateSpec * compMult * scenMult * specMult * unitFactor;
}

function buildEffortMap(compMult: number, scenario: Scenario, specCount: number) {
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);

  return TASK_CATALOG.arch.map(task => {
    let hours = task.baseHours * compMult;

    // Ajuste especifico para coordenacao
    if (task.id === 'COORD_01') {
      hours = hours * (1 + extraSpecs * SPEC_HOURS_EXTRA_PCT);
    }

    let active = true;
    if (task.id === 'A3_01' || task.id === 'A4_01') {
      active = scenario === 'premium';
    }

    return {
      taskId: task.id,
      label: task.label,
      hours: round(hours),
      profile: task.profile,
      active
    };
  }).filter(r => r.active);
}

function estimatedInternalCost(effortMap: { hours: number; profile: string }[]) {
  const base = effortMap.reduce((acc, row) => {
    const key = PROFILE_RATE_KEY[row.profile] ?? "team";
    const rate = INTERNAL_RATES[key];
    return acc + row.hours * rate;
  }, 0);

  return base * OVERHEAD_MULT;
}

function phasesBreakdown(feeTotal: number, scenario: Scenario, area: number, complexity: Complexity, template?: FeeTemplate) {
  // 1. Determine base active phases by Scenario
  // [MODIFIED] Always show full phases breakdown (A0-A4) to reflect the 60/40 split map.
  const activePhases = ALL_PHASE_WEIGHTS;

  // 2. Filter by Template Process Type (Typology)
  // [MODIFIED] User requested explicit separation of Licensing vs Execution for ALL templates.
  // We removed the 'lic' filter to ensure even "Licensing" templates show the full potential roadmap (A0-A4)
  // with the new 60/40 split.
  
  if (template) {
     // Previously filtered 'lic' to drop A3/A4. Now allowing full scope visibility.
     // if (template.processType === 'lic') ... (Removed)
  }

  const normalized = normalizeWeights(activePhases as unknown as { id: string; weight: number }[]);

  // Base weeks per phase (Standard complexity, ~200m2)
  const baseWeeks: Record<string, number> = {
    'A0': 2,
    'A1': 4,
    'A2': 4,
    'A3': 8, // Execucao (Aumentado para segurança - 2 meses)
    'A4': 2  // Assistencia
  };

  // Scale factors
  let areaMult = 1;
  if (area < 150) areaMult = 0.8;
  else if (area > 500) areaMult = 1.5;
  else if (area > 1000) areaMult = 2.0;

  const compMult = complexity === 3 ? 1.3 : complexity === 2 ? 1.1 : 1.0;

  return normalized.map(pw => {
    const info = phaseCatalog.find(p => p.phaseId === pw.id);

    const rawWeeks = (baseWeeks[pw.id] || 2) * areaMult * compMult;
    const weeks = Math.max(1, Math.round(rawWeeks));

    let description = info?.shortPT || "";
    
    // [MODIFIED] Add visit limits to A4 (Safeguard)
    if (pw.id === 'A4') {
       const visitCount = complexity === 3 ? 15 : complexity === 2 ? 10 : 5;
       description += ` Inclui pacote de ${visitCount} visitas à obra.`;
    }

    return {
      phaseId: pw.id,
      label: info?.labelPT || pw.id,
      labelEN: info?.labelEN || info?.labelPT || pw.id,
      description: description,
      descriptionEN: info?.shortEN || info?.shortPT || "",
      value: round(feeTotal * pw.weight),
      percentage: round(pw.weight * 100),
      weeks: weeks, // Raw value for UI translation
      duration: `${weeks} ${weeks === 1 ? 'Semana' : 'Semanas'}`
    };
  });
}

function buildPaymentPlan(feeTotal: number, scenario: Scenario) {
  const milestones = PAYMENT_MILESTONES[scenario] || PAYMENT_MILESTONES.standard;
  return milestones.map((m, idx) => ({
    id: `PAY_${idx + 1}`,
    name: m.name,
    percentage: m.pct,
    value: round(feeTotal * (m.pct / 100)),
    vat: round(feeTotal * (m.pct / 100) * VAT_RATE), // Will be overridden in main, but good default
    dueDays: m.dueDays,
    phaseId: 'COMMERCIAL'
  }));
}

function riskEngine(input: {
  marginPct: number;
  scenario: Scenario;
  complexity: Complexity;
  area: number;
  specCount: number;
  discountPct: number;
  discountStatus?: 'applied' | 'rejected' | 'clamped';
  units?: UnitsInput;
  template?: FeeTemplate;
}) {
  const { marginPct, scenario, complexity, area, specCount, discountPct, discountStatus, units, template } = input;
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);

  let riskScore = 0;
  const signals: string[] = [];
  const alerts: string[] = [];
  const recommendations: string[] = [];

  // Complexidade
  if (complexity === 3) { riskScore += 25; signals.push("Complexity_High"); }
  else if (complexity === 2) { riskScore += 12; signals.push("Complexity_Medium"); }

  // Cenario
  if (scenario === 'essential') { riskScore += 18; signals.push("Scenario_Essential"); }
  if (scenario === 'premium') { riskScore -= 8; signals.push("Scenario_Executive"); }

  // Escala
  if (area > 500) { riskScore += 12; signals.push("Scale_Over_500"); }
  if (area > 1000) { riskScore += 20; signals.push("Scale_Over_1000"); }

  // UNIT scale risk
  if (template) {
    const unitCount = getUnitCount(template, units);
    if (template.pricingModel === 'UNIT' && template.unitPricing?.unitKind === 'APARTMENT') {
      const extraRisk = Math.min(20, Math.max(0, unitCount - 8) * 2);
      riskScore += extraRisk;
      if (extraRisk > 0) signals.push("Apartment_Scale_Extra");
    }
    if (template.pricingModel === 'UNIT' && template.unitPricing?.unitKind === 'LOT') {
      const extraRisk = Math.min(20, Math.max(0, unitCount - 6) * 3);
      riskScore += extraRisk;
      if (extraRisk > 0) signals.push("Lot_Scale_Extra");
    }
  }

  // Especialidades extra
  riskScore += Math.min(20, extraSpecs * 4);
  if (extraSpecs > 0) signals.push("Specs_Extra");

  // Descontos agressivos e politica
  if (discountStatus === 'rejected') {
    signals.push("Discount_Rejected");
    alerts.push("⚠️ Desconto rejeitado por politica. Rever condicoes.");
  }
  if (discountPct > 15) { riskScore += 10; signals.push("Discount_Over_15"); }
  if (discountPct > 20) { riskScore += 20; signals.push("Discount_Over_20"); }

  // Margem
  if (marginPct < FINANCE_THRESHOLDS.marginWarn) { riskScore += 15; signals.push("Margin_Tight"); }
  if (marginPct < FINANCE_THRESHOLDS.marginBlock) { riskScore += 30; signals.push("Margin_Under_Redline"); }

  riskScore = clamp(riskScore, 0, 100);

  const riskLevel: 'low' | 'medium' | 'high' =
    riskScore >= 60 ? 'high' :
      riskScore >= 30 ? 'medium' : 'low';

  // Alertas e recomendacoes (acao concreta)
  if (marginPct < FINANCE_THRESHOLDS.marginBlock) {
    alerts.push(`🚨 BLOQUEIO: Margem critica (<${FINANCE_THRESHOLDS.marginBlock}%). Configuracao financeiramente inviavel.`);
    recommendations.push("Reduzir desconto (≤10%) ou subir cenario para Profissional/Executivo.");
    recommendations.push("Rever rate por m² ou aumentar fee minima do template.");
  } else if (marginPct < FINANCE_THRESHOLDS.marginWarn) {
    alerts.push(`🟡 Margem minima operacional (<${FINANCE_THRESHOLDS.marginWarn}%). Espaco de manobra nulo.`);
    recommendations.push("Evitar alteracoes fora de escopo; preferir Modo Profissional.");
  } else if (marginPct < FINANCE_THRESHOLDS.marginHealthy) {
    alerts.push(`🟢 Margem aceitavel. Considerar otimizacao para aproximar de ${FINANCE_THRESHOLDS.marginHealthy}%.`);
  }

  // Regras de risco especificas
  if (scenario === 'essential' && specCount > 4) {
    alerts.push("⚠️ Risco Tecnico: Modo Essencial com excesso de disciplinas (>4). Aumenta risco de falhas na coordenacao.");
    recommendations.push("Mudar para Modo Profissional para incluir coordenacao mais robusta.");
  }

  if (scenario !== 'premium' && complexity === 3 && area > 500) {
    alerts.push("⚠️ Desequilibrio: Grande escala + Complexidade Alta sem Modo Executivo.");
    recommendations.push("Recomenda-se Modo Executivo para reduzir risco e estabilizar expectativas.");
  }

  if (riskLevel === 'high' || signals.length >= 3 || discountPct > 15) {
    alerts.push("🚩 Alerta Estrategico: Elevado potencial de desgaste psicologico/comercial.");
    recommendations.push("Reforcar exclusoes e limitar revisoes incluidas no ambito.");
  }

  return {
    riskScore,
    riskLevel,
    signals,
    alerts,
    recommendations,
  };
}

// ---------- MAIN ----------
export const calculateFees = (params: CalculationParams & { clientName?: string, location?: string }) => {
  const { templateId, area, complexity, selectedSpecs, scenario, discount, units } = params;

  const template = templates.find(t => t.templateId === templateId);
  if (!template) return null;

  // No need for 'as any' since vatRate is now in CalculationParams
  const vatRate = params.vatRate ?? VAT_RATE;

  const specCount = selectedSpecs.length;

  const safeArea = Math.max(0, Number(area || 0));
  const compMult = COMPLEXITY_MULT[complexity] || 1.0;
  /* REMOVED SCENARIO_MULT usage, use SCENARIO_CATALOG */
  const scenarioPack = SCENARIO_CATALOG[scenario] || SCENARIO_CATALOG.standard; // Fallback
  if (!scenarioPack) {
    console.error("Critical: Scenario Pack not found for", scenario);
    return null;
  }
  const scenMult = scenarioPack.multiplier ?? 1.0;

  const baseRateSpec = 28;

  const feeArchRaw = calcArchitectureFee(template, safeArea, compMult, scenMult, units);
  const feeSpecRaw = calcSpecsFee(safeArea, baseRateSpec, compMult, scenMult, specCount, units, template);

  const subTotalRaw = feeArchRaw + feeSpecRaw;

  // PATCH V1: Ordem de Operacoes (Corrigido)
  // 1. Determinar Taxa Minima (Guardrails)
  // FIX: Apply Scenario Multiplier to Min Fee to ensure Essential < Standard
  let minFeeGuard = (template.minFeeTotal ?? 0) * scenMult;

  // Guardrail 1: Min Fee by Scenario (also scaled or absolute?)
  // If MIN_FEES[scenario] is absolute floor, keep it.
  // Guardrail 1: Min Fee by Scenario
  // FIX: Don't force Scenario Min on UNIT pricing (usually smaller scope like PH)
  const scenarioMin = MIN_FEES[scenario];
  if (scenarioMin && template.pricingModel !== 'UNIT') {
    minFeeGuard = Math.max(minFeeGuard, scenarioMin);
  }

  // Guardrail 2: Min Fee by Unit (Exemplo simplificado)
  if (template.pricingModel === 'UNIT' && units) {
    // Logica futura de unit min
  }

  // 2. Estabelecer Valor Base Efetivo (antes de descontos e guardrails)
  const effectiveBaseFee = Math.max(subTotalRaw, minFeeGuard);
  const minFeeApplied = subTotalRaw < minFeeGuard;

  // 3. Aplicar Desconto sobre o Valor Base Efetivo
  const userRole = params.userRole || 'arquiteto';
  const discountEval = applyDiscountPolicy(effectiveBaseFee, discount, {
    userRole,
    scenario,
    specCount
  });

  const appliedDiscount = discountEval.appliedPct;
  const discountAmount = discountEval.discountAmount;
  const discountAudit = discountEval.audit;

  // 4. Calcular Total Final
  // O feeTotal final AQUI já inclui o desconto.
  // IMPORTANTE: Se o minFeeGuard for ativado, o desconto incide sobre ele?
  // Na logica atual: sim, `applyDiscountPolicy` recebe `effectiveBaseFee` (que é >= minFeeGuard).
  // Se o desconto fizer baixar do minimo ADMISSIVEL após desconto, isso deveria ser gerido policy ou clamp?
  // O "Min Fee Hit" é verificado no UI através de meta.minFeeApplied ou logica similar.
  // Assumimos que o desconto é aplicado sobre o valor de tabela/ajustado.

  const feeTotal = effectiveBaseFee - discountAmount;

  // Distribute total back to components
  let feeArch = feeArchRaw;
  let feeSpec = feeSpecRaw;

  if (subTotalRaw > 0) {
    const ratio = feeTotal / subTotalRaw;
    // Se houve minFee, o ratio aumenta. Se houve desconto, diminui.
    // Ajustamos os componentes proportionally.
    feeArch = feeArchRaw * ratio;
    feeSpec = feeSpecRaw * ratio;
  } else if (feeTotal > 0) {
    feeArch = feeTotal;
    feeSpec = 0;
  }

  // --- PASSO 9.3: DELTA VS STANDARD ---
  // Recalcular Standard Baseline
  const stdMult = SCENARIO_CATALOG.standard.multiplier;

  // Fee Base "Standard" (antes de mins/descontos, só multiplicador trocado)
  // Nota: calcArchitectureFee usa multiplicadores diretos.
  // O "Standard" tem scenMult = 1.0 (ou o valor em catalogo).
  const feeArchStd = calcArchitectureFee(template, safeArea, compMult, stdMult, units);
  const feeSpecStd = calcSpecsFee(safeArea, baseRateSpec, compMult, stdMult, specCount, units, template);

  const subTotalStd = feeArchStd + feeSpecStd;

  // Aplicar MESMO desconto % (para comparacao justa de valor comercial)
  const stdDiscountAmount = (subTotalStd * appliedDiscount) / 100;
  const stdAfterDiscount = subTotalStd - stdDiscountAmount;

  // Min Fee Guardrail para Standard?
  // Sim, idealmente aplicamos a mesma logica de guardrail do standard (que pode ter min diferente, ex: MIN_FEES.standard)
  // Mas para "delta vs standard" rápido, vamos assumir o valor comercial direto.
  // Se quisermos ser rigorosos, aplicamos MIN_FEES.standard.
  const stdMinGuard = Math.max(template.minFeeTotal ?? 0, MIN_FEES.standard);
  const stdEffective = Math.max(stdAfterDiscount, stdMinGuard);

  // Mas se stdEffective aplicar guardrail, perdemos a nocoa de "delta puro de multiplicador".
  // Vamos usar a logica requisitada: "stdNet = stdGuardrail.finalNet" (implicando logica completa).
  // Simplificacao: usaremos stdAfterDiscount (com desconto) como comparativo direto, ou stdEffective.
  // Vamos usar stdEffective para ser coerente com "quanto custaria Standard".

  const stdNet = Math.round(stdEffective);
  const stdVat = round(stdNet * vatRate);
  const stdGross = round(stdNet * (1 + vatRate));

  const thisNet = round(feeTotal);
  const thisVat = round(feeTotal * vatRate);
  const thisGross = round(feeTotal * (1 + vatRate));

  const deltaVsStandard = {
    net: thisNet - stdNet,
    vat: thisVat - stdVat,
    gross: thisGross - stdGross,
  };

  const effortMap = buildEffortMap(compMult, scenario, specCount);

  const estimatedCost = estimatedInternalCost(effortMap);
  const margin = feeTotal > 0 ? ((feeTotal - estimatedCost) / feeTotal) * 100 : 0;

  const strategicRisk = riskEngine({
    marginPct: margin,
    scenario,
    complexity,
    area: safeArea,
    specCount,
    discountPct: appliedDiscount,
    discountStatus: discountAudit.status,
    units,
    template
  });

  const phases = phasesBreakdown(feeTotal, scenario, safeArea, complexity, template);
  const paymentPlan = buildPaymentPlan(feeTotal, scenario).map(p => ({
    ...p,
    vat: round(p.value * vatRate)
  }));

  const vat = round(feeTotal * vatRate);
  const totalWithVat = round(feeTotal * (1 + vatRate));

  // --- PASSO 10.1: Payload Ajustado ---
  const net = round(feeTotal);
  // vat declared above already
  const gross = round(net * (1 + vatRate));

  const automationPayload = {
    simulationId: `SIM_${Date.now()}`,
    templateId,
    scenarioId: scenario,
    client: { name: params.clientName || '' },
    location: params.location || '',
    fees: { net, vatRate, gross },
    payments: paymentPlan.map((p, idx) => ({
      id: `PAY_${idx + 1}`,
      name: p.name,
      phaseId: p.phaseId,
      percentage: p.percentage,
      valueNet: p.value,
      dueDays: p.dueDays
    })),
    tasks: {
      archIds: effortMap.map(e => e.taskId),
      specIds: selectedSpecs
    },
    // Updated Payload Structure
    scenario: {
      id: scenarioPack.id,
      labelPT: scenarioPack.labelPT,
      revisionsIncluded: scenarioPack.revisionsIncluded,
      deliverablesPT: scenarioPack.deliverablesPT,
      deliverablesEN: scenarioPack.deliverablesEN,
      exclusionsPT: scenarioPack.exclusionsPT,
      exclusionsEN: scenarioPack.exclusionsEN,
    },
    deltaVsStandard,
    configSnapshot: {
      vatRate,
      thresholds: FINANCE_THRESHOLDS,
      multipliers: {
        complexity: compMult,
        scenario: scenMult,
      },
      scenarioConfig: SCENARIO_CATALOG[scenario]
    },
    meta: {
      createdAt: new Date().toISOString(),
      configSnapshot: {
        compMult,
        scenMult,
        appliedDiscount,
        guardrail: discountAudit.status // Using available audit status
      }
    },
    schedule: { startDate: new Date().toISOString() }
  };

  return {
    feeArch: round(feeArch),
    feeSpec: round(feeSpec),
    feeTotal: round(feeTotal),
    vat: vat,
    totalWithVat: totalWithVat,
    vatRate: vatRate,
    phasesBreakdown: phases,
    paymentPlan: paymentPlan,
    effortMap,
    selectedSpecs,
    units: units || {},
    strategic: {
      margin: round(margin),
      riskLevel: strategicRisk.riskLevel,
      riskScore: strategicRisk.riskScore,
      alerts: [...(discountEval.alerts || []), ...strategicRisk.alerts],
      recommendations: strategicRisk.recommendations,
      signals: strategicRisk.signals,
      estimatedCost: round(estimatedCost),
      isHealthy: margin >= FINANCE_THRESHOLDS.marginBlock && strategicRisk.riskLevel !== 'high',
      isBlocked: margin < FINANCE_THRESHOLDS.marginBlock,
    },
    scenarioPack: {
      id: scenarioPack.id,
      labelPT: scenarioPack.labelPT,
      multiplier: scenarioPack.multiplier,
      revisionsIncluded: scenarioPack.revisionsIncluded,
      deliverablesPT: scenarioPack.deliverablesPT,
      deliverablesEN: scenarioPack.deliverablesEN,
      exclusionsPT: scenarioPack.exclusionsPT,
      exclusionsEN: scenarioPack.exclusionsEN,
      notesPT: scenarioPack.notesPT,
      notesEN: scenarioPack.notesEN
    },
    deltaVsStandard,
    meta: {
      templateId,
      pricingModel: template.pricingModel,
      appliedDiscount,
      discountAudit,
      specCount,
      compMult,
      scenMult,
      minFeeApplied,
      units: units || {},
      vatRate,
      scenarioDiffs: {
        standard: SCENARIO_CATALOG.standard.multiplier,
        current: SCENARIO_CATALOG[scenario].multiplier
      }
    },
    automationPayload
  };
};
