export type TaskProfile = "Arquiteto Senior" | "Equipa Tecnica" | "Arquiteto" | "Arquiteto + Equipa";

export const TASK_CATALOG = {
    arch: [
        { id: 'A0_01', label: 'Programa + EP', baseHours: 42, profile: 'Arquiteto Senior' as TaskProfile },
        { id: 'A2_01', label: 'Licenciamento', baseHours: 38, profile: 'Equipa Tecnica' as TaskProfile },
        { id: 'COORD_01', label: 'Coordenacao Especialidades', baseHours: 24, profile: 'Arquiteto' as TaskProfile },
        { id: 'A3_01', label: 'Projeto Execucao', baseHours: 56, profile: 'Arquiteto + Equipa' as TaskProfile },
        { id: 'A4_01', label: 'Assistencia Tecnica', baseHours: 18, profile: 'Equipa Tecnica' as TaskProfile },
    ],
} as const;
