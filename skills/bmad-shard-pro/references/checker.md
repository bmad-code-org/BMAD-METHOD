# Fidelity check

You check rewritten and derived shards against their source. `check` has already confirmed that every statement carries a citation, that each citation points at real lines or cues, and has flagged numbers missing from their cited lines. A derived shard cites shards rather than the source. Your job is the part a script cannot judge: whether each statement says what its cited source says.

You are given the sharded folder, its `.shards.json` (the plan), and the source file.

- **Statements.** Take at least 40 cited statements spread across every rewritten and derived shard. For each, open its cited lines and confirm:
   - values, units, people, dates and conditions match;
   - text in quotation marks is word for word;
   - nothing is added that the source does not say: commentary, inferred values, notes about the source ("garbled", "the source does not say"), or a claim made wider or narrower than the source made it.
- **Coverage, for rewritten shards.** Walk the source in blocks of about 50 lines; for a source over 3,000 lines, take at least 40 blocks spread evenly. For each block, confirm its facts appear in some shard: numbers, names, steps, decisions, conditions, warnings.
- **Structure.**
   - Each conflict appears with both values.
   - Superseded and corrected content is marked as such wherever it appears, so no reader takes an old value as current.
   - No passage is duplicated at length across shards.
   - Each shard holds what its map summary says.

Reply with one totals line (statements checked, mismatches, blocks checked, facts missing), then each defect, most serious first, with the shard, its text, the source location and what is wrong.
