DB SCHEMA — Local (SQLite) and Cloud (Postgres) for Professional Journaling App

This document describes the core database tables (local SQLite and cloud Postgres) and recommended indexes.

Local (SQLite) core tables

1) entries
- id TEXT PRIMARY KEY
- createdAt TEXT (ISO8601)
- updatedAt TEXT
- title TEXT
- text TEXT
- mood TEXT
- tags TEXT /* JSON array string */
- transcriptText TEXT
- transcriptStatus TEXT /* none|queued|ready|failed */
- anonymized INTEGER /* 0|1 */
- synced INTEGER /* 0|1 */
- deletedAt TEXT /* nullable for soft delete */

Indexes: createdAt, tags (json not indexed; consider FTS for text search)

2) attachments
- id TEXT PRIMARY KEY
- entryId TEXT REFERENCES entries(id)
- type TEXT /* audio|image */
- localUri TEXT
- remoteUrl TEXT
- uploadedAt TEXT

Indexes: entryId

3) generations
- id TEXT PRIMARY KEY
- entryId TEXT REFERENCES entries(id)
- model TEXT
- prompt TEXT
- resultJson TEXT /* store variant array */
- createdAt TEXT
- costTokens INTEGER

Indexes: entryId, createdAt

4) publish_history
- id TEXT PRIMARY KEY
- generationId TEXT REFERENCES generations(id)
- provider TEXT
- providerPostId TEXT
- status TEXT
- createdAt TEXT

5) consent_logs
- id TEXT PRIMARY KEY
- userAction TEXT
- scope TEXT
- timestamp TEXT
- meta TEXT

6) users (optional local mapping)
- id TEXT PRIMARY KEY
- deviceId TEXT
- alias TEXT

Cloud (Postgres) — optional sync schema
- Mirror entries table but encrypt text/transcriptText columns with server-side KMS
- users table with email (optional) and encryption keys
- tokens table (LinkedIn tokens encrypted), fields: id, userId, provider, tokenEncrypted, expiresAt
- usage_billing table for daily aggregates

FTS / Search
- Use SQLite FTS5 virtual table for entries.text to support fast local search.

Sync & conflict model
- Use last-write-wins for most fields, but for content fields prefer "merge by timestamp" with conflict resolution UI for title/text if divergence detected.
- Store a `syncVersion` integer on entries that increments on local edit; server resolves by comparing timestamps and syncVersion.

Retention & soft-delete
- Retain soft-deleted entries for `retentionDays` (default 90) and provide admin purge that removes attachments from cloud storage.

Backups
- Provide an export job that bundles entries and attachments into an encrypted zip for user download.

