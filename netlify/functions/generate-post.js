const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    const { sanitizedText, tone = 'professional', maxChars = 400, variants = 2 } = body;
    if (!sanitizedText) return { statusCode: 400, body: JSON.stringify({ error: 'sanitizedText required' }) };

    const systemPrompt = `You are a professional LinkedIn content editor. Convert the provided short journal entry into concise, high-value LinkedIn post variants suitable for a Senior Product Manager at a mid-size SaaS company. Do not include PII. Provide each variant labeled [Variant 1] and [Variant 2]. For each variant include 3 suggested hashtags and one optional 1-line engagement CTA.`;
    const userPrompt = `ENTRY: ${sanitizedText}\n\nPERSONA: Senior Product Manager at a mid-size SaaS company.\nGOAL: Build credibility.\nTONE: ${tone}.\nMAX_CHARS: ${maxChars}.\nOUTPUT: Provide ${variants} variants labeled [Variant 1], [Variant 2]. Each variant must include 'Suggested hashtags:' and 'CTA:' lines.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    const text = response.choices?.map(c => c.message?.content).join('\n\n') || '';
    return { statusCode: 200, body: JSON.stringify({ raw: text, usage: response.usage || null }) };
  } catch (err) {
    console.error('generate-post error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
