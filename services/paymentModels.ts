// Sistema de Fases de Pagamento
// Articulado com tipologias de projeto

export interface PaymentPhase {
    phaseNumber: number;
    labelPT: string;
    labelEN: string;
    percentage: number;
    triggerPT: string; // Marco de pagamento
    triggerEN: string;
    activatesPhases: string[]; // Fases A0-A4 que ativa
    type: 'LICENSING' | 'EXECUTION';
    descriptionPT: string;
    descriptionEN: string;
}

export interface PaymentModel {
    modelId: string;
    namePT: string;
    nameEN: string;
    phases: PaymentPhase[];
    applicableTemplates: string[]; // IDs das tipologias
}

// MODELO 1: LICENCIAMENTO (4 Fases)
// Para: Moradias Licenciamento, Multifamiliar, Turismo, Industrial
const licenciamentoModel: PaymentModel = {
    modelId: "LIC_6PHASES",
    namePT: "Licenciamento (6 Fases)",
    nameEN: "Permitting (6 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 15,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia desenvolvimento do Programa Base",
            descriptionEN: "Initiates Briefing development",
            type: "LICENSING"
        },
        {
            phaseNumber: 2,
            labelPT: "Programa Base",
            labelEN: "Briefing",
            percentage: 15,
            triggerPT: "Programa Base aprovado",
            triggerEN: "Briefing approved",
            activatesPhases: ["A0", "A1"],
            descriptionPT: "Conclusao do Programa Base",
            descriptionEN: "Briefing conclusion",
            type: "LICENSING"
        },
        {
            phaseNumber: 3,
            labelPT: "Estudo Previo",
            labelEN: "Schematic Design",
            percentage: 20,
            triggerPT: "Entrega do Estudo Previo",
            triggerEN: "Schematic Design delivery",
            activatesPhases: ["A1"],
            descriptionPT: "Desenvolvimento do Estudo Previo",
            descriptionEN: "Schematic Design development",
            type: "LICENSING"
        },
        {
            phaseNumber: 4,
            labelPT: "Licenciamento",
            labelEN: "Permitting",
            percentage: 20,
            triggerPT: "Entrega do Licenciamento",
            triggerEN: "Permitting delivery",
            activatesPhases: ["A2"],
            descriptionPT: "Desenvolvimento do Licenciamento",
            descriptionEN: "Permitting development",
            type: "LICENSING"
        },
        {
            phaseNumber: 5,
            labelPT: "Submissao",
            labelEN: "Submission",
            percentage: 20,
            triggerPT: "Submissao camararia concluida",
            triggerEN: "Council submission completed",
            activatesPhases: ["A2"],
            descriptionPT: "Pecas tecnicas submetidas",
            descriptionEN: "Technical documents submitted",
            type: "LICENSING"
        },
        {
            phaseNumber: 6,
            labelPT: "Documentacao Final",
            labelEN: "Final Documentation",
            percentage: 10,
            triggerPT: "Entrega de documentacao final",
            triggerEN: "Final documentation delivery",
            activatesPhases: [],
            descriptionPT: "Processo de licenciamento concluido",
            descriptionEN: "Permitting process completed",
            type: "LICENSING"
        }
    ],
    applicableTemplates: [
        "MORADIA_LICENSE",
        "MULTIFAMILY",
        "LOTEAMENTO",
        "BEACH_SUPPORT",
        "TOURISM_RURAL",
        "INDUSTRIAL"
    ]
};

