function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  const payload = body.payload;
  const level = body.level || 1;

  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"));
  const shProjects = ss.getSheetByName("Projects");
  
  // --- IDEMPOTENCIA ---
  const simId = payload.simulationId;
  const projectData = shProjects.getDataRange().getValues();
  const existing = projectData.find(row => row[10] === simId); // Coluna 11 (K)
  if (existing) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Project already exists",
        createdIds: { projectId: existing[0] }
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const now = new Date();
  const projectId = "PROJ_" + now.getTime();

  // --- 1) Projects ---
  shProjects.appendRow([
    projectId,
    payload.templateId,
    payload.scenarioId,
    payload.client?.name || "",
    payload.location || "",
    payload.fees?.net || 0,
    payload.fees?.vatRate || 0.23,
    payload.fees?.gross || 0,
    "active",
    now.toISOString(),
    payload.simulationId
  ]);

  // --- 2) Payments ---
  const shPayments = ss.getSheetByName("Payments");
  (payload.payments || []).forEach((p, idx) => {
    const payId = "PAY_" + now.getTime() + "_" + (idx + 1);
    shPayments.appendRow([
      payId,
      projectId,
      p.name,
      p.percentage,
      p.valueNet,
      payload.fees?.vatRate || 0.23,
      p.dueDays,
      "pending",
      payload.simulationId
    ]);
  });

  // --- 3) Tasks ---
  const shTasks = ss.getSheetByName("Tasks");
  (payload.tasks?.archIds || []).forEach((tId, idx) => {
    const taskId = "TASK_" + now.getTime() + "_" + (idx + 1);
    shTasks.appendRow([
      taskId,
      projectId,
      tId,      // depois resolves label via catalog no app
      "ARCH",
      "todo",
      now.toISOString(),
      payload.simulationId
    ]);
  });

  (payload.tasks?.specIds || []).forEach((sId, idx) => {
    const taskId = "TASKS_" + now.getTime() + "_" + (idx + 1);
    shTasks.appendRow([
      taskId,
      projectId,
      sId,
      "SPEC",
      "todo",
      now.toISOString(),
      payload.simulationId
    ]);
  });

  // --- 4) Documents (level >=2) ---
  let proposalDocId = "";
  let proposalUrl = "";

  if (level >= 2) {
    const shDocs = ss.getSheetByName("Documents");
    proposalDocId = "DOC_" + now.getTime();
    proposalUrl = ""; // (opcional) preencher no PASSO 20.5 com upload HTML/PDF para Drive
    shDocs.appendRow([
      proposalDocId,
      projectId,
      "proposal",
      "Proposta — " + (payload.client?.name || ""),
      proposalUrl,
      now.toISOString(),
      payload.simulationId
    ]);
  }

  // --- 5) AuditLog ---
  const shAudit = ss.getSheetByName("AuditLog");
  shAudit.appendRow([
    "LOG_" + now.getTime(),
    projectId,
    "ONECLICK_CREATE_L" + level,
    JSON.stringify(payload),
    now.toISOString()
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({
      status: "success",
      createdIds: { projectId: projectId, proposalDocId: proposalDocId || undefined },
      links: { projectUrl: "", proposalUrl: proposalUrl || "" }
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
