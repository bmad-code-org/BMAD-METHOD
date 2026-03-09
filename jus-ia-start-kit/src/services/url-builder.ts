import { JUS_IA_BASE_URL } from "../config/constants.js";

/** Build the Jus IA redirect URL from assembled prompt text */
export function buildRedirectUrl(promptText: string): string {
  const encoded = encodeURIComponent(promptText);
  return `${JUS_IA_BASE_URL}?q=${encoded}&send`;
}

/** Get the direct Jus IA URL (without query) for copy-paste fallback */
export function getJusIaDirectUrl(): string {
  return JUS_IA_BASE_URL;
}
