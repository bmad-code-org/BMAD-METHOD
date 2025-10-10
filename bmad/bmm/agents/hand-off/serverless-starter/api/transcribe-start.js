export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { objectKey, entryId, anonymize, language } = req.body || {};
  if (!objectKey || !entryId) return res.status(400).json({ error: 'objectKey and entryId required' });

  // Enqueue a job to process the audio. Here we just return a jobId placeholder.
  const jobId = `trans-${Date.now()}`;

  // TODO: Implement worker to download objectKey from storage and call Whisper API.
  // For now, return started status and a jobId that client can poll.

  return res.json({ jobId, status: 'started' });
}
