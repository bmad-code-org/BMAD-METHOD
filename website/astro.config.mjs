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
  redirects: {
    '/how-to/install-bmad': `${basePath}start/install-bmad/`,
    '/how-to/non-interactive-installation': `${basePath}start/install-bmad/`,
    '/tutorials/getting-started': `${basePath}start/build-your-first-change/`,
    '/how-to/quick-fixes': `${basePath}build/build-a-change/`,
    '/explanation/build': `${basePath}build/build-a-change/`,
    '/explanation/checkpoint-preview': `${basePath}build/walk-through-a-change/`,
    '/build/review-a-completed-change': `${basePath}build/walk-through-a-change/`,
    '/build/checkpoint-a-change': `${basePath}build/walk-through-a-change/`,
    '/fr/explanation/checkpoint-preview': `${basePath}fr/build/walk-through-a-change/`,
    '/vi-vn/explanation/checkpoint-preview': `${basePath}vi-vn/build/walk-through-a-change/`,
    '/zh-cn/explanation/checkpoint-preview': `${basePath}zh-cn/build/walk-through-a-change/`,
    '/explanation/adversarial-review': `${basePath}build/review-a-change/`,
    '/fr/explanation/adversarial-review': `${basePath}build/review-a-change/`,
    '/cs/explanation/adversarial-review': `${basePath}build/review-a-change/`,
    '/vi-vn/explanation/adversarial-review': `${basePath}build/review-a-change/`,
    '/zh-cn/explanation/adversarial-review': `${basePath}build/review-a-change/`,
    '/reference/testing': `${basePath}build/test-completed-work/`,
    '/how-to/choose-a-development-path': `${basePath}plan/choose-a-planning-path/`,
    '/explanation/analysis-phase': `${basePath}plan/explore-and-validate-an-idea/`,
    '/explanation/brainstorming': `${basePath}plan/explore-and-validate-an-idea/`,
    '/explanation/forge-idea': `${basePath}plan/explore-and-validate-an-idea/`,
    '/how-to/pressure-test-an-idea': `${basePath}plan/explore-and-validate-an-idea/`,
    '/explanation/deep-recon': `${basePath}plan/research-a-decision/`,
    '/explanation/why-solutioning-matters': `${basePath}plan/design-ux-and-architecture/`,
    '/explanation/preventing-agent-conflicts': `${basePath}plan/design-ux-and-architecture/`,
    '/explanation/sprint-planning': `${basePath}plan/break-work-into-stories-and-track-it/`,
    '/explanation/retrospective': `${basePath}plan/finish-an-epic/`,
    '/fr/how-to/non-interactive-installation': `${basePath}fr/how-to/install-bmad/`,
    '/cs/how-to/non-interactive-installation': `${basePath}cs/how-to/install-bmad/`,
    '/ko-kr/how-to/non-interactive-installation': `${basePath}ko-kr/how-to/install-bmad/`,
    '/vi-vn/how-to/non-interactive-installation': `${basePath}vi-vn/how-to/install-bmad/`,
    '/zh-cn/how-to/non-interactive-installation': `${basePath}zh-cn/how-to/install-bmad/`,
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

      // Custom CSS
      customCss: ['./src/styles/custom.css'],

      // Sidebar configuration
      sidebar: [
        {
          label: 'Start',
          translations: { 'ko-KR': '시작하기', 'vi-VN': 'Bắt đầu', 'zh-CN': '开始', 'fr-FR': 'Démarrer', 'cs-CZ': 'Začít' },
          collapsed: false,
          items: [
            {
              label: 'Welcome',
              translations: { 'ko-KR': '환영합니다', 'vi-VN': 'Chào mừng', 'zh-CN': '欢迎', 'fr-FR': 'Bienvenue', 'cs-CZ': 'Vítejte' },
              slug: 'index',
            },
            {
              label: 'Install BMad',
              translations: {
                'ko-KR': 'BMad 설치',
                'vi-VN': 'Cách cài đặt BMad',
                'zh-CN': '如何安装 BMad',
                'fr-FR': 'Comment installer BMad',
                'cs-CZ': 'Jak nainstalovat BMad',
              },
              slug: 'start/install-bmad',
            },
            {
              label: 'Build Your First Change',
              translations: {
                'ko-KR': '첫 번째 변경 사항 구현하기',
                'vi-VN': 'Bắt đầu',
                'zh-CN': '快速入门',
                'fr-FR': 'Premiers pas',
                'cs-CZ': 'Začínáme',
              },
              slug: 'start/build-your-first-change',
            },
          ],
        },
        {
          label: 'Build',
          translations: { 'ko-KR': 'Build', 'vi-VN': 'Xây dựng', 'zh-CN': '构建', 'fr-FR': 'Construire', 'cs-CZ': 'Sestavit' },
          collapsed: false,
          items: [
            {
              label: 'Build a Change',
              translations: {
                'ko-KR': '변경 사항 구현하기',
                'vi-VN': 'Xây dựng một thay đổi',
                'zh-CN': '构建一个变更',
                'fr-FR': 'Construire un changement',
                'cs-CZ': 'Sestavit změnu',
              },
              slug: 'build/build-a-change',
            },
            {
              label: 'Review a Change',
              translations: {
                'vi-VN': 'Rà soát một thay đổi',
                'zh-CN': '审查一个变更',
                'fr-FR': 'Examiner un changement',
                'cs-CZ': 'Zkontrolovat změnu',
              },
              slug: 'build/review-a-change',
            },
            {
              label: 'Walk Through a Change',
              translations: {
                'ko-KR': '변경 사항 살펴보기',
                'vi-VN': 'Đi qua một thay đổi',
                'zh-CN': '走查一个变更',
                'fr-FR': 'Parcourir un changement',
                'cs-CZ': 'Projít změnu',
              },
              slug: 'build/walk-through-a-change',
            },
            {
              label: 'Test Completed Work',
              translations: {
                'ko-KR': '완료된 작업 테스트하기',
                'vi-VN': 'Kiểm thử công việc đã xong',
                'zh-CN': '测试已完成的工作',
                'fr-FR': 'Tester le travail terminé',
                'cs-CZ': 'Otestovat dokončenou práci',
              },
              slug: 'build/test-completed-work',
            },
          ],
        },
        {
          label: 'Plan Larger Work',
          translations: {
            'vi-VN': 'Lập kế hoạch công việc lớn',
            'zh-CN': '规划更大的工作',
            'fr-FR': 'Planifier un travail plus vaste',
            'cs-CZ': 'Plánovat větší práci',
          },
          collapsed: false,
          items: [
            {
              label: 'Choose a Planning Path',
              translations: {
                'vi-VN': 'Chọn lộ trình lập kế hoạch',
                'zh-CN': '选择规划路径',
                'fr-FR': 'Choisir un parcours de planification',
                'cs-CZ': 'Zvolit cestu plánování',
              },
              slug: 'plan/choose-a-planning-path',
            },
            {
              label: 'Plan Inside an Organization',
              translations: {
                'vi-VN': 'Lập kế hoạch trong một tổ chức',
                'zh-CN': '在组织内进行规划',
                'fr-FR': 'Planifier au sein d’une organisation',
                'cs-CZ': 'Plánování uvnitř organizace',
              },
              slug: 'plan/plan-inside-an-organization',
            },
            {
              label: 'Explore and Validate an Idea',
              translations: {
                'vi-VN': 'Khám phá và kiểm chứng ý tưởng',
                'zh-CN': '探索并验证想法',
                'fr-FR': 'Explorer et valider une idée',
                'cs-CZ': 'Prozkoumat a ověřit nápad',
              },
              slug: 'plan/explore-and-validate-an-idea',
            },
            {
              label: 'Research a Decision',
              translations: {
                'vi-VN': 'Nghiên cứu cho một quyết định',
                'zh-CN': '为决策做研究',
                'fr-FR': 'Rechercher pour une décision',
                'cs-CZ': 'Prozkoumat rozhodnutí',
              },
              slug: 'plan/research-a-decision',
            },
            {
              label: 'Define Requirements and a Specification',
              translations: {
                'vi-VN': 'Xác định yêu cầu và đặc tả',
                'zh-CN': '定义需求与规格',
                'fr-FR': 'Définir les exigences et une spécification',
                'cs-CZ': 'Definovat požadavky a specifikaci',
              },
              slug: 'plan/define-requirements-and-a-specification',
            },
            {
              label: 'Design UX and Architecture',
              translations: {
                'vi-VN': 'Thiết kế UX và kiến trúc',
                'zh-CN': '设计 UX 与架构',
                'fr-FR': "Concevoir l'UX et l'architecture",
                'cs-CZ': 'Navrhnout UX a architekturu',
              },
              slug: 'plan/design-ux-and-architecture',
            },
            {
              label: 'Break Work into Stories and Track It',
              translations: {
                'vi-VN': 'Chia công việc thành story và theo dõi',
                'zh-CN': '拆分为故事并跟踪',
                'fr-FR': 'Découper le travail en stories et le suivre',
                'cs-CZ': 'Rozdělit práci na story a sledovat ji',
              },
              slug: 'plan/break-work-into-stories-and-track-it',
            },
            {
              label: 'Finish an Epic',
              translations: {
                'vi-VN': 'Hoàn tất một epic',
                'zh-CN': '完成一个 Epic',
                'fr-FR': 'Terminer un epic',
                'cs-CZ': 'Dokončit epic',
              },
              slug: 'plan/finish-an-epic',
            },
          ],
        },
        {
          label: 'Tutorials',
          translations: { 'ko-KR': '튜토리얼', 'vi-VN': 'Hướng dẫn nhập môn', 'zh-CN': '教程', 'fr-FR': 'Tutoriels', 'cs-CZ': 'Tutoriály' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'tutorials' } }],
        },
        {
          label: 'How-To Guides',
          translations: {
            'ko-KR': '사용 가이드',
            'vi-VN': 'Hướng dẫn tác vụ',
            'zh-CN': '操作指南',
            'fr-FR': 'Guides pratiques',
            'cs-CZ': 'Praktické návody',
          },
          collapsed: true,
          items: [{ autogenerate: { directory: 'how-to' } }],
        },
        {
          label: 'Explanation',
          translations: {
            'ko-KR': '개념 설명',
            'vi-VN': 'Giải thích',
            'zh-CN': '概念说明',
            'fr-FR': 'Explications',
            'cs-CZ': 'Vysvětlení',
          },
          collapsed: true,
          items: [{ autogenerate: { directory: 'explanation' } }],
        },
        {
          label: 'Reference',
          translations: { 'ko-KR': '참조', 'vi-VN': 'Tham chiếu', 'zh-CN': '参考', 'fr-FR': 'Référence', 'cs-CZ': 'Reference' },
          collapsed: true,
          items: [{ autogenerate: { directory: 'reference' } }],
        },
        // TEA docs moved to standalone module site; keep BMM sidebar focused.
        {
          label: 'BMad Ecosystem',
          translations: {
            'ko-KR': 'BMad 생태계',
            'vi-VN': 'Hệ sinh thái BMad',
            'zh-CN': 'BMad 生态系统',
            'fr-FR': 'Écosystème BMad',
            'cs-CZ': 'Ekosystém BMad',
          },
          collapsed: false,
          items: [
            {
              label: 'BMad Builder',
              translations: {
                'ko-KR': 'BMad Builder',
                'vi-VN': 'BMad Builder',
                'zh-CN': 'BMad 构建器',
                'fr-FR': 'BMad Builder',
                'cs-CZ': 'BMad Builder',
              },
              link: 'https://bmad-builder-docs.bmad-method.org/',
              attrs: { target: '_blank' },
            },
            {
              label: 'Creative Intelligence Suite',
              translations: {
                'ko-KR': '창의적 지능 제품군',
                'vi-VN': 'Bộ công cụ Trí tuệ Sáng tạo',
                'zh-CN': '创意智能套件',
                'fr-FR': "Suite d'Intelligence Créative",
                'cs-CZ': 'Sada kreativní inteligence',
              },
              link: 'https://cis-docs.bmad-method.org/',
              attrs: { target: '_blank' },
            },
            {
              label: 'Game Dev Studio',
              translations: {
                'ko-KR': '게임 개발 스튜디오',
                'vi-VN': 'Xưởng phát triển Game',
                'zh-CN': '游戏开发工作室',
                'fr-FR': 'Studio de Développement de Jeux',
                'cs-CZ': 'Herní vývojové studio',
              },
              link: 'https://game-dev-studio-docs.bmad-method.org/',
              attrs: { target: '_blank' },
            },
            {
              label: 'Test Architect (TEA)',
              translations: {
                'ko-KR': '테스트 설계자(TEA)',
                'vi-VN': 'Kiến trúc sư Kiểm thử (TEA)',
                'zh-CN': '测试架构师 (TEA)',
                'fr-FR': 'Architecte de Tests (TEA)',
                'cs-CZ': 'Testovací architekt (TEA)',
              },
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
      },

      // Table of contents
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    }),
  ],
});
