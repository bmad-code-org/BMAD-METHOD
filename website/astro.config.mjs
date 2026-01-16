// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import rehypeMarkdownLinks from './src/rehype-markdown-links.js';
import { getSiteUrl } from './src/lib/site-url.js';

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
    rehypePlugins: [rehypeMarkdownLinks],
  },

  integrations: [
    sitemap(),
    starlight({
      title: 'BMAD Method',
      tagline: 'AI-driven agile development with specialized agents and workflows that scale from bug fixes to enterprise platforms.',

      logo: {
        src: './public/img/logo.svg',
        alt: 'BMAD Logo',
      },
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
        { label: 'Welcome', slug: 'index' },
        {
          label: 'Tutorials',
          collapsed: false,
          items: [
            {
              label: 'Getting Started',
              autogenerate: { directory: 'tutorials/getting-started' },
            },
            {
              label: 'Advanced',
              autogenerate: { directory: 'tutorials/advanced' },
            },
          ],
        },
        {
          label: 'How-To Guides',
          collapsed: true,
          items: [
            { slug: 'how-to/get-answers-about-bmad' },
            {
              label: 'Installation',
              autogenerate: { directory: 'how-to/installation' },
            },
            {
              label: 'Workflows',
              autogenerate: { directory: 'how-to/workflows' },
            },
            {
              label: 'Customization',
              autogenerate: { directory: 'how-to/customization' },
            },
            {
              label: 'Brownfield Development',
              autogenerate: { directory: 'how-to/brownfield' },
            },
            {
              label: 'Troubleshooting',
              autogenerate: { directory: 'how-to/troubleshooting' },
            },
          ],
        },
        {
          label: 'Explanation',
          collapsed: true,
          items: [
            {
              label: 'Core Concepts',
              autogenerate: { directory: 'explanation/core-concepts' },
            },
            {
              label: 'Architecture',
              autogenerate: { directory: 'explanation/architecture' },
            },
            {
              label: 'Philosophy',
              autogenerate: { directory: 'explanation/philosophy' },
            },
            {
              label: 'Features',
              autogenerate: { directory: 'explanation/features' },
            },
            {
              label: 'TEA (Test Architect)',
              autogenerate: { directory: 'explanation/tea' },
            },
            {
              label: 'Agents',
              autogenerate: { directory: 'explanation/agents' },
            },
            {
              label: 'BMM',
              autogenerate: { directory: 'explanation/bmm' },
            },
            {
              label: 'BMad Builder',
              autogenerate: { directory: 'explanation/bmad-builder' },
            },
            {
              label: 'Game Development',
              autogenerate: { directory: 'explanation/game-dev' },
            },
            {
              label: 'Creative Intelligence',
              autogenerate: { directory: 'explanation/creative-intelligence' },
            },
            {
              label: 'Core Module',
              autogenerate: { directory: 'explanation/core' },
            },
            {
              label: 'FAQ',
              autogenerate: { directory: 'explanation/faq' },
            },
          ],
        },
        {
          label: 'Reference',
          collapsed: true,
          items: [
            {
              label: 'Agents',
              autogenerate: { directory: 'reference/agents' },
            },
            {
              label: 'Workflows',
              autogenerate: { directory: 'reference/workflows' },
            },
            {
              label: 'Configuration',
              autogenerate: { directory: 'reference/configuration' },
            },
            {
              label: 'TEA (Test Architect)',
              autogenerate: { directory: 'reference/tea' },
            },
            {
              label: 'Glossary',
              autogenerate: { directory: 'reference/glossary' },
            },
          ],
        },
      ],

      // Credits in footer
      credits: false,

      // Pagination
      pagination: true,

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
