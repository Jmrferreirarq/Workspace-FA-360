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
    baseSplit?: { // NEW: Define como o valor total é dividido entre as etapas
        licensing: number; // ex: 0.4 (40%)
        execution: number; // ex: 0.6 (60%)
    };
}

// MODELO 1: LICENCIAMENTO (6 Fases)
const licenciamentoModel: PaymentModel = {
    modelId: "LIC_6PHASES",
    namePT: "Licenciamento (6 Fases)",
    nameEN: "Permitting (6 Phases)",
    phases: [
        { phaseNumber: 1, labelPT: "Adjudicacao", labelEN: "Award", percentage: 15, triggerPT: "Adjudicacao", triggerEN: "Project award", activatesPhases: ["A0"], descriptionPT: "Inicia desenvolvimento do Programa Base", descriptionEN: "Initiates Briefing development", type: "LICENSING" },
        { phaseNumber: 2, labelPT: "Programa Base", labelEN: "Briefing", percentage: 15, triggerPT: "Programa Base aprovado", triggerEN: "Briefing approved", activatesPhases: ["A0", "A1"], descriptionPT: "Conclusao do Programa Base", descriptionEN: "Briefing conclusion", type: "LICENSING" },
        { phaseNumber: 3, labelPT: "Estudo Previo", labelEN: "Schematic Design", percentage: 20, triggerPT: "Entrega do Estudo Previo", triggerEN: "Schematic Design delivery", activatesPhases: ["A1"], descriptionPT: "Desenvolvimento do Estudo Previo", descriptionEN: "Schematic Design development", type: "LICENSING" },
        { phaseNumber: 4, labelPT: "Licenciamento", labelEN: "Permitting", percentage: 20, triggerPT: "Entrega do Licenciamento", triggerEN: "Permitting delivery", activatesPhases: ["A2"], descriptionPT: "Desenvolvimento do Licenciamento", descriptionEN: "Permitting development", type: "LICENSING" },
        { phaseNumber: 5, labelPT: "Submissao", labelEN: "Submission", percentage: 20, triggerPT: "Submissao camararia concluida", triggerEN: "Council submission completed", activatesPhases: ["A2"], descriptionPT: "Pecas tecnicas submetidas", descriptionEN: "Technical documents submitted", type: "LICENSING" },
        { phaseNumber: 6, labelPT: "Documentacao Final", labelEN: "Final Documentation", percentage: 10, triggerPT: "Entrega de documentacao final", triggerEN: "Final documentation delivery", activatesPhases: [], descriptionPT: "Processo de licenciamento concluido", descriptionEN: "Permitting process completed", type: "LICENSING" }
    ],
    applicableTemplates: ["MORADIA_NEW", "PUBLIC_BUILDING"],
    // Licenciamento puro: 100% Licenciamento
    baseSplit: { licensing: 1.0, execution: 0.0 }
};

