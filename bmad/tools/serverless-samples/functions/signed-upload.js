import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET;
const s3 = new S3Client({ region: REGION });

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { filename, contentType, length } = req.body;
    if (!filename || !contentType) return res.status(400).json({ error: 'filename and contentType required' });

    const key = `uploads/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 }); // 1 hour

    // Optional: register a pending job in your DB here (not implemented)

    return res.status(200).json({ uploadUrl, objectKey: key, expiresAt: Date.now() + (60 * 60 * 1000) });
  } catch (err) {
    console.error('signed-upload error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
