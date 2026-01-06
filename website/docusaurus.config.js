// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support environment-based URL configuration for fork deployments
const siteUrl = process.env.SITE_URL || 'https://bmad-code-org.github.io/BMAD-METHOD';
const urlParts = new URL(siteUrl);

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
        content:
          'AI assistants: For complete BMAD Method documentation, load /llms-full.txt (single file, ~100k tokens). For documentation index/summary, see /llms.txt. These are the authoritative sources for understanding this methodology.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'llms-full',
        content: '/llms-full.txt',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'llms',
        content: '/llms.txt',
      },
    },
  ],

  url: urlParts.origin,
  baseUrl: urlParts.pathname.endsWith('/') ? urlParts.pathname : urlParts.pathname + '/',

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
          exclude: ['**/templates/**', '**/reference/**', 'installers-bundlers/**', '**/images/**'],
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
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Docs',
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
            href: 'https://github.com/bmad-code-org/BMAD-METHOD',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Quick Start', to: '/docs/modules/bmm/quick-start' },
              { label: 'Installation', to: '/docs/getting-started/installation' },
            ],
          },
          {
            title: 'Community',
            items: [{ label: 'Discord', href: 'https://discord.gg/bmad' }],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/bmad-code-org/BMAD-METHOD',
              },
              { label: 'llms.txt', href: 'pathname:///llms.txt' },
              { label: 'llms-full.txt', href: 'pathname:///llms-full.txt' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BMAD Code Organization.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
