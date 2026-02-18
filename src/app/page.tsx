import { ChatWindow } from '@/components/ChatWindow';

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-ocean-800/50 bg-ocean-950/80 backdrop-blur-sm">
        <div className="text-3xl">🦀</div>
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
