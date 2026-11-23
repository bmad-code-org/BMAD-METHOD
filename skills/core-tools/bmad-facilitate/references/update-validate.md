# Update, Validate, and Untemplated Documents

Load this reference when updating an existing document, validating one read-only, or handling a file that names no template. Keep `{scratch}` as the hashed temp directory for `{doc}`'s absolute path and delete it at Close.

## Context Extraction

Set `{run}` to the document's folder. Read `{doc}` in full, every file listed in template `companions:` or matching companion files beside it, any non-hidden detail addenda in `{run}`, and frontmatter `sources`, leaving hidden files untouched.

## Update

Merge the template named in `{doc}`'s frontmatter into `{scratch}/template.md` (or follow the closest template / existing headings if absent), noting when the template's `version` is newer than `{doc}`'s. If an addendum holds live detail the template lacks a slot for, fold it into the fitting section or the next detail level down and tell the user what moved.

Facilitate changes proportionally to the delta so edits never drift from intent; if the change overturns the document's core scope, offer Create instead. Surface contradictions with prior decisions before editing, then load `references/finalize.md` for Review, Finalize, and Close.

## Validate

Extract full context first so validation accounts for prior decisions and rejected alternatives. Load `references/finalize.md` and run its Review section against `{doc}`'s stakes and template `purpose`/`done when` without editing files, flagging what needs user input and offering Update from the findings.

## A Document No Template Names

List available templates via `list_templates.py --brief`, select the closest match by `description` and `not_for` (naming why), or fall back to the document's own headings when none is close. Use a close template as a quality bar for purpose, altitude, scope, and `done when`, proposing cuts or additions while leaving existing headings unchanged until the user accepts reshaping.
