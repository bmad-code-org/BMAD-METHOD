# Demo Instructions — Capture → Transcribe → Convert → Publish (with fallback)

Purpose: step-by-step script for a live demo to PM or stakeholders. Use a test LinkedIn account for direct publish testing.

Pre-demo checklist

- Ensure serverless endpoints are deployed and env vars set (OPENAI_API_KEY, WHISPER_API_KEY, LINKEDIN_CLIENT_ID/SECRET, STORAGE creds).  
- If LinkedIn direct publish will be shown, have a test LinkedIn account and ensure the server app is registered with correct redirect URI.  
- Mobile device with Expo Go or installed dev build.  
- Clipboard app/permissions allowed on device.

Demo script (10–15 minutes)

1. Quick intro (30s) — One sentence: app helps professionals capture daily notes (text + voice) and converts them into LinkedIn-ready posts with privacy-first defaults.

2. Capture flow (1–2 min)
  - Open app Home. Create a quick text entry (or press record for voice).
  - If recording: press record → speak for 20s → stop → press Transcribe.
  - Show local-first behavior: entry saved locally; no external processing until user confirms.

3. Transcription (1 min)
  - Transcribe job submits to server via signed-upload and Whisper. Show job status spinner.
  - When transcript returns, show editable transcript screen and anonymize toggle. Demonstrate redaction.

4. Convert to post (2 min)
  - Tap "Convert to LinkedIn post" → server proxies to OpenAI with system prompt. Show generated variants (Variant 1 & 2), suggested hashtags, and CTA.
  - Edit a variant inline (minor tweak) in draft editor.

5. Publish (2 min)
  - If LinkedIn connected: press Publish → server posts via LinkedIn UGC API → confirm published and show post URL or success toast.  
  - If LinkedIn not connected: use fallback: Copy to clipboard → Open LinkedIn app (or show share sheet) → paste & post manually.

6. Analytics & logs (1 min)
  - Open analytics dashboard: show counts for entries, conversions, and publish events.  
  - Show processing logs in settings (transcribe/generate/publish events with timestamps & consent).

Demo wrap-up (30s)

- Remind PM of decisions needed: retention default, LinkedIn publish default opt-in vs auto, and monetization approach.  
- Offer to share sprint tickets and server API spec for execution.

Troubleshooting tips

- If Whisper/transcribe fails: show job status and retry option; confirm signed upload worked and audio accessible in storage.  
- If OpenAI generation fails: show friendly error and option to retry with lower variant count.  
- If LinkedIn publish fails: show fallback "Copy & Open LinkedIn" flow.

Sample entries to use during demo

- "Today I resolved a recurring onboarding issue that caused users to drop off on day 1. Turned out the default timezone handling was silently corrupting event timestamps. I shipped a quick fix and added a telemetry check — early data shows a 12% improvement in day-1 retention. Learned: small telemetry + quick rollback plans beat speculative rewrites."
- "I experimented with 5-minute daily standups. The team trimmed ~3 hours of weekly meetings and improved follow-through."  
- "I published a vulnerable first post and received great DMs that changed my perspective. Authenticity wins." 

Post-demo artifacts to hand the PM

- `SPRINT-TICKETS.md` (import to tracker)  
- `SERVERLESS-API-SPEC.md` (developer reference)  
- `PROMPT-TEMPLATES.md` (prompt & model guidance)  

---

Use this file as the demo script during the PM meeting.