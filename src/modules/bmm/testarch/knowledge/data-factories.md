# Data Factories and API-First Setup

- Prefer factory functions that accept overrides and return complete objects (`createUser(overrides)`)—never rely on static fixtures.
- Seed state through APIs, tasks, or direct DB helpers before visiting the UI; UI-based setup is for validation only.
- Ensure factories generate parallel-safe identifiers (UUIDs, timestamps) and perform cleanup after each test.
- Centralize factory exports to avoid duplication; version them alongside schema changes to catch drift in reviews.
- When working with shared environments, layer feature toggles or targeted cleanup so factories do not clobber concurrent runs.

_Source: Murat Testing Philosophy, blog posts on functional helpers and API-first testing._
