'use client';

import { useEffect } from 'react';
import '@/lib/amplify-config';

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Amplify.configure is called as a side effect of importing amplify-config
  }, []);

  return <>{children}</>;
}
