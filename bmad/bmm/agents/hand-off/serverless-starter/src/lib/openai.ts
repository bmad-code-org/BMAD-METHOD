export async function generateDrafts(sanitizedText: string, opts: { tone?: string; variants?: number; maxChars?: number; anonymize?: boolean } = {}) {
  const { tone = 'professional', variants = 2, maxChars = 300, anonymize = false } = opts;
  // Dev-mode: return canned drafts if DEV_MODE set or no API key provided
  const dev = !!process.env.DEV_MODE || !process.env.OPENAI_API_KEY;
  if (dev) {
    const variantsArr = [];
    for (let i = 1; i <= variants; i++) {
      variantsArr.push({ id: `v${i}`, text: `${sanitizedText} (dev draft variant ${i}, tone=${tone})`, tokens: 50 + i });
    }
    return { generationId: `g-dev-${Date.now()}`, variants: variantsArr, usage: { totalTokens: variants * 60, model: 'dev-mock' } };
  }

  // Production path: call OpenAI API (minimal implementation)
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `You are a LinkedIn editor. Tone: ${tone}` },
      { role: 'user', content: sanitizedText }
    ],
    max_tokens: Math.min(800, Math.floor(maxChars / 2)),
    temperature: 0.6
  };
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify(payload)
  });
  const resultAny = await resp.json();
  const result: any = resultAny;
  const assistant = result?.choices?.[0]?.message?.content || '';
  // For simplicity, return a single variant parsed from assistant
  return { generationId: `g-${Date.now()}`, variants: [{ id: 'v1', text: assistant, tokens: result.usage?.total_tokens || 0 }], usage: result.usage || null };
}

export default { generateDrafts };
