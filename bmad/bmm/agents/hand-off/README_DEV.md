Developer quickstart — Professional Journaling App (MVP)

This file explains how to run the mobile app and serverless starter locally for development.

Prereqs
- Node 18+, npm
- Expo CLI (for mobile)
- Vercel CLI (for serverless functions) or use `vercel dev`

Serverless-starter
1. cd bmad/bmm/agents/hand-off/serverless-starter
2. npm ci
3. Create a `.env` from `ENV.md` values (use test keys)
4. Start dev server: `npm run dev` (runs `vercel dev` by default)

Running tests
- `npm test` will run Jest tests under `src/__tests__`. Tests are lightweight and verify handlers reject invalid methods.

Mobile app
- Mobile scaffold is in `mobile/` (not included). Use Expo to run iOS/Android.

Notes
- The serverless stubs are written in TypeScript under `src/api`. They are stand-ins for production endpoints. Implement real logic (S3 presign, OpenAI proxy, LinkedIn publish) and add integration tests.
