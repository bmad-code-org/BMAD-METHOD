import * as vscode from 'vscode';
import * as fs from 'fs';
import { getIndex, refreshIndex, BmadIndex, BmadItem } from './bmadIndex';
import { parseArgs, parsePromptAsCommand, resolveRunTarget, resolveDirectKind, findClosestName, ResolvedRunTarget } from './commandParser';
import { logInfo, logWarn, logError } from './logger';

// ─── Dynamic help builder ───────────────────────────────

/**
 * Build dynamic help Markdown that lists all slash commands and currently installed items.
 * @param idx - Current BMAD index (may be `undefined` if not yet detected).
 * @returns Formatted Markdown string.
 */
function buildHelpText(idx: BmadIndex | undefined): string {
    let md = `## BMAD Copilot — Available Commands\n\n`;
    md += `| Command | Description |\n`;
    md += `|---------|-------------|\n`;
    md += `| \`@bmad /help\` | Show this help |\n`;
    md += `| \`@bmad /doctor\` | Diagnose BMAD installation |\n`;
    md += `| \`@bmad /list agents\` | List all registered agents |\n`;
    md += `| \`@bmad /list workflows\` | List all registered workflows |\n`;
    md += `| \`@bmad /run agent <name> "<task>"\` | Run task with agent persona |\n`;
    md += `| \`@bmad /run workflow <name> "<task>"\` | Run task in workflow |\n`;
    md += `| \`@bmad /run <name> "<task>"\` | Auto-resolve agent or workflow |\n`;
    md += `| \`@bmad /agents <name> "<task>"\` | Shorthand for /run agent |\n`;
    md += `| \`@bmad /workflows <name> "<task>"\` | Shorthand for /run workflow |\n`;

    if (idx) {
        md += `\n**Installed agents (${idx.agents.length}):** `;
        md += idx.agents.map(a => `\`${a.name}\``).join(', ') || '_none_';
        md += `\n\n**Installed workflows (${idx.workflows.length}):** `;
        md += idx.workflows.map(w => `\`${w.name}\``).join(', ') || '_none_';
    }

    md += `\n\n**Examples:**\n`;
    md += `\`\`\`\n`;
    md += `@bmad /run agent analyst "Generate a PRD outline"\n`;
    md += `@bmad /run create-prd "Build product requirements"\n`;
    md += `@bmad /agents pm "Plan sprint backlog"\n`;
    md += `@bmad /list agents\n`;
    md += `@bmad /doctor\n`;
    md += `\`\`\`\n`;
    return md;
}

// ─── Fuzzy suggestion ───────────────────────────────────

const KNOWN_SUBS = ['help', 'doctor', 'list', 'run', 'agents', 'workflows'];

/**
 * Suggest the closest known slash command for a mistyped input using positional character overlap.
 * @param input - The unrecognised command string the user typed.
 * @returns The best-matching known command name (falls back to `"help"`).
 */
function suggestCommand(input: string): string {
    let best = '';
    let bestScore = 0;
    for (const cmd of KNOWN_SUBS) {
        let score = 0;
        for (let i = 0; i < Math.min(input.length, cmd.length); i++) {
            if (input[i] === cmd[i]) { score++; }
        }
        if (score > bestScore) { bestScore = score; best = cmd; }
    }
    return best || 'help';
}

// ─── Sub-command handlers ───────────────────────────────

/**
 * Handle the `/help` command — render dynamic help text.
 * @param stream - Chat response stream to write Markdown into.
 */
function handleHelp(stream: vscode.ChatResponseStream): void {
    const idx = getIndex() ?? refreshIndex();
    stream.markdown(buildHelpText(idx));
}

/**
 * Handle the `/doctor` command — render BMAD installation diagnostics.
 * @param stream - Chat response stream to write Markdown into.
 */
