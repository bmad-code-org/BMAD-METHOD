import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logWarn } from './logger';

/**
 * Well-known paths where BMAD is installed after `npx bmad-method install`.
 */
const CANDIDATE_ROOTS = ['_bmad', '.bmad-core', '_bmad-core'];

export interface BmadItem {
    /** Display name derived from filename or YAML metadata (e.g. "analyst") */
    name: string;
    /** Absolute file path */
    filePath: string;
    /** Relative path from workspace root */
    relativePath: string;
    /** Human-readable title extracted from YAML (e.g. "Business Analyst") */
    title?: string;
    /** Description extracted from YAML front-matter or top-level key */
    description?: string;
    /** Icon emoji extracted from YAML metadata */
    icon?: string;
    /** Module the item belongs to (e.g. "bmm", "core") */
    module?: string;
}

export interface BmadIndex {
    rootPath: string;
    agents: BmadItem[];
    workflows: BmadItem[];
}

// ─── Detection ──────────────────────────────────────────

function workspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

/**
 * Resolve the BMAD root directory.
 * Priority: explicit config > auto-detect.
 */
export function detectBmadRoot(): string | undefined {
    const wsRoot = workspaceRoot();
    if (!wsRoot) {
        logWarn('No workspace folder open.');
        return undefined;
    }

    const config = vscode.workspace.getConfiguration('bmad');
    const explicit: string = config.get<string>('rootPath', '').trim();

    if (explicit) {
        const abs = path.isAbsolute(explicit) ? explicit : path.join(wsRoot, explicit);
        try {
            const stat = fs.statSync(abs);
            if (!stat.isDirectory()) {
                logWarn(`Configured bmad.rootPath "${explicit}" exists but is not a directory: ${abs}`);
                return undefined;
            }
            logInfo(`Using explicit bmad.rootPath: ${abs}`);
            return abs;
        } catch {
            logWarn(`Configured bmad.rootPath "${explicit}" not found at ${abs}`);
        }
    }

    const autoDetect = config.get<boolean>('autoDetect', true);
    if (!autoDetect) {
        logInfo('Auto-detect disabled and no explicit rootPath.');
        return undefined;
    }

    for (const candidate of CANDIDATE_ROOTS) {
        const p = path.join(wsRoot, candidate);
        if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
            logInfo(`Auto-detected BMAD root: ${p}`);
            return p;
        }
    }

    // Also check if we're inside the BMAD-METHOD repo itself (src/ layout)
    const srcPath = path.join(wsRoot, 'src');
    if (fs.existsSync(path.join(srcPath, 'bmm')) || fs.existsSync(path.join(srcPath, 'core'))) {
        logInfo(`Detected BMAD-METHOD repo layout at: ${srcPath}`);
        return srcPath;
    }

    logWarn('BMAD root not found in workspace.');
    return undefined;
}

// ─── YAML / front-matter metadata extraction ────────────

/**
 * Lightweight extraction of metadata from YAML agent files.
 * Reads plain text and uses regex — no YAML parser dependency.
 */
