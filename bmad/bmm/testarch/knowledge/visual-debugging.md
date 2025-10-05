# Visual Debugging and Developer Ergonomics

- Keep Playwright trace viewer, Cypress runner, and Storybook accessible in CI artifacts to speed up reproduction.
- Record short screen captures only-on-failure; pair them with HAR or console logs to avoid guesswork.
- Document common trace navigation steps (network tab, action timeline) so new contributors diagnose issues quickly.
- Encourage live-debug sessions with component harnesses to validate behaviour before writing full E2E specs.
- Integrate accessibility tooling (axe, Playwright audits) into the same debug workflow to catch regressions early.

_Source: Murat DX blog posts, Playwright book appendix on debugging._
