import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { auth } from '@/auth';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'COINTRAMIN',
    template: '%s · COINTRAMIN',
  },
  description:
    'Gestión de asociados y pagarés (notas administrativas) de COINTRAMIN.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SessionProvider session={session}>
          {children}
          <ToasterProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