// MODELO 2: EXECUÇÃO (5 Fases)
// Para: Moradias Execução, Interiores
const execucaoModel: PaymentModel = {
    modelId: "EXEC_7PHASES",
    namePT: "Execucao (7 Fases)",
    nameEN: "Construction Docs (7 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 12,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia desenvolvimento do Programa Base",
            descriptionEN: "Initiates Briefing",
            type: "LICENSING"
        },
        {
            phaseNumber: 2,
            labelPT: "Programa Base",
            labelEN: "Briefing",
            percentage: 13,
            triggerPT: "Programa Base aprovado",
            triggerEN: "Briefing approved",
            activatesPhases: ["A0", "A1"],
            descriptionPT: "Conclusao do Programa Base",
            descriptionEN: "Briefing conclusion",
            type: "LICENSING"
        },
        {
            phaseNumber: 3,
            labelPT: "Estudo Previo",
            labelEN: "Schematic Design",
            percentage: 12,
            triggerPT: "Entrega do Estudo Previo",
            triggerEN: "Schematic Design delivery",
            activatesPhases: ["A1"],
            descriptionPT: "Desenvolvimento do Estudo Previo",
            descriptionEN: "Schematic Design development",
            type: "LICENSING"
        },
        {
            phaseNumber: 4,
            labelPT: "Licenciamento",
            labelEN: "Permitting",
            percentage: 13,
            triggerPT: "Entrega do Licenciamento",
            triggerEN: "Permitting delivery",
            activatesPhases: ["A2"],
            descriptionPT: "Desenvolvimento do Licenciamento",
            descriptionEN: "Permitting development",
            type: "LICENSING"
        },
        {
            phaseNumber: 5,
            labelPT: "Execucao 1",
            labelEN: "Execution 1",
            percentage: 20,
            triggerPT: "Projeto de Execucao (1ª Entrega)",
            triggerEN: "Construction Docs (1st Delivery)",
            activatesPhases: ["A3"],
            descriptionPT: "Inicio do Projeto de Execucao",
            descriptionEN: "Construction Docs start",
            type: "EXECUTION"
        },
        {
            phaseNumber: 6,
            labelPT: "Execucao Final",
            labelEN: "Final Execution",
            percentage: 20,
            triggerPT: "Entrega Final de Execucao",
            triggerEN: "Final Construction Docs delivery",
            activatesPhases: ["A3"],
            descriptionPT: "Conclusao do Projeto de Execucao",
            descriptionEN: "Construction Docs completion",
            type: "EXECUTION"
        },
        {
            phaseNumber: 7,
            labelPT: "Assistencia",
            labelEN: "Assistance",
            percentage: 10,
            triggerPT: "Apos 1ª visita a obra",
            triggerEN: "After 1st site visit",
            activatesPhases: ["A4"],
            descriptionPT: "Assistencia tecnica em obra",
            descriptionEN: "Technical assistance on site",
            type: "EXECUTION"
        }
    ],
    applicableTemplates: [
        "MORADIA_EXEC",
        "INTERIOR_DESIGN"
    ]
};

// MODELO 3: HÍBRIDO (4 Fases)
// Para: Reabilitação, Comercial, Restauração, Escritórios
const hibridoModel: PaymentModel = {
    modelId: "HYBRID_6PHASES",
    namePT: "Hibrido (6 Fases)",
    nameEN: "Hybrid (6 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 15,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia desenvolvimento do Programa Base",
            descriptionEN: "Initiates Briefing",
            type: "LICENSING"
        },
        {
            phaseNumber: 2,
            labelPT: "Programa Base",
            labelEN: "Briefing",
            percentage: 15,
            triggerPT: "Programa Base aprovado",
            triggerEN: "Briefing approved",
            activatesPhases: ["A0", "A1"],
            descriptionPT: "Conclusao do Programa Base",
            descriptionEN: "Briefing conclusion",
            type: "LICENSING"
        },
        {
            phaseNumber: 3,
            labelPT: "Estudo Previo",
            labelEN: "Schematic Design",
            percentage: 17,
            triggerPT: "Entrega do Estudo Previo",
            triggerEN: "Schematic Design delivery",
            activatesPhases: ["A1"],
            descriptionPT: "Desenvolvimento do Estudo Previo",
            descriptionEN: "Schematic Design development",
            type: "LICENSING"
        },
        {
            phaseNumber: 4,
            labelPT: "Licenciamento",
            labelEN: "Permitting",
            percentage: 18,
            triggerPT: "Entrega do Licenciamento",
            triggerEN: "Permitting delivery",
            activatesPhases: ["A2"],
            descriptionPT: "Desenvolvimento do Licenciamento",
            descriptionEN: "Permitting development",
            type: "LICENSING"
        },
        {
            phaseNumber: 5,
            labelPT: "Execucao",
            labelEN: "Execution",
            percentage: 25,
            triggerPT: "Entrega Projeto de Execucao",
            triggerEN: "Construction Docs delivery",
            activatesPhases: ["A3"],
            descriptionPT: "Projeto de Execucao + Especialidades",
            descriptionEN: "Construction Docs + Engineering",
            type: "EXECUTION"
        },
        {
            phaseNumber: 6,
            labelPT: "Finalizacao",
            labelEN: "Completion",
            percentage: 10,
            triggerPT: "Entrega de documentacao final",
            triggerEN: "Final documentation delivery",
            activatesPhases: [],
            descriptionPT: "Projeto completo + Todas as especialidades",
            descriptionEN: "Complete project + All engineering",
            type: "EXECUTION"
        }
    ],
    applicableTemplates: [
        "MORADIA_REHAB",
        "RESTAURANT",
        "RETAIL_SHOP",
        "OFFICE_HQ"
    ]
};

