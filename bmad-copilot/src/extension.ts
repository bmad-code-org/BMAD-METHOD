import * as vscode from 'vscode';
import { initLogger, logInfo } from './logger';
import { refreshIndex, startWatching } from './bmadIndex';
import { chatHandler } from './chatHandler';

/**
 * Extension entry point — registers the `@bmad` chat participant,
 * builds the initial BMAD index, and wires up file/config watchers.
 * @param context - VS Code extension context for lifecycle management.
 */
export function activate(context: vscode.ExtensionContext): void {
    // ── Logger ──
    initLogger(context);
    logInfo('BMAD Copilot extension activating…');

    // ── Initial index ──
    const idx = refreshIndex();
    if (idx) {
        logInfo(`Activated with ${idx.agents.length} agents, ${idx.workflows.length} workflows`);
    } else {
        logInfo('No BMAD installation detected in current workspace.');
    }

    // ── File watcher ──
    startWatching(context);

    // ── Chat participant ──
    const participant = vscode.chat.createChatParticipant('bmad-copilot.bmad', chatHandler);
    participant.iconPath = new vscode.ThemeIcon('rocket');
    context.subscriptions.push(participant);

    // ── Copy-to-clipboard command (for fallback prompt) ──
    context.subscriptions.push(
        vscode.commands.registerCommand('bmad-copilot.copyToClipboard', async (text: string) => {
            await vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage('BMAD prompt copied to clipboard!');
        })
    );

    // ── Listen for config changes ──
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('bmad')) {
                logInfo('BMAD config changed — rebuilding index');
                refreshIndex();
            }
        })
    );

    logInfo('BMAD Copilot extension activated.');
}

/** Extension teardown. Cleanup is handled automatically by `context.subscriptions`. */
export function deactivate(): void {
    // Cleanup handled by context.subscriptions
}
