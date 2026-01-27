
import { FeeTemplate, Phase, Discipline, TemplateSpecialty } from '../types';

export const templates: FeeTemplate[] = [
  { templateId: "MORADIA_LICENSE", namePT: "Moradia — Licenciamento", nameEN: "House — Permitting", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 1, rateArchPerM2: 65, minFeeTotal: 4500 },
  { templateId: "MORADIA_EXEC", namePT: "Moradia — Execucao", nameEN: "House — Construction Docs", processType: "exec", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 2, rateArchPerM2: 85, minFeeTotal: 6500 },
  { templateId: "MORADIA_REHAB", namePT: "Moradia — Reabilitacao/Ampliacao", nameEN: "House — Rehab", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 3, rateArchPerM2: 75, minFeeTotal: 5500 },
  { templateId: "LEGAL", namePT: "Moradia — Legalizacao (Simplex)", nameEN: "House — Legalization", processType: "lic", pricingModel: "PACKAGE", legalProfile: "PT", sortOrder: 4, baseFeeArch: 4000, minFeeTotal: 2500 },
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
  { templateId: "RESTAURANT", namePT: "Comercial — Restauracao", nameEN: "Commercial — Restaurant", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 6, rateArchPerM2: 95, minFeeTotal: 5000 },
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
  { templateId: "PIP", namePT: "PIP (Pedido de Informacao Previa)", nameEN: "PIP (Pre-Application)", processType: "lic", pricingModel: "PACKAGE", legalProfile: "PT", sortOrder: 8, baseFeeArch: 2500, minFeeTotal: 1500 },
  { templateId: "BEACH_SUPPORT", namePT: "Apoio de Praia / Bar", nameEN: "Beach Support / Bar", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 9, rateArchPerM2: 85, minFeeTotal: 4000 },
  { templateId: "INTERIOR_DESIGN", namePT: "Interiores & Remodelação", nameEN: "Interior Design", processType: "exec", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 10, rateArchPerM2: 90, minFeeTotal: 3000 },
  { templateId: "RETAIL_SHOP", namePT: "Comércio — Loja / Retalho", nameEN: "Retail / Shop", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 11, rateArchPerM2: 85, minFeeTotal: 3500 },
  { templateId: "OFFICE_HQ", namePT: "Escritórios / Corporate", nameEN: "Offices / HQ", processType: "hybrid", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 12, rateArchPerM2: 75, minFeeTotal: 5000 },
  { templateId: "TOURISM_RURAL", namePT: "Turismo Rural / Hotelaria", nameEN: "Rural Tourism / Hotel", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 13, rateArchPerM2: 80, minFeeTotal: 10000 },
  { templateId: "INDUSTRIAL", namePT: "Industrial / Armazém", nameEN: "Industrial / Warehouse", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 14, rateArchPerM2: 45, minFeeTotal: 6000 },
  { templateId: "LEGAL_GENERAL", namePT: "Legalização / Regularização (Geral)", nameEN: "Legalization (General)", processType: "lic", pricingModel: "EUR_PER_M2", legalProfile: "PT", sortOrder: 15, rateArchPerM2: 60, minFeeTotal: 3000 },
];

export const phaseCatalog: Phase[] = [
  { phaseId: "A0", phaseType: "ARCH", labelPT: "A0. Programa Base", labelEN: "A0. Briefing", shortPT: "Definicao de objetivos, requisitos e condicionantes do projeto.", shortEN: "Definition of project goals and constraints." },
  { phaseId: "A1", phaseType: "ARCH", labelPT: "A1. Estudo Previo", labelEN: "A1. Schematic Design", shortPT: "Conceito e solucao volumetrica para validacao com o cliente.", shortEN: "Conceptual solution for client validation." },
  { phaseId: "A2", phaseType: "ARCH", labelPT: "A2. Licenciamento (RJUE)", labelEN: "A2. Permitting", shortPT: "Pecas tecnicas para submissao e aprovacao camararia (RJUE).", shortEN: "Technical submission for council approval (RJUE)." },
  { phaseId: "A3", phaseType: "ARCH", labelPT: "A3. Projeto de Execucao", labelEN: "A3. Construction Docs", shortPT: "Detalhe tecnico rigoroso para construcao sem improvisos.", shortEN: "Rigorous technical detail for construction." },
  { phaseId: "A4", phaseType: "ARCH", labelPT: "A4. Assistencia Tecnica", labelEN: "A4. Tech Assistance", shortPT: "Esclarecimentos em obra e tramitacao administrativa final.", shortEN: "Site support and final administrative procedures." },
];

