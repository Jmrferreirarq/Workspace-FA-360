import { Scenario } from '../types';

export type ScenarioPack = {
  id: Scenario;
  labelPT: string;
  multiplier: number;
  revisionsIncluded: number;  // global revision rounds included
  deliverablesPT: string[];   // main deliverables (PT)
  deliverablesEN: string[];   // main deliverables (EN)
  exclusionsPT: string[];     // standard exclusions (PT)
  exclusionsEN: string[];     // standard exclusions (EN)
  notesPT?: string;
  notesEN?: string;
};

export const SCENARIO_CATALOG: Record<Scenario, ScenarioPack> = {
  essential: {
    id: 'essential',
    labelPT: 'Essencial',
    multiplier: 0.85,
    revisionsIncluded: 2,
    deliverablesPT: [
      'Programa Base + checklist de decisões',
      'Estudo Prévio (1 solução)',
      'Peças para licenciamento (mínimo necessário)',
      'Projeto de Execução (Peças Base)',
      'Assistência Técnica (Standard)',
      'Plano de pagamento por marcos'
    ],
    deliverablesEN: [
      'Program & decision checklist',
      'Schematic design (1 option)',
      'Permitting package (minimum required)',
      'Basic coordination with specialties',
      'Milestone-based payment plan'
    ],
    exclusionsPT: [
      'Taxas municipais e de entidades',
      'Levantamentos/ensaios não contratados (topografia, geotecnia, etc.)',
      'Fiscalização/direção de obra',
      'Reuniões extra e revisões adicionais',
      'Alterações substanciais após validação'
    ],
    exclusionsEN: [
      'Authority fees',
      'Surveys/tests not contracted (topo, geotech, etc.)',
      'Site supervision/inspection',
      'Extra meetings and additional revisions',
      'Major changes after validation'
    ],
    notesPT: 'Recomendado para projetos de baixa complexidade e escopo muito controlado.',
    notesEN: 'Recommended for low-complexity projects with tightly controlled scope.'
  },

  standard: {
    id: 'standard',
    labelPT: 'Standard',
    multiplier: 1.0,
    revisionsIncluded: 3,
    deliverablesPT: [
      'Programa Base + métricas',
      'Estudo Prévio (1–2 opções quando aplicável)',
      'Licenciamento completo (peças desenhadas + escritas)',
      'Projeto de Execução (Completo p/ Obra)',
      'Assistência Técnica (Standard c/ Visitas)',
      'Checklist legal e plano de pagamentos'
    ],
    deliverablesEN: [
      'Program + baseline metrics',
      'Schematic design (1–2 options when applicable)',
      'Full permitting package (drawings + written docs)',
      'Reinforced coordination with specialties',
      'Legal checklist and payment plan'
    ],
    exclusionsPT: [
      'Taxas e emolumentos',
      'Levantamentos/ensaios não contratados',
      'Fiscalização/direção de obra',
      'Alterações substanciais após validação'
    ],
    exclusionsEN: [
      'Fees and charges',
      'Surveys/tests not contracted',
      'Site supervision/inspection',
      'Major changes after validation'
    ],
    notesPT: 'Equilíbrio ideal: custo/risco/entregas para a maioria dos casos.',
    notesEN: 'Best balance of cost/risk/deliverables for most projects.'
  },

  premium: {
    id: 'premium',
    labelPT: 'Premium',
    multiplier: 1.5,
    revisionsIncluded: 4,
    deliverablesPT: [
      'Programa Base + estratégia de aprovação',
      'Estudo Prévio com validações (opções quando aplicável)',
      'Licenciamento + coordenação avançada',
      'Projeto de Execução (pormenorização + mapas)',
      'Assistência técnica (escopo definido)',
      'Plano de entregas + controlo de alterações'
    ],
    deliverablesEN: [
      'Program + approval strategy',
      'Schematic design with validations (options when applicable)',
      'Permitting + advanced coordination',
      'Construction documents (details + schedules)',
      'Technical support (defined scope)',
      'Delivery plan + change control'
    ],
    exclusionsPT: [
      'Taxas e emolumentos',
      'Levantamentos/ensaios não contratados',
      'Fiscalização/direção de obra (separado)',
      'Alterações fora do âmbito contratual'
    ],
    exclusionsEN: [
      'Fees and charges',
      'Surveys/tests not contracted',
      'Site supervision/inspection (separate)',
      'Out-of-scope changes'
    ],
    notesPT: 'Recomendado para complexidade alta, escala grande e clientes exigentes.',
    notesEN: 'Recommended for high complexity, larger scale, and demanding stakeholders.'
  }
};
