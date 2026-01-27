
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'architect' | 'client';
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: 'planning' | 'construction' | 'finished';
  budget: number;
  progress: number;
  image: string;
  nextAction?: string;
  nextActionDate?: string;
  lastUpdate?: number;
}

export type Complexity = 1 | 2 | 3;
export type Scenario = 'essential' | 'standard' | 'premium';
export type UnitKind = 'APARTMENT' | 'LOT' | 'ROOM';

export interface UnitsInput {
  apartments?: number;
  lots?: number;
  rooms?: number;
}

export interface UnitPricingConfig {
  unitKind: UnitKind;
  baseFeeArch?: number;
  feePerUnitArch: number;
  feePerM2Arch?: number;
  includedUnits?: number;
  extraUnitMultiplier?: number;
}

export type ClientProfile = 'private' | 'promoter' | 'institutional';
export type ProcessType = 'pip' | 'lic' | 'exec';
export type LocationTier = 'interior_base' | 'interior' | 'litoral_base' | 'litoral' | 'porto';

export type DiscountType = 'none' | 'clienteRecorrente' | 'packCompleto' | 'antecipacaoPagamento' | 'volume' | 'earlyBird' | 'promocaoSazonal' | 'custom';
export type UserRole = 'auto' | 'arquiteto' | 'financeiro' | 'marketing' | 'diretor';

export interface DiscountInput {
  type: DiscountType;
  value: number;
  justification?: string;
}

export interface CalculationParams {
  templateId: string;
  area: number;
  complexity: Complexity;
  selectedSpecs: string[];
  scenario: Scenario;

  // Patch V1
  vatRate?: 0.06 | 0.23;
  processType?: ProcessType;
  clientProfile?: ClientProfile;
  locationTier?: LocationTier;

  units?: UnitsInput;
  discount?: DiscountInput;
  userRole?: UserRole;
}

export interface ScenarioConfig {
  label: string;
  multiplier: number;
  revisions: string;
  deliverables: string[];
  exclusions: string[];
}

export interface DiscountAudit {
  requested: { type: DiscountType; pct: number; justification?: string };
  applied: { pct: number; amount: number };
  status: 'applied' | 'rejected' | 'clamped';
  reasons: string[];
  policy: { maxPct: number; requiresRole: UserRole; description: string };
}

export interface ConfigSnapshot {
  vatRate: number;
  thresholds: {
    marginBlock: number;
    marginWarn: number;
    marginHealthy: number;
  };
  multipliers: {
    complexity: number;
    scenario: number;
  };
  scenarioConfig: ScenarioConfig;
}

export interface FeeResultV1 {
  totals: {
    archNet: number;
    specNet: number;
    net: number;
    vat: number;
    gross: number;
  };
  phases: Array<{
    id: string;
    label: string;
    value: number;
    vat: number;
    gross: number;
  }>;
  payments: Array<{
    name: string;
    pct: number;
    dueDays: number;
    value: number;
    vat: number;
    gross: number;
  }>;
  tasks: {
    archIds: string[];
    specIds: string[];
  };
  risk: {
    score: number;
    level: string;
    alerts: string[];
    recs: string[];
  };
  meta: {
    version: string;
    configSnapshot?: ConfigSnapshot;
    templateId: string;
    pricingModel: string;
    appliedDiscount: number;
    discountAudit: DiscountAudit;
    specCount: number;
    compMult: number;
    scenMult: number;
    minFeeApplied: boolean;
    units: UnitsInput;
    vatRate: number;
    scenarioDiffs: {
      standard: number;
      current: number;
    };
  };
}

// Fee Engine Types
export interface FeeTemplate {
  templateId: string;
  namePT: string;
  nameEN: string;
  processType: 'lic' | 'exec' | 'hybrid';
  pricingModel: 'PACKAGE' | 'EUR_PER_M2' | 'UNIT';
  legalProfile: string;
  sortOrder: number;
  baseFeeArch?: number;
  rateArchPerM2?: number;
  minFeeTotal?: number;
  unitPricing?: UnitPricingConfig;
}

export interface Phase {
  phaseId: string;
  phaseType: 'ARCH' | 'SPEC';
  labelPT: string;
  labelEN: string;
  shortPT: string;
  shortEN: string;
}

export interface Discipline {
  disciplineId: string;
  labelPT: string;
  labelEN: string;
  phases?: Array<{
    phaseId: string;
    labelPT: string;
    shortPT: string;
  }>;
}

export interface TemplatePhaseWeight {
  templateId: string;
  phaseId: string;
  weightPct: number;
}

export interface TemplateSpecialty {
  templateId: string;
  disciplineId: string;
  required: boolean;
  defaultOn: boolean;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface TimeLog {
  id: string;
  projectId: string;
  date: string;
  duration: number; // minutes
  phase: string;
  description?: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  projectId?: string;
  projectKey?: string;
  completed: boolean;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  projectId?: string;
}

export interface CriticalAlert {
  id: string;
  type: 'PAYMENT_OVERDUE' | 'TASK_OVERDUE' | 'PROJECT_BLOCKED' | 'CLIENT_PENDING';
  message: string;
  projectId?: string;
  daysLate?: number;
  actionUrl: string;
}

export interface CashflowStats {
  received30d: number;
  projected30d: number;
  overdue: number;
}

export interface FunnelStats {
  leads: number;
  activeProposals: number;
  activeValue: number;
  negotiation: number;
  conversionRate: number;
}

export interface ProductionStats {
  member: string;
  plannedHours: number;
  actualHours: number;
  utilization: number;
}

export interface DashboardMetrics {
  todayTasks: Task[];
  todayMeetings: Meeting[];
  criticalAlerts: CriticalAlert[];
  cashflow: CashflowStats;
  funnel: FunnelStats;
  healthIndex: {
    total: number;
    breakdown: {
      deadlines: number;
      cash: number;
      production: number;
      risk: number;
    };
    reason: string;
  };
  production: ProductionStats[];
  neuralStatus: {
    status: 'ONLINE' | 'OFFLINE';
    lastSync?: string;
    message?: string;
  };
}

export interface DailyBriefing {
  tasks: Task[];
  meetings: Meeting[];
  pendingInvoices: number;
  stalledProjects: number;
  metrics?: DashboardMetrics; // Extended support
}

export interface AutomationPayload {
  simulationId: string;
  templateId: string;
  scenarioId: Scenario;
  client: { name: string; email?: string };
  location: string;
  fees: { total: number; vatRate: number };
  payments: Array<{
    name: string;
    phaseId: string;
    percentage: number;
    value: number;
    dueDays?: number;
    appliesTo?: string;
  }>;
  tasks: {
    arch: string[];
    spec: string[];
  };
  schedule: { startDate: string };
}

export interface AutomationRun {
  id: string;
  simulationId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  createdIds: {
    projectId: string;
    proposalId?: string;
  };
}

export interface Document {
  docId: string;
  projectId: string;
  type: 'proposal' | 'contract' | 'report' | 'other';
  title: string;
  url: string;
  createdAt: string;
  metaJson?: string;
}

export interface AuditLog {
  logId: string;
  projectId: string;
  action: string;
  payloadJson: string;
  createdAt: string;
  actor: string;
}

export interface Payment {
  paymentId: string;
  projectId: string;
  name: string;
  appliesTo: string;
  percentage: number;
  amountNet: number;
  vatRate: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  phaseId: string;
}
