Serverless samples for the Journaling → AI → LinkedIn MVP

Overview

This folder contains minimal, well-documented serverless function skeletons you can deploy to Vercel/Netlify/AWS Lambda to support the mobile app. They are intentionally small and include placeholders for secrets and minimal error handling so you can iterate quickly.

Included files
- package.json — example dependencies
- .env.example — environment variables to populate
- functions/
  - signed-upload.js — returns signed S3 upload URL (short TTL)
  - transcribe-start.js — starts a transcription job for an uploaded audio file
  - transcribe-worker.js — worker that calls Whisper/OpenAI speech-to-text and returns transcript (invoked internally or via webhook)
  - generate-post.js — proxies sanitized text to OpenAI and returns post variants
  - publish-linkedin.js — performs LinkedIn OAuth callback handling and publishes UGC posts

How to use
1. Copy this folder into your deployment target (Vercel, Netlify, etc.).
2. Populate environment variables from `.env.example`.
3. Install dependencies (see package.json).
4. Deploy functions. Test with the example request payloads provided in the project documentation.

Security notes
- Never expose your OpenAI/Whisper/LinkedIn client secrets to the client. Keep them in server env vars.
- Signed upload URLs should be short-lived (TTL &lt; 1 hour) and validate file size/content-type.
- Delete audio files immediately after transcription completes.

This is a starter scaffold; adapt to your provider and architecture as needed.