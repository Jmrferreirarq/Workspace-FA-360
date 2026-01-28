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
    modelId: "LIC_4PHASES",
    namePT: "Licenciamento (4 Fases)",
    nameEN: "Permitting (4 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 30,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia desenvolvimento do Programa Base",
            descriptionEN: "Initiates Briefing development"
        },
        {
            phaseNumber: 2,
            labelPT: "Programa Base",
            labelEN: "Briefing",
            percentage: 40,
            triggerPT: "Programa Base aprovado",
            triggerEN: "Briefing approved",
            activatesPhases: ["A1", "A2"],
            descriptionPT: "Desenvolvimento do Estudo Previo e Licenciamento",
            descriptionEN: "Schematic Design and Permitting development"
        },
        {
            phaseNumber: 3,
            labelPT: "Submissao",
            labelEN: "Submission",
            percentage: 20,
            triggerPT: "Entrega para submissao camararia",
            triggerEN: "Submission to council",
            activatesPhases: [],
            descriptionPT: "Pecas tecnicas completas e submetidas",
            descriptionEN: "Technical documents completed and submitted"
        },
        {
            phaseNumber: 4,
            labelPT: "Aprovacao",
            labelEN: "Approval",
            percentage: 10,
            triggerPT: "Alvara emitido",
            triggerEN: "Permit issued",
            activatesPhases: [],
            descriptionPT: "Processo de licenciamento concluido",
            descriptionEN: "Permitting process completed"
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
    modelId: "EXEC_5PHASES",
    namePT: "Execucao (5 Fases)",
    nameEN: "Construction Docs (5 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 25,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia desenvolvimento do Programa Base",
            descriptionEN: "Initiates Briefing"
        },
        {
            phaseNumber: 2,
            labelPT: "Programa Base",
            labelEN: "Briefing",
            percentage: 25,
            triggerPT: "Programa Base aprovado",
            triggerEN: "Briefing approved",
            activatesPhases: ["A1", "A2"],
            descriptionPT: "Desenvolvimento do Estudo Previo e Licenciamento",
            descriptionEN: "Schematic Design and Permitting"
        },
        {
            phaseNumber: 3,
            labelPT: "Desenvolvimento",
            labelEN: "Development",
            percentage: 30,
            triggerPT: "Submissao camararia concluida",
            triggerEN: "Council submission completed",
            activatesPhases: ["A3"],
            descriptionPT: "Desenvolvimento do Projeto de Execucao",
            descriptionEN: "Construction Documents development"
        },
        {
            phaseNumber: 4,
            labelPT: "Entrega Final",
            labelEN: "Final Delivery",
            percentage: 15,
            triggerPT: "Entrega de Projeto de Execucao",
            triggerEN: "Construction Documents delivery",
            activatesPhases: [],
            descriptionPT: "Projeto de Execucao completo",
            descriptionEN: "Construction Documents completed"
        },
        {
            phaseNumber: 5,
            labelPT: "Assistencia",
            labelEN: "Assistance",
            percentage: 5,
            triggerPT: "Apos 1ª visita a obra",
            triggerEN: "After 1st site visit",
            activatesPhases: ["A4"],
            descriptionPT: "Assistencia tecnica em obra",
            descriptionEN: "Technical assistance on site"
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
    modelId: "HYBRID_4PHASES",
    namePT: "Hibrido (4 Fases)",
    nameEN: "Hybrid (4 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 30,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia desenvolvimento do Programa Base",
            descriptionEN: "Initiates Briefing"
        },
        {
            phaseNumber: 2,
            labelPT: "Programa Base",
            labelEN: "Briefing",
            percentage: 35,
            triggerPT: "Programa Base aprovado",
            triggerEN: "Briefing approved",
            activatesPhases: ["A1", "A2"],
            descriptionPT: "Estudo Previo e Licenciamento + Especialidades",
            descriptionEN: "Schematic Design and Permitting + Engineering"
        },
        {
            phaseNumber: 3,
            labelPT: "Execucao",
            labelEN: "Execution",
            percentage: 25,
            triggerPT: "Alvara emitido",
            triggerEN: "Permit issued",
            activatesPhases: ["A3"],
            descriptionPT: "Projeto de Execucao + Especialidades",
            descriptionEN: "Construction Docs + Engineering"
        },
        {
            phaseNumber: 4,
            labelPT: "Finalizacao",
            labelEN: "Completion",
            percentage: 10,
            triggerPT: "Entrega completa",
            triggerEN: "Complete delivery",
            activatesPhases: [],
            descriptionPT: "Projeto completo + Todas as especialidades",
            descriptionEN: "Complete project + All engineering"
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
    modelId: "LEGAL_3PHASES",
    namePT: "Legalizacao (3 Fases)",
    nameEN: "Legalization (3 Phases)",
    phases: [
        {
            phaseNumber: 1,
            labelPT: "Adjudicacao",
            labelEN: "Award",
            percentage: 50,
            triggerPT: "Adjudicacao",
            triggerEN: "Project award",
            activatesPhases: ["A0"],
            descriptionPT: "Inicia levantamento e analise de viabilidade",
            descriptionEN: "Initiates survey and feasibility analysis"
        },
        {
            phaseNumber: 2,
            labelPT: "Submissao",
            labelEN: "Submission",
            percentage: 30,
            triggerPT: "Entrega para submissao",
            triggerEN: "Submission delivery",
            activatesPhases: ["A2"],
            descriptionPT: "Pecas tecnicas completas e submetidas",
            descriptionEN: "Technical documents completed and submitted"
        },
        {
            phaseNumber: 3,
            labelPT: "Aprovacao",
            labelEN: "Approval",
            percentage: 20,
            triggerPT: "Deferimento/Alvara",
            triggerEN: "Approval/Permit",
            activatesPhases: [],
            descriptionPT: "Processo de legalizacao concluido",
            descriptionEN: "Legalization process completed"
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
