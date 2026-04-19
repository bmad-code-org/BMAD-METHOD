// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import rehypeMarkdownLinks from './src/rehype-markdown-links.js';
import rehypeBasePaths from './src/rehype-base-paths.js';
import { getSiteUrl } from './src/lib/site-url.mjs';
import { locales } from './src/lib/locales.mjs';

const siteUrl = getSiteUrl();
const urlParts = new URL(siteUrl);
// Normalize basePath: ensure trailing slash so links can use `${BASE_URL}path`
const basePath = urlParts.pathname === '/' ? '/' : urlParts.pathname.endsWith('/') ? urlParts.pathname : urlParts.pathname + '/';

export default defineConfig({
  site: `${urlParts.origin}${basePath}`,
  base: basePath,
  outDir: '../build/site',

  // Disable aggressive caching in dev mode
  vite: {
    optimizeDeps: {
      force: true, // Always re-bundle dependencies
    },
    server: {
      watch: {
        usePolling: false, // Set to true if file changes aren't detected
      },
    },
  },

  markdown: {
    rehypePlugins: [
      [rehypeMarkdownLinks, { base: basePath }],
      [rehypeBasePaths, { base: basePath }],
    ],
  },

  integrations: [
    // Exclude custom 404 pages (all locales) from the sitemap — they are
    // treated as normal content docs by Starlight even with disable404Route.
    sitemap({
      filter: (page) => !/\/404(\/|$)/.test(new URL(page).pathname),
    }),
    starlight({
      title: 'BMAD Method',
      tagline: 'AI-driven agile development with specialized agents and workflows that scale from bug fixes to enterprise platforms.',

      // i18n: locale config from shared module (website/src/lib/locales.mjs)
      defaultLocale: 'root',
      locales,

      favicon: '/favicon.ico',

      // Social links
      social: [
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/gk8jAdXWmj' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bmad-code-org/BMAD-METHOD' },
        { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BMadCode' },
      ],

      // Show last updated timestamps
      lastUpdated: true,

      // Custom head tags for LLM discovery
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'ai-terms',
            content: `AI-optimized documentation: ${siteUrl}/llms-full.txt (plain text, ~100k tokens, complete BMAD reference). Index: ${siteUrl}/llms.txt`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'llms-full',
            content: `${siteUrl}/llms-full.txt`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'llms',
            content: `${siteUrl}/llms.txt`,
          },
        },
      ],

      // Custom CSS
      customCss: ['./src/styles/custom.css'],

      // Sidebar configuration (Diataxis structure)
      sidebar: [
        {
          label: 'Welcome',
          translations: { 'vi-VN': 'Chào mừng', 'zh-CN': '欢迎', 'fr-FR': 'Bienvenue', 'cs-CZ': 'Vítejte' },
          slug: 'index',
        },
        {
          label: 'Roadmap',
          translations: { 'vi-VN': 'Lộ trình', 'zh-CN': '路线图', 'fr-FR': 'Feuille de route', 'cs-CZ': 'Plán rozvoje' },
          slug: 'roadmap',
        },
        {
          label: 'Tutorials',
          translations: { 'vi-VN': 'Hướng dẫn nhập môn', 'zh-CN': '教程', 'fr-FR': 'Tutoriels', 'cs-CZ': 'Tutoriály' },
          collapsed: false,
          autogenerate: { directory: 'tutorials' },
        },
        {
          label: 'How-To Guides',
          translations: { 'vi-VN': 'Hướng dẫn tác vụ', 'zh-CN': '操作指南', 'fr-FR': 'Guides pratiques', 'cs-CZ': 'Praktické návody' },
          collapsed: true,
          autogenerate: { directory: 'how-to' },
        },
        {
          label: 'Explanation',
          translations: { 'vi-VN': 'Giải thích', 'zh-CN': '概念说明', 'fr-FR': 'Explications', 'cs-CZ': 'Vysvětlení' },
          collapsed: true,
          autogenerate: { directory: 'explanation' },
        },
        {
          label: 'Reference',
          translations: { 'vi-VN': 'Tham chiếu', 'zh-CN': '参考', 'fr-FR': 'Référence', 'cs-CZ': 'Reference' },
          collapsed: true,
          autogenerate: { directory: 'reference' },
        },
        // TEA docs moved to standalone module site; keep BMM sidebar focused.
        {
          label: 'BMad Ecosystem',
          collapsed: false,
          items: [
            { label: 'BMad Builder', link: 'https://bmad-builder-docs.bmad-method.org/', attrs: { target: '_blank' } },
            { label: 'Creative Intelligence Suite', link: 'https://cis-docs.bmad-method.org/', attrs: { target: '_blank' } },
            { label: 'Game Dev Studio', link: 'https://game-dev-studio-docs.bmad-method.org/', attrs: { target: '_blank' } },
            {
              label: 'Test Architect (TEA)',
              link: 'https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/',
              attrs: { target: '_blank' },
            },
          ],
        },
      ],

      // Credits in footer
      credits: false,

      // Pagination
      pagination: false,

      // Use our docs/404.md instead of Starlight's built-in 404
      disable404Route: true,

      // Custom components
      components: {
        Header: './src/components/Header.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
      },

      // Table of contents
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    }),
  ],
});
