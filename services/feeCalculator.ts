// services/feeCalculator.ts
import { templates, phaseCatalog } from './feeData';
import { CalculationParams, Complexity, Scenario, UnitsInput, FeeTemplate } from '../types';

// ---------- CONFIG (ajusta aqui sem mexer na lógica) ----------
const VAT_RATE = 0.23;

// Multiplicadores
const COMPLEXITY_MULT: Record<Complexity, number> = { 1: 0.9, 2: 1.25, 3: 1.8 };
const SCENARIO_MULT: Record<Scenario, number> = { essential: 0.85, standard: 1.0, premium: 1.5 };

// Especialidades: base incluída + incremento
const INCLUDED_SPECS = 4;
const SPEC_FEE_EXTRA_PCT = 0.07;   // +7% por especialidade acima de INCLUDED_SPECS
const SPEC_HOURS_EXTRA_PCT = 0.05; // +5% horas coord por especialidade extra

// Rates internos (custos) — aproximação realista p/ cálculo de margem
const INTERNAL_RATES = {
  senior: 55,      // CEO
  architect: 45,   // arquiteto (misto)
  team: 38,        // média (Jéssica/Sofia)
} as const;

const OVERHEAD_MULT = 1.20; // 20% overhead (software, admin, deslocações, etc.)

const PROFILE_RATE_KEY: Record<string, keyof typeof INTERNAL_RATES> = {
  "Arquiteto Sénior": "senior",
  "Equipa Técnica": "team",
  "Arquiteto": "architect",
  "Arquiteto + Equipa": "team",
};

// Fases: pesos (mantive os teus, mas com normalização robusta)
const ALL_PHASE_WEIGHTS = [
  { id: "A0", weight: 0.20 },
  { id: "A1", weight: 0.25 },
  { id: "A2", weight: 0.30 },
  { id: "A3", weight: 0.15 },
  { id: "A4", weight: 0.10 },
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

function calcSpecsFee(area: number, baseRateSpec: number, compMult: number, scenMult: number, specCount: number) {
  const safeArea = Math.max(0, Number(area || 0));
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);
  const specMult = 1 + extraSpecs * SPEC_FEE_EXTRA_PCT;
  return safeArea * baseRateSpec * compMult * scenMult * specMult;
}

function buildEffortMap(compMult: number, scenario: Scenario, specCount: number) {
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);

  const rows = [
    { label: "Programa + EP", hours: round((8 + 34) * compMult), profile: "Arquiteto Sénior", active: true },
    { label: "Licenciamento", hours: round(38 * compMult), profile: "Equipa Técnica", active: true },
    { label: "Coordenação Especialidades", hours: round(24 * compMult * (1 + extraSpecs * SPEC_HOURS_EXTRA_PCT)), profile: "Arquiteto", active: true },
    { label: "Projeto de Execução", hours: round(56 * compMult), profile: "Arquiteto + Equipa", active: scenario === 'premium' },
    { label: "Assistência Técnica", hours: round(18 * compMult), profile: "Equipa Técnica", active: scenario === 'premium' },
  ];

  return rows.filter(r => r.active);
}

function estimatedInternalCost(effortMap: { hours: number; profile: string }[]) {
  const base = effortMap.reduce((acc, row) => {
    const key = PROFILE_RATE_KEY[row.profile] ?? "team";
    const rate = INTERNAL_RATES[key];
    return acc + row.hours * rate;
  }, 0);

  return base * OVERHEAD_MULT;
}

function phasesBreakdown(feeTotal: number, scenario: Scenario) {
  const active = scenario === 'premium'
    ? ALL_PHASE_WEIGHTS
    : ALL_PHASE_WEIGHTS.filter(w => ['A0', 'A1', 'A2'].includes(w.id));

  const normalized = normalizeWeights(active as any);

  return normalized.map(pw => {
    const info = phaseCatalog.find(p => p.phaseId === pw.id);
    return {
      phaseId: pw.id,
      label: info?.labelPT || pw.id,
      description: info?.shortPT || "",
      value: round(feeTotal * pw.weight),
    };
  });
}

