---
name: bmad-advanced-elicitation
description: 'Pushes a draft off its first answer with critique methods and proposes one revision. Use when the user or another skill names bmad-advanced-elicitation, or the user says "advanced elicitation". Not for a critique or a named method such as pre-mortem without that name.'
---

# Advanced Elicitation

A first draft is the most likely draft: centered, agreeable with its own prompt, biased toward adding and toward the first idea. You push it off center in chosen directions through cold readers, and propose a revision the user accepts or rejects. The target is a piece of work in the conversation, whoever wrote it. Work in the surrounding session's language.

## Setup

- Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow`; `{workflow.<key>}` below is that table. Script not found means BMad is not set up here: offer the `bmad` skill's setup (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad` first if needed), then run it again. Run `{workflow.activation_steps_prepend}` before anything else and `{workflow.activation_steps_append}` after setup. Read `{workflow.persistent_facts}`: `file:` entries are paths or globs under `{project-root}` to load, the rest are facts as written.
- Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative`. The session folder is `{workflow.output_dir}/{workflow.output_folder_name}/`, `/{active_initiative}` dropped when unset, `{topic_slug}` a kebab-case name for the target. When the folder already exists, continue the round numbering from the files there and append to its report.
- Catalog calls are `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow | uv run {skill-root}/scripts/pick_methods.py --customization - --project-root {project-root} <command>`. `list --tier core` is the index, `show <name-or-num>` the row with its form line; a method outside the index still resolves by name through `show`, and `list --all` runs only when the user asks to see everything.

## The Target and the Start

The target is what the user or calling skill points at, at whatever size they name. With no pointer, it is what the last exchange was about, at its own size: the answer, choice or change you just gave, or the one the user just made. A one-line suggestion is a one-line target, not the plan or document around it; the rest of the context informs the pushes but is not pushed. A target that exists only in chat is staged to `target.md` in the session folder; a file target is used in place.

Choose the pushes and start them without waiting:

- Methods named in the call run as named, and a named direction gets its best-fitting method from `list`; say in one line if one is an odd fit for the target, then run it anyway. A call that asks for a surprise draws with `random --tier core --spread`.
- Otherwise `{workflow.default_methods}` run when set. When it is empty, run three pushes, each method from a different direction: the method from `list` that best fits where the target is probably weak, a wildcard from any tier (`list --tier more` adds the rest) chosen as the method whose answer is hardest to predict for this target, and a third push. For a single choice or a target of a few lines, the third is an open push, which asks to push harder and consider alternatives with no method; for a section or document, it is a second method against another weak spot.

One message names the target by path or phrase, says in a line or two where it is probably weak, names each method with its reason, and the round starts. Stop to ask first only when there is no clear target.

## The Brief

Each push gets a brief of exactly these parts and nothing of the conversation beyond them; a calling skill passes them when it invokes you, so use them without re-asking. The author holds every reason for every choice and cannot critique them cold; what a cold reader is not told cannot anchor it.

1. The target: its path, the section if partial, and that its structure (headings, template slots) is a constraint, not content to push. A target of a few lines is quoted in the brief instead.
2. Purpose and consumer, in a line or two.
3. What is settled: the constraints the author worked under, decisions already made, alternatives already rejected, one line each, so the push does not reopen them. Take them from the calling skill's memlog when it keeps one; the memlog itself stays out of the brief.
4. The method: its name, gist and form line from `show`, quoted.
5. The return, sized to the target, a few lines of form and at most five findings for a single choice: the form as the body, then a `## Findings` list, each with location, what is wrong or missing, and the proposed change; only what is specific to this draft, nothing that would be true of any draft of its kind.

Close with: return only that as text, invoke no skill, spawn nothing, edit nothing, read only the files named. A method with several voices (expert panel, stakeholder lens, Delphi) gets one brief per voice so the voices cannot see each other; a voice that should be an installed agent takes its persona from `uv run {project-root}/_bmad/scripts/roster.py --skill {skill-root} --project-root {project-root}`.

## The Round

Run every method push of the round at once, each in its own fresh subagent, all against the same version of the target. An open push is yours: while the readers run, write it from everything the conversation holds, in the same return shape. Save each return as `round-<r>-push-<n>-<method>.md` in the session folder, the open push as `open`.

Without subagents, run at most two pushes yourself, each read fresh from the target file and written in full before you read the other; say so in one line, and offer the brief as a prompt for a fresh session.

## Merge

Compose one proposed revision from the findings. A finding is set aside only on a stated ground and listed in one line so the user can rescue it. A finding that rejects the premise of the target is shown as a decision for the user, not folded into the revision. A push's narrative is color; only its located findings and their changes carry weight. Nothing in the target changes until the user accepts.

## Present and Choose

Append the round as a section of the report, `{workflow.output_folder_name}.md` in the session folder: the revision, the set-aside list, and the push files by name. Then one chat message:

- One line per push: its headline, in the method's voice.
- The revision as a numbered list of changes, each with its location, a short before and after, and the push that drove it. For a staged target, the revised text follows in full, since the user has no file to read it in; for a file target, the full passages go only in the report, named by path.
- Decisions, if any, and the set-aside list.
- The choice: apply all, apply by number, reject, rerun push N with direction, or direction.
- One line for next time: methods can be named in the call, set as defaults with `bmad-customize`, or listed on request.

Under the round in the report, record each change as applied or rejected. Apply by origin: a file target is edited in place and the changed passages shown; a staged target has `target.md` updated and the changed passages shown. Between rounds only the target and the settled list advance: an applied change is settled, a rejected one is a rejected alternative, and the findings themselves stay out of the next briefs so the readers stay cold. Then offer another round on the accepted version, suggesting a direction not yet pushed, or done.

## Done

Done hands the accepted version back in the caller's structure: the file path, or for a staged target its full text, printed here once, and signals completion so a calling skill resumes where it paused. Findings go back only on request. Then run each `{workflow.on_complete}` entry.

Teams change the catalog, facts and output location with the `bmad-customize` skill (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize` if it is not installed).
