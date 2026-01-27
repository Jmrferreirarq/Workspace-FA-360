import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { payload, level } = req.body || {};
  if (!payload?.simulationId || !payload?.templateId) {
    return res.status(400).json({ error: 'Missing payload fields' });
  }

  // URL do Apps Script (WebApp) que grava no Sheets
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_AUTOMATION_URL;
  if (!scriptUrl) return res.status(500).json({ error: 'Missing GOOGLE_APPS_SCRIPT_AUTOMATION_URL' });

  try {
    const r = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, level }),
    });

    const json = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(500).json({ error: 'Apps Script error', details: json });
    }

    return res.status(200).json(json);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
