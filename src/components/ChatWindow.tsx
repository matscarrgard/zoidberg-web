'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, type Message } from './ChatMessage';
import { useAuth } from '@/hooks/useAuth';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://ge9r132tck.execute-api.us-west-2.amazonaws.com';

export function ChatWindow() {
  const { user, signOut, getAccessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Why not Zoidberg? 🦀\n\nI'm your claw-powered AI assistant. Ask me anything — with these claws, I can handle it!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `web-${crypto.randomUUID()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // OpenResponses API format
      const response = await fetch(`${API_GATEWAY_URL}/v1/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: 'openclaw:main',
          input: trimmed,
          user: sessionId,
        }),
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please sign in again.');
      }

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Request failed (${response.status}): ${errBody}`);
      }

      const data = await response.json();

      // Extract text from OpenResponses format
      let replyText = 'Zoidberg is speechless! (V)(;,,;)(V)';
      if (data.output) {
        for (const item of data.output) {
          if (item.type === 'message' && item.content) {
            const texts = item.content
              .filter((c: { type: string }) => c.type === 'output_text')
              .map((c: { text: string }) => c.text);
            if (texts.length > 0) {
              replyText = texts.join('\n');
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection lost';
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `🦀 *The shame!* ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <img
              src="/zoidberg-avatar.jpg"
              alt="Zoidberg"
              className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
            />
            <div className="chat-bubble-assistant w-fit">
              <div className="flex gap-1.5 items-center py-1">
                <div className="w-2 h-2 bg-zoidberg-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zoidberg-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zoidberg-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-ocean-800/50 bg-ocean-950/80 backdrop-blur-sm px-4 py-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Zoidberg..."
            className="chat-input resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="btn-send"
          >
            Send
          </button>
        </div>
        <div className="flex justify-between items-center max-w-4xl mx-auto mt-2">
          <p className="text-xs text-ocean-600">
            Why not Zoidberg? (V)(;,,;)(V)
          </p>
          <button
            onClick={signOut}
            className="text-xs text-ocean-500 hover:text-ocean-300 transition-colors"
          >
            Sign out ({user?.username})
          </button>
        </div>
      </div>
    </div>
  );
}
