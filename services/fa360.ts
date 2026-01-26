
import { TranslationKeys } from './translations';
import { Task, TimeLog } from '../types';
import { geminiService } from './geminiService';

const telemetryListeners: ((log: string) => void)[] = [];

export const STORAGE_KEYS = {
  HOOK: "fa-brain-hook",
  STATUS: "fa-brain-status",
  LAST_SYNC: "fa-last-sync-time",
  WORKSPACE: "fa-workspace-id",
  AUTH: "fa-auth-token",
  PROJECTS: "fa-local-projects",
  CLIENTS: "fa-local-clients",
  PROPOSALS: "fa-local-proposals",
  EXPENSES: "fa-local-expenses",
  DIARY: "fa-local-diary",
  QUEUE: "fa-sync-queue",
  SHIELD_KEY: "fa-neural-shield-id",
  SYNTHESIS: "fa-neural-synthesis",
  METADATA: "fa-system-metadata",
  AUDIT_CACHE: "fa-audit-cache",
  FILES: "fa-local-files",
  BRAND: "fa-brand-settings",
  MATERIALS: "fa-local-materials",
  MEDIA: "fa-local-media",
  TIMELOGS: "fa-local-timelogs",
  TASKS: "fa-local-tasks",
  TEAM: "fa-local-team",
  TRANSMITTALS: "fa-local-transmittals",
  PAYMENTS: "fa-local-payments",
  DOCUMENTS: "fa-local-documents",
  AUDIT_LOG: "fa-local-audit-log"
};

const workerCode = "self.onmessage = async (e) => { const { hook, category, data, studio } = e.data; try { await fetch(hook, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ category, data, studio, timestamp: new Date().toISOString() }) }); self.postMessage({ success: true, category }); } catch (err) { self.postMessage({ success: false, category, error: err.message }); } };";

