import { presignPut } from '../lib/s3';
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { filename, contentType, entryId, ttlSeconds } = req.body || {};
    if (!filename || !contentType)
        return res.status(400).json({ error: 'filename and contentType required' });
    try {
        const key = `uploads/${entryId || 'guest'}/${filename}`;
        const presigned = await presignPut(key, contentType, ttlSeconds || 3600);
        return res.json(presigned);
    }
    catch (err) {
        console.error('signed-upload error', err);
        return res.status(500).json({ error: 'Could not create presigned url' });
    }
}
