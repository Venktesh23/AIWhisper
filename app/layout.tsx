import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import SupabaseProvider from '@/components/supabase-provider'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'API Whisper - Understand APIs Instantly',
  description: 'AI-powered tool to help you understand API schemas in plain English',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <SupabaseProvider>
            <Toaster />
            {children}
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}