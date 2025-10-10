const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET;
const s3 = new S3Client({ region: REGION });

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    const { filename, contentType } = body;
    if (!filename || !contentType) return { statusCode: 400, body: JSON.stringify({ error: 'filename and contentType required' }) };

    const key = `uploads/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 }); // 1 hour

    return { statusCode: 200, body: JSON.stringify({ uploadUrl, objectKey: key, expiresAt: Date.now() + (60 * 60 * 1000) }) };
  } catch (err) {
    console.error('signed-upload error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
