# Lens: determinism

Lane: the boundary between script and prose, per the standards' Scripts section. A line crossing either way is a defect.

- Prose, a subagent's brief included, doing work a unit test could check: parsing, counting, path resolution, rendering a template, validating structure, diffing. The signal verbs: validate, count, extract, convert, compare, scan for, check structure, list all, diff. High when paid on every invocation, medium when occasional and cheap. Name the script and its interface.
- Prose reading raw files to pull out a few facts (frontmatter values, token counts, inventories) where a pre-pass script could hand the model compact JSON: medium, high for large files.
- Scripts in `scripts[]` with `has_pep723`, `has_test` or `has_argparse` false: medium each. `script_findings` carries the detail (`argparse-missing` for the last).
- A script that defers errors to the model: swallows an exception, warns and exits 0, or returns partial output with no reason. High. Findings returned as data with exit 0 are not errors.
- A script deciding meaning: a regex or string match classifying intent, tone or quality rather than locating a delimiter. Critical when it gates later behavior, high otherwise.
- Memory agent: prose maintaining an index of memory files, counting or sorting entries, or checking the sanctum's structure, when `wake.py` generates the map: medium.
- A transcript or session log in hand: the same helper re-derived turn after turn is the strongest script signal. High; name the script that does it once.

Not flagged: judgment on meaning, tone, ambiguity or severity; persona; a one-off operation cheaper to say than to script; work the pre-pass already did.
