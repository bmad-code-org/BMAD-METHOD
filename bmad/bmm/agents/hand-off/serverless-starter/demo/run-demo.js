#!/usr/bin/env node
// Simple demo runner for the serverless-starter dev endpoints.
// Run this while `vercel dev` (or `npm run dev`) is running.

const fs = require('fs');
const path = require('path');
const base = process.env.BASE_URL || 'http://localhost:3000';

async function doFetch(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch(e) { json = text; }
  return { status: res.status, body: json };
}

async function run() {
  console.log('Demo runner starting against', base);
  const out = { steps: [] };

  // 1) signed-upload
  console.log('1) Requesting signed-upload');
  const su = await doFetch(`${base}/api/signed-upload`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: 'demo-audio.webm', contentType: 'audio/webm', entryId: 'demo-entry' }) });
  console.log('signed-upload ->', su.body);
  out.steps.push({ signedUpload: su.body });

  const fileUrl = su.body.fileUrl || (su.body.uploadUrl || '').split('?')[0] || `${base}/uploads/demo-audio.webm`;

  // 2) notify-upload
  console.log('2) Notifying server of upload');
  const nu = await doFetch(`${base}/api/notify-upload`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entryId: 'demo-entry', fileUrl }) });
  console.log('notify-upload ->', nu.body);
  out.steps.push({ notifyUpload: nu.body });

  const taskId = nu.body.taskId || `t-demo-${Date.now()}`;

  // 3) transcribe-callback
  console.log('3) Posting transcribe-callback (simulated)');
  const tc = await doFetch(`${base}/api/transcribe-callback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId, entryId: 'demo-entry', transcriptText: 'Demo transcript: I shipped a small feature today.' }) });
  console.log('transcribe-callback ->', tc.body);
  out.steps.push({ transcribeCallback: tc.body });

  // 4) generate-post
  console.log('4) Generating drafts');
  const gp = await doFetch(`${base}/api/generate-post`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sanitizedText: 'I shipped a feature today', tone: 'insightful', variants: 2 }) });
  console.log('generate-post ->', gp.body);
  out.steps.push({ generatePost: gp.body });

  // 5) oauth-start
  console.log('5) OAuth start (dev)');
  const os = await doFetch(`${base}/api/linkedin-oauth-start`, { method: 'GET' });
  console.log('oauth-start ->', os.body);
  out.steps.push({ oauthStart: os.body });

  // 6) callback (dev)
  console.log('6) OAuth callback (dev)');
  const cb = await doFetch(`${base}/api/linkedin-callback?code=dev-code&userId=demo-user`, { method: 'GET' });
  console.log('callback ->', cb.body);
  out.steps.push({ callback: cb.body });

  // 7) publish
  console.log('7) Publish (dev)');
  const pub = await doFetch(`${base}/api/publish-linkedin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'demo-user', text: 'Hello LinkedIn from demo runner' }) });
  console.log('publish ->', pub.body);
  out.steps.push({ publish: pub.body });

  const outFile = path.resolve(process.cwd(), 'demo-output.json');
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
  console.log('Demo finished, output written to', outFile);
}

run().catch(err => { console.error('Demo runner error', err); process.exit(2); });
