'use client';

import ReactMarkdown from 'react-markdown';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img
          src="/zoidberg-avatar.jpg"
          alt="Zoidberg"
          className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
        />
      )}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-code:text-zoidberg-300 prose-pre:bg-ocean-900/50 prose-pre:border prose-pre:border-ocean-700/30">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
