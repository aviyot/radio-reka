import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "רדיו רקע אמהרית | Radio Reka Amharic",
  description:
    "רדיו רקע אמהרית - שידור חי ותוכניות מוקלטות באמהרית | Radio Reka Amharic - Live Amharic broadcast and recorded programs",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "רדיו",
    "אמהרית",
    "radio",
    "Amharic",
    "Ethiopia",
    "Israel",
    "תוכניות מוקלטות",
    "recorded programs",
    "አማርኛ",
    "Amharic radio",
  ],
  authors: [{ name: "Radio Reka Amharic" }],
  openGraph: {
    title: "רדיו רקע אמהרית | Radio Reka Amharic",
    description: "רדיו רקע אמהרית - שידור חי ותוכניות מוקלטות באמהרית",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NYDVD3ZDS8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NYDVD3ZDS8');
          `}
        </Script>
      </head>
      <body>{children}
        <Analytics />
      </body>
    </html>
  );
}
