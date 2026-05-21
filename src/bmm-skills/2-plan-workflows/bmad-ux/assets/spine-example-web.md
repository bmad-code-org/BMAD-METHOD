---
name: Pulse
status: final
sources:
  - ../prds/pulse-2025-10-04/prd.md
  - ../research/pulse-customer-interviews-2025-09.md
updated: 2025-10-21
---

# Pulse — Design Spine

> Illustrative example. Multi-surface (responsive web admin + native mobile employee app). B2B utility posture. Demonstrates: Responsive & Platform as a required-when-applicable section, keyboard-first Interaction Primitives, anonymity rules as Component Pattern invariants.

## Foundation

Web: React + Tailwind. Mobile: React Native. Tokens defined in this spine; dev mirrors them into a shared theme module both surfaces import. Single-tenant; users belong to one team, SSO via the customer's IdP, no self-serve signup.

## Information Architecture

### Web admin
| Surface | Reached from | Purpose |
|---|---|---|
| Dashboard | Login | Today's response summary, last-7-day trends |
| Question library | Sidebar | Manage rotation of daily prompts |
| Team | Sidebar | Members, roles, removal |
| Settings | User menu | Tenant config, billing, SSO |

### Mobile employee
| Surface | Reached from | Purpose |
|---|---|---|
| Today | App open / push notification | Daily prompt + 1-tap answer |
| History | Tab bar | Own past answers |
| Settings | History header | Account, notifications, sign out |

→ Composition reference: `mockups/dashboard.html`, `mockups/mobile-today.html`. Spine wins on conflict.

## Voice and Tone

| Do | Don't |
|---|---|
| "How's today going?" (employee) | "Time for your daily check-in!" |
| "Thanks — see you tomorrow." | "Submission received." |
| Manager-facing: data words. "23 of 28 responded." | "Great engagement today!" |
| Employee-facing: human words. | Corporate-speak, gamification. |

## Design Tokens

This table is the spec. Dev mirrors values into the shared theme module; the spine wins on any conflict.

| Token | Role | Value (light / dark) |
|---|---|---|
| `surface/base` | Page background | `#FFFFFF` / `#0F1115` |
| `surface/raised` | Cards, panels | `#F7F8FA` / `#191C22` |
| `surface/sunken` | Insets, wells | `#EDEFF3` / `#0A0C10` |
| `ink/primary` | Body text | `#0F1115` / `#F2F4F7` |
| `ink/secondary` | Metadata, helper text | `#5B616B` / `#A0A6B0` |
| `ink/inverse` | Text on accent fills | `#FFFFFF` / `#0F1115` |
| `accent` | Submit / save / primary CTA | `#2D5BFF` / `#7B9AFF` |
| `state/positive` | Sentiment chip — positive | `#0E8556` / `#3DBC8E` |
| `state/caution` | Sentiment chip — caution | `#A86E00` / `#E5A547` |
| `state/negative` | Sentiment chip — negative | `#C03028` / `#F77268` |
| `border/hairline` | Dividers | `#E1E4EA` / `#262A33` |
| `border/strong` | Focused inputs | `#9DA3AE` / `#4A5160` |
| `space/1..8` | Spacing scale (pixels) | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 |
| `radius/sm`, `radius/md`, `radius/lg` | Corners (pixels) | 4, 8, 12 |
| `type/display` | Hero / page title | Web: 32px / 1.2 / 600 weight |
| `type/title` | Section heading | Web: 20px / 1.3 / 600 weight |
| `type/body` | Body text | Web: 16px / 1.5 / 400 weight · Mobile: native Body *(platform convention)* |
| `type/meta` | Captions, timestamps | Web: 13px / 1.4 / 400 weight · Mobile: native Caption *(platform convention)* |

Contrast: all text ≥ 4.5:1 in both modes. Sentiment chips ≥ 3:1 against `surface/raised`. Focus rings ≥ 3:1 against adjacent.

## Component Patterns

