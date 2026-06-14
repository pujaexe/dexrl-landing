"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Chrome for the /swap and /redeem route segments. Rendered from their shared
 * layouts so it stays mounted while navigating between e.g. /swap and /swap/[tx]
 * — this prevents the scroll-lock + dark background from toggling off/on
 * (which caused a white flash / glitch on navigation).
 *
 * The dark wrapper is server-rendered so the dark background paints on the first
 * frame; the effect also darkens <body> so transitions never reveal the light
 * marketing background.
 */
export function TradePageChrome({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyBg = body.style.background;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.background = "#001B0E";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.background = prevBodyBg;
    };
  }, []);

  return <div style={{ minHeight: "100dvh", background: "#001B0E" }}>{children}</div>;
}

export default TradePageChrome;
