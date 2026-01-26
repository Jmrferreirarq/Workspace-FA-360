export const DISCOUNT_POLICY = {
    replication: { max: 25, requiresApproval: false },
    scale: { max: 15, requiresApproval: false },
    partnership: { max: 10, requiresApproval: true },
    none: { max: 0, requiresApproval: false },
} as const;

export function applyDiscount(
    subTotal: number,
    discount: { type: string; value: number } | undefined
) {
    const type = (discount?.type || 'none') as keyof typeof DISCOUNT_POLICY;
    const policy = DISCOUNT_POLICY[type] || DISCOUNT_POLICY.none;

    const requestedVal = Number(discount?.value || 0);
    const appliedPct = Math.min(Math.max(0, requestedVal), policy.max);

    const amount = (subTotal * appliedPct) / 100;

    const audit = {
        requested: requestedVal,
        applied: appliedPct,
        capped: requestedVal > policy.max,
        policyMax: policy.max,
        requiresApproval: policy.requiresApproval && appliedPct > 0
    };

    return { appliedPct, amount, audit };
}
