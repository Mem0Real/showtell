import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-base text-white font-sans overflow-hidden'>{children}</body>
    </html>
  );
}