// MODELO 4: LEGALIZAÇÃO (3 Fases)
// Para: Simplex, Regularização
const legalizacaoModel: PaymentModel = {
    modelId: "LEGAL_4PHASES",
    namePT: "Legalizacao (4 Fases)",
    nameEN: "Legalization (4 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 25,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia levantamento e analise de viabilidade",
            descriptionEN: "Initiates survey and feasibility analysis",
            type: "LICENSING"
        },
        {
            phaseNumber: 2,
            labelPT: "Levantamento",
            labelEN: "Survey",
            percentage: 25,
            triggerPT: "Levantamento Completo",
            triggerEN: "Full Survey",
            activatesPhases: ["A0", "A1"],
            descriptionPT: "Conclusao do levantamento",
            descriptionEN: "Survey conclusion",
            type: "LICENSING"
        },
        {
            phaseNumber: 3,
            labelPT: "Submissao",
            labelEN: "Submission",
            percentage: 30,
            triggerPT: "Entrega para submissao",
            triggerEN: "Submission delivery",
            activatesPhases: ["A2"],
            descriptionPT: "Pecas tecnicas completas e submetidas",
            descriptionEN: "Technical documents completed and submitted",
            type: "LICENSING"
        },
        {
            phaseNumber: 4,
            labelPT: "Finalizacao",
            labelEN: "Completion",
            percentage: 20,
            triggerPT: "Entrega de documentacao final",
            triggerEN: "Final documentation delivery",
            activatesPhases: [],
            descriptionPT: "Processo de legalizacao concluido aka documentacao final entregue",
            descriptionEN: "Legalization process completed / final docs delivered",
            type: "LICENSING"
        }
    ],
    applicableTemplates: [
        "LEGAL",
        "PIP",
        "LEGAL_GENERAL"
    ]
};

// Exportar todos os modelos
export const paymentModels: PaymentModel[] = [
    licenciamentoModel,
    execucaoModel,
    hibridoModel,
    legalizacaoModel
];

// Função para obter modelo de pagamento por tipologia
export function getPaymentModelForTemplate(templateId: string): PaymentModel {
    const model = paymentModels.find(m =>
        m.applicableTemplates.includes(templateId)
    );

    // Fallback para modelo de licenciamento se não encontrar
    return model || licenciamentoModel;
}

// Função para calcular valores por fase
export function calculatePaymentValues(
    totalFee: number,
    model: PaymentModel
): { phase: PaymentPhase; value: number }[] {
    return model.phases.map(phase => ({
        phase,
        value: (totalFee * phase.percentage) / 100
    }));
}
