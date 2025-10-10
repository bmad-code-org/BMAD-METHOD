export default async function handler(req, res) {
  // Placeholder signed upload generator. Replace with S3 pre-signed URL logic.
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { filename, contentType } = req.body || {};
  if (!filename || !contentType) return res.status(400).json({ error: 'filename and contentType required' });

  // In production, generate S3 presigned URL here. For demo, return a dummy URL.
  const objectKey = `uploads/${Date.now()}-${filename}`;
  const uploadUrl = `https://example-storage.local/${objectKey}?signature=demo`;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  return res.json({ uploadUrl, objectKey, expiresAt });
}