function handleDoctor(stream: vscode.ChatResponseStream): void {
    const wsRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '(no workspace)';
    const config = vscode.workspace.getConfiguration('bmad');
    const explicitRoot = config.get<string>('rootPath', '') || '(not set)';
    const autoDetect = config.get<boolean>('autoDetect', true);

    const idx = getIndex() ?? refreshIndex();

    let md = `## BMAD Doctor\n\n`;
    md += `| Item | Value |\n|------|-------|\n`;
    md += `| Workspace | \`${wsRoot}\` |\n`;
    md += `| bmad.rootPath | \`${explicitRoot}\` |\n`;
    md += `| bmad.autoDetect | \`${autoDetect}\` |\n`;

    if (idx) {
        md += `| BMAD Root | \`${idx.rootPath}\` |\n`;
        md += `| Agents | ${idx.agents.length} |\n`;
        md += `| Workflows | ${idx.workflows.length} |\n`;

        if (idx.agents.length > 0) {
            md += `\n**Agents:** `;
            md += idx.agents.map(a => {
                const label = a.icon ? `${a.icon} ${a.name}` : a.name;
                return a.title ? `\`${label}\` (${a.title})` : `\`${label}\``;
            }).join(', ');
            md += `\n`;
        }
        if (idx.workflows.length > 0) {
            md += `\n**Workflows:** `;
            md += idx.workflows.map(w => `\`${w.name}\``).join(', ');
            md += `\n`;
        }
    } else {
        md += `| BMAD Root | **Not found** |\n`;
        md += `\n> BMAD installation not found. Ensure \`_bmad/\` exists in workspace or set \`bmad.rootPath\` in settings.\n`;
    }

    stream.markdown(md);
}

/**
 * Handle the `/list` command — display agents or workflows in a table.
 * @param stream - Chat response stream.
 * @param args   - Remaining tokens (expects `["agents"]` or `["workflows"]`).
 */
function handleList(stream: vscode.ChatResponseStream, args: string[]): void {
    const idx = getIndex() ?? refreshIndex();
    if (!idx) {
        stream.markdown('BMAD installation not found. Run `@bmad /doctor` to check configuration.');
        return;
    }

    const what = args[0]?.toLowerCase();
    if (what === 'agents' || what === 'agent') {
        listItems(stream, 'Agents', idx.agents, true);
    } else if (what === 'workflows' || what === 'workflow') {
        listItems(stream, 'Workflows', idx.workflows, false);
    } else {
        stream.markdown(`Specify type: \`@bmad /list agents\` or \`@bmad /list workflows\`\n`);
    }
}

/**
 * Render a Markdown table of BMAD items (agents or workflows).
 * @param stream  - Chat response stream.
 * @param title   - Section heading (e.g. `"Agents"`).
 * @param items   - Items to display.
 * @param isAgent - `true` to show agent-specific columns (Title, Icon); `false` for workflow columns (Description).
 */
function listItems(stream: vscode.ChatResponseStream, title: string, items: BmadItem[], isAgent: boolean): void {
    if (items.length === 0) {
        stream.markdown(`## ${title}\n\n_No items found._\n`);
        return;
    }
    let md = `## ${title} (${items.length})\n\n`;
    if (isAgent) {
        md += `| Name | Title | Module | Path |\n|------|-------|--------|------|\n`;
        for (const it of items) {
            const icon = it.icon ? `${it.icon} ` : '';
            md += `| \`${icon}${it.name}\` | ${it.title ?? '-'} | ${it.module ?? '-'} | \`${it.relativePath}\` |\n`;
        }
    } else {
        md += `| Name | Description | Module | Path |\n|------|-------------|--------|------|\n`;
        for (const it of items) {
            const desc = it.description ? truncate(it.description, 60) : '-';
            md += `| \`${it.name}\` | ${desc} | ${it.module ?? '-'} | \`${it.relativePath}\` |\n`;
        }
    }
    stream.markdown(md);
}

/**
 * Truncate a string to at most {@link max} characters, appending `'…'` if shortened.
 * @param s   - Input string.
 * @param max - Maximum allowed length.
 * @returns The (possibly truncated) string.
 */
