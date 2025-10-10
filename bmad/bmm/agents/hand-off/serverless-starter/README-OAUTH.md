# OAuth Dev Demo — serverless-starter

This short guide shows how to exercise the LinkedIn OAuth and publish endpoints in dev-mode. It assumes you're in the `serverless-starter` folder and have Node installed.

Quick checklist
- Node 18+ (project `engines` set to 18.x)
- `npm install` has been run in this folder
- `DEV_MODE=1` in your environment for consistent dev behavior (optional — endpoints also fall back when LinkedIn env vars are missing)

Run the dev server

```bash
cd bmad/bmm/agents/hand-off/serverless-starter
npm install
DEV_MODE=1 npm run dev
```

Open the demo UI
- Visit http://localhost:3000/demo/oauth-demo.html while `vercel dev` is running.

What the demo does
- Start OAuth: calls `/api/linkedin-oauth-start`. If `LINKEDIN_CLIENT_ID` is not set, the endpoint returns a dev redirect URL you can open directly.
- Callback: simulates the OAuth callback by calling `/api/linkedin-callback?code=dev-code&userId=dev-user`, which writes a dev token to `.tokens.json`.
- Publish: posts to `/api/publish-linkedin` using the saved token and will return a simulated `urn:li:share:dev-...` when the token is a dev token.

Switching to real LinkedIn credentials
1. Create a LinkedIn app and set the redirect URI to `https://your-host/api/linkedin-callback` (or `http://localhost:3000/api/linkedin-callback` for local testing if allowed).
2. Add the following env vars (use your provider's secret manager in prod):

```
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret
LINKEDIN_REDIRECT_URI=https://your-host/api/linkedin-callback
LINKEDIN_PERSON_ID=your-person-urn-sans-urn-prefix
```

3. Restart the dev server (remove `DEV_MODE=1` to test real flow). The endpoints will attempt the real OAuth token exchange and publishing.

Security note
- Do NOT store client secrets in client-side code or commit them to git. Use your cloud provider secrets manager.
