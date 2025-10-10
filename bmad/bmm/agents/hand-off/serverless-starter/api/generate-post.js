import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sanitizedText, tone = 'professional', maxChars = 300, variants = 2 } = req.body || {};
  if (!sanitizedText) return res.status(400).json({ error: 'sanitizedText required' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OpenAI API key not configured' });

  // Build system + user prompt
  const systemPrompt = `You are a professional LinkedIn content editor. Convert the provided short journal entry into concise, high-value LinkedIn post variants suitable for a Senior Product Manager at a mid-size SaaS company. Do not include PII.`;
  const userPrompt = `ENTRY: ${sanitizedText}\nTONE: ${tone}\nMAX_CHARS: ${maxChars}\nOUTPUT: Provide ${variants} variants labeled [Variant 1], [Variant 2]. Include suggested hashtags and a CTA.`;

  try {
    // Example: call OpenAI chat completions API. Adjust model & endpoint as needed.
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 400,
        temperature: 0.6
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: 'OpenAI error', details: text });
    }

    const result = await resp.json();
    // Parse assistant content - for demo we return the raw content.
    const assistant = result.choices?.[0]?.message?.content || '';

    return res.json({ variantsRaw: assistant, usage: result.usage || null });
  } catch (err) {
    console.error('generate-post error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
