
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
  {
    templateId: "PH_CHANGE",
    namePT: "Alteração de Propriedade Horizontal",
    nameEN: "Horizontal Property Alteration",
    processType: "lic",
    pricingModel: "UNIT",
    legalProfile: "PT",
    sortOrder: 16,
    minFeeTotal: 1500,
    unitPricing: {
      unitKind: 'FRACTION',     // New unit type
      baseFeeArch: 1250,        // Cabeça do processo
      feePerUnitArch: 200,      // Valor por fração
      feePerM2Arch: 0,
      includedUnits: 0,         // Base não inclui frações, paga-se todas
      extraUnitMultiplier: 1.0
    }
  },
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
      { phaseId: "A1", labelPT: "Pre-dimensionamento", shortPT: "Pre-dimensionamento estrutural, definição de materiais (betão, aço, madeira), análise de vãos críticos e coordenação de juntas de dilatação." },
      { phaseId: "A2", labelPT: "Projeto para licenciamento", shortPT: "Memória descritiva e justificativa, plantas de fundações e infraestruturas, e cálculos de estabilidade regulamentares para submissão municipal." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de armaduras e ligações, mapas de quantidades, compatibilização final BIM (Clash Detection) e assistência técnica." },
    ]
  },
  {
    disciplineId: "WATER_SUPPLY",
    labelPT: "Rede de Abastecimento de Água",
    labelEN: "Water Supply",
    phases: [
      { phaseId: "A1", labelPT: "Traçados base", shortPT: "Definição de traçados e prumadas, localização de ramais de ligação e dimensionamento preliminar." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto regulamentar de abastecimento de água (predial), cálculo de caudais e memória descritiva." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Dimensionamento detalhado, pormenores de instalação de tubagens, coletores e montagem de louças." },
    ]
  },
  {
    disciplineId: "SEWAGE",
    labelPT: "Rede de Águas Residuais",
    labelEN: "Wastewater Drainage",
    phases: [
      { phaseId: "A1", labelPT: "Estratégia", shortPT: "Definição de rede de esgotos domésticos e caixas de visita." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto regulamentar de drenagem de águas residuais, ligação à rede pública ou fossa estanque." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenores de caixas de visita, ventilações primárias e secundárias, e sifonagem." },
    ]
  },
  {
    disciplineId: "RAINWATER",
    labelPT: "Rede de Águas Pluviais",
    labelEN: "Rainwater Drainage",
    phases: [
      { phaseId: "A1", labelPT: "Estratégia", shortPT: "Análise de áreas de recolha, caleiras e tubos de queda." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto de drenagem pluvial, cálculo de caudais de ponta e sistemas de retenção se exigido." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de caleiras, ralos, pormenores de impermeabilização e ligação ao coletor público." },
    ]
  },
  {
    disciplineId: "ELEC_SHEET",
    labelPT: "Ficha Eletrotécnica",
    labelEN: "Electrotechnical Sheet",
    phases: [
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Ficha eletrotécnica simplificada para potências até 41.4kVA." },
    ]
  },
  {
    disciplineId: "ELEC_PROJECT",
    labelPT: "Projeto Elétrico",
    labelEN: "Electrical Project",
    phases: [
      { phaseId: "A1", labelPT: "Estudo Prévio", shortPT: "Dimensionamento de potências, localização de quadros e definição de caminhos de cabos." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto de instalações elétricas completo, telecomunicações e segurança, para potências superiores." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Mapas de aparelhagem, esquemas unifilares detalhados e compatibilização com tetos falsos." },
    ]
  },
  {
    disciplineId: "SCIE",
    labelPT: "Seguranca Contra Incendio (SCIE)",
    labelEN: "Fire Safety",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia SCIE", shortPT: "Definição de compartimentação, caminhos de evacuação e análise de risco preliminar para validação do conceito." },
      { phaseId: "A2", labelPT: "Projeto SCIE", shortPT: "Memória de segurança, plantas de implantação de medidas de autoproteção e sinalética para aprovação na ANEPC." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de sistemas ativos (extinção, deteção) e compatibilização de infraestruturas de segurança em obra." },
    ]
  },
  {
    disciplineId: "THERM",
    labelPT: "Termica (REH / RECS)",
    labelEN: "Thermal",
    phases: [
      { phaseId: "A1", labelPT: "Pre-avaliacao", shortPT: "Pré-avaliação do desempenho térmico da envolvente, análise de pontes térmicas e orientação solar passiva." },
      { phaseId: "A2", labelPT: "Projeto termico", shortPT: "Cálculos regulamentares (REH/RECS), definição de isolamentos e vãos envidraçados, e emissão de pré-certificado energético." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de isolamentos térmicos, compatibilização com outros sistemas e apoio à escolha de materiais em obra." },
    ]
  },
  {
    disciplineId: "ACOUST",
    labelPT: "Acustica",
    labelEN: "Acoustics",
    phases: [
      { phaseId: "A1", labelPT: "Definicao de solucoes", shortPT: "Definição de critérios de isolamento sonoro e análise de soluções tipo para pavimentos, paredes e coberturas." },
      { phaseId: "A2", labelPT: "Projeto acustico", shortPT: "Relatório de ensaios e cálculos regulamentares de isolamento acústico e controle de ruído de equipamentos." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Detalhes de execução de juntas, cortes acústicos e compatibilização de passagens de tubagens em obra." },
    ]
  },
  {
    disciplineId: "ITED",
    labelPT: "ITED",
    labelEN: "Telecom (ITED)",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia ITED", shortPT: "Estratégia de rede, localização de ATI e caminhos de cabos principais articulados com o projeto de arquitetura." },
      { phaseId: "A2", labelPT: "Projeto ITED", shortPT: "Projeto regulamentar ITED com dimensionamento de redes, termos de responsabilidade e peças desenhadas para submissão." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de tomadas, armários e compatibilização final de infraestruturas tecnológicas." },
    ]
  },
  {
    disciplineId: "HVAC",
    labelPT: "AVAC / Ventilacao",
    labelEN: "HVAC",
    phases: [
      { phaseId: "A1", labelPT: "Estrategia AVAC", shortPT: "Estudo de estratégia de climatização e ventilação, definição de áreas técnicas e espaços para condutas." },
      { phaseId: "A2", labelPT: "Projeto", shortPT: "Dimensionamento de cargas térmicas, seleção de sistemas e rede de condutas para licenciamento ambiental." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Planos de montagem detalhados, compatibilização BIM (clash detection) e assistência técnica na obra." },
    ]
  },
  {
    disciplineId: "GAS",
    labelPT: "Projeto de Rede de Gás Certificado",
    labelEN: "Certified Gas Project",
    phases: [
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Projeto de instalação de gás em conformidade com as normas de segurança, peças desenhadas e termos regulamentares." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de traçados, ventilações exigidas e compatibilização com as restantes redes técnicas." },
    ]
  },
  {
    disciplineId: "LANDSCAPE",
    labelPT: "Arranjos Exteriores",
    labelEN: "Landscape Arch.",
    phases: [
      { phaseId: "A1", labelPT: "Estudo previo", shortPT: "Definição de zonas verdes, pavimentos exteriores e integração paisagística com a arquitetura." },
      { phaseId: "A2", labelPT: "Licenciamento", shortPT: "Peças desenhadas e escritas para aprovação de arranjos exteriores e modelação de terreno." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Pormenorização de plantações, rega, iluminação exterior e detalhes construtivos de pavimentos." },
    ]
  },
  {
    disciplineId: "ELECTROMECH",
    labelPT: "Inst. Eletromecânicas",
    labelEN: "Electromechanical",
    phases: [
      { phaseId: "A1", labelPT: "Estudo", shortPT: "Definição e dimensionamento preliminar de elevadores, monta-cargas ou outros equipamentos mecânicos." },
      { phaseId: "A2", labelPT: "Projeto", shortPT: "Especificações técnicas e integração no projeto de licenciamento (se aplicável)." },
      { phaseId: "A3", labelPT: "Execucao", shortPT: "Apoio à contratação, análise de fichas técnicas de equipamentos e coordenação de montagem." },
    ]
  },
  {
    disciplineId: "CERT_ENERGY",
    labelPT: "Pré-Certificado Energético",
    labelEN: "Pre-Energy Certificate",
    phases: [
      { phaseId: "A2", labelPT: "Pre-Certificado", shortPT: "Emissão de Pré-Certificado Energético (SCE) obrigatório para emissão de licença de construção." },
      { phaseId: "A3", labelPT: "Certificado Final", shortPT: "Vistoria final e emissão do Certificado Energético (SCE) para licença de utilização." },
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

import { ExtraService } from './types_extras';

export const catalogExtras: ExtraService[] = [
  // 3D Visualization
  { id: 'pack_3d_basic', label: 'Pack 3D Essencial', description: '3 Imagens Fotorrealistas (Exteriores)', type: 'fixed', basePrice: 750 },
  { id: 'pack_3d_standard', label: 'Pack 3D Standard', description: '5 Imagens (Ext + Int) + Esquemas 3D', type: 'fixed', basePrice: 1250 },
  { id: 'pack_3d_premium', label: 'Pack 3D Premium', description: '8 Imagens + Video Curto + Maquete Virtual', type: 'fixed', basePrice: 2000 },

  // Interior Design
  { id: 'interior_design', label: 'Design de Interiores', description: 'Projeto de execução (layout, mobiliário fixo, iluminação decorativa)', type: 'area_based', pricePerM2: 25 },
  
  // Operational Extras
  { id: 'extra_revision', label: 'Revisao adicional (pos-validacao)', description: 'Ciclo extra de revisoes alem do estipulado', type: 'quantity', pricePerUnit: 450 },
  { id: 'extra_visit', label: 'Visita extra a obra', description: 'Deslocacao adicional a pedido do cliente', type: 'quantity', pricePerUnit: 125 },
  // { id: 'as_built', label: 'Projeto de Alterações no Decurso de Obra', description: 'Atualizacao rigorosa dos desenhos finais', type: 'fixed', basePrice: 1500 }, // Moved to Standard Deliverables
  { id: 'bim_coord', label: 'Coordenacao BIM (LOD 300+)', description: 'Gestao avancada de modelo federado', type: 'fixed', basePrice: 2500 },

  // Engineering & Administrative
  { id: 'specs_book', label: 'Caderno de Encargos', description: 'Especificações técnicas detalhadas de materiais e execução', type: 'fixed', basePrice: 1000 },
  { id: 'qty_map', label: 'Mapa de Quantidades', description: 'Levantamento exaustivo de medições para consulta', type: 'fixed', basePrice: 1500 },
  { id: 'budget_est', label: 'Estimativa Orçamental', description: 'Previsão de custos de construção baseada no projeto', type: 'fixed', basePrice: 750 },
  { id: 'use_permit', label: 'Pedido de Utilização', description: 'Instrução do processo final de licença de utilização', type: 'fixed', basePrice: 650 },
  { id: 'site_supervision', label: 'Fiscalização de Obra (Mensal)', description: 'Acompanhamento regular e relatórios (Avença Mensal)', type: 'quantity', pricePerUnit: 750 },
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
