import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const REGION = process.env.S3_REGION || 'us-east-1';
const BUCKET = process.env.S3_BUCKET || 'dev-bucket';
let s3 = null;
try {
    s3 = new S3Client({ region: REGION });
}
catch (e) { /* ignore */ }
export async function presignPut(key, contentType, expires = 3600) {
    const dev = !!process.env.DEV_MODE || !process.env.AWS_ACCESS_KEY_ID;
    if (dev) {
        return { uploadUrl: `https://dev-upload.local/${key}`, fileUrl: `s3://${BUCKET}/${key}`, expiresAt: new Date(Date.now() + expires * 1000).toISOString() };
    }
    const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
    const url = await getSignedUrl(s3, cmd, { expiresIn: expires });
    return { uploadUrl: url, fileUrl: `s3://${BUCKET}/${key}`, expiresAt: new Date(Date.now() + expires * 1000).toISOString() };
}
