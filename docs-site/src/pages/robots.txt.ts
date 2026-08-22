import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.href.replace(/\/$/, '') ?? '';

  const body = `# BMAD Method Documentation
# ${siteUrl}/
#
# This file controls web crawler access to the documentation site.

User-agent: *
Allow: /

# LLM-friendly documentation files
# These are specifically designed for AI consumption
# llms.txt - Concise overview with navigation
# llms-full.txt - Complete documentation in plain text

# AI Crawlers - Welcome!
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: cohere-ai
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
