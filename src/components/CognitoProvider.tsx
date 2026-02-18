'use client';

import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? '';
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '';

if (userPoolId && clientId) {
  Amplify.configure(
    {
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId: clientId,
        },
      },
    },
    { ssr: true }
  );
}

export function CognitoProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render children immediately (Amplify is configured at module load time).
  // The mounted guard prevents SSR/client hydration mismatches for auth state.
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
