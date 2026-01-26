
import { FeeTemplate, Phase, Discipline, TemplatePhaseWeight, TemplateSpecialty } from '../types';

export const templates: FeeTemplate[] = [
  { templateId: "MORADIA_LICENSE", namePT: "Moradia — Licenciamento", nameEN: "House — Permitting", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 1, rateArchPerM2: 65, minFeeTotal: 4500 },
  { templateId: "MORADIA_EXEC", namePT: "Moradia — Execução", nameEN: "House — Construction Docs", processType: "exec", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 2, rateArchPerM2: 85, minFeeTotal: 6500 },
  { templateId: "MORADIA_REHAB", namePT: "Moradia — Reabilitação/Ampliação", nameEN: "House — Rehab", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 3, rateArchPerM2: 75, minFeeTotal: 5500 },
  { templateId: "LEGAL", namePT: "Moradia — Legalização (Simplex)", nameEN: "House — Legalization", processType: "lic", pricingModel: "PACKAGE", legalProfile: "PT", sortOrder: 4, baseFeeArch: 4000, minFeeTotal: 2500 },
  {
    templateId: "MULTIFAMILY",
    namePT: "Multifamiliar — Licenciamento",
    nameEN: "Multi-family — Permitting",
    processType: "lic",
    pricingModel: "UNIT",
    legalProfile: "PT",
    sortOrder: 5,
    minFeeTotal: 15000,
    unitPricing: {
      unitKind: 'APARTMENT',
      baseFeeArch: 9000,
      feePerUnitArch: 900,
      feePerM2Arch: 18,
      includedUnits: 8,
      extraUnitMultiplier: 1.08,
    }
  },
  { templateId: "RESTAURANT", namePT: "Comercial — Restauração", nameEN: "Commercial — Restaurant", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 6, rateArchPerM2: 95, minFeeTotal: 5000 },
  {
    templateId: "LOTEAMENTO",
    namePT: "Loteamento / Urbanismo",
    nameEN: "Subdivision",
    processType: "lic",
    pricingModel: "UNIT",
    legalProfile: "PT",
    sortOrder: 7,
    minFeeTotal: 8000,
    unitPricing: {
      unitKind: 'LOT',
      baseFeeArch: 4500,
      feePerUnitArch: 650,
      includedUnits: 6,
      extraUnitMultiplier: 1.10,
    }
  },
  { templateId: "PIP", namePT: "PIP (Pedido de Informação Prévia)", nameEN: "PIP (Pre-Application)", processType: "lic", pricingModel: "PACKAGE", legalProfile: "PT", sortOrder: 8, baseFeeArch: 2500, minFeeTotal: 1500 },
];

export const phaseCatalog: Phase[] = [
  { phaseId: "A0", phaseType: "ARCH", labelPT: "A0. Programa Base", labelEN: "A0. Briefing", shortPT: "Definição de objetivos, requisitos e condicionantes do projeto.", shortEN: "Definition of project goals and constraints." },
  { phaseId: "A1", phaseType: "ARCH", labelPT: "A1. Estudo Prévio", labelEN: "A1. Schematic Design", shortPT: "Conceito e solução volumétrica para validação com o cliente.", shortEN: "Conceptual solution for client validation." },
  { phaseId: "A2", phaseType: "ARCH", labelPT: "A2. Licenciamento (RJUE)", labelEN: "A2. Permitting", shortPT: "Peças técnicas para submissão e aprovação camarária (RJUE).", shortEN: "Technical submission for council approval (RJUE)." },
  { phaseId: "A3", phaseType: "ARCH", labelPT: "A3. Projeto de Execução", labelEN: "A3. Construction Docs", shortPT: "Detalhe técnico rigoroso para construção sem improvisos.", shortEN: "Rigorous technical detail for construction." },
  { phaseId: "A4", phaseType: "ARCH", labelPT: "A4. Assistência Técnica", labelEN: "A4. Tech Assistance", shortPT: "Esclarecimentos em obra e tramitação administrativa final.", shortEN: "Site support and final administrative procedures." },
];

