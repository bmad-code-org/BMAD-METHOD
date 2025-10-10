// Simple dev worker: reads .jobs.json, simulates transcription, and POSTs to transcribe-callback endpoint
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
(async function main(){
  const qfile = path.resolve(__dirname, '../.jobs.json');
  if (!fs.existsSync(qfile)) return console.log('No jobs file');
  const jobs = JSON.parse(fs.readFileSync(qfile, 'utf8')||'[]');
  if (!jobs.length) return console.log('No queued jobs');
  for (const job of jobs.filter(j=>j.status==='queued')){
    console.log('Processing', job.taskId);
    // Simulate a transcription result
    const payload = { taskId: job.taskId, entryId: job.entryId, transcriptText: 'Simulated transcript for dev.' };
    try{
      const resp = await fetch('http://localhost:3000/api/transcribe-callback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      console.log('Callback status', resp.status);
    }catch(e){
      console.error('Callback failed', e.message);
    }
  }
})();
