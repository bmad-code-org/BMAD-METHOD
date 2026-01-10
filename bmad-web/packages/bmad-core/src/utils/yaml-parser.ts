import { parse, stringify } from 'yaml';

/**
 * Parse YAML content to JavaScript object
 */
export function parseYaml<T = unknown>(content: string): T {
  return parse(content) as T;
}

/**
 * Stringify JavaScript object to YAML
 */
export function toYaml(data: unknown): string {
  return stringify(data, {
    indent: 2,
    lineWidth: 120,
  });
}

/**
 * Extract frontmatter from markdown content
 */
export function extractFrontmatter<T = Record<string, unknown>>(
  content: string
): { frontmatter: T | null; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (match) {
    try {
      const frontmatter = parseYaml<T>(match[1]);
      const contentWithoutFrontmatter = content.slice(match[0].length);
      return { frontmatter, content: contentWithoutFrontmatter };
    } catch {
      return { frontmatter: null, content };
    }
  }

  return { frontmatter: null, content };
}

/**
 * Add frontmatter to markdown content
 */
export function addFrontmatter(
  content: string,
  frontmatter: Record<string, unknown>
): string {
  const yamlFrontmatter = toYaml(frontmatter);
  return `---\n${yamlFrontmatter}---\n\n${content}`;
}
