Deploying to Netlify — quick guide

What this adds
- A GitHub Action (`.github/workflows/deploy-netlify.yml`) that deploys the demo client (static site) and Netlify Functions to your Netlify site on push to `main` or `v6-alpha`.

What you must do (one-time)
1. Create a Netlify site
   - Sign in to Netlify and create a new site from Git. Choose this repository and the branch you want to deploy (recommended: `v6-alpha` for this work).
   - Netlify will ask for build settings. We use the repo files directly; the GitHub Action will run the deploy so set the build command to blank and the publish directory to `bmad/tools/serverless-samples/demo-client` (Netlify will respect the uploaded deploy from the Action).

2. Get your Netlify Site ID and Personal Access Token
   - Site ID: On your site dashboard, go to Site settings → Site information → Copy 'Site ID'.
   - Personal Access Token: Go to User settings → Applications → Personal access tokens → New access token. Save the token safely.

3. Add GitHub secrets to this repo
   - In the GitHub repository, go to Settings → Secrets and variables → Actions → New repository secret.
   - Add these secrets:
     - `NETLIFY_AUTH_TOKEN` = <your personal access token>
     - `NETLIFY_SITE_ID` = <the site id you copied>

4. Add runtime environment variables in Netlify (optional but recommended)
   - In Netlify site settings → Build & deploy → Environment → Edit variables, add the following server-side keys (these will be available to Netlify Functions):
     - `OPENAI_API_KEY` = your OpenAI key
     - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `S3_BUCKET` (for audio uploads)
     - `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` / `LINKEDIN_REDIRECT_URI`
     - `ADMIN_API_KEY` or `JWT_SECRET` (optional)

5. Trigger the deploy
   - Push a commit to `v6-alpha` or `main`. The GitHub Action will run and deploy the demo client and functions to your Netlify site using the `netlify` CLI.

Testing the deployed site
- After the workflow completes, visit your Netlify site URL. The demo client will be served from the `bmad/tools/serverless-samples/demo-client` folder. The functions will be available under `/.netlify/functions/<function-name>` or via the Netlify Functions endpoint your site provides.

Local testing (fast feedback loop)
- You can run functions locally with Netlify CLI or test using the `LOCAL_TEST=1` option for the `transcribe-worker` file.

Security notes
- Do not commit real secrets to the repo. Use GitHub Secrets and Netlify Environment variables.
- Audio files are ephemeral; review the functions to ensure audio deletion TTL is enforced.

If you want, I can:
- Create a Netlify site for you (requires Netlify access) or walk you through each UI step while you do the clicks.
- Run a checklist and validate the first successful deploy when you add the secrets.

Tell me whether you want me to also create a small GitHub Issue board with the sprint tickets (I can auto-create Markdown issues) or proceed to validate the deploy once you add the secrets.