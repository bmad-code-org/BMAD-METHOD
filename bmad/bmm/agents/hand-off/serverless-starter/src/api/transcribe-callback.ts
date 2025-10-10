export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { taskId, entryId, transcriptText } = req.body || {};
  if (!taskId || !entryId) return res.status(400).json({ error: 'taskId and entryId required' });
  // TODO: validate signature, save transcript to DB, mark entry status
  return res.json({ status: 'ok' });
}
