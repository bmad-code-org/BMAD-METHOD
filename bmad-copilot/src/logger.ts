import * as vscode from 'vscode';

const CHANNEL_NAME = 'BMAD Copilot';
let _channel: vscode.OutputChannel | undefined;

/**
 * Initialise the shared output channel for extension logging.
 * @param ctx - Extension context whose subscriptions manage the channel lifecycle.
 * @returns The created {@link vscode.OutputChannel}.
 */
export function initLogger(ctx: vscode.ExtensionContext): vscode.OutputChannel {
    _channel = vscode.window.createOutputChannel(CHANNEL_NAME);
    ctx.subscriptions.push(_channel);
    return _channel;
}

/** @returns Current time as `HH:MM:SS.mmm` for log line prefixes. */
function ts(): string {
    return new Date().toISOString().slice(11, 23);
}

/**
 * Write an INFO-level message to the output channel.
 * @param msg - The message to log.
 */
export function logInfo(msg: string): void {
    _channel?.appendLine(`[${ts()}] INFO  ${msg}`);
}

/**
 * Write a WARN-level message to the output channel.
 * @param msg - The message to log.
 */
export function logWarn(msg: string): void {
    _channel?.appendLine(`[${ts()}] WARN  ${msg}`);
}

/**
 * Write an ERROR-level message to the output channel.
 * @param msg - The message to log.
 */
export function logError(msg: string): void {
    _channel?.appendLine(`[${ts()}] ERROR ${msg}`);
}
