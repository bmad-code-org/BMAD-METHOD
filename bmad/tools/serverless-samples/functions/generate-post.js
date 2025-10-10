import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { sanitizedText, tone = 'professional', maxChars = 400, variants = 2 } = req.body;
    if (!sanitizedText) return res.status(400).json({ error: 'sanitizedText required' });

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

    // Simple parsing could be done here to structure variants; for brevity return raw text
    return res.status(200).json({ raw: text, usage: response.usage || null });
  } catch (err) {
    console.error('generate-post error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
}
