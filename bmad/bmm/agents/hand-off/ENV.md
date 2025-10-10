ENVIRONMENT & DEPLOYMENT — Required env vars and notes for local dev and production

Serverless env vars (.env.example)
- NODE_ENV=development
- PORT=3000
- S3_BUCKET=your-bucket
- S3_REGION=your-region
- S3_ACCESS_KEY_ID=XXX
- S3_SECRET_ACCESS_KEY=XXX
- OPENAI_API_KEY=sk-...
- WHISPER_API_KEY=sk-... or reuse OPENAI_API_KEY
- LINKEDIN_CLIENT_ID=...
- LINKEDIN_CLIENT_SECRET=...
- LINKEDIN_REDIRECT_URI=https://your-host/api/linkedin/callback
- JWT_SECRET=some-long-secret
- APP_ENCRYPTION_KEY=base64:...
- TRANSCRIBE_SECRET=webhook-secret-for-transcribe
- KMS_KEY_ID=arn:aws:kms:...
- BILLING_ALERT_EMAIL=finance@example.com
- SENTRY_DSN=...

Local dev notes
- Use `dotenv` to load `.env` during local serverless function testing.
- For mobile dev, set `EXPO_DEV_SERVER` and `REACT_NATIVE_PACKAGER_HOSTNAME` accordingly.
- Provide fake/test keys in `.env.local` (never commit).

Production notes
- Use provider secrets manager (Vercel env, Netlify env, or AWS Secrets Manager).
- Rotate keys and set alerting for unusual usage.

Secrets handling
- Never store `OPENAI_API_KEY` or `LINKEDIN_CLIENT_SECRET` in the client code.
- Use serverless to perform all 3rd party API calls.

