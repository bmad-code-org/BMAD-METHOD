// Starts a transcription job for an uploaded audio object
// This function enqueues or triggers a worker (transcribe-worker) with job metadata

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { objectKey, entryId, anonymize = false, language = 'en' } = req.body;
    if (!objectKey || !entryId) return res.status(400).json({ error: 'objectKey and entryId required' });

    // In production: create job entry in DB, enqueue job (e.g., using queue or invoke worker)
    // For this skeleton we'll simulate by returning a jobId and relying on an async worker to be triggered.

    const jobId = `trans-${Date.now()}`;

    // TODO: enqueue job in your queue system (e.g., SQS, RabbitMQ, or call worker directly)

    // Return job info to client
    return res.status(200).json({ jobId, status: 'started' });
  } catch (err) {
    console.error('transcribe-start error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
