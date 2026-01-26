
export enum UrbanOperationType {
    Construction = 'construction',
    Rehabilitation = 'rehabilitation',
    Expansion = 'expansion',
    Demolition = 'demolition',
    UseChange = 'use_change',
    Allotment = 'allotment',
    Simple = 'simple' // Obras de escassa relevância
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
        label: 'Construção Nova',
        description: 'Edificação de obra nova em terreno livre ou em substituição de existente.',
        applicable_legislation: [
            { name: 'DL 555/99 (RJUE)', legislation_id: 'rjue', description: 'Regime Jurídico da Urbanização e Edificação (Atualizado pelo Simplex).' },
            { name: 'DL 10/2024 (Simplex)', legislation_id: 'simplex-2024', description: 'Simplificação dos licenciamentos urbanísticos.' },
            { name: 'RGEU', legislation_id: 'rgeu', description: 'Regulamento Geral das Edificações Urbanas.' },
            { name: 'DL 163/2006', legislation_id: 'acessibilidades', description: 'Acessibilidades e Mobilidade Condicionada.' }
        ],
        required_elements: [
            'Levantamento Topográfico',
            'Projeto de Arquitetura',
            'Projetos de Especialidades',
            'Termo de Responsabilidade',
            'Calendarização da Obra'
        ],
        pdm_focus_areas: [
            'Índices de Ocupação e Utilização',
            'Cérceas e Afastamentos',
            'Estacionamento',
            'Cedências para Domínio Público'
        ]
    },
    [UrbanOperationType.Rehabilitation]: {
        id: UrbanOperationType.Rehabilitation,
        label: 'Reabilitação / Alteração',
        description: 'Obras de alteração, conservação ou reconstrução em edifícios existentes.',
        applicable_legislation: [
            { name: 'DL 555/99 (RJUE)', legislation_id: 'rjue', description: 'Artigos referentes a obras de alteração.' },
            { name: 'DL 95/2019 (RERU)', legislation_id: 'reru', description: 'Regime Aplicável à Reabilitação de Edifícios ou Frações Autónomas.' }
        ],
        required_elements: [
            'Levantamento do Existente',
            'Projeto de Alterações (Amarelos e Vermelhos)',
            'Termo de Responsabilidade',
            'Relatório de Diagnóstico (se aplicável)'
        ],
        pdm_focus_areas: [
            'Manutenção de Fachadas',
            'Usos Compatíveis',
            'Isenções de Estacionamento (em áreas históricas)'
        ]
    },
    [UrbanOperationType.Expansion]: {
        id: UrbanOperationType.Expansion,
        label: 'Ampliação',
        description: 'Aumento da área de pavimentos ou de implantação, ou do volume de uma edificação.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Regras sobre ampliações.' }
        ],
        required_elements: [
            'Projeto de Ampliação',
            'Cálculo de Áreas'
        ],
        pdm_focus_areas: [
            'Índice de Utilização (incremento)',
            'Afastamentos aos limites'
        ]
    },
    [UrbanOperationType.Demolition]: {
        id: UrbanOperationType.Demolition,
        label: 'Demolição',
        description: 'Destruição total ou parcial de uma edificação.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Licenciamento ou Comunicação Prévia para demolição.' }
        ],
        required_elements: [
            'Plano de Demolição',
            'Gestão de Resíduos (RCD)'
        ],
        pdm_focus_areas: [
            'Proteção de Património Classificado',
            'Regras de substituição'
        ]
    },
    [UrbanOperationType.UseChange]: {
        id: UrbanOperationType.UseChange,
        label: 'Alteração de Uso',
        description: 'Modificação do uso final da edificação (ex: Habitação para Comércio).',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Autorização de Utilização.' }
        ],
        required_elements: [
            'Projeto de Arquitetura (se houver obras)',
            'Autorização do Condomínio (se aplicável)'
        ],
        pdm_focus_areas: [
            'Compatibilidade de Usos',
            'Requisitos de Estacionamento para novo uso'
        ]
    },
    [UrbanOperationType.Allotment]: {
        id: UrbanOperationType.Allotment,
        label: 'Loteamento',
        description: 'Operação de divisão de um ou vários prédios em lotes.',
        applicable_legislation: [
            { name: 'RJUE', legislation_id: 'rjue', description: 'Operações de Loteamento.' }
        ],
        required_elements: [
            'Planta de Síntese',
            'Regulamento do Loteamento'
        ],
        pdm_focus_areas: [
            'Índices Urbanísticos Globais',
            'Áreas de Cedência',
            'Infraestruturas'
        ]
    },
    [UrbanOperationType.Simple]: {
        id: UrbanOperationType.Simple,
        label: 'Obras de Escassa Relevância',
        description: 'Pequenas obras isentas de controlo prévio (ex: muros baixos, estufas).',
        applicable_legislation: [
            { name: 'RJUE - Art. 6º A', legislation_id: 'rjue', description: 'Obras isentas de controlo prévio.' }
        ],
        required_elements: [
            'Comunicação (apenas para efeitos de fiscalização, se aplicável)'
        ],
        pdm_focus_areas: [
            'Conformidade com PDM (mesmo isentas, devem cumprir)'
        ]
    }
};
