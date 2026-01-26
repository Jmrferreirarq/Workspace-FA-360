import { Scenario } from '../types';

export const PAYMENT_MILESTONES: Record<Scenario, { name: string; pct: number; dueDays: number }[]> = {
    essential: [
        { name: 'Adjudicação', pct: 50, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 50, dueDays: 3 },
    ],
    standard: [
        { name: 'Adjudicação', pct: 30, dueDays: 3 },
        { name: 'Entrega EP', pct: 25, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 30, dueDays: 3 },
        { name: 'Fecho', pct: 15, dueDays: 5 },
    ],
    premium: [
        { name: 'Adjudicação', pct: 25, dueDays: 3 },
        { name: 'Entrega EP', pct: 25, dueDays: 3 },
        { name: 'Entrega Licenciamento', pct: 25, dueDays: 3 },
        { name: 'Entrega Execução', pct: 15, dueDays: 3 },
        { name: 'Assistência', pct: 10, dueDays: 30 },
    ],
};
