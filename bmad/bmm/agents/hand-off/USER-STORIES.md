# User Stories (Expanded) — Top tickets expanded into stories with Acceptance Criteria and Tasks

Convert each ticket into user stories using the persona. These are ready to copy into your tracker.

## Story 1 (T1.2) — Local DB & journaling core
Title: As a Senior PM, I want to create/edit/delete journal entries offline so I can capture thoughts quickly.
Priority: P0 | Estimate: 20h
Acceptance Criteria:
- I can create a new entry (title optional) and save it offline.
- The entry appears in my list immediately with timestamp.
- I can edit and delete an entry; deleted items move to soft-delete state.
- Search returns entries by text and tag.
Tasks:
- Choose local DB (SQLite/WatermelonDB) and implement models
- Implement CRUD operations and local persistence
- Add full-text search index
- Write unit tests for CRUD and search

## Story 2 (T1.3) — UI: Home/New Entry/Entry Detail/Tags
Title: As a user, I want a quick-capture UI and easy navigation so I can record entries quickly.
Priority: P0 | Estimate: 18h
Acceptance Criteria:
- Home shows recent entries with quick + FAB to create new entry.
- New Entry screen supports multi-line text, tag picker, and save.
- Entry detail shows transcript/audio (if any), edit, convert button.
Tasks:
- Implement navigation stack and screens
- Build tag picker component
- Connect UI to local DB

## Story 3 (T1.5) — Audio capture UI & file storage
Title: As a user, I want to record voice clips and play them back so I can capture thoughts hands-free.
Priority: P0 | Estimate: 12h
Acceptance Criteria:
- I can record/pause/stop audio clips up to 2 minutes.
- Recorded files are stored locally and playable.
- A "Transcribe" button is available on the entry detail screen.
Tasks:
- Build audio recorder using React Native Audio APIs / Expo Audio
- Store files in app storage and link to entry
- Add playback UI and controls

## Story 4 (T1.6 + T1.7) — Signed upload & client-server integration
Title: As the system, I must upload audio securely to server for transcription so that the transcription service can process it.
Priority: P0 | Estimate: 16h
Acceptance Criteria:
- Client requests signed upload URL for audio and successfully uploads to storage.
- Server creates a transcription job and returns jobId.
- Client can poll job status or receive push when transcript is ready.
Tasks:
- Implement /api/signed-upload
- Implement client upload flow (PUT to signed URL)
- Implement /api/transcribe/start to queue job
- Implement job status polling or push notification

## Story 5 (T2.1) — Whisper transcription worker
Title: As the system, I need to transcribe uploaded audio using Whisper and delete audio after transcription.
Priority: P0 | Estimate: 12h
Acceptance Criteria:
- Worker downloads audio, calls Whisper API, returns transcript and confidence.
- Raw audio is deleted from storage after successful transcription (TTL enforced).
- Transcript stored and linked to entry; client notified of completion.
Tasks:
- Implement worker to call OpenAI Whisper (or choice of provider)
- Implement audio deletion post-success
- Store transcript and publish result to client

## Story 6 (T2.3 + T2.4) — OpenAI generation proxy & client convert UI
Title: As a user, I want the app to produce LinkedIn-ready post variants from my entry so I can share insights quickly.
Priority: P0 | Estimate: 22h
Acceptance Criteria:
- Server returns 1–3 variants with hashtags and CTA based on tone preset.
- Client displays variants; user can select and edit before publishing.
- Token usage is logged for cost monitoring.
Tasks:
- Implement /api/generate-post proxy with prompt templates
- Build client convert UI to show variants and allow edit
- Add token usage logging

## Story 7 (T2.5) — LinkedIn OAuth & publish
Title: As a user, I want to connect my LinkedIn account and publish posts directly so I can share without manual copy/paste.
Priority: P0 | Estimate: 16h
Acceptance Criteria:
- User can connect LinkedIn using OAuth and grant w_member_social scope.
- Server stores access token securely; server posts UGC and returns success.
- Fallback share flow available if OAuth not set up.
Tasks:
- Implement OAuth Authorization Code flow server-side
- Implement /api/publish-linkedin endpoint
- Implement client flow for connect and publish

## Story 8 (T3.1 + T3.2) — Retention, soft-delete & consent logs
Title: As a user, I want retention controls and clear consent logs so I can manage my data and privacy.
Priority: P0 | Estimate: 16h
Acceptance Criteria:
- User can select retention window (30/90/365/indefinite).
- Soft-delete moves items to a trash that is purged after TTL.
- Consent logs record processing actions with timestamps and are viewable/exportable.
Tasks:
- Implement retention settings UI
- Implement soft-delete and purge engine (local & server if synced)
- Implement consent log storage and UI

## Story 9 (T3.3) — Cost controls & quotas
Title: As the operator, I want quotas and usage alerts to control API spend.
Priority: P1 | Estimate: 8h
Acceptance Criteria:
- Admin can set daily and monthly quotas for generation and transcription.
- System enforces quotas and informs users when limits are hit.
Tasks:
- Add usage tracking in server logs
- Implement enforcement and UI alerts

## Story 10 (T3.4) — Build & store prep
Title: As an operator, I want TestFlight/Play Store builds and store assets prepared so we can release the MVP.
Priority: P1 | Estimate: 12h
Acceptance Criteria:
- Test builds available for iOS and Android
- Privacy policy ready and linked
- Store screenshots and descriptions prepared
Tasks:
- Package builds, create metadata, upload to TestFlight/Play Console

---

If you want, I will now:
- Create epic parent issues in GitHub and link these stories (requires GH access), and/or
- Convert each user story into GitHub issues with the acceptance criteria included (I can run the import once you confirm method).

Say which next action you want: "create epics in GH", "create stories in GH", or "export stories JSON".