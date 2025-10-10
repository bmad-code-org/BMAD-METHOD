export default async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).json({ error: 'Method not allowed' });
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirect = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/api/linkedin-callback';
    if (!clientId) {
        // Dev-mode: return a fake URL that the dev can call the callback with
        return res.json({ url: `${redirect}?code=dev-code&state=dev` });
    }
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=w_member_social`;
    return res.json({ url });
}
