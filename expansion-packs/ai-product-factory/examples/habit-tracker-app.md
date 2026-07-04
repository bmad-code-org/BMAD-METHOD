# Example: Habit Tracker Mobile App

End-to-end example of AI Product Factory in action.

## Input

> "I want to build a habit tracker app for iOS. Simple, beautiful, with streaks and reminders."

## Phase 1: Founder Layer

**Idea Validation** → GO (high problem severity, crowded but differentiated by design)

**Market Research** → $4.5B habit tracking market, growing 12% YoY

**Competitors** → Streaks, Habitica, Done — gap in minimalist design + AI coaching

**Persona** → "Alex, 28, productivity enthusiast, uses Notion + Apple Watch"

**Lean Canvas** → Freemium model, 3 habits free, unlimited + AI coach at $4.99/mo

**Pricing** → Free tier + Pro ($4.99/mo) + Annual ($39.99/yr)

## Phase 2: Product

**PRD** → 15 FRs, 5 NFRs, 3 user journeys

**MVP Features** → Create habit, daily check-in, streak counter, push reminders

**Deferred** → AI coach, social features, Apple Watch app, widgets

## Phase 3: UX & Design

**User Flows** → Onboarding (3 screens), daily check-in (1 tap), habit creation

**Design System** → Minimal, dark-first, SF Pro, green accent for streaks

## Phase 4: Engineering

**Stack** → SwiftUI + SwiftData + CloudKit + RevenueCat

**Build** → 2-week MVP via Cursor

## Phase 5: Launch

**Deploy** → TestFlight → App Store

**Landing** → habittracker.app with waitlist → launch page

**Product Hunt** → #3 Product of the Day

## Artifacts Produced

```
{apf_artifacts}/
  founder/
    idea-validation-report.md
    lean-canvas.md
    pricing-strategy.md
  product/
    prd.md
    mvp-features.md
  ux/
    user-flows.md
  design/
    design-system.md
  engineering/
    tech-stack.md
  deployment/
    deploy-report.md
  marketing/
    landing-copy.md
```

## How to Reproduce

```
> use the bmad-apf-launch-startup skill
> Idea: Habit tracker app for iOS with streaks and reminders
> Product type: mobile-app
> Platform: swiftui
```
