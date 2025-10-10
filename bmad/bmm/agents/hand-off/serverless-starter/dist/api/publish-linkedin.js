import secureStore from '../lib/secureLinkedinStore';
import { getToken } from '../lib/linkedinStore';
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { userId, text, visibility, generationId, variantId } = req.body || {};
    // If generationId/variantId are provided but no text, we would normally look up the generated variant.
    // For dev-mode, allow publishing with text directly.
    if (!text && !(generationId && variantId))
        return res.status(400).json({ error: 'Missing text to publish or generationId+variantId' });
    // Prefer secure getValidToken if available
    let token = null;
    try {
        if (secureStore && secureStore.getValidToken)
            token = await secureStore.getValidToken(userId || 'dev-user');
    }
    catch (e) { /* ignore */ }
    if (!token)
        token = await getToken(userId || 'dev-user');
    if (!token || token.access_token?.startsWith('dev-')) {
        // Simulate publish
        const fakeResponse = { ok: true, urn: `urn:li:share:dev-${Date.now()}`, text: text || `Generated ${generationId}:${variantId}`, visibility: visibility || 'PUBLIC' };
        return res.json({ published: true, response: fakeResponse });
    }
    // Real publish: call LinkedIn UGC API
    try {
        const author = `urn:li:person:${process.env.LINKEDIN_PERSON_ID || 'me'}`;
        const body = {
            author,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: text || `Generated ${generationId}:${variantId}` },
                    shareMediaCategory: 'NONE',
                },
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': visibility || 'PUBLIC' },
        };
        const resp = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await resp.json();
        return res.json({ published: true, data });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || String(err) });
    }
}
