export default async function handler(req, res) {
  // This endpoint should be protected by INTERNAL_SECRET to prevent abuse.
  const INTERNAL_SECRET = process.env.INTERNAL_SECRET;
  const incomingSecret = req.headers['x-internal-secret'];
  if (!INTERNAL_SECRET || incomingSecret !== INTERNAL_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { jobId, transcriptText, confidence } = req.body || {};
  if (!jobId || typeof transcriptText !== 'string') return res.status(400).json({ error: 'jobId and transcriptText required' });

  // TODO: Persist transcript to your DB and notify client via push/webhook.
  console.log('Transcription callback', { jobId, confidence });

  return res.json({ ok: true });
}
