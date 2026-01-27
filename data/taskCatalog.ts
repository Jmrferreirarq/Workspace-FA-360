/**
 * FA-360 | CATALOGO DE TAREFAS DE ARQUITECTURA
 * Sistema completo de tarefas pre-definidas por fase RJUE
 */

export type Phase =
    | 'COMMERCIAL'      // Fase Comercial / Pre-projecto
    | 'CONCEPT'         // Estudo Previo
    | 'PRELIMINARY'     // Anteprojecto / Programa Base
    | 'LICENSING'       // Projecto de Licenciamento
    | 'EXECUTION'       // Projecto de Execucao
    | 'CONSTRUCTION'    // Assistencia a Obra
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
        name: 'Reuniao inicial com cliente',
        description: 'Primeira reuniao para levantamento de necessidades, expectativas, orcamento disponivel e prazos pretendidos.',
        category: 'CLIENT',
        phase: 'COMMERCIAL',
        estimatedHours: 2,
        priority: 'high',
        deliverables: ['Acta de reuniao', 'Briefing preliminar'],
        responsible: 'architect',
        tags: ['reuniao', 'cliente', 'briefing']
    },
    {
        id: 'COM-002',
        name: 'Visita ao local',
        description: 'Visita tecnica ao terreno/imovel para avaliacao das condicoes existentes, envolvente, acessos e condicionantes.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-001'],
        deliverables: ['Relatorio de visita', 'Reportagem fotografica'],
        responsible: 'architect',
        tags: ['visita', 'terreno', 'levantamento']
    },
    {
        id: 'COM-003',
        name: 'Levantamento documental',
        description: 'Recolha de documentos: caderneta predial, certidao de registo, plantas de localizacao, levantamento topografico existente.',
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
        description: 'Analise do enquadramento no Plano Director Municipal: classificacao do solo, indices, condicionantes, servidoes.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-003'],
        deliverables: ['Ficha de enquadramento urbanistico'],
        responsible: 'architect',
        tags: ['PDM', 'urbanismo', 'condicionantes']
    },
    {
        id: 'COM-005',
        name: 'Analise de viabilidade',
        description: 'Estudo preliminar de viabilidade: areas possiveis, numero de pisos, estacionamento, custos estimados.',
        category: 'ANALYSIS',
        phase: 'COMMERCIAL',
        estimatedHours: 6,
        priority: 'high',
        dependencies: ['COM-004'],
        deliverables: ['Relatorio de viabilidade'],
        responsible: 'architect',
        tags: ['viabilidade', 'areas', 'custos']
    },
    {
        id: 'COM-006',
        name: 'Elaboracao de proposta de honorarios',
        description: 'Calculo de honorarios segundo tabela ICHPOP/OA, definicao de fases, prazos e condicoes de pagamento.',
        category: 'ADMIN',
        phase: 'COMMERCIAL',
        estimatedHours: 3,
        priority: 'high',
        dependencies: ['COM-005'],
        deliverables: ['Proposta de honorarios PDF'],
        responsible: 'architect',
        tags: ['honorarios', 'proposta', 'orcamento']
    },
    {
        id: 'COM-007',
        name: 'Apresentacao de proposta ao cliente',
        description: 'Reuniao de apresentacao da proposta, esclarecimento de duvidas e negociacao de condicoes.',
        category: 'CLIENT',
        phase: 'COMMERCIAL',
        estimatedHours: 2,
        priority: 'high',
        dependencies: ['COM-006'],
        deliverables: ['Proposta assinada ou feedback'],
        responsible: 'architect',
        tags: ['reuniao', 'proposta', 'negociacao']
    },
    {
        id: 'COM-008',
        name: 'Assinatura de contrato',
        description: 'Formalizacao do contrato de prestacao de servicos, recolha de documentos e pagamento inicial.',
        category: 'ADMIN',
        phase: 'COMMERCIAL',
        estimatedHours: 1,
        priority: 'critical',
        dependencies: ['COM-007'],
        deliverables: ['Contrato assinado', 'Comprovativo de pagamento'],
        responsible: 'architect',
        tags: ['contrato', 'adjudicacao']
    },

    // ESTUDO PREVIO
    {
        id: 'EP-001',
        name: 'Analise do programa funcional',
        description: 'Definicao detalhada do programa: listagem de espacos, areas pretendidas, relacoes funcionais, requisitos especiais.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 4,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Programa funcional detalhado'],
        responsible: 'architect',
        tags: ['programa', 'areas', 'funcional']
    },
    {
        id: 'EP-002',
        name: 'Levantamento topografico',
        description: 'Coordenacao com topografo para levantamento do terreno: altimetria, limites, construcoes existentes, arvores.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 2,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Levantamento topografico DWG'],
        responsible: 'external',
        tags: ['topografia', 'levantamento', 'terreno']
    },
    {
        id: 'EP-003',
        name: 'Levantamento arquitectonico',
        description: 'Medicao e desenho rigoroso do existente: plantas, cortes, alcados, detalhes construtivos, patologias.',
        category: 'ANALYSIS',
        phase: 'CONCEPT',
        estimatedHours: 16,
        priority: 'high',
        dependencies: ['COM-008'],
        deliverables: ['Desenhos do existente DWG'],
        responsible: 'architect',
        tags: ['levantamento', 'existente', 'reabilitacao']
    },

    // ANTEPROJECTO
    {
        id: 'AP-001',
        name: 'Desenvolvimento das plantas',
        description: 'Desenho detalhado das plantas de todos os pisos a escala 1:100.',
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
        name: 'Preparacao do dossier AP',
        description: 'Compilacao de todos os elementos do anteprojecto para apresentacao.',
        category: 'DOCUMENTATION',
        phase: 'PRELIMINARY',
        estimatedHours: 4,
        priority: 'high',
        deliverables: ['Dossier de Anteprojecto PDF'],
        responsible: 'intern',
        tags: ['dossier', 'documentacao']
    },

    // LICENCIAMENTO
    {
        id: 'LIC-001',
        name: 'Plantas de licenciamento',
        description: 'Elaboracao das plantas definitivas a escala 1:100 ou 1:50 para licenciamento.',
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
        name: 'Submissao na camara municipal',
        description: 'Entrega do processo na camara municipal ou submissao electronica.',
        category: 'LICENSING',
        phase: 'LICENSING',
        estimatedHours: 2,
        priority: 'critical',
        deliverables: ['Comprovativo de entrega'],
        responsible: 'architect',
        tags: ['submissao', 'camara']
    },

    // EXECUCAO
    {
        id: 'PE-001',
        name: 'Plantas de execucao',
        description: 'Elaboracao das plantas detalhadas a escala 1:50 com todas as cotas e referencias.',
        category: 'DOCUMENTATION',
        phase: 'EXECUTION',
        estimatedHours: 40,
        priority: 'high',
        deliverables: ['Plantas 1:50 DWG'],
        responsible: 'architect',
        tags: ['plantas', 'execucao', '1:50']
    },

    // ASSISTENCIA OBRA
    {
        id: 'OBR-001',
        name: 'Reuniao de arranque de obra',
        description: 'Reuniao inicial com empreiteiro para definicao de procedimentos e comunicacao.',
        category: 'SITE',
        phase: 'CONSTRUCTION',
        estimatedHours: 3,
        priority: 'high',
        deliverables: ['Acta de reuniao'],
        responsible: 'architect',
        tags: ['reuniao', 'arranque', 'empreiteiro']
    },
    {
        id: 'OBR-003',
        name: 'Visita de obra semanal',
        description: 'Visita periodica para acompanhamento dos trabalhos e esclarecimento de duvidas.',
        category: 'SITE',
        phase: 'CONSTRUCTION',
        estimatedHours: 3,
        priority: 'high',
        deliverables: ['Relatorio de visita'],
        responsible: 'architect',
        tags: ['visita', 'acompanhamento', 'recorrente']
    },

    // FECHO
    {
        id: 'FIM-001',
        name: 'Pedido de utilizacao',
        description: 'Preparacao e submissao do pedido de autorizacao de utilizacao.',
        category: 'LICENSING',
        phase: 'CLOSING',
        estimatedHours: 4,
        priority: 'critical',
        deliverables: ['Requerimento submetido'],
        responsible: 'architect',
        tags: ['utilizacao', 'licenciamento']
    },
    {
        id: 'FIM-006',
        name: 'Reuniao final com cliente',
        description: 'Reuniao de entrega final e encerramento do projecto.',
        category: 'CLIENT',
        phase: 'CLOSING',
        estimatedHours: 2,
        priority: 'high',
        deliverables: ['Termo de encerramento'],
        responsible: 'architect',
        tags: ['reuniao', 'entrega', 'milestone']
    },

    // INTERNO
    {
        id: 'INT-001',
        name: 'Reuniao de equipa semanal',
        description: 'Reuniao semanal de coordenacao interna: revisao de projectos, distribuicao de tarefas, problemas e solucoes.',
        category: 'ADMIN',
        phase: 'INTERNAL',
        estimatedHours: 1,
        priority: 'medium',
        deliverables: ['Acta de reuniao'],
        responsible: 'architect',
        tags: ['reuniao', 'equipa', 'recorrente', 'semanal']
    },
    {
        id: 'INT-010',
        name: 'Facturacao mensal',
        description: 'Emissao de facturas do mes: projectos em curso, fases concluidas, trabalhos adicionais.',
        category: 'ADMIN',
        phase: 'INTERNAL',
        estimatedHours: 3,
        priority: 'critical',
        deliverables: ['Facturas emitidas'],
        responsible: 'architect',
        tags: ['facturacao', 'recorrente', 'mensal', 'financeiro']
    }
];

