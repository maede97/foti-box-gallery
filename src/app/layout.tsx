import '@/styles/globals.scss';

import { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'foti-box.com',
  description: 'Gallerie',
  icons: '/favicon.ico',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'block',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
});

interface LayoutProperties {
  children: ReactNode;
}

const RootLayout: React.FC<LayoutProperties> = async ({ children }) => {
  return (
    <html className={`${montserrat.className} ${inter.className}`} lang="en">
      <body className="bg-primary text-secondary">
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
