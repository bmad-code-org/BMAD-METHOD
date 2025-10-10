Expo demo app for Journaling → AI → LinkedIn

Getting started
1. Install Expo CLI: `npm install -g expo-cli` or use npx.
2. In this folder run `npm install`.
3. Start the app: `npm start` and open in Expo Go on your device.

Notes
- The demo expects your serverless endpoints to be deployed and reachable. Set the API Base URL in the app to point to your server (e.g., `https://your-deploy.vercel.app`).
- Recording upload uses file read and PUT to signed URL — on some platforms you may need additional permissions.
- This is a minimal starter; for production use, add auth, error handling, and secure token storage.
