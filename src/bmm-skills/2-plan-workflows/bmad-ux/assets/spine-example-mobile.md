---
name: Quill
status: final
sources:
  - ../prds/quill-2025-08-15/prd.md
updated: 2025-09-02
---

# Quill — Design Spine

> Illustrative example. Single-surface mobile (iOS + Android parity). Consumer posture, calm by default. Demonstrates: Voice and Tone as gating discipline, Inspiration & Anti-patterns earning its place, Responsive & Platform omitted (single-surface).

## Foundation

Native UIKit + Swift on iOS; Jetpack Compose on Android. Both follow platform conventions for navigation, system gestures, dynamic type. Brand layer (typography pairing, color palette) sits on top of native components. Dark mode is the default surface; light is a setting.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Today | App open (cold) | Today's prompt + entry composer |
| Library | Tab bar | Past entries, searchable |
| Entry detail | Library row tap | Read / edit one entry |
| Settings | Today header gear | Account, export, theme |

Bottom tab bar (Today / Library / Settings). No drawer. Modal stacks one level deep, never two.

→ Composition reference: `mockups/today-cold.html`, `mockups/composer.html`. Spine wins on conflict.

## Voice and Tone

| Do | Don't |
|---|---|
| "Today's prompt." | "Time to write!" |
| "Saved." | "✓ Auto-saved successfully" |
| "We couldn't reach the cloud — your work is on this device." | "Network error" |
| Short, complete sentences. | Streak counters, encouragement, exclamation marks. |

## Design Tokens

This table is the spec. Dev mirrors values into platform theme modules; the spine wins on any conflict.

| Token | Role | Value (light / dark) |
|---|---|---|
| `surface/base` | Default background | `#FAF9F7` / `#1A1B1F` |
| `surface/raised` | Card / composer background | `#FFFFFF` / `#23252B` |
| `ink/primary` | Body text | `#1A1B1F` / `#F0EDE8` |
| `ink/secondary` | Metadata, timestamps | `#6B655A` / `#A39E94` |
| `ink/disabled` | Inactive controls | `#B5AFA5` / `#5E5A53` |
| `accent` | Save, send, primary action | `#A87434` / `#D4A574` |
| `border/hairline` | List separators | `#E8E4DD` / `#2E3036` |
| `space/1..6` | Spacing scale (pixels) | 4 / 8 / 12 / 16 / 24 / 32 |
| `radius/sm`, `radius/md` | Corners (pixels) | 6, 12 |
| `type/title` | Prompt / section heading | iOS Title 1 · Android Headline Small *(platform convention)* |
| `type/body` | Body text | iOS Body · Android Body Large *(platform convention)* |
| `type/meta` | Timestamps, captions | iOS Footnote · Android Body Small *(platform convention)* |

Contrast: `ink/primary` on `surface/base` ≥ 7:1 in both modes. `accent` on `surface/base` ≥ 4.5:1. Focus indicators ≥ 3:1 against adjacent.

## Component Patterns

| Component | Use | Rules |
|---|---|---|
| Prompt card | Today | One per day. `surface/raised`. Prompt text in `type/title`. Composer entry point below. |
| Composer | Today + entry detail | Full-screen text view. No formatting toolbar in v1. Autosave on pause ≥ 600ms. |
| Entry row | Library list | Date in `type/meta`, first line of body in `type/body` (1 line, truncated). Tap → entry detail. |
| Save indicator | Composer header | Cycles `Editing…` → `Saved.` (≥ 800ms visible). Text only — no icons. |
| Settings row | Settings list | Label left, value or chevron right. Tap → detail or toggle. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold open | Today | Show today's prompt (cached). If no cache, `Today's prompt is loading.` with skeleton. |
| Empty library | Library | `No entries yet — Today's prompt is your first.` Link to Today. |
| Search empty | Library search | `No matches.` No suggestions. |
| Offline write | Composer | Save locally. No banner. Sync on next foreground. |
| Sync error | Settings → Account | Surfaced here only. Never block writing. |
| Focus | Composer | Native cursor + keyboard. No custom focus chrome. |

## Interaction Primitives

- Tap to act. Long-press reserved for system text selection.
- Swipe-to-delete on entry rows (native pattern, confirm sheet).
- Pull-to-refresh on Library only.
- **Banned:** carousels, hero animations on open, badge counts, streaks, push-notification re-engagement.

## Accessibility Floor

- VoiceOver / TalkBack: every interactive element labeled with role + state. Save indicator announces `Saved` on transition.
- Dynamic type honored through `type/*` tokens. UI must remain legible at largest setting — no truncated controls.
- Reduce Motion: skip the save-indicator fade; show `Saved.` immediately.
- Tap targets ≥ 44pt (iOS) / 48dp (Android).
- Focus traversal follows reading order on every surface.

## Inspiration & Anti-patterns

- **Lifted from Day One:** the single daily entry framing — one prompt, one composer, no inbox.
- **Lifted from iA Writer:** the no-toolbar composer; formatting is a settings-level decision, not a per-entry one.
- **Rejected — Streaks (Duolingo, most habit apps):** streaks weaponize the user's calendar. Quill's value is showing up *today*, not punishing missed days.
- **Rejected — AI prompt suggestions inside the composer:** the composer is for writing, not negotiating with a model. AI lives only in the daily prompt generation.

## Key Flows

### Flow 1 — Daily write

1. User opens app.
2. Today surface shows today's prompt (cached if offline).
3. User taps composer entry point.
4. Composer opens, keyboard active.
5. User writes; autosave fires on pause.
6. User taps Back.
7. **Climax:** Today surface shows `Saved.` and the entry's first line below the prompt — proof the day is captured.

Failure: cold prompt fetch fails → composer still opens with cached generic prompt; banner on Today only after user returns.

### Flow 2 — Recall past entry

1. User taps Library.
2. Scrolls or searches.
3. Taps entry row.
4. Entry detail opens in read mode.
5. User taps anywhere to enter edit mode (cursor at tap point).
6. Edits autosave.
7. **Climax:** `Saved.` visible in entry header.

Empty state: no entries → message routes back to Today.
