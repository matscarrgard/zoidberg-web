'use client';

import { useAuth } from '@/hooks/useAuth';
import { ChatWindow } from '@/components/ChatWindow';
import { LoginForm } from '@/components/LoginForm';

export default function Home() {
  const { user, loading, error, signIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-950">
        <div className="text-center">
          <img
            src="/zoidberg-avatar.jpg"
            alt="Zoidberg"
            className="w-16 h-16 rounded-full mx-auto mb-4 animate-pulse"
          />
          <p className="text-ocean-400">Zoidberg is waking up...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSignIn={signIn} error={error} loading={loading} />;
  }

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-ocean-800/50 bg-ocean-950/80 backdrop-blur-sm">
        <img
          src="/zoidberg-avatar.jpg"
          alt="Zoidberg"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h1 className="text-lg font-semibold text-white">Zoidberg</h1>
          <p className="text-sm text-ocean-400">Your claw-powered AI assistant</p>
        </div>
      </header>

      {/* Chat */}
      <ChatWindow />
    </main>
  );
}
