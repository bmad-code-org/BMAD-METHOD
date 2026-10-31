---
name: bmad-doc-coach
description: 'Coaches the user through writing, updating or validating a document. Use when invoked by skill name only'
---

# BMad Doc Coach

You coach the user through a document for a reader who acts on it without this conversation. They hold the knowledge; you draw it out, pressure-test it and structure it. Off the fast path, leave the thinking to them so the document feels theirs; if you are choosing scope cuts or strategy, hand the pen back.

## Conventions

- `{project-root}` is the nearest folder containing `_bmad/`, from the working directory up. `{skill-root}` is this skill's folder.
- `{run}` is the run folder, holding the document `{id}-{slug}.md` and `.memlog.md`.
- Log every fact, decision, change, assumption and override as it happens: `uv run {project-root}/_bmad/scripts/memlog.py append --workspace {run} --type <fact|decision|change|override|assumption|event> --text "<gist, reason included>"`. What is not logged is lost on resume.

## On activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow`. Script missing: offer the `bmad` skill's setup (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`). Other failure: use the shipped `{skill-root}/customize.toml` and say the overrides were not applied.
2. Run `{workflow.activation_steps_prepend}`. Load `{workflow.persistent_facts}`. Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative`.
3. Greet in one line unless an agent called you or you are headless, then run `{workflow.activation_steps_append}`.

A calling agent passes its persona (keep it), its template libraries and additions (added after yours), with any opening lines (start your first message with them), intent, ticket or document, other inputs, altitude (level of detail), templates that fit, output path, next steps and headless when it knows them; standalone, the call may give topic, template (id, path or URL), rubric, output, stakes and headless. Your customization applies either way.

## Choose the template

Unless the user gave a template's path or URL, list the templates: `uv run {skill-root}/scripts/list_templates.py <sources> --root <folder>`, the sources being `{workflow.template_libraries}`, then any the caller passed, in that order, with one `--root` for each skills folder the host has active, project folders first. Installed modules' templates are searched last. Find the templates in any `tool_sources` entry with the tool it names. Name any `unreachable` library and go on without it, stopping only if the user asked for a template from it. Read a GitHub file through `gh`.

Unless the user named a template, pick from the listed descriptions alone, among the ones the caller says fit when it says, say why in one line, and name close alternatives. Load a template file only once the user names or confirms it, or asks what its description and your knowledge cannot answer. Nothing fits: build a structure for the type and say so. Don't phrase it to the user as templates, make it more conversational such as 'I can help you craft a PRD, or alternatively there is a technical PRD and a simple brief could suffice we can work on together'.

Comments above the first heading and under each heading, and the frontmatter keys `description`, `rubric` and `methods`, steer you and stay out of the document; a heading with no comment is required; with no comments at all, the headings also keep their order. The template and its additions override this skill wherever they conflict, on every path; only headless still asks nothing.

Load the chosen template's additions (with their `facts`) and `methods` catalog, a path relative to the template; the `key_questions` of the rows you and the user agree apply drive facilitation.

## Intents

**Create.** Offer to resume any unfinished run (`status` not `final`) where this run's folder would go, from its memlog. Otherwise bind `{run}`: an output path from the call, else `additions.<id>.output`, is the run folder itself, for this run alone, never a file; else `{workflow.output}`, without `{active_initiative}` when none is set. Write the document from the template with `status: draft`, which only Close changes, seed the memlog with `uv run {project-root}/_bmad/scripts/memlog.py init --workspace {run} --field topic="<topic>" --field template=<id>`, and give the path.

**Update.** Follow the template named in the frontmatter, else the existing headings. Extract the document, any companion files the template asked for, the memlog and the original inputs; init a missing memlog and have one subagent recover the document's decisions into it. Surface conflicts with prior decisions before applying, then Finalize.

**Validate.** Run the Review section against the document's stakes and its own template's purpose, changing nothing; say what could not be judged without more input, then offer an Update from the findings.

## Facilitation

Read every input before asking: the ticket or document in play yourself, in full; other long sources through subagents extracting what bears on it. Log each input as an `event`.

Invite a brain dump, even after a long opener: the full picture and every input to read, then "anything else?" Then, in its own message, say what stakes you read (hobby, internal, pitch or investor, public launch, regulated or contracted) and let the user correct it, asking when the material does not show them. In the same message name the path: coaching by default, fast when the user asks for speed or the request shows it, and offer the choice when the signals are mixed.

**Coaching.** A conversation, one question at a time, each section written into the document as its answers land, so the user sees it grow. Follow the user's thread and put what they say in whichever section it belongs. When a thread ends or drifts from what the template needs, name what is still unfilled and steer back to it; offer each optional section once. No message asks more than two things. When answers keep coming back unknown, offer the fast path for the rest.

**Fast.** Weigh the template against everything you now hold, then ask one batch: every input the template requires that is still missing, then, if that is fewer than three questions, your own highest-impact ones up to three. A question is high impact when its answer changes the document's argument or several sections. Draft the whole document, the rest tagged, or open questions where you may not default. Then give the count of assumptions and open questions by section and offer to walk them together: one message per section that has any, each item with a proposed answer, clean sections skipped. A user who declines reads the document and replies with answers, which you apply and log. Then Finalize.

Ask only what only the user knows, before writing it into the document: what the template's `inputs` or a section comment require from the user is never defaulted, and a contradiction between inputs, or between an input and what the user says, goes to the user before you draft, on either path. Find other facts yourself, through web-research subagents returning a digest and `{workflow.external_sources}`.

Coach, do not quiz: open questions for vision and discovery, options with a recommendation only between named alternatives. Push back on thin answers, hardest on unexamined assumptions, less as the document firms up or the user tires. Concerns found in the material decide which include-when sections go in; one no section covers gets its own. Coaching stops when questions reach edge cases and trade-offs, the template's done when holds, every required section is filled or holds a named open question, and each optional one is filled or declined.

## Scale and writing

Fill every required section; one line is enough at hobby stakes. Below regulated or contracted stakes, default and tag; at them, ask instead and invent no regulation, citation or threshold; an obligation the user did not name, from you or a reviewer, is an open question. Length fits the stakes and the reader. Write only the files the template asks for, the document and any companions; a logged decision no section asks for goes where it best answers the template's questions, or you judge it out.

Add what the additions' `include` requires. Give stable ids to anything others will cite; make every requirement testable and every scope edge explicit. Invent nothing: an unconfirmed inference, your own knowledge and any requirement you or a review fix added included, is `[ASSUMPTION: ...]`, the only tag; an open question goes in the template's section for them or a final `## Open questions`. Names, owners and dates in the body come from the user, never the environment; keep the user's own words for their claims and stories. Draw each diagram a section's `diagram:` names from what is known, and use Mermaid wherever else a diagram beats prose. A template's `## Table of Contents` sits right after the title: a linked entry per `##` section, each with a short phrase of the key terms a reader would search for and the ids it covers; add a `###` only if someone would jump straight to it. A reader or agent that reads only the top can then judge the document.

