'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import type { Message, Agent } from '@/types';
import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';
import { QuickActions } from './quick-actions';

interface AgentChatProps {
  agent: Agent;
  projectId: string;
  onArtifactCreated?: (artifactId: string) => void;
}

export function AgentChat({ agent, projectId, onArtifactCreated }: AgentChatProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { currentConversation, addMessage, agentTyping, setAgentTyping } = useAppStore();

  const messages = currentConversation?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentTyping]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    setAgentTyping(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // TODO: Replace with actual API call
      const response = await simulateAgentResponse(agent, input);

      const agentMessage: Message = {
        id: crypto.randomUUID(),
        role: 'agent',
        content: response.content,
        metadata: response.metadata,
        timestamp: new Date(),
      };

      addMessage(agentMessage);

      // Check if an artifact was created
      if (response.metadata?.artifacts?.length) {
        onArtifactCreated?.(response.metadata.artifacts[0]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
      setAgentTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
            {agent.icon || agent.name[0]}
          </div>
          <div>
            <h2 className="font-semibold">{agent.name}</h2>
            <p className="text-sm text-muted-foreground">{agent.title}</p>
          </div>
        </div>
        <button className="rounded-lg p-2 hover:bg-muted">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              {agent.icon || agent.name[0]}
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Ola! Eu sou {agent.name}
            </h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              {agent.persona.role}
            </p>
            <QuickActions actions={agent.menu} onSelect={handleQuickAction} />
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatMessage
                    message={message}
                    agentName={agent.name}
                    agentIcon={agent.icon}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {agentTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TypingIndicator agentName={agent.name} />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Mensagem para ${agent.name}...`}
              className="max-h-[200px] min-h-[40px] w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Simulate agent response (replace with actual API call)
async function simulateAgentResponse(
  agent: Agent,
  userMessage: string
): Promise<{ content: string; metadata?: Message['metadata'] }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    content: `Obrigado pela sua mensagem! Como ${agent.title}, estou aqui para ajudar. Voce mencionou: "${userMessage}". O que gostaria de fazer a seguir?\n\n**Sugestoes:**\n- Iniciar um novo workflow\n- Revisar artefatos existentes\n- Continuar de onde paramos`,
    metadata: {
      suggestedActions: [
        { label: 'Iniciar Workflow', action: 'start_workflow', primary: true },
        { label: 'Ver Artefatos', action: 'view_artifacts' },
      ],
    },
  };
}
