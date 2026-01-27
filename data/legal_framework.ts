
export enum UrbanOperationType {
    Construction = 'construction',
    Rehabilitation = 'rehabilitation',
    Expansion = 'expansion',
    Demolition = 'demolition',
    UseChange = 'use_change',
    Allotment = 'allotment',
    Simple = 'simple' // Obras de escassa relevancia
}

export interface LegalFramework {
    id: UrbanOperationType;
    label: string;
    description: string;
    applicable_legislation: {
        name: string;
        link?: string;
        description: string;
        legislation_id?: string;
    }[];
    required_elements: string[];
    pdm_focus_areas: string[];
}

export const legalFrameworks: Record<UrbanOperationType, LegalFramework> = {
    [UrbanOperationType.Construction]: {
        id: UrbanOperationType.Construction,
        label: 'Construcao Nova',
        description: 'Edificacao de obra nova em terreno livre ou em substituicao de existente.',
        applicable_legislation: [
            { name: 'DL 555/99 (RJUE)', legislation_id: 'rjue', description: 'Regime Juridico da Urbanizacao e Edificacao (Atualizado pelo Simplex).' },
            { name: 'DL 10/2024 (Simplex)', legislation_id: 'simplex-2024', description: 'Simplificacao dos licenciamentos urbanisticos.' },
            { name: 'RGEU', legislation_id: 'rgeu', description: 'Regulamento Geral das Edificacoes Urbanas.' },
            { name: 'DL 163/2006', legislation_id: 'acessibilidades', description: 'Acessibilidades e Mobilidade Condicionada.' }
        ],
        required_elements: [
            'Levantamento Topografico',
            'Projeto de Arquitetura',
            'Projetos de Especialidades',
            'Termo de Responsabilidade',
            'Calendarizacao da Obra'
        ],
        pdm_focus_areas: [
            'Indices de Ocupacao e Utilizacao',
            'Cerceas e Afastamentos',
            'Estacionamento',
            'Cedencias para Dominio Publico'
        ]
    },
    [UrbanOperationType.Rehabilitation]: {
        id: UrbanOperationType.Rehabilitation,
        label: 'Reabilitacao / Alteracao',
        description: 'Obras de alteracao, conservacao ou reconstrucao em edificios existentes.',
        applicable_legislation: [
            { name: 'DL 555/99 (RJUE)', legislation_id: 'rjue', description: 'Artigos referentes a obras de alteracao.' },
            { name: 'DL 95/2019 (RERU)', legislation_id: 'reru', description: 'Regime Aplicavel a Reabilitacao de Edificios ou Fracoes Autonomas.' }
        ],
        required_elements: [
            'Levantamento do Existente',
            'Projeto de Alteracoes (Amarelos e Vermelhos)',
            'Termo de Responsabilidade',
            'Relatorio de Diagnostico (se aplicavel)'
        ],
        pdm_focus_areas: [
            'Manutencao de Fachadas',
            'Usos Compativeis',
            'Isencoes de Estacionamento (em areas historicas)'
        ]
    },
    [UrbanOperationType.Expansion]: {
        id: UrbanOperationType.Expansion,
        label: 'Ampliacao',
        description: 'Aumento da area de pavimentos ou de implantacao, ou do volume de uma edificacao.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Regras sobre ampliacoes.' }
        ],
        required_elements: [
            'Projeto de Ampliacao',
            'Calculo de Areas'
        ],
        pdm_focus_areas: [
            'Indice de Utilizacao (incremento)',
            'Afastamentos aos limites'
        ]
    },
    [UrbanOperationType.Demolition]: {
        id: UrbanOperationType.Demolition,
        label: 'Demolicao',
        description: 'Destruicao total ou parcial de uma edificacao.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Licenciamento ou Comunicacao Previa para demolicao.' }
        ],
        required_elements: [
            'Plano de Demolicao',
            'Gestao de Residuos (RCD)'
        ],
        pdm_focus_areas: [
            'Protecao de Patrimonio Classificado',
            'Regras de substituicao'
        ]
    },
    [UrbanOperationType.UseChange]: {
        id: UrbanOperationType.UseChange,
        label: 'Alteracao de Uso',
        description: 'Modificacao do uso final da edificacao (ex: Habitacao para Comercio).',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Autorizacao de Utilizacao.' }
        ],
        required_elements: [
            'Projeto de Arquitetura (se houver obras)',
            'Autorizacao do Condominio (se aplicavel)'
        ],
        pdm_focus_areas: [
            'Compatibilidade de Usos',
            'Requisitos de Estacionamento para novo uso'
        ]
    },
    [UrbanOperationType.Allotment]: {
        id: UrbanOperationType.Allotment,
        label: 'Loteamento',
        description: 'Operacao de divisao de um ou varios predios em lotes.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Operacoes de Loteamento.' }
        ],
        required_elements: [
            'Planta de Sintese',
            'Regulamento do Loteamento'
        ],
        pdm_focus_areas: [
            'Indices Urbanisticos Globais',
            'Areas de Cedencia',
            'Infraestruturas'
        ]
    },
    [UrbanOperationType.Simple]: {
        id: UrbanOperationType.Simple,
        label: 'Obras de Escassa Relevancia',
        description: 'Pequenas obras isentas de controlo previo (ex: muros baixos, estufas).',
        applicable_legislation: [
            { name: 'RJUE - Art. 6º A', legislation_id: 'rjue', description: 'Obras isentas de controlo previo.' }
        ],
        required_elements: [
            'Comunicacao (apenas para efeitos de fiscalizacao, se aplicavel)'
        ],
        pdm_focus_areas: [
            'Conformidade com PDM (mesmo isentas, devem cumprir)'
        ]
    }
};
