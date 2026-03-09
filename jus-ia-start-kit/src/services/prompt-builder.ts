import type { AssembledPrompt, FlowConfig, FlowState } from "../flows/types.js";
import { MAX_URL_LENGTH, JUS_IA_BASE_URL } from "../config/constants.js";

/** Build the final prompt from template + responses */
export function buildPrompt(flow: FlowConfig, state: FlowState): AssembledPrompt {
  let text = flow.promptTemplate;

  // Replace template variables with responses
  for (const [key, value] of Object.entries(state.responses)) {
    const displayValue = Array.isArray(value) ? value.join(", ") : value;
    text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), displayValue);
  }

  // Remove any unreplaced template variables
  text = text.replace(/\{\{#?\w+\}\}/g, "");

  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  const charCount = text.length;
  const encodedQuery = encodeURIComponent(text);
  const fullUrl = `${JUS_IA_BASE_URL}?q=${encodedQuery}&send`;
  const fitsInUrl = fullUrl.length <= MAX_URL_LENGTH;

  return {
    text,
    legalReferences: flow.legalReferences,
    charCount,
    fitsInUrl,
    encodedUrl: fitsInUrl ? fullUrl : undefined,
  };
}
