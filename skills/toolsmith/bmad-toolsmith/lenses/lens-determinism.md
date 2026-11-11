# Lens: determinism

Lane: the boundary between script and prose. The bar: a script does work with one right answer per input; prose does work that turns on meaning. A line crossing either way is a defect.

- Prose doing work a unit test could check: parsing, counting, path resolution, rendering a template, validating structure, diffing. The signal verbs: validate, count, extract, convert, compare, scan for, check structure, list all, diff. High when paid on every invocation, medium when occasional and cheap. Name the script and its interface.
- Prose reading raw files to pull out a few facts (frontmatter values, token counts, inventories) where a pre-pass script could hand the model compact JSON: medium, high for large files.
- Scripts in `scripts[]` with `has_pep723` or `has_test` false, or without `--help`: medium each. `script_findings` carries the detail; cite it, do not re-derive it.
- A script that defers errors to the model: swallows an exception, warns and exits 0, or returns partial output with no reason. High; the model will treat it as success.
- A script deciding meaning: a regex or string match classifying intent, tone or quality rather than locating a delimiter. Critical when it gates later behavior, high otherwise; it breaks when the phrasing shifts.
- Memory agent (`shape_hint` is `memory-agent`): prose maintaining an index of memory files, counting or sorting entries, or checking the sanctum's structure, when `wake.py` generates the map: medium. The model's tokens go to what to remember, not bookkeeping.
- A transcript or session log in hand: the same helper re-derived turn after turn is the strongest script signal. High; name the script that does it once.

Not flagged: judgment on meaning, tone, ambiguity or severity; persona; a one-off operation cheaper to say than to script; work the pre-pass already did.