// MODELO 2: EXECUÇÃO (9 Fases - 6 Lic + 3 Exec)
const execucaoModel: PaymentModel = {
    modelId: "EXEC_9PHASES",
    namePT: "Licenciamento + Execucao",
    nameEN: "Permitting + Execution",
    phases: [
        // LICENSING (100% total)
        { phaseNumber: 1, labelPT: "Adjudicacao", labelEN: "Award", percentage: 15, triggerPT: "Adjudicacao", triggerEN: "Project award", activatesPhases: ["A0"], descriptionPT: "Inicia desenvolvimento", descriptionEN: "Initiates development", type: "LICENSING" },
        { phaseNumber: 2, labelPT: "Programa Base", labelEN: "Briefing", percentage: 15, triggerPT: "Programa Base aprovado", triggerEN: "Briefing approved", activatesPhases: ["A0", "A1"], descriptionPT: "Conclusao do Programa", descriptionEN: "Briefing conclusion", type: "LICENSING" },
        { phaseNumber: 3, labelPT: "Estudo Previo", labelEN: "Schematic Design", percentage: 20, triggerPT: "Entrega Estudo Previo", triggerEN: "SD delivery", activatesPhases: ["A1"], descriptionPT: "Desenvolvimento SD", descriptionEN: "SD development", type: "LICENSING" },
        { phaseNumber: 4, labelPT: "Licenciamento", labelEN: "Permitting", percentage: 20, triggerPT: "Entrega Licenciamento", triggerEN: "Permitting delivery", activatesPhases: ["A2"], descriptionPT: "Desenvolvimento Lic.", descriptionEN: "Permitting development", type: "LICENSING" },
        { phaseNumber: 5, labelPT: "Submissao", labelEN: "Submission", percentage: 20, triggerPT: "Submissao concluida", triggerEN: "Submission", activatesPhases: ["A2"], descriptionPT: "Pecas submetidas", descriptionEN: "Technical submission", type: "LICENSING" },
        { phaseNumber: 6, labelPT: "Doc. Final", labelEN: "Final Docs", percentage: 10, triggerPT: "Entrega doc. final", triggerEN: "Final docs", activatesPhases: [], descriptionPT: "Conclusao Lic.", descriptionEN: "Permitting conclusion", type: "LICENSING" },
        // EXECUTION (100% total - will be calculated relatively in UI)
        { phaseNumber: 7, labelPT: "Adjudicacao Execucao", labelEN: "Execution Award", percentage: 20, triggerPT: "Adjudicacao da Fase de Execucao", triggerEN: "Execution Award", activatesPhases: ["A3"], descriptionPT: "Inicio da Execucao", descriptionEN: "Start of Execution", type: "EXECUTION" },
        { phaseNumber: 8, labelPT: "Projeto Execucao", labelEN: "Construction Docs", percentage: 50, triggerPT: "Entrega do Projeto de Execucao Detalhado", triggerEN: "Construction Docs Delivery", activatesPhases: ["A3"], descriptionPT: "Detalhamento Tecnico", descriptionEN: "Technical Detailing", type: "EXECUTION" },
        { phaseNumber: 9, labelPT: "Assistencia", labelEN: "Site Assistance", percentage: 30, triggerPT: "Assistencia Tecnica e Visitas a Obra", triggerEN: "Technical Assistance", activatesPhases: ["A4"], descriptionPT: "Acompanhamento", descriptionEN: "Site Supervision", type: "EXECUTION" }
    ],
    applicableTemplates: ["MORADIA_EXEC", "INTERIOR_DESIGN"],
    // Execução pura ou foco em execução: 0% Lic / 100% Exec (Ajustar conforme necessidade de entrada)
    baseSplit: { licensing: 0.0, execution: 1.0 }
};

