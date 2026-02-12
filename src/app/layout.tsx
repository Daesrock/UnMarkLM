import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnMarkLM — Remove NotebookLM Watermarks",
  description:
    "Free online tool to remove NotebookLM watermarks from infographics, slide decks, and PDFs. 100% client-side, no uploads.",
  keywords: [
    "NotebookLM",
    "watermark remover",
    "remove watermark",
    "infographic",
    "slide deck",
    "PDF",
    "free",
    "open source",
    "client-side",
  ],
  authors: [{ name: "UnMarkLM" }],
  openGraph: {
    title: "UnMarkLM — Remove NotebookLM Watermarks",
    description:
      "Clean your infographics, slide decks, and PDFs instantly. 100% free, 100% private — your files never leave your device.",
    url: "https://unmarklm.com",
    siteName: "UnMarkLM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnMarkLM — Remove NotebookLM Watermarks",
    description:
      "Clean your infographics, slide decks, and PDFs instantly. 100% free, 100% private.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
