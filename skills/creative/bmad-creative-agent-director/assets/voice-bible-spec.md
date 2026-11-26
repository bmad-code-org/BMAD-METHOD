# Voice Bible: Build Spec

The voice bible lives at `{voice_bible}` (the `voice_guide` setting in Creative, else `{record_folder}/voice-bible.md`, else `~/.bmad/voice-bible.md` for a personal cross-project voice) and is built exclusively from the creator's real writing or transcripts in `{record_folder}/exemplars/`, never guessed from adjectives or memory.

## How to build it

1. Gather 3 to 5 strong real pieces (talks, keynote transcripts, essays, stories, podcast segments, or letters) and save them clean under `{record_folder}/exemplars/YYYY-MM-DD-<slug>.md` with frontmatter noting medium, audience, date, and why the piece worked.
2. Deconstruct the exemplars with at least one verbatim quote backing every rule:
   - **Sentence rhythm:** short/long alternation, paragraph openings, and punctuation habits on spoken vs written surfaces.
   - **Cold openings:** how the creator actually enters a piece rather than generic formulas.
   - **Transitions:** exact connective phrases used to bridge ideas cleanly.
   - **Signature constructions:** recurring turns of phrase, comparisons, or framing patterns.
   - **Jargon & authority:** which terms are assumed vs unpacked plainly, and how disagreement or nuance is hedged.
   - **Fillers worth keeping vs cutting:** natural speech markers vs empty tics.
   - **Speaking rate (WPM):** when spoken transcripts have durations, record `measured_wpm: <int>` in `voice-bible.md` frontmatter (do not guess 145 if the real speaker runs 180+).
3. Write the machine-readable cadence block (below). A rule stated only in prose can still be stripped during editing; listing exact markers preserves natural voice.

## The cadence block

Include one fenced block tagged `cadence` anywhere in `voice-bible.md`:

```cadence
keep: so, here's the thing, look, now, basically
cut: kind of, sort of, honestly, you know, at the end of the day
```

- `keep:` lists connective glue and speech tics that carry this creator's natural rhythm and should not be sterilized during cleanup or weaving.
- `cut:` lists verbal filler and hedging tics to strip unless quoting raw speech intentionally.
- On conflict, `keep:` wins so authentic cadence is never flattened into generic prose.
