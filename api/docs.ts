// This is a Vercel Serverless Function skeleton for Document Storage

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { projectId, filename, mimeType, contentBase64 } = req.body || {};
  if (!projectId || !filename || !mimeType || !contentBase64) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Forward to Google Apps Script (Drive uploader)
    // Environment variable must be set in Vercel/Local env
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_DOCS_URL;

    if (!scriptUrl) {
      // Mocking successful response for local development if URL not set
      console.log("Mocking Drive upload for project:", projectId);
      return res.status(200).json({ 
        url: `https://mock-drive.fa360.design/${projectId}/${filename}`,
        success: true 
      });
    }

    const r = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, filename, mimeType, contentBase64 }),
    });

    const json = await r.json();
    return res.status(200).json(json); // { url: "https://drive..." }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