export const disciplines: Discipline[] = [
  {
    disciplineId: "STRUCT",
    labelPT: "Estabilidade / Estruturas",
    labelEN: "Structure",
    phases: [
      { phaseId: "A1", labelPT: "Pré-dimensionamento", shortPT: "Soluções estruturais e condicionantes base." },
      { phaseId: "A2", labelPT: "Projeto para licenciamento", shortPT: "Peças e memórias para submissão." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Detalhe construtivo, pormenores, compatibilização." },
    ]
  },
  {
    disciplineId: "WATER",
    labelPT: "Redes de Águas e Saneamento",
    labelEN: "Water & Sewage",
    phases: [
      { phaseId: "A1", labelPT: "Traçados base", shortPT: "Prumadas, zonas técnicas e condicionantes." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Peças desenhadas e memória descritiva." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Dimensionamentos finais e pormenores." },
    ]
  },
  {
    disciplineId: "ELEC",
    labelPT: "Instalações Elétricas",
    labelEN: "Electrical",
    phases: [
      { phaseId: "A1", labelPT: "Estratégia e zonas técnicas", shortPT: "Quadros, shafts, acessos e cargas." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto regulamentar para submissão." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Mapas finais, compatibilização e detalhes." },
    ]
  },
  {
    disciplineId: "SCIE",
    labelPT: "Segurança Contra Incêndio (SCIE)",
    labelEN: "Fire Safety",
    phases: [
      { phaseId: "A1", labelPT: "Estratégia SCIE", shortPT: "Compartimentação, evacuação e risco." },
      { phaseId: "A2", labelPT: "Projeto SCIE", shortPT: "Peças e medidas de autoproteção base." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Pormenorização e compatibilização em obra." },
    ]
  },
  {
    disciplineId: "THERM",
    labelPT: "Térmica (REH / RECS)",
    labelEN: "Thermal",
    phases: [
      { phaseId: "A1", labelPT: "Pré-avaliação", shortPT: "Estratégia de desempenho e envolvente." },
      { phaseId: "A2", labelPT: "Projeto térmico", shortPT: "Cálculos e documentação regulamentar." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Ajustes finais, compatibilização e materiais." },
    ]
  },
  {
    disciplineId: "ACOUST",
    labelPT: "Acústica",
    labelEN: "Acoustics",
    phases: [
      { phaseId: "A1", labelPT: "Definição de soluções", shortPT: "Critérios e soluções tipo por zona." },
      { phaseId: "A2", labelPT: "Projeto acústico", shortPT: "Peças e relatório regulamentar." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Detalhes e validações para obra." },
    ]
  },
  {
    disciplineId: "ITED",
    labelPT: "ITED",
    labelEN: "Telecom (ITED)",
    phases: [
      { phaseId: "A1", labelPT: "Estratégia ITED", shortPT: "Risers, caminhos de cabos e pontos." },
      { phaseId: "A2", labelPT: "Projeto ITED", shortPT: "Peças regulamentares e termos." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Pormenorização e compatibilização." },
    ]
  },
  {
    disciplineId: "HVAC",
    labelPT: "AVAC / Ventilação",
    labelEN: "HVAC",
    phases: [
      { phaseId: "A1", labelPT: "Estratégia AVAC", shortPT: "Zonas técnicas e opções de sistema." },
      { phaseId: "A2", labelPT: "Projeto", shortPT: "Cálculos, dimensionamentos e peças." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Detalhes e compatibilização." },
    ]
  },
  {
    disciplineId: "GAS",
    labelPT: "Gás",
    labelEN: "Gas",
    phases: [
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto de gás regulamentar." },
      { phaseId: "A3", labelPT: "Execução", shortPT: "Pormenorização de traçados." },
    ]
  }
];

export const exclusionsPT = [
  "Taxas camarárias e de entidades externas",
  "Levantamentos topográficos e de arquitetura pré-existente",
  "Estudos geotécnicos, ensaios laboratoriais e sondagens",
  "Fiscalização e Direção de Obra (salvo contrato específico)",
  "Plano de Segurança e Saúde (PSS) e Coordenação de Segurança",
  "Impressão de cópias físicas (entrega padrão em formato digital)",
];

export const extrasPT = [
  { label: "Revisão adicional (pós-validação)", price: "85€/h" },
  { label: "Visita extra a obra ou fornecedor", price: "125€/un" },
  { label: "Telas Finais (as-built)", price: "Sob consulta" },
  { label: "Coordenação BIM (LOD 300+)", price: "+15% Honorários" },
];

export const templateSpecialties: TemplateSpecialty[] = [
  { templateId: "MORADIA_LICENSE", disciplineId: "STRUCT", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "WATER", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "ELEC", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "ITED", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "THERM", required: true, defaultOn: true },
  { templateId: "RESTAURANT", disciplineId: "SCIE", required: true, defaultOn: true },
  { templateId: "RESTAURANT", disciplineId: "HVAC", required: true, defaultOn: true },
];
