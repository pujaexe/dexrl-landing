import type { Metadata } from "next";
import "./globals.css";
import { StyledComponentsRegistry } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Dexrl — Global crypto settlement, made simple",
  description: "Global crypto settlement platform, made simple",
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
