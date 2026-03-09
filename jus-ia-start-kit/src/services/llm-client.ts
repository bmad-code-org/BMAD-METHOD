import type { RefinementQuestion, FlowState } from "../flows/types.js";
import { config } from "../config/index.js";
import { LLM_TIMEOUT_MS, MAX_REFINEMENT_QUESTIONS } from "../config/constants.js";

const SYSTEM_PROMPT = `Você é um assistente jurídico especializado em direito brasileiro.
Dado o contexto de um caso jurídico, gere perguntas de refinamento para capturar nuances importantes.

Regras:
- Gere no máximo ${MAX_REFINEMENT_QUESTIONS} perguntas
- Cada pergunta deve ser relevante ao caso e área do direito
- Prefira perguntas de seleção (com opções) a perguntas de texto livre
- Use linguagem jurídica profissional mas acessível
- As perguntas devem ajudar a construir um pedido mais preciso

Responda APENAS em JSON no formato:
{
  "questions": [
    {
      "id": "identificador_unico",
      "text": "Texto da pergunta",
      "type": "select",
      "options": ["Opção 1", "Opção 2", "Opção 3"]
    }
  ]
}`;

/** Call LLM for contextual refinement questions */
export async function getRefinementQuestions(
  state: FlowState,
  areaLabel: string,
  subtipoLabel: string,
): Promise<RefinementQuestion[]> {
  if (!config.llm.apiKey) {
    // No LLM configured — return empty (skip refinement)
    return [];
  }

  const userMessage = `Caso: ${areaLabel} - ${subtipoLabel}

Dados coletados até agora:
${Object.entries(state.responses)
  .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
  .join("\n")}

Gere perguntas de refinamento para capturar nuances deste caso.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    let response: Response;

    if (config.llm.provider === "anthropic") {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.llm.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: config.llm.model,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        }),
        signal: controller.signal,
      });
    } else {
      // Default: OpenAI-compatible
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.llm.apiKey}`,
        },
        body: JSON.stringify({
          model: config.llm.model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    let content: string;

    if (config.llm.provider === "anthropic") {
      content = data.content?.[0]?.text || "{}";
    } else {
      content = data.choices?.[0]?.message?.content || "{}";
    }

    const parsed = JSON.parse(content);
    const questions: RefinementQuestion[] = (parsed.questions || []).slice(
      0,
      MAX_REFINEMENT_QUESTIONS,
    );

    return questions;
  } catch (error) {
    // LLM failure is non-blocking — skip refinement
    console.error("LLM refinement failed:", (error as Error).message);
    return [];
  }
}
