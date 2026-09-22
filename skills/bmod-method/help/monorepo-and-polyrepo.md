# Monorepo and poly repo

Use this when the user asks where to install BMad and keep planning when the work spans one repository or several.

## Monorepo

Install BMad once at the repository root. `_bmad` and the output folder sit at the root, and one session reaches every package. Planning for any part of the repo goes in the same output folder.

## Poly repo

Work from a workspace folder that holds every project checked out side by side.

- Install BMad at the workspace root, not inside each project. There is one `_bmad` for the whole workspace, and the user starts their AI tool from the workspace root so one session reaches the plan and every project.
- The output folder also sits at the workspace root, outside the individual repositories. All planning goes there, because a brief, a PRD, an architecture, or a spec usually spans several of the projects. The folder is `_bmad-output` by default and can be renamed through the `output_folder` setting.
- Make the output folder its own git repository and commit as planning progresses, so the planning has history apart from any one project. This is recommended for a monorepo too. For what to keep in it over time, see `help/artifact-lifetime.md`.
- For each project, recommend a bare repository with worktrees: one bare clone per project, and a worktree per branch beside it. Several branches of one project can then be open at once, and agents working in parallel do not collide in one checkout.
- A spec or story names the projects it touches. `bmad-build` runs from the workspace root and works in the project, or the worktree, the story belongs to.
- `bmad-project-context` rules belong to each project's own `AGENTS.md`, because each repository has its own conventions. Rules that hold across all of them go in an `AGENTS.md` at the workspace root.

## Coming in v7

A setting will name the active initiative, and all planning and implementation artifacts will be grouped under it. `bmad-preview-ticketing` already works this way (`help/ticketing-setup.md`). Until then the output folder is shared by everything in the workspace, so clear names for spec folders matter. A v6 project moves to that layout with `bmad migrate method`, which asks at plan time whether the store should be its own repository, sit in a workspace, and use worktrees, and makes those repository changes before it moves any artifact.
