import type { Metadata } from 'next';
import { AmplifyProvider } from '@/components/AmplifyProvider';
import './globals.css';

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
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
