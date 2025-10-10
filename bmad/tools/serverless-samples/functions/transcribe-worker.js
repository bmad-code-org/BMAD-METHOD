// Minimal worker example that downloads audio from S3 and calls OpenAI Whisper (speech-to-text)
// This file is intended to be executed server-side (cron, queue worker, or invoked directly)

import fetch from 'node-fetch';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { OpenAI } from 'openai';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to stream S3 object to a Buffer (simplified)
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function transcribeJob({ objectKey }) {
  // Download audio from S3
  const bucket = process.env.S3_BUCKET;
  const getCmd = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
  const obj = await s3.send(getCmd);
  const buffer = await streamToBuffer(obj.Body);

  // Call OpenAI Whisper (speech-to-text) - using OpenAI 'audio.transcriptions' API
  try {
    const resp = await openai.audio.transcriptions.create({
      file: buffer,
      model: 'whisper-1',
    });

    const transcript = resp.text || resp.data?.text || '';

    // Delete audio file after successful transcription
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
    } catch (delErr) {
      console.warn('failed to delete audio', delErr);
    }

    // Persist transcript to DB / notify client (not implemented in skeleton)
    return { success: true, transcript };
  } catch (err) {
    console.error('transcription error', err);
    return { success: false, error: String(err) };
  }
}

// For local testing: allow invocation via CLI
if (process.env.LOCAL_TEST === '1') {
  const key = process.argv[2];
  transcribeJob({ objectKey: key }).then(r => console.log('result', r)).catch(console.error);
}
