'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [streamingText, setStreamingText] = useState('');
  const [sessionId] = useState(() => `web-${crypto.randomUUID()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

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
    setStreamingText('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

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
          stream: true,
        }),
        signal: controller.signal,
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please sign in again.');
      }

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Request failed (${response.status}): ${errBody}`);
      }

      // Check if we got a streaming response
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // SSE streaming response — parse events
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last potentially incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const event = JSON.parse(data);
                if (event.type === 'response.output_text.delta' && event.delta) {
                  accumulated += event.delta;
                  setStreamingText(accumulated);
                } else if (event.type === 'response.failed') {
                  const errMsg = event.response?.error?.message || 'Response failed';
                  throw new Error(errMsg);
                }
              } catch (e) {
                // Skip malformed JSON lines (not the error we threw above)
                if (e instanceof Error && e.message !== 'Response failed' && !e.message.startsWith('Response failed')) {
                  continue;
                }
                throw e;
              }
            }
          }
        }

        // Finalize: add the complete message
        const finalText = accumulated || 'Zoidberg is speechless! (V)(;,,;)(V)';
        setStreamingText('');
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: finalText,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Non-streaming fallback (JSON response)
        const data = await response.json();
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

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: replyText,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const errorMessage = err instanceof Error ? err.message : 'Connection lost';
      setStreamingText('');
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
      abortRef.current = null;
      setIsLoading(false);
      setStreamingText('');
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
        {/* Streaming message or loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <img
              src="/zoidberg-avatar.jpg"
              alt="Zoidberg"
              className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
            />
            <div className="chat-bubble-assistant w-fit">
              {streamingText ? (
                <p className="text-sm whitespace-pre-wrap">{streamingText}<span className="inline-block w-1.5 h-4 bg-zoidberg-400 ml-0.5 animate-pulse" /></p>
              ) : (
                <div className="flex gap-1.5 items-center py-1">
                  <div className="w-2 h-2 bg-zoidberg-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-zoidberg-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-zoidberg-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
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
