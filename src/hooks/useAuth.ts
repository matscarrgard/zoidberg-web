'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
  type SignInInput,
} from 'aws-amplify/auth';

export interface AuthUser {
  username: string;
  email?: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      setUser({ username: current.username, email: attrs.email });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const input: SignInInput = { username: email, password };
      const result = await amplifySignIn(input);
      if (result.isSignedIn) {
        await loadCurrentUser();
      } else {
        throw new Error('Sign-in step not completed: ' + result.nextStep?.signInStep);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-in failed';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, [loadCurrentUser]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await amplifySignOut();
      setUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign-out failed';
      setError(message);
    }
  }, []);

  return { user, isLoading, signIn, signOut, error };
}
