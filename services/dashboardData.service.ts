type Task = { id: string; title: string; deadline: string; completed: boolean; priority?: string; projectId?: string; projectKey?: string };
type Payment = { id: string; title: string; amountNet: number; vatRate: number; date: string; status: 'paid' | 'pending' | 'overdue'; projectId?: string };
type Project = { id: string; title: string; client?: string; status: string; nextActionDate?: string; riskFlag?: string; nextMilestone?: string; projectId?: string; name?: string; progress?: number };
type TimeEntry = { date: string; owner: string; hours: number; projectId?: string };

const toDate = (s: string) => new Date(s);
const today = () => new Date();
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

// Helper for Monday 00:00
const getStartOfWeek = (d: Date) => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday (0)
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

export class DashboardDataService {
  async build(input: { tasks: Task[]; payments: Payment[]; projects: Project[]; proposals: any[]; timeEntries?: TimeEntry[]; syncLog?: any }) {
    const now = today();
    // Reset time part for accurate date comparison
    now.setHours(0,0,0,0);
    const in7 = addDays(now, 7);
    in7.setHours(23,59,59,999);
    
    const w0 = getStartOfWeek(new Date(now));
    const timeEntries = input.timeEntries || [];

    // Filter Tasks
    const overdueTasks = input.tasks.filter(t => !t.completed && toDate(t.deadline) < now);
    const next7Tasks = input.tasks.filter(t => !t.completed && toDate(t.deadline) >= now && toDate(t.deadline) <= in7);

    // Filter Payments
    const overduePayments = input.payments.filter(p => p.status !== 'paid' && toDate(p.date) < now);
    const next7Payments = input.payments.filter(p => p.status !== 'paid' && toDate(p.date) >= now && toDate(p.date) <= in7);

    // Risk Projects
    const riskProjects = input.projects.filter(p => !!p.riskFlag || (p.nextActionDate && toDate(p.nextActionDate) < now));

    // 1. Today Ops View Model
    const todayOps = {
      dueTodayTasksCount: input.tasks.filter(t => !t.completed && toDate(t.deadline).toDateString() === now.toDateString()).length,
      overdueTasksCount: overdueTasks.length,
      next7TasksCount: next7Tasks.length,
      next7PaymentsCount: next7Payments.length,
      topTasks: [...overdueTasks, ...next7Tasks].sort((a,b) => toDate(a.deadline).getTime() - toDate(b.deadline).getTime()).slice(0, 3),
      topActivities: [] 
    };

    // 1b. Daily Highlights
    const idleProjects = input.projects.filter(p => {
      // Logic for idle: no nextActionDate or nextActionDate > 14 days ago
      if (!p.nextActionDate) return true;
      const lastAction = toDate(p.nextActionDate);
      const diffDays = Math.floor((now.getTime() - lastAction.getTime()) / (1000 * 3600 * 24));
      return diffDays > 14;
    });

    const dailyHighlights = {
      urgentTasks: input.tasks.filter(t => !t.completed && (toDate(t.deadline) <= now)).slice(0, 3),
      urgentPayments: next7Payments.slice(0, 2),
      idleProjects: idleProjects.slice(0, 2)
    };

    // 2. Critical Alerts View Model
    const criticalAlerts = [
      overduePayments[0] ? { 
        id: 'c-pay', 
        type: 'PAYMENT_OVERDUE', 
        message: `Pagamento vencido: ${overduePayments[0].title}`, 
        actionUrl: '/financial',
        daysLate: Math.floor((now.getTime() - toDate(overduePayments[0].date).getTime()) / (1000 * 3600 * 24))
      } : null,
      overdueTasks[0] ? { 
        id: 'c-task', 
        type: 'TASK_OVERDUE', 
        message: `Tarefa vencida: ${overdueTasks[0].title}`, 
        actionUrl: '/tasks',
        daysLate: Math.floor((now.getTime() - toDate(overdueTasks[0].deadline).getTime()) / (1000 * 3600 * 24))
      } : null,
      riskProjects[0] ? { 
        id: 'c-proj', 
        type: 'PROJECT_BLOCKED', 
        message: `Projeto bloqueado: ${riskProjects[0].title}`, 
        actionUrl: `/projects/${riskProjects[0].id}` 
      } : null,
    ].filter(Boolean) as any[];

    // 3. Cashflow 30D (NET based)
    const cash30d = {
      overdueNet: overduePayments.reduce((s, p) => s + (p.amountNet || 0), 0),
      next7Net: next7Payments.reduce((s, p) => s + (p.amountNet || 0), 0),
      received30d: 0, 
      projected30d: next7Payments.reduce((s, p) => s + (p.amountNet || 0), 0),
      vatRateHint: 'taxa legal',
    };

    // 4. Funnel Metrics
    const funnel = {
      leads: input.proposals.filter(p => p.status === 'Rascunho').length,
      activeProposals: input.proposals.filter(p => p.status === 'Enviada').length,
      activeValue: input.proposals.filter(p => p.status === 'Enviada' || p.status === 'Negociacao').reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0),
      negotiation: input.proposals.filter(p => p.status === 'Negociacao').length,
      closed: input.proposals.filter(p => p.status === 'Adjudicada').length,
      conversionRate: input.proposals.length > 0 ? Math.round((input.proposals.filter(p => p.status === 'Adjudicada').length / input.proposals.length) * 100) : 0
    };

    // 5. Health Index
    const scoreDeadlines = Math.max(0, 100 - (overdueTasks.length * 10));
    const scoreRisk = Math.max(0, 100 - (riskProjects.length * 15));
    const healthScore = input.projects.length > 0 ? Math.round((scoreDeadlines + 100 + 100 + scoreRisk) / 4) : 100;

    // 6. Sync Status
    const syncStatus = input.syncLog || { status: 'ONLINE', lastSync: new Date().toISOString(), message: 'Sincronizado' };

    // --- HOURS THIS WEEK ---
    const owners = ['CEO', 'JESSICA', 'SOFIA'] as const;
    const targetPerPerson = 40;

    const hoursByOwner = owners.reduce((acc, o) => {
      const h = timeEntries
        .filter((t) => t.owner === o && toDate(t.date) >= w0)
        .reduce((s, t) => s + (t.hours || 0), 0);

      acc[o] = {
        hours: Math.round(h * 10) / 10,
        target: targetPerPerson,
        pct: Math.round((h / targetPerPerson) * 100),
        status: h < targetPerPerson * 0.6 ? 'low' : h > targetPerPerson * 1.1 ? 'over' : 'ok',
      };
      return acc;
    }, {} as any);

    const activeProjects = input.projects
      .filter((p) => String(p.status || '').toLowerCase() !== 'done')
      .slice(0, 5)
      .map((p) => {
        const id = p.projectId || p.id;
        const totalHours = timeEntries
          .filter(te => te.projectId === id)
          .reduce((acc, te) => acc + te.hours, 0);

        return {
          projectId: id,
          name: p.name || p.title,
          client: p.client || '',
          status: p.status || 'active',
          nextMilestone: p.nextMilestone || '—',
          riskFlag: p.riskFlag || '',
          progress: p.progress || 0,
          totalHours: Math.round(totalHours * 10) / 10
        };
      });

    return {
      todayOps,
      criticalAlerts,
      cash30d,
      funnel,
      health: {
        score: healthScore,
        breakdown: { deadlines: scoreDeadlines, cash: 100, production: 100, risk: scoreRisk }
      },
      syncStatus,
      projects: input.projects.slice(0, 5),
      hoursByOwner,
      activeProjects,
      dailyHighlights
    };
  }
}

export const dashboardDataService = new DashboardDataService();