// MODELO 3: HÍBRIDO (Reabilitacao)
const hibridoModel: PaymentModel = {
    modelId: "HYBRID_8PHASES",
    namePT: "Hibrido (8 Fases)",
    nameEN: "Hybrid (8 Phases)",
    phases: [
        { phaseNumber: 1, labelPT: "Adjudicacao", labelEN: "Award", percentage: 15, triggerPT: "Adjudicacao", triggerEN: "Award", activatesPhases: ["A0"], descriptionPT: "Inicio", descriptionEN: "Start", type: "LICENSING" },
        { phaseNumber: 2, labelPT: "Programa Base", labelEN: "Briefing", percentage: 15, triggerPT: "Programa Base aprovado", triggerEN: "Briefing approved", activatesPhases: ["A0", "A1"], descriptionPT: "Conclusao do Programa", descriptionEN: "Briefing conclusion", type: "LICENSING" },
        { phaseNumber: 3, labelPT: "Estudo Previo", labelEN: "Schematic Design", percentage: 20, triggerPT: "Entrega Estudo Previo", triggerEN: "SD delivery", activatesPhases: ["A1"], descriptionPT: "Conclusao EP", descriptionEN: "SD conclusion", type: "LICENSING" },
        { phaseNumber: 4, labelPT: "Licenciamento", labelEN: "Permitting", percentage: 20, triggerPT: "Entrega Licenciamento", triggerEN: "Permitting delivery", activatesPhases: ["A2"], descriptionPT: "Conclusao Licenciamento", descriptionEN: "Permitting conclusion", type: "LICENSING" },
        { phaseNumber: 5, labelPT: "Submissao", labelEN: "Submission", percentage: 20, triggerPT: "Submissao Camararia", triggerEN: "Council Submission", activatesPhases: ["A2"], descriptionPT: "Submissao concluida", descriptionEN: "Submission conclusion", type: "LICENSING" },
        { phaseNumber: 6, labelPT: "Doc. Final", labelEN: "Final Docs", percentage: 10, triggerPT: "Doc. Final", triggerEN: "Final Docs", activatesPhases: [], descriptionPT: "Finalizacao Licenciamento", descriptionEN: "Permitting finalization", type: "LICENSING" },
        { phaseNumber: 7, labelPT: "Execucao", labelEN: "Execution", percentage: 70, triggerPT: "Entrega Projeto de Execucao", triggerEN: "Execution delivery", activatesPhases: ["A3"], descriptionPT: "Conclusao Execucao", descriptionEN: "Execution conclusion", type: "EXECUTION" },
        { phaseNumber: 8, labelPT: "Finalizacao", labelEN: "Finalization", percentage: 30, triggerPT: "Entrega de documentacao final", triggerEN: "Final documentation", activatesPhases: ["A4"], descriptionPT: "Finalizacao Global", descriptionEN: "Global finalization", type: "EXECUTION" }
    ],
    applicableTemplates: ["MORADIA_REHAB", "RESTAURANT", "RETAIL_SHOP", "OFFICE_HQ"],
    // Híbrido: 40% Licenciamento / 60% Execução (Regra de Ouro)
    baseSplit: { licensing: 0.4, execution: 0.6 }
};

// MODELO 4: LEGALIZAÇÃO
const legalizacaoModel: PaymentModel = {
    modelId: "LEGAL_4PHASES",
    namePT: "Legalizacao (4 Fases)",
    nameEN: "Legalization (4 Phases)",
    phases: [
        { phaseNumber: 1, labelPT: "Adjudicacao", labelEN: "Award", percentage: 25, triggerPT: "Adjudicacao", triggerEN: "Award", activatesPhases: ["A0"], descriptionPT: "Inicio", descriptionEN: "Start", type: "LICENSING" },
        { phaseNumber: 2, labelPT: "Levantamento", labelEN: "Survey", percentage: 25, triggerPT: "Levantamento Completo", triggerEN: "Full Survey", activatesPhases: ["A0", "A1"], descriptionPT: "Conclusion", descriptionEN: "Conclusion", type: "LICENSING" },
        { phaseNumber: 3, labelPT: "Submissao", labelEN: "Submission", percentage: 30, triggerPT: "Entrega para submissao", triggerEN: "Submission delivery", activatesPhases: ["A2"], descriptionPT: "Technical delivery", descriptionEN: "Technical delivery", type: "LICENSING" },
        { phaseNumber: 4, labelPT: "Finalizacao", labelEN: "Finalization", percentage: 20, triggerPT: "Entrega de documentacao final", triggerEN: "Final documents", activatesPhases: [], descriptionPT: "Closed", descriptionEN: "Closed", type: "LICENSING" }
    ],
    applicableTemplates: ["LEGAL", "PIP", "LEGAL_GENERAL"],
    // Legalização: 100% Licenciamento
    baseSplit: { licensing: 1.0, execution: 0.0 }
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
    // Definir bases de cálculo
    // Se o modelo não tiver split definido, assume 100% Licenciamento (comportamento legacy)
    const split = model.baseSplit || { licensing: 1.0, execution: 0.0 };

    const licensingBase = totalFee * split.licensing;
    const executionBase = totalFee * split.execution;

    return model.phases.map(phase => {
        // Selecionar a base correta consoante o tipo de fase
        const baseValue = phase.type === 'EXECUTION' ? executionBase : licensingBase;

        return {
            phase,
            value: (baseValue * phase.percentage) / 100
        };
    });
}
