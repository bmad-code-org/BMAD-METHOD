/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        {
          type: 'category',
          label: 'IDE Guides',
          collapsed: true,
          items: [],
        },
        'v4-to-v6-upgrade',
      ],
    },
    {
      type: 'category',
      label: 'BMM - Method',
      items: [
        'modules/bmm/index',
        'modules/bmm/quick-start',
        'modules/bmm/scale-adaptive-system',
        {
          type: 'category',
          label: 'Quick Flows',
          collapsed: true,
          items: ['modules/bmm/bmad-quick-flow', 'modules/bmm/quick-flow-solo-dev', 'modules/bmm/quick-spec-flow'],
        },
        {
          type: 'category',
          label: 'Workflows',
          collapsed: true,
          items: [
            'modules/bmm/workflows-planning',
            'modules/bmm/workflows-solutioning',
            'modules/bmm/workflows-analysis',
            'modules/bmm/workflows-implementation',
          ],
        },
        {
          type: 'category',
          label: 'Advanced Topics',
          collapsed: true,
          items: [
            'modules/bmm/party-mode',
            'modules/bmm/agents-guide',
            'modules/bmm/brownfield-guide',
            'modules/bmm/enterprise-agentic-development',
            'modules/bmm/test-architecture',
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          collapsed: true,
          items: [
            'modules/bmm/workflow-architecture-reference',
            'modules/bmm/workflow-document-project-reference',
            'modules/bmm/troubleshooting',
            'modules/bmm/faq',
            'modules/bmm/glossary',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'BMB - Builder',
      collapsed: true,
      items: [
        'modules/bmb/index',
        {
          type: 'category',
          label: 'Building Agents',
          collapsed: true,
          items: [
            'modules/bmb/agents/index',
            'modules/bmb/agents/understanding-agent-types',
            'modules/bmb/agents/simple-agent-architecture',
            'modules/bmb/agents/expert-agent-architecture',
            'modules/bmb/agents/agent-compilation',
            'modules/bmb/agents/agent-menu-patterns',
          ],
        },
        {
          type: 'category',
          label: 'Building Workflows',
          collapsed: true,
          items: [
            'modules/bmb/workflows/index',
            'modules/bmb/workflows/architecture',
            'modules/bmb/workflows/terms',
            'modules/bmb/workflows/intent-vs-prescriptive-spectrum',
            'modules/bmb/workflows/csv-data-file-standards',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'BMGD - Game Dev',
      collapsed: true,
      items: [
        'modules/bmgd/index',
        'modules/bmgd/quick-start',
        'modules/bmgd/quick-flow-guide',
        'modules/bmgd/agents-guide',
        'modules/bmgd/workflows-guide',
        'modules/bmgd/game-types-guide',
        'modules/bmgd/troubleshooting',
        'modules/bmgd/glossary',
      ],
    },
    {
      type: 'category',
      label: 'CIS - Creative Intelligence',
      collapsed: true,
      items: ['modules/cis/index'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'document-sharding-guide',
        'custom-content',
        'custom-content-installation',
        'agent-customization-guide',
        'web-bundles-gemini-gpt-guide',
        'BUNDLE_DISTRIBUTION_SETUP',
      ],
    },
  ],
};

export default sidebars;
