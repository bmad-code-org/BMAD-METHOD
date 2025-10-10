export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { entryId, fileUrl } = req.body || {};
  if (!entryId || !fileUrl) return res.status(400).json({ error: 'entryId and fileUrl required' });

  const sqsUrl = process.env.SQS_QUEUE_URL;
  if (sqsUrl) {
    // Send to SQS
    try {
      const { SQSClient, SendMessageCommand } = await import('@aws-sdk/client-sqs');
      const client = new SQSClient({});
      const task = { taskId: `t-${Date.now()}`, entryId, fileUrl, createdAt: new Date().toISOString(), status: 'queued' };
      const cmd = new SendMessageCommand({ QueueUrl: sqsUrl, MessageBody: JSON.stringify(task) });
      await client.send(cmd);
      return res.json({ taskId: task.taskId, status: 'queued', via: 'sqs' });
    } catch (err: any) {
      console.error('notify-upload sqs error', err);
      return res.status(500).json({ error: 'Could not enqueue job to SQS' });
    }
  }

  // Fallback to file queue for dev
  try {
    const fs = await import('fs');
    const path = require('path');
    const qfile = path.resolve(__dirname, '../../.jobs.json');
    let jobs: any[] = [];
    if (fs.existsSync(qfile)) {
      jobs = JSON.parse(fs.readFileSync(qfile, 'utf8') || '[]');
    }
    const task = { taskId: `t-${Date.now()}`, entryId, fileUrl, createdAt: new Date().toISOString(), status: 'queued' };
    jobs.push(task);
    fs.writeFileSync(qfile, JSON.stringify(jobs, null, 2), 'utf8');
    return res.json({ taskId: task.taskId, status: 'queued', via: 'file' });
  } catch (err: any) {
    console.error('notify-upload error', err);
    return res.status(500).json({ error: 'Could not queue transcription job' });
  }
}
