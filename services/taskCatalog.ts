export type TaskProfile = "Arquiteto Sénior" | "Equipa Técnica" | "Arquiteto" | "Arquiteto + Equipa";

export const TASK_CATALOG = {
    arch: [
        { id: 'A0_01', label: 'Programa + EP', baseHours: 42, profile: 'Arquiteto Sénior' as TaskProfile },
        { id: 'A2_01', label: 'Licenciamento', baseHours: 38, profile: 'Equipa Técnica' as TaskProfile },
        { id: 'COORD_01', label: 'Coordenação Especialidades', baseHours: 24, profile: 'Arquiteto' as TaskProfile },
        { id: 'A3_01', label: 'Projeto Execução', baseHours: 56, profile: 'Arquiteto + Equipa' as TaskProfile },
        { id: 'A4_01', label: 'Assistência Técnica', baseHours: 18, profile: 'Equipa Técnica' as TaskProfile },
    ],
} as const;
