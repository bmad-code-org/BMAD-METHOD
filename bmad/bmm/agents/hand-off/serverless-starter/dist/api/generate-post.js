export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { sanitizedText, tone = 'professional', maxChars = 300, variants = 2 } = req.body || {};
    if (!sanitizedText)
        return res.status(400).json({ error: 'sanitizedText required' });
    // Use openai helper (dev-mode safe)
    try {
        const openai = await import('../lib/openai');
        const out = await openai.generateDrafts(sanitizedText, { tone, variants, maxChars, anonymize: !!req.body?.anonymize });
        const assistant = out.variants.map((v) => v.text).join('\n---\n');
        const result = { usage: out.usage };
        // Dev: write a simple usage snapshot to .usage.json to track token cost locally
        try {
            const fs = await import('fs');
            const path = require('path');
            const ufile = path.resolve(__dirname, '../../.usage.json');
            let usage = [];
            if (fs.existsSync(ufile)) {
                usage = JSON.parse(fs.readFileSync(ufile, 'utf8') || '[]');
            }
            usage.push({ id: `g-${Date.now()}`, model: result.model || 'unknown', total_tokens: result.usage?.total_tokens || 0, ts: new Date().toISOString() });
            fs.writeFileSync(ufile, JSON.stringify(usage, null, 2), 'utf8');
        }
        catch (err) {
            // non-fatal
        }
        return res.json({ variantsRaw: assistant, usage: result.usage || null });
    }
    catch (err) {
        console.error('generate-post error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
