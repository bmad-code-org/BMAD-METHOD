const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    const { accessToken, authorUrn, text, visibility = 'PUBLIC' } = body;
    if (!accessToken || !authorUrn || !text) return { statusCode: 400, body: JSON.stringify({ error: 'accessToken, authorUrn, text required' }) };

    const payload = {
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
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const textResp = await response.text();
      console.error('linkedin publish failed', response.status, textResp);
      return { statusCode: 502, body: JSON.stringify({ error: 'linkedin_publish_failed', details: textResp }) };
    }

    const json = await response.json();
    return { statusCode: 200, body: JSON.stringify({ success: true, linkedinResponse: json }) };
  } catch (err) {
    console.error('publish-linkedin error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
