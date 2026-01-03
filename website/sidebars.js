/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'index',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'bmad-core-concepts/index',
        'bmad-core-concepts/agents',
        'bmad-core-concepts/workflows',
        'bmad-core-concepts/modules',
        {
          type: 'category',
          label: 'Installing',
          collapsed: true,
          items: ['bmad-core-concepts/installing/index', 'bmad-core-concepts/installing/upgrading'],
        },
        {
          type: 'category',
          label: 'Customization',
          collapsed: true,
          items: [
            'bmad-core-concepts/bmad-customization/index',
            'bmad-core-concepts/bmad-customization/agents',
            'bmad-core-concepts/bmad-customization/workflows',
          ],
        },
        'bmad-core-concepts/web-bundles/index',
      ],
    },
    {
      type: 'category',
      label: 'BMM - Method',
      items: [
        'modules/bmm-bmad-method/index',
        'modules/bmm-bmad-method/quick-start',
        {
          type: 'category',
          label: 'Quick Flows',
          collapsed: true,
          items: [
            'modules/bmm-bmad-method/bmad-quick-flow',
            'modules/bmm-bmad-method/quick-flow-solo-dev',
            'modules/bmm-bmad-method/quick-spec-flow',
          ],
        },
        {
          type: 'category',
          label: 'Workflows',
          collapsed: true,
          items: [
            'modules/bmm-bmad-method/workflows-planning',
            'modules/bmm-bmad-method/workflows-solutioning',
            'modules/bmm-bmad-method/workflows-analysis',
            'modules/bmm-bmad-method/workflows-implementation',
          ],
        },
        {
          type: 'category',
          label: 'Advanced Topics',
          collapsed: true,
          items: [
            'modules/bmm-bmad-method/party-mode',
            'modules/bmm-bmad-method/agents-guide',
            'modules/bmm-bmad-method/brownfield-guide',
            'modules/bmm-bmad-method/test-architecture',
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          collapsed: true,
          items: [
            'modules/bmm-bmad-method/workflow-document-project-reference',
            'modules/bmm-bmad-method/troubleshooting',
            'modules/bmm-bmad-method/faq',
            'modules/bmm-bmad-method/glossary',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'BMB - Builder',
      collapsed: true,
      items: [
        'modules/bmb-bmad-builder/index',
        'modules/bmb-bmad-builder/agent-creation-guide',
        'modules/bmb-bmad-builder/workflow-vendoring-customization-inheritance',
        'modules/bmb-bmad-builder/custom-content',
        'modules/bmb-bmad-builder/custom-content-installation',
      ],
    },
    {
      type: 'category',
      label: 'BMGD - Game Dev',
      collapsed: true,
      items: [
        'modules/bmgd-bmad-game-dev/index',
        'modules/bmgd-bmad-game-dev/quick-start',
        'modules/bmgd-bmad-game-dev/quick-flow-guide',
        'modules/bmgd-bmad-game-dev/agents-guide',
        'modules/bmgd-bmad-game-dev/workflows-guide',
        'modules/bmgd-bmad-game-dev/game-types-guide',
        'modules/bmgd-bmad-game-dev/troubleshooting',
        'modules/bmgd-bmad-game-dev/glossary',
      ],
    },
    {
      type: 'category',
      label: 'CIS - Creative Intelligence',
      collapsed: true,
      items: ['modules/cis-creative-intelligence-suite/index'],
    },
    {
      type: 'category',
      label: 'Core Module',
      collapsed: true,
      items: [
        'modules/core/index',
        'modules/core/party-mode',
        'modules/core/core-tasks',
        'modules/core/core-workflows',
        'modules/core/advanced-elicitation',
        'modules/core/brainstorming',
        'modules/core/document-sharding-guide',
        'modules/core/global-core-config',
      ],
    },
  ],
};

export default sidebars;
