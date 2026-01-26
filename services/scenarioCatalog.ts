import { Scenario } from "../types";

export const SCENARIO_CATALOG: Record<Scenario, {
    label: string;
    multiplier: number;
    revisions: string;
    deliverables: string[];
    exclusions: string[];
}> = {
    essential: {
        label: "Essencial",
        multiplier: 0.85,
        revisions: "1 revisão por fase",
        deliverables: ["Peças desenhadas PDF", "Memória Descritiva"],
        exclusions: ["Mapas de quantidades", "Visualização 3D", "Coordenação Obra"]
    },
    standard: {
        label: "Profissional",
        multiplier: 1.0,
        revisions: "2 revisões por fase",
        deliverables: ["Peças desenhadas PDF", "Memória Descritiva", "Mapas de acabamentos", "Estudo térmico preliminar"],
        exclusions: ["Coordenação de Obra", "Fiscalização"]
    },
    premium: {
        label: "Executivo",
        multiplier: 1.5,
        revisions: "Ilimitadas (razoáveis)",
        deliverables: ["Pack desenho completo", "Mapas de medições", "Visualização 3D", "Caderno de encargos", "Coordenação Projeto-Obra"],
        exclusions: ["Taxas administrativas"]
    }
};
