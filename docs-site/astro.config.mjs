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
    '/reference/workflow-map': `${basePath}start/how-bmad-works/`,
    '/reference/agents': `${basePath}reference/skills-and-agents/`,
    '/reference/commands': `${basePath}reference/skills-and-agents/`,
    '/reference/core-tools': `${basePath}reference/skills-and-agents/`,
    '/explanation/advanced-elicitation': `${basePath}reference/skills-and-agents/`,
    '/how-to/choose-a-development-path': `${basePath}start/how-bmad-works/`,
    '/explanation/analysis-phase': `${basePath}clarify/clarify-the-idea/`,
    '/explanation/brainstorming': `${basePath}clarify/clarify-the-idea/`,
    '/explanation/forge-idea': `${basePath}clarify/clarify-the-idea/`,
    '/how-to/pressure-test-an-idea': `${basePath}clarify/clarify-the-idea/`,
    '/explanation/deep-recon': `${basePath}clarify/clarify-the-idea/`,
    '/explanation/why-solutioning-matters': `${basePath}plan/design-ux-and-architecture/`,
    '/explanation/preventing-agent-conflicts': `${basePath}plan/design-ux-and-architecture/`,
    '/explanation/sprint-planning': `${basePath}plan/plan-an-epics-stories/`,
    '/explanation/retrospective': `${basePath}learn/finish-an-epic/`,
    '/plan/choose-a-planning-path': `${basePath}start/how-bmad-works/`,
    '/plan/explore-and-validate-an-idea': `${basePath}clarify/clarify-the-idea/`,
    '/plan/research-a-decision': `${basePath}clarify/clarify-the-idea/`,
    '/plan/define-requirements-and-a-specification': `${basePath}plan/write-and-slice-the-initiative/`,
    '/plan/break-work-into-stories-and-track-it': `${basePath}plan/plan-an-epics-stories/`,
    '/build/finish-an-epic': `${basePath}learn/finish-an-epic/`,
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
              label: 'The BMad Agent',
              slug: 'start/the-bmad-agent',
            },
            {
              label: 'How BMad Works',
              slug: 'start/how-bmad-works',
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
              label: 'Walk Through Three Routes',
              slug: 'start/walk-through-three-routes',
            },
            {
              label: 'Walk Through an Existing Codebase',
              slug: 'start/walk-through-an-existing-codebase',
            },
            {
              label: 'Why BMad Works This Way',
              slug: 'start/why-bmad-works-this-way',
            },
            {
              label: 'Get Answers About BMad',
              slug: 'start/get-answers-about-bmad',
            },
          ],
        },
        {
          label: 'Scenarios',
          collapsed: false,
          items: [
            {
              label: 'Make a Small Change',
              slug: 'scenarios/make-a-small-change',
            },
            {
              label: 'Build from a Conversation',
              slug: 'scenarios/build-from-a-conversation',
            },
            {
              label: 'Turn a Prototype into a Product',
              slug: 'scenarios/turn-a-prototype-into-a-product',
            },
            {
              label: 'Plan a Feature as a Team',
              slug: 'scenarios/plan-a-feature-as-a-team',
            },
            {
              label: 'Change an Existing Codebase',
              slug: 'scenarios/change-an-existing-codebase',
            },
          ],
        },
        {
          label: 'Clarify',
          collapsed: false,
          items: [
            {
              label: 'Clarify the Idea',
              slug: 'clarify/clarify-the-idea',
            },
          ],
        },
        {
          label: 'Plan',
          collapsed: false,
          items: [
            {
              label: 'Plan the Work',
              slug: 'plan/plan-the-work',
            },
            {
              label: 'Write a PRD',
              slug: 'plan/write-a-prd',
            },
            {
              label: 'Write and Slice the Initiative',
              slug: 'plan/write-and-slice-the-initiative',
            },
            {
              label: 'Design UX and Architecture',
              slug: 'plan/design-ux-and-architecture',
            },
            {
              label: "Plan an Epic's Stories",
              slug: 'plan/plan-an-epics-stories',
            },
            {
              label: 'Plan Inside an Organization',
              slug: 'plan/plan-inside-an-organization',
            },
            {
              label: 'Set Up the Ticket Tree',
              slug: 'plan/set-up-the-ticket-tree',
            },
            {
              label: 'Prepare Long Documents for Agents',
              slug: 'plan/prepare-long-documents-for-agents',
            },
          ],
        },
        {
          label: 'Build and Verify',
          collapsed: false,
          items: [
            {
              label: 'Build and Verify',
              slug: 'build/build-and-verify',
            },
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
              label: 'Autonomous Development Loops',
              slug: 'build/autonomous-development-loops',
            },
          ],
        },
        {
          label: 'Learn and Adjust',
          collapsed: false,
          items: [
            {
              label: 'Learn and Adjust',
              slug: 'learn/learn-and-adjust',
            },
            {
              label: 'Finish an Epic',
              slug: 'learn/finish-an-epic',
            },
          ],
        },
        {
          label: 'Agents',
          collapsed: true,
          items: [
            { label: 'Meet the Agents', slug: 'agents/agents' },
            { label: 'Mary, Business Analyst', slug: 'agents/mary-analyst' },
            { label: 'John, Product Manager', slug: 'agents/john-pm' },
            { label: 'Sofia, Product Owner', slug: 'agents/sofia-po' },
            { label: 'Sally, UX Designer', slug: 'agents/sally-ux-designer' },
            { label: 'Winston, System Architect', slug: 'agents/winston-architect' },
            { label: 'Amelia, Developer', slug: 'agents/amelia-dev' },
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
            {
              label: 'How Document Templates Work',
              slug: 'customize/how-document-templates-work',
            },
            {
              label: 'Customize a Document for Your Team',
              slug: 'customize/customize-a-document-for-your-team',
            },
            {
              label: 'Write a Document Template',
              slug: 'customize/write-a-document-template',
            },
          ],
        },
        {
          label: 'Founder',
          collapsed: true,
          items: [
            { label: 'Founder', slug: 'founder/founder' },
            { label: 'Money, Fundraising, and Pitch Room', slug: 'founder/numbers-and-pitch-room' },
          ],
        },
        {
          label: 'Creative',
          collapsed: true,
          items: [
            { label: 'Creative', slug: 'creative/creative' },
            { label: 'Voice, Writing, and Studio Rooms', slug: 'creative/voice-lint-and-rooms' },
          ],
        },
        {
          label: 'Toolsmith',
          collapsed: true,
          items: [
            {
              label: 'Getting Started',
              items: [
                { label: 'Toolsmith', slug: 'toolsmith/toolsmith' },
                { label: 'Build Your First Skill', slug: 'toolsmith/build-your-first-skill' },
                { label: 'Ways to Build a Skill', slug: 'toolsmith/approaches' },
                { label: 'Shapes of a Skill', slug: 'toolsmith/shapes' },
                { label: 'Work on an Existing Skill', slug: 'toolsmith/modes' },
              ],
            },
            {
              label: 'Skill Craft',
              items: [
                { label: 'Write a Good Skill', slug: 'toolsmith/write-a-good-skill' },
                { label: 'Subagent Patterns', slug: 'toolsmith/subagent-patterns' },
                { label: 'Make a Skill Customizable', slug: 'toolsmith/make-a-skill-customizable' },
                { label: 'Agents with Memory', slug: 'toolsmith/agents-with-memory' },
              ],
            },
            {
              label: 'Modules and Evals',
              items: [
                { label: 'Modules and Registration', slug: 'toolsmith/modules' },
                { label: 'Distribute Your Module', slug: 'toolsmith/distribute-your-module' },
                { label: 'Migrate an Old Module', slug: 'toolsmith/migrate-an-old-module' },
                { label: 'Eval Runner', slug: 'toolsmith/bmad-eval' },
              ],
            },
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
