'use client';

import { useState } from 'react';

interface LoginFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

export function LoginForm({ onSignIn, error, loading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignIn(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦀</div>
          <h1 className="text-2xl font-bold text-white">Zoidberg</h1>
          <p className="text-ocean-400 mt-1">Your claw-powered AI assistant</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ocean-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="chat-input"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ocean-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="chat-input"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-zoidberg-400 text-sm bg-zoidberg-950/30 border border-zoidberg-800/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn-send w-full py-3 text-center"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-ocean-600 mt-6">
          Why not Zoidberg? (V)(;,,;)(V)
        </p>
      </div>
    </div>
  );
}
