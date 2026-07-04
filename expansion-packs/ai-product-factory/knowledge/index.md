# Knowledge Base Index — AI Product Factory

Domain-specific knowledge references for APF agents. Agents load relevant files via `file:` references in `persistent_facts`.

## Design & UX

| File | Used By | Description |
|---|---|---|
| `apple-hig-summary.md` | UX, Design, SwiftUI agents | Apple Human Interface Guidelines essentials |
| `material-design-summary.md` | UX, Design, Flutter/RN agents | Material Design 3 essentials |
| `accessibility-wcag.md` | Accessibility agent | WCAG 2.1 AA checklist |

## Engineering

| File | Used By | Description |
|---|---|---|
| `tech-stack-decision-matrix.md` | Architecture agent | Stack selection guide |
| `backend-patterns.md` | Backend agent | API design, clean architecture |
| `flutter-best-practices.md` | Flutter agent | Flutter project conventions |
| `swiftui-best-practices.md` | SwiftUI agent | SwiftUI patterns |
| `supabase-guide.md` | Backend, Auth, Database | Supabase integration patterns |
| `firebase-guide.md` | Backend, Auth | Firebase integration patterns |

## Deployment

| File | Used By | Description |
|---|---|---|
| `fastlane-guide.md` | Fastlane, Apple, Google Play | Mobile release automation |
| `github-actions-guide.md` | CI/CD agent | CI/CD pipeline patterns |
| `app-store-review-guidelines.md` | Apple Deployment | App Store submission rules |
| `google-play-policies.md` | Google Play agent | Play Store policies |

## Business & Growth

| File | Used By | Description |
|---|---|---|
| `yc-startup-playbook.md` | Founder layer | YC startup principles |
| `lean-startup.md` | Business Model agent | Lean Startup methodology |
| `revenuecat-guide.md` | Payments agent | Subscription management |
| `posthog-guide.md` | Analytics agents | Product analytics setup |

## Orchestration

| File | Used By | Description |
|---|---|---|
| `product-pipeline.md` | All workflows | Master pipeline definition |
| `handoff-rules.md` | All agents | Agent handoff protocol |

## Adding Knowledge

Place new knowledge files in this directory. Reference them from agent `persistent_facts` or workflow `activation_steps_prepend` using:

```toml
"file:{project-root}/expansion-packs/ai-product-factory/knowledge/your-file.md"
```
