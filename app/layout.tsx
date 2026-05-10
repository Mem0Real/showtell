import "./globals.css";
import { inter } from "@/lib/fonts";

export const metadata = {
  title: "Show Tell",
  description:
    "A website that takes customers through 3D rendered rooms of hotels they want to book.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-base text-white font-sans relative overflow-x-hidden ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
