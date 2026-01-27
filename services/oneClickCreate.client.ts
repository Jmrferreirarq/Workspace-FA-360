export type OneClickLevel = 1 | 2 | 3;

export async function oneClickCreate(payload: any, level: OneClickLevel) {
  const res = await fetch('/api/oneclick/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, level }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'OneClick failed');
  }

  return res.json() as Promise<{
    status: 'success'|'failed';
    createdIds: { projectId: string; proposalDocId?: string };
    links?: { projectUrl?: string; proposalUrl?: string };
  }>;
}
