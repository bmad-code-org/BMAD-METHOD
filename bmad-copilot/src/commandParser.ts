import { BmadIndex, BmadItem } from './bmadIndex';

/**
 * Parse the user's remaining prompt text after the slash-command into tokens.
 *
 * Supports:
 *  - Quoted arguments: "some multi-word arg"
 *  - Unquoted arguments split by whitespace
 */
export function parseArgs(prompt: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < prompt.length; i++) {
        const ch = prompt[i];
        if (inQuote) {
            if (ch === quoteChar) {
                inQuote = false;
                args.push(current);
                current = '';
            } else {
                current += ch;
            }
        } else if (ch === '"' || ch === "'") {
            inQuote = true;
            quoteChar = ch;
            if (current.length > 0) {
                args.push(current);
                current = '';
            }
        } else if (/\s/.test(ch)) {
            if (current.length > 0) {
                args.push(current);
                current = '';
            }
        } else {
            current += ch;
        }
    }
    if (current.length > 0) {
        args.push(current);
    }
    return args;
}

/**
 * Parsed result of a user prompt.
 */
export interface ParsedCommand {
    subCommand: string;
    args: string[];
}

/**
 * Try to parse a sub-command from raw prompt text (fallback when no VS Code command is set).
 */
export function parsePromptAsCommand(prompt: string): ParsedCommand | undefined {
    const tokens = parseArgs(prompt.trim());
    if (tokens.length === 0) { return undefined; }
    return { subCommand: tokens[0].toLowerCase(), args: tokens.slice(1) };
}

// ─── Resolved command ───────────────────────────────────

export type ResolvedKind = 'agent' | 'workflow';

export interface ResolvedRunTarget {
    kind: ResolvedKind;
    item: BmadItem;
    task: string;
}

/**
 * Attempt to resolve a "run" command's arguments into a concrete agent or workflow.
 *
 * Supported patterns (all case-insensitive):
 *   agent <name> "<task>"              — explicit agent
 *   workflow <name> "<task>"           — explicit workflow
 *   a <name> "<task>"                  — shorthand agent
 *   w <name> "<task>"                  — shorthand workflow
 *   <name> "<task>"                    — auto-resolve: try agent first, then workflow
 *   bmm agents <name> "<task>"         — namespaced agent
 *   bmm workflows <name> "<task>"      — namespaced workflow
 *   core agents <name> "<task>"        — namespaced agent
 *   core workflows <name> "<task>"     — namespaced workflow
 */
export function resolveRunTarget(args: string[], index: BmadIndex): ResolvedRunTarget | undefined {
    if (args.length === 0) { return undefined; }

    const first = args[0].toLowerCase();

    // ── Explicit kind ──
    if (first === 'agent' || first === 'a') {
        return findItem('agent', args.slice(1), index);
    }
    if (first === 'workflow' || first === 'w') {
        return findItem('workflow', args.slice(1), index);
    }

    // ── Namespaced: bmm/core agents/workflows <name> ──
    const second = args[1]?.toLowerCase();
    if (isModuleName(first) && second) {
        if (second === 'agents' || second === 'agent' || second === 'a') {
            return findItem('agent', args.slice(2), index, first);
        }
        if (second === 'workflows' || second === 'workflow' || second === 'w') {
            return findItem('workflow', args.slice(2), index, first);
        }
    }

    // ── Auto-resolve: try as agent name, then workflow name ──
    const item = findByName(first, index);
    if (item) {
        return { kind: item.kind, item: item.item, task: args.slice(1).join(' ') };
    }

    return undefined;
}

/**
 * Resolve arguments for /agents <name> "<task>" and /workflows <name> "<task>" shorthand commands.
 */
export function resolveDirectKind(kind: ResolvedKind, args: string[], index: BmadIndex): ResolvedRunTarget | undefined {
    return findItem(kind, args, index);
}

// ── Helpers ──

