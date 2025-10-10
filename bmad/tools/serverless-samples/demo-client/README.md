Demo client (browser) for Journaling → AI → LinkedIn MVP

Overview

This simple static client demonstrates the essential flows without requiring a native app:
- Record audio via the browser (MediaRecorder) and upload to a signed URL returned by the serverless `/api/signed-upload` endpoint
- Start a transcription job using `/api/transcribe/start` (demo client does not poll for results; run `transcribe-worker` or use your webhook to obtain transcript)
- Paste or edit the transcript, then call `/api/generate-post` to generate LinkedIn-ready variants
- Copy a variant to clipboard and open LinkedIn to paste (fallback publish)

Usage
1. Deploy the serverless functions from `../` and populate environment variables.
2. Host this folder as static files (open `index.html` locally or deploy to Netlify/Vercel).
3. Point the "API Base URL" field to your deployed server URL (e.g., `https://your-server.com`).
4. Use the UI to record, upload, transcribe, and generate posts.

Notes
- This is a demo client for manual testing and does not implement full auth. Use in a secure environment.
- The demo expects endpoints `/api/signed-upload`, `/api/transcribe/start`, and `/api/generate-post` to exist on your server.
- For a polished mobile app, implement the same flows using React Native / Expo and secure auth.

Security
- Do not deploy the demo with production API keys embedded. Keep secrets server-side.

Next steps
- Wire in a status endpoint or webhook to receive completed transcripts and populate the transcript field automatically.
- Add LinkedIn OAuth server flows and a publish endpoint for full E2E automated publishing.
