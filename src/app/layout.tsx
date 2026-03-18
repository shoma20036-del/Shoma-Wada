import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ES 例文ジェネレーター",
  description: "体験談をSTAR法に沿った自己PR例文に変換するツール",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
