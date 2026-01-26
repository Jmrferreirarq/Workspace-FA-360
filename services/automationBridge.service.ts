import { AutomationPayload, AutomationRun } from '../types';
import fa360 from './fa360';
import { TASK_CATALOG } from '../data/taskCatalog';

type Level = 1 | 2 | 3;

class AutomationBridgeService {
  async execute(payload: AutomationPayload, level: Level, actor = 'CEO', htmlContent?: string): Promise<AutomationRun> {
    const now = new Date();
    const runId = `RUN_${now.getTime()}`;

    // 1) Create Project
    const projectId = `PROJ_${now.getTime()}`;
    await fa360.create('Projects', {
      id: projectId,
      title: `${payload.templateId} • ${payload.client.name || 'Cliente'}`,
      client: payload.client.name,
      location: payload.location,
      templateId: payload.templateId,
      scenario: payload.scenarioId,
      budget: payload.fees.total,         // NET (sem IVA)
      vatRate: payload.fees.vatRate,
      gross: payload.fees.total * (1 + payload.fees.vatRate),
      status: 'planning',
      progress: 0,
      createdAt: now.toISOString(),
      lastUpdate: Date.now()
    });

    // 2) Create Payments (NET)
    const payments = (payload.payments || []).map((p: any, idx: number) => ({
      paymentId: `PAY_${now.getTime()}_${idx + 1}`,
      projectId,
      name: p.name || `Milestone ${idx + 1}`,
      appliesTo: p.appliesTo || 'TOTAL',
      percentage: p.percentage || 0,
      amountNet: p.value || 0,
      vatRate: payload.fees.vatRate,
      dueDate: this.computeDueDate(payload.schedule.startDate, p.dueDays || 30),
      status: 'pending',
      phaseId: p.phaseId || '',
    }));

    for (const pm of payments) await fa360.create('Payments', pm);

    // 3) Create Tasks
    const allTaskIds = [...(payload.tasks.arch || []), ...(payload.tasks.spec || [])];

    for (const tId of allTaskIds) {
      const meta = this.resolveTaskMeta(tId);
      await fa360.create('Tasks', {
        id: `${tId}_${now.getTime()}`,
        projectId,
        title: meta.name,
        phaseId: this.inferPhaseIdFromTaskId(tId),
        owner: meta.owner,
        estimatedHours: 0,
        actualHours: 0,
        completed: false,
        deadline: this.computeDueDate(payload.schedule.startDate, 30),
        priority: 'Medium',
        dependencies: meta.dependencies,
      });
    }

    // 4) Documents (level 2+)
    let proposalId: string | undefined = undefined;
    let proposalUrl = '';

    if (level >= 2 && htmlContent) {
      try {
        const response = await fetch('/api/docs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            filename: `Proposta_${payload.client.name || 'Cliente'}_${Date.now()}.html`,
            mimeType: 'text/html',
            contentBase64: btoa(unescape(encodeURIComponent(htmlContent)))
          })
        });
        const docResult = await response.json();
        proposalUrl = docResult.url || '';
      } catch (err) {
        fa360.log("ERROR: Falha ao fazer upload da proposta para o Drive.");
      }
    }

    if (level >= 2) {
      proposalId = `DOC_PROP_${now.getTime()}`;
      await fa360.create('Documents', {
        docId: proposalId,
        projectId,
        type: 'proposal',
        title: `Proposta • ${payload.client.name || 'Cliente'}`,
        url: proposalUrl,
        createdAt: now.toISOString(),
        metaJson: JSON.stringify({ templateId: payload.templateId, scenarioId: payload.scenarioId }),
      });
    }

    // 5) Audit Log
    await fa360.create('AuditLog', {
      logId: `LOG_${now.getTime()}`,
      projectId,
      action: `AUTOMATION_RUN_LEVEL_${level}`,
      payloadJson: JSON.stringify(payload),
      createdAt: now.toISOString(),
      actor,
    });

    return {
      id: runId,
      simulationId: payload.simulationId,
      timestamp: now,
      status: 'success',
      createdIds: { projectId, proposalId },
    };
  }

  private computeDueDate(startDateISO: string, dueDays: number) {
    const d = new Date(startDateISO);
    d.setDate(d.getDate() + dueDays);
    return d.toISOString().slice(0, 10);
  }

  private inferPhaseIdFromTaskId(taskId: string) {
    const m = taskId.match(/^([AE]\d)/);
    return m ? m[1] : '';
  }

  private resolveTaskMeta(taskId: string) {
    // Find in TASK_CATALOG by ID or Name
    const tpl = TASK_CATALOG.find(t => t.id === taskId || t.name === taskId);

    const ownerMap: Record<string, string> = {
      'architect': 'CEO',
      'intern': 'JESSICA',
      'engineer': 'SOFIA',
      'designer': 'SOFIA',
      'external': 'OUTSOURCED'
    };

    return {
      name: tpl?.name || taskId,
      owner: ownerMap[tpl?.responsible || ''] || 'CEO',
      dependencies: '',
    };
  }
}

export const automationBridgeService = new AutomationBridgeService();