| Component | Use | Rules |
|---|---|---|
| Sentiment chip | Dashboard, history | Color from `state/*`. Always paired with the word ("Positive 18") — never icon-only. |
| Question card | Question library | Editable inline. Save on blur. Schedule chip next to title. |
| Response cell | Dashboard grid | Anonymous unless team < 5 (then named — hard rule, never a setting). Truncate at 2 lines, expand on tap. |
| 1-tap answer button | Mobile Today | Three stacked, full-width. Each ≥ 56dp tall. Selected state uses `accent` fill. |
| Empty state | Anywhere | One sentence, one action. No illustrations in v1. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold dashboard load | Web | Skeleton rows (3 weeks). |
| No responses yet today | Dashboard | `0 of N responded. Window closes 6pm.` |
| Team < 5 members | Dashboard | Anonymity banner: `Names shown — team too small to anonymize.` |
| Offline answer | Mobile Today | Save locally. Submit on next online. Header pill: `Will send when online.` |
| SSO error | Web login | Surface vendor message verbatim + `Contact your admin.` |
| Permission denied | Question library | Hide the surface from non-admins; don't show a blocked screen. |
| Notification disabled | Mobile Today | Header banner once: `Daily reminder is off — turn on.` |

## Interaction Primitives

**Web:** click + full keyboard. `Tab` traverses in reading order; `Enter` submits; `Esc` cancels editors; `/` focuses dashboard search; `?` opens shortcuts.

**Mobile:** tap. System swipe gestures only. No long-press except text selection.

**Banned everywhere:** drag-to-reorder in v1, hover-only affordances, modal stacks > 1 level deep.

## Accessibility Floor

- WCAG 2.2 AA across both surfaces.
- Web focus rings ≥ 2px, contrast ≥ 3:1 against adjacent.
- Screen reader announces dashboard summary on load: "23 of 28 responded today, 4 outstanding."
- Mobile VoiceOver labels for each answer button include the question text.
- No information conveyed by color alone — sentiment chips carry the word.
- Submission-window time is announced on entry to Today, not as a live countdown.

## Responsive & Platform

| Breakpoint / Platform | Behavior |
|---|---|
| Web ≥ 1280px | Sidebar nav visible; dashboard grid 4 columns. |
| Web 768–1279px | Sidebar collapses to icons; grid 2 columns. |
| Web < 768px | Hamburger nav; grid stacks to 1 column. *Web admin is not designed for phone use; warn on first sub-768 visit.* |
| Mobile native (iOS / Android) | Full feature parity with each other. Token names identical, mapped to platform-native dynamic sizing. |
| Cross-platform parity | Employee surfaces never appear on web. Admin surfaces never appear in the mobile app. |

## Inspiration & Anti-patterns

- **Lifted from Linear:** keyboard-first web admin posture. `/` focuses search, `?` opens shortcuts, no drag for primary nav.
- **Lifted from Officevibe:** the anonymity threshold (< 5 = named) as a hard rule, not a setting. Anonymity claims have to be defensible.
- **Rejected — Slackbot-style threaded questions:** the daily check-in is *one tap*; it isn't a conversation. Long-form follow-ups belong in 1:1s.
- **Rejected — Manager "please respond" nudges:** managers cannot ping non-respondents. Response rate is a culture problem, not a UI problem.

## Key Flows

### Flow 1 — Manager checks today (web)

1. Manager opens dashboard.
2. Skeleton resolves; top row shows today's response count + sentiment mix.
3. Manager scans cells; clicks a low-sentiment one to expand.
4. Expanded view shows verbatim response (or "Anonymous" if team ≥ 5).
5. **Climax:** Manager sees a verbatim line of text from someone on the team — actual signal, no drill, no filter, no query composition.

Failure: data fetch fails → top row stays as skeleton + `Couldn't load today. Retry.` Other surfaces unaffected.

### Flow 2 — Employee answers (mobile)

1. Push notification at 9am: "How's today going?"
2. Tap opens app directly on Today.
3. Three answer buttons visible.
4. Tap one.
5. **Climax:** Button fills with `accent`; screen swaps to `Thanks — see you tomorrow.` in < 200ms. No second screen, no follow-up question, no extra fields.

Failure: offline → answer saves locally, header pill `Will send when online.` Re-confirm thanks message on submit success.