function extractAgentMeta(content: string): { title?: string; description?: string; icon?: string; module?: string; role?: string } {
    const meta: { title?: string; description?: string; icon?: string; module?: string; role?: string } = {};
    // metadata.title
    const titleM = content.match(/^\s+title:\s*["']?(.+?)["']?\s*$/m);
    if (titleM) { meta.title = titleM[1]; }
    // metadata.icon
    const iconM = content.match(/^\s+icon:\s*["']?(.+?)["']?\s*$/m);
    if (iconM) { meta.icon = iconM[1].trim(); }
    // metadata.module
    const modM = content.match(/^\s+module:\s*["']?(.+?)["']?\s*$/m);
    if (modM) { meta.module = modM[1]; }
    // persona.role
    const roleM = content.match(/^\s+role:\s*["']?(.+?)["']?\s*$/m);
    if (roleM) { meta.role = roleM[1]; }
    // Use role as description if available
    if (meta.role) { meta.description = meta.role; }
    return meta;
}

/**
 * Extract name/description from workflow files.
 * Supports:
 *  - YAML front-matter in .md files (---\nname: ...\ndescription: ...\n---)
 *  - Top-level YAML keys in .yaml files (name: ...\ndescription: ...)
 */
function extractWorkflowMeta(content: string): { name?: string; description?: string } {
    const meta: { name?: string; description?: string } = {};
    // Try YAML front-matter first
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const block = fmMatch ? fmMatch[1] : content;
    const nameM = block.match(/^name:\s*["']?(.+?)["']?\s*$/m);
    if (nameM) { meta.name = nameM[1]; }
    const descM = block.match(/^description:\s*["']?(.+?)["']?\s*$/m);
    if (descM) { meta.description = descM[1]; }
    return meta;
}

// ─── Recursive file walker ──────────────────────────────

function walkAll(dir: string): string[] {
    const results: string[] = [];
    function walk(current: string): void {
        let entries: fs.Dirent[];
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
        } catch {
            return;
        }
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.isFile()) {
                results.push(full);
            }
        }
    }
    walk(dir);
    return results;
}

// ─── Name derivation ────────────────────────────────────

function isAgentFile(filename: string): boolean {
    return /\.agent\.(yaml|md)$/i.test(filename);
}

function isWorkflowFile(filename: string): boolean {
    // Matches: workflow.yaml, workflow.md, workflow-*.md, workflow-*.yaml
    return /^workflow(-[\w-]+)?\.(yaml|md)$/i.test(filename);
}

function deriveAgentName(filePath: string): string {
    const base = path.basename(filePath);
    return base.replace(/\.agent\.(yaml|md)$/i, '');
}

function deriveWorkflowName(filePath: string, content: string): string {
    // Prefer name from YAML metadata
    const meta = extractWorkflowMeta(content);
    if (meta.name) { return meta.name; }
    // Fallback: strip "workflow-" prefix and extension, or use parent dir name
    const base = path.basename(filePath);
    const stripped = base.replace(/\.(yaml|md)$/i, '').replace(/^workflow-?/, '');
    if (stripped) { return stripped; }
    return path.basename(path.dirname(filePath));
}

/**
 * Infer the module name from a file path.
 * e.g. _bmad/bmm/agents/... -> "bmm", _bmad/core/workflows/... -> "core"
 */
function inferModule(filePath: string, bmadRoot: string): string | undefined {
    const rel = path.relative(bmadRoot, filePath).replace(/\\/g, '/');
    const first = rel.split('/')[0];
    // Only return known module-like names (not the file itself)
    if (first && !first.includes('.')) { return first; }
    return undefined;
}

// ─── Build index ────────────────────────────────────────

export function buildIndex(bmadRoot: string): BmadIndex {
    const wsRoot = workspaceRoot() ?? bmadRoot;
    const allFiles = walkAll(bmadRoot);

    const agents: BmadItem[] = [];
    const workflows: BmadItem[] = [];
    const seenWorkflows = new Set<string>();

    for (const fp of allFiles) {
        const filename = path.basename(fp);
        const relPath = path.relative(wsRoot, fp).replace(/\\/g, '/');
        const mod = inferModule(fp, bmadRoot);

        if (isAgentFile(filename)) {
            let content = '';
            try { content = fs.readFileSync(fp, 'utf-8'); } catch { /* ignore */ }
            const meta = extractAgentMeta(content);
            agents.push({
                name: deriveAgentName(fp),
                filePath: fp,
                relativePath: relPath,
                title: meta.title,
                description: meta.description,
                icon: meta.icon,
                module: meta.module ?? mod,
            });
        } else if (isWorkflowFile(filename)) {
            let content = '';
            try { content = fs.readFileSync(fp, 'utf-8'); } catch { /* ignore */ }
            const wfName = deriveWorkflowName(fp, content);
            const meta = extractWorkflowMeta(content);
            // Deduplicate by name (keep first found)
            if (!seenWorkflows.has(wfName.toLowerCase())) {
                seenWorkflows.add(wfName.toLowerCase());
                workflows.push({
                    name: wfName,
                    filePath: fp,
                    relativePath: relPath,
                    description: meta.description,
                    module: mod,
                });
            }
        }
    }

    // Sort alphabetically
    agents.sort((a, b) => a.name.localeCompare(b.name));
    workflows.sort((a, b) => a.name.localeCompare(b.name));

    logInfo(`Index built — ${agents.length} agents, ${workflows.length} workflows`);
    return { rootPath: bmadRoot, agents, workflows };
}

// ─── State management ───────────────────────────────────

let _index: BmadIndex | undefined;
let _watcher: vscode.FileSystemWatcher | undefined;

export function getIndex(): BmadIndex | undefined {
    return _index;
}

export function refreshIndex(): BmadIndex | undefined {
    const root = detectBmadRoot();
    if (!root) {
        _index = undefined;
        return undefined;
    }
    _index = buildIndex(root);
    return _index;
}

export function startWatching(ctx: vscode.ExtensionContext): void {
    const wsRoot = workspaceRoot();
    if (!wsRoot) { return; }

    // Watch for changes in yaml/md files that could be agents or workflows
    const pattern = new vscode.RelativePattern(wsRoot, '**/*.{yaml,md}');
    _watcher = vscode.workspace.createFileSystemWatcher(pattern);

    const rebuild = () => {
        logInfo('File change detected — rebuilding index');
        refreshIndex();
    };

    _watcher.onDidCreate(rebuild);
    _watcher.onDidDelete(rebuild);
    _watcher.onDidChange(rebuild);
    ctx.subscriptions.push(_watcher);
}
