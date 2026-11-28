# Quote-or-cut weave

The outcome is a finished talk, essay, story draft, or non-video script woven strictly from `{record_folder}/braindumps/<slug>.md` under the Quote-or-Cut contract. This is a strict two-step gated flow: Gate 1 stops for approval on an outline before a single sentence of draft prose is written.

## Before starting

1. Read the chosen `{record_folder}/braindumps/<slug>.md`, plus `{voice_bible}`, `{record_folder}/audience.md`, and `{record_folder}/canon.md` where present.
2. If `{record_folder}/blacklist.md` does not exist yet, seed it verbatim from `assets/blacklist-starter.md`.
3. Note loudly if `{voice_bible}` is missing so the creator knows cadence matching rests on the braindump alone unless they run `VOICE` first.

## Gate 1 — Outline first

1. Propose three distinct hook candidates framed as Target-Transformation-Stakes (who it is for, what changes in them, why it matters now), quoting phrasing from the braindump and pushing past the predictable first answer.
2. Build one cohesive beat outline from hook to payoff. Cite the braindump line or passage behind each beat, mark unsupported beats `GAP` with the exact question to fill them, and attach non-binding visual-moment notes where the braindump named something visual.
3. Run the blacklist check on the outline before showing it:
   `uv run "{skill-root}/scripts/creative_lint.py" lint "<outline-path>" --blacklist "{record_folder}/blacklist.md" --surface spoken`
4. Present the hooks, outline, and any `GAP` questions, then stop and wait for explicit approval. Do not draft prose before the creator approves the outline.

## Step 2 — Quote-or-cut weave

1. Draft beat by beat by lifting verbatim phrasing from the braindump, smoothing lightly only for grammar and rhythm, respecting `keep:`/`cut:` tokens in `{voice_bible}`.
2. Tag every connective sentence not grounded in a braindump line with inline `[INVENTED]`. Never invent factual claims, anecdotes, or fake-casual props; mark content gaps for the creator instead.
3. Write the opening hook LAST, once the finished body proves every promise the hook makes.
4. Run both deterministic checks before presenting (swap `--surface written` when weaving an essay, article, or written story, and replace `<wpm>` with `measured_wpm` from `{voice_bible}` or `150`):
   `uv run "{skill-root}/scripts/creative_lint.py" lint "<draft-path>" --blacklist "{record_folder}/blacklist.md" --surface spoken`
   `uv run "{skill-root}/scripts/creative_lint.py" metrics "<draft-path>" --wpm <wpm> --check-invented`
5. If `metrics --check-invented` exits `1` (more than 25% `[INVENTED]` sentences), stop weaving and send the draft back to `references/braindump.md` to gather real material instead of padding.
6. Fix every blocking regex violation, review burstiness warnings, and apply `assets/craft-checklist.md` plus the Manual QA checks at the bottom of `{record_folder}/blacklist.md`. Re-run `lint` and `metrics` until clean.
7. Leave `[INVENTED]` tags visible when presenting so the creator can rewrite, confirm, or cut each synthetic bridge.

## Hand back

The draft path, measured word count and estimated runtime (`runtime_mmss`), `[INVENTED]` percentage, and `[INVENTED]` or `GAP` spots needing the creator's real phrasing.