export const PHASES_CONFIG = {
    COMMERCIAL: { label: 'Fase Comercial', color: '#6366f1', icon: 'Briefcase', order: 1 },
    CONCEPT: { label: 'Estudo Previo', color: '#a855f7', icon: 'Lightbulb', order: 2 },
    PRELIMINARY: { label: 'Anteprojecto', color: '#3b82f6', icon: 'PenTool', order: 3 },
    LICENSING: { label: 'Licenciamento', color: '#f59e0b', icon: 'FileCheck', order: 4 },
    EXECUTION: { label: 'Projecto Execucao', color: '#f97316', icon: 'Layers', order: 5 },
    CONSTRUCTION: { label: 'Assistencia Obra', color: '#10b981', icon: 'HardHat', order: 6 },
    CLOSING: { label: 'Fecho', color: '#22c55e', icon: 'CheckCircle', order: 7 },
    INTERNAL: { label: 'Interno', color: '#64748b', icon: 'Building', order: 8 },
};

export const RESPONSIBLE_CONFIG = {
    architect: { label: 'Arquitecto', color: 'luxury-gold' },
    engineer: { label: 'Engenheiro', color: 'blue-500' },
    designer: { label: 'Designer', color: 'purple-500' },
    intern: { label: 'Estagiario', color: 'emerald-500' },
    external: { label: 'Externo', color: 'gray-500' },
};