/**
 * Test whether a token looks like a BMAD module name (e.g. `"bmm"`, `"core"`).
 * Rejects known command keywords so they are not confused with modules.
 * @param s - Lowercased token to check.
 * @returns `true` if the token is a plausible module name.
 */
function isModuleName(s: string): boolean {
    return /^[a-z][a-z0-9_-]*$/.test(s) && !['agent', 'workflow', 'a', 'w', 'agents', 'workflows'].includes(s);
}

/**
 * Look up a named item of the given kind in the index.
 * @param kind         - `'agent'` or `'workflow'`.
 * @param args         - Remaining tokens: `[name, ...taskWords]`.
 * @param index        - Current BMAD index.
 * @param moduleFilter - Optional module name to narrow the search.
 * @returns Resolved target, or `undefined` if no match is found.
 */
function findItem(kind: ResolvedKind, args: string[], index: BmadIndex, moduleFilter?: string): ResolvedRunTarget | undefined {
    if (args.length === 0) { return undefined; }
    const name = args[0].toLowerCase();
    const task = args.slice(1).join(' ');
    const list = kind === 'agent' ? index.agents : index.workflows;
    let item = list.find(i => i.name.toLowerCase() === name && (!moduleFilter || i.module === moduleFilter));
    if (!item) {
        // Fallback: ignore module filter
        item = list.find(i => i.name.toLowerCase() === name);
    }
    if (!item) { return undefined; }
    return { kind, item, task };
}

/**
 * Auto-resolve a name to an agent or workflow (agent takes priority).
 * @param name  - Item name to look up (case-insensitive).
 * @param index - Current BMAD index.
 * @returns The matched kind and item, or `undefined`.
 */
function findByName(name: string, index: BmadIndex): { kind: ResolvedKind; item: BmadItem } | undefined {
    const n = name.toLowerCase();
    const agent = index.agents.find(a => a.name.toLowerCase() === n);
    if (agent) { return { kind: 'agent', item: agent }; }
    const wf = index.workflows.find(w => w.name.toLowerCase() === n);
    if (wf) { return { kind: 'workflow', item: wf }; }
    return undefined;
}

/**
 * Find the closest matching item name across agents and workflows for suggestions.
 */
export function findClosestName(input: string, index: BmadIndex): string | undefined {
    const all = [
        ...index.agents.map(a => a.name),
        ...index.workflows.map(w => w.name),
    ];
    if (all.length === 0) { return undefined; }
    const lower = input.toLowerCase();
    // Prefix match first
    const prefix = all.find(n => n.toLowerCase().startsWith(lower));
    if (prefix) { return prefix; }
    // Substring match
    const sub = all.find(n => n.toLowerCase().includes(lower));
    if (sub) { return sub; }
    // Fall back to true Levenshtein distance — O(n*m) per candidate but
    // the candidate list is small (tens of items) so this is fine for a
    // hint-only code path.
    let best = all[0];
    let bestDist = Infinity;
    for (const n of all) {
        const d = levenshtein(lower, n.toLowerCase());
        if (d < bestDist) { bestDist = d; best = n; }
    }
    return best;
}

/**
 * Minimal Levenshtein distance (edit distance) between two strings.
 * Handles insertions, deletions and substitutions.
 * Uses a single-row DP approach to keep memory at O(min(a,b)).
 */
function levenshtein(a: string, b: string): number {
    if (a === b) { return 0; }
    if (a.length === 0) { return b.length; }
    if (b.length === 0) { return a.length; }
    // Ensure a is the shorter string for memory efficiency
    if (a.length > b.length) { [a, b] = [b, a]; }
    const row = Array.from({ length: a.length + 1 }, (_, i) => i);
    for (let j = 1; j <= b.length; j++) {
        let prev = row[0];
        row[0] = j;
        for (let i = 1; i <= a.length; i++) {
            const cur = row[i];
            row[i] = a[i - 1] === b[j - 1]
                ? prev
                : 1 + Math.min(prev, row[i], row[i - 1]);
            prev = cur;
        }
    }
    return row[a.length];
}