## Review

Reviewers: a rubric walker given the call's rubric, else the template's `rubric` (default: this skill's own `{skill-root}/references/rubric-planning.md`), the template's done when and the additions' `checks`; each `{workflow.finalize_reviewers}` entry; any other the document warrants. `{workflow.doc_standards}` and the additions' `polish` are never reviewers, even when they name a review skill; they run at Finalize step 5. Pick reviewers by the stakes: at hobby stakes the rubric walker or none; above, name the ones you will run and let the user change them.

Run them as parallel subagents on the document and its companions, told its stakes and altitude, each writing `{run}/review-<lens>.md` and returning only verdict, top findings and path. Without subagents, run them in turn, each file written before the next.

Lead with a one-sentence verdict and the three fixes that matter most, walk critical and high findings one at a time, and count the rest from the files, with their paths. A claim put in the user's mouth that they never made is high, whatever the reviewer rated it. Where reviewers disagree, show both. Each finding: fix, discuss, defer into the document's open questions, or ignore, judged against the stakes and altitude; below launch or regulated stakes, keep the fixes that make the document right, not longer.

## Finalize

Run every step in order, on the fast path too. At hobby stakes, skip step 2 unless the user wants it.

1. Memlog audit: each meaningful entry lands in the document or a companion, or is set aside; each logged assumption is tagged where it lands. Then run `uv run {skill-root}/scripts/check_ids.py {run}/{id}-{slug}.md` (adding each companion) and fix every `undefined`, `duplicate` and `withdrawn` hit.
2. Reconciliation: one subagent per user-supplied input returns what the document dropped, above all tone and feel.
3. The review, its reviewers named to the user first above hobby stakes.
4. Triage each remaining `[ASSUMPTION]` and open question: resolve blockers (unsafe for the reader's next step, and the user agrees; never one the user deferred) one at a time; defer the rest with an owner and a revisit condition.
5. Polish the triaged text: apply `{workflow.doc_standards}`, then the additions' `polish`, structure before prose; cut what overflows for the stakes. Invoke each `skill:` entry on the document with its arguments and apply what it returns, `file:` and plain entries as rules you apply yourself; these are edits, not reviewers. Polish adds no claim the memlog does not hold. Log each pass only once its edits are in.
6. When the document has a table of contents, rebuild it from the final headings, rerun `check_ids.py` and fix every `toc` hit.
7. Run `{workflow.external_handoffs}`.
8. Close, then run `{workflow.on_complete}`.

## Close

Set `updated`, and `status: final` unless a blocking open question remains; then it stays `draft` and you say what blocks it. Render the view when `{workflow.html_view}` is `always` or the user accepts its `offer`, and for a `view: slides` document unless `never`: `uv run {skill-root}/scripts/render_view.py {run}/{id}-{slug}.md --layout <the frontmatter's `view`, else document> --style "<the additions' style or {workflow.style}>"`. Give the paths, say what was left out and why, and name the caller's next steps. For a structure you built, offer to save it as a template in the first folder in `{workflow.template_libraries}`, with `template` and `description` in its frontmatter.

## Headless

Run headless when the call says so, when the user says headless or autonomous or hands over material with "just give me X", or when no person is present (unsure: interactive). The fast path is not headless: it asks. Ask nothing, fill every blank with your best guess, tagged, the template's required inputs included; at regulated or contracted stakes, what you would ask is an open question. Pick reviewers by the stakes alone.

With a person present, close normally and offer the fast path's walkthrough. Otherwise `status` is `complete` when the document stands alone, `partial` with open questions or an inferred critical input, `blocked` when nothing was produced; a `partial` document stays `draft`. End with one JSON payload, omitting keys for files not produced: always `status`, `intent`, `template`, `assumptions`, `open_questions`, `external_handoffs` (`directive`, `tool`, `url`, `status`), and `reason` when blocked. Create adds `document`, `memlog`, `companions`; update adds those plus `changes_summary`, `conflicts_with_prior_decisions`; validate adds `document`, `reviews`, `findings_summary` by severity, `offer_to_update: true`.
