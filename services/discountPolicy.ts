import { Scenario, DiscountAudit } from '../types';

// Se nao tiveres feeCalculatorUtils, usa este clamp aqui:
const _clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export type DiscountType =
    | 'none'
    | 'clienteRecorrente'
    | 'packCompleto'
    | 'antecipacaoPagamento'
    | 'volume'
    | 'earlyBird'
    | 'promocaoSazonal'
    | 'custom';

export type UserRole = 'auto' | 'arquiteto' | 'financeiro' | 'marketing' | 'diretor';

export interface DiscountInput {
    type: DiscountType;
    value: number; // percentagem pedida
    justification?: string;
}

export interface DiscountContext {
    userRole: UserRole;
    scenario: Scenario;
    specCount: number;
    hasAllPhases?: boolean; // se quiseres ligar a “pack completo”
}

export interface DiscountPolicyRule {
    maxPct: number;
    requiresRole: UserRole;
    requiresJustificationAbove?: number; // ex: >10%
    description: string;
    // regra opcional de aplicabilidade
    isAllowed?: (ctx: DiscountContext) => boolean;
}

const ROLE_LEVEL: Record<UserRole, number> = {
    auto: 0,
    arquiteto: 1,
    financeiro: 2,
    marketing: 2,
    diretor: 3,
};

export const DISCOUNT_POLICY: Record<DiscountType, DiscountPolicyRule> = {
    none: { maxPct: 0, requiresRole: 'auto', description: 'Sem desconto' },

    clienteRecorrente: {
        maxPct: 10,
        requiresRole: 'diretor',
        requiresJustificationAbove: 10,
        description: 'Cliente com recorrencia comprovada'
    },

    packCompleto: {
        maxPct: 12,
        requiresRole: 'auto',
        requiresJustificationAbove: 10,
        description: 'Pack completo (fases + coordenacao)',
        isAllowed: (ctx) => ctx.scenario !== 'essential' // nao permitir em modo essencial (risco)
    },

    antecipacaoPagamento: {
        maxPct: 7,
        requiresRole: 'financeiro',
        description: 'Pagamento antecipado (100% ou marco reforcado)'
    },

    volume: {
        maxPct: 20,
        requiresRole: 'diretor',
        requiresJustificationAbove: 10,
        description: 'Volume (ex.: multiplas unidades)'
    },

    earlyBird: {
        maxPct: 5,
        requiresRole: 'auto',
        description: 'Fecho rapido (≤15 dias)'
    },

    promocaoSazonal: {
        maxPct: 10,
        requiresRole: 'marketing',
        requiresJustificationAbove: 10,
        description: 'Campanha sazonal'
    },

    custom: {
        maxPct: 25, // teto maximo absoluto (podes subir, mas eu nao recomendo)
        requiresRole: 'diretor',
        requiresJustificationAbove: 5,
        description: 'Excecao / desconto personalizado'
    },
};



export function applyDiscountPolicy(
    subtotal: number,
    discount: DiscountInput | undefined,
    ctx: DiscountContext
): { appliedPct: number; discountAmount: number; audit: DiscountAudit; alerts: string[] } {
    const d = discount?.type ? discount : { type: 'none' as DiscountType, value: 0 };
    const pctReq = Number(d.value || 0);
    const rule = DISCOUNT_POLICY[d.type] || DISCOUNT_POLICY.none;

    const reasons: string[] = [];
    const alerts: string[] = [];

    // 1) Role check
    const userLevel = ROLE_LEVEL[ctx.userRole] ?? 0;
    const requiredLevel = ROLE_LEVEL[rule.requiresRole] ?? 0;
    if (userLevel < requiredLevel) {
        reasons.push(`Permissao insuficiente: requer ${rule.requiresRole}`);
        alerts.push(`🚫 Desconto rejeitado — requer aprovacao (${rule.requiresRole}).`);
        return {
            appliedPct: 0,
            discountAmount: 0,
            alerts,
            audit: {
                requested: { type: d.type, pct: pctReq, justification: d.justification },
                applied: { pct: 0, amount: 0 },
                status: 'rejected',
                reasons,
                policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
            }
        };
    }

    // 2) Applicability check (optional)
    if (rule.isAllowed && !rule.isAllowed(ctx)) {
        reasons.push(`Tipo de desconto nao permitido neste contexto`);
        alerts.push(`🚫 Desconto rejeitado — nao permitido para este cenario/configuracao.`);
        return {
            appliedPct: 0,
            discountAmount: 0,
            alerts,
            audit: {
                requested: { type: d.type, pct: pctReq, justification: d.justification },
                applied: { pct: 0, amount: 0 },
                status: 'rejected',
                reasons,
                policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
            }
        };
    }

    // 3) Clamp to policy max
    const pctClamped = _clamp(pctReq, 0, rule.maxPct);
    const clamped = pctClamped !== pctReq;
    if (clamped) reasons.push(`Desconto ajustado ao teto: ${rule.maxPct}%`);

    // 4) Justification if needed
    const threshold = rule.requiresJustificationAbove;
    if (threshold != null && pctClamped > threshold) {
        if (!d.justification || !d.justification.trim()) {
            reasons.push(`Justificacao obrigatoria acima de ${threshold}%`);
            alerts.push(`🚫 Desconto rejeitado — justificacao obrigatoria (> ${threshold}%).`);
            return {
                appliedPct: 0,
                discountAmount: 0,
                alerts,
                audit: {
                    requested: { type: d.type, pct: pctReq, justification: d.justification },
                    applied: { pct: 0, amount: 0 },
                    status: 'rejected',
                    reasons,
                    policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
                }
            };
        }
    }

    const discountAmount = (subtotal * pctClamped) / 100;

    return {
        appliedPct: pctClamped,
        discountAmount,
        alerts,
        audit: {
            requested: { type: d.type, pct: pctReq, justification: d.justification },
            applied: { pct: pctClamped, amount: discountAmount },
            status: clamped ? 'clamped' : 'applied',
            reasons,
            policy: { maxPct: rule.maxPct, requiresRole: rule.requiresRole, description: rule.description }
        }
    };
}
