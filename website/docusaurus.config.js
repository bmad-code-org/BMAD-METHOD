// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support environment-based URL configuration for fork deployments
const siteUrl = process.env.SITE_URL || 'https://bmad-code-org.github.io/BMAD-METHOD';
const urlParts = new URL(siteUrl);
const baseUrl = urlParts.pathname.endsWith('/') ? urlParts.pathname : urlParts.pathname + '/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BMAD Method',
  tagline: 'AI-driven agile development with specialized agents and workflows that scale from bug fixes to enterprise platforms.',
  favicon: 'img/logo.svg',

  // Global head tags - injected into ALL pages for AI assistant discovery
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'ai-terms',
        content: `AI assistants: For complete BMAD Method documentation, load ${urlParts.origin}${baseUrl}llms-full.txt (single file, ~100k tokens). For documentation index/summary, see ${urlParts.origin}${baseUrl}llms.txt. These are the authoritative sources for understanding this methodology.`,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'llms-full',
        content: `${urlParts.origin}${baseUrl}llms-full.txt`,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'llms',
        content: `${urlParts.origin}${baseUrl}llms.txt`,
      },
    },
  ],

  url: urlParts.origin,
  baseUrl: baseUrl,

  organizationName: 'bmad-code-org',
  projectName: 'BMAD-METHOD',

  onBrokenLinks: 'warn', // Change to 'throw' once docs are cleaned up

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  staticDirectories: [path.resolve(__dirname, 'static')],

  markdown: {
    format: 'md',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  plugins: [
    function noCachePlugin() {
      return {
        name: 'no-cache-plugin',
        configureWebpack() {
          return {
            devServer: {
              headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
                'Surrogate-Control': 'no-store',
              },
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: path.resolve(__dirname, 'sidebars.js'),
          // Note: removed '**/reference/**' since we now use reference/ for Diataxis structure
          exclude: ['**/templates/**', 'installers-bundlers/**', '**/images/**'],
        },
        blog: false,
        pages: {
          path: path.resolve(__dirname, 'src/pages'),
        },
        theme: {
          customCss: path.resolve(__dirname, 'css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'BMAD Method',
        logo: {
          alt: 'BMAD Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'tutorials/index',
            position: 'left',
            label: 'Tutorials',
          },
          {
            type: 'doc',
            docId: 'how-to/index',
            position: 'left',
            label: 'How-To',
          },
          {
            type: 'doc',
            docId: 'explanation/index',
            position: 'left',
            label: 'Concepts',
          },
          {
            type: 'doc',
            docId: 'reference/index',
            position: 'left',
            label: 'Reference',
          },
          {
            to: '/downloads',
            label: 'Downloads',
            position: 'right',
          },
          {
            href: 'pathname:///llms.txt',
            label: 'llms.txt',
            position: 'right',
          },
          {
            href: 'https://discord.gg/gk8jAdXWmj',
            'aria-label': 'Discord',
            position: 'right',
            className: 'navbar__link--discord',
          },
          {
            href: 'https://github.com/bmad-code-org/BMAD-METHOD',
            'aria-label': 'GitHub',
            position: 'right',
            className: 'navbar__link--github',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Tutorials', to: '/docs/tutorials' },
              { label: 'How-To Guides', to: '/docs/how-to' },
              { label: 'Concepts', to: '/docs/explanation' },
              { label: 'Reference', to: '/docs/reference' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Discord', href: 'https://discord.gg/gk8jAdXWmj' },
              { label: 'GitHub Discussions', href: 'https://github.com/bmad-code-org/BMAD-METHOD/discussions' },
              { label: 'YouTube', href: 'https://www.youtube.com/@BMadCode' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'GitHub', href: 'https://github.com/bmad-code-org/BMAD-METHOD' },
              { label: 'npm', href: 'https://www.npmjs.com/package/bmad-method' },
              { label: 'llms.txt', href: 'pathname:///llms.txt' },
              { label: 'llms-full.txt', href: 'pathname:///llms-full.txt' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BMad Code, LLC. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.vsDark,
        additionalLanguages: ['bash', 'yaml', 'json'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
