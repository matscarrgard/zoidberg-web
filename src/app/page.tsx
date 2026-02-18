'use client';

import { ChatWindow } from '@/components/ChatWindow';
import { LoginPage } from '@/components/LoginPage';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-ocean-950">
        <div className="flex flex-col items-center gap-4">
          <span className="text-4xl animate-pulse select-none">🦀</span>
          <p className="text-ocean-400 text-sm">Loading…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-ocean-800/50 bg-ocean-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🦀</div>
          <div>
            <h1 className="text-lg font-semibold text-white">Zoidberg</h1>
            <p className="text-sm text-ocean-400">Your claw-powered AI assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.email && (
            <span className="hidden sm:block text-xs text-ocean-500 truncate max-w-[160px]">
              {user.email}
            </span>
          )}
          <button
            onClick={signOut}
            className="text-xs text-ocean-400 hover:text-zoidberg-400 border border-ocean-700/40
                       hover:border-zoidberg-600/50 rounded-lg px-3 py-1.5 transition-all"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Chat */}
      <ChatWindow />
    </main>
  );
}
