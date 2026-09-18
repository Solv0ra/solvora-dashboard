import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solvora — On-chain financial intelligence for Ethereum",
  description:
    "Pick an on-chain entity, run financial tools on it, and verify the results on-chain. Balance sheets, cash flow, and more — built on Ethereum.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}