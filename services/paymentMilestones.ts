import { Scenario } from '../types';

export const PAYMENT_MILESTONES: Record<Scenario, { name: string; pct: number; dueDays: number }[]> = {
    essential: [
        { name: 'Adjudicacao', pct: 50, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 50, dueDays: 3 },
    ],
    standard: [
        { name: 'Adjudicacao', pct: 30, dueDays: 3 },
        { name: 'Entrega EP', pct: 25, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 30, dueDays: 3 },
        { name: 'Fecho', pct: 15, dueDays: 5 },
    ],
    premium: [
        { name: 'Adjudicacao', pct: 25, dueDays: 3 },
        { name: 'Entrega EP', pct: 25, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 25, dueDays: 3 },
        { name: 'Entrega Execucao', pct: 15, dueDays: 3 },
        { name: 'Assistencia', pct: 10, dueDays: 30 },
    ],
};
