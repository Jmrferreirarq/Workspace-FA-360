export const INTERNAL_RATES = {
    senior: 55,      // CEO
    architect: 45,   // arquiteto (misto)
    team: 38,        // média (Jéssica/Sofia)
} as const;

export const OVERHEAD_MULT = 1.20; // 20% overhead

export const FINANCE_THRESHOLDS = {
    marginBlock: 45,
    marginWarn: 50,
    marginHealthy: 60,
    discountAlert: 15,
    discountMax: 25
};

export const MIN_FEES = {
    essential: 2500,
    standard: 4000,
    premium: 7500
} as const;
