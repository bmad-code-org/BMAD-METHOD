# Color Themes Renderer

Subagent prompt. Produce one self-contained interactive HTML artifact at `.working/color-themes-{n}.html` presenting 4–6 genuinely distinct color registers side by side for selection. When an existing company brand kit or `DESIGN.md` is provided, keep its anchor tokens intact and explore variations or extensions around them rather than overriding them.

Each variation includes: name and emotional register, click-to-copy hex swatches mapped to semantic roles (`surface`, `ink`, `primary`, `accent`, `border`), verified WCAG contrast badges, and a realistic mini-UI snippet built with domain content from the conversation (never lorem ipsum). Include an interactive Light / Dark toggle whenever both modes are in scope, avoiding near-identical pastels across cards.

Make the artifact self-contained (zero external network dependencies; document concrete token values cleanly inside CSS custom properties in `<style>` so values lift straight into `DESIGN.md`). When the host harness supports native interactive artifact rendering, present there too while keeping the `.html` file saved.

Return only: file path, one-line summary per theme, and mode coverage. Open interactively via the platform opener (`open "PATH"`, `xdg-open`, or `start ""`).
