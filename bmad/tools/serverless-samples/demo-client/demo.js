// Demo client JS: uses MediaRecorder to capture audio, requests signed upload, uploads audio, and calls transcribe-start and generate-post endpoints.

let mediaRecorder;
let audioChunks = [];
let recordedBlob;
let uploadedObjectKey;
let lastVariants = null;

const apiBaseInput = document.getElementById('apiBase');
const startRecBtn = document.getElementById('startRec');
const stopRecBtn = document.getElementById('stopRec');
const uploadAudioBtn = document.getElementById('uploadAudio');
const recStatus = document.getElementById('recStatus');
const transcriptEl = document.getElementById('transcript');
const generateBtn = document.getElementById('generate');
const variantsDiv = document.getElementById('variants');
const rawPre = document.getElementById('raw');
const toneSel = document.getElementById('tone');
const maxcharsSel = document.getElementById('maxchars');
const copyBtn = document.getElementById('copyText');
const openLinkedInBtn = document.getElementById('openLinkedIn');

function apiBase(){
  return (apiBaseInput.value || '').replace(/\/$/, '');
}

startRecBtn.onclick = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Media recording is not supported in this browser.');
    return;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];
  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
    recStatus.textContent = `Recorded ${Math.round(recordedBlob.size/1024)} KB`;
    uploadAudioBtn.disabled = false;
  };
  mediaRecorder.start();
  recStatus.textContent = 'Recording...';
  startRecBtn.disabled = true;
  stopRecBtn.disabled = false;
};

stopRecBtn.onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  startRecBtn.disabled = false;
  stopRecBtn.disabled = true;
};

uploadAudioBtn.onclick = async () => {
  if (!recordedBlob) return alert('No recording found.');
  const base = apiBase();
  if (!base) return alert('Set API Base URL first');

  // Step 1: request signed upload
  rawPre.textContent = 'Requesting signed upload...';
  const filename = `recording-${Date.now()}.webm`;
  const resp = await fetch(base + '/api/signed-upload', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ filename, contentType: recordedBlob.type, length: recordedBlob.size }) });
  const j = await resp.json();
  rawPre.textContent = 'Signed upload response:\n' + JSON.stringify(j, null, 2);
  if (!j.uploadUrl) return alert('signed upload failed');

  // Step 2: upload to signed URL
  rawPre.textContent = 'Uploading audio...';
  const put = await fetch(j.uploadUrl, { method: 'PUT', headers: {'Content-Type': recordedBlob.type}, body: recordedBlob });
  if (!put.ok) return alert('upload failed');
  rawPre.textContent = 'Uploaded. Starting transcription job...';

  // Step 3: start transcription job
  const tResp = await fetch(base + '/api/transcribe/start', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ objectKey: j.objectKey, entryId: `demo-${Date.now()}`, anonymize: false, language: 'en' }) });
  const tJson = await tResp.json();
  rawPre.textContent = 'Transcription job started:\n' + JSON.stringify(tJson, null, 2) + '\n\nNote: run your transcribe-worker or wait for webhook to populate transcript. Alternatively paste transcript into the text area.';
};

generateBtn.onclick = async () => {
  const base = apiBase();
  if (!base) return alert('Set API Base URL first');
  const text = transcriptEl.value.trim();
  if (!text) return alert('Paste or provide a transcript in the text area');
  rawPre.textContent = 'Requesting generation...';
  const payload = { sanitizedText: text, tone: toneSel.value, maxChars: Number(maxcharsSel.value), variants: 2 };
  const resp = await fetch(base + '/api/generate-post', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  const j = await resp.json();
  rawPre.textContent = 'Generation response:\n' + JSON.stringify(j, null, 2);
  // Display variants if available (raw parsing)
  variantsDiv.innerHTML = '';
  if (j.raw) {
    const pre = document.createElement('pre'); pre.textContent = j.raw; variantsDiv.appendChild(pre);
  } else if (j.variants) {
    j.variants.forEach((v, idx) => {
      const div = document.createElement('div');
      div.style.border = '1px solid #ddd'; div.style.padding='8px'; div.style.marginTop='8px';
      const rbtn = document.createElement('input'); rbtn.type='radio'; rbtn.name='variant'; rbtn.value=idx; if(idx===0) rbtn.checked=true; rbtn.onclick = ()=> copyBtn.disabled=false;
      div.appendChild(rbtn);
      const h = document.createElement('div'); h.innerHTML = `<strong>Variant ${idx+1}</strong><div>${v.text.replace(/\n/g,'<br/>')}</div><div style="color:#666">Hashtags: ${ (v.hashtags||[]).join(' ') }</div><div style="color:#666">CTA: ${v.cta||''}</div>`;
      div.appendChild(h);
      variantsDiv.appendChild(div);
    });
    copyBtn.disabled = false;
    lastVariants = j.variants;
  } else {
    // fallback: show raw text
    copyBtn.disabled = false;
  }
};

copyBtn.onclick = async () => {
  // copy selected variant text or raw textarea
  if (lastVariants && lastVariants.length>0) {
    const radios = document.getElementsByName('variant');
    let idx = 0; for (const r of radios) if (r.checked) idx = Number(r.value);
    const text = lastVariants[idx].text + '\n\n' + (lastVariants[idx].hashtags||[]).join(' ');
    await navigator.clipboard.writeText(text);
    alert('Copied variant to clipboard. Now open LinkedIn and paste.');
  } else {
    const t = transcriptEl.value.trim(); if (!t) return alert('No content to copy'); await navigator.clipboard.writeText(t); alert('Copied to clipboard');
  }
};

openLinkedInBtn.onclick = () => {
  // open LinkedIn feed page for user to paste
  window.open('https://www.linkedin.com/feed/', '_blank');
};

// Convenience: prefill API Base with localhost if deployed locally
if (!apiBaseInput.value) apiBaseInput.value = 'http://localhost:3000';
