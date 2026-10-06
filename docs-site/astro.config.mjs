// @ts-check
import { fileURLToPath } from 'node:url';

import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import bmadDiagrams from './src/integrations/diagrams.js';
import rehypeInlineDiagrams from './src/rehype-inline-diagrams.js';
import rehypeMarkdownLinks from './src/rehype-markdown-links.js';
import rehypeBasePaths from './src/rehype-base-paths.js';
import { getSiteUrl } from './src/lib/site-url.mjs';

const siteUrl = getSiteUrl();
const urlParts = new URL(siteUrl);
// Normalize basePath: ensure trailing slash so links can use `${BASE_URL}path`
const basePath = urlParts.pathname === '/' ? '/' : urlParts.pathname.endsWith('/') ? urlParts.pathname : urlParts.pathname + '/';

export default defineConfig({
  compressHTML: true,
  site: `${urlParts.origin}${basePath}`,
  base: basePath,
  redirects: {
    '/how-to/install-bmad': `${basePath}start/install-bmad/`,
    '/how-to/non-interactive-installation': `${basePath}start/install-bmad/`,
    '/tutorials/getting-started': `${basePath}start/build-your-first-change/`,
    '/how-to/get-answers-about-bmad': `${basePath}start/get-answers-about-bmad/`,
    '/how-to/upgrade-to-v6': `${basePath}start/install-bmad/`,
    '/how-to/quick-fixes': `${basePath}build/build-a-change/`,
    '/explanation/build': `${basePath}build/build-a-change/`,
    '/explanation/checkpoint-preview': `${basePath}build/walk-through-a-change/`,
    '/plan/help-test-v7-previews': `${basePath}plan/set-up-the-ticket-tree/`,
    '/build/review-a-completed-change': `${basePath}build/walk-through-a-change/`,
    '/build/checkpoint-a-change': `${basePath}build/walk-through-a-change/`,
    '/explanation/adversarial-review': `${basePath}build/review-a-change/`,
    '/reference/testing': `${basePath}build/test-completed-work/`,
    '/reference/build-auto': `${basePath}build/autonomous-development-loops/`,
    '/reference/workflow-map': `${basePath}plan/choose-a-planning-path/`,
    '/reference/agents': `${basePath}reference/skills-and-agents/`,
    '/reference/commands': `${basePath}reference/skills-and-agents/`,
    '/reference/core-tools': `${basePath}reference/skills-and-agents/`,
    '/explanation/advanced-elicitation': `${basePath}reference/skills-and-agents/`,
    '/how-to/choose-a-development-path': `${basePath}plan/choose-a-planning-path/`,
    '/explanation/analysis-phase': `${basePath}plan/explore-and-validate-an-idea/`,
    '/explanation/brainstorming': `${basePath}plan/explore-and-validate-an-idea/`,
    '/explanation/forge-idea': `${basePath}plan/explore-and-validate-an-idea/`,
    '/how-to/pressure-test-an-idea': `${basePath}plan/explore-and-validate-an-idea/`,
    '/explanation/deep-recon': `${basePath}plan/research-a-decision/`,
    '/explanation/why-solutioning-matters': `${basePath}plan/design-ux-and-architecture/`,
    '/explanation/preventing-agent-conflicts': `${basePath}plan/design-ux-and-architecture/`,
    '/explanation/sprint-planning': `${basePath}plan/break-work-into-stories-and-track-it/`,
    '/explanation/retrospective': `${basePath}build/finish-an-epic/`,
    '/how-to/established-projects': `${basePath}existing-codebases/start-in-an-existing-codebase/`,
    '/explanation/established-projects-faq': `${basePath}existing-codebases/start-in-an-existing-codebase/`,
    '/how-to/project-context': `${basePath}existing-codebases/set-and-maintain-project-context/`,
    '/explanation/project-context': `${basePath}existing-codebases/set-and-maintain-project-context/`,
    '/explanation/project-context-theory': `${basePath}existing-codebases/theory-of-project-context/`,
    '/tutorials/getting-deeper': `${basePath}existing-codebases/getting-deeper/`,
    '/how-to/customize-bmad': `${basePath}customize/customize-bmad/`,
    '/explanation/named-agents': `${basePath}customize/customize-bmad/`,
    '/how-to/expand-bmad-for-your-org': `${basePath}customize/adopt-bmad-across-a-team/`,
    '/how-to/install-custom-modules': `${basePath}customize/add-modules/`,
    '/reference/modules': `${basePath}customize/add-modules/`,
    '/explanation/party-mode': `${basePath}customize/run-multi-agent-discussions/`,
  },

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
    processor: unified({
      rehypePlugins: [
        // Hand-authored diagrams are inlined so custom.css can theme them; this
        // runs before rehypeBasePaths, which would otherwise rewrite the src of
        // an <img> that is about to be replaced.
        [rehypeInlineDiagrams, { root: fileURLToPath(new URL('.', import.meta.url)) }],
        [rehypeMarkdownLinks, { base: basePath }],
        [rehypeBasePaths, { base: basePath }],
      ],
    }),
  },

  integrations: [
    // must come before the pages that embed diagrams are rendered
    bmadDiagrams(),
    // Exclude the custom 404 page from the sitemap — it is
    // treated as a normal content doc by Starlight even with disable404Route.
    sitemap({
      filter: (page) => !/\/404(\/|$)/.test(new URL(page).pathname),
    }),
    starlight({
      title: 'BMad Method',

      // The BMad tile: the same mark the header carries, and byte-for-byte the
      // drawing bmadcode.com and blog.bmadcode.com serve. The SVG is what modern
      // browsers pick up; the .ico and the apple-touch-icon are generated from
      // it, for the ones that ignore `image/svg+xml` and for iOS home screens.
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'link',
          attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        },
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        },
      ],

      // Social links
      social: [
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/gk8jAdXWmj' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bmad-code-org/BMAD-METHOD' },
        { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BMadCode' },
      ],

      // Show last updated timestamps
      lastUpdated: true,

      // Custom CSS
      customCss: ['./src/styles/custom.css'],

      // Sidebar configuration
      sidebar: [
        {
          label: 'Start',
          collapsed: false,
          items: [
            {
              label: 'Welcome',
              slug: 'index',
            },
            {
              label: 'Install BMad',
              slug: 'start/install-bmad',
            },
            {
              label: 'Build Your First Change',
              slug: 'start/build-your-first-change',
            },
            {
              label: 'Get Answers About BMad',
              slug: 'start/get-answers-about-bmad',
            },
          ],
        },
        {
          label: 'Build',
          collapsed: false,
          items: [
            {
              label: 'Build a Change',
              slug: 'build/build-a-change',
            },
            {
              label: 'Review a Change',
              slug: 'build/review-a-change',
            },
            {
              label: 'Walk Through a Change',
              slug: 'build/walk-through-a-change',
            },
            {
              label: 'Test Completed Work',
              slug: 'build/test-completed-work',
            },
            {
              label: 'Finish an Epic',
              slug: 'build/finish-an-epic',
            },
            {
              label: 'Autonomous Development Loops',
              slug: 'build/autonomous-development-loops',
            },
          ],
        },
        {
          label: 'Plan Larger Work',
          collapsed: true,
          items: [
            {
              label: 'Choose a Planning Path',
              slug: 'plan/choose-a-planning-path',
            },
            {
              label: 'Plan Inside an Organization',
              slug: 'plan/plan-inside-an-organization',
            },
            {
              label: 'Explore and Validate an Idea',
              slug: 'plan/explore-and-validate-an-idea',
            },
            {
              label: 'Research a Decision',
              slug: 'plan/research-a-decision',
            },
            {
              label: 'Define Requirements and a Specification',
              slug: 'plan/define-requirements-and-a-specification',
            },
            {
              label: 'Design UX and Architecture',
              slug: 'plan/design-ux-and-architecture',
            },
            {
              label: 'Break Work into Stories and Track It',
              slug: 'plan/break-work-into-stories-and-track-it',
            },
            {
              label: 'Set Up the Ticket Tree',
              slug: 'plan/set-up-the-ticket-tree',
            },
          ],
        },
        {
          label: 'Existing Codebases',
          collapsed: true,
          items: [
            {
              label: 'Start in an Existing Codebase',
              slug: 'existing-codebases/start-in-an-existing-codebase',
            },
            {
              label: 'Set and Maintain Project Context',
              slug: 'existing-codebases/set-and-maintain-project-context',
            },
            {
              label: 'Getting Deeper',
              slug: 'existing-codebases/getting-deeper',
            },
            {
              label: 'The Theory of Project Context',
              slug: 'existing-codebases/theory-of-project-context',
            },
          ],
        },
        {
          label: 'Customize and Extend',
          collapsed: true,
          items: [
            {
              label: 'Customize BMad',
              slug: 'customize/customize-bmad',
            },
            {
              label: 'Adopt BMad Across a Team',
              slug: 'customize/adopt-bmad-across-a-team',
            },
            {
              label: 'Add Modules',
              slug: 'customize/add-modules',
            },
            {
              label: 'Run Multi-Agent Discussions',
              slug: 'customize/run-multi-agent-discussions',
            },
          ],
        },
        {
          label: 'Toolsmith',
          collapsed: true,
          items: [
            { label: 'Toolsmith', slug: 'toolsmith/toolsmith' },
            { label: 'Ways to Build a Skill', slug: 'toolsmith/approaches' },
            { label: 'Shapes of a Skill', slug: 'toolsmith/shapes' },
            { label: 'Work on an Existing Skill', slug: 'toolsmith/modes' },
            { label: 'Eval Runner', slug: 'toolsmith/bmad-eval' },
            { label: 'Migrate an Old Module', slug: 'toolsmith/migrate-an-old-module' },
          ],
        },
        {
          label: 'Reference',
          collapsed: true,
          items: [{ autogenerate: { directory: 'reference' } }],
        },
        // TEA docs moved to standalone module site; keep BMM sidebar focused.
        {
          label: 'BMad Ecosystem',
          collapsed: false,
          items: [
            {
              label: 'Creative Intelligence Suite',
              link: 'https://cis-docs.bmad-method.org/',
              attrs: { target: '_blank' },
            },
            {
              label: 'Game Dev Studio',
              link: 'https://game-dev-studio-docs.bmad-method.org/',
              attrs: { target: '_blank' },
            },
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
        Sidebar: './src/components/Sidebar.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        PageTitle: './src/components/PageTitle.astro',
        TwoColumnContent: './src/components/TwoColumnContent.astro',
      },

      // Table of contents
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    }),
  ],
});
