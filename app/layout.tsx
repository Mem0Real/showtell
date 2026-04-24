import './globals.css';
import { inter } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`bg-base text-white font-sans relative ${inter.className}`}>{children}</body>
    </html>
  );
}
