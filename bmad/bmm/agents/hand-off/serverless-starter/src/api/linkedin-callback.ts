import { saveToken } from '../lib/linkedinStore';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { code, state, userId } = req.query || req.body || {};
  // In dev-mode or missing client secret, simulate token
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientSecret || code === 'dev-code') {
    const fakeToken = {
      access_token: 'dev-access-token',
      refresh_token: 'dev-refresh-token',
      expires_in: 60 * 60 * 24,
      obtained_at: Date.now(),
    };
    await saveToken(userId || 'dev-user', fakeToken);
    return res.json({ ok: true, token: fakeToken });
  }

  // Production flow: exchange code for token
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirect = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/api/linkedin-callback';
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect);
    params.append('client_id', clientId || '');
    params.append('client_secret', clientSecret || '');
    const resp = await fetch('https://www.linkedin.com/oauth/v2/accessToken', { method: 'POST', body: params });
    const data = await resp.json();
    await saveToken(userId || 'unknown', data);
    return res.json({ ok: true, data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
