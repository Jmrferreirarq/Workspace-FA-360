/**
 * FA-360 | CATÁLOGO DE TAREFAS DE ARQUITECTURA
 * Sistema completo de tarefas pré-definidas por fase RJUE
 */

export type Phase =
    | 'COMMERCIAL'      // Fase Comercial / Pré-projecto
    | 'CONCEPT'         // Estudo Prévio
    | 'PRELIMINARY'     // Anteprojecto / Programa Base
    | 'LICENSING'       // Projecto de Licenciamento
    | 'EXECUTION'       // Projecto de Execução
    | 'CONSTRUCTION'    // Assistência à Obra
    | 'CLOSING'         // Fecho e Entrega
    | 'INTERNAL';       // Tarefas Internas do Atelier

export interface TaskTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    phase: Phase;
    estimatedHours: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    dependencies?: string[];
    deliverables?: string[];
    responsible?: 'architect' | 'engineer' | 'designer' | 'intern' | 'external';
    tags?: string[];
}

export const TASK_CATALOG: TaskTemplate[] = [
    // FASE COMERCIAL
    {
        id: 'COM-001',
        name: 'Reunião inicial com cliente',
        description: 'Primeira reunião para levantamento de necessidades, expectativas, orçamento disponível e prazos pretendidos.',
        category: 'CLIENT',
        phase: 'COMMERCIAL',
        estimatedHours: 2,
        priority: 'high',
        deliverables: ['Acta de reunião', 'Briefing preliminar'],
        responsible: 'architect',
        tags: ['reunião', 'cliente', 'briefing']
    },
    {
        id: 'COM-002',
        name: 'Visita ao local',
        description: 'Visita técnica ao terreno/imóvel para avaliação das condições existentes, envolvente, acessos e condicionantes.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-001'],
        deliverables: ['Relatório de visita', 'Reportagem fotográfica'],
        responsible: 'architect',
        tags: ['visita', 'terreno', 'levantamento']
    },
    {
        id: 'COM-003',
        name: 'Levantamento documental',
        description: 'Recolha de documentos: caderneta predial, certidão de registo, plantas de localização, levantamento topográfico existente.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 4,
        priority: 'high',
        dependencies: ['COM-001'],
        deliverables: ['Dossier documental'],
        responsible: 'intern',
        tags: ['documentos', 'registo', 'caderneta']
    },
    {
        id: 'COM-004',
        name: 'Consulta ao PDM',
        description: 'Análise do enquadramento no Plano Director Municipal: classificação do solo, índices, condicionantes, servidões.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-003'],
        deliverables: ['Ficha de enquadramento urbanístico'],
        responsible: 'architect',
        tags: ['PDM', 'urbanismo', 'condicionantes']
    },
    {
        id: 'COM-005',
        name: 'Análise de viabilidade',
        description: 'Estudo preliminar de viabilidade: áreas possíveis, número de pisos, estacionamento, custos estimados.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 6,
        priority: 'high',
        dependencies: ['COM-004'],
        deliverables: ['Relatório de viabilidade'],
        responsible: 'architect',
        tags: ['viabilidade', 'áreas', 'custos']
    },
    {
        id: 'COM-006',
        name: 'Elaboração de proposta de honorários',
        description: 'Cálculo de honorários segundo tabela ICHPOP/OA, definição de fases, prazos e condições de pagamento.',
        category: 'ADMIN',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-005'],
        deliverables: ['Proposta de honorários PDF'],
        responsible: 'architect',
        tags: ['honorários', 'proposta', 'orçamento']
    },
    {
        id: 'COM-007',
        name: 'Apresentação de proposta ao cliente',
        description: 'Reunião de apresentação da proposta, esclarecimento de dúvidas e negociação de condições.',
        category: 'CLIENT',
        phase: 'COMMERCIAL',
        estimatedHours: 2,
        priority: 'high',
        dependencies: ['COM-006'],
        deliverables: ['Proposta assinada ou feedback'],
        responsible: 'architect',
        tags: ['reunião', 'proposta', 'negociação']
    },
    {
        id: 'COM-008',
        name: 'Assinatura de contrato',
        description: 'Formalização do contrato de prestação de serviços, recolha de documentos e pagamento inicial.',
        category: 'ADMIN',
        phase: 'COMMERCIAL',
        estimatedHours: 1,
        priority: 'critical',
        dependencies: ['COM-007'],
        deliverables: ['Contrato assinado', 'Comprovativo de pagamento'],
        responsible: 'architect',
        tags: ['contrato', 'adjudicação']
    },

    // ESTUDO PRÉVIO
    {
        id: 'EP-001',
        name: 'Análise do programa funcional',
        description: 'Definição detalhada do programa: listagem de espaços, áreas pretendidas, relações funcionais, requisitos especiais.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 4,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Programa funcional detalhado'],
        responsible: 'architect',
        tags: ['programa', 'áreas', 'funcional']
    },
    {
        id: 'EP-002',
        name: 'Levantamento topográfico',
        description: 'Coordenação com topógrafo para levantamento do terreno: altimetria, limites, construções existentes, árvores.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 2,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Levantamento topográfico DWG'],
        responsible: 'external',
        tags: ['topografia', 'levantamento', 'terreno']
    },
    {
        id: 'EP-003',
        name: 'Levantamento arquitectónico',
        description: 'Medição e desenho rigoroso do existente: plantas, cortes, alçados, detalhes construtivos, patologias.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 16,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Desenhos do existente DWG'],
        responsible: 'architect',
        tags: ['levantamento', 'existente', 'reabilitação']
    },

    // ANTEPROJECTO
    {
        id: 'AP-001',
        name: 'Desenvolvimento das plantas',
        description: 'Desenho detalhado das plantas de todos os pisos à escala 1:100.',
        category: 'DESIGN',
        phase: 'PRELIMINARY',
        estimatedHours: 24,
        priority: 'high',
        deliverables: ['Plantas 1:100 DWG'],
        responsible: 'architect',
        tags: ['plantas', 'desenho', '1:100']
    },
    {
        id: 'AP-011',
        name: 'Preparação do dossier AP',
        description: 'Compilação de todos os elementos do anteprojecto para apresentação.',
        category: 'DOCUMENTATION',
        phase: 'PRELIMINARY',
        estimatedHours: 4,
        priority: 'high',
        deliverables: ['Dossier de Anteprojecto PDF'],
        responsible: 'intern',
        tags: ['dossier', 'documentação']
    },

    // LICENCIAMENTO
    {
        id: 'LIC-001',
        name: 'Plantas de licenciamento',
        description: 'Elaboração das plantas definitivas à escala 1:100 ou 1:50 para licenciamento.',
        category: 'DOCUMENTATION',
        phase: 'LICENSING',
        estimatedHours: 20,
        priority: 'high',
        deliverables: ['Plantas de licenciamento DWG/PDF'],
        responsible: 'architect',
        tags: ['plantas', 'licenciamento']
    },
    {
        id: 'LIC-021',
        name: 'Submissão na câmara municipal',
        description: 'Entrega do processo na câmara municipal ou submissão electrónica.',
        category: 'LICENSING',
        phase: 'LICENSING',
        estimatedHours: 2,
        priority: 'critical',
        deliverables: ['Comprovativo de entrega'],
        responsible: 'architect',
        tags: ['submissão', 'câmara']
    },

    // EXECUÇÃO
    {
        id: 'PE-001',
        name: 'Plantas de execução',
        description: 'Elaboração das plantas detalhadas à escala 1:50 com todas as cotas e referências.',
        category: 'DOCUMENTATION',
        phase: 'EXECUTION',
        estimatedHours: 40,
        priority: 'high',
        deliverables: ['Plantas 1:50 DWG'],
        responsible: 'architect',
        tags: ['plantas', 'execução', '1:50']
    },

    // ASSISTÊNCIA OBRA
    {
        id: 'OBR-001',
        name: 'Reunião de arranque de obra',
        description: 'Reunião inicial com empreiteiro para definição de procedimentos e comunicação.',
        category: 'SITE',
        phase: 'CONSTRUCTION',
        estimatedHours: 3,
        priority: 'high',
        deliverables: ['Acta de reunião'],
        responsible: 'architect',
        tags: ['reunião', 'arranque', 'empreiteiro']
    },
    {
        id: 'OBR-003',
        name: 'Visita de obra semanal',
        description: 'Visita periódica para acompanhamento dos trabalhos e esclarecimento de dúvidas.',
        category: 'SITE',
        phase: 'CONSTRUCTION',
        estimatedHours: 3,
        priority: 'high',
        deliverables: ['Relatório de visita'],
        responsible: 'architect',
        tags: ['visita', 'acompanhamento', 'recorrente']
    },

    // FECHO
    {
        id: 'FIM-001',
        name: 'Pedido de utilização',
        description: 'Preparação e submissão do pedido de autorização de utilização.',
        category: 'LICENSING',
        phase: 'CLOSING',
        estimatedHours: 4,
        priority: 'critical',
        deliverables: ['Requerimento submetido'],
        responsible: 'architect',
        tags: ['utilização', 'licenciamento']
    },
    {
        id: 'FIM-006',
        name: 'Reunião final com cliente',
        description: 'Reunião de entrega final e encerramento do projecto.',
        category: 'CLIENT',
        phase: 'CLOSING',
        estimatedHours: 2,
        priority: 'high',
        deliverables: ['Termo de encerramento'],
        responsible: 'architect',
        tags: ['reunião', 'entrega', 'milestone']
    },

    // INTERNO
    {
        id: 'INT-001',
        name: 'Reunião de equipa semanal',
        description: 'Reunião semanal de coordenação interna: revisão de projectos, distribuição de tarefas, problemas e soluções.',
        category: 'ADMIN',
        phase: 'INTERNAL',
        estimatedHours: 1,
        priority: 'medium',
        deliverables: ['Acta de reunião'],
        responsible: 'architect',
        tags: ['reunião', 'equipa', 'recorrente', 'semanal']
    },
    {
        id: 'INT-010',
        name: 'Facturação mensal',
        description: 'Emissão de facturas do mês: projectos em curso, fases concluídas, trabalhos adicionais.',
        category: 'ADMIN',
        phase: 'INTERNAL',
        estimatedHours: 3,
        priority: 'critical',
        deliverables: ['Facturas emitidas'],
        responsible: 'architect',
        tags: ['facturação', 'recorrente', 'mensal', 'financeiro']
    }
];

