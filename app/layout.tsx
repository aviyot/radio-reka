import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "רדיו רקע אמהרית",
  description: "רדיו רקע אמהרית - שידור חי ותוכניות מוקלטות",
  manifest: "/manifest.json",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