export const NeuralStorage = {
  save: async (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  load: async (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  remove: async (key: string) => {
    localStorage.removeItem(key);
  },
  getTimestamp: async (key: string) => {
    const meta = await NeuralStorage.load(STORAGE_KEYS.METADATA) as any || {};
    return meta[key] || 0;
  },
  updateTimestamp: async (key: string) => {
    const meta = await NeuralStorage.load(STORAGE_KEYS.METADATA) as any || {};
    meta[key] = Date.now();
    await NeuralStorage.save(STORAGE_KEYS.METADATA, meta);
  },
  ensureFiles: async () => {
    // Zero Data Mode: No defaults
    const existing = await NeuralStorage.load(STORAGE_KEYS.FILES);
    if (!existing) {
      await NeuralStorage.save(STORAGE_KEYS.FILES, []);
    }
  }
};

const fa360 = {
  log: (msg: string) => {
    const logEntry = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(`%c FA-360 %c ${logEntry}`, "background: #d4af37; color: #000; font-weight: bold; border-radius: 3px; padding: 0 5px;", "color: #d4af37;");
    telemetryListeners.forEach(l => l(logEntry));
  },

  onLog: (callback: (log: string) => void) => {
    telemetryListeners.push(callback);
  },

  getEcosystemSnapshot: async () => {
    const projects = await fa360.listProjects();
    const clients = await fa360.listClients();
    const proposals = await fa360.listProposals();
    const expenses = await fa360.listExpenses();

    const pipelines = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    return {
      timestamp: new Date().toISOString(),
      stats: {
        projectsCount: projects.length,
        clientsCount: clients.length,
        activeProposalsValue: pipelines,
        monthlyExpenses: expenses.reduce((acc, e) => acc + (e.value || 0), 0)
      },
      health: projects.length > 0 ? "EXCELLENT" : "STANDBY",
      studio: "Ferreira Arquitetos"
    };
  },

  updateProjectStatus: async (projectId: string, newStatus: string) => {
    const projects = await fa360.listProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false };

    project.status = newStatus;
    project.lastModified = Date.now();

    await NeuralStorage.save(STORAGE_KEYS.PROJECTS, projects);
    await NeuralStorage.updateTimestamp('PROJECTS');

    fa360.log(`CORE: Status do projeto ${project.name} atualizado para ${newStatus}.`);

    // Propagar via Neural Link
    fa360.pushToBrain("PROJECTS", project);

    return { success: true };
  },

  listProjects: async () => {
    // Zero Data Mode: Just return the raw local data
    return await NeuralStorage.load(STORAGE_KEYS.PROJECTS) || [];
  },

  saveProject: async (project: any) => {
    const projects = await fa360.listProjects();
    const updated = [project, ...projects];
    await NeuralStorage.save(STORAGE_KEYS.PROJECTS, updated);
    fa360.log(`PROJECT: Projeto ${project.name} gravado localmente.`);
    return { success: true };
  },

  deleteProject: async (id: string) => {
    const projects = await fa360.listProjects();
    const updated = projects.filter((p: any) => p.id !== id);
    await NeuralStorage.save(STORAGE_KEYS.PROJECTS, updated);
    fa360.log(`PROJECT: Projeto ${id} removido.`);
    return { success: true };
  },

  listClients: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.CLIENTS) || [];
  },

  saveClient: async (client: any) => {
    const clients = await fa360.listClients();
    const updated = [client, ...clients];
    await NeuralStorage.save(STORAGE_KEYS.CLIENTS, updated);
    fa360.log(`CRM: Novo cliente ${client.name} registado.`);
    return { success: true };
  },

  deleteClient: async (id: string) => {
    const clients = await fa360.listClients();
    const updated = clients.filter((c: any) => c.id !== id);
    await NeuralStorage.save(STORAGE_KEYS.CLIENTS, updated);
    fa360.log(`CRM: Cliente ${id} removido.`);
    return { success: true };
  },

  listProposals: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.PROPOSALS) || [];
  },

  saveProposal: async (proposal: any) => {
    const proposals = await fa360.listProposals();
    const updated = [proposal, ...proposals];
    await NeuralStorage.save(STORAGE_KEYS.PROPOSALS, updated);
    fa360.log("CORE: Proposta " + proposal.ref + " protegida.");
    const pushResult = await fa360.pushToBrain("PROPOSALS", proposal);
    return { success: true, status: pushResult.status || (pushResult.success ? 'dispatched' : 'no_hook') };
  },

  listExpenses: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.EXPENSES) || [];
  },

  listPayments: async () => {
    // Zero Data Mode: No defaults
    return await NeuralStorage.load("fa-local-payments") || [];
  },

  savePayment: async (payment: any) => {
    const payments = await fa360.listPayments();
    const updated = [payment, ...payments];
    await NeuralStorage.save("fa-local-payments", updated);
    fa360.log(`FINANCE: Pagamento ${payment.title} registado.`);
    return { success: true };
  },

  getFinancialStats: async () => {
    const proposals = await fa360.listProposals();
    const expenses = await fa360.listExpenses();
    const projects = await fa360.listProjects();

    const liquidity = proposals
      .filter(p => p.status === 'Adjudicada')
      .reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    const pendingFees = proposals
      .filter(p => p.status === 'Enviada' || p.status === 'Negociação')
      .reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    const totalCosts = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
    const totalFees = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

    const margin = totalFees > 0 ? Math.round(((totalFees - totalCosts) / totalFees) * 100) : 0;
    const burnRate = expenses.length > 0 ? (totalCosts / 12).toFixed(1) : 0; // Simple monthly average if data exists

    return {
      liquidity,
      pendingFees: Math.round(pendingFees / 1000), // K format for UI
      burnRate,
      margin
    };
  },

  getFinancialProjections: async () => {
    // Zero Data Mode: No projections if no data
    return [];
  },

  saveExpense: async (expense: any) => {
    const expenses = await fa360.listExpenses();
    const updated = [expense, ...expenses];
    await NeuralStorage.save(STORAGE_KEYS.EXPENSES, updated);
    fa360.log("CORE: Despesa registada.");
    return { success: true };
  },

  getDashboardStats: async () => {
    const projects = await fa360.listProjects();
    const isOnline = fa360.getNeuralStatus();
    const lastSync = await NeuralStorage.load(STORAGE_KEYS.LAST_SYNC);
    const proposals = await fa360.listProposals();

    const pipelineValue = proposals.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
    const healthIndex = projects.length > 0 ? 98 : 0;

    return {
      activeProjects: projects.length,
      neuralStatus: isOnline ? 'Online' : 'Offline',
      lastSync,
      pipelineValue: pipelineValue,
      healthIndex: healthIndex
    };
  },

  getDailyBriefing: async () => {
    const tasks = await fa360.listTasks();
    const projects = await fa360.listProjects();
    const proposals = await fa360.listProposals();
    const expenses = await fa360.listExpenses();
    const now = new Date();

    // 1. Today Ops
    const todayTasks = tasks.filter(t => {
      const due = new Date(t.deadline);
      return !t.completed && due <= now; // Overdue or due today
    }).slice(0, 5); // Top 5

    // 2. Critical Alerts
    const alerts: any[] = [];
    
    // Alert: Overdue Tasks
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.deadline) < now);
    if (overdueTasks.length > 0) {
      alerts.push({
        id: 'alert-tasks',
        type: 'TASK_OVERDUE',
        message: `${overdueTasks.length} tarefas em atraso`,
        daysLate: Math.floor((now.getTime() - new Date(overdueTasks[0].deadline).getTime()) / (1000 * 3600 * 24)),
        actionUrl: '/tasks'
      });
    }

    // Alert: Stalled Projects (Mock logic for now)
    const stalled = projects.filter(p => !p.nextActionDate || new Date(p.nextActionDate) < now);
    if (stalled.length > 0) {
      alerts.push({
        id: 'alert-projects',
        type: 'PROJECT_BLOCKED',
        message: `${stalled.length} projetos sem ação definida`,
        actionUrl: '/projects'
      });
    }

    // 3. Cashflow (Mock/Simple logic)
    // In real scenario, this would sum paid vs unpaid invoices in date range
    const cashflow = {
      received30d: 0, // Placeholder
      projected30d: proposals.filter(p => p.status === 'Adjudicada').reduce((acc, p) => acc + (parseFloat(p.total) || 0) * 0.3, 0), // 30% downpayment
      overdue: 0
    };

    // 4. Funnel
    const funnel = {
      leads: proposals.filter(p => p.status === 'Rascunho').length,
      activeProposals: proposals.filter(p => p.status === 'Enviada').length,
      activeValue: proposals.filter(p => p.status === 'Enviada').reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0),
      negotiation: proposals.filter(p => p.status === 'Negociação').length,
      conversionRate: 0 // Need historical data
    };

    // 5. Health Index Algorithmic Calculation
    let scoreDeadlines = 100 - (overdueTasks.length * 10);
    let scoreCash = 100; // Assume perfect for now until invoices exist
    let scoreProduction = 100; // No plan data yet
    let scoreRisk = 100 - (stalled.length * 15);

    // Clamping
    scoreDeadlines = Math.max(0, scoreDeadlines);
    scoreRisk = Math.max(0, scoreRisk);

    const totalHealth = Math.round((scoreDeadlines + scoreCash + scoreProduction + scoreRisk) / 4);
    
    let reason = "Operação estável.";
    if (overdueTasks.length > 0) reason = `${overdueTasks.length} tarefas em atraso detetadas.`;
    if (stalled.length > 0) reason += ` ${stalled.length} projetos estagnados.`;

    const metrics: any = {
      todayTasks,
      todayMeetings: [], // Calendar integration future step
      criticalAlerts: alerts.slice(0, 3),
      cashflow,
      funnel,
      healthIndex: {
        total: projects.length > 0 ? totalHealth : 100, // Default to 100 if no noise
        breakdown: {
          deadlines: scoreDeadlines,
          cash: scoreCash,
          production: scoreProduction,
          risk: scoreRisk
        },
        reason: projects.length > 0 ? reason : "Aguardando primeiros projetos."
      },
      production: [
        { member: 'CEO', plannedHours: 40, actualHours: 0, utilization: 0 } // Mock for structure
      ],
      neuralStatus: {
        status: fa360.getNeuralStatus() ? 'ONLINE' : 'OFFLINE',
        lastSync: await NeuralStorage.load(STORAGE_KEYS.LAST_SYNC),
        message: fa360.getNeuralStatus() ? 'Sincronizado' : 'Conexão Sheets pendente'
      }
    };

    return {
      tasks: todayTasks,
      meetings: [],
      pendingInvoices: 0,
      stalledProjects: stalled.length,
      metrics
    };
  },

  listTasks: async (): Promise<Task[]> => {
    return await NeuralStorage.load(STORAGE_KEYS.TASKS) || [];
  },

  saveTask: async (task: Task) => {
    const tasks = await fa360.listTasks();
    const updated = [task, ...tasks];
    await NeuralStorage.save(STORAGE_KEYS.TASKS, updated);
    fa360.log(`TASK: Nova tarefa "${task.title}" registada.`);
    return { success: true };
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    let tasks = await fa360.listTasks();
    tasks = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    await NeuralStorage.save(STORAGE_KEYS.TASKS, tasks);
    fa360.log(`TASK: Tarefa ${taskId} atualizada.`);
    return { success: true };
  },

  deleteTask: async (taskId: string) => {
    let tasks = await fa360.listTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    await NeuralStorage.save(STORAGE_KEYS.TASKS, tasks);
    fa360.log(`TASK: Tarefa ${taskId} removida.`);
    return { success: true };
  },

  listEvents: async () => {
    // Current date for default context
    return [];
  },

  getAIRecommendations: async (category: 'FINANCIAL' | 'CALENDAR') => {
    if (category === 'FINANCIAL') {
      return "Nenhum dado financeiro suficiente para análise neural.";
    }
    return "Agenda livre. Ótimo momento para planeamento estratégico.";
  },

  getNeuralStatus: () => {
    return !!localStorage.getItem(STORAGE_KEYS.STATUS);
  },

  getNeuralHook: () => {
    return localStorage.getItem(STORAGE_KEYS.HOOK) || "";
  },

  logTime: async (log: Omit<TimeLog, 'id'>) => {
    const logs = await NeuralStorage.load(STORAGE_KEYS.TIMELOGS) || [];
    const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
    const updated = [newLog, ...logs];
    await NeuralStorage.save(STORAGE_KEYS.TIMELOGS, updated);
    fa360.log(`TIME: ${log.duration}m registados em ${log.projectId}`);
    return { success: true, log: newLog };
  },

  getProjectTimeLogs: async (projectId: string) => {
    const logs = await NeuralStorage.load(STORAGE_KEYS.TIMELOGS) || [];
    return logs.filter((l: any) => l.projectId === projectId);
  },

  listTimeLogs: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.TIMELOGS) || [];
  },

  subscribeToLogs: (callback: (log: string) => void) => {
    telemetryListeners.push(callback);
    return () => {
      const index = telemetryListeners.indexOf(callback);
      if (index > -1) {
        telemetryListeners.splice(index, 1);
      }
    };
  },

  connectNeuralMaster: async (hook: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOOK, hook);
      localStorage.setItem(STORAGE_KEYS.STATUS, "true");
      await fa360.forceSync();
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },

  syncAllLocalData: async () => {
    fa360.log("SYNC: Sincronização em massa iniciada...");
    await fa360.forceSync();
    return { success: true };
  },

  pushToBrain: async (category: string, data: any) => {
    const hook = localStorage.getItem(STORAGE_KEYS.HOOK);
    const studio = "Ferreira Arquitetos";

    if (!hook) {
      const queue = await NeuralStorage.load(STORAGE_KEYS.QUEUE) || [];
      queue.push({ category, data, timestamp: new Date().toISOString() });
      await NeuralStorage.save(STORAGE_KEYS.QUEUE, queue);
      return { success: false, status: 'no_hook' };
    }

    try {
      const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
      worker.postMessage({ hook, category, data, studio });
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  synthesizeProjectInsights: async (project: any) => {
    const cacheKey = `fa-insight-${project.id}`;
    const cached = await NeuralStorage.load(cacheKey);
    if (cached && (Date.now() - cached.timestamp < 1000 * 60 * 60 * 24)) {
      return cached.text;
    }

    const text = await geminiService.analyzeProjectHealth(project);
    await NeuralStorage.save(cacheKey, { text, timestamp: Date.now() });
    return text;
  },

  getGlobalEcosystemAudit: async (locale: string = 'pt') => {
    const cachedAudit = await NeuralStorage.load(STORAGE_KEYS.AUDIT_CACHE);
    const ONE_HOUR = 60 * 60 * 1000;

    if (cachedAudit && (Date.now() - cachedAudit.timestamp < ONE_HOUR)) {
      fa360.log("AI_CACHE: Recuperando auditoria estratégica da Neural Cache.");
      return cachedAudit.result;
    }

    const snapshot = await fa360.getEcosystemSnapshot();
    const result = await geminiService.performGlobalEcosystemAudit(snapshot, locale);

    await NeuralStorage.save(STORAGE_KEYS.AUDIT_CACHE, {
      result,
      timestamp: Date.now(),
      snapshotHash: btoa(JSON.stringify(snapshot)).slice(0, 10)
    });

    return result;
  },

  listTechnicalFiles: async () => {
    await NeuralStorage.ensureFiles();
    return await NeuralStorage.load(STORAGE_KEYS.FILES) as any[] || [];
  },

  saveTechnicalFile: async (file: any) => {
    const files = await fa360.listTechnicalFiles();
    const updated = [file, ...files];
    await NeuralStorage.save(STORAGE_KEYS.FILES, updated);
    fa360.log(`FILE: Novo ficheiro técnico ${file.name} registado.`);
    return { success: true };
  },

  deleteTechnicalFile: async (id: string) => {
    const files = await fa360.listTechnicalFiles();
    const updated = files.filter((f: any) => f.id !== id);
    await NeuralStorage.save(STORAGE_KEYS.FILES, updated);
    fa360.log(`FILE: Ficheiro técnico ${id} removido.`);
    return { success: true };
  },

  runAIIntegrityCheck: async () => {
    fa360.log("AI_TECHNICAL: Iniciando varredura de integridade documental...");
    const files = await fa360.listTechnicalFiles();
    const result = await geminiService.checkDocumentationIntegrity(files);
    return result;
  },

  getBrandSettings: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.BRAND) || {
      studioName: "FERREIRA Arquitetos",
      tagline: "Vision to Matter",
      tone: "Sophisticated"
    };
  },

  saveBrandSettings: async (settings: any) => {
    await NeuralStorage.save(STORAGE_KEYS.BRAND, settings);
    fa360.log("BRAND: Identidade de marca atualizada.");
    return { success: true };
  },

  purgeSystemCache: () => {
    fa360.log("CRITICAL: Purga Total solicitada.");
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    // Clear any project-specific insights too
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fa-insight-')) {
        localStorage.removeItem(key);
      }
    }
    window.location.reload();
  },

  listActivity: async () => {
    // For now returning empty until we implement a real activity logger
    return [];
  },

  forceSync: async () => {
    fa360.log("SYNC: Iniciando Força Bruta de sincronização.");
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    window.dispatchEvent(new CustomEvent("fa-sync-complete"));
  },

  listMaterials: async () => {
    let existing = await NeuralStorage.load(STORAGE_KEYS.MATERIALS) as any[];

    const defaults = [
      {
        id: 'M001',
        name: 'Mármore Estremoz',
        category: 'Stone',
        finish: 'Polido',
        price: 'High',
        eco: 95,
        image: '/marble_estremoz.png?v=2',
        location: 'mat_in_studio',
        supplier: 'Margres',
        technical: 'Mármore de origem portuguesa com baixa porosidade e alta resistência ao desgaste. Ideal para pavimentos interiores e revestimentos de luxo.'
      },
      {
        id: 'M002',
        name: 'Carvalho Americano',
        category: 'Wood',
        finish: 'Escovado',
        price: 'Medium',
        eco: 85,
        image: '/american_oak.png?v=2',
        location: 'mat_in_studio',
        supplier: 'Sonae Arauco',
        technical: 'Madeira de média densidade com grão aberto. Excelente estabilidade dimensional e resistência ao impacto.'
      },
      {
        id: 'M003',
        name: 'Betão Arquitetônico',
        category: 'Cladding',
        finish: 'Visto',
        price: 'Low',
        eco: 60,
        image: '/concrete_arch.png?v=2',
        location: 'mat_on_site',
        supplier: 'Secil',
        technical: 'Betão de alta performance com acabamento liso. Alta inércia térmica e resistência estrutural.'
      }
    ];

    if (!existing || existing.length === 0) {
      await NeuralStorage.save(STORAGE_KEYS.MATERIALS, defaults);
      return defaults;
    }

    // Force repair of image paths for defaults if they exist but images are broken/missing
    let changed = false;
    existing = existing.map(m => {
      const def = defaults.find(d => d.id === m.id);
      if (def && m.image !== def.image) {
        changed = true;
        return { ...m, image: def.image };
      }
      return m;
    });

    if (changed) {
      await NeuralStorage.save(STORAGE_KEYS.MATERIALS, existing);
    }

    return existing;
  },

  getNeuralProtocol: async (agentId: string) => {
    const protocols: Record<string, string> = {
      'concierge': "AGENTE: DIGITAL CONCIERGE\nMODO: REATIVO\n\nInstrução Primária:\nAtuar como primeiro ponto de contacto para leads e clientes.\n\nDiretrizes:\n1. Responder sempre com tom 'Inspirational'.\n2. Priorizar agendamento de reuniões.\n3. Encaminhar questões técnicas para o Piloto Financeiro.",
      'pilot': "AGENTE: FINANCIAL PILOT\nMODO: ANALÍTICO\n\nInstrução Primária:\nMonitorizar rentabilidade e cashflow do estúdio.\n\nDiretrizes:\n1. Alerta crítico se margem < 20%.\n2. Validar viabilidade de todas as propostas > 50k.\n3. Otimizar fluxo de caixa a 30 dias.",
      'director': "AGENTE: CREATIVE DIRECTOR\nMODO: VISIONÁRIO\n\nInstrução Primária:\nGarantir coerência estética de todas as saídas.\n\nDiretrizes:\n1. Validar materiais com base na sustentabilidade.\n2. Manter linguagem minimalista e premium.\n3. Rejeitar renderizações de baixa resolução."
    };
    return protocols[agentId] || "Protocolo não definido.";
  },

  runMaterialAIAnalysis: async (material: any) => {
    fa360.log(`AI_MATERIAL: Analisando performance técnica de ${material.name}...`);
    return await geminiService.getMaterialPerformanceAnalysis(material);
  },

  listMediaAssets: async () => {
    // Zero Data Mode: Start empty
    const existing = await NeuralStorage.load(STORAGE_KEYS.MEDIA);
    if (!existing) {
      await NeuralStorage.save(STORAGE_KEYS.MEDIA, []);
      return [];
    }
    return existing;
  },

  listTeamMembers: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.TEAM) || [];
  },

  listTransmittals: async () => {
    return await NeuralStorage.load(STORAGE_KEYS.TRANSMITTALS) || [];
  },

  runCreativeMediaAudit: async () => {
    fa360.log("AI_MEDIA: Analisando impacto visual da biblioteca...");
    const assets = await fa360.listMediaAssets();
    return await geminiService.getCreativeMediaDirective(assets);
  },

  // Repository Generic Bridge for Automation
  create: async (category: string, data: any) => {
    const keyMap: Record<string, string> = {
      'Projects': STORAGE_KEYS.PROJECTS,
      'Payments': STORAGE_KEYS.PAYMENTS,
      'Tasks': STORAGE_KEYS.TASKS,
      'Documents': STORAGE_KEYS.DOCUMENTS,
      'AuditLog': STORAGE_KEYS.AUDIT_LOG,
    };

    const key = keyMap[category];
    if (!key) throw new Error(`Unknown category: ${category}`);

    const existing = await NeuralStorage.load(key) || [];
    const updated = [data, ...existing];
    await NeuralStorage.save(key, updated);
    
    fa360.log(`REPO: New entry in ${category}`);
    
    // Optional: push to brain if hook exists
    fa360.pushToBrain(category.toUpperCase(), data);
    
    return { success: true };
  }
};

export default fa360;