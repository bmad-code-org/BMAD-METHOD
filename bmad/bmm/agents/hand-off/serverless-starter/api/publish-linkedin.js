import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, variantText, visibility = 'PUBLIC' } = req.body || {};
  if (!userId || !variantText) return res.status(400).json({ error: 'userId and variantText required' });

  // In production, retrieve the stored access token for the user from your DB.
  const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_TEST_ACCESS_TOKEN; // for demo only
  const AUTHOR_URN = process.env.LINKEDIN_TEST_AUTHOR_URN || `urn:li:person:TEST`;

  if (!LINKEDIN_ACCESS_TOKEN) return res.status(500).json({ error: 'LinkedIn access token not configured for demo' });

  const payload = {
    author: AUTHOR_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: variantText },
        shareMediaCategory: 'NONE'
      }
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': visibility }
  };

  try {
    const resp = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: 'LinkedIn error', details: text });
    }

    const result = await resp.json();
    return res.json({ ok: true, result });
  } catch (err) {
    console.error('publish-linkedin error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
