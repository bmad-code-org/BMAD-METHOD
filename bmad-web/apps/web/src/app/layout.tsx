import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BMAD - Build More, Architect Dreams',
  description:
    'AI-driven agile development framework with 21 specialized agents and 50+ guided workflows',
  keywords: [
    'BMAD',
    'AI',
    'agile',
    'development',
    'agents',
    'workflows',
    'product management',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
