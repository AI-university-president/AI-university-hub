import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI大学HUB",
  description:
    "AIを試せる・学べる・触れられる体験を一箇所に集約した、AI大学視聴者向けオープンサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.variable} antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
