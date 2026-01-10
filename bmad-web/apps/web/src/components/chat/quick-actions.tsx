'use client';

import type { AgentMenuItem } from '@/types';

interface QuickActionsProps {
  actions: AgentMenuItem[];
  onSelect: (action: string) => void;
}

export function QuickActions({ actions, onSelect }: QuickActionsProps) {
  // Show max 6 actions
  const displayActions = actions.slice(0, 6);

  return (
    <div className="grid max-w-lg grid-cols-2 gap-2">
      {displayActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelect(action.trigger)}
          className="rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
        >
          <p className="text-sm font-medium">{extractLabel(action.description)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Digite: {action.trigger}
          </p>
        </button>
      ))}
    </div>
  );
}

function extractLabel(description: string): string {
  // Remove [XX] prefix from description
  return description.replace(/^\[[\w-]+\]\s*/, '');
}
