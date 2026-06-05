import type { Metadata } from "next";
import "./globals.css";
import { StyledComponentsRegistry } from "@/lib/registry";

export const metadata: Metadata = {
  title: "dexRL — Instant cross-border payments. Zero Web3 complexity.",
  description: "dexRL enables instant cross-border stablecoin payments in under 10 minutes at a fraction of traditional bank fees. Self-custodial, non-custodial, built for modern businesses.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
