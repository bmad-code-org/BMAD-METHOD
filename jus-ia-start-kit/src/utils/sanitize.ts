import { MAX_INPUT_LENGTH } from "../config/constants.js";

/** Strip HTML tags and trim whitespace from user input */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

/** Validate that a select value is in the allowed options */
export function validateSelect(value: string, allowedOptions: string[]): boolean {
  return allowedOptions.includes(value);
}