export const PHASES_CONFIG = {
    COMMERCIAL: { label: 'Fase Comercial', color: '#6366f1', icon: 'Briefcase', order: 1 },
    CONCEPT: { label: 'Estudo Prévio', color: '#a855f7', icon: 'Lightbulb', order: 2 },
    PRELIMINARY: { label: 'Anteprojecto', color: '#3b82f6', icon: 'PenTool', order: 3 },
    LICENSING: { label: 'Licenciamento', color: '#f59e0b', icon: 'FileCheck', order: 4 },
    EXECUTION: { label: 'Projecto Execução', color: '#f97316', icon: 'Layers', order: 5 },
    CONSTRUCTION: { label: 'Assistência Obra', color: '#10b981', icon: 'HardHat', order: 6 },
    CLOSING: { label: 'Fecho', color: '#22c55e', icon: 'CheckCircle', order: 7 },
    INTERNAL: { label: 'Interno', color: '#64748b', icon: 'Building', order: 8 },
};

export const RESPONSIBLE_CONFIG = {
    architect: { label: 'Arquitecto', color: 'luxury-gold' },
    engineer: { label: 'Engenheiro', color: 'blue-500' },
    designer: { label: 'Designer', color: 'purple-500' },
    intern: { label: 'Estagiário', color: 'emerald-500' },
    external: { label: 'Externo', color: 'gray-500' },
};
