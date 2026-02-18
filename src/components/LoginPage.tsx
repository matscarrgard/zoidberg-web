'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setFormError(message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-ocean-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <span className="text-5xl select-none">🦀</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">Zoidberg</h1>
          <p className="text-sm text-ocean-400">Sign in to chat with your claw-powered AI assistant</p>
        </div>

        {/* Card */}
        <div className="bg-ocean-900/60 border border-ocean-800/60 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ocean-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className="bg-ocean-950/80 border border-ocean-700/40 rounded-xl px-4 py-3 text-white
                           placeholder:text-ocean-500/60 focus:outline-none focus:ring-2
                           focus:ring-zoidberg-500/50 focus:border-zoidberg-500/50
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ocean-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="bg-ocean-950/80 border border-ocean-700/40 rounded-xl px-4 py-3 text-white
                           placeholder:text-ocean-500/60 focus:outline-none focus:ring-2
                           focus:ring-zoidberg-500/50 focus:border-zoidberg-500/50
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              />
            </div>

            {/* Error message */}
            {formError && (
              <p className="text-sm text-zoidberg-400 bg-zoidberg-950/40 border border-zoidberg-800/50 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="mt-1 bg-zoidberg-600 hover:bg-zoidberg-500 disabled:bg-ocean-800
                         disabled:text-ocean-600 text-white rounded-xl px-4 py-3 font-semibold
                         transition-all disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ocean-700 mt-6">(V)(;,,;)(V) Why not Zoidberg?</p>
      </div>
    </main>
  );
}
