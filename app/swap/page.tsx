"use client";

import dynamic from "next/dynamic";

const SwapTrade = dynamic(() => import("@/components/trading/SwapTrade"), { ssr: false });

export default function SwapPage() {
  return <SwapTrade />;
}
