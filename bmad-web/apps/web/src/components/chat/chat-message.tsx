'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  agentName: string;
  agentIcon?: string;
}

export function ChatMessage({ message, agentName, agentIcon }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="max-w-md rounded-lg bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isUser
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {isUser ? 'Eu' : agentIcon || agentName[0]}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Suggested Actions */}
        {message.metadata?.suggestedActions && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border/50 pt-3">
            {message.metadata.suggestedActions.map((action, index) => (
              <button
                key={index}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  action.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background text-foreground hover:bg-accent'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Artifacts */}
        {message.metadata?.artifacts && message.metadata.artifacts.length > 0 && (
          <div className="mt-3 border-t border-border/50 pt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Artefatos criados:
            </p>
            {message.metadata.artifacts.map((artifactId) => (
              <button
                key={artifactId}
                className="flex w-full items-center gap-2 rounded-lg bg-background p-2 text-left text-sm hover:bg-accent"
              >
                <div className="h-8 w-8 rounded bg-primary/10" />
                <span className="truncate">{artifactId}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`mt-1 text-xs ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