function riskEngine(input: {
  marginPct: number;
  scenario: Scenario;
  complexity: Complexity;
  area: number;
  specCount: number;
  discountPct: number;
  units?: UnitsInput;
  template?: FeeTemplate;
}) {
  const { marginPct, scenario, complexity, area, specCount, discountPct, units, template } = input;
  const extraSpecs = Math.max(0, specCount - INCLUDED_SPECS);

  let riskScore = 0;
  const signals: string[] = [];
  const alerts: string[] = [];
  const recommendations: string[] = [];

  // Complexidade
  if (complexity === 3) { riskScore += 25; signals.push("Complexity_High"); }
  else if (complexity === 2) { riskScore += 12; signals.push("Complexity_Medium"); }

  // Cenário
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

  // Descontos agressivos
  if (discountPct > 15) { riskScore += 10; signals.push("Discount_Over_15"); }
  if (discountPct > 20) { riskScore += 20; signals.push("Discount_Over_20"); }

  // Margem
  if (marginPct < 50) { riskScore += 15; signals.push("Margin_Tight"); }
  if (marginPct < 45) { riskScore += 30; signals.push("Margin_Under_Redline"); }

  riskScore = clamp(riskScore, 0, 100);

  const riskLevel: 'low' | 'medium' | 'high' =
    riskScore >= 60 ? 'high' :
      riskScore >= 30 ? 'medium' : 'low';

  // Alertas e recomendações (ação concreta)
  if (marginPct < 45) {
    alerts.push("🚨 BLOQUEIO: Margem crítica (<45%). Configuração financeiramente inviável.");
    recommendations.push("Reduzir desconto (≤10%) ou subir cenário para Profissional/Executivo.");
    recommendations.push("Rever rate por m² ou aumentar fee mínima do template.");
  } else if (marginPct < 50) {
    alerts.push("🟡 Margem mínima operacional (<50%). Espaço de manobra nulo.");
    recommendations.push("Evitar alterações fora de escopo; preferir Modo Profissional.");
  } else if (marginPct < 60) {
    alerts.push("🟢 Margem aceitável. Considerar otimização para aproximar de 60%.");
  }

  // Regras de risco específicas
  if (scenario === 'essential' && specCount > 4) {
    alerts.push("⚠️ Risco Técnico: Modo Essencial com excesso de disciplinas (>4). Aumenta risco de falhas na coordenação.");
    recommendations.push("Mudar para Modo Profissional para incluir coordenação mais robusta.");
  }

  if (scenario !== 'premium' && complexity === 3 && area > 500) {
    alerts.push("⚠️ Desequilíbrio: Grande escala + Complexidade Alta sem Modo Executivo.");
    recommendations.push("Recomenda-se Modo Executivo para reduzir risco e estabilizar expectativas.");
  }

  if (riskLevel === 'high' || signals.length >= 3 || discountPct > 15) {
    alerts.push("🚩 Alerta Estratégico: Elevado potencial de desgaste psicológico/comercial.");
    recommendations.push("Reforçar exclusões e limitar revisões incluídas no âmbito.");
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

  const specCount = selectedSpecs.length;

  const safeArea = Math.max(0, Number(area || 0));
  const compMult = COMPLEXITY_MULT[complexity] || 1.0;
  const scenMult = SCENARIO_MULT[scenario] || 1.0;

  const baseRateSpec = 28;

  const feeArchRaw = calcArchitectureFee(template, safeArea, compMult, scenMult, units);
  const feeSpecRaw = calcSpecsFee(safeArea, baseRateSpec, compMult, scenMult, specCount);

  const subTotalRaw = feeArchRaw + feeSpecRaw;

  // Processamento de desconto
  const discountType = discount?.type || 'none';
  const discountVal = Number(discount?.value || 0);
  const appliedDiscount = discountType !== 'none' ? clamp(discountVal, 0, 25) : 0;
  const discountAmount = (subTotalRaw * appliedDiscount) / 100;

  const feeAfterDiscount = subTotalRaw - discountAmount;

  const minFee = template.minFeeTotal ?? 0;
  const feeTotal = Math.max(feeAfterDiscount, minFee);

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
    units,
    template
  });

  const phases = phasesBreakdown(feeTotal, scenario);

  const automationPayload = {
    simulationId: `SIM_${Date.now()}`,
    templateId,
    scenarioId: scenario,
    client: { name: params.clientName || '' }, // We'll need to pass this or get it from somewhere
    location: params.location || '',
    fees: { total: feeTotal, vatRate: VAT_RATE },
    payments: phases.map(p => ({
      name: p.label,
      phaseId: p.phaseId,
      percentage: Math.round((p.value / feeTotal) * 100),
      value: p.value,
      dueDays: 30
    })),
    tasks: {
      arch: effortMap.map(e => e.label), // Simplified for now
      spec: selectedSpecs
    },
    schedule: { startDate: new Date().toISOString() }
  };

  return {
    feeArch: round(feeArchRaw),
    feeSpec: round(feeSpecRaw),
    feeTotal: round(feeTotal),
    vat: round(feeTotal * VAT_RATE),
    totalWithVat: round(feeTotal * (1 + VAT_RATE)),
    phasesBreakdown: phases,
    effortMap,
    selectedSpecs,
    units: units || {},
    strategic: {
      margin: round(margin),
      riskLevel: strategicRisk.riskLevel,
      riskScore: strategicRisk.riskScore,
      alerts: strategicRisk.alerts,
      recommendations: strategicRisk.recommendations,
      signals: strategicRisk.signals,
      estimatedCost: round(estimatedCost),
      isHealthy: margin >= 45 && strategicRisk.riskLevel !== 'high',
      isBlocked: margin < 45,
    },
    meta: {
      templateId,
      pricingModel: template.pricingModel,
      appliedDiscount,
      specCount,
      compMult,
      scenMult,
      minFeeApplied: feeAfterDiscount < minFee,
      units: units || {}
    },
    automationPayload
  };
};