export const disciplines: Discipline[] = [
  {
    disciplineId: "STRUCT",
    labelPT: "Estabilidade / Estruturas",
    labelEN: "Structure",
    phases: [
      { phaseId: "A1", labelPT: "Pre-dimensionamento", shortPT: "Solucoes estruturais e condicionantes base." },
      { phaseId: "A2", labelPT: "Projeto para licenciamento", shortPT: "Pecas e memorias para submissao." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhe construtivo, pormenores, compatibilizacao." },
    ]
  },
  {
    disciplineId: "WATER",
    labelPT: "Redes de Aguas e Saneamento",
    labelEN: "Water & Sewage",
    phases: [
      { phaseId: "A1", labelPT: "Tracados base", shortPT: "Prumadas, zonas tecnicas e condicionantes." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Pecas desenhadas e memoria descritiva." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Dimensionamentos finais e pormenores." },
    ]
  },
  {
    disciplineId: "ELEC",
    labelPT: "Instalacoes Eletricas",
    labelEN: "Electrical",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia e zonas tecnicas", shortPT: "Quadros, shafts, acessos e cargas." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto regulamentar para submissao." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Mapas finais, compatibilizacao e detalhes." },
    ]
  },
  {
    disciplineId: "SCIE",
    labelPT: "Seguranca Contra Incendio (SCIE)",
    labelEN: "Fire Safety",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia SCIE", shortPT: "Compartimentacao, evacuacao e risco." },
      { phaseId: "A2", labelPT: "Projeto SCIE", shortPT: "Pecas e medidas de autoprotecao base." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorizacao e compatibilizacao em obra." },
    ]
  },
  {
    disciplineId: "THERM",
    labelPT: "Termica (REH / RECS)",
    labelEN: "Thermal",
    phases: [
      { phaseId: "A1", labelPT: "Pre-avaliacao", shortPT: "Estrategia de desempenho e envolvente." },
      { phaseId: "A2", labelPT: "Projeto termico", shortPT: "Calculos e documentacao regulamentar." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Ajustes finais, compatibilizacao e materiais." },
    ]
  },
  {
    disciplineId: "ACOUST",
    labelPT: "Acustica",
    labelEN: "Acoustics",
    phases: [
      { phaseId: "A1", labelPT: "Definicao de solucoes", shortPT: "Criterios e solucoes tipo por zona." },
      { phaseId: "A2", labelPT: "Projeto acustico", shortPT: "Pecas e relatorio regulamentar." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhes e validacoes para obra." },
    ]
  },
  {
    disciplineId: "ITED",
    labelPT: "ITED",
    labelEN: "Telecom (ITED)",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia ITED", shortPT: "Risers, caminhos de cabos e pontos." },
      { phaseId: "A2", labelPT: "Projeto ITED", shortPT: "Pecas regulamentares e termos." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorizacao e compatibilizacao." },
    ]
  },
  {
    disciplineId: "HVAC",
    labelPT: "AVAC / Ventilacao",
    labelEN: "HVAC",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia AVAC", shortPT: "Zonas tecnicas e opcoes de sistema." },
      { phaseId: "A2", labelPT: "Projeto", shortPT: "Calculos, dimensionamentos e pecas." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhes e compatibilizacao." },
    ]
  },
  {
    disciplineId: "GAS",
    labelPT: "Gas",
    labelEN: "Gas",
    phases: [
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto de gas regulamentar." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorizacao de tracados." },
    ]
  }
];

export const exclusionsPT = [
  "Taxas camararias e de entidades externas",
  "Levantamentos topograficos e de arquitetura pre-existente",
  "Estudos geotecnicos, ensaios laboratoriais e sondagens",
  "Fiscalizacao e Direcao de Obra (salvo contrato especifico)",
  "Plano de Seguranca e Saude (PSS) e Coordenacao de Seguranca",
  "Impressao de copias fisicas (entrega padrao em formato digital)",
];

export const extrasPT = [
  { label: "Revisao adicional (pos-validacao)", price: "85€/h" },
  { label: "Visita extra a obra ou fornecedor", price: "125€/un" },
  { label: "Telas Finais (as-built)", price: "Sob consulta" },
  { label: "Coordenacao BIM (LOD 300+)", price: "+15% Honorarios" },
];

export const templateSpecialties: TemplateSpecialty[] = [
  { templateId: "MORADIA_LICENSE", disciplineId: "STRUCT", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "WATER", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "ELEC", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "ITED", required: true, defaultOn: true },
  { templateId: "MORADIA_LICENSE", disciplineId: "THERM", required: true, defaultOn: true },
  { templateId: "RESTAURANT", disciplineId: "SCIE", required: true, defaultOn: true },
  { templateId: "RESTAURANT", disciplineId: "HVAC", required: true, defaultOn: true },
  { templateId: "BEACH_SUPPORT", disciplineId: "WATER", required: true, defaultOn: true },
  { templateId: "BEACH_SUPPORT", disciplineId: "SCIE", required: true, defaultOn: true },
  { templateId: "OFFICE_HQ", disciplineId: "ELEC", required: true, defaultOn: true },
  { templateId: "OFFICE_HQ", disciplineId: "ITED", required: true, defaultOn: true },
  { templateId: "OFFICE_HQ", disciplineId: "HVAC", required: true, defaultOn: true },
  { templateId: "TOURISM_RURAL", disciplineId: "SCIE", required: true, defaultOn: true },
  { templateId: "TOURISM_RURAL", disciplineId: "THERM", required: true, defaultOn: true },
  { templateId: "TOURISM_RURAL", disciplineId: "ACOUST", required: true, defaultOn: true },
  { templateId: "INDUSTRIAL", disciplineId: "SCIE", required: true, defaultOn: true },
  { templateId: "INDUSTRIAL", disciplineId: "STRUCT", required: true, defaultOn: true },
  { templateId: "LEGAL_GENERAL", disciplineId: "STRUCT", required: true, defaultOn: true },
];
