import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { NeuralBackground } from "@/components/effects/NeuralBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://spirituals.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Spirituals - 4つの門があなたの精神の秘密を解き明かす",
  description: "心理学・神経科学の知見をもとに開発された精神分析診断。4つの門（心・知・氣・時）のバランスを10秒で診断し、あなたの精神状態を可視化します。",
  keywords: ["精神分析", "心理診断", "スピリチュアル", "メンタルヘルス", "自己診断"],
  authors: [{ name: "Spirituals" }],
  alternates: { canonical: "/" },
  // GSC のHTMLタグ確認用。env に確認トークンを入れると <meta name="google-site-verification"> が出力される。
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  openGraph: {
    title: "Spirituals - 4つの門があなたの精神の秘密を解き明かす",
    description: "心理学・神経科学の知見をもとに開発された精神分析診断。10秒であなたの精神状態を可視化。",
    type: "website",
    locale: "ja_JP",
    siteName: "Spirituals",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spirituals - 4つの門があなたの精神の秘密を解き明かす",
    description: "心理学・神経科学の知見をもとに開発された精神分析診断。10秒であなたの精神状態を可視化。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Spirituals",
        url: BASE_URL,
        inLanguage: "ja-JP",
        description:
          "4つの門（心・知・氣・時）の精神構造を可視化する無料診断。",
      },
      {
        "@type": "Organization",
        name: "Spirituals",
        url: BASE_URL,
      },
    ],
  };
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NeuralBackground />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
