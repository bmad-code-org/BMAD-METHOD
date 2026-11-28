# Creative Blacklist: AI Tells and Slop

Seeded from `assets/blacklist-starter.md` into `{record_folder}/blacklist.md` on first lint or deslop run. `scripts/creative_lint.py` parses every fenced `regex` block (case-insensitive, one pattern per line, `#` lines are comments) and blocks before presenting woven scripts, talks, or drafts.

Each block opens with `# scope:`:
- `# scope: all` binds both spoken scripts/talks and written essays, stories, decks, and blurbs.
- `# scope: spoken` blocks spoken surfaces (`talk-script`, `WEAVE`, `REHEARSE`, and `outline` checks) and acts as advisory feedback on `--surface written`.

Append new patterns with an ISO date via `RETRO`. Only prune manually if a pattern blocks intentional phrasing.

## Patterns (all surfaces)

```regex
# scope: all
# empty openers and throat-clearing
\bwithout further ado\b
\blet['’]?s (dive|jump) (right )?in(to)?\b
\bin today['’]?s (fast.?paced )?(world|landscape|talk|post|episode)\b
# AI cliché verbs and adjectives
\bdelve\b
\bdive deep\b
\bdeep dive\b
\bgame.?chang(er|ing)\b
\bunleash\b
\bunlock (the )?(power|potential|secrets?)\b
\brevolutioniz\w*
\bseamless(ly)?\b
\bleverag(e|ing)\b
\brobust\b
\belevate\b
\bembark\b
\bsupercharg\w*
\bactionable\b
\bharness (the )?power\b
\bhidden gem\b
\btapestry\b
\bsymphony\b
# stiff essay transitions
\bfurthermore\b
\bmoreover\b
\badditionally\b
\bin conclusion\b
\bin summary\b
\bto summarize\b
\bfirst and foremost\b
\blast but not least\b
\b(that|with that) being said\b
\bwith that said\b
\bneedless to say\b
\bit['’]?s worth noting\b
\bit['’]?s important to note\b
\bnow that we['’]?ve covered\b
# synthetic slop constructions
\bin the world of\b
\bin the (ever.)?(changing|evolving) landscape\b
\bat the end of the day\b
\blet that sink in\b
\bbut here['’]?s the (thing|kicker|catch)\b
\btake (it|this|your \w+) to the next level\b
\bimagine (a world|if you could)\b
\bwhether you['’]?re a\b
\bnot (just|only) \w[^.,;]{0,40}, but\b
\bthe (best|craziest|wildest) part\?
\bgone are the days\b
\bsay goodbye to\b
```

## Spoken-cadence punctuation (spoken surfaces)

Em-dashes and en-dashes reflect silent-reading punctuation and trip up natural spoken delivery and teleprompters. Enforced as blocking on `--surface spoken`; advisory on `--surface written`.

```regex
# scope: spoken
—
–
```

## Manual QA (checked during DESLOP and WEAVE)

- Fake-casual specificity: invented "Tuesday coffee", weather props, or placeholder names like "Sarah Chen". Real facts or none.
- Quote-or-cut violations: content claims in a woven draft that neither trace to a braindump line nor carry `[INVENTED]`.
- Symmetric triads ("fast, cheap, and reliable") where the creator would name one or two concrete things.
- Rhetorical questions the listener did not ask.
- Monotonous rhythm: multiple consecutive paragraphs opening with the exact same grammatical construction.
