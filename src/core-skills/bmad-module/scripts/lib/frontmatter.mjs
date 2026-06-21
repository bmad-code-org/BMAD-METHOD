import { parse as parseYaml } from './vendor/yaml.mjs';

// Parse YAML frontmatter from a markdown string. Returns the parsed object,
// or null if no frontmatter block is present / it failed to parse.
export function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return null;
  try {
    return parseYaml(m[1]);
  } catch {
    return null;
  }
}
