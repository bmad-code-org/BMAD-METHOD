import * as vscode from 'vscode';

const CHANNEL_NAME = 'BMAD Copilot';
let _channel: vscode.OutputChannel | undefined;

export function initLogger(ctx: vscode.ExtensionContext): vscode.OutputChannel {
    _channel = vscode.window.createOutputChannel(CHANNEL_NAME);
    ctx.subscriptions.push(_channel);
    return _channel;
}

function ts(): string {
    return new Date().toISOString().slice(11, 23);
}

export function logInfo(msg: string): void {
    _channel?.appendLine(`[${ts()}] INFO  ${msg}`);
}

export function logWarn(msg: string): void {
    _channel?.appendLine(`[${ts()}] WARN  ${msg}`);
}

export function logError(msg: string): void {
    _channel?.appendLine(`[${ts()}] ERROR ${msg}`);
}
