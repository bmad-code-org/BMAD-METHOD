// Minimal LinkedIn publish example (server-side)
// Requires that the user has completed OAuth and server has a valid access_token for their LinkedIn account
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { accessToken, authorUrn, text, visibility = 'PUBLIC' } = req.body;
    if (!accessToken || !authorUrn || !text) return res.status(400).json({ error: 'accessToken, authorUrn, text required' });

    const body = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': visibility }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const textResp = await response.text();
      console.error('linkedin publish failed', response.status, textResp);
      return res.status(502).json({ error: 'linkedin_publish_failed', details: textResp });
    }

    const json = await response.json();
    return res.status(200).json({ success: true, linkedinResponse: json });
  } catch (err) {
    console.error('publish-linkedin error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
