# Step 2: Select Stack

## RULES

- Pick from the discovered template manifests — do not design a stack from scratch. Constraining the menu is the point: it is what makes the scaffold reliable.
- Recommend exactly one template with a one-sentence reason. The user can switch; you do not present a neutral survey.
- The approval checkpoint at the end of this step is mandatory. NEVER scaffold without it.

## INSTRUCTIONS

1. **Discover templates.** For each directory in `{workflow.template_paths}`, in order, list its `*.md` files and read each file's frontmatter (`id`, `label`, `stack`, `best_for`, `requires`, `scaffold`, `verify_build`, `verify_dev`, `verify_url`). Skip files without an `id`, warning once. On duplicate `id`, the later source wins — replace the earlier entry and note the override to the user. A missing directory is not an error; if NO manifests are found anywhere, report the paths scanned and HALT.
2. Match the intent from step 1 against each manifest's `best_for` and `stack`. Select the best fit as your recommendation. Do not load manifest bodies yet — frontmatter is enough to choose; the body is the playbook for steps 3 and 4.
3. Present a compact menu: your recommendation first with the reason, then the other discovered templates as one line each (`label` — `best_for`), then always these two escape hatches:
   - `[C] Custom template` — scaffold from any public git repository URL the user supplies. If that repo ships a `bmad-template.md` manifest at its root, ignite follows it like a built-in; otherwise the repo is cloned as a bare starting point.
   - `[M] Manual` — skip scaffolding entirely; route to the standard planning track (`bmad-prd`) and end this workflow.

   HALT and wait for the user's choice.
4. If the user picks `[C]`, capture the URL and build a provisional entry: `scaffold` = `git clone --depth 1 <url> {target}`, `requires` = `["git"]`, everything else empty until step 3 looks for `bmad-template.md` inside the clone. Say plainly that env wiring and verification will come from that manifest if present, else be discovered from the repo's own README and manifests.
5. If the user picks `[M]`, tell them to invoke `bmad-prd` (or `bmad-product-brief` first if the concept needs shaping) and HALT — the workflow ends here.
6. Read the chosen template's full manifest body now — `## Environment`, `## Bootstrap`, and `## Agent Notes` are instructions to you for steps 3 and 4 (skip for `[C]` until the clone lands).
7. Decide placement with the user:
   - **Project root** (default) — the app lives at `{project-root}`, alongside `_bmad/`.
   - **Subdirectory** — the app lives at `{project-root}/<name>`; use when the root has conflicting files or the user prefers separation.
8. Present the **ignition proposal** and HALT for approval:
   - **Building**: the restated intent from step 1.
   - **Stack**: the chosen template's `label` and `stack`.
   - **You get**: a scaffolded repo at the chosen location, dependencies installed, an initial git commit, env placeholders documented, and a build/boot verification.
   - **Out of scope**: product features, UX, data models — those belong to the planning track this hands off to.
   - **Needs from you later**: summarize the manifest's `## Environment` section (accounts or credentials the user must create).
   Ask: `[Y] Scaffold it` | `[S] Switch template` | `[X] Cancel`. On `[S]`, loop within this step. On `[X]`, HALT and end the workflow.

## NEXT

Read fully and follow `./step-03-scaffold.md`
