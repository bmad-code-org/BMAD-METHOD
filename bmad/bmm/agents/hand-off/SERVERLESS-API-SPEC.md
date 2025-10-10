# Serverless API Specification

Security: All endpoints require HTTPS. Server stores OpenAI, Whisper, and LinkedIn credentials in env vars. Authenticate client requests with a signed JWT or session token.

Base URL: `https://api.example.com` (replace with your domain)

## Endpoints

### 1) GET /api/auth/linkedin/start
- Purpose: Begin OAuth flow — redirect user to LinkedIn authorization URL.
- Query: `redirect_after` optional.
- Response: 302 Redirect to LinkedIn authorize URL.
- Notes: generate & store `state` to validate callback.

### 2) GET /api/auth/linkedin/callback
- Purpose: Receive LinkedIn code, exchange for access token, fetch user urn.
- Query: `code`, `state`.
- Response: 200 { success: true, urn: "urn:li:person:..." }
- Server actions: exchange code for token, optionally fetch `me` for urn, store token encrypted.

### 3) POST /api/signed-upload
- Purpose: Return signed URL to upload audio object to object store.
- Auth: JWT required.
- Request body:
```
{ "filename": "entry-2025-10-06-01.m4a", "contentType": "audio/m4a", "length": 345678 }
```
- Response:
```
{ "uploadUrl": "https://store.example/obj...", "objectKey": "uploads/abc.m4a", "expiresAt": "..." }
```

### 4) POST /api/transcribe/start
- Purpose: Start transcription job for uploaded audio.
- Auth: JWT required.
- Request body:
```
{ "objectKey":"uploads/abc.m4a", "entryId":"local-123", "anonymize":true, "language":"en" }
```
- Response:
```
{ "jobId":"trans-20251006-001", "status":"started" }
```
- Server action: enqueue worker to download object & call Whisper.

### 5) POST /api/transcribe/callback (internal)
- Purpose: Worker posts transcription result.
- Auth: internal secret.
- Request body:
```
{ "jobId":"trans-20251006-001", "transcriptText":"...", "confidence":0.97 }
```
- Response: 200 OK
- Server action: store transcript, set job DONE, notify client.

### 6) POST /api/generate-post
- Purpose: Proxy to OpenAI to generate post variants.
- Auth: JWT required.
- Request body:
```
{ "entryId":"local-123", "sanitizedText":"...", "tone":"professional", "maxChars":300, "variants":2 }
```
- Response:
```
{ "requestId":"gen-abc", "variants":[ {"id":"v1","text":"...","hashtags":["#Product"]}, ... ], "tokenUsage":{...} }
```
- Failure modes: 429 rate-limit, 4xx invalid request, 5xx server error.

### 7) POST /api/publish-linkedin
- Purpose: Publish a variant to LinkedIn via UGC API.
- Auth: JWT required. Server must check stored LinkedIn token for user.
- Request body:
```
{ "entryId":"local-123", "variantId":"v1", "text":"...", "visibility":"PUBLIC" }
```
- Response:
```
{ "publishId":"urn:li:ugcPost:123456" }
```
- Server actions: call LinkedIn `ugcPosts` endpoint with author urn and content.

### 8) GET /api/usage
- Purpose: Return token & transcription usage to client/admin.
- Auth: admin or owner.
- Response: JSON with counters for month-to-date usage, quotas.

## Notes on failure modes
- Transcription delays: return jobId and implement polling or push notifications.  
- 429 from OpenAI or LinkedIn: surface friendly message and implement exponential backoff server-side.  
- Authentication errors: return 401 with remediation steps (re-auth).  

## Environment variables (server)
- OPENAI_API_KEY  
- WHISPER_API_KEY (if separate) or reuse OpenAI key  
- LINKEDIN_CLIENT_ID  
- LINKEDIN_CLIENT_SECRET  
- STORAGE_* (S3-compatible credentials)  
- JWT_SIGNING_KEY  
- INTERNAL_SECRET (for callbacks)

## Security & privacy
- Delete raw audio from object storage immediately after successful transcript (TTL <= 1 hour).  
- Store only minimal logs (jobId, entryId, userId, timestamp, consent flag).  
- Ensure TLS and server-side at-rest encryption for any stored transcripts if user opted in to cloud sync.


---

Copy this file into your engineering repo as `docs/SERVERLESS-API-SPEC.md`.