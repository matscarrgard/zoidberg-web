'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
  type SignInInput,
} from 'aws-amplify/auth';

interface AuthUser {
  username: string;
  userId: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser({
        username: currentUser.username,
        userId: currentUser.userId,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const input: SignInInput = { username: email, password };
      const result = await amplifySignIn(input);
      if (result.isSignedIn) {
        await checkUser();
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setError('Password change required. Please contact admin.');
      } else {
        setError(`Unexpected sign-in step: ${result.nextStep?.signInStep}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch {
      return null;
    }
  };

  return { user, loading, error, signIn, signOut, getAccessToken };
}
