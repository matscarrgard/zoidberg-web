import type { Metadata } from 'next';
import './globals.css';
import { CognitoProvider } from '@/components/CognitoProvider';

export const metadata: Metadata = {
  title: 'Zoidberg 🦀',
  description: 'Chat with Zoidberg — your claw-powered AI assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <CognitoProvider>{children}</CognitoProvider>
      </body>
    </html>
  );
}
