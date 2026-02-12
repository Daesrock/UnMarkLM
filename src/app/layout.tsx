import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unmarklm.com"),
  title: "UnMarkLM — Remove NotebookLM Watermarks",
  description:
    "Free online tool to remove NotebookLM watermarks from infographics, slide decks, and PDFs. 100% client-side, no uploads.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
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
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "UnMarkLM",
                url: "https://unmarklm.com/",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://unmarklm.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "UnMarkLM",
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Web",
                url: "https://unmarklm.com/",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              },
            ]),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
