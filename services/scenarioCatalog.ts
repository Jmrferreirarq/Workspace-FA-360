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
        revisions: "1 revisao por fase",
        deliverables: ["Pecas desenhadas PDF", "Memoria Descritiva"],
        exclusions: ["Mapas de quantidades", "Visualizacao 3D", "Coordenacao Obra"]
    },
    standard: {
        label: "Profissional",
        multiplier: 1.0,
        revisions: "2 revisoes por fase",
        deliverables: ["Pecas desenhadas PDF", "Memoria Descritiva", "Mapas de acabamentos", "Estudo termico preliminar"],
        exclusions: ["Coordenacao de Obra", "Fiscalizacao"]
    },
    premium: {
        label: "Executivo",
        multiplier: 1.5,
        revisions: "Ilimitadas (razoaveis)",
        deliverables: ["Pack desenho completo", "Mapas de medicoes", "Visualizacao 3D", "Caderno de encargos", "Coordenacao Projeto-Obra"],
        exclusions: ["Taxas administrativas"]
    }
};