function truncate(s: string, max: number): string {
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/**
 * Wrap `content` in a Markdown fenced code block using a fence that is
 * guaranteed not to collide with any backtick sequence inside the content.
 *
 * Algorithm: find the longest run of consecutive backticks in `content`,
 * then use a fence that is at least one backtick longer (minimum 3).
 */
function safeFence(content: string): string {
    let maxRun = 0;
    let run = 0;
    for (const ch of content) {
        if (ch === '`') {
            run++;
            if (run > maxRun) { maxRun = run; }
        } else {
            run = 0;
        }
    }
    const fence = '`'.repeat(Math.max(3, maxRun + 1));
    return `${fence}\n${content}\n${fence}`;
}

// ─── Run agent / workflow ───────────────────────────────

/**
 * Execute a resolved run target by injecting its definition into the LLM context.
 * Falls back to displaying a copyable prompt if the Language Model API is unavailable.
 * @param request  - Original chat request (provides the language model).
 * @param stream   - Chat response stream for output.
 * @param token    - Cancellation token.
 * @param resolved - The agent/workflow and task to execute.
 */
async function executeRun(
    request: vscode.ChatRequest,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken,
    resolved: ResolvedRunTarget
): Promise<void> {
    const { kind, item, task: userTask } = resolved;

    // Read file content
    let fileContent: string;
    try {
        fileContent = fs.readFileSync(item.filePath, 'utf-8');
        logInfo(`Read ${kind} file: ${item.filePath} (${fileContent.length} chars)`);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logError(`Failed to read ${item.filePath}: ${msg}`);
        stream.markdown(`Failed to read ${kind} file \`${item.relativePath}\`: ${msg}`);
        return;
    }

    const task = userTask || '(no specific task provided — greet the user and describe your capabilities)';

    const systemPrompt = `You are acting as a BMAD ${kind}. Below is the ${kind} definition file content. Follow the persona, instructions, and capabilities described within.\n\n--- BEGIN ${kind.toUpperCase()} DEFINITION ---\n${fileContent}\n--- END ${kind.toUpperCase()} DEFINITION ---`;

    const userMessage = `User task: ${task}`;

    try {
        const model = request.model;
        if (model) {
            const label = item.icon ? `${item.icon} ${item.name}` : item.name;
            logInfo(`Sending prompt to model: ${model.id}`);
            stream.progress(`Running as ${label} ${kind}...`);

            const messages = [
                vscode.LanguageModelChatMessage.User(systemPrompt),
                vscode.LanguageModelChatMessage.User(userMessage),
            ];

            const chatResponse = await model.sendRequest(messages, {}, token);
            for await (const fragment of chatResponse.text) {
                stream.markdown(fragment);
            }
            return;
        }
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logWarn(`LLM direct call failed (${msg}), falling back to prompt display.`);
    }

    fallbackPrompt(stream, item, kind, fileContent, task);
}

/**
 * Handle the `/run` command — resolve args to an agent/workflow and execute it.
 * Shows helpful feedback with closest-name suggestions on resolution failure.
 * @param request - Original chat request.
 * @param stream  - Chat response stream.
 * @param token   - Cancellation token.
 * @param args    - Parsed tokens after `/run`.
 * @returns A promise that resolves when execution is complete.
 */
function handleRun(
    request: vscode.ChatRequest,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken,
    args: string[]
): Promise<void> {
    const idx = getIndex() ?? refreshIndex();
    if (!idx) {
        stream.markdown('BMAD installation not found. Run `@bmad /doctor` to check configuration.');
        return Promise.resolve();
    }

    const resolved = resolveRunTarget(args, idx);
    if (!resolved) {
        // Could not resolve — provide helpful feedback
        const name = args[0]?.toLowerCase();
        if (name) {
            const suggestion = findClosestName(name, idx);
            let msg = `Could not resolve \`${args.join(' ')}\`.`;
            if (suggestion) { msg += ` Did you mean \`${suggestion}\`?`; }
            msg += `\n\nUsage: \`@bmad /run agent <name> "<task>"\` or \`@bmad /run <name> "<task>"\``;
            msg += `\n\nRun \`@bmad /list agents\` or \`@bmad /list workflows\` to see available names.`;
            stream.markdown(msg);
        } else {
            stream.markdown('Usage: `@bmad /run agent <name> "<task>"` or `@bmad /run workflow <name> "<task>"`\n\nRun `@bmad /list agents` to see available names.');
        }
        return Promise.resolve();
    }

    return executeRun(request, stream, token, resolved);
}

/**
 * Display the assembled prompt as a copyable code block when the LLM API is unavailable.
 * Includes a "Copy Prompt" button bound to the clipboard command.
 * @param stream      - Chat response stream.
 * @param item        - The agent or workflow item.
 * @param kind        - `"agent"` or `"workflow"`.
 * @param fileContent - Raw content of the definition file.
 * @param task        - User-supplied task description.
 */
function fallbackPrompt(
    stream: vscode.ChatResponseStream,
    item: BmadItem,
    kind: string,
    fileContent: string,
    task: string
): void {
    stream.markdown(`> LLM API unavailable. Copy the assembled prompt below and paste it into Copilot Chat.\n\n`);

    const assembled = `I want you to adopt the following ${kind} persona and follow its instructions exactly.\n\n--- BEGIN ${kind.toUpperCase()} DEFINITION ---\n${fileContent}\n--- END ${kind.toUpperCase()} DEFINITION ---\n\nNow respond to this task:\n${task}`;

    stream.markdown(safeFence(assembled) + '\n');

    stream.button({
        title: 'Copy Prompt',
        command: 'bmad-copilot.copyToClipboard',
        arguments: [assembled],
    });
}

// ─── Main handler ───────────────────────────────────────

/**
 * Main `@bmad` chat participant request handler.
 * Routes incoming commands to the appropriate sub-handler and returns an empty result.
 */
export const chatHandler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<vscode.ChatResult> => {
    try {
        logInfo(`Chat request — command: ${request.command ?? '(none)'}, prompt: "${request.prompt}"`);

        let command = request.command;
        let args: string[] = [];

        if (command) {
            args = parseArgs(request.prompt.trim());
        } else {
            const parsed = parsePromptAsCommand(request.prompt);
            if (parsed) {
                command = parsed.subCommand;
                args = parsed.args;
            }
        }

        switch (command) {
            case 'help':
                handleHelp(stream);
                break;
            case 'doctor':
                handleDoctor(stream);
                break;
            case 'list':
                handleList(stream, args);
                break;
            case 'run':
                await handleRun(request, stream, token, args);
                break;
            case 'agents': {
                // Shorthand: @bmad /agents <name> "<task>"
                const idx = getIndex() ?? refreshIndex();
                if (!idx) { stream.markdown('BMAD installation not found. Run `@bmad /doctor`.'); break; }
                const resolved = resolveDirectKind('agent', args, idx);
                if (resolved) {
                    await executeRun(request, stream, token, resolved);
                } else {
                    listItems(stream, 'Agents', idx.agents, true);
                }
                break;
            }
            case 'workflows': {
                // Shorthand: @bmad /workflows <name> "<task>"
                const idx = getIndex() ?? refreshIndex();
                if (!idx) { stream.markdown('BMAD installation not found. Run `@bmad /doctor`.'); break; }
                const resolved = resolveDirectKind('workflow', args, idx);
                if (resolved) {
                    await executeRun(request, stream, token, resolved);
                } else {
                    listItems(stream, 'Workflows', idx.workflows, false);
                }
                break;
            }
            default: {
                // Try to treat as agent/workflow name directly
                if (command) {
                    const idx = getIndex() ?? refreshIndex();
                    if (idx) {
                        const resolved = resolveRunTarget([command, ...args], idx);
                        if (resolved) {
                            await executeRun(request, stream, token, resolved);
                            break;
                        }
                    }
                    const suggestion = suggestCommand(command);
                    stream.markdown(`Unknown command \`${command}\`. Did you mean \`@bmad /${suggestion}\`?\n\n`);
                }
                handleHelp(stream);
                break;
            }
        }
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logError(`Unhandled error in chat handler: ${msg}`);
        stream.markdown(`Error: ${msg}\n\nTry \`@bmad /help\` or \`@bmad /doctor\`.`);
    }

    return {};
};
