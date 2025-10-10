const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { OpenAI } = require('openai');

const s3 = new S3Client({ region: process.env.AWS_REGION });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

exports.handler = async function(event, context) {
  try {
    // This worker expects a JSON body { objectKey: 'uploads/..' } when invoked
    const body = JSON.parse(event.body || '{}');
    const { objectKey } = body;
    if (!objectKey) return { statusCode: 400, body: JSON.stringify({ error: 'objectKey required' }) };

    const bucket = process.env.S3_BUCKET;
    const getCmd = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
    const obj = await s3.send(getCmd);
    const buffer = await streamToBuffer(obj.Body);

    // Call OpenAI Whisper (simplified)
    const resp = await openai.audio.transcriptions.create({ file: buffer, model: 'whisper-1' });
    const transcript = resp.text || resp.data?.text || '';

    // Delete audio
    try { await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey })); } catch (e) { console.warn('delete failed', e); }

    // In production: persist transcript and notify client; here we return it.
    return { statusCode: 200, body: JSON.stringify({ success: true, transcript }) };
  } catch (err) {
    console.error('transcription worker error', err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
