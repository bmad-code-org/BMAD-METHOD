# Serverless Starter (Vercel functions)

This starter includes example serverless endpoints to support the mobile client: signed upload, transcription workflow, OpenAI proxy, and LinkedIn publish.

Prereqs
- Vercel CLI (`npm i -g vercel`) or deploy to any serverless host that supports Node 18.
- Set environment variables in your deployment (see below).

Environment variables
- OPENAI_API_KEY
- WHISPER_API_KEY (optional, can reuse OPENAI_API_KEY)
- LINKEDIN_CLIENT_ID
- LINKEDIN_CLIENT_SECRET
- STORAGE_ENDPOINT (S3 compatible)
- STORAGE_KEY
- STORAGE_SECRET
- STORAGE_BUCKET
- JWT_SIGNING_KEY
- INTERNAL_SECRET

Run locally
- Install deps: `npm install`
- Start dev server: `npm run dev` (requires Vercel CLI)

This folder contains API functions in `/api`:
- /api/signed-upload.js  - returns signed upload URL (placeholder implementation)
- /api/transcribe-start.js - enqueue transcription job
- /api/transcribe-callback.js - internal callback to post transcription results
- /api/generate-post.js - proxy to OpenAI for generation (replace with real logic)
- /api/publish-linkedin.js - publish UGC to LinkedIn using stored user tokens

Notes
- These files are starter templates. Replace placeholder logic with secure storage and error handling in production.
