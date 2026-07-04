# Mobile App Kit — AI Product Factory

Complete production workflow for mobile app products.

## Included Workflows

| Phase | Skill/Agent | Output |
|---|---|---|
| Validation | `bmad-apf-validate-idea` | Validation report |
| Product | `bmad-apf-generate-prd` | PRD |
| UX | `bmad-apf-generate-ux` | User flows, wireframes |
| Design | `bmad-apf-generate-design-system` | Design system |
| Stack | `bmad-apf-choose-stack` | Tech stack (Flutter/RN/SwiftUI) |
| Architecture | `bmad-create-architecture` | Architecture doc |
| Build | `bmad-apf-build-mvp` | Mobile codebase |
| Auth | `bmad-apf-authentication` | Auth integration |
| Backend | `bmad-apf-backend` | API + Supabase/Firebase |
| Payments | `bmad-apf-payments` | RevenueCat + Stripe |
| Notifications | Platform agent | Push notifications |
| Analytics | `bmad-apf-analytics` | PostHog/Firebase Analytics |
| Testing | `bmad-apf-testing` | Test suite |
| CI/CD | `bmad-apf-cicd` | GitHub Actions |
| Fastlane | `bmad-apf-fastlane` | Release automation |
| iOS Deploy | `bmad-apf-apple-deployment` | TestFlight + App Store |
| Android Deploy | `bmad-apf-google-play` | Play Console |
| Landing | `bmad-apf-generate-landing` | Marketing site |
| ASO | `bmad-apf-aso` | Store optimization |
| Launch | `bmad-apf-launch-startup` | Full orchestration |

## Default Stack

- **Cross-platform:** Flutter + Supabase + RevenueCat + PostHog
- **iOS native:** SwiftUI + Supabase + RevenueCat
- **Cross-platform alt:** React Native + Expo + Supabase

## Launch Checklist

Use: `checklists/launch-checklist.md` + mobile-specific deployment checklist items.

## Getting Started

```
> use the bmad-apf-launch-startup skill
> Product type: mobile-app
> Platform: flutter
```
