API CONTRACT — Professional Journaling App

This document lists the serverless API endpoints required for the MVP, their request/response schemas, common error patterns, auth requirements, and idempotency considerations.

Authentication
- All endpoints require authentication except `/health` and the LinkedIn OAuth redirect endpoint.
- Use JWT bearer tokens for authenticated requests in the header: `Authorization: Bearer <token>`.
- For initial development the team may use a dev-only API key shared via `.env` (see `ENV.md`) but production must use per-user JWTs.

Error shape (JSON)
- All errors return 4xx/5xx status codes with the following JSON:

  {
    "code": "string",
    "message": "string",
    "details": { /* optional */ }
  }

Endpoints
---------
1) POST /api/signed-upload
- Purpose: return a presigned URL the client can PUT to for file uploads (audio files).
- Auth: required
- Request JSON:
  {
    "filename": "entry-<uuid>.webm",
    "contentType": "audio/webm",
    "entryId": "<uuid>",
    "ttlSeconds": 3600
  }
- Response 200:
  {
    "uploadUrl": "https://...",
    "fileUrl": "s3://bucket/path/entry-xxx.webm",
    "expiresAt": "ISO8601"
  }
- Errors: 400 bad request, 401 unauthorized, 500 server error
- Notes: server verifies entryId belongs to user (or allow guest-mode dev workflows)

2) POST /api/notify-upload
- Purpose: notify server that an upload was completed and transcription should be queued
- Auth: required
- Request JSON:
  {
    "entryId": "<uuid>",
    "fileUrl": "https://...",
    "durationSeconds": 45,
    "language": "en"
  }
- Response 200:
  { "taskId": "<uuid>", "status": "queued" }
- Idempotency: client should send an idempotency key header `Idempotency-Key` when re-sending to avoid accidental double-queues.

3) POST /api/transcribe-callback
- Purpose: receive transcription results (webhook from transcription worker or internal worker)
- Auth: validate callback secret header `X-Transcribe-Secret` or signed payload
- Request JSON:
  {
    "taskId": "<uuid>",
    "entryId": "<uuid>",
    "transcriptText": "...",
    "confidence": 0.93
  }
- Response: 200 OK
- Server action: save transcript to DB and set `transcriptStatus`=ready
- Idempotency: webhook sender may retry — server must treat duplicate taskId as idempotent update

4) POST /api/generate-post
- Purpose: create AI-generated draft posts from an entry/transcript
- Auth: required
- Request JSON:
  {
    "entryId": "<uuid>",
    "userTone": "insightful|concise|story",
    "variantCount": 2,
    "maxTokens": 300,
    "anonymize": true
  }
- Response 200:
  {
    "generationId": "<uuid>",
    "variants": [ { "id":"v1","text":"...","tokens":120 }, ... ],
    "usage": { "totalTokens": 240, "model": "gpt-4o-mini" }
  }
- Notes: server must honor user anonymization and redact as required before sending content to OpenAI. Track usage and cost per generation.

5) POST /api/linkedin/oauth-start
- Purpose: start OAuth flow. Returns a redirect URL the client should open.
- Auth: required
- Response: { "url": "https://www.linkedin.com/..." }

6) GET /api/linkedin/callback?code=...&state=...
- Purpose: LinkedIn redirects here; the server exchanges code for tokens and stores them encrypted.
- Server action: persist token metadata (expiry) and create publish credentials for the user.

7) POST /api/publish-linkedin
- Purpose: publish a previously-generated variant to LinkedIn
- Auth: required
- Request JSON:
  {
    "generationId": "<uuid>",
    "variantId": "v1",
    "visibility": "public|connections"
  }
- Response 200:
  { "postId": "linkedin-post-id", "publishedAt": "ISO8601" }
- Errors: 401 if token missing/expired; client should handle re-auth flow

8) GET /api/usage
- Purpose: admin endpoint for current usage and cost estimates
- Auth: admin-only
- Response: { "dailyCost": 12.45, "tokenUsage": { "today": 12345 } }

Admin & health
- GET /api/health — returns 200 plus a lightweight JSON with service status
- POST /api/purge — admin-only (with confirmation flags) to purge files older than retention window

Operational notes
- Timeouts and retries: all server-to-3rd-party calls must have bounded timeouts (5-10s) and exponential backoff.
- Rate-limits: apply per-user rate limits on generation and transcription requests.
- Logging: store structured logs (json) for job lifecycle events, but avoid storing full user text unless user consented to cloud storage.

Change process
- Any change to request/response shapes must be recorded here and a migration strategy provided (versioned endpoints or compatibility layer).

